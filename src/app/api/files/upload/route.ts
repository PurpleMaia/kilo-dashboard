import { NextResponse } from 'next/server';
import { db } from '../../../../../db/kysely/client';
import { cookies } from 'next/headers';
import { validateSessionToken } from '@/lib/auth/utils';
import { Category } from '../../../../../db/generated';
import { getAinaID, getUserID } from '@/lib/server-utils';

interface CSVRow {
  [key: string]: string | number;
}

interface UploadFile {
  fileName: string;
  landID: string;
  sensorID: string;
  data: CSVRow[];
  headers: string[];
  sensorInfo?: { sensorID?: string, location?: string, region?: string };
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const sessionCookie = (await cookies()).get('auth_session');
    console.log(sessionCookie)
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionValidation = await validateSessionToken(sessionCookie.value);
    if (!sessionValidation.user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Parse JSON data from request body
    const files: UploadFile[] = await request.json();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }
    console.log(`[upload] files.length = ${files.length}`)
    
    const results = [];

    // Process each row and insert into database
    for (const file of files) {      
        let processedRows = 0;
        let errors = 0;

        // Prepare and assign mappings to metric types, units, categories by looking at header naming convention
        console.log('[upload] headers:', file.headers)    

        //build mapping table of headers to metric_type_id
        const mappings = await getMetricMapping(file.headers.slice(1))

        const timeHeader = file.headers.find(h => h.toLowerCase().includes('time'))
        const locationHeader = file.headers.find(h => h.toLowerCase().includes('location'))
        if (!timeHeader) {
          throw new Error('No timestamp column found in headers')
        }
        if (!locationHeader) {
          throw new Error('No location column found in headers')
        }       

        console.log('[upload]', 'file.sensorInfo:', file.sensorInfo)
        const sensorID = await getSensorID(file, file.sensorInfo || {})     
        const latestTimestamp = await getLatestTimestamp(file.data[0][timeHeader], file.data[1][timeHeader].valueOf(), sensorID)   
        const time_unit = file.data[0][timeHeader].toString().split('_')[2]
        console.log('[upload] latestTimestamp:', latestTimestamp) 

        for (const row of file.data.slice(1)) {          // adding slice to get rid of redundant header declaration
          console.log('[upload] processing row:', row)
          // Convert timestamp            
          const rawTS = row[timeHeader]
          const location = row[locationHeader]
          const timestamp = formatTime(latestTimestamp || null, String(rawTS), time_unit);   
          const malaID = await getOrCreateMalaId(location as string)        

          const metricColumns = Object.entries(row).filter(([column]) => 
            column !== timeHeader && column !== locationHeader
          );
          // Process each metric column incase of numerous readings from one sensor (excluding _row & timestamp)
          for (const [column, value] of metricColumns) {
            const metricValue = parseFloat(value as string)
            if (isNaN(metricValue)) {
              errors++
              continue
            }
            console.log(`[upload] ${column} -> metric_type ${mappings[column].metrictype_id}`)

            console.log('[upload] inserting metric:', {
              value: metricValue,
              timestamp: timestamp,
              // unit: unit,
              metric_type: mappings[column].metrictype_id,
              // category: mappings.category_id,    
              sensor_id: sensorID,
              mala_id: malaID
            })

            const inserted = await db
            .insertInto('metric')
            .values({
              value: metricValue,
              timestamp: timestamp,
              // unit: unit,
              metric_type: mappings[column].metrictype_id,
              // category: mappings.category_id,    
              sensor_id: sensorID,
              mala_id: malaID
            })
            .onConflict((oc) => oc.columns(['sensor_id', 'metric_type', 'mala_id', 'timestamp']).doNothing()) // avoid duplicate entries                
            .returning('id')
            .executeTakeFirst();

            if (!inserted?.id) {
              console.error('[upload] Failed to insert metric, possible duplicate or error')
            } else {
              console.log('[upload] Successfully inserted metric with ID:', inserted.id)
            }

            processedRows++;
            }
        }

        results.push({
          fileName: file.fileName,
          success: true,
          processedRows,
          errors,
          message: `Successfully processed ${processedRows} metrics with ${errors} errors`
        });

      } 
    return NextResponse.json({
      success: true,
      summary: {
        totalFiles: files.length,
        successfulFiles: results.filter(r => r.success).length,
        failedFiles: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

interface Mapping {
  metrictype_id: number | undefined
}
interface Mappings {
    [header: string]: Mapping,
}
async function getMetricMapping(headers: string[]): Promise<Mappings> {
    const mappings: Mappings = {};
    for (const header of headers) {
      const [categoryHeader, metric, unit] = header.split('_');

      console.log('[upload][getMetricMapping]', header, '->', categoryHeader, metric, unit)
      const existingMetricType = await db
      .selectFrom('metric_type')
      .select(['id', 'type_name'])
      .where('type_name', '=', metric)
      .executeTakeFirst();

      const category: Category = categoryHeader as Category

        if (existingMetricType) {
            console.log('[upload][getMetricMapping] found existing metric type:', `(${existingMetricType.id}) ${existingMetricType.type_name}`)
            mappings[header] = {
                metrictype_id: existingMetricType.id,
            };
        } else {
            console.log('[upload][getMetricMapping] could not find existing metric type, inserting into db...')
            const inserted = await db.insertInto('metric_type')
                .values({
                    type_name: metric,
                    unit: unit,
                    category: category
                })
                .returning(['id', 'type_name'])
                .executeTakeFirst();
            mappings[header] = {
                metrictype_id: inserted?.id,
            };
        }
    }
    return mappings;
}

async function getSensorID(file: UploadFile, sensorInfo: { sensorID?: string, region?: string }): Promise<number> {
  if (!sensorInfo.sensorID) {
    throw new Error('Sensor ID missing in sensorInfo');
  }

  // Try to find existing sensor by serial
  const existingSensor = await db
    .selectFrom('sensor')
    .select(['id', 'name'])
    .where('name', '=', sensorInfo.sensorID)
    .executeTakeFirst();

  if (existingSensor) {
    console.log(`[upload][getSensorID] found existing sensor: (${existingSensor.id}) ${existingSensor.name}`)
    return existingSensor.id;
  }

  console.log('[upload][getSensorID] could not find existing sensor, inserting into db...')
  // Insert new sensor
  const inserted = await db.insertInto('sensor')
    .values({
      name: sensorInfo.sensorID,
      serial: sensorInfo.sensorID,
    })
    .returning('id')
    .executeTakeFirst();

  if (!inserted?.id) {
    throw new Error('Failed to insert new sensor');
  }
  return inserted.id;
}

async function getOrCreateMalaId(location: string): Promise<number> {
  // Try to find existing mala
  const existingMala = await db
    .selectFrom('mala')
    .select(['id', 'name'])
    .where('name', '=', location)
    .executeTakeFirst();

  if (existingMala) {
    console.log(`[upload][getOrCreateMalaId] found existing mala: (${existingMala.id}) ${existingMala.name}`)
    return existingMala.id;
  }

  // Insert new mala
  console.log(`[upload][getOrCreateMalaId] creating new mala for location: ${location}`)
  const userID = await getUserID()
  const ainaID = await getAinaID(userID) 
  const insertedMala = await db.insertInto('mala')
    .values({
      name: location,
      created_at: new Date(),
      aina_id: ainaID // test for now
    })
    .returning('id')
    .executeTakeFirst();

  if (!insertedMala?.id) {
    throw new Error(`Failed to insert new mala for location: ${location}`);
  }
  return insertedMala.id;
}

// convert ms units of time given, to a Date object from latest timestamp
function formatTime(latestTimestamp: Date | null, elapsedTimeStr: string, time_unit: string) {
  const elapsedTime = Number(elapsedTimeStr)
  if (!latestTimestamp) {
    return new Date(elapsedTime) // or handle null case as needed
  }

  if (time_unit === "date") // convert the string from the csv to a Date object
  { 
    const [month, day] = elapsedTimeStr.split('/').map(Number)
    const thisYear = (latestTimestamp || new Date()).getFullYear();
    const csvDate = new Date(thisYear, month - 1, day)
    const diff = csvDate.getTime() - latestTimestamp.getTime()

    return new Date(latestTimestamp.getTime() + diff)
  } else if (time_unit === "h") {
    return new Date(latestTimestamp.getTime() + elapsedTime * 1000 * 60 * 60)
  } else if (time_unit === "s") 
  {
    return new Date(latestTimestamp.getTime() + elapsedTime * 1000);
  } else if (time_unit === "ms") 
  {
    return new Date(latestTimestamp.getTime() + elapsedTime)
  }
}


async function getLatestTimestamp(header: string | number, topRowTimestamp: string | number, sensorID: number) {

  console.log('[upload][getLatestTimestamp] header:', header)

  const time_unit = String(header).split('_')[2]
  console.log('[upload][getLatestTimestamp] unit of time:', time_unit)

  const latest = await db
    .selectFrom('metric')
    .select('timestamp')
    .orderBy('timestamp', 'desc')
    .where('sensor_id', '=', sensorID)
    .limit(1)
    .executeTakeFirst()

  console.log('[upload][getLatestTimestamp] db result:', latest)

  const latestTimestamp: Date | undefined = latest?.timestamp ? new Date(latest.timestamp) : undefined

  if (latestTimestamp) {
    return latestTimestamp
  } else {
    // use the topRowTimestamp as the latestTimestamp
    console.log('[upload][getLatestTimestamp] using top row timestamp as latestTimestamp')
    console.log('[upload][getLatestTimestamp] top row time in getlatestTimestamp():', topRowTimestamp)

    if (time_unit === "date") // convert the string from the csv to a Date object
    { 
      const [month, day] = String(topRowTimestamp).split('/').map(Number)
      const thisYear = (latestTimestamp || new Date()).getFullYear();
      const csvDate = new Date(thisYear, month - 1, day)
      return csvDate
    } else if (time_unit === "h") {
      return new Date(Number(topRowTimestamp) * 1000 * 60 * 60)
    } else if (time_unit === "s") 
    {
      return new Date(Number(topRowTimestamp) * 1000);
    } else if (time_unit === "ms") 
    {
      return new Date(Number(topRowTimestamp))
    }
  }
}
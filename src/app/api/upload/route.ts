import { NextResponse } from 'next/server';
import { db } from '../../../../db/kysely/client';
import { cookies } from 'next/headers';
import { validateSessionToken } from '@/app/lib/auth';
import { Category } from '../../../../db/generated';

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
    console.log(`files.length = ${files.length}`)
    
    const results = [];

    for (const file of files) {      
        // Process each row and insert into database
        let processedRows = 0;
        let errors = 0;

        // Prepare and assign mappings to metric types, units, categories in each header
        console.log('headers:', file.headers)    
        const mappings = await getMetricMapping(file.headers.slice(1))
        console.log(JSON.stringify(mappings))

        const timeHeader = file.headers.find(h => h.toLowerCase().includes('time'))
        if (!timeHeader) {
          throw new Error('No timestamp column found in headers')
        }
        const sensorID = await getSensorID(file, file.sensorInfo || {})

        // get latest timestamp from database of this sensor (TODO "of this sensor")
        const [latestTimeRow] = await db
            .selectFrom('metric')
            .select('timestamp')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .execute()
        const latestTimestamp = latestTimeRow.timestamp
        
        for (const row of file.data) {          

          // Convert timestamp            
          const rawTS = row[timeHeader]
          let timestamp: Date;
          if (typeof rawTS === 'number' || (typeof rawTS === 'string' && !isNaN(Number(rawTS)))) {
            // Numeric: treat as elapsed time
            timestamp = formatTime(latestTimestamp ?? new Date(), String(rawTS));
          } else if (typeof rawTS === 'string' && !isNaN(Date.parse(rawTS))) {
            // Valid date string
            timestamp = new Date(rawTS);
          } else {
            errors++;
            continue;
          }
          // console.log('latestTimestamp', latestTimestamp)
          // console.log('This row\'s timestamp', timestamp)

          // Process each metric column (excluding _row & timestamp)
          for (const [column, value] of Object.entries(row).slice(2)) {
            const metricValue = parseFloat(value as string)
            if (isNaN(metricValue)) {
              errors++
              continue
            }
            
            await db
            .insertInto('metric')
            .values({
              value: metricValue,
              timestamp: timestamp,
              // unit: unit,
              metric_type: mappings[column].metrictype_id,
              // category: mappings.category_id,    
              sensor_id: sensorID
            })
            .execute();
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

      console.log(categoryHeader, metric, unit)
      const existingMetricType = await db
      .selectFrom('metric_type')
      .select(['id', 'type_name'])
      .where('type_name', '=', metric)
      .executeTakeFirst();

      const category: Category = categoryHeader as Category

        if (existingMetricType) {
            mappings[header] = {
                metrictype_id: existingMetricType.id,
            };
        } else {
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

async function getSensorID(file: UploadFile, sensorInfo: { sensorID?: string, location?: string, region?: string }): Promise<number> {
  if (!sensorInfo.sensorID) {
    throw new Error('Sensor ID missing in sensorInfo');
  }
  // Try to find existing sensor by serial
  const existingSensor = await db
    .selectFrom('sensor')
    .select('id')
    .where('serial', '=', sensorInfo.sensorID)
    .executeTakeFirst();

  if (existingSensor) {
    return existingSensor.id;
  }

  // Try to find mala_id by location (case-insensitive)
  let malaId: number | null = null;
  if (sensorInfo.location) {
    let mala = await db
      .selectFrom('mala')
      .select('id')
      .where('name', '=', sensorInfo.location)
      .executeTakeFirst();
    if (mala) {
      malaId = mala.id;
    } else {
      // Insert new mala
      const insertedMala = await db.insertInto('mala')
        .values({
          name: sensorInfo.location,
          created_at: new Date(),
          aina_id: 1 // test for now
        })
        .returning('id')
        .executeTakeFirst();
      if (!insertedMala?.id) {
        throw new Error('Failed to insert new mala');
      }
      malaId = insertedMala.id;
    }
  }

  // Insert new sensor
  const inserted = await db.insertInto('sensor')
    .values({
      name: sensorInfo.sensorID,
      serial: sensorInfo.sensorID,
      mala_id: malaId
    })
    .returning('id')
    .executeTakeFirst();

  if (!inserted?.id) {
    throw new Error('Failed to insert new sensor');
  }
  return inserted.id;
}

// convert ms units of time given, to a Date object from latest timestamp
function formatTime(latestTimestamp: Date, elapsedTimeStr: string) {
  const elapsedTime = Number(elapsedTimeStr);
  const newTimestamp = new Date(latestTimestamp.getTime() + elapsedTime);
  return newTimestamp
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[()]/g, "") //g is for global search
}
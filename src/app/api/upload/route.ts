import { NextResponse } from 'next/server';
import { db } from '../../../../db/kysely/client';
import { cookies } from 'next/headers';
import { validateSessionToken } from '@/app/lib/auth';

interface CSVRow {
  [key: string]: string | number;
  timestamp: string;
}

interface UploadFile {
  fileName: string;
  landID: string;
  sensorID: string;
  data: CSVRow[];
  headers: string[];
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
    console.log(JSON.stringify(files))

    
    const results = [];

    for (const file of files) {
      try {
        // Process each row and insert into database
        let processedRows = 0;
        let errors = 0;

        // Prepare and assign mappings to metric types, units, categories in each header
        console.log(file.headers)        
        let mappings
        for (const header of file.headers) {
            const metricParts = header.split('_');
            const category = metricParts[0];
            const metric = metricParts[1];
            const unit = metricParts[2];
            mappings = await getMetricMapping(category, metric)
        }

        if (!mappings) {
            results.push({
                fileName: file.fileName,
                success: false,
                error: 'No valid metric headers found (format: category_metric_unit)'
            });
            continue;
        }
        

        for (const row of file.data) {
          try {
            // Get timestamp
            const timestamp = new Date(row.timestamp);
            if (isNaN(timestamp.getTime())) {
              errors++;
              continue;
            }

            // Process each metric column (excluding timestamp)
            for (const [column, value] of Object.entries(row)) {
              if (column.toLowerCase() === 'timestamp') continue;

              // Convert value to number
              const numericValue = parseFloat(value as string);
              if (isNaN(numericValue)) {
                errors++;
                continue;
              }

              // Insert into database
              await db
                .insertInto('metric')
                .values({
                  value: numericValue,
                  timestamp: timestamp,
                //   unit: unit,
                  metric_type: mappings.metrictype_id, // You might want to map this to a metric_types table
                  category: mappings.category_id,    // You might want to map this to a categories table
                  sensor_id: parseInt(file.sensorID)
                })
                .execute();

              processedRows++;
            }
          } catch (rowError) {
            errors++;
            console.error(`Error processing row in ${file.fileName}:`, rowError);
          }
        }

        results.push({
          fileName: file.fileName,
          success: true,
          processedRows,
          errors,
          message: `Successfully processed ${processedRows} metrics with ${errors} errors`
        });

      } catch (fileError) {
        results.push({
          fileName: file.fileName,
          success: false,
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
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

interface Mappings {
    metrictype_id: number | undefined,
    category_id: number | undefined,
}

async function getMetricMapping(categoryFromHeader: string, metricFromHeader: string): Promise<Mappings> {
    const existingMetricType = await db
        .selectFrom('metric_type')
        .select(['id', 'type_name'])
        .where('type_name', '=', metricFromHeader)
        .executeTakeFirst();

    const findCategory = await db
        .selectFrom('category')
        .select(['id', 'category_name'])
        .where('category_name', '=', categoryFromHeader)
        .executeTakeFirst();
        
    if (existingMetricType) {
        return {
            metrictype_id: existingMetricType.id,
            category_id: findCategory?.id
        }
    } else {
        const inserted = await db.insertInto('metric_type')
            .values([metricFromHeader, findCategory?.id])
            .returning(['id', 'type_name'])
            .executeTakeFirst()
        return {
            metrictype_id: inserted?.id,
            category_id: findCategory?.id
        }
    }
}
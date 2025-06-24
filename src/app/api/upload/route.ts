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
      try {
        if (!file.data || file.data.length === 0) {
          results.push({
            fileName: file.fileName,
            success: false,
            error: 'No data found in file'
          });
          continue;
        }

        // Get headers from first row
        const headers = Object.keys(file.data[0]);
        
        // Validate required columns
        if (!headers.some(h => h.toLowerCase().includes('timestamp'))) {
          results.push({
            fileName: file.fileName,
            success: false,
            error: 'CSV must contain a timestamp column'
          });
          continue;
        }

        // Process each row and insert into database
        let processedRows = 0;
        let errors = 0;

        for (const row of file.data) {
          try {
            // Parse timestamp
            const timestamp = new Date(row.timestamp);
            if (isNaN(timestamp.getTime())) {
              errors++;
              continue;
            }

            // Process each metric column (excluding timestamp)
            for (const [column, value] of Object.entries(row)) {
              if (column.toLowerCase() === 'timestamp') continue;
              
              // Parse metric name (format: category_metric_unit)
              const metricParts = column.split('_');
              if (metricParts.length < 3) {
                errors++;
                continue;
              }

              const category = metricParts[0];
              const metric = metricParts[1];
              const unit = metricParts[2];

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
                  metric_type: 1, // You might want to map this to a metric_types table
                  category: 1,    // You might want to map this to a categories table
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
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/app/ui/card"
import { useState } from "react"
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline"
// interface AgTestFile {
//   id: number;
//   test_type: string;
//   file_name: string;
//   file_size: number;
//   mime_type: string;
//   uploaded_at: string;
// }

export function RecentTests() {
    const [recentTests] = useState<Array<{id: string; type: string; location: string; date: string}>>([])

    // const handleFilePreview = (file: AgTestFile) => {
    //   if (file.mime_type === 'application/pdf') {
    //     setPreviewFile(file);
    //   } else {
    //     // For non-PDF files, download them
    //     window.open(`/api/ag-test-upload/${file.id}`, '_blank');
    //   }
    // }
    
    return (
        <>
        {/* Recent Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-green-600" />
              Recent Samples Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{test.type}</h3>
                        
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {test.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {test.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </>
    )
}
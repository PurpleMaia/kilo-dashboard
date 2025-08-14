'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge";
import { useLatestSensorData } from "@/hooks/use-data";

export default function LatestFetch() {
    const {data: latest, isLoading, error} = useLatestSensorData()

    return (
        <>
        {/* Current Status */}
        {error ? (
          <>
            <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-700">
              {error.message}
            </div>
          </>
        ) : (
          <>
            <Card className="lg:col-span-2 bg-white border-gray-200 shadow-md p-4 touch-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CircleStackIcon className="h-5 w-5 text-blue-600" />
                    System Status
                  </CardTitle>            
                </div>
              </CardHeader>
              <CardContent>
                { isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{latest?.count}</div>
                      <div className="text-sm text-slate-600">Active Sensors</div>
                      <Badge className="mt-1 bg-green-100 text-green-800">All Online</Badge>
                    </div>              
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{latest?.timestamp?.toLocaleDateString()}</div>
                      <div className="text-sm text-slate-600">Last Upload</div>
                      <Badge className="mt-1 bg-gray-100 text-gray-800">{latest?.timeDiff} days ago</Badge>
                    </div>              
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Recent Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Fetches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFetches.map((fetch, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(fetch.status)}
                    <span className="font-mono">{fetch.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">{fetch.records} records</span>
                    <Badge variant="outline" className="text-xs">
                      {fetch.duration}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
        </>
    )
}
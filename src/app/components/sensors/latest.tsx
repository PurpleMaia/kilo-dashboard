'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { Badge } from "@/app/ui/badge";
import { useEffect, useState } from 'react';

export default function LatestFetch() {
    const [loading, setLoading] = useState<boolean>(false)
    const [sensorCount, setSensorCount] = useState(0);
    const [latestFetch, setLatestFetch] = useState<Date>();
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/sensors/latest');
                const data = await response.json();
                setSensorCount(data.sensorCount.count); 
                setLatestFetch(new Date(data.latestFetch.timestamp))                

                const diffMS = new Date().getTime() - (new Date(data.latestFetch.timestamp).getTime() || 0);
                setDiff(Math.floor(diffMS / (1000 * 60 * 60 * 24)));
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            } finally {
              setLoading(false)
            }
        };

        fetchData();
    }, []);

    return (
        <>
        {/* Current Status */}
        <Card className="lg:col-span-2 bg-white border-gray-200 shadow-md p-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CircleStackIcon className="h-5 w-5 text-blue-600" />
                System Status
              </CardTitle>
              {/* <Button 
                // onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Refresh
              </Button> */}
            </div>
          </CardHeader>
          <CardContent>
            { loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{sensorCount}</div>
                  <div className="text-sm text-slate-600">Active Sensors</div>
                  <Badge className="mt-1 bg-green-100 text-green-800">All Online</Badge>
                </div>              
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{latestFetch?.toLocaleDateString()}</div>
                  <div className="text-sm text-slate-600">Last Upload</div>
                  <Badge className="mt-1 bg-gray-100 text-gray-800">{diff} days ago</Badge>
                </div>              
              </div>
            )}
          </CardContent>
        </Card>

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
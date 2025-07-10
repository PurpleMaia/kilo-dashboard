import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { db } from "../../../../db/kysely/client";
import { getAinaID, getUserID } from "@/app/lib/server-utils";
import { sql } from 'kysely';
import { Badge } from "@/app/ui/badge";

export default async function LatestFetch() {
    const userID = await getUserID()
    const ainaID = await getAinaID(userID)

    const sensorCount = await db
    .selectFrom('sensor as s')
    .innerJoin('sensor_mala as sm', 's.id', 'sm.sensor_id')
    .innerJoin('mala as m', 'm.id', 'sm.mala_id')
    .innerJoin('aina as a', 'a.id', 'm.aina_id')
    .select(sql<number>`COUNT(DISTINCT s.name)`.as('count'))
    .where('a.id', '=', ainaID)
    .executeTakeFirstOrThrow();

    const latestFetch = await db
    .selectFrom('metric as m')
    .select('m.timestamp')
    .innerJoin('sensor_mala as sm', 'sm.sensor_id', 'm.sensor_id')
    .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
    .innerJoin('aina as a', 'a.id', 'ma.aina_id')
    .where('a.id', '=', ainaID)
    .orderBy('m.timestamp desc')
    .limit(1)
    .executeTakeFirstOrThrow()

    const diffMS = new Date().getTime() - (latestFetch.timestamp?.getTime() || 0);
    const diff = Math.floor(diffMS / (1000 * 60 * 60 * 24))

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sensorCount.count}</div>
                <div className="text-sm text-slate-600">Active Sensors</div>
                <Badge className="mt-1 bg-green-100 text-green-800">All Online</Badge>
              </div>              
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{latestFetch.timestamp?.toLocaleDateString()}</div>
                <div className="text-sm text-slate-600">Last Upload</div>
                <Badge className="mt-1 bg-gray-100 text-gray-800">{diff} days ago</Badge>
              </div>              
            </div>
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
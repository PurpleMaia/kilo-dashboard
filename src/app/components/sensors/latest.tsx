import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { ArrowPathIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { db } from "../../../../db/kysely/client";
import { getAinaID, getUserID } from "@/app/lib/server-utils";
import { Button } from "@/app/ui/button";

export default async function LatestFetch() {
    const userID = await getUserID()
    const ainaID = await getAinaID(userID)
    const sensorCount = await db
      .selectFrom('sensor')
      .innerJoin('mala as m', 'sensor.mala_id', 'm.id')
      .innerJoin('aina as a', 'm.aina_id', 'a.id')
      .select(db.fn.count<number>('sensor.id').as('total'))
      .where('a.id', '=', ainaID)
      .executeTakeFirstOrThrow()

    return (
        <>
        <div className="h-full overflow-y-auto pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Status */}
            <Card className="lg:col-span-2 bg-white border-gray-200 shadow-md p-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CircleStackIcon className="h-5 w-5 text-blue-600" />
                    Data Sync Status
                  </CardTitle>
                  <Button 
                    // onClick={handleRefresh}
                    className="flex items-center gap-2"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{sensorCount.total}</div>
                    <div className="text-sm text-slate-600">Active Sensors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{24}</div>
                    <div className="text-sm text-slate-600">Records Updated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">2 minutes ago</div>
                    <div className="text-sm text-slate-600">Last Fetch</div>
                  </div>
                  {/* <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{fetchStatus.nextFetch}</div>
                    <div className="text-sm text-slate-600">Next Fetch</div>
                  </div> */}
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
          </div>
        </div>
        </>
    )
}
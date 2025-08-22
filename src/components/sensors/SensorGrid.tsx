'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Activity, Droplets, Thermometer, Zap, Wind, Eye } from "lucide-react";
import { useSensorsData } from "@/hooks/use-data";

export function SensorGrid() {
    const { data } = useSensorsData()

      const getCategoryColor = (status: string) => {
        switch (status) {
          case "water": return "bg-blue-100 text-blue-800";
          case "soil": return "bg-amber-100 text-amber-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">      

          {data?.sensors && (
            <>          
              {data?.sensors.map((sensor) => {                
                return (
                  <Card key={sensor.id} className="relative border-gray-300 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="justify-begin">
                            <CardTitle className="text-base flex items-center gap-2">
                            {sensor.name}
                            </CardTitle>
                            <div className="flex gap-2">
                                <p className="font-bold">Type:</p>
                                {sensor.typeName}
                            </div>
                        </div>
                        <Badge className={getCategoryColor(sensor.category)}>
                            {sensor.category}
                        </Badge>

                        
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <p className="font-bold">Locations: </p>
                        <p>{sensor.locations}</p>
                    </CardContent>
                    
                  </Card>
                );
              })}
            </>
          )}             
        </div>
      );
}

'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { Badge } from "@/app/ui/badge";
import { Activity, Droplets, Thermometer, Zap, Wind, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface Sensor {
    id: number,
    name: string,
    typeName: string,
    unit: string,
    category: string,
    latestValue: number,
    latestTimestamp: string
}

export function SensorGrid() {
    const [sensors, setSensors] = useState<Sensor[]>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/sensors/latestWithValues');
                const data = await response.json();
                console.log(data.sensors)
                setSensors(data.sensors)              
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        fetchData()
    }, [])

    if (!sensors || !Array.isArray(sensors)) {
        return <div>Loading...</div>;
      }

      const getCategoryColor = (status: string) => {
        switch (status) {
          case "water": return "bg-blue-100 text-blue-800";
          case "soil": return "bg-green-100 text-green-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">                   
          {sensors.map((sensor) => {
            // const Icon = sensor.icon;
            
            return (
              <Card key={sensor.id} className="relative border-gray-300 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="justify-begin">
                        <CardTitle className="text-base flex items-center gap-2">
                        {sensor.name}
                        </CardTitle>
                        <div className="">
                            Type: {sensor.typeName}
                        </div>
                    </div>
                    <Badge className={getCategoryColor(sensor.category)}>
                        {sensor.category}
                    </Badge>

                    
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900">
                        {sensor.latestValue}
                      </div>
                      <div className="text-sm text-slate-600">{sensor.unit}</div>
                    </div>                                        
                    
                    <div className="text-xs text-slate-500 text-center">
                        Last update: {new Date(sensor.latestTimestamp).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
}

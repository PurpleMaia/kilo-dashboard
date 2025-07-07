import { useEffect, useState } from "react";

export interface Sensor {
  id: string;
  type: string;
  name: string;
  deployed: boolean;
  site: string;
  location: string;
  latitude: number;
  longitude: number;
}

export function useDeployedSensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sensors");
      if (stored) {
        setSensors(JSON.parse(stored));
      }
    }
  }, []);

  return sensors.filter(s => s.deployed);
}

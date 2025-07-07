"use client";
import React from "react";
import Card from "@/app/components/dashboard/Card";
import { useDeployedSensors } from "./useDeployedSensors";

export default function SensorDataPanel() {
  const sensors = useDeployedSensors();
  return (
    <Card title="Sensor Data">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Site</th>
              <th className="py-2 px-4 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map(sensor => (
              <tr key={sensor.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{sensor.name}</td>
                <td className="py-2 px-4">{sensor.type}</td>
                <td className="py-2 px-4">{sensor.site}</td>
                <td className="py-2 px-4">{sensor.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

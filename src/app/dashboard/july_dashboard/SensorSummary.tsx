"use client";
import React from "react";
import Card from "@/app/components/dashboard/Card";
import { useDeployedSensors } from "./useDeployedSensors";

export default function SensorSummary() {
  const sensors = useDeployedSensors();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card title="Sensor Summary">
        <div className="mb-4">
          <span className="font-bold text-lg">{sensors.length}</span> sensors deployed
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Deployment Info</th>
                <th className="py-2 px-4 border-b text-left">Measuring</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((sensor) => (
                <tr key={sensor.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">{sensor.name}</td>
                  <td className="py-2 px-4">{sensor.site} / {sensor.location}</td>
                  <td className="py-2 px-4">{sensor.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


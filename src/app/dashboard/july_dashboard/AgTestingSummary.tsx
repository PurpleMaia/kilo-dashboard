"use client";
import React from "react";
import Card from "@/app/components/dashboard/Card";

// Example ag test data
const agTests = [
  {
    name: "Patch 1",
    nutrients: [
      { nutrient: "Nitrogen (N)", status: "high" },
      { nutrient: "Phosphorus (P)", status: "ok" },
      { nutrient: "Potassium (K)", status: "low" },
      { nutrient: "Calcium (Ca)", status: "ok" },
      { nutrient: "Magnesium (Mg)", status: "low" },
    ],
  },
  {
    name: "Patch 2",
    nutrients: [
      { nutrient: "Nitrogen (N)", status: "ok" },
      { nutrient: "Phosphorus (P)", status: "ok" },
      { nutrient: "Potassium (K)", status: "ok" },
      { nutrient: "Calcium (Ca)", status: "high" },
      { nutrient: "Magnesium (Mg)", status: "ok" },
    ],
  },
  {
    name: "Patch 3",
    nutrients: [
      { nutrient: "Nitrogen (N)", status: "low" },
      { nutrient: "Phosphorus (P)", status: "low" },
      { nutrient: "Potassium (K)", status: "ok" },
      { nutrient: "Calcium (Ca)", status: "ok" },
      { nutrient: "Magnesium (Mg)", status: "ok" },
    ],
  },
];

export default function AgTestingSummary() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <Card title="Ag Testing Summary (Things to Watch)">
        <div className="space-y-4">
          {agTests.map((test) => {
            const watchNutrients = test.nutrients.filter(
              (n) => n.status === "high" || n.status === "low"
            );
            if (watchNutrients.length === 0) return null;
            return (
              <div key={test.name}>
                <div className="font-semibold text-gray-700 mb-1">{test.name}</div>
                <ul className="list-disc ml-6">
                  {watchNutrients.map((n) => (
                    <li key={n.nutrient} className={
                      n.status === "high"
                        ? "text-red-600"
                        : "text-blue-600"
                    }>
                      {n.nutrient}: <span className="font-bold uppercase">{n.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

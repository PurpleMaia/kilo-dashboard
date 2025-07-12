'use client'
import { Card, CardContent } from "@/app/ui/card";
import { useState } from 'react'
import { MessageCircle, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface Observation {
  id: number;
  time: string;
  observer: string;
  rating: number;
  observation: string;
  category: string;
  mood: string;
}

export default function KiloNotes() {
  const [expandedObservations, setExpandedObservations] = useState<Set<number>>(new Set());

    // Mock qualitative observations
  const observations: Observation[] = [
    {
      id: 1,
      time: "2 hours ago",
      observer: "Field Manager",
      rating: 4,
      observation: "Plants showing excellent growth, leaves vibrant green. The recent rainfall has significantly improved soil moisture levels across the entire field. We're seeing consistent growth patterns that indicate optimal growing conditions. The new irrigation system is working perfectly, and we expect a bumper harvest this season.",
      category: "Plant Health",
      mood: "Optimistic"
    },
    {
      id: 2,
      time: "4 hours ago",
      observer: "Soil Specialist",
      rating: 3,
      observation: "Soil moisture feels slightly low in southeast section. Need to investigate the irrigation system in that area. The soil texture is good but could benefit from additional organic matter.",
      category: "Soil Condition",
      mood: "Concerned"
    },
    {
      id: 3,
      time: "6 hours ago",
      observer: "Weather Observer",
      rating: 5,
      observation: "Perfect growing conditions, gentle breeze, optimal humidity. Temperature is ideal for crop development.",
      category: "Environment",
      mood: "Excellent"
    }
  ];

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedObservations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedObservations(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

    return (
    <Card className="h-full border-gray-300 bg-white">
      <CardContent className="h-full py-4">
        <div className="space-y-4 h-full overflow-y-auto touch-pan-y">
                {observations.map((obs) => (
                    <div key={obs.id} className="border-l-4 border-purple-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                        </div>
                    </div>
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  {expandedObservations.has(obs.id) 
                    ? obs.observation 
                    : truncateText(obs.observation)
                  }
                </p>
                {obs.observation.length > 100 && (
                  <button
                    onClick={() => toggleExpanded(obs.id)}
                    className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-1"
                  >
                    {expandedObservations.has(obs.id) ? (
                      <>
                        <ChevronUpIcon className="h-3 w-3" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="h-3 w-3" />
                        View more
                      </>
                    )}
                  </button>
                )}
              </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MessageCircle className="h-3 w-3" />
                        <span>{obs.observer} • {obs.time}</span>
                    </div>
                    </div>
                ))} 
                </div>
            </CardContent>
        </Card>
    )
}
'use client'
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from 'react'
import { MessageCircle, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface Observation {
  id: number;
  username: string;
  timestamp: Date;
  observation: string;
}

export default function KiloNotes() {
  const [expandedObservations, setExpandedObservations] = useState<Set<number>>(new Set());
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/kilo', {
          method: 'GET'
        })
        
        const data = await response.json()
        
        setObservations(data.data)
      } catch (e) {
        console.error('something went wrong', e)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

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
    <Card className="h-full border-gray-300 bg-white shadow-lg">
      <CardContent className="h-full py-4">
        {loading ? (
          <p>Fetching observations...</p>
        ) : (
        <div className="space-y-4 h-full overflow-y-auto touch-pan-y">
          {observations.length > 1 ? (
              <>
              {observations?.map((obs) => (
                    <div key={obs.id} className="border-l-4 border-lime-600 pl-4 py-2">
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
                    className="text-xs text-lime-600 flex items-center gap-1 mt-1"
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
                        <span>{obs.username} • {new Date(obs.timestamp).toDateString()}</span>
                    </div>
                    </div>
                ))} 
              </>
          ) : (
            <p>No Kilo entries yet!</p>
          )}
            </div>
        )}
            </CardContent>
        </Card>
    )
}
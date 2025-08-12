'use client'
import { useState, useEffect } from "react";
import { MalaData } from "../../lib/data/api";
import LocationWidget from "./LocationWidget";

export default function LocationWidgetWrapper() {
  const [loading, setLoading] = useState<boolean>(false)
  const [locations, setLocations] = useState<MalaData[]>([])
  const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          const res = await fetch('api/metrics')
          const data = await res.json()
          setLocations(data.locations)   
          setError(data.error || null)     
        } catch (e) {
          console.log(e)
          if (e instanceof Error) {
            const errorMessage = e.message
            setError(errorMessage)
          }
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }, [])
  return (
    <>
      { loading ? (
        <div className="p-4 rounded-lg bg-white border border-gray-300 shadow-md">Loading...</div>
      ) : (
        <>
          {error ? (
            <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-700">
              {error}
            </div>
          ) : (
           <LocationWidget locations={locations} />
          )}
        </>
      )}    
    </>
  )
  
  
}
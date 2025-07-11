'use client'
import { useState, useEffect } from "react";
import { MalaData } from "../../lib/data";
import LocationWidget from "./LocationWidget";

export default function LocationWidgetWrapper() {
  const [loading, setLoading] = useState<boolean>(false)
  const [locations, setLocations] = useState<MalaData[]>([])

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          const res = await fetch('api/metrics')
          const data = await res.json()
          setLocations(data.locations)          
        } catch (e) {
          console.log(e)
          throw new Error('Error fetching location data')          
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
        <LocationWidget locations={locations} />
      )}    
    </>
  )
  
  
}
"use client";
import React, { useEffect, useState } from "react";

// You can change this to your preferred city or get from env
const LAT = 21.3069; // Honolulu, HI
const LON = -157.8583;

export default function WeatherCard() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&hourly=temperature_2m,weathercode`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.current_weather);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch weather");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!weather) return <div>No data</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-4xl mb-2">🌤️</span>
      <span className="font-medium">{weather.temperature}°C</span>
      <span className="text-xs text-gray-500">{weather.weathercode === 0 ? "Clear" : "See details"}</span>
    </div>
  );
}

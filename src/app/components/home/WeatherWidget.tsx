"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { Cloud, Droplets, Wind } from "lucide-react";
import { getWeatherCondition } from "@/app/lib/utils";

interface Weather {
    temperature: string,
    condition: string,
    humidity: string,
    windspeed: string
}
// You can change this to your preferred city or get from env
const LAT = 21.3069; // Honolulu, HI
const LON = -157.8583;

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&hourly=temperature_2m,weathercode,relativehumidity_2m,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph`
    )
      .then((res) => res.json())
      .then((data) => {
        const currentWeather = data.current_weather;
        const currentHour = new Date().getHours();
        const hourlyData = data.hourly;
        
        // Get current hour's data
        const currentIndex = hourlyData.time.findIndex((time: string) => 
          new Date(time).getHours() === currentHour
        );
        
        const weatherData: Weather = {
          temperature: currentWeather.temperature,
          condition: getWeatherCondition(currentWeather.weathercode),
          humidity: hourlyData.relativehumidity_2m[currentIndex]?.toString() || "N/A",
          windspeed: hourlyData.windspeed_10m[currentIndex]?.toString() || "N/A"
        };
        
        setWeather(weatherData);
        console.log(data);
      })
      .catch((err) => {
        setError("Failed to fetch weather");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>; // todo put a skeleton instead of Loading text...
  if (error) return <div className="text-red-500">{error}</div>;
  if (!weather) return <div>No data</div>;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-sm md:text-lg flex items-center gap-2">
          <Cloud className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          <span className="hidden sm:inline">Current Weather</span>
          <span className="sm:hidden">Weather</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xl md:text-2xl font-bold text-blue-900">{weather.temperature}°F</span>
            <span className="text-xs md:text-sm text-blue-700 hidden sm:block">{weather.condition}</span>
          </div>
          {/* Humidity & Weather */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-1 md:gap-2">
              <Droplets className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
              <span className="hidden sm:inline">{weather.humidity}% Humidity</span>
              <span className="sm:hidden">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Wind className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
              <span className="hidden sm:inline">{weather.windspeed} mph</span>
              <span className="sm:hidden">{weather.windspeed}mph</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

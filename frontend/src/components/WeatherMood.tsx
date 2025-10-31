import React from 'react';

export default function WeatherMood({mood, setMood}:{mood:string, setMood:(m:string)=>void}){
  return (
    <div className="rounded-lg p-4 bg-slate-700/40">
      <p>Weather-based mood: <strong>{mood}</strong></p>
      <p className="text-sm text-slate-300">Location & weather auto-detected via browser geolocation (user must allow)</p>
    </div>
  )
}

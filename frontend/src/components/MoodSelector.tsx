import React from 'react';
export default function MoodSelector({mood,setMood,options}:{mood:string;setMood:(m:string)=>void;options:string[];}){
  return (
    <select value={mood} onChange={e=>setMood(e.target.value)} className="p-2 rounded bg-slate-600">
      {options.map(o=> <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

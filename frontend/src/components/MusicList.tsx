import React from 'react';
import MusicCard from './MusicCard';
import { Track } from '../types';

export default function MusicList({tracks,loading,onPlay}:{tracks:any[],loading:boolean,onPlay:(t:Track)=>void}){
  if (loading) return <div>Loading tracks…</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tracks.map(t => <MusicCard key={t.id} track={t} onPlay={()=>onPlay(t)} />)}
    </div>
  )
}

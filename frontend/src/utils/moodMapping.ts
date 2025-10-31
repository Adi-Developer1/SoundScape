export const weatherToMood = (weatherMain: string) => {
  const w = weatherMain.toLowerCase();
  if (w.includes('rain') || w.includes('drizzle') || w.includes('thunder')) return 'Chill';
  if (w.includes('clear') || w.includes('sun')) return 'Happy';
  if (w.includes('cloud') || w.includes('mist') || w.includes('fog')) return 'LoFi';
  if (w.includes('snow')) return 'Cozy';
  return 'Focus';
};
export const moods = ['Chill','Happy','LoFi','Focus','Party','Sad'];

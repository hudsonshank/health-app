import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import ProgressHeader from '../components/ProgressHeader';
import WorkoutCalendar from '../components/WorkoutCalendar';

export default function Home(){
  const r = useRouter();
  const [workoutsByDate, setWorkoutsByDate] = useState<Record<string, 'planned'|'done'|'skipped'>>({});
  const [adherence, setAdherence] = useState(0);
  const [recentWeights, setRecentWeights] = useState<number[]>([]);

  useEffect(()=>{
    const load = async ()=>{
      const start = new Date();
      start.setDate(1);
      const end = new Date(start.getFullYear(), start.getMonth()+1, 0);
      const { data: w } = await supabase.from('workouts')
        .select('planned_date,status')
        .gte('planned_date', start.toISOString().slice(0,10))
        .lte('planned_date', end.toISOString().slice(0,10));
      const map: any = {};
      (w??[]).forEach(row=>{ map[row.planned_date] = row.status as any; });
      setWorkoutsByDate(map);
      const done = (w??[]).filter((x:any)=>x.status==='done').length;
      const planned = (w??[]).length || 1;
      setAdherence((done/planned)*100);
      const { data: m } = await supabase.from('body_metrics').select('weight_kg').order('taken_at', { ascending:false }).limit(5);
      setRecentWeights((m??[]).map((x:any)=>Number(x.weight_kg)).reverse());
    };
    load();
  }, []);

  return (
    <View style={{ flex:1 }}>
      <ProgressHeader adherencePct={adherence} recentWeights={recentWeights} />
      <WorkoutCalendar workoutsByDate={workoutsByDate} onDayPress={(d:any)=>{
        (async()=>{
          const { data } = await supabase.from('workouts').select('id').eq('planned_date', d.dateString).limit(1).maybeSingle();
          if (data?.id) r.push(`/day/${data.id}`);
        })();
      }} />
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import ExerciseSetCard from '../../components/ExerciseSetCard';

export default function Day(){
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const r = useRouter();
  const [exercises, setExercises] = useState<any[]>([]);
  const [setsState, setSetsState] = useState<Record<string, { weight_kg?: string; reps?: string }[]>>({});

  useEffect(()=>{
    const load = async ()=>{
      const { data: w } = await supabase.from('workouts').select('program_day_id, planned_date').eq('id', workoutId).maybeSingle();
      if(!w?.program_day_id) return;
      const { data: list } = await supabase
        .from('program_day_exercises')
        .select('id, exercise_id, target_sets, target_reps_low, target_reps_high, exercises(name)')
        .eq('program_day_id', w.program_day_id)
        .order('id');
      setExercises(list ?? []);
      // Pre-seed state
      const seed: any = {};
      (list??[]).forEach((row:any)=>{
        seed[row.exercise_id] = Array.from({ length: row.target_sets }).map(()=>({ weight_kg: '', reps: '' }));
      });
      setSetsState(seed);
    };
    load();
  }, [workoutId]);

  const saveAll = async ()=>{
    const rows: any[] = [];
    Object.entries(setsState).forEach(([exerciseId, arr])=>{
      (arr as any[]).forEach((v, idx)=>{
        rows.push({ workout_id: Number(workoutId), exercise_id: Number(exerciseId), set_number: idx+1, weight_kg: Number(v.weight_kg||0), reps: Number(v.reps||0) });
      });
    });
    if (rows.length) await supabase.from('workout_sets').insert(rows);
    await supabase.from('workouts').update({ status: 'done' }).eq('id', workoutId);
    alert('Workout saved!');
    r.back();
  };

  return (
    <ScrollView contentContainerStyle={{ padding:16 }}>
      {exercises.map((ex:any)=> (
        <View key={ex.id}>
          <Text style={{ fontSize:16, fontWeight:'700', marginBottom:6 }}>{ex.exercises?.name} ({ex.target_reps_low}-{ex.target_reps_high})</Text>
          {(setsState[ex.exercise_id]||[]).map((v, i)=> (
            <ExerciseSetCard key={i} name={ex.exercises?.name} setNumber={i+1} value={v} onChange={(nv)=>{
              setSetsState(s=>({ ...s, [ex.exercise_id]: (s[ex.exercise_id] as any).map((row:any, idx:number)=> idx===i? nv : row) }));
            }} />
          ))}
        </View>
      ))}
      <Button title="Finish Workout" onPress={saveAll} />
    </ScrollView>
  );
}

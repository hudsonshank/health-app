import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

export default function TemplateBuilder(){
  const [name, setName] = useState('My Split');
  const [days, setDays] = useState<{ dow:number; title:string }[]>([ { dow:1, title:'Upper' }, { dow:3, title:'Lower' } ]);
  const [exLib, setExLib] = useState<any[]>([]);

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('exercises').select('*').is('owner', null);
    setExLib(data ?? []);
  })(); }, []);

  const createTemplate = async ()=>{
    const { data: tpl, error } = await supabase.from('program_templates').insert({ name }).select().single();
    if (error) { alert(error.message); return; }
    for (const d of days) {
      const { data: day } = await supabase.from('program_days').insert({ template_id: tpl.id, dow: d.dow, title: d.title }).select().single();
      // demo: attach first 3 global exercises with 3x(8-12)
      const exs = exLib.slice(0,3);
      for (const ex of exs) {
        await supabase.from('program_day_exercises').insert({ program_day_id: day.id, exercise_id: ex.id, target_sets: 3, target_reps_low: 8, target_reps_high: 12 });
      }
    }
    // Generate 8 weeks of planned workouts
    const owner = (await supabase.auth.getUser()).data.user?.id;
    const today = new Date();
    for (let w=0; w<8; w++) {
      for (const d of days) {
        const date = new Date(today);
        const delta = (7 + d.dow - date.getDay()) % 7 + (w*7);
        date.setDate(date.getDate() + delta);
        await supabase.from('workouts').insert({ owner, planned_date: date.toISOString().slice(0,10) });
      }
    }
    alert('Template created and workouts scheduled!');
  };

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:'700' }}>Template Builder</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Template name" style={{ borderWidth:1, padding:8 }} />
      <Button title="Create Template & Schedule" onPress={createTemplate} />
    </ScrollView>
  );
}

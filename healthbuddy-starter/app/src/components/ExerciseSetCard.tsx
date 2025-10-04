    import React from 'react';
    import { View, Text, TextInput } from 'react-native';

    export default function ExerciseSetCard({ name, setNumber, value, onChange }:{
  name: string; setNumber: number; value: { weight_kg?: string; reps?: string };
  onChange: (v:{ weight_kg?: string; reps?: string })=>void;
}){
  return (
    <View style={{ padding:12, borderWidth:1, borderColor:'#ddd', borderRadius:8, marginBottom:8 }}>
      <Text style={{ fontWeight:'600' }}>{name} — Set {setNumber}</Text>
      <View style={{ flexDirection:'row', gap:12, marginTop:8 }}>
        <TextInput placeholder="kg" keyboardType="numeric" style={{ borderWidth:1, flex:1, padding:8 }} value={value.weight_kg} onChangeText={(t)=>onChange({ ...value, weight_kg: t })} />
        <TextInput placeholder="reps" keyboardType="numeric" style={{ borderWidth:1, flex:1, padding:8 }} value={value.reps} onChangeText={(t)=>onChange({ ...value, reps: t })} />
      </View>
    </View>
  );
}

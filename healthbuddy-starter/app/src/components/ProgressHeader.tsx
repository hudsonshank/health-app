    import React from 'react';
    import { View, Text } from 'react-native';

    export default function ProgressHeader({ adherencePct, recentWeights }:{
  adherencePct: number;
  recentWeights: number[];
}){
  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize:18, fontWeight:'700' }}>Progress</Text>
      <Text style={{ marginTop:6 }}>Adherence (28d): {Math.round(adherencePct)}%</Text>
      <Text>Recent Weights: {recentWeights.join(', ')}</Text>
    </View>
  );
}

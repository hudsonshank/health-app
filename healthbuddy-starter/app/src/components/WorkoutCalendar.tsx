    import React, { useMemo } from 'react';
    import { Calendar } from 'react-native-calendars';

    export default function WorkoutCalendar({ workoutsByDate, onDayPress }:{
  workoutsByDate: Record<string, 'planned'|'done'|'skipped'>,
  onDayPress: (d: any)=>void
}){
  const marked = useMemo(()=>{
    const out: any = {};
    Object.entries(workoutsByDate).forEach(([date, status])=>{
      out[date] = { marked: true, dotColor: status==='done'?'green': status==='skipped'?'orange':'#555', selected: false };
    });
    return out;
  }, [workoutsByDate]);
  return <Calendar markedDates={marked} onDayPress={onDayPress} />;
}

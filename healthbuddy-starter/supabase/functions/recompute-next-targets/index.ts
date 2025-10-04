import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = { workout_id?: number; owner?: string; exercise_id?: number };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const body = (await req.json()) as Payload;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let owner: string | undefined = body.owner;
    let exerciseIds: number[] = [];

    if (body.workout_id) {
      const { data: w } = await supabase.from("workouts").select("id, owner").eq("id", body.workout_id).single();
      owner = w?.owner;
      const { data: sets } = await supabase
        .from("workout_sets")
        .select("exercise_id")
        .eq("workout_id", body.workout_id);
      exerciseIds = [...new Set((sets ?? []).map((s: any) => s.exercise_id))];
    }
    if (body.exercise_id) exerciseIds = [body.exercise_id];

    if (!owner || exerciseIds.length === 0) return new Response(JSON.stringify({ ok: true }));

    for (const exId of exerciseIds) {
      const recentWorkouts = await supabase
        .from("workouts")
        .select("id")
        .eq("owner", owner)
        .order("planned_date", { ascending: false })
        .limit(12);
      const ids = (recentWorkouts.data ?? []).map((w: any) => w.id);

      const { data: lastSets } = await supabase
        .from("workout_sets")
        .select("weight_kg, reps, set_number, workout_id")
        .in("workout_id", ids.length ? ids : [-1])
        .eq("exercise_id", exId)
        .order("set_number");

      const weights = (lastSets ?? []).map((s: any) => Number(s.weight_kg || 0));
      const reps = (lastSets ?? []).map((s: any) => Number(s.reps || 0));
      const avgWeight = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : 0;
      const avgReps = reps.length ? reps.reduce((a, b) => a + b, 0) / reps.length : 0;

      let targetLow = 8, targetHigh = 12;
      let nextWeight = avgWeight || 20;

      if (avgReps >= targetHigh) nextWeight = Math.round((avgWeight * 1.025) * 2) / 2;
      else if (avgReps < targetLow - 1) nextWeight = Math.max(0, Math.round((avgWeight * 0.975) * 2) / 2);

      await supabase
        .from("user_exercise_targets")
        .upsert({ owner, exercise_id: exId, next_weight_kg: nextWeight, target_reps_low: targetLow, target_reps_high: targetHigh })
        .select();
    }

    return new Response(JSON.stringify({ ok: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});

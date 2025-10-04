# HealthBuddy Starter

## Prereqs
- Node 18+, pnpm or npm
- Expo CLI (`npm i -g expo-cli`) optional
- Supabase project created

## 1) Supabase setup
- Create new project
- Run `supabase/schema.sql` then `supabase/policies.sql` in SQL editor
- Add a public storage bucket `progress-photos`
- (Optional) Deploy Edge Function `recompute-next-targets` with service role key in env

## 2) Configure env
Copy `.env.example` → set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## 3) Install & run
```bash
cd app
npm i
npm run start
```
Open on iOS/Android with Expo Go or run a simulator.

## 4) Seed
Insert a few global exercises in `public.exercises` with `owner = null` (e.g., Bench Press, Back Squat, Deadlift).

## 5) Build flow
- Sign in (magic link)
- Go to Template Builder → Create Template & Schedule
- Home: see calendar; tap a planned day → log sets → Finish Workout
- Home top: adherence and weights (add weights in `body_metrics` for now)

## Notes
- HealthKit/Health Connect integration can be added later via native modules.
- Progression engine provided as Edge Function example; you can invoke it after finishing workouts.

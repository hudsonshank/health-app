create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists public.exercises (
  id bigserial primary key,
  owner uuid references auth.users(id),
  name text not null,
  muscle_group text,
  is_bodyweight boolean default false,
  unique (owner, name)
);

create table if not exists public.program_templates (
  id bigserial primary key,
  owner uuid references auth.users(id) not null,
  name text not null,
  mesocycle_weeks int default 12
);

create table if not exists public.program_days (
  id bigserial primary key,
  template_id bigint references public.program_templates(id) on delete cascade,
  dow int not null check (dow between 0 and 6),
  title text
);

create table if not exists public.program_day_exercises (
  id bigserial primary key,
  program_day_id bigint references public.program_days(id) on delete cascade,
  exercise_id bigint references public.exercises(id),
  target_sets int not null,
  target_reps_low int not null,
  target_reps_high int not null,
  progression_strategy text default 'double-progression'
);

create table if not exists public.workouts (
  id bigserial primary key,
  owner uuid references auth.users(id) not null,
  planned_date date not null,
  program_day_id bigint references public.program_days(id),
  status text default 'planned' check (status in ('planned','done','skipped'))
);

create table if not exists public.workout_sets (
  id bigserial primary key,
  workout_id bigint references public.workouts(id) on delete cascade,
  exercise_id bigint references public.exercises(id),
  set_number int not null,
  weight_kg numeric(6,2),
  reps int,
  rpe numeric(3,1),
  created_at timestamptz default now()
);

create table if not exists public.body_metrics (
  id bigserial primary key,
  owner uuid references auth.users(id) not null,
  taken_at timestamptz not null,
  weight_kg numeric(6,2) not null,
  body_fat_pct numeric(4,1),
  source text default 'manual'
);

create table if not exists public.progress_photos (
  id bigserial primary key,
  owner uuid references auth.users(id) not null,
  taken_at timestamptz not null,
  storage_path text not null
);

create table if not exists public.user_exercise_targets (
  owner uuid references auth.users(id),
  exercise_id bigint references public.exercises(id),
  next_weight_kg numeric(6,2),
  target_reps_low int,
  target_reps_high int,
  primary key (owner, exercise_id)
);

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.program_templates enable row level security;
alter table public.program_days enable row level security;
alter table public.program_day_exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.body_metrics enable row level security;
alter table public.progress_photos enable row level security;
alter table public.user_exercise_targets enable row level security;

create policy "profile read own" on public.profiles for select using (id = auth.uid());
create policy "profile write own" on public.profiles for insert with check (id = auth.uid());
create policy "profile update own" on public.profiles for update using (id = auth.uid());

create policy "ex read" on public.exercises for select using (owner is null or owner = auth.uid());
create policy "ex write own" on public.exercises for insert with check (owner = auth.uid());
create policy "ex update own" on public.exercises for update using (owner = auth.uid());

create policy "tpl read own" on public.program_templates for select using (owner = auth.uid());
create policy "tpl write own" on public.program_templates for insert with check (owner = auth.uid());
create policy "tpl update own" on public.program_templates for update using (owner = auth.uid());

create policy "pd read" on public.program_days for select using (
  exists (select 1 from public.program_templates t where t.id = program_days.template_id and t.owner = auth.uid())
);
create policy "pd write" on public.program_days for insert with check (
  exists (select 1 from public.program_templates t where t.id = program_days.template_id and t.owner = auth.uid())
);
create policy "pd update" on public.program_days for update using (
  exists (select 1 from public.program_templates t where t.id = program_days.template_id and t.owner = auth.uid())
);

create policy "pde read" on public.program_day_exercises for select using (
  exists (
    select 1 from public.program_days d
    join public.program_templates t on t.id = d.template_id
    where d.id = program_day_exercises.program_day_id and t.owner = auth.uid()
  )
);
create policy "pde write" on public.program_day_exercises for insert with check (
  exists (
    select 1 from public.program_days d
    join public.program_templates t on t.id = d.template_id
    where d.id = program_day_exercises.program_day_id and t.owner = auth.uid()
  )
);

create policy "workouts read own" on public.workouts for select using (owner = auth.uid());
create policy "workouts write own" on public.workouts for insert with check (owner = auth.uid());
create policy "workouts update own" on public.workouts for update using (owner = auth.uid());

create policy "sets read" on public.workout_sets for select using (
  exists (select 1 from public.workouts w where w.id = workout_sets.workout_id and w.owner = auth.uid())
);
create policy "sets write" on public.workout_sets for insert with check (
  exists (select 1 from public.workouts w where w.id = workout_sets.workout_id and w.owner = auth.uid())
);
create policy "sets update" on public.workout_sets for update using (
  exists (select 1 from public.workouts w where w.id = workout_sets.workout_id and w.owner = auth.uid())
);

create policy "metrics read own" on public.body_metrics for select using (owner = auth.uid());
create policy "metrics write own" on public.body_metrics for insert with check (owner = auth.uid());
create policy "metrics update own" on public.body_metrics for update using (owner = auth.uid());

create policy "photos read own" on public.progress_photos for select using (owner = auth.uid());
create policy "photos write own" on public.progress_photos for insert with check (owner = auth.uid());
create policy "photos update own" on public.progress_photos for update using (owner = auth.uid());

create policy "targets read own" on public.user_exercise_targets for select using (owner = auth.uid());
create policy "targets write own" on public.user_exercise_targets for insert with check (owner = auth.uid());
create policy "targets update own" on public.user_exercise_targets for update using (owner = auth.uid());

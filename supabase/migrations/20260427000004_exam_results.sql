-- ─────────────────────────────────────────────────────────────────────────────
-- Mock exam results with auto-computed pass/fail
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.exam_results (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users on delete cascade,
  exam_id      text        not null,
  exam_type    text        not null default 'IELTS',
  score        numeric(5,2) not null check (score >= 0 and score <= 100),
  band_score   numeric(3,1),          -- IELTS band equivalent
  answers      jsonb,
  section_scores jsonb,               -- { listening, reading, writing, speaking }
  completed_at timestamptz not null default now()
);

-- Computed column: passed when score >= 70
alter table public.exam_results
  add column if not exists passed boolean
  generated always as (score >= 70) stored;

create index if not exists exam_results_user_time_idx
  on public.exam_results (user_id, completed_at desc);

-- RLS
alter table public.exam_results enable row level security;

create policy "exam_results: own all"
  on public.exam_results for all using (user_id = auth.uid());

-- Helper view: weekly study hours derived from exam completion
create or replace view public.weekly_exam_stats as
select
  user_id,
  date_trunc('week', completed_at) as week_start,
  round(avg(score), 1)             as avg_score,
  count(*)                         as exams_taken,
  round(avg(band_score), 1)        as avg_band
from public.exam_results
group by user_id, date_trunc('week', completed_at);

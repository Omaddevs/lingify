-- ─────────────────────────────────────────────────────────────────────────────
-- Vocabulary: words catalogue + per-user SM-2 spaced repetition progress
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.words (
  id          uuid  primary key default gen_random_uuid(),
  term        text  not null,
  meaning     text  not null,
  level       text  check (level in ('A1','A2','B1','B2','C1','C2','Advanced')),
  category    text,
  audio_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.vocabulary_progress (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users on delete cascade,
  word_id       uuid        not null references public.words on delete cascade,
  status        text        not null default 'new'
                            check (status in ('new','learning','mastered')),
  ease_factor   numeric(4,2) not null default 2.5,
  interval_days int         not null default 1,
  repetitions   int         not null default 0,
  last_reviewed timestamptz,
  next_review   timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (user_id, word_id)
);

create index if not exists vocab_due_idx
  on public.vocabulary_progress (user_id, next_review)
  where status != 'mastered';

-- RLS
alter table public.words enable row level security;
alter table public.vocabulary_progress enable row level security;

create policy "words: public read"     on public.words for select using (true);
create policy "vocab: own all"         on public.vocabulary_progress for all using (user_id = auth.uid());

-- Seed a few demo words (safe to run multiple times)
insert into public.words (term, meaning, level, category) values
  ('Comprehensive', 'Including or dealing with all or nearly all elements', 'Advanced', 'Academic'),
  ('Meticulous',    'Showing great attention to detail; very careful',      'Advanced', 'Academic'),
  ('Evident',       'Clearly seen or understood; obvious',                  'B2',       'Academic'),
  ('Collaborate',   'To work jointly on an activity or project',            'B1',       'Business'),
  ('Eloquent',      'Fluent or persuasive in speaking or writing',          'C1',       'Academic'),
  ('Ambiguous',     'Open to more than one interpretation; unclear',        'B2',       'Academic'),
  ('Persistent',    'Continuing firmly despite difficulty or opposition',   'B1',       'Daily'),
  ('Scrutinise',    'To examine or inspect closely and thoroughly',         'C1',       'Academic')
on conflict do nothing;

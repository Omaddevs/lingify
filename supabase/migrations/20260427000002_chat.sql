-- ─────────────────────────────────────────────────────────────────────────────
-- Chat: conversations → participants ← messages
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id         uuid        primary key default gen_random_uuid(),
  name       text,
  is_group   boolean     not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid references public.conversations on delete cascade,
  user_id         uuid references auth.users           on delete cascade,
  joined_at       timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        not null references public.conversations on delete cascade,
  sender_id       uuid        not null references auth.users           on delete cascade,
  content         text        not null default '',
  file_url        text,
  file_type       text,       -- 'image' | 'file' | null
  created_at      timestamptz not null default now()
);

-- Fast lookups for latest message and unread count
create index if not exists messages_conv_time_idx on public.messages (conversation_id, created_at desc);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.conversations           enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages                enable row level security;

-- Helpers
create or replace function public.is_participant(conv_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = conv_id and user_id = auth.uid()
  );
$$;

create policy "conv: participant can read"
  on public.conversations for select
  using (public.is_participant(id));

create policy "conv_participants: read own"
  on public.conversation_participants for select
  using (user_id = auth.uid());

create policy "messages: participant all"
  on public.messages for all
  using (public.is_participant(conversation_id))
  with check (public.is_participant(conversation_id) and sender_id = auth.uid());

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;

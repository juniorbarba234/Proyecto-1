create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text not null unique,
    full_name text,
    avatar_url text,
    created_at timestamptz not null default now()
);

create table if not exists public.devices (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    device_name text not null,
    push_token text unique,
    last_seen timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    created_by uuid not null references public.profiles(id) on delete cascade,
    title text,
    is_group boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    joined_at timestamptz not null default now(),
    primary key (conversation_id, user_id)
);

create table if not exists public.messages (
    id bigint generated always as identity primary key,
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    sender_id uuid not null references public.profiles(id) on delete cascade,
    content text not null,
    created_at timestamptz not null default now()
);

create index if not exists devices_user_id_idx
    on public.devices(user_id);

create index if not exists conversations_created_by_idx
    on public.conversations(created_by);

create index if not exists conversation_members_user_id_idx
    on public.conversation_members(user_id);

create index if not exists messages_conversation_id_created_at_idx
    on public.messages(conversation_id, created_at);

create index if not exists messages_sender_id_idx
    on public.messages(sender_id);

alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

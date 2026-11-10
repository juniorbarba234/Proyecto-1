alter table public.profiles enable row level security;

drop policy if exists "Usuarios consultan perfiles" on public.profiles;
create policy "Usuarios consultan perfiles"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "Usuarios actualizan su perfil" on public.profiles;
create policy "Usuarios actualizan su perfil"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create index if not exists profiles_full_name_idx on public.profiles(full_name);
create index if not exists profiles_username_idx on public.profiles(username);

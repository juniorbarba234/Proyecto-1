create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, username, full_name)
    values (
        new.id,
        coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), 'user_' || left(new.id::text, 8)),
        nullif(new.raw_user_meta_data ->> 'full_name', '')
    )
    on conflict (id) do update
    set username = excluded.username,
        full_name = excluded.full_name;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert or update of raw_user_meta_data on auth.users
for each row execute procedure public.handle_new_user();

drop policy if exists "Usuarios consultan su perfil" on public.profiles;
create policy "Usuarios consultan su perfil"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Usuarios actualizan su perfil" on public.profiles;
create policy "Usuarios actualizan su perfil"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Usuarios administran sus dispositivos" on public.devices;
create policy "Usuarios administran sus dispositivos"
on public.devices for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

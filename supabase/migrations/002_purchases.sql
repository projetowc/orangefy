-- Tabela de compras aprovadas (preenchida pelo webhook da Cakto)
create table if not exists public.purchases (
  email text primary key,
  name text,
  plan text default 'monthly',
  purchased_at timestamptz default now()
);

-- RLS: somente service_role pode ler/escrever
alter table public.purchases enable row level security;

create policy "Service role full access purchases"
  on public.purchases for all
  using (auth.role() = 'service_role');

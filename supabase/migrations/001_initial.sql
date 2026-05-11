-- Orangefy Database Schema

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  avatar_url text,
  plan text default 'monthly' check (plan in ('monthly', 'annual')),
  status text default 'pending' check (status in ('active', 'inactive', 'pending')),
  xp integer default 0,
  level integer default 1,
  sales_count integer default 0,
  shopee_score integer default 0,
  streak_days integer default 0,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Missions progress table
create table if not exists public.user_missions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  mission_id integer not null,
  completed boolean default false,
  checklist_progress jsonb default '{}',
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Sales tracking table
create table if not exists public.user_sales (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  product_name text,
  sale_price numeric(10, 2),
  profit numeric(10, 2),
  platform text default 'shopee',
  sold_at timestamptz default now(),
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.user_missions enable row level security;
alter table public.user_sales enable row level security;

-- Users can read and update their own data
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Mission policies
create policy "Users can view own missions"
  on public.user_missions for select
  using (auth.uid() = user_id);

create policy "Users can update own missions"
  on public.user_missions for all
  using (auth.uid() = user_id);

-- Sales policies
create policy "Users can view own sales"
  on public.user_sales for select
  using (auth.uid() = user_id);

create policy "Users can insert own sales"
  on public.user_sales for insert
  with check (auth.uid() = user_id);

-- Service role bypass (for webhook)
create policy "Service role full access users"
  on public.users for all
  using (auth.role() = 'service_role');

-- Function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

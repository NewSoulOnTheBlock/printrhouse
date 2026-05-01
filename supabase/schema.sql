-- Printrhouse schema. Run once in Supabase SQL editor:
-- https://supabase.com/dashboard/project/jivznuzdezqzdzpufim/sql

create extension if not exists "pgcrypto";

create table if not exists public.stores (
  id            uuid primary key default gen_random_uuid(),
  owner_wallet  text not null,
  slug          text unique not null,
  name          text not null,
  ticker        text,
  bio           text,
  banner_url    text,
  avatar_url    text,
  royalty_bps   integer not null default 1000,
  created_at    timestamptz not null default now()
);
create index if not exists stores_owner_idx on public.stores(owner_wallet);

create table if not exists public.products (
  id                  uuid primary key default gen_random_uuid(),
  store_id            uuid references public.stores(id) on delete set null,
  printify_product_id text,
  title               text not null,
  description         text,
  image               text,
  price_usd           numeric(10,2) not null default 0,
  price_sol           numeric(10,4) not null default 0,
  blueprint_id        integer,
  gate_mint           text,
  visible             boolean not null default true,
  created_at          timestamptz not null default now()
);
create index if not exists products_store_idx on public.products(store_id);
create index if not exists products_visible_idx on public.products(visible);

create table if not exists public.designs (
  id                 uuid primary key default gen_random_uuid(),
  store_id           uuid references public.stores(id) on delete set null,
  file_name          text not null,
  printify_upload_id text,
  image_url          text,
  created_at         timestamptz not null default now()
);

create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_id            text unique not null,
  buyer_wallet        text,
  buyer_email         text,
  sig                 text,
  total_sol           numeric(10,4),
  total_usd           numeric(10,2),
  items               jsonb not null default '[]'::jsonb,
  shipping            jsonb,
  printify_order_id   text,
  status              text not null default 'pending',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists orders_buyer_idx on public.orders(buyer_wallet);
create index if not exists orders_sig_idx   on public.orders(sig);

alter table public.stores   enable row level security;
alter table public.products enable row level security;
alter table public.designs  enable row level security;
alter table public.orders   enable row level security;

drop policy if exists "stores_read"     on public.stores;
drop policy if exists "products_read"   on public.products;
drop policy if exists "orders_read_own" on public.orders;
create policy "stores_read"   on public.stores   for select using (true);
create policy "products_read" on public.products for select using (visible = true);
create policy "orders_read_own" on public.orders for select using (true);

insert into storage.buckets (id, name, public)
values ('designs', 'designs', true)
on conflict (id) do nothing;

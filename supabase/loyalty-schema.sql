-- Carte de fidélité digitale — schéma multi-commerçants
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query > coller > Run.
-- Utilise des noms de table préfixés "loyalty_" pour ne pas entrer en conflit
-- avec les tables existantes (sales, stock, goals, drops, etc.).

create extension if not exists "pgcrypto";

-- ── Commerçants ──────────────────────────────────────────────────────────
-- Un commerçant = un compte Supabase Auth (créé manuellement par Risly).
-- id = auth.users.id, pas de table de comptes séparée.
create table if not exists loyalty_merchants (
  id uuid primary key references auth.users(id) on delete cascade,
  slug text unique not null,
  business_name text not null,
  logo_url text,
  primary_color text not null default '#4F46E5',
  stamps_required int not null default 10,
  reward_text text not null default 'Une récompense au choix',
  cooldown_hours int not null default 2,
  created_at timestamptz not null default now()
);

-- ── Clients finaux d'un commerçant ──────────────────────────────────────
create table if not exists loyalty_customers (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references loyalty_merchants(id) on delete cascade,
  phone text not null,
  stamps int not null default 0,
  last_stamp_at timestamptz,
  reward_code text,
  total_rewards_redeemed int not null default 0,
  created_at timestamptz not null default now(),
  unique (merchant_id, phone)
);

create index if not exists loyalty_customers_merchant_idx on loyalty_customers (merchant_id);

-- ── Historique des tampons (pour les stats "aujourd'hui") ──────────────
create table if not exists loyalty_stamp_events (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references loyalty_merchants(id) on delete cascade,
  customer_id uuid not null references loyalty_customers(id) on delete cascade,
  at timestamptz not null default now()
);

create index if not exists loyalty_stamp_events_merchant_idx on loyalty_stamp_events (merchant_id, at);

-- ── Récompenses validées ────────────────────────────────────────────────
create table if not exists loyalty_redemptions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references loyalty_merchants(id) on delete cascade,
  customer_id uuid not null references loyalty_customers(id) on delete cascade,
  code text not null,
  at timestamptz not null default now()
);

create index if not exists loyalty_redemptions_merchant_idx on loyalty_redemptions (merchant_id);

-- ── Row Level Security ──────────────────────────────────────────────────
-- Principe : le client final (anonyme, sans compte) ne parle JAMAIS
-- directement à ces tables. Toutes les actions "check-in" passent par des
-- routes API serveur (service role, qui contourne RLS) où la logique
-- métier (délai anti-abus, génération du code) est appliquée côté serveur,
-- donc non contournable depuis le navigateur. RLS ici protège uniquement
-- l'accès direct depuis le client Supabase du navigateur, réservé au
-- commerçant connecté.

alter table loyalty_merchants enable row level security;
alter table loyalty_customers enable row level security;
alter table loyalty_stamp_events enable row level security;
alter table loyalty_redemptions enable row level security;

-- Merchants : lecture publique (nécessaire pour afficher la page /carte/[slug]),
-- écriture réservée au propriétaire du compte.
drop policy if exists "merchants_public_read" on loyalty_merchants;
create policy "merchants_public_read" on loyalty_merchants
  for select using (true);

drop policy if exists "merchants_owner_update" on loyalty_merchants;
create policy "merchants_owner_update" on loyalty_merchants
  for update using (auth.uid() = id);

-- Customers / stamp events / redemptions : uniquement le commerçant
-- propriétaire peut lire ses propres données depuis le navigateur.
-- Aucun accès anonyme direct (le check-in passe par l'API serveur).
drop policy if exists "customers_owner_read" on loyalty_customers;
create policy "customers_owner_read" on loyalty_customers
  for select using (auth.uid() = merchant_id);

drop policy if exists "stamp_events_owner_read" on loyalty_stamp_events;
create policy "stamp_events_owner_read" on loyalty_stamp_events
  for select using (auth.uid() = merchant_id);

drop policy if exists "redemptions_owner_read" on loyalty_redemptions;
create policy "redemptions_owner_read" on loyalty_redemptions
  for select using (auth.uid() = merchant_id);

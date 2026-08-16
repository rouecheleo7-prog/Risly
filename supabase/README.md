# Carte de fidélité — programme multi-commerçants sur risly.ch

## 1. Installer le schéma (une fois)

Dans Supabase Dashboard > SQL Editor > New query, coller le contenu de
`loyalty-schema.sql` et l'exécuter. Ça crée les tables `loyalty_merchants`,
`loyalty_customers`, `loyalty_stamp_events`, `loyalty_redemptions` et les
règles RLS. Sans risque pour les tables existantes (sales, stock, goals,
customers CRM, etc.) : noms différents, aucune modification de l'existant.

## 2. Créer un compte pour un nouveau commerçant

Comme la facturation se fait manuellement (pas de paiement en ligne), chaque
commerçant est créé à la main après avoir été facturé :

1. **Supabase Dashboard > Authentication > Users > Add user.** Renseignez
   son email et un mot de passe temporaire (qu'il pourra changer, ou que
   vous lui communiquez directement).
2. **Copiez l'UUID** du nouvel utilisateur créé (colonne `UID`).
3. **Supabase Dashboard > Table Editor > loyalty_merchants > Insert row**,
   avec :
   - `id` = l'UUID copié à l'étape 2
   - `slug` = identifiant unique pour l'URL publique, ex. `cafe-des-alpes`
   - `business_name`, `logo_url`, `primary_color`, `stamps_required`,
     `reward_text`, `cooldown_hours` selon ce que vous avez vendu

4. Donnez au commerçant : l'URL de connexion (`risly.ch/auth/login`) + ses
   identifiants, et l'URL publique de sa carte (`risly.ch/carte/son-slug`)
   pour générer son QR code (n'importe quel générateur de QR code en ligne
   fonctionne, il suffit d'y coller l'URL).

Le commerçant peut ensuite changer son mot de passe et modifier ses réglages
(nombre de tampons, texte de récompense, couleur, logo) directement depuis
`risly.ch/dashboard/reglages`.

## 3. Variables d'environnement nécessaires

Déjà présentes dans `.env.local` / Vercel : `NEXT_PUBLIC_SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY` (utilisée uniquement côté serveur, dans les
routes `/api/loyalty/*`, jamais exposée au navigateur).

## 4. Comment ça marche

- **Page publique** `risly.ch/carte/[slug]` : le client final scanne le QR,
  entre son numéro, un tampon est ajouté automatiquement (avec un délai
  anti-abus configurable). Toute la logique tourne côté serveur
  (`src/lib/loyalty.ts` + routes `src/app/api/loyalty/`), avec la clé
  service role Supabase : le client final ne parle jamais directement à la
  base de données, donc pas de faille de sécurité côté navigateur (contraste
  avec la première version Firebase, qui reposait sur des règles côté
  client).
- **Dashboard commerçant** `risly.ch/dashboard` : authentifié via Supabase
  Auth, protégé par le middleware existant. Chaque commerçant ne voit que
  ses propres données grâce aux policies RLS (`auth.uid() = merchant_id`).
- **Validation manuelle** (tampon ou récompense) : passe aussi par les
  routes API serveur, qui vérifient la session du commerçant avant d'agir
  sur ses propres données uniquement (impossible d'agir sur les données
  d'un autre commerçant même en manipulant les requêtes).

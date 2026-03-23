# yur.scrub — Medical Scrubs E-Commerce

A full-stack e-commerce website for Egyptian medical scrubs brand **yur.scrub**, built with Next.js 14, Supabase, and Tailwind CSS.

---

## ✨ Features

- 🌐 **Bilingual** — Arabic (default, RTL) + English
- 🌙 **Dark / Light** theme toggle
- 🛍️ **No-account purchasing** — customers order directly without registration
- 💳 **Two payment methods** — Cash on Delivery & Bank Transfer (with screenshot upload)
- 🔒 **Admin dashboard** — manage products and orders (Supabase Auth protected)
- 🗃️ **Supabase** — PostgreSQL + Storage + Auth (zero backend servers)
- ⚡ **Netlify-ready** — serverless deployment out of the box

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/yur-scrub.git
cd yur-scrub
npm install
```

### 2. Set Up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full schema from `supabase/schema.sql`
3. In **Storage**, confirm two buckets exist:
   - `product-images` (public)
   - `transfer-screenshots` (private)

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Find these in your Supabase project under **Settings → API**.

### 4. Create Admin User

In Supabase dashboard → **Authentication → Users** → **Add user**, create your admin account manually. This user can log in at `/admin/login`.

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — it will auto-redirect to `/ar`.

---

## 📁 Project Structure

```
yur-scrub/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                  # Landing page
│   │   ├── products/
│   │   │   ├── page.tsx              # All products
│   │   │   └── [id]/page.tsx         # Product detail + order form
│   │   ├── about/page.tsx
│   │   ├── order-success/page.tsx
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       ├── page.tsx              # Dashboard stats
│   │       ├── products/page.tsx     # CRUD products
│   │       ├── orders/page.tsx       # View & manage orders
│   │       └── profile/page.tsx      # Change email/password
│   ├── api/orders/route.ts           # Order creation API
│   └── globals.css
├── components/
│   ├── admin/                        # AdminSidebar, StatsCard
│   ├── layout/                       # Header, Footer
│   ├── orders/                       # OrderForm
│   ├── products/                     # ProductCard, ProductGrid
│   └── providers/                    # QueryProvider
├── lib/
│   ├── supabase/                     # client.ts, server.ts
│   ├── types.ts
│   └── utils.ts
├── messages/
│   ├── ar.json                       # Arabic strings
│   └── en.json                       # English strings
├── supabase/
│   └── schema.sql                    # Full DB schema + RLS + storage
├── i18n/
│   ├── request.ts
│   └── routing.ts
└── middleware.ts                     # i18n routing + admin auth guard
```

---

## 🗄️ Database Schema

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name_ar / name_en | text | Bilingual name |
| description_ar / description_en | text | Bilingual description |
| price | numeric | EGP |
| images | text[] | Supabase Storage URLs |
| sizes | text[] | e.g. `['S','M','L']` |
| colors | text[] | e.g. `['#1B4F72','#FFFFFF']` |
| is_active | boolean | Soft delete |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK → products |
| customer_name/email/phone | text | |
| delivery_address | text | |
| size / color | text | Selected options |
| payment_method | enum | `cod` \| `bank_transfer` |
| transfer_screenshot_url | text | Nullable |
| status | enum | `pending` → `delivered` |
| total_price | numeric | Snapshot at order time |

---

## 🔒 Security

- Admin routes (`/[locale]/admin/*`) are protected by `middleware.ts` — unauthenticated users are redirected to `/admin/login`
- Supabase **Row Level Security** is enabled:
  - Public: can read active products, insert orders
  - Authenticated admin: full access
- File uploads: validated to JPEG/PNG/WebP, max 5MB, server-side
- All secret keys are server-only (`SUPABASE_SERVICE_ROLE_KEY` never exposed to client)

---

## 🌍 Internationalization

- Default locale: **Arabic** (`/ar/...`)
- Secondary locale: **English** (`/en/...`)
- RTL layout automatically applied for Arabic
- Language switcher in header — no full page reload
- All strings in `/messages/ar.json` and `/messages/en.json`

---

## 🚢 Deploy to Netlify

1. Push to GitHub
2. Connect repo in Netlify dashboard
3. Add environment variables (same as `.env.local`)
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Install the **@netlify/plugin-nextjs** plugin (already in `netlify.toml`)

---

## 📦 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework, SSR, routing |
| Tailwind CSS | Styling |
| Supabase | DB, Auth, Storage |
| TanStack Query v5 | Client-side data fetching/caching |
| next-intl | Internationalization (AR + EN) |
| next-themes | Dark/light theme |
| react-hook-form + zod | Form validation |
| sonner | Toast notifications |
| framer-motion | Animations |
| lucide-react | Icons |

---

## 📄 License

MIT © yur.scrub 2025
# yur-scrub-vibe

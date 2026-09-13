# The Dressing Up Games

Free dress-up, makeup, and fashion games at [thedressingupgames.com](https://www.thedressingupgames.com). Same platform as the original browser-games site, with a separate brand, database, and original copy.

## Prerequisites

- Node.js 20+
- MySQL

## Setup

1. **Install dependencies**

```bash
cd thedressingupgames
npm install
```

2. **Configure environment**

```bash
cp .env.example .env
```

Edit `.env` with a **new** MySQL database named `the_dressing_up_games` (never copy or reuse the ZenFun Games database), `NEXT_PUBLIC_SITE_URL=https://www.thedressingupgames.com`, `NEXT_PUBLIC_CONTACT_EMAIL=hello@thedressingupgames.com`, and a random `AUTH_SECRET`. Seed overwrites Contact, Terms, Privacy, Parents, and DMCA so leftover ZenFun text cannot stay.

3. **Run migrations and seed**

```bash
npx prisma migrate dev
npm run db:seed
```

Seed creates dress-up categories (Dress Up, Makeup, Fashion, Salon, Princess, Wedding, Celebrity) and no demo action games. Add titles in the admin panel.

4. **Start dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Default admin account

After seeding:

- **Username:** `admin`
- **Password:** `admin123`

Change this password before going to production.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed categories, admin user, legal stubs |
| `npm run db:studio` | Open Prisma Studio |

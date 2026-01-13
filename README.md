# Premium Textiles Manufacturing - B2B Website

A production-ready B2B website for high-volume textile/garment manufacturers. Built with Next.js, Supabase, Drizzle ORM, and shadcn/ui.

## Features

### Public Website
- 🏭 Industrial, manufacturing-grade design language
- 📦 Product catalogue with MOQ, lead times, size ranges
- 🧵 Fabric options showcase
- 📊 Production capacity statistics
- 📝 Multi-step enquiry form (no auth required)

### Admin Panel
- 🔐 Supabase Auth protected
- 📋 Catalogue management (CRUD)
- 🧵 Fabrics management (CRUD)
- 💬 Enquiry management with status tracking
- ⚙️ Site settings and section visibility controls
- 📸 Image upload to Supabase Storage

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **UI**: shadcn/ui + Tailwind CSS
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables (see below)

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_connection_string

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=enquiries@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase Setup

1. Create a new Supabase project
2. Copy credentials to `.env.local`
3. Run `npm run db:push` to create tables
4. Create an admin user in Supabase Dashboard (Authentication → Users)
5. Create an `images` storage bucket (set to Public)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Project Structure

```
src/
├── app/
│   ├── (public)/       # Public pages (home, enquiry)
│   ├── admin/          # Admin panel
│   └── api/            # API routes
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── public/         # Public website components
│   └── admin/          # Admin components
├── lib/
│   ├── db/             # Drizzle schema and client
│   ├── services/       # Business logic
│   └── supabase/       # Supabase clients
└── types/              # TypeScript types
```

## Architecture

- **Frontend never accesses Supabase directly**
- All database operations go through Next.js API routes
- Clear service layer for business logic
- Middleware protects admin routes
- Environment variables properly separated (public vs server)

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Migrating to Client's Supabase

1. Create new Supabase project
2. Update environment variables
3. Run `npm run db:push`
4. Create admin user
5. Create `images` storage bucket
6. Deploy

## License

Private - All rights reserved

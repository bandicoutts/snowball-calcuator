# Snowball Debt Calculator

A web application to help you pay off debt using the snowball and avalanche methods.

## Features

- **Secure Authentication**: Login with email and password using Supabase Auth
- **Debt Management**: Add, edit, and delete your debts with balance, minimum payment, and APR
- **Smart Calculations**: Compare snowball (smallest balance first) vs avalanche (highest interest first) methods
- **Visual Analytics**: Interactive charts showing debt payoff over time
- **Payment Schedule**: Detailed month-by-month breakdown of payments, interest, and principal
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd snowball-calculator
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to **Project Settings** > **API**
4. Copy the **Project URL** and **anon/public key**

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the query to create tables and RLS policies

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **Charts**: Recharts
- **Form Validation**: Zod + React Hook Form
- **Deployment**: Vercel

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth routes (login, signup)
│   ├── (protected)/       # Protected routes (dashboard, debts, results)
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── debt/             # Debt-specific components
│   └── charts/           # Visualization components
├── lib/                   # Utility functions and services
│   ├── supabase/         # Supabase client configuration
│   └── calculations/     # Debt calculation logic
└── types/                # TypeScript type definitions
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Security Features

- Row Level Security (RLS) ensures users can only access their own data
- All mutations are validated server-side
- Secure password requirements enforced by Supabase Auth
- Environment variables for sensitive keys

## License

ISC

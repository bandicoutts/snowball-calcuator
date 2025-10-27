# Setup Guide for Snowball Debt Calculator

This guide will walk you through setting up the Snowball Debt Calculator from scratch.

## Prerequisites

- Node.js 18+ installed
- A GitHub account (for deployment)
- A Supabase account (free tier is fine)
- A Vercel account (free tier is fine)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - Name: `snowball-calculator` (or your preferred name)
   - Database Password: Create a strong password (save this!)
   - Region: Choose the closest to your users
4. Click "Create new project" and wait for it to be ready (1-2 minutes)

### 2.2 Get Your API Credentials

1. In your Supabase dashboard, go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the left menu
3. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key under "Project API keys")

### 2.3 Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` in this project
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** to execute the SQL
6. You should see success messages for all the tables, policies, and functions created

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values with your actual Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the landing page!

## Step 5: Test the Application

1. Click **Sign Up** and create an account
2. Log in with your new credentials
3. Add some test debts:
   - Example 1: Credit Card - $5,000 balance, $150 minimum, 18.99% APR
   - Example 2: Student Loan - $15,000 balance, $200 minimum, 4.5% APR
   - Example 3: Car Loan - $8,000 balance, $250 minimum, 6.5% APR
4. Set an extra monthly payment (e.g., $300)
5. Navigate to **Results** to see your payoff strategy!

## Step 6: Deploy to Vercel

### 6.1 Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit - Snowball debt calculator"
   git remote add origin https://github.com/yourusername/snowball-calculator.git
   git push -u origin main
   ```

### 6.2 Deploy with Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New...** → **Project**
3. Import your `snowball-calculator` repository
4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./`
   - Click **Environment Variables**
   - Add your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**
6. Wait for deployment to complete (2-3 minutes)
7. Your app is now live! You'll get a URL like `https://snowball-calculator.vercel.app`

## Step 7: Configure Supabase for Production

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

## Troubleshooting

### Build Fails on Vercel

- Make sure you've added the environment variables in Vercel
- Check that your Supabase URL starts with `https://`
- Verify the anon key is correct (no extra spaces)

### Can't Log In

- Check that the database schema was created successfully
- Verify RLS policies are enabled
- Make sure environment variables are set correctly

### Charts Not Showing

- Check browser console for errors
- Ensure you have debts added and an extra payment set
- Try refreshing the page

### Database Errors

- Verify the SQL schema was run successfully
- Check that RLS policies are enabled
- Ensure you're logged in with a valid user

## Security Best Practices

✅ **Implemented:**
- Row Level Security (RLS) on all tables
- Server-side validation
- Secure password requirements (handled by Supabase)
- Environment variables for sensitive keys
- HTTPS enforced in production

⚠️ **Additional Recommendations:**
- Enable 2FA on your Supabase account
- Regularly update dependencies: `npm update`
- Monitor your Supabase usage dashboard
- Set up email notifications in Supabase for security events

## Next Steps

Now that your app is deployed, you can:

1. **Customize the styling** - Edit `tailwind.config.ts` and component styles
2. **Add more features**:
   - Export payment schedule to CSV
   - Email reminders for payments
   - Goal tracking and milestones
   - Multiple user profiles
3. **Set up a custom domain** in Vercel settings
4. **Add analytics** to track usage

## Support

If you encounter issues:

1. Check the Supabase logs in the dashboard
2. Check Vercel deployment logs
3. Review the browser console for errors
4. Verify all environment variables are set correctly

## License

ISC

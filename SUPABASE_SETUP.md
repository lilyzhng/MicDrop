# Supabase Setup Guide for MicDrop

This guide will help you set up Supabase for authentication and database storage.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in with your GitHub account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: MicDrop (or whatever you prefer)
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose the closest region to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Enable Google Authentication

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click on it
3. Toggle **"Enable Sign in with Google"** to ON
4. You'll need to set up Google OAuth credentials:
   
   ### Get Google OAuth Credentials:
   a. Go to [Google Cloud Console](https://console.cloud.google.com/)
   b. Create a new project or select an existing one
   c. Go to **APIs & Services** → **Credentials**
   d. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
   e. Configure the OAuth consent screen (if prompted)
   f. For Application type, select **"Web application"**
   g. Add these **Authorized redirect URIs**:
      ```
      https://your-project-ref.supabase.co/auth/v1/callback
      ```
      (Replace `your-project-ref` with your actual Supabase project reference - found in your Supabase project settings)
   h. Click **Create**
   i. Copy the **Client ID** and **Client Secret**

5. Back in Supabase, paste the **Client ID** and **Client Secret** into the Google provider settings
6. Click **Save**

## Step 3: Get Your Supabase API Keys

1. In your Supabase project, click the **Settings** (gear icon) at the bottom left
2. Go to **API** settings
3. You'll see:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)
4. Copy both of these values

## Step 4: Update Your `.env.local` File

Open `/Users/lilyzhang/Desktop/MicDrop/.env.local` and update it with your values:

```bash
# Gemini API Configuration
VITE_GEMINI_API_KEY=your_actual_gemini_api_key

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Run the Database Migration

1. In your Supabase project dashboard, click on **SQL Editor** (on the left sidebar)
2. Click **"New query"**
3. Open the file `supabase-migration.sql` in your project root
4. Copy ALL the SQL code from that file
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" (this is good!)

This creates two tables:
- `saved_items` - for your saved snippets (scripts, responses, tips)
- `saved_reports` - for your performance analysis reports

## Step 6: Verify the Setup

1. In Supabase, go to **Table Editor**
2. You should see two tables: `saved_items` and `saved_reports`
3. Both should have Row Level Security (RLS) enabled (🔒 icon)

## Step 7: Test Your Application

1. Stop your dev server if it's running (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173)
4. Click **"Sign in with Google"**
5. You should be redirected to Google's login page
6. After signing in, you'll be redirected back to your app
7. Try saving a snippet or running an analysis - it should now persist in Supabase!

## Troubleshooting

### "Invalid API key" error
- Double-check your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env.local`

### Google Sign-in not working
- Make sure you added the correct redirect URI in Google Cloud Console
- Check that the Google provider is enabled in Supabase
- Verify Client ID and Client Secret are correct

### Data not saving
- Check the browser console for errors
- Go to Supabase → Table Editor → check if tables exist
- Go to Supabase → SQL Editor → run: `SELECT * FROM saved_items;` to verify

### Row Level Security errors
- Make sure you're signed in
- The RLS policies only allow users to see their own data
- Check the Supabase logs for specific error messages

## Next Steps

✅ Your data is now stored in a real PostgreSQL database!
✅ User authentication is handled by Supabase
✅ Each user can only see their own data (thanks to Row Level Security)
✅ Your data persists across devices and browsers

## Data Migration (Optional)

If you had data in localStorage before, it won't automatically migrate to Supabase. You can:
1. Manually re-create important items, or
2. Export localStorage data and import it into Supabase using the SQL Editor

---

**Need Help?** Check the Supabase docs at [https://supabase.com/docs](https://supabase.com/docs)


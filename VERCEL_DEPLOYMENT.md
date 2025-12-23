# Vercel Deployment Guide for MicDrop

## Prerequisites
- GitHub account with the MicDrop repository
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase project with the database schema already set up

## Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." → "Project"
3. Find and import your `MicDrop` repository
4. Vercel will automatically detect it's a Vite project

## Step 2: Configure Build Settings

Vercel should auto-detect these settings, but verify they're correct:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Step 3: Add Environment Variables

Before deploying, add these environment variables in the Vercel project settings:

### Required Variables:

1. **`VITE_SUPABASE_URL`**
   - Get this from your Supabase project settings
   - Format: `https://your-project.supabase.co`

2. **`VITE_SUPABASE_ANON_KEY`**
   - Get this from Supabase → Settings → API → Project API keys → `anon` `public`
   - This is safe to use in the browser

3. **`VITE_GEMINI_API_KEY`** (if using Google Gemini AI)
   - Your Google AI Studio API key

### How to Add Variables in Vercel:
- In your Vercel project dashboard
- Go to Settings → Environment Variables
- Add each variable for all environments (Production, Preview, Development)

## Step 4: Update Supabase Settings

In your Supabase project dashboard:

1. Go to **Authentication → URL Configuration**
2. Add your Vercel deployment URLs to **Redirect URLs**:
   - `https://your-project.vercel.app/**`
   - `https://*.vercel.app/**` (for preview deployments)

3. Update **Site URL** to your production Vercel URL:
   - `https://your-project.vercel.app`

## Step 5: Deploy!

1. Click "Deploy" in Vercel
2. Wait for the build to complete (~1-2 minutes)
3. Once deployed, click "Visit" to see your live site

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Test the login/signup flow
3. Test recording and analysis
4. Verify that reports are being saved to Supabase

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Review the build logs in Vercel for specific errors

### Authentication Not Working
- Verify Supabase redirect URLs are configured correctly
- Check that environment variables are set for the correct environment

### API Errors
- Check browser console for specific error messages
- Verify Supabase anon key has correct permissions
- Check that RLS (Row Level Security) policies are set up correctly

## Automatic Deployments

Now that your project is connected:
- Every push to `main` branch will trigger a production deployment
- Pull requests will get preview deployments automatically
- You can see deployment status in GitHub and Vercel

## Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel project → Settings → Domains
2. Add your domain
3. Follow Vercel's instructions to configure DNS

---

## Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard
**Supabase Dashboard:** https://app.supabase.com
**GitHub Repository:** https://github.com/lilyzhng/MicDrop

## Environment Variables Summary

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

---

Happy deploying! 🚀

# Vercel Deployment Setup Guide

## Required Environment Variables

To deploy this project to Vercel, you need to set the following environment variables in your Vercel project settings:

### 1. Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Cloudinary Variables
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## How to Add Environment Variables in Vercel

### Option 1: Via Vercel Dashboard
1. Go to your project on Vercel: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Your actual value
   - **Environments**: Select Production, Preview, and Development
5. Click **Save**
6. Redeploy your project

### Option 2: Via Vercel CLI
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```

## Where to Find Your Values

### Supabase:
1. Go to your Supabase project: https://app.supabase.com
2. Click on **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Cloudinary:
1. Go to your Cloudinary dashboard: https://cloudinary.com/console
2. Copy:
   - **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
3. For upload preset:
   - Go to **Settings** → **Upload**
   - Create an unsigned upload preset
   - Copy the preset name → `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## After Setting Variables

1. Go to **Deployments** tab in Vercel
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Check the box "Use existing Build Cache"
5. Click **Redeploy**

Your deployment should now succeed! ✅

## Troubleshooting

If you still get errors:
1. Verify all environment variables are set correctly
2. Make sure you selected all environments (Production, Preview, Development)
3. Check that there are no extra spaces in your variable values
4. Ensure your Supabase database migrations have been run
5. Check Vercel deployment logs for specific errors

## Database Migrations

Don't forget to run the database migrations in Supabase:
1. Go to Supabase SQL Editor
2. Run the migration files in order:
   - `migrations/010_create_reusable_components.sql`
   - `migrations/011_create_component_instances.sql`

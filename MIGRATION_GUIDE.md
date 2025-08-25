# Migration Guide: Payload CMS → Supabase + Cloudinary

This guide documents the migration from Payload CMS to Supabase + Cloudinary for the Islamic School website.

## Overview

- **Database**: SQLite (Payload) → PostgreSQL (Supabase)
- **Media**: Local filesystem → Cloudinary CDN
- **Admin Interface**: Custom admin panel with direct database integration
- **MCP Integration**: Supabase and Cloudinary MCP servers for AI-assisted management

## Prerequisites

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys
3. Run the database schema: Copy contents of `supabase/schema.sql` to Supabase SQL Editor

### 2. Cloudinary Setup
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Set up upload presets for automatic optimization

### 3. Environment Variables
Update `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# MCP Server Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Migration Steps

### 1. Database Migration
```bash
# Run the data migration script
npm run migrate-data
```

This script will:
- ✅ Migrate school information
- ✅ Migrate programs and additional programs
- ✅ Migrate news articles
- ✅ Migrate achievements
- ✅ Migrate events (if present)
- ✅ Migrate staff/faculty (if present)

### 2. Media Migration
Upload existing media files to Cloudinary using the upload API:
```bash
# Manual upload via admin panel at /admin
# Or use Cloudinary's bulk upload tools
```

### 3. Update References
- Image paths in database will be updated to Cloudinary URLs
- Old `/uploads/` paths replaced with Cloudinary URLs

## New Architecture

### Database Tables (Supabase)
- `school_info` - School information and contact details
- `programs` - Educational programs
- `additional_programs` - Weekend school, sports, etc.
- `news` - News articles and updates
- `events` - School events and activities
- `staff` - Faculty and staff profiles
- `achievements` - Hero section achievements
- `media` - Cloudinary media references

### API Routes
- `GET/POST /api/school-info` - School information
- `GET/POST /api/programs` - Programs management
- `GET/POST /api/news` - News articles
- `GET/POST /api/achievements` - Achievements management
- `POST /api/upload` - File upload to Cloudinary

### MCP Integration
- **Supabase MCP Server**: Database operations, queries, table management
- **Cloudinary MCP Server**: Asset management, transformations, optimization

## Benefits of New Stack

### Performance
- ✅ PostgreSQL provides better performance than SQLite
- ✅ Cloudinary CDN delivers optimized images globally
- ✅ Real-time capabilities with Supabase

### Scalability
- ✅ No file size limitations
- ✅ Automatic image optimization
- ✅ Better concurrent user support

### Developer Experience
- ✅ AI-assisted content management via MCP
- ✅ Type-safe database operations
- ✅ Modern APIs and tooling

### Media Management
- ✅ Automatic image optimization
- ✅ Responsive image delivery
- ✅ Advanced transformations
- ✅ AI-powered analysis and tagging

## Rollback Plan

If issues occur, rollback steps:
1. Restore `.env.local` with Payload configuration
2. Reinstall Payload dependencies
3. Restore `payload.config.ts`
4. Switch back to original API routes

## Testing

After migration, verify:
- [ ] Homepage loads with correct data
- [ ] Programs section displays properly
- [ ] News articles appear correctly
- [ ] Admin panel functions work
- [ ] Image uploads work through Cloudinary
- [ ] MCP servers respond correctly

## Support

- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Cloudinary**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **MCP Servers**: Check individual server documentation
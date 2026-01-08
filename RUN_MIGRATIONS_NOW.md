# 🚀 Run These Migrations to Complete Unification

## Option A: Supabase Dashboard (Recommended)

### Step 1: Run Schema Migration (029)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of:
   `migrations/029_add_component_id_to_blocks.sql`
5. Click **Run** or press Cmd/Ctrl+Enter
6. Verify success (should see "Success" message)

### Step 2: Run Data Migration

After the schema migration succeeds, run the data migration script:

```bash
npx tsx scripts/migrate-component-blocks.ts
```

This will:
- Find all components with `blocks_config` JSON
- Create database rows in `content_blocks` table
- Link them via `component_id`
- Clear the `blocks_config` field

---

## Option B: Command Line (Alternative)

If you have direct PostgreSQL access, you can run:

```bash
# Connect to your database
psql $DATABASE_URL

# Run the migration file
\i migrations/029_add_component_id_to_blocks.sql
```

Then run the data migration:

```bash
npx tsx scripts/migrate-component-blocks.ts
```

---

## ⚠️ Important Notes

1. **Backup First**: Although the migration is safe, it's always good to have a backup
2. **Order Matters**: Run schema migration (029) BEFORE data migration
3. **Check Results**: After data migration, verify components load correctly in admin

---

## What Happens After Migrations

Once both migrations complete:

✅ Components will use the **same database system** as pages
✅ You can add **Columns blocks** to components
✅ **All block types** will work in components
✅ **Nested blocks** fully supported in components
✅ Better performance and consistency

---

## Verification

After running both migrations, verify by:

1. Go to `/admin/components`
2. Click "Edit Blocks" on any component
3. Try adding a **Columns Layout** block
4. Add nested blocks inside the columns
5. Save and verify it works!

---

**Ready to run?** Start with the Supabase Dashboard (Option A Step 1)

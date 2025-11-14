-- Database Diagnostic Script
-- Run this to check database status

-- 1. Check if navigation_items table exists
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'navigation_items'
    )
    THEN '✅ navigation_items table EXISTS'
    ELSE '❌ navigation_items table MISSING - Run migration 001'
  END as navigation_table_status;

-- 2. Check if pages table exists
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'pages'
    )
    THEN '✅ pages table EXISTS'
    ELSE '❌ pages table MISSING - Run migration 002'
  END as pages_table_status;

-- 3. Check if is_reusable column exists
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'pages' AND column_name = 'is_reusable'
    )
    THEN '✅ is_reusable column EXISTS'
    ELSE '❌ is_reusable column MISSING - Run migration 004'
  END as reusable_column_status;

-- 4. Count navigation items (if table exists)
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'navigation_items')
    THEN (SELECT COUNT(*)::text || ' navigation items' FROM navigation_items)
    ELSE 'Table does not exist'
  END as navigation_count;

-- 5. Count pages (if table exists)
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages')
    THEN (SELECT COUNT(*)::text || ' pages' FROM pages)
    ELSE 'Table does not exist'
  END as pages_count;

-- 6. Summary
SELECT
  '=== SUMMARY ===' as info,
  (SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'navigation_items') THEN 'YES' ELSE 'NO' END) as has_navigation_table,
  (SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN 'YES' ELSE 'NO' END) as has_pages_table,
  (SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'is_reusable') THEN 'YES' ELSE 'NO' END) as has_is_reusable;

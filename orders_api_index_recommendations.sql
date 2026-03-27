# Database Index Recommendations for Orders API

To maximize performance for the Orders API, especially with large datasets, add the following indexes in your Supabase/Postgres database:

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);

-- Index for created_at sorting and filtering
CREATE INDEX IF NOT EXISTS idx_sites_created_at ON sites(created_at DESC);

-- Index for expires_at filtering
CREATE INDEX IF NOT EXISTS idx_sites_expires_at ON sites(expires_at);

-- Index for website_name and slug search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_sites_website_name_lower ON sites(LOWER(website_name));
CREATE INDEX IF NOT EXISTS idx_sites_slug_lower ON sites(LOWER(slug));

-- If you have a customer column used for search:
-- CREATE INDEX IF NOT EXISTS idx_sites_customer_lower ON sites(LOWER(customer));

-- Composite index for common queries (optional, if you filter/sort by multiple columns together):
-- CREATE INDEX IF NOT EXISTS idx_sites_status_created_at ON sites(status, created_at DESC);

-- After creating indexes, run ANALYZE to update statistics:
ANALYZE sites;

# Usage
- Run these SQL statements in your Supabase SQL editor or psql.
- Adjust column names if your schema differs.
- These indexes will speed up filtering, searching, and sorting for the Orders API.

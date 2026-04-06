-- Find duplicate slugs
SELECT slug, COUNT(*) as count
FROM sites
GROUP BY slug
HAVING COUNT(*) > 1;

-- Find duplicate website_names
SELECT website_name, COUNT(*) as count
FROM sites
GROUP BY website_name
HAVING COUNT(*) > 1;

-- Remove duplicate slugs, keeping the lowest id
DELETE FROM sites
WHERE slug IN (
  SELECT slug FROM sites GROUP BY slug HAVING COUNT(*) > 1
)
AND id NOT IN (
  SELECT MIN(id) FROM sites GROUP BY slug HAVING COUNT(*) > 1
);

-- Remove duplicate website_names, keeping the lowest id
DELETE FROM sites
WHERE website_name IN (
  SELECT website_name FROM sites GROUP BY website_name HAVING COUNT(*) > 1
)
AND id NOT IN (
  SELECT MIN(id) FROM sites GROUP BY website_name HAVING COUNT(*) > 1
);

-- Add unique constraint to slug
ALTER TABLE sites ADD CONSTRAINT unique_slug UNIQUE (slug);

-- Add unique constraint to website_name
ALTER TABLE sites ADD CONSTRAINT unique_website_name UNIQUE (website_name);

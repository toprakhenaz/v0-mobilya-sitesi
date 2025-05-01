-- Find duplicate categories based on slug
WITH duplicate_slugs AS (
  SELECT slug
  FROM categories
  GROUP BY slug
  HAVING COUNT(*) > 1
)

-- Display the duplicates for review
SELECT id, name, slug, description
FROM categories
WHERE slug IN (SELECT slug FROM duplicate_slugs)
ORDER BY slug, id;

-- Keep only one category per slug (the one with the lowest ID)
DELETE FROM categories
WHERE id IN (
  SELECT c.id
  FROM categories c
  JOIN (
    SELECT slug, MIN(id) as min_id
    FROM categories
    GROUP BY slug
    HAVING COUNT(*) > 1
  ) m ON c.slug = m.slug
  WHERE c.id != m.min_id
);

-- Verify the results
SELECT id, name, slug, description
FROM categories
ORDER BY slug;

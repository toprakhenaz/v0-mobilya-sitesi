CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Add an index for faster lookups by product_id
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Example of how to insert a record
-- INSERT INTO product_images (product_id, url, is_primary) VALUES (1, '/products/example.jpg', true);

-- product_images tablosunu oluştur
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON product_images(product_id);
CREATE INDEX IF NOT EXISTS product_images_is_primary_idx ON product_images(is_primary);

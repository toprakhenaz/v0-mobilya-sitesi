-- Create order_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_images_order_id ON order_images(order_id);

-- Add comment to table
COMMENT ON TABLE order_images IS 'Stores images related to orders, such as delivery confirmations';

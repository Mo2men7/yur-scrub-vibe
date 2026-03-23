-- =============================================
-- yur.scrub Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

CREATE TYPE payment_method AS ENUM ('cod', 'bank_transfer');

CREATE TYPE order_status AS ENUM (
  'pending',
  'awaiting_confirmation',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled'
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================

CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  description_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price         NUMERIC(10, 2) NOT NULL,
  images        TEXT[] NOT NULL DEFAULT '{}',
  sizes         TEXT[] NOT NULL DEFAULT '{}',
  colors        TEXT[] NOT NULL DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================

CREATE TABLE orders (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id               UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  customer_name            TEXT NOT NULL,
  customer_email           TEXT NOT NULL,
  customer_phone           TEXT NOT NULL,
  delivery_address         TEXT NOT NULL,
  size                     TEXT NOT NULL,
  color                    TEXT NOT NULL,
  payment_method           payment_method NOT NULL,
  transfer_screenshot_url  TEXT,
  status                   order_status NOT NULL DEFAULT 'pending',
  total_price              NUMERIC(10, 2) NOT NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: public can read active products
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

-- Products: authenticated admin can do everything
CREATE POLICY "Admin full access to products"
  ON products FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Orders: public can insert orders
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Orders: authenticated admin can do everything
CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage buckets (run via Supabase dashboard or API)
-- 1. product-images  (public)
-- 2. transfer-screenshots (private, admin access only)

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE);

INSERT INTO storage.buckets (id, name, public)
VALUES ('transfer-screenshots', 'transfer-screenshots', FALSE);

-- Storage policies for product-images
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Storage policies for transfer-screenshots
CREATE POLICY "Anyone can upload transfer screenshots"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'transfer-screenshots');

CREATE POLICY "Admin can view transfer screenshots"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'transfer-screenshots');

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

INSERT INTO products (name_ar, name_en, description_ar, description_en, price, sizes, colors, images)
VALUES
  (
    'سكراب كلاسيك أزرق',
    'Classic Blue Scrub',
    'سكراب طبي كلاسيكي بلون أزرق مريح، مصنوع من قماش عالي الجودة يضمن الراحة طوال اليوم.',
    'Classic medical scrub in a comfortable blue color, made from high-quality fabric ensuring all-day comfort.',
    450,
    ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['#1B4F72', '#2E86C1', '#85C1E9'],
    ARRAY[]::text[]
  ),
  (
    'سكراب بريميوم أبيض',
    'Premium White Scrub',
    'سكراب طبي فاخر باللون الأبيض النقي، تصميم أنيق يناسب المناسبات الرسمية والعمل اليومي.',
    'Premium medical scrub in pure white, elegant design suitable for formal occasions and daily work.',
    520,
    ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['#FFFFFF', '#F0F3F4', '#E8E8E8'],
    ARRAY[]::text[]
  ),
  (
    'سكراب سبورت أخضر',
    'Sport Green Scrub',
    'سكراب رياضي بلون أخضر حيوي، مثالي للحركة المستمرة وساعات العمل الطويلة.',
    'Sport scrub in vibrant green, perfect for continuous movement and long working hours.',
    480,
    ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['#1E8449', '#27AE60', '#A9DFBF'],
    ARRAY[]::text[]
  );

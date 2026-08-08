-- Phase 6 Migration: Apply these changes to the running hooks_knots database
-- Run this via your MySQL client when connected to the hooks_knots database

USE hooks_knots;

-- Add discount column to orders (if not already present)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add shipping snapshot columns to orders (if not already present)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address VARCHAR(500);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_state VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_pincode VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100);

-- Update status default to uppercase PENDING
ALTER TABLE orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PENDING';

-- Add performance indexes (errors suppressed if already exist via CREATE INDEX IF NOT EXISTS)
-- Note: MySQL 8.0+ supports this syntax
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at ON orders(placed_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);

SELECT 'Phase 6 migration complete.' AS status;

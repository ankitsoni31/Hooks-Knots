-- Hooks-Knots database schema

CREATE DATABASE IF NOT EXISTS hooks_knots;
USE hooks_knots;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  theme VARCHAR(50) NOT NULL DEFAULT 'light',
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  stock INT NOT NULL DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  file_path VARCHAR(1024) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  otp_hash VARCHAR(255),
  otp_expires_at TIMESTAMP NULL,
  otp_attempts INT NOT NULL DEFAULT 0,
  last_otp_sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  address_type VARCHAR(50) NOT NULL DEFAULT 'shipping',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE',
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMP NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  address_id INT NOT NULL,
  coupon_id INT NULL,
  order_number VARCHAR(100) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  -- Shipping snapshot: preserves address at time of order
  shipping_name VARCHAR(255),
  shipping_phone VARCHAR(50),
  shipping_address VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_pincode VARCHAR(20),
  shipping_country VARCHAR(100),
  placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  payment_method VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_addresses_customer_id ON addresses(customer_id);

-- Default Admin
INSERT IGNORE INTO admins (email, password_hash, first_name, last_name, role)
VALUES ('admin@gmail.com', '$2b$10$6.gSURno/L6W6eF/b11Quup9nPEIaaxeOQip8To4zpN7YBSdODUgO', 'Admin', 'User', 'admin');

-- Default User
INSERT IGNORE INTO customers (email, password_hash, first_name, last_name, is_verified)
VALUES ('user@gmail.com', '$2b$10$6.gSURno/L6W6eF/b11Quup9nPEIaaxeOQip8To4zpN7YBSdODUgO', 'Yash', 'User', TRUE);

-- Hooks-Knots initial seed data

USE hooks_knots;

INSERT IGNORE INTO categories (name, slug, description)
VALUES
  ('Blankets', 'blankets', 'Soft and cozy crochet blankets'),
  ('Accessories', 'accessories', 'Handmade crochet accessories'),
  ('Home Decor', 'home-decor', 'Decorative crochet items for the home');

-- Development-only admin credentials
-- Email: admin@example.com
-- Password: development-only-password
INSERT IGNORE INTO admins (email, password_hash, first_name, last_name, role)
VALUES
  ('admin@example.com', '$2b$10$DOdptAvw1Y.BumwdOUwlhOELiN0IrGHdROYX4qyOnPXlWxgS761c6', 'Admin', 'User', 'admin');

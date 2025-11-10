-- ========================
-- SmartPark Database Seed
-- ========================

-- Clean up tables (reset order matters for foreign keys)
TRUNCATE TABLE slots RESTART IDENTITY CASCADE;
TRUNCATE TABLE parking_lots RESTART IDENTITY CASCADE;
TRUNCATE TABLE buildings RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE admins RESTART IDENTITY CASCADE;

-- ========================
-- Insert Admins
-- ========================
INSERT INTO admins (username, password_hash)
VALUES
  ('admin1', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'), -- password: password
  ('admin2', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'), 
  ('admin3', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa');

-- ========================
-- Insert Users
-- ========================
INSERT INTO users (username, password_hash)
VALUES
  ('user0', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user1', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user2', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user3', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user4', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user5', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user6', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user7', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user8', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa'),
  ('user9', '$2a$04$qoojgjKNufH8F4HQ7Xs0Q.X/NY4Gxl1AzO.Ro7cXqz2VvsPe84XHa');

-- ========================
-- Insert Buildings
-- ========================
INSERT INTO buildings (name)
VALUES
  ('Main Mall'),
  ('Tech Plaza'),
  ('Central Hospital');

-- ========================
-- Insert Parking Lots
-- ========================
INSERT INTO parking_lots (building_id, floor_name)
VALUES
  (1, 'B1'),
  (1, 'B2'),
  (2, 'L1'),
  (2, 'L2'),
  (3, 'P1'),
  (3, 'P2');

-- ========================
-- Insert Slots
-- ========================
-- Main Mall - B1 (Lot 1)
INSERT INTO slots (lot_id, x, y, occupancy_status) VALUES
  (1, 1, 1, 'AVAILABLE'),
  (1, 2, 1, 'OCCUPIED'),
  (1, 3, 1, 'AVAILABLE'),
  (1, 4, 1, 'OCCUPIED'),
  (1, 5, 1, 'AVAILABLE'),
  (1, 1, 2, 'AVAILABLE'),
  (1, 2, 2, 'OCCUPIED'),
  (1, 3, 2, 'AVAILABLE'),
  (1, 4, 2, 'OCCUPIED'),
  (1, 5, 2, 'AVAILABLE');

-- Main Mall - B2 (Lot 2)
INSERT INTO slots (lot_id, x, y, occupancy_status) VALUES
  (2, 1, 1, 'AVAILABLE'),
  (2, 2, 1, 'AVAILABLE'),
  (2, 3, 1, 'OCCUPIED'),
  (2, 4, 1, 'AVAILABLE'),
  (2, 5, 1, 'OCCUPIED'),
  (2, 1, 2, 'OCCUPIED'),
  (2, 2, 2, 'AVAILABLE'),
  (2, 3, 2, 'AVAILABLE'),
  (2, 4, 2, 'OCCUPIED'),
  (2, 5, 2, 'AVAILABLE');

-- Tech Plaza - L1 (Lot 3)
INSERT INTO slots (lot_id, x, y, occupancy_status) VALUES
  (3, 1, 1, 'AVAILABLE'),
  (3, 2, 1, 'AVAILABLE'),
  (3, 3, 1, 'AVAILABLE'),
  (3, 4, 1, 'OCCUPIED'),
  (3, 5, 1, 'AVAILABLE'),
  (3, 1, 2, 'OCCUPIED'),
  (3, 2, 2, 'AVAILABLE'),
  (3, 3, 2, 'OCCUPIED'),
  (3, 4, 2, 'AVAILABLE'),
  (3, 5, 2, 'AVAILABLE');

-- Tech Plaza - L2 (Lot 4)
INSERT INTO slots (lot_id, x, y, occupancy_status) VALUES
  (4, 1, 1, 'AVAILABLE'),
  (4, 2, 1, 'AVAILABLE'),
  (4, 3, 1, 'OCCUPIED'),
  (4, 4, 1, 'OCCUPIED'),
  (4, 5, 1, 'AVAILABLE'),
  (4, 1, 2, 'AVAILABLE'),
  (4, 2, 2, 'OCCUPIED'),
  (4, 3, 2, 'AVAILABLE'),
  (4, 4, 2, 'AVAILABLE'),
  (4, 5, 2, 'OCCUPIED');

-- Central Hospital - P1 (Lot 5)
INSERT INTO slots (lot_id, x, y, occupancy_status) VALUES
  (5, 1, 1, 'AVAILABLE'),
  (5, 2, 1, 'OCCUPIED'),
  (5, 3, 1, 'AVAILABLE'),
  (5, 4, 1, 'AVAILABLE'),
  (5, 5, 1, 'OCCUPIED'),
  (5, 1, 2, 'AVAILABLE'),
  (5, 2, 2, 'AVAILABLE'),
  (5, 3, 2, 'OCCUPIED'),
  (5, 4, 2, 'AVAILABLE'),
  (5, 5, 2, 'AVAILABLE');

-- Central Hospital - P2 (Lot 6)
INSERT INTO slots (lot_id, x, y, occupancy_status) VALUES
  (6, 1, 1, 'AVAILABLE'),
  (6, 2, 1, 'AVAILABLE'),
  (6, 3, 1, 'OCCUPIED'),
  (6, 4, 1, 'AVAILABLE'),
  (6, 5, 1, 'AVAILABLE'),
  (6, 1, 2, 'OCCUPIED'),
  (6, 2, 2, 'AVAILABLE'),
  (6, 3, 2, 'AVAILABLE'),
  (6, 4, 2, 'AVAILABLE'),
  (6, 5, 2, 'OCCUPIED');
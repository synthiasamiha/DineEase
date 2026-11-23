-- DineEase database
-- Run this file once to create the database, all tables and sample menu data.

CREATE DATABASE IF NOT EXISTS dineease
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dineease;

-- Remove old tables first (children before parents), so the file can be run again
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Users: customers and admins
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Menu items
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(8,2) NOT NULL,
  image VARCHAR(255),
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Items inside each order
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Table reservations
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INT NOT NULL,
  status ENUM('pending', 'approved', 'cancelled') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Messages from the contact form
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data: categories
INSERT INTO categories (name) VALUES
  ('Starter'),
  ('Main'),
  ('Fast Food'),
  ('Dessert'),
  ('Drinks');

-- Sample data: menu items (category ids: 1 Starter, 2 Main, 3 Fast Food, 4 Dessert, 5 Drinks)
INSERT INTO menu_items (category_id, name, description, price) VALUES
  (2, 'Chicken Biryani', 'Fragrant rice with spiced chicken', 250),
  (2, 'Grilled Fish', 'Served with salad and sauce', 380),
  (3, 'Beef Burger', 'Juicy patty, cheese, fresh veggies', 220),
  (3, 'Margherita Pizza', 'Tomato, mozzarella and basil', 450),
  (1, 'Chicken Soup', 'Warm and light', 150),
  (1, 'French Fries', 'Crispy and golden', 120),
  (4, 'Chocolate Cake', 'Rich and soft', 180),
  (5, 'Mango Lassi', 'Cold and creamy', 90);

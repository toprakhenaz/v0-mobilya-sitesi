import sqlite3 from "sqlite3"
import { open } from "sqlite"

// SQLite veritabanı bağlantısını oluştur
export async function openDb() {
  return open({
    filename: "./data.db", // SQLite veritabanı dosyası
    driver: sqlite3.Database,
  })
}

// Veritabanını başlat
export async function initDb() {
  const db = await openDb()

  // Kategoriler tablosunu oluştur
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      image_url TEXT
    )
  `)

  // Ürünler tablosunu oluştur
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      discount_percentage INTEGER,
      stock INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT 0,
      is_new BOOLEAN DEFAULT 0,
      is_on_sale BOOLEAN DEFAULT 0,
      category_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `)

  // Ürün görselleri tablosunu oluştur
  await db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      is_primary BOOLEAN DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `)

  return db
}

// Örnek verileri ekle
export async function seedDb() {
  const db = await openDb()

  // Kategorileri kontrol et
  const categories = await db.all("SELECT * FROM categories")

  if (categories.length === 0) {
    // Kategorileri ekle
    await db.exec(`
      INSERT INTO categories (name, slug, image_url) VALUES
      ('Bahçe Oturma Grupları', 'bahce-oturma-gruplari', '/categories/bahce-oturma-gruplari.jpg'),
      ('Bahçe Köşe Takımları', 'bahce-kose-takimlari', '/categories/bahce-kose-takimlari.jpg'),
      ('Masa Takımları', 'masa-takimlari', '/categories/masa-takimlari.jpg'),
      ('Şezlonglar', 'sezlonglar', '/categories/sezlonglar.jpg'),
      ('Sandalyeler', 'sandalyeler', '/categories/sandalyeler.png')
    `)
  }

  // Ürünleri kontrol et
  const products = await db.all("SELECT * FROM products")

  if (products.length === 0) {
    // Ürünleri ekle
    await db.exec(`
      INSERT INTO products (name, slug, description, price, original_price, discount_percentage, stock, is_featured, is_new, is_on_sale, category_id) VALUES
      ('Rattan Bahçe Oturma Grubu', 'rattan-bahce-oturma-grubu', 'Şık ve dayanıklı rattan bahçe oturma grubu', 12999.99, 15999.99, 20, 10, 1, 1, 1, 1),
      ('Modern Bahçe Köşe Takımı', 'modern-bahce-kose-takimi', 'Modern tasarımlı bahçe köşe takımı', 18999.99, 22999.99, 15, 5, 1, 0, 1, 2),
      ('Ahşap Masa Takımı', 'ahsap-masa-takimi', 'Doğal ahşap masa takımı', 8999.99, 9999.99, 10, 15, 1, 0, 0, 3),
      ('Katlanabilir Şezlong', 'katlanabilir-sezlong', 'Pratik katlanabilir şezlong', 2999.99, 3499.99, 15, 20, 0, 1, 1, 4),
      ('Lüks Bahçe Köşe Takımı', 'luks-bahce-kose-takimi', 'Lüks bahçe köşe takımı', 24999.99, 29999.99, 15, 3, 1, 1, 0, 2),
      ('Rattan Salıncak', 'rattan-salincak', 'Konforlu rattan salıncak', 7999.99, 8999.99, 10, 8, 0, 1, 0, 1),
      ('Bahçe Şemsiyesi', 'bahce-semsiyesi', 'Geniş bahçe şemsiyesi', 1999.99, 2499.99, 20, 12, 0, 0, 1, 3),
      ('Alüminyum Bahçe Sandalyesi', 'aluminyum-bahce-sandalyesi', 'Hafif alüminyum bahçe sandalyesi', 1499.99, 1799.99, 15, 25, 0, 0, 1, 5)
    `)

    // Ürün görsellerini ekle
    await db.exec(`
      INSERT INTO product_images (product_id, url, is_primary) VALUES
      (1, '/products/rattan-bahce-oturma-grubu.jpg', 1),
      (2, '/products/modern-bahce-kose-takimi.jpg', 1),
      (3, '/products/ahsap-masa-takimi.jpg', 1),
      (4, '/products/katlanabilir-sezlong.jpg', 1),
      (5, '/products/luks-bahce-kose-takimi.jpg', 1),
      (6, '/products/rattan-salincak.jpg', 1),
      (7, '/products/bahce-semsiyesi.jpg', 1),
      (8, '/products/aluminyum-bahce-sandalyesi.jpg', 1)
    `)
  }

  return db
}

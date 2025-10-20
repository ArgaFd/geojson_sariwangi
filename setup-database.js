const Database = require('better-sqlite3');
const path = require('path');

// Create database
const dbPath = path.join(__dirname, 'sariwangi_roads.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
console.log('🏗️ Setting up database schema...');

// Roads table
db.exec(`
  CREATE TABLE IF NOT EXISTS roads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    nama_file TEXT NOT NULL,
    tipe TEXT,
    kelurahan TEXT DEFAULT 'Kelurahan Sariwangi',
    panjang_meter REAL,
    jumlah_titik INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nama_file)
  )
`);

// Coordinates table for storing geometry data
db.exec(`
  CREATE TABLE IF NOT EXISTS coordinates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    road_id INTEGER,
    longitude REAL NOT NULL,
    latitude REAL NOT NULL,
    urutan INTEGER NOT NULL,
    FOREIGN KEY (road_id) REFERENCES roads (id),
    UNIQUE(road_id, urutan)
  )
`);

// Create indexes for better query performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_roads_nama ON roads(nama);
  CREATE INDEX IF NOT EXISTS idx_roads_tipe ON roads(tipe);
  CREATE INDEX IF NOT EXISTS idx_coordinates_road ON coordinates(road_id);
  CREATE INDEX IF NOT EXISTS idx_coordinates_location ON coordinates(longitude, latitude);
`);

console.log('✅ Database schema created successfully');
console.log(`📍 Database location: ${dbPath}`);

// Close database
db.close();

console.log('🎉 Database setup complete!');
console.log('💡 Next step: Run "node load-to-sqlite.js" to load GeoJSON data');

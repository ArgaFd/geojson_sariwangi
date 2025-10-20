const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Database setup
const dbPath = path.join(__dirname, 'sariwangi_roads.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Prepare statements for better performance
const insertRoad = db.prepare(`
  INSERT INTO roads (nama, nama_file, tipe, kelurahan, panjang_meter, jumlah_titik)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertCoordinate = db.prepare(`
  INSERT INTO coordinates (road_id, longitude, latitude, urutan)
  VALUES (?, ?, ?, ?)
`);

const getRoadId = db.prepare(`
  SELECT id FROM roads WHERE nama_file = ?
`);

console.log('🚀 Starting data loading process...');

// Road files to process
const roadFiles = [
  'jl_sariwangi_selatan.geojson',
  'jl_alam_sariwangi.geojson',
  'jl_h_mukti.geojson',
  'jl_bumi_sariwangi_1.geojson',
  'jl_bumi_sariwangi_2.geojson',
  'jl_mekar_wangi.geojson'
];

// Process each road file
roadFiles.forEach((fileName, index) => {
  const filePath = path.join(__dirname, 'data', 'jalan', fileName);

  try {
    // Read and parse GeoJSON
    const geoJsonContent = fs.readFileSync(filePath, 'utf8');
    const geoJson = JSON.parse(geoJsonContent);

    if (!geoJson.features || geoJson.features.length === 0) {
      console.log(`⚠️ Skipping ${fileName}: No features found`);
      return;
    }

    const feature = geoJson.features[0];
    const nama = feature.properties?.nama || `Road ${index + 1}`;
    const tipe = feature.properties?.tipe || 'unknown';

    // Calculate approximate length (simplified calculation)
    const coordinates = feature.geometry.coordinates;
    let totalDistance = 0;

    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      const distance = calculateDistance(prev[1], prev[0], curr[1], curr[0]); // lat, lon format
      totalDistance += distance;
    }

    // Begin transaction
    const transaction = db.transaction(() => {
      // Insert road data
      const roadResult = insertRoad.run(
        nama,
        fileName,
        tipe,
        'Kelurahan Sariwangi',
        Math.round(totalDistance * 100) / 100, // Round to 2 decimal places
        coordinates.length
      );

      const roadId = roadResult.lastInsertRowid;

      // Insert coordinates
      coordinates.forEach((coord, coordIndex) => {
        insertCoordinate.run(roadId, coord[0], coord[1], coordIndex);
      });

      console.log(`✅ ${nama}: ${coordinates.length} points, ~${Math.round(totalDistance)}m`);
    });

    transaction();

  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
  }
});

// Database statistics
const roadCount = db.prepare('SELECT COUNT(*) as count FROM roads').get();
const coordCount = db.prepare('SELECT COUNT(*) as count FROM coordinates').get();

console.log('\n📊 Loading Summary:');
console.log(`🛣️ Roads loaded: ${roadCount.count}`);
console.log(`📍 Coordinates loaded: ${coordCount.count}`);

// Show sample data
console.log('\n📋 Sample Data:');
const sampleRoads = db.prepare(`
  SELECT nama, tipe, panjang_meter, jumlah_titik
  FROM roads
  ORDER BY nama
  LIMIT 3
`).all();

sampleRoads.forEach(road => {
  console.log(`  • ${road.nama} (${road.tipe}): ${road.panjang_meter}m, ${road.jumlah_titik} points`);
});

console.log('\n💾 Database ready for queries!');
console.log(`📍 Database file: ${dbPath}`);

// Close database
db.close();

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

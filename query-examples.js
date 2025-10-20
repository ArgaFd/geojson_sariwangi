const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'sariwangi_roads.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 Database Query Examples');
console.log('=' .repeat(50));

// Example 1: Get all roads
console.log('\n1️⃣ All Roads:');
const allRoads = db.prepare(`
  SELECT nama, tipe, panjang_meter, jumlah_titik
  FROM roads
  ORDER BY nama
`).all();

allRoads.forEach(road => {
  console.log(`  • ${road.nama} (${road.tipe}): ${road.panjang_meter}m, ${road.jumlah_titik} points`);
});

// Example 2: Filter by road type
console.log('\n2️⃣ Jalan Lokal Only:');
const localRoads = db.prepare(`
  SELECT nama, panjang_meter FROM roads
  WHERE tipe = 'jalan_lokal'
  ORDER BY panjang_meter DESC
`).all();

localRoads.forEach(road => {
  console.log(`  • ${road.nama}: ${road.panjang_meter}m`);
});

// Example 3: Get coordinates for a specific road
console.log('\n3️⃣ Coordinates for Jl. Sariwangi Selatan:');
const roadId = db.prepare(`SELECT id FROM roads WHERE nama = ?`).get('Jl. Sariwangi Selatan');
if (roadId) {
  const coordinates = db.prepare(`
    SELECT longitude, latitude, urutan
    FROM coordinates
    WHERE road_id = ?
    ORDER BY urutan
  `).all(roadId.id);

  console.log(`  Found ${coordinates.length} coordinate points:`);
  coordinates.slice(0, 3).forEach(coord => {
    console.log(`    [${coord.longitude}, ${coord.latitude}]`);
  });
  if (coordinates.length > 3) {
    console.log(`    ... and ${coordinates.length - 3} more points`);
  }
}

// Example 4: Calculate total road length by type
console.log('\n4️⃣ Total Length by Road Type:');
const lengthByType = db.prepare(`
  SELECT tipe, COUNT(*) as count, SUM(panjang_meter) as total_length
  FROM roads
  GROUP BY tipe
  ORDER BY total_length DESC
`).all();

lengthByType.forEach(type => {
  console.log(`  • ${type.tipe}: ${type.count} roads, ${Math.round(type.total_length)}m total`);
});

// Example 5: Find longest road
console.log('\n5️⃣ Longest Road:');
const longest = db.prepare(`
  SELECT nama, tipe, panjang_meter
  FROM roads
  ORDER BY panjang_meter DESC
  LIMIT 1
`).get();

console.log(`  • ${longest.nama} (${longest.tipe}): ${longest.panjang_meter}m`);

// Example 6: Spatial query - roads near a point (using bounding box approximation)
console.log('\n6️⃣ Roads Near Point (107.56786487374382, -6.862357385169645):');
const nearbyRoads = db.prepare(`
  SELECT DISTINCT r.nama, r.tipe,
         MIN(c.longitude) as min_lon, MAX(c.longitude) as max_lon,
         MIN(c.latitude) as min_lat, MAX(c.latitude) as max_lat
  FROM roads r
  JOIN coordinates c ON r.id = c.road_id
  GROUP BY r.id, r.nama, r.tipe
  HAVING min_lon <= ? AND max_lon >= ? AND min_lat <= ? AND max_lat >= ?
`).all(107.56786487374382 + 0.001, 107.56786487374382 - 0.001,
       -6.862357385169645 + 0.001, -6.862357385169645 - 0.001);

nearbyRoads.forEach(road => {
  console.log(`  • ${road.nama} (${road.tipe})`);
});

console.log('\n✅ Query examples completed!');
console.log('💡 You can modify these queries for your specific needs');

// Close database
db.close();

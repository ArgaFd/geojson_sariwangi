# Peta Digital Kelurahan Sariwangi

## Deskripsi
Folder `data/jalan/` berisi 6 file GeoJSON terpisah yang merepresentasikan jalan-jalan utama di Kelurahan Sariwangi. Setiap file menyajikan data geografis untuk satu jalan dalam format GeoJSON yang dapat digunakan untuk berbagai keperluan pemetaan dan analisis spasial.

## Struktur Data
Setiap file GeoJSON memiliki struktur sebagai berikut:
- **Type**: FeatureCollection - berisi satu fitur geografis
- **Geometry**: LineString - merepresentasikan jalan sebagai garis
- **Koordinat**: Format [longitude, latitude] berdasarkan WGS 84 (EPSG:4326)
- **Properties**: Informasi nama jalan, kelurahan, dan tipe jalan

## File Jalan yang Tersedia

### Folder: `data/jalan/`

1. **`jl_sariwangi_selatan.geojson`** - Jalan Sariwangi Selatan (Jalan Utama)
2. **`jl_alam_sariwangi.geojson`** - Jalan Alam Sariwangi (Jalan Cabang)
3. **`jl_h_mukti.geojson`** - Jalan H. Mukti (Jalan Lokal)
4. **`jl_bumi_sariwangi_2.geojson`** - Jalan Bumi Sariwangi II (Jalan Perumahan)
5. **`jl_bumi_sariwangi_1.geojson`** - Jalan Bumi Sariwangi I (Jalan Perumahan)
6. **`jl_mekar_wangi.geojson`** - Jalan Mekar Wangi (Jalan Lokal)

## Database Lokal (SQLite)

### Setup Database
```bash
# Install dependencies
npm install better-sqlite3 geojson

# Setup database schema
node setup-database.js

# Load GeoJSON data into database
node load-to-sqlite.js

# Run query examples
node query-examples.js
```

### Struktur Database
Database SQLite (`sariwangi_roads.db`) memiliki dua tabel utama:

#### Tabel `roads`:
- `id`: Primary key
- `nama`: Nama jalan
- `nama_file`: Nama file GeoJSON
- `tipe`: Tipe jalan (jalan_utama, jalan_cabang, jalan_lokal, jalan_perumahan)
- `panjang_meter`: Perkiraan panjang jalan dalam meter
- `jumlah_titik`: Jumlah titik koordinat

#### Tabel `coordinates`:
- `id`: Primary key
- `road_id`: Foreign key ke tabel roads
- `longitude`: Koordinat bujur
- `latitude`: Koordinat lintang
- `urutan`: Urutan titik dalam jalan

### Query Examples
```javascript
// Get all roads
SELECT nama, tipe, panjang_meter FROM roads;

// Filter by road type
SELECT * FROM roads WHERE tipe = 'jalan_lokal';

// Get coordinates for specific road
SELECT c.longitude, c.latitude
FROM coordinates c
JOIN roads r ON c.road_id = r.id
WHERE r.nama = 'Jl. Sariwangi Selatan';
```

## Cara Membuka File

### Menggunakan QGIS
1. Buka aplikasi QGIS
2. Pilih menu **Layer > Add Layer > Add Vector Layer**
3. Pada dialog "Data Source Manager", pilih **File** sebagai Source Type
4. Klik tombol **Browse** dan cari file jalan yang diinginkan
5. Klik **Add** untuk menampilkan layer peta

### Menggunakan GeoJSON.io
1. Kunjungi situs [geojson.io](https://geojson.io)
2. Klik menu **Open** > **File**
3. Pilih salah satu file jalan dari komputer Anda
4. File akan langsung ditampilkan di peta interaktif

### Menggunakan Multiple Files (QGIS)
Untuk menampilkan semua jalan sekaligus:
1. Tambahkan semua file dari folder `data/jalan/` sebagai layer terpisah
2. Atur styling yang berbeda untuk setiap jalan
3. Gunakan untuk analisis jaringan jalan

## Penggunaan
File-file GeoJSON ini dapat digunakan untuk:
- Pengembangan sistem peta berbasis web dengan multiple layers
- Analisis spasial dan pemodelan jaringan jalan
- Visualisasi data menggunakan berbagai library JavaScript (Leaflet, OpenLayers, dll.)
- Perencanaan infrastruktur dan transportasi
- Integrasi dengan sistem informasi geografis lainnya

## Tipe Jalan
- **Jalan Utama**: Jalan protokol/utama di kelurahan
- **Jalan Cabang**: Jalan penghubung antar area
- **Jalan Lokal**: Jalan pemukiman/local
- **Jalan Perumahan**: Jalan di dalam komplek perumahan

## Catatan Teknis
- Koordinat menggunakan sistem WGS 84 (EPSG:4326)
- Data merepresentasikan kondisi observasi pada waktu tertentu
- Untuk kebutuhan yang lebih kompleks, disarankan untuk melakukan validasi dan verifikasi data di lapangan
- Setiap file dapat digunakan secara independen atau dikombinasikan

---

*File-file ini dibuat untuk keperluan dokumentasi dan pengembangan sistem informasi geografis Kelurahan Sariwangi.*

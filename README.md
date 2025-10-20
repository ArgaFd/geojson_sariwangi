# Peta Digital Kelurahan Sariwangi

## Deskripsi
File `kelurahan_sariwangi.geojson` yang terdapat dalam folder `data/` merupakan representasi digital dari batas wilayah atau jalan utama di Kelurahan Sariwangi. File ini menyajikan data geografis dalam format yang dapat digunakan untuk berbagai keperluan pemetaan dan analisis spasial.

## Format Data
Format yang digunakan adalah **GeoJSON** (Geographic JavaScript Object Notation), yang merupakan standar terbuka dan umum digunakan dalam sistem informasi geografis (GIS). GeoJSON memungkinkan penyimpanan data geografis dalam format JSON yang mudah dibaca dan diolah oleh berbagai aplikasi pemetaan.

## Struktur Data
- **Type**: FeatureCollection - kumpulan dari satu atau lebih fitur geografis
- **Geometry**: LineString - merepresentasikan rute jalan sebagai garis tanpa percabangan
- **Koordinat**: Disusun berdasarkan observasi lapangan dengan format [longitude, latitude]
- **Properties**: Field tambahan untuk menyimpan informasi atribut (saat ini kosong)

## Cara Membuka File

### Menggunakan QGIS
1. Buka aplikasi QGIS
2. Pilih menu **Layer > Add Layer > Add Vector Layer**
3. Pada dialog "Data Source Manager", pilih **File** sebagai Source Type
4. Klik tombol **Browse** dan cari file `kelurahan_sariwangi.geojson`
5. Klik **Add** untuk menampilkan layer peta

### Menggunakan GeoJSON.io
1. Kunjungi situs [geojson.io](https://geojson.io)
2. Klik menu **Open** > **File**
3. Pilih file `kelurahan_sariwangi.geojson` dari komputer Anda
4. File akan langsung ditampilkan di peta interaktif

## Penggunaan
File GeoJSON ini dapat digunakan untuk:
- Pengembangan sistem peta berbasis web
- Analisis spasial dan pemodelan geografis
- Visualisasi data menggunakan berbagai library JavaScript (Leaflet, OpenLayers, dll.)
- Integrasi dengan sistem informasi geografis lainnya

## Catatan Teknis
- Koordinat menggunakan sistem WGS 84 (EPSG:4326)
- Data merepresentasikan kondisi observasi pada waktu tertentu
- Untuk kebutuhan yang lebih kompleks, disarankan untuk melakukan validasi dan verifikasi data di lapangan

---

*File ini dibuat untuk keperluan dokumentasi dan pengembangan sistem informasi geografis Kelurahan Sariwangi.*

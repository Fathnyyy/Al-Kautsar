const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database Setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Table News
        db.run(`CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            image TEXT NOT NULL,
            content TEXT NOT NULL
        )`);

        // Table Gallery
        db.run(`CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            caption TEXT NOT NULL
        )`);

        // Table Registrations
        db.run(`CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            namaLengkap TEXT NOT NULL,
            jenisKelamin TEXT NOT NULL,
            tempatLahir TEXT NOT NULL,
            tanggalLahir TEXT NOT NULL,
            alamat TEXT NOT NULL,
            asalSekolah TEXT NOT NULL,
            namaAyah TEXT NOT NULL,
            namaIbu TEXT NOT NULL,
            pekerjaanAyah TEXT NOT NULL,
            pekerjaanIbu TEXT NOT NULL,
            noTelepon TEXT NOT NULL,
            email TEXT NOT NULL,
            registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert Default News if empty
        db.get("SELECT COUNT(*) as count FROM news", (err, row) => {
            if (row && row.count === 0) {
                const defaultNews = [
                    ["Penerimaan Santri Baru Tahun Ajaran 2025/2026", "2025-01-15", "assets/1.jpg", "Asrama Al-Kautsar kembali membuka pendaftaran bagi calon santri baru. Daftarkan diri Anda segera!"],
                    ["Kegiatan Bakti Sosial Santri", "2024-12-20", "assets/2.JPG", "Para santri melakukan kegiatan bakti sosial di desa sekitar asrama sebagai bentuk pengabdian masyarakat."],
                    ["Prestasi Santri di Tingkat Nasional", "2024-11-10", "assets/3.JPG", "Selamat kepada santri Al-Kautsar yang berhasil meraih juara dalam lomba pidato bahasa Arab tingkat nasional."]
                ];
                const stmt = db.prepare("INSERT INTO news (title, date, image, content) VALUES (?, ?, ?, ?)");
                defaultNews.forEach(item => stmt.run(item));
                stmt.finalize();
            }
        });

        // Insert Default Gallery if empty
        db.get("SELECT COUNT(*) as count FROM gallery", (err, row) => {
            if (row && row.count === 0) {
                const defaultGallery = [
                    ['assets/1.jpg', 'Kegiatan'],
                    ['assets/4.jpg', 'Kegiatan'],
                    ['assets/12.jpg', 'Gedung Sekolah'],
                    ['assets/5.jpg', 'Kegiatan'],
                    ['assets/2.jpg', 'Kegiatan'],
                    ['assets/11.jpg', 'Lab Komputer'],
                    ['assets/13.jpg', 'Halaman Sekolah'],
                    ['assets/3.jpg', 'Kegiatan'],
                    ['assets/6.jpg', 'Karya Siswa'],
                    ['assets/10.jpg', 'Kantin Sekolah'],
                    ['assets/9.jpg', 'Taman Sekolah'],
                    ['assets/8.jpg', 'Gedung Sekolah']
                ];
                const stmt = db.prepare("INSERT INTO gallery (url, caption) VALUES (?, ?)");
                defaultGallery.forEach(item => stmt.run(item));
                stmt.finalize();
            }
        });
    });
}

// --- API Endpoints ---

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// NEWS
app.get('/api/news', (req, res) => {
    db.all("SELECT * FROM news ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/news', (req, res) => {
    const { id, title, date, image, content } = req.body;
    if (id) {
        db.run(`UPDATE news SET title = ?, date = ?, image = ?, content = ? WHERE id = ?`,
            [title, date, image, content, id],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, changes: this.changes });
            }
        );
    } else {
        db.run(`INSERT INTO news (title, date, image, content) VALUES (?, ?, ?, ?)`,
            [title, date, image, content],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, id: this.lastID });
            }
        );
    }
});

app.delete('/api/news/:id', (req, res) => {
    db.run(`DELETE FROM news WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, changes: this.changes });
    });
});

// GALLERY
app.get('/api/gallery', (req, res) => {
    db.all("SELECT * FROM gallery ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/gallery', (req, res) => {
    const { url, caption } = req.body;
    db.run(`INSERT INTO gallery (url, caption) VALUES (?, ?)`,
        [url, caption],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.delete('/api/gallery/:id', (req, res) => {
    db.run(`DELETE FROM gallery WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, changes: this.changes });
    });
});

// REGISTRATIONS
app.get('/api/registrations', (req, res) => {
    db.all("SELECT * FROM registrations ORDER BY registrationDate DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/registrations', (req, res) => {
    const { 
        namaLengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, 
        asalSekolah, namaAyah, namaIbu, pekerjaanAyah, pekerjaanIbu, 
        noTelepon, email 
    } = req.body;

    const sql = `INSERT INTO registrations (
        namaLengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, 
        asalSekolah, namaAyah, namaIbu, pekerjaanAyah, pekerjaanIbu, 
        noTelepon, email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        namaLengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, 
        asalSekolah, namaAyah, namaIbu, pekerjaanAyah, pekerjaanIbu, 
        noTelepon, email
    ], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.delete('/api/registrations/:id', (req, res) => {
    db.run(`DELETE FROM registrations WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

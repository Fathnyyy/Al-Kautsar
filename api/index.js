const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Database Setup using LibSQL / Turso
const db = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:database.sqlite',
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
    try {
        // Table News
        await db.execute(`CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            image TEXT NOT NULL,
            content TEXT NOT NULL
        )`);

        // Table Gallery
        await db.execute(`CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            caption TEXT NOT NULL
        )`);

        // Table Registrations
        await db.execute(`CREATE TABLE IF NOT EXISTS registrations (
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
        const newsCount = await db.execute("SELECT COUNT(*) as count FROM news");
        if (newsCount.rows[0].count === 0) {
            const defaultNews = [
                ["Penerimaan Santri Baru Tahun Ajaran 2025/2026", "2025-01-15", "assets/1.jpg", "Asrama Al-Kautsar kembali membuka pendaftaran bagi calon santri baru. Daftarkan diri Anda segera!"],
                ["Kegiatan Bakti Sosial Santri", "2024-12-20", "assets/2.JPG", "Para santri melakukan kegiatan bakti sosial di desa sekitar asrama sebagai bentuk pengabdian masyarakat."],
                ["Prestasi Santri di Tingkat Nasional", "2024-11-10", "assets/3.JPG", "Selamat kepada santri Al-Kautsar yang berhasil meraih juara dalam lomba pidato bahasa Arab tingkat nasional."]
            ];
            for (const item of defaultNews) {
                await db.execute({
                    sql: "INSERT INTO news (title, date, image, content) VALUES (?, ?, ?, ?)",
                    args: item
                });
            }
        }

        // Insert Default Gallery if empty
        const galleryCount = await db.execute("SELECT COUNT(*) as count FROM gallery");
        if (galleryCount.rows[0].count === 0) {
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
            for (const item of defaultGallery) {
                await db.execute({
                    sql: "INSERT INTO gallery (url, caption) VALUES (?, ?)",
                    args: item
                });
            }
        }
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
}

// Initialize database
initDatabase();

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
app.get('/api/news', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM news ORDER BY date DESC");
        const news = result.rows.map(row => ({ ...row }));
        res.json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/news', async (req, res) => {
    const { id, title, date, image, content } = req.body;
    try {
        if (id) {
            const result = await db.execute({
                sql: `UPDATE news SET title = ?, date = ?, image = ?, content = ? WHERE id = ?`,
                args: [title, date, image, content, id]
            });
            res.json({ success: true, changes: Number(result.rowsAffected) });
        } else {
            const result = await db.execute({
                sql: `INSERT INTO news (title, date, image, content) VALUES (?, ?, ?, ?)`,
                args: [title, date, image, content]
            });
            res.json({ success: true, id: Number(result.lastInsertRowid) });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/news/:id', async (req, res) => {
    try {
        const result = await db.execute({
            sql: `DELETE FROM news WHERE id = ?`,
            args: [req.params.id]
        });
        res.json({ success: true, changes: Number(result.rowsAffected) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GALLERY
app.get('/api/gallery', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM gallery ORDER BY id DESC");
        const gallery = result.rows.map(row => ({ ...row }));
        res.json(gallery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/gallery', async (req, res) => {
    const { url, caption } = req.body;
    try {
        const result = await db.execute({
            sql: `INSERT INTO gallery (url, caption) VALUES (?, ?)`,
            args: [url, caption]
        });
        res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        const result = await db.execute({
            sql: `DELETE FROM gallery WHERE id = ?`,
            args: [req.params.id]
        });
        res.json({ success: true, changes: Number(result.rowsAffected) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REGISTRATIONS
app.get('/api/registrations', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM registrations ORDER BY registrationDate DESC");
        const registrations = result.rows.map(row => ({ ...row }));
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/registrations', async (req, res) => {
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

    try {
        const result = await db.execute({
            sql,
            args: [
                namaLengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, 
                asalSekolah, namaAyah, namaIbu, pekerjaanAyah, pekerjaanIbu, 
                noTelepon, email
            ]
        });
        res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/registrations/:id', async (req, res) => {
    try {
        const result = await db.execute({
            sql: `DELETE FROM registrations WHERE id = ?`,
            args: [req.params.id]
        });
        res.json({ success: true, changes: Number(result.rowsAffected) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server locally (ignored on Vercel production)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for Vercel Serverless Functions
module.exports = app;

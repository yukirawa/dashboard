// server.js (修正版)
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ---------------------------------------------------
// データベースのセットアップ (SQLite)
// ---------------------------------------------------
const db = new sqlite3.Database('./dashboard.db', (err) => {
    if (err) {
        console.error('データベース接続エラー:', err.message);
    } else {
        console.log('SQLiteデータベースに接続しました');
    }
});

// テーブル作成
db.serialize(() => {
    // メモ用
    db.run(`CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        created_at TEXT
    )`);
    // やることリスト用（期限付き）
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        due_date TEXT, 
        is_completed INTEGER DEFAULT 0
    )`);
});

// ---------------------------------------------------
// API ルート定義
// ---------------------------------------------------

// 1. 天気予報 API (livedoor互換APIに変更)
app.get('/api/weather', async (req, res) => {
    // 都市IDを受け取る（デフォルトは東京: 130010）
    // 大阪なら 270000, 名古屋なら 230010 など
    const cityId = req.query.city || '130010'; 
    const url = `https://weather.tsukumijima.net/api/forecast/city/${cityId}`;

    try {
        const response = await axios.get(url);
        // 取得した天気データをそのままUIに返します
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '天気情報の取得に失敗しました' });
    }
});

// 2. メモ機能 API
app.get('/api/memos', (req, res) => {
    db.all("SELECT * FROM memos ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/memos', (req, res) => {
    const { title, content } = req.body;
    const createdAt = new Date().toISOString();
    const sql = "INSERT INTO memos (title, content, created_at) VALUES (?, ?, ?)";
    db.run(sql, [title, content, createdAt], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, content, created_at: createdAt });
    });
});
app.delete('/api/memos/:id', (req, res) => {
    const sql = "DELETE FROM memos WHERE id = ?";
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "削除しました" });
    });
});

// 3. やることリスト API
app.get('/api/todos', (req, res) => {
    db.all("SELECT * FROM todos ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const todos = rows.map(t => ({...t, is_completed: t.is_completed === 1}));
        res.json(todos);
    });
});
app.post('/api/todos', (req, res) => {
    const { content, due_date } = req.body;
    const sql = "INSERT INTO todos (content, due_date) VALUES (?, ?)";
    db.run(sql, [content, due_date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, content, due_date, is_completed: false });
    });
});
app.put('/api/todos/:id', (req, res) => {
    const { is_completed } = req.body;
    const val = is_completed ? 1 : 0;
    const sql = "UPDATE todos SET is_completed = ? WHERE id = ?";
    db.run(sql, [val, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "更新しました" });
    });
});
app.delete('/api/todos/:id', (req, res) => {
    const sql = "DELETE FROM todos WHERE id = ?";
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "削除しました" });
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
    console.log(`http://localhost:${PORT}/api/weather で天気データを確認できます`);
});
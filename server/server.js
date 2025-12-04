const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// --- 1. IMPORT ROUTES ---
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// --- 2. SỬ DỤNG ROUTES ---
app.use('/api/books', bookRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB (Book Store)"))
  .catch(err => console.log("❌ Lỗi kết nối:", err));

app.get('/', (req, res) => {
  res.send('Server Book Store đang chạy!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
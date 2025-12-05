const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// --- 1. IMPORT ROUTES ---
const bookRoutes = require('./routes/bookRoutes');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// --- 2. SỬ DỤNG ROUTES ---
app.use('/api/books', bookRoutes);

// API ĐĂNG KÝ
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });

    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// API ĐĂNG NHẬP
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
    res.json(user); // Trả về thông tin user nếu đúng
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// API TẠO ĐƠN HÀNG (THANH TOÁN)
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

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

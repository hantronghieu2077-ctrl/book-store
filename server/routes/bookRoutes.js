const express = require('express');
const router = express.Router();
const Book = require('../models/book'); // Nhập cái khuôn Book vào

// 1. LẤY danh sách tất cả sách (GET)
// Đường dẫn: http://localhost:5000/api/books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }); // Sách mới nhất lên đầu
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. LẤY chi tiết 1 cuốn sách theo ID (GET)
// Đường dẫn: http://localhost:5000/api/books/12345...
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách này!" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. THÊM sách mới (POST)
router.post('/', async (req, res) => {
  const { title, author, price, description, imageUrl, category } = req.body;

  try {
    const newBook = new Book({
      title, author, price, description, imageUrl, category
    });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. XÓA sách (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sách thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
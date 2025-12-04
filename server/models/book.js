const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Tên sách bắt buộc phải có
  },
  author: {
    type: String,
    required: true, // Tác giả bắt buộc
  },
  price: {
    type: Number,
    required: true, // Giá tiền (Dạng số)
    min: 0          // Không được âm
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,   // Chúng ta sẽ lưu đường link ảnh (ví dụ: https://anh.com/sach.jpg)
    required: false
  },
  category: {
    type: String,   // Thể loại: Kinh tế, Văn học...
    default: 'Khác'
  }
}, {
  timestamps: true // Tự động lưu ngày tạo
});

module.exports = mongoose.model('Book', BookSchema);
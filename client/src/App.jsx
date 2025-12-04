import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Phone, Mail, MapPin, Facebook, Instagram, Twitter, LogOut, ArrowLeft, CheckCircle, X, Star } from 'lucide-react';
import axios from 'axios';

// --- COMPONENTS ---

const Header = ({ cartCount, onViewChange, currentView, user, onLogout }) => (
  <header className="sticky top-0 z-50 bg-white shadow-md">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2" onClick={() => onViewChange('home')}>
        <span>📚</span> BookStore
      </div>
      <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
        <button onClick={() => onViewChange('home')} className={`hover:text-blue-600 ${currentView === 'home' ? 'text-blue-600' : ''}`}>Trang chủ</button>
        <button onClick={() => onViewChange('products')} className={`hover:text-blue-600 ${currentView === 'products' ? 'text-blue-600' : ''}`}>Sản phẩm</button>
        <button onClick={() => onViewChange('contact')} className={`hover:text-blue-600 ${currentView === 'contact' ? 'text-blue-600' : ''}`}>Liên hệ & Góp ý</button>
      </nav>
      <div className="flex items-center space-x-4">
        <button onClick={() => onViewChange('cart')} className="relative p-2 hover:bg-gray-100 rounded-full transition">
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
        </button>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">{user.username}</span>
            <button onClick={onLogout} className="text-gray-500 hover:text-red-500"><LogOut size={20}/></button>
          </div>
        ) : (
          <button onClick={() => onViewChange('login')} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <User size={18} /> <span className="hidden sm:inline">Đăng nhập</span>
          </button>
        )}
      </div>
    </div>
  </header>
);

const Hero = ({ onShopNow }) => (
  <section className="bg-blue-50 py-12 md:py-20">
    <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
      <div className="md:w-1/2 mt-8 md:mt-0 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Sách hay <span className="text-blue-600">thay đổi cuộc đời</span></h1>
        <p className="text-gray-600 text-lg">Khám phá kho tàng tri thức vô tận từ BookStore với ưu đãi hấp dẫn.</p>
        <button onClick={onShopNow} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg transform hover:-translate-y-1 transition">Mua ngay</button>
      </div>
      <div className="md:w-1/2 flex justify-center"><img src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=600" alt="Reading" className="rounded-lg shadow-2xl" /></div>
    </div>
  </section>
);

const BookDetail = ({ book, onBack, addToCart }) => {
  if (!book) return null;
  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium transition"><ArrowLeft size={20} className="mr-2"/> Quay lại</button>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
          <img src={book.imageUrl} alt={book.title} className="max-h-[500px] w-auto shadow-lg rounded object-contain hover:scale-105 transition duration-500" />
        </div>
        <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold w-fit mb-4">{book.category || 'Sách hay'}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-500 mb-6">Tác giả: <span className="text-gray-800 font-semibold">{book.author}</span></p>
          <div className="text-3xl font-bold text-red-600 mb-8">{book.price?.toLocaleString('vi-VN')} ₫</div>
          <div className="prose max-w-none text-gray-600 mb-8 leading-relaxed">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Giới thiệu sách</h3>
            <p>{book.description || "Chưa có mô tả chi tiết cho cuốn sách này."}</p>
          </div>
          <div className="mt-auto pt-6 border-t flex gap-4">
            <button onClick={() => addToCart(book)} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2"><ShoppingCart size={24}/> Thêm vào giỏ</button>
            <button className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:border-gray-900 hover:text-gray-900 transition">Mua ngay</button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
             <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Hoàn tiền 111% nếu hàng giả</div>
             <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Được kiểm tra hàng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductList = ({ addToCart, books, onBookClick }) => {
  const [filter, setFilter] = useState("All");
    if (!Array.isArray(books)) {
      return (
          <div className="text-center py-20 text-red-500">
              <h3 className="text-xl font-bold">⚠️ Có lỗi xảy ra!</h3>
              <p>Dữ liệu nhận được không hợp lệ.</p>
              <p className="text-sm text-gray-500 mt-2">Server trả về: {JSON.stringify(books).substring(0, 100)}...</p>
          </div>
      );
  }
  const categories = ['All', ...new Set(books.map(b => b.category || 'Khác'))];
  const filteredBooks = filter === "All" ? books : books.filter(book => book.category === filter);

  if (books.length === 0) return <div className="text-center py-20 text-gray-500"><p className="text-xl">Đang tải sách từ Server...</p><p className="text-sm mt-2">(Hãy đảm bảo bạn đã bật 'node server.js')</p></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Sách Mới Cập Nhật</h2>
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full border transition ${filter === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-600'}`}>{cat === 'All' ? 'Tất cả' : cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <div key={book._id} className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 flex flex-col h-full border group cursor-pointer" onClick={() => onBookClick(book)}>
            <div className="h-64 overflow-hidden p-4 bg-gray-50 flex items-center justify-center relative">
              <img src={book.imageUrl} alt={book.title} className="h-full object-contain group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg text-sm">Xem chi tiết</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="mb-auto">
                <p className="text-xs text-blue-500 font-bold uppercase mb-1">{book.category || 'Khác'}</p>
                <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-gray-500 text-sm">{book.author}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-lg font-bold text-red-600">{book.price?.toLocaleString('vi-VN')} ₫</span>
                <button onClick={(e) => { e.stopPropagation(); addToCart(book); }} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-blue-600 transition"><ShoppingCart size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [status, setStatus] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
    setTimeout(() => setStatus(''), 3000);
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-blue-600 p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Liên Hệ & Góp Ý</h2>
            <p className="text-blue-100 mb-8">Chúng tôi luôn lắng nghe ý kiến của bạn.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3"><Phone size={20} /><span>+84 123 456 789</span></div>
              <div className="flex items-center gap-3"><Mail size={20} /><span>support@bookstore.vn</span></div>
              <div className="flex items-center gap-3"><MapPin size={20} /><span>123 Đường Sách, Q.1, TP.HCM</span></div>
            </div>
          </div>
          <div className="flex gap-4 mt-8"><Facebook className="cursor-pointer"/><Instagram className="cursor-pointer"/><Twitter className="cursor-pointer"/></div>
        </div>
        <div className="md:w-1/2 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Họ tên" required className="w-full px-4 py-2 border rounded-lg outline-none" />
            <input type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-lg outline-none" />
            <textarea placeholder="Nội dung góp ý..." rows="4" required className="w-full px-4 py-2 border rounded-lg outline-none"></textarea>
            <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition">Gửi Góp Ý</button>
            {status === 'success' && <p className="text-green-600 text-center text-sm font-medium">Đã gửi thành công! Cảm ơn bạn.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

const Cart = ({ cart, updateQuantity, removeFromCart, onCheckout }) => {
    // Sửa lỗi NaN: Đảm bảo item.price và item.quantity đều có giá trị
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    
    if (cart.length === 0) return <div className="py-20 text-center font-bold text-gray-500">Giỏ hàng trống</div>;
    return (
        <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-4">{cart.map(item => (
                <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow">
                    <img src={item.imageUrl} className="w-16 h-20 object-cover rounded" />
                    <div className="ml-4 flex-grow">
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-gray-500">{item.price?.toLocaleString('vi-VN')} ₫</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item._id, -1)} className="w-8 h-8 rounded-full bg-gray-100 font-bold">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="w-8 h-8 rounded-full bg-gray-100 font-bold">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="ml-4 text-red-500"><X size={20}/></button>
                </div>
            ))}</div>
            <div className="lg:w-1/3"><div className="bg-white p-6 rounded-lg shadow"><div className="flex justify-between text-xl font-bold mb-6"><span>Tổng:</span><span className="text-blue-600">{total.toLocaleString('vi-VN')} ₫</span></div><button onClick={onCheckout} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold">Thanh Toán</button></div></div>
        </div>
    );
};

const Auth = ({ onLogin }) => (<div className="min-h-[60vh] flex items-center justify-center"><div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"><h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2><button onClick={()=>onLogin('Khách hàng')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Vào cửa hàng</button></div></div>);
const Footer = () => (<footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">&copy; 2024 BookStore Real Data</footer>);

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    axios.get('https://book-store-server-d07y.onrender.com/api/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error("Lỗi lấy sách:", err));
  }, []);

  // --- SỬA LỖI LOGIC GIỎ HÀNG Ở ĐÂY ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        // Nếu sách đã có, tăng số lượng (quantity) lên 1
        return prev.map(item => item._id === product._id ? {...item, quantity: item.quantity + 1} : item);
      }
      // Nếu sách mới, thêm vào với quantity: 1
      return [...prev, {...product, quantity: 1}];
    });
    alert(`Đã thêm "${product.title}" vào giỏ!`);
  };

  const updateQuantity = (id, delta) => {
      setCart(prev => prev.map(item => item._id === id ? {...item, quantity: Math.max(1, item.quantity + delta)} : item));
  };
  
  const removeFromCart = (id) => setCart(prev => prev.filter(item => item._id !== id));
  
  const handleBookClick = (book) => { setSelectedBook(book); setView('detail'); };

  const renderView = () => {
    switch(view) {
      case 'home': return <><Hero onShopNow={() => setView('products')} /><ProductList addToCart={addToCart} books={books} onBookClick={handleBookClick}/></>;
      case 'products': return <ProductList addToCart={addToCart} books={books} onBookClick={handleBookClick} />;
      case 'detail': return <BookDetail book={selectedBook} onBack={() => setView('home')} addToCart={addToCart} />;
      case 'contact': return <ContactForm />;
      case 'cart': return <Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onCheckout={() => {alert("Thanh toán thành công!"); setCart([]); setView('home');}} />;
      case 'login': return <Auth onLogin={(n) => {setUser({username: n}); setView('home');}} />;
      default: return <Hero onShopNow={() => setView('products')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      <Header cartCount={cart.reduce((a,b) => a + (b.quantity || 0), 0)} onViewChange={setView} currentView={view} user={user} onLogout={() => setUser(null)} />
      <main className="flex-grow">{renderView()}</main>
      <Footer />
    </div>
  );
}

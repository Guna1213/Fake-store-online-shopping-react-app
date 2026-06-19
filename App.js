import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './components/home';
import About from './components/about';
import ProductDetails from './components/productdetails';
import Cart from './components/cart';
import Login from './components/login'; // Added Login Import
  
import './index.css';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null); // Added state to track { username, role }

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, qty) => {
    if (qty <= 0) {
      handleRemove(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClear = () => setCartItems([]);
  const handleLogout = () => setUser(null); // Added logout action handler

  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  return (
    <BrowserRouter>
      {/* Passed down user session details and logout actions to header */}
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        user={user}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchQuery={searchQuery}
                onAddToCart={handleAddToCart}
                user={user} // Passed down user object down to control admin vs user actions
              />
            }
          />
          <Route path="/about" element={<About />} />
          
          {/* Added Login Route mapping */}
          <Route 
            path="/login" 
            element={<Login onLoginSuccess={setUser} />} 
          />

          <Route
            path="/product/:id"
            element={<ProductDetails onAddToCart={handleAddToCart} user={user} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
                onClear={handleClear}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
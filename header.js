import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './header.css';

const Header = ({ cartCount, searchQuery, onSearch, user, onLogout }) => {
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <NavLink to="/" className="header__logo">
          <div className="header__logo-icon">🛍</div>
          <span className="header__logo-text">
            Fake<span>Store</span>
          </span>
        </NavLink>

        {/* Search */}
        <div className="header__search">
          <span className="header__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Nav */}
        <nav className="header__nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          
          {/* Dynamic Login / Logout Links */}
          {user ? (
            <div className="header__auth-user" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span className={`header__role-badge ${user.role}`} style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
              </span>
              <button 
                onClick={onLogout} 
                className="header__logout-btn"
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>

        {/* Cart */}
        <button
          className="header__cart-btn"
          onClick={() => navigate('/cart')}
          aria-label="View cart"
        >
          🛒
          {cartCount > 0 && (
            <span className="header__cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
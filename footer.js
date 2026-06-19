import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <Link to="/" className="footer__brand-logo">
              <div className="footer__brand-icon">🛍</div>
              <span className="footer__brand-name">Fake<span>Store</span></span>
            </Link>
            <p className="footer__tagline">
              A beautifully crafted storefront powered by the FakeStore API — explore, discover, and add to cart.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="footer__col-title">Navigate</p>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="footer__col-title">Categories</p>
            <ul className="footer__links">
              <li><Link to="/?category=electronics">Electronics</Link></li>
              <li><Link to="/?category=jewelery">Jewelery</Link></li>
              <li><Link to="/?category=men's clothing">Men's</Link></li>
              <li><Link to="/?category=women's clothing">Women's</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} <span>FakeStore</span>. Built for demo purposes.
          </p>
          <span className="footer__api-badge">
            Powered by{' '}
            <a href="https://fakestoreapi.com" target="_blank" rel="noreferrer">
              fakestoreapi.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
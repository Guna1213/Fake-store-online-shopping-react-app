import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './productdetails.css';

const StarRating = ({ rating }) => {
  const full = Math.round(rating);
  return (
    <span className="product-details__stars">
      {Array.from({ length: 5 }, (_, i) => (i < full ? '★' : '☆')).join('')}
    </span>
  );
};

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  if (loading) {
    return (
      <div className="product-details">
        <div className="product-details__loading">
          <div className="product-details__spinner" />
          <p>Loading product…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details">
        <div className="product-details__inner">
          <button className="product-details__back" onClick={() => navigate(-1)}>
            <span className="product-details__back-arrow">←</span> Go Back
          </button>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            Product not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="product-details__inner">
        {/* Back */}
        <button className="product-details__back" onClick={() => navigate(-1)}>
          <span className="product-details__back-arrow">←</span> Back to Products
        </button>

        <div className="product-details__layout">
          {/* Image */}
          <div className="product-details__img-section">
            <div className="product-details__img-card">
              <img src={product.image} alt={product.title} />
            </div>
          </div>

          {/* Info */}
          <div className="product-details__info">
            <span className="product-details__category">{product.category}</span>
            <h1 className="product-details__title">{product.title}</h1>

            <div className="product-details__meta">
              <StarRating rating={product.rating?.rate ?? 0} />
              <span className="product-details__rating-score">
                {product.rating?.rate ?? 0}
              </span>
              <span className="product-details__rating-count">
                {product.rating?.count ?? 0} reviews
              </span>
              <span className="product-details__id">ID: {product.id}</span>
            </div>

            <div className="product-details__price">
              ${product.price.toFixed(2)}
            </div>

            <hr className="product-details__divider" />

            <p className="product-details__desc-heading">Description</p>
            <p className="product-details__desc">{product.description}</p>

            <div className="product-details__actions">
              <div className="product-details__qty-row">
                <span className="product-details__qty-label">Quantity:</span>
                <div className="product-details__qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
              </div>

              <div className="product-details__btn-row">
                <button className="product-details__add-btn" onClick={handleAddToCart}>
                  🛒 Add {qty > 1 ? `(${qty})` : ''} to Cart
                </button>
                <button
                  className={`product-details__wish-btn${wished ? ' wished' : ''}`}
                  onClick={() => setWished((w) => !w)}
                  aria-label="Wishlist"
                >
                  {wished ? '♥' : '♡'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="product-details__toast">
          ✓ Added to cart — <strong>{product.title.slice(0, 30)}…</strong>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
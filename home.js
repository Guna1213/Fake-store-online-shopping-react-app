import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = ({ searchQuery, onAddToCart, user }) => {
  const navigate = useNavigate();
  
  // Core Inventory & API states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & UI sorting States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  // Admin Form Panel Management States
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('electronics');
  const [newDesc, setNewDesc] = useState('');

  // Fetch initial API dataset
  useEffect(() => {
    Promise.all([
      fetch('https://fakestoreapi.com/products').then((res) => res.json()),
      fetch('https://fakestoreapi.com/products/categories').then((res) => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(['all', ...categoriesData]);
        setLoading(false);
      })
      .catch((err) => console.error('Error fetching data from Store API:', err));
  }, []);

  // Admin Action: Append Item Locally
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const mockNewProduct = {
      id: Date.now(),
      title: newTitle,
      price: parseFloat(newPrice),
      description: newDesc || 'No product description available.',
      category: newCategory,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      rating: { rate: 5.0, count: 1 }
    };

    setProducts([mockNewProduct, ...products]);
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setShowAdminForm(false);
  };

  // Admin Action: Delete Item Locally
  const handleDeleteProduct = (e, productId) => {
    e.stopPropagation(); // Prevents navigating to details page on card click
    setProducts(products.filter((p) => p.id !== productId));
  };

  // Interactive filtering execution logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Interactive sorting execution logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'low-to-high') return a.price - b.price;
    if (sortOrder === 'high-to-low') return b.price - a.price;
    return 0; // Fallback to default unsorted array layout
  });

  // Render Loading Shell Spinner State
  if (loading) {
    return (
      <div className="home__loading">
        <div className="home__spinner"></div>
        <p>Curating your showcase pipeline...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* ════════════════ HERO SECTION ════════════════ */}
      <section className="home__hero">
        <span className="home__hero-eyebrow">Powered by FakeStore API</span>
        <h1 className="home__hero-title">
          Shop the <em>Finest</em> Products
        </h1>
        <p className="home__hero-sub">
          Discover curated collections across electronics, fashion, and jewellery — all in one place.
        </p>

        <div className="home__hero-stats">
          <div className="home__stat">
            <span className="home__stat-num">20+</span>
            <span className="home__stat-label">Products</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-num">4</span>
            <span className="home__stat-label">Categories</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-num">Free</span>
            <span className="home__stat-label">Shipping</span>
          </div>
        </div>
      </section>

      {/* ════════════════ ADMIN DRAWER SYSTEM ════════════════ */}
      {user?.role === 'admin' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 2rem', padding: '0 1.5rem' }}>
          <button 
            className="product-card__add-btn" 
            onClick={() => setShowAdminForm(!showAdminForm)}
            style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '10px' }}
          >
            {showAdminForm ? '✕ Close Creation Board' : '➕ Construct & Append New Inventory Listing'}
          </button>

          {showAdminForm && (
            <form onSubmit={handleCreateProduct} style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: '14px', padding: '24px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input type="text" placeholder="Product Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ padding: '10px', border: '1px solid #d4d0c8', borderRadius: '6px' }} required />
                <input type="number" step="0.01" placeholder="Price ($)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ padding: '10px', border: '1px solid #d4d0c8', borderRadius: '6px' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ padding: '10px', border: '1px solid #d4d0c8', borderRadius: '6px' }}>
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea placeholder="Description notes..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{ padding: '10px', border: '1px solid #d4d0c8', borderRadius: '6px', minHeight: '80px' }} />
              </div>
              <button type="submit" className="product-card__add-btn" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>Publish to Live Storefront</button>
            </form>
          )}
        </div>
      )}

      {/* ════════════════ FILTER CONTROLS BAR ════════════════ */}
      <div className="home__controls">
        <div className="home__categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`home__cat-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        <div className="home__sort">
          <label htmlFor="priceSort">Sort:</label>
          <select
            id="priceSort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ════════════════ ITEM COUNTER ════════════════ */}
      <div className="home__results-bar">
        Showing <span>{sortedProducts.length}</span> products
      </div>

      {/* ════════════════ LIVE DISPLAY GRID ════════════════ */}
      <main className="home__grid">
        {sortedProducts.length === 0 ? (
          <div className="home__empty">
            <div className="home__empty-icon">🔍</div>
            <p>No matches encountered inside active store listings.</p>
          </div>
        ) : (
          sortedProducts.map((product) => (
            <article 
              key={product.id} 
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Product Image and Category Badge */}
              <div className="product-card__img-wrap">
                <img src={product.image} alt={product.title} loading="lazy" />
                <span className="product-card__category">{product.category}</span>
              </div>

              {/* Card Meta Content Info Section */}
              <div className="product-card__body">
                <h3 className="product-card__title">{product.title}</h3>
                
                <div className="product-card__rating">
                  <span className="product-card__stars">
                    {'★'.repeat(Math.round(product.rating?.rate || 0))}
                    {'☆'.repeat(5 - Math.round(product.rating?.rate || 0))}
                  </span>
                  <span className="product-card__rating-count">
                    ({product.rating?.count || 0})
                  </span>
                </div>

                {/* Footer contextual actions based on auth role state */}
                <div className="product-card__footer">
                  <span className="product-card__price">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  {user?.role === 'admin' ? (
                    <button
                      className="product-card__add-btn"
                      onClick={(e) => handleDeleteProduct(e, product.id)}
                      style={{ background: '#ef5350' }}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="product-card__add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          alert('Please log in to make purchases.');
                          navigate('/login');
                          return;
                        }
                        onAddToCart(product);
                      }}
                    >
                      + Cart
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
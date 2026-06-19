import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart.css';

// ── Helpers ────────────────────────────────────────────────
const formatCard = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v) => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
};

const genOrderId = () =>
  'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();

// ── Step indicators ────────────────────────────────────────
const STEPS = ['Shipping', 'Payment', 'Review'];

const StepBar = ({ current }) => (
  <div className="checkout-steps">
    {STEPS.map((label, i) => {
      const state = i < current ? 'done' : i === current ? 'active' : '';
      return (
        <React.Fragment key={label}>
          <div className={`checkout-step ${state}`}>
            <div className="checkout-step__num">
              {i < current ? '✓' : i + 1}
            </div>
            <span className="checkout-step__label">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`checkout-step__line ${i < current ? 'done' : ''}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Field ──────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="checkout-field">
    <label>{label}</label>
    {children}
    {error && <p className="error-msg">{error}</p>}
  </div>
);

// ── Checkout Modal ─────────────────────────────────────────
const CheckoutModal = ({ cartItems, total, onClose, onOrderComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [orderId] = useState(genOrderId);

  const [shipping, setShipping] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '', country: 'India',
  });
  const [payment, setPayment] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });
  const [errors, setErrors] = useState({});

  // Shipping validation
  const validateShipping = () => {
    const e = {};
    if (!shipping.name.trim())    e.name    = 'Full name is required';
    if (!/\S+@\S+\.\S+/.test(shipping.email)) e.email = 'Valid email required';
    if (!shipping.phone.trim())   e.phone   = 'Phone number is required';
    if (!shipping.address.trim()) e.address = 'Address is required';
    if (!shipping.city.trim())    e.city    = 'City is required';
    if (!shipping.zip.trim())     e.zip     = 'ZIP code is required';
    return e;
  };

  // Payment validation
  const validatePayment = () => {
    const e = {};
    if (!payment.cardName.trim()) e.cardName = 'Name on card is required';
    const digits = payment.cardNumber.replace(/\s/g, '');
    if (digits.length !== 16)     e.cardNumber = 'Enter a valid 16-digit card number';
    if (payment.expiry.length < 5) e.expiry = 'Enter expiry as MM/YY';
    if (!/^\d{3,4}$/.test(payment.cvv)) e.cvv = 'CVV must be 3 or 4 digits';
    return e;
  };

  const handleNext = () => {
    let e = {};
    if (step === 0) e = validateShipping();
    if (step === 1) e = validatePayment();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800)); // simulate API call
    setProcessing(false);
    setStep(3); // ← advance to success screen
    onOrderComplete(); // ← clear the cart
  };

  const set = (setter) => (field) => (e) => {
    const val = e.target.value;
    setter((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const setCard = (field) => (e) => {
    let val = e.target.value;
    if (field === 'cardNumber') val = formatCard(val);
    if (field === 'expiry')     val = formatExpiry(val);
    if (field === 'cvv')        val = val.replace(/\D/g, '').slice(0, 4);
    setPayment((p) => ({ ...p, [field]: val }));
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="checkout-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal">
        {/* Header */}
        <div className="checkout-modal__header">
          <h2 className="checkout-modal__title">
            {step < 3 ? 'Checkout' : 'Order Confirmed'}
          </h2>
          <button className="checkout-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Steps */}
        {step < 3 && <StepBar current={step} />}

        {/* ── Step 0: Shipping ── */}
        {step === 0 && (
          <div className="checkout-body">
            <p className="checkout-section-title">Shipping Information</p>
            <Field label="Full Name" error={errors.name}>
              <input value={shipping.name} onChange={set(setShipping)('name')}
                placeholder="John Doe" className={errors.name ? 'error' : ''} />
            </Field>
            <div className="checkout-row">
              <Field label="Email Address" error={errors.email}>
                <input type="email" value={shipping.email} onChange={set(setShipping)('email')}
                  placeholder="john@example.com" className={errors.email ? 'error' : ''} />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input value={shipping.phone} onChange={set(setShipping)('phone')}
                  placeholder="+91 98765 43210" className={errors.phone ? 'error' : ''} />
              </Field>
            </div>
            <Field label="Street Address" error={errors.address}>
              <input value={shipping.address} onChange={set(setShipping)('address')}
                placeholder="123 Main Street, Apt 4B" className={errors.address ? 'error' : ''} />
            </Field>
            <div className="checkout-row">
              <Field label="City" error={errors.city}>
                <input value={shipping.city} onChange={set(setShipping)('city')}
                  placeholder="Sathyamangalam" className={errors.city ? 'error' : ''} />
              </Field>
              <Field label="ZIP / Postal Code" error={errors.zip}>
                <input value={shipping.zip} onChange={set(setShipping)('zip')}
                  placeholder="638401" className={errors.zip ? 'error' : ''} />
              </Field>
            </div>
            <Field label="Country" error={errors.country}>
              <select value={shipping.country} onChange={set(setShipping)('country')}>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>France</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </Field>
            <div className="checkout-footer">
              <button className="checkout-btn-next" onClick={handleNext}>
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Payment ── */}
        {step === 1 && (
          <div className="checkout-body">
            <p className="checkout-section-title">Card Details</p>
            <Field label="Name on Card" error={errors.cardName}>
              <input value={payment.cardName} onChange={setCard('cardName')}
                placeholder="John Doe" className={errors.cardName ? 'error' : ''} />
            </Field>
            <Field label="Card Number" error={errors.cardNumber}>
              <div className="checkout-card-field">
                <span className="checkout-card-icon">💳</span>
                <input value={payment.cardNumber} onChange={setCard('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? 'error' : ''} />
              </div>
            </Field>
            <div className="checkout-row">
              <Field label="Expiry Date" error={errors.expiry}>
                <input value={payment.expiry} onChange={setCard('expiry')}
                  placeholder="MM/YY" className={errors.expiry ? 'error' : ''} />
              </Field>
              <Field label="CVV" error={errors.cvv}>
                <input value={payment.cvv} onChange={setCard('cvv')}
                  placeholder="•••" type="password"
                  className={errors.cvv ? 'error' : ''} />
              </Field>
            </div>
            <div className="checkout-footer">
              <button className="checkout-btn-back" onClick={() => setStep(0)}>← Back</button>
              <button className="checkout-btn-next" onClick={handleNext}>
                Review Order →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Review ── */}
        {step === 2 && (
          <div className="checkout-body">
            <p className="checkout-section-title">Order Review</p>

            {/* Mini order summary */}
            <div className="checkout-order-summary">
              {cartItems.map((item) => (
                <div className="checkout-order-row" key={item.id}>
                  <span>{item.title.slice(0, 36)}{item.title.length > 36 ? '…' : ''} × {item.qty}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-order-row">
                <span>Shipping</span><span>Free</span>
              </div>
              <div className="checkout-order-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <p className="checkout-section-title">Delivering To</p>
            <div className="checkout-order-summary" style={{ marginBottom: '1rem' }}>
              <div className="checkout-order-row">
                <span>Name</span><span>{shipping.name}</span>
              </div>
              <div className="checkout-order-row">
                <span>Address</span>
                <span style={{ textAlign: 'right', maxWidth: '55%' }}>
                  {shipping.address}, {shipping.city} {shipping.zip}, {shipping.country}
                </span>
              </div>
              <div className="checkout-order-row">
                <span>Email</span><span>{shipping.email}</span>
              </div>
            </div>

            <p className="checkout-section-title">Paying With</p>
            <div className="checkout-order-summary">
              <div className="checkout-order-row">
                <span>Card</span>
                <span>💳 •••• •••• •••• {payment.cardNumber.replace(/\s/g, '').slice(-4)}</span>
              </div>
              <div className="checkout-order-row">
                <span>Name</span><span>{payment.cardName}</span>
              </div>
            </div>

            <div className="checkout-footer">
              <button className="checkout-btn-back" onClick={() => setStep(1)}>← Back</button>
              <button
                className="checkout-btn-next"
                onClick={handlePlaceOrder}
                disabled={processing}
              >
                {processing ? (
                  <><div className="checkout-spinner" /> Processing…</>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>
            </div>
            <div className="checkout-secure">🔒 Secured with 256-bit SSL encryption</div>
          </div>
        )}

        {/* ── Step 3: Success ── */}
        {step === 3 && (
          <div className="checkout-success">
            <div className="checkout-success__icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Thank you, <strong>{shipping.name}</strong>. Your order has been placed.</p>
            <p>A confirmation has been sent to <strong>{shipping.email}</strong>.</p>
            <div className="checkout-success__order-id">{orderId}</div>
            <button className="checkout-success__done-btn" onClick={() => { onClose(); navigate('/'); }}>
              Back to Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Cart Component ────────────────────────────────────
const Cart = ({ cartItems, onUpdateQty, onRemove, onClear }) => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="cart__inner">
          <button className="cart__back" onClick={() => navigate(-1)}>
            <span className="cart__back-arrow">←</span> Go Back
          </button>
          <div className="cart__empty">
            <div className="cart__empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button className="cart__shop-btn" onClick={() => navigate('/')}>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__inner">
        <button className="cart__back" onClick={() => navigate(-1)}>
          <span className="cart__back-arrow">←</span> Continue Shopping
        </button>

        <div className="cart__header">
          <div>
            <h1 className="cart__title">Your Cart</h1>
            <p className="cart__count">
              {cartItems.reduce((a, i) => a + i.qty, 0)} item(s)
            </p>
          </div>
          <button className="cart__clear-btn" onClick={onClear}>Clear all</button>
        </div>

        <div className="cart__layout">
          {/* Items list */}
          <div className="cart__items">
            {cartItems.map((item) => (
              <div className="cart__item" key={item.id}>
                <img className="cart__item-img" src={item.image} alt={item.title} />
                <div className="cart__item-info">
                  <p
                    className="cart__item-title"
                    onClick={() => navigate(`/product/${item.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.title}
                  </p>
                  <p className="cart__item-cat">{item.category}</p>
                </div>
                <div className="cart__item-controls">
                  <div className="cart__qty">
                    <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <span className="cart__item-price">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                  <button className="cart__item-remove" onClick={() => onRemove(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="cart__summary">
            <h2 className="cart__summary-title">Order Summary</h2>
            <div className="cart__summary-rows">
              <div className="cart__summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart__summary-row">
                <span>Shipping</span><span>Free</span>
              </div>
              <div className="cart__summary-row">
                <span>Tax (0%)</span><span>$0.00</span>
              </div>
              <div className="cart__summary-row total">
                <span>Total</span>
                <span className="cart__total-val">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="cart__checkout-btn"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          total={total}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={() => {
            onClear();
          }}
        />
      )}
    </div>
  );
};

export default Cart;
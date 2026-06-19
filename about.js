import React from 'react';
import './about.css';

const ENDPOINTS = [
  { method: 'GET', url: 'https://fakestoreapi.com/products', desc: 'Fetch all products' },
  { method: 'GET', url: 'https://fakestoreapi.com/products/:id', desc: 'Fetch single product by ID' },
  { method: 'GET', url: 'https://fakestoreapi.com/products/categories', desc: 'Get all categories' },
  { method: 'GET', url: 'https://fakestoreapi.com/products/category/:name', desc: 'Filter products by category' },
];

const CARDS = [
  {
    icon: '🏪',
    title: 'What is FakeStore?',
    text: 'FakeStore API is a free, open REST API that simulates a real e-commerce backend. Perfect for building and testing frontends without worrying about a real server.',
  },
  {
    icon: '⚡',
    title: 'Why This App?',
    text: 'This project demonstrates React best-practices: component composition, React Router v6 navigation, global state for cart, dynamic search, and category filtering.',
  },
  {
    icon: '🎨',
    title: 'Design Philosophy',
    text: 'A refined dark luxury aesthetic — Playfair Display serif headings, DM Sans body, amber/gold accents, and carefully composed spacing throughout.',
  },
  {
    icon: '📦',
    title: 'Features',
    text: 'Browse products, filter by category, sort by price or rating, search in real-time, view full product details, and manage your cart — all with smooth navigation.',
  },
];

const STACK = [
  { icon: '⚛️', name: 'React 18' },
  { icon: '🔀', name: 'React Router v6' },
  { icon: '🎣', name: 'React Hooks' },
  { icon: '🌐', name: 'Fetch API' },
  { icon: '🎨', name: 'CSS Modules' },
  { icon: '🛍', name: 'FakeStore API' },
];

const About = () => {
  return (
    <main className="about">
      <section className="about__hero">
        <p className="about__eyebrow">About This Project</p>
        <h1 className="about__hero-title">
          Built with <em>React</em><br />& FakeStore API
        </h1>
        <p className="about__hero-sub">
          A fully featured e-commerce demo app — real API data, real routing, real cart management.
        </p>
      </section>

      <div className="about__content">
        {/* Feature cards */}
        <div className="about__cards">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              className="about__card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="about__card-icon">{card.icon}</div>
              <h3 className="about__card-title">{card.title}</h3>
              <p className="about__card-text">{card.text}</p>
            </div>
          ))}
        </div>

        {/* API Endpoints */}
        <div className="about__api">
          <h2 className="about__api-title">API Endpoints Used</h2>
          <div className="about__endpoints">
            {ENDPOINTS.map((ep) => (
              <div key={ep.url} className="about__endpoint">
                <span className="about__method">{ep.method}</span>
                <span className="about__endpoint-url">{ep.url}</span>
                <span className="about__endpoint-desc">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div>
          <h2 className="about__stack-title">Tech Stack</h2>
          <div className="about__stack">
            {STACK.map((item) => (
              <span key={item.name} className="about__stack-item">
                {item.icon} {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { fetchProducts, fetchFeaturedProducts } from '../../store/slices/productsSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const categories = [
    {
      name: 'Running',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      description: 'Performance running shoes for every distance'
    },
    {
      name: 'Basketball',
      image: 'https://images.unsplash.com/photo-1515396800500-83f8c9c8b5e5?w=400&h=300&fit=crop',
      description: 'Court-ready shoes for peak performance'
    },
    {
      name: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      description: 'Casual comfort for everyday wear'
    },
    {
      name: 'Skateboarding',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
      description: 'Durable shoes built for the streets'
    },
    {
      name: 'Casual',
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop',
      description: 'Comfortable shoes for daily activities'
    },
    {
      name: 'Training',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      description: 'Cross-training shoes for gym workouts'
    }
  ];

  const brands = [
    { 
      name: 'Nike', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
      description: 'Just Do It'
    },
    { 
      name: 'Adidas', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png',
      description: 'Impossible is Nothing'
    },
    { 
      name: 'Puma', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png',
      description: 'Forever Faster'
    },
    { 
      name: 'Converse', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Converse-Logo.png',
      description: 'All Star'
    },
    { 
      name: 'Reebok', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo.png',
      description: 'Be More Human'
    },
    { 
      name: 'New Balance', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/New-Balance-Logo.png',
      description: 'Endorsed by No One'
    }
  ];

  const features = [
    {
      icon: <Truck size={32} />,
      title: 'Free Shipping',
      description: 'Free shipping on orders above ₹999'
    },
    {
      icon: <RotateCcw size={32} />,
      title: 'Easy Returns',
      description: '30-day return policy for all products'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Payment',
      description: '100% secure payment gateway'
    },
    {
      icon: <Star size={32} />,
      title: 'Quality Assured',
      description: 'Authentic products from trusted brands'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Step Into Style</h1>
            <p>Discover the latest collection of premium footwear from top brands. 
               Find your perfect pair and step up your style game.</p>
            <div className="hero-actions">
              <Link to="/products" className="cta-button primary">
                Shop Now
                <ArrowRight size={20} />
              </Link>
              <Link to="/categories" className="cta-button secondary">
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/hero-shoes.jpg" alt="Premium Footwear Collection" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked bestsellers from top brands</p>
            <Link to="/products" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Find the perfect shoes for every activity</p>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={`/category/${category.name.toLowerCase()}`}
                className="category-card"
              >
                <div className="category-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = '/assets/placeholder-category.jpg';
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-link">
                    Shop Now <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands">
        <div className="container">
          <div className="section-header">
            <h2>Top Brands</h2>
            <p>Authentic products from trusted global brands</p>
          </div>
          
          <div className="brands-grid">
            {brands.map((brand, index) => (
              <div key={index} className="brand-card">
                <div className="brand-logo">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120x60/f0f0f0/666?text=' + brand.name;
                    }}
                  />
                </div>
                <div className="brand-info">
                  <h3>{brand.name}</h3>
                  <p>{brand.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Stay Updated</h2>
              <p>Get the latest updates on new arrivals, exclusive offers, and style tips.</p>
            </div>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Brands</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
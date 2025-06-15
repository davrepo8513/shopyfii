import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Filter, Grid, List, ChevronDown, ArrowLeft } from 'lucide-react';
import { fetchProductsByCategory, setSortBy } from '../../store/slices/productsSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Category.css';

const Category = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { filteredProducts, loading, error, sortBy } = useSelector(state => state.products);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    if (category) {
      dispatch(fetchProductsByCategory(category));
    }
  }, [dispatch, category]);

  const formatCategoryName = (cat) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const handleSortChange = (newSort) => {
    dispatch(setSortBy(newSort));
  };

  const handleBrandFilter = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const getFilteredProducts = () => {
    let filtered = [...filteredProducts];
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }
    
    return filtered;
  };

  const getAvailableBrands = () => {
    const brands = [...new Set(filteredProducts.map(product => product.brand))];
    return brands.sort();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    setPriceRange([0, 20000]);
    setSelectedBrands([]);
  };

  const displayProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="error-state">
            <p>Error loading products: {error}</p>
            <button onClick={() => dispatch(fetchProductsByCategory(category))}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        {/* Header */}
        <div className="category-header">
          <div className="category-breadcrumb">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <span className="breadcrumb-text">
              Home / {formatCategoryName(category)}
            </span>
          </div>
          
          <div className="category-title">
            <h1>{formatCategoryName(category)} Shoes</h1>
            <p>{displayProducts.length} products found</p>
          </div>
        </div>

        {/* Controls */}
        <div className="category-controls">
          <div className="controls-left">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="controls-right">
            <div className="sort-dropdown">
              <select 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown size={16} className="sort-icon" />
            </div>
          </div>
        </div>

        <div className="category-content">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="filters-sidebar">
              <div className="filters-header">
                <h3>Filters</h3>
                <button className="clear-filters" onClick={clearFilters}>
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range">
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20000])}
                    />
                  </div>
                  <div className="price-display">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="filter-section">
                <h4>Brand</h4>
                <div className="brand-filters">
                  {getAvailableBrands().map(brand => (
                    <label key={brand} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandFilter(brand)}
                      />
                      <span className="checkmark"></span>
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className={`products-container ${showFilters ? 'with-filters' : ''}`}>
            {displayProducts.length > 0 ? (
              <div className={`products-grid ${viewMode}`}>
                {displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button className="btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
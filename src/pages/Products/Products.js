import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { 
  fetchProducts, 
  setSearchQuery, 
  setSelectedCategory, 
  setSortBy, 
  setPriceRange, 
  setSelectedBrands, 
  applyFilters, 
  clearFilters 
} from '../../store/slices/productsSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const { 
    filteredProducts, 
    loading, 
    searchQuery, 
    selectedCategory, 
    sortBy, 
    priceRange, 
    selectedBrands 
  } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [
    'All',
    'Running',
    'Basketball',
    'Lifestyle',
    'Casual',
    'Skateboarding',
    'Football',
    'Tennis'
  ];

  const brands = [
    'Nike',
    'Adidas',
    'Puma',
    'Converse',
    'Reebok',
    'New Balance',
    'Vans',
    'Jordan'
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' }
  ];

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category.toLowerCase() === 'all' ? 'all' : category.toLowerCase()));
    dispatch(applyFilters());
  };

  const handleSortChange = (sortValue) => {
    dispatch(setSortBy(sortValue));
  };

  const handlePriceRangeChange = (min, max) => {
    dispatch(setPriceRange([min, max]));
    dispatch(applyFilters());
  };

  const handleBrandToggle = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    dispatch(setSelectedBrands(updatedBrands));
    dispatch(applyFilters());
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h1>
              {searchQuery ? `Search results for "${searchQuery}"` : 
               selectedCategory !== 'all' ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Shoes` : 
               'All Products'}
            </h1>
            <p>{filteredProducts.length} products found</p>
          </div>
          
          <div className="page-controls">
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
            
            <div className="sort-control">
              <select 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="filter-toggle"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        <div className="products-content">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button 
                className="close-filters"
                onClick={() => setIsFilterOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="filters-content">
              {/* Categories Filter */}
              <div className="filter-group">
                <h4>Categories</h4>
                <div className="filter-options">
                  {categories.map(category => (
                    <label key={category} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === (category.toLowerCase() === 'all' ? 'all' : category.toLowerCase())}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-range">
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 0, priceRange[1])}
                      className="price-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(priceRange[0], parseInt(e.target.value) || 20000)}
                      className="price-input"
                    />
                  </div>
                  <div className="price-presets">
                    <button onClick={() => handlePriceRangeChange(0, 5000)}>Under ₹5,000</button>
                    <button onClick={() => handlePriceRangeChange(5000, 10000)}>₹5,000 - ₹10,000</button>
                    <button onClick={() => handlePriceRangeChange(10000, 15000)}>₹10,000 - ₹15,000</button>
                    <button onClick={() => handlePriceRangeChange(15000, 20000)}>Above ₹15,000</button>
                  </div>
                </div>
              </div>

              {/* Brands Filter */}
              <div className="filter-group">
                <h4>Brands</h4>
                <div className="filter-options">
                  {brands.map(brand => (
                    <label key={brand} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button className="clear-filters-btn" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-main">
            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedBrands.length > 0 || searchQuery) && (
              <div className="active-filters">
                <span className="active-filters-label">Active filters:</span>
                
                {selectedCategory !== 'all' && (
                  <span className="filter-tag">
                    Category: {selectedCategory}
                    <button onClick={() => handleCategoryChange('All')}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                
                {selectedBrands.map(brand => (
                  <span key={brand} className="filter-tag">
                    {brand}
                    <button onClick={() => handleBrandToggle(brand)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                
                {searchQuery && (
                  <span className="filter-tag">
                    Search: {searchQuery}
                    <button onClick={() => {
                      dispatch(setSearchQuery(''));
                      dispatch(applyFilters());
                    }}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                
                <button className="clear-all-btn" onClick={handleClearFilters}>
                  Clear All
                </button>
              </div>
            )}

            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`products-grid ${viewMode}`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="filter-overlay" onClick={() => setIsFilterOpen(false)} />
      )}
    </div>
  );
};

export default Products;
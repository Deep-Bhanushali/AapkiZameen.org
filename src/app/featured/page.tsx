'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface LandProperty {
  id: number;
  title: string;
  location: string;
  category: string;
  price: string;
  priceValue: number;
  size: string;
  image: string;
  description: string;
}

function FeaturedContent() {
  const searchParams = useSearchParams();
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState<LandProperty[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedProperty, setSelectedProperty] = useState<LandProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initializedRef = useRef(false);

  const itemsPerPage = 9;

  const landsData: LandProperty[] = [
    // {
    //   id: 1,
    //   title: "Premium Agricultural Land - Ayodhya",
    //   location: "Ayodhya",
    //   category: "Agricultural",
    //   price: "₹15,00,000",
    //   priceValue: 1500000,
    //   size: "2 Acres",
    //   image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500",
    //   description: "Fertile agricultural land with excellent irrigation facilities. Perfect for farming or investment purposes."
    // },
    // {
    //   id: 2,
    //   title: "Residential Plot - Ayodhya",
    //   location: "Ayodhya",
    //   category: "Residential Plot",
    //   price: "₹45,00,000",
    //   priceValue: 4500000,
    //   size: "500 sq yards",
    //   image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500",
    //   description: "Prime residential plot in developing area with all modern amenities nearby."
    // },
    // {
    //   id: 3,
    //   title: "Commercial Land - Dholera",
    //   location: "Dholera",
    //   category: "Commercial",
    //   price: "₹2,50,00,000",
    //   priceValue: 25000000,
    //   size: "1000 sq meters",
    //   image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
    //   description: "Strategic commercial property in prime Mumbai location with high footfall."
    // },
    // {
    //   id: 4,
    //   title: "Industrial Plot - Dholera",
    //   location: "Dholera",
    //   category: "Industrial",
    //   price: "₹80,00,000",
    //   priceValue: 8000000,
    //   size: "5 Acres",
    //   image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500",
    //   description: "Large industrial plot with easy access to highways and ports."
    // },
    // {
    //   id: 5,
    //   title: "Farmhouse Land - Ayodhya",
    //   location: "Ayodhya",
    //   category: "Farmhouse",
    //   price: "₹35,00,000",
    //   priceValue: 3500000,
    //   size: "3 Acres",
    //   image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500",
    //   description: "Scenic farmhouse land with mountain views and natural water source."
    // },
    // {
    //   id: 6,
    //   title: "Investment Land - Dholera",
    //   location: "Dholera",
    //   category: "Investment",
    //   price: "₹60,00,000",
    //   priceValue: 6000000,
    //   size: "1.5 Acres",
    //   image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500",
    //   description: "High-growth potential investment property near IT corridor."
    // },
    // {
    //   id: 7,
    //   title: "Agricultural Land - Ayodhya",
    //   location: "Ayodhya",
    //   category: "Agricultural",
    //   price: "₹12,00,000",
    //   priceValue: 1200000,
    //   size: "4 Acres",
    //   image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500",
    //   description: "Productive agricultural land with tube well and electricity connection."
    // },
    // {
    //   id: 8,
    //   title: "Residential Plot - Dholera",
    //   location: "Dholera",
    //   category: "Residential Plot",
    //   price: "₹28,00,000",
    //   priceValue: 2800000,
    //   size: "300 sq yards",
    //   image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=500",
    //   description: "Well-located residential plot in gated community with modern infrastructure."
    // },
    // {
    //   id: 9,
    //   title: "Commercial Space - Dholera",
    //   location: "Dholera",
    //   category: "Commercial",
    //   price: "₹1,80,00,000",
    //   priceValue: 18000000,
    //   size: "800 sq meters",
    //   image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
    //   description: "Premium commercial property in central Delhi business district."
    // },
    // {
    //   id: 10,
    //   title: "Farmhouse Plot - Dholera",
    //   location: "Dholera",
    //   category: "Farmhouse",
    //   price: "₹22,00,000",
    //   priceValue: 2200000,
    //   size: "2.5 Acres",
    //   image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=500",
    //   description: "Beautiful farmhouse plot surrounded by vineyards and orchards."
    // },
    // {
    //   id: 11,
    //   title: "Investment Plot - Ayodhya",
    //   location: "Ayodhya",
    //   category: "Investment",
    //   price: "₹42,00,000",
    //   priceValue: 4200000,
    //   size: "1200 sq yards",
    //   image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=500",
    //   description: "Strategic investment property near upcoming metro station."
    // },
    // {
    //   id: 12,
    //   title: "Agricultural Land - Dholera",
    //   location: "Dholera",
    //   category: "Agricultural",
    //   price: "₹8,00,000",
    //   priceValue: 800000,
    //   size: "6 Acres",
    //   image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
    //   description: "Spacious agricultural land suitable for organic farming."
    // }
  ];

  // Get unique locations and categories
  const locations = [...new Set(landsData.map(land => land.location))].sort();
  const categories = [...new Set(landsData.map(land => land.category))].sort();

  const applyFilters = () => {
    const filtered = landsData.filter(land => {
      const matchesSearch = land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           land.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || land.location === selectedLocation;
      const matchesCategory = !selectedCategory || land.category === selectedCategory;

      let matchesPrice = true;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split('-').map(Number);
        matchesPrice = land.priceValue >= min && land.priceValue <= max;
      }

      return matchesSearch && matchesLocation && matchesCategory && matchesPrice;
    });

    // Sorting
    const sortedFiltered = [...filtered];
    if (selectedSort === 'price-low') {
      sortedFiltered.sort((a, b) => a.priceValue - b.priceValue);
    } else if (selectedSort === 'price-high') {
      sortedFiltered.sort((a, b) => b.priceValue - a.priceValue);
    } else {
      sortedFiltered.sort((a, b) => b.id - a.id); // Newest first
    }

    setFilteredData(sortedFiltered);
    setCurrentPage(1);
  };

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedLocation, selectedCategory, selectedPrice, selectedSort]);

  // Read category from URL parameters and set initial filter (only once on mount)
  useEffect(() => {
    if (!initializedRef.current) {
      const category = searchParams.get('category');
      if (category && categories.includes(category)) {
        setSelectedCategory(category);
      }
      initializedRef.current = true;
    }
  }, [searchParams, categories]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedPrice('');
    setSelectedSort('newest');
  };

  const toggleFavorite = (landId: number) => {
    const newFavorites = favorites.includes(landId)
      ? favorites.filter(id => id !== landId)
      : [...favorites, landId];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const viewFavorites = () => {
    if (favorites.length === 0) {
      alert('No favorites added yet.');
      return;
    }
    const favoriteLands = landsData.filter(land => favorites.includes(land.id));
    setFilteredData(favoriteLands);
    setCurrentPage(1);
  };

  const openModal = (property: LandProperty) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  return (
    <>
      {/* Header */}
      <header className="header" id="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              <span className="logo-text">AapkiZameen</span>
            </Link>

            <nav className={`nav ${mobileMenuActive ? 'active' : ''}`} id="nav">
              <ul className="nav-list">
                <li><a href="/#about" className="nav-link" onClick={() => setMobileMenuActive(false)}>About</a></li>
                <li><a href="/#properties" className="nav-link" onClick={() => setMobileMenuActive(false)}>Properties</a></li>
                <li><a href="/#why-us" className="nav-link" onClick={() => setMobileMenuActive(false)}>Why Us</a></li>
                <li><a href="/#testimonials" className="nav-link" onClick={() => setMobileMenuActive(false)}>Testimonials</a></li>
                <li><a href="/#contact" className="nav-link" onClick={() => setMobileMenuActive(false)}>Contact</a></li>
              </ul>
            </nav>

            <button className="mobile-toggle" id="mobileToggle" onClick={() => setMobileMenuActive(!mobileMenuActive)} aria-label="Toggle navigation menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '50vh', background: 'linear-gradient(135deg, #FF6D1F 0%, #FF8C4F 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', color: 'white', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>Featured Lands & Properties</h1>
            <p style={{ fontSize: '1.25rem', opacity: '0.95' }}>Discover premium land opportunities across India</p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ padding: '3rem 2rem' }}>
        {/* Filters Section */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid #E0D7C1',
                borderRadius: '10px',
                fontSize: '1rem',
                fontFamily: 'Poppins, sans-serif'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem', color: '#666' }}>Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0D7C1',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem', color: '#666' }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0D7C1',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem', color: '#666' }}>Price Range</label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0D7C1',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">All Prices</option>
                <option value="0-500000">Below ₹5L</option>
                <option value="500000-2000000">₹5L - ₹20L</option>
                <option value="2000000-10000000">₹20L - ₹1Cr</option>
                <option value="10000000-999999999">Above ₹1Cr</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem', color: '#666' }}>Sort By</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0D7C1',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.95rem'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={resetFilters} style={{
              padding: '0.75rem 1.5rem',
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Header with Favorites */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.1rem', color: '#666' }}>
            Showing {filteredData.length} properties
          </div>
          <div
            onClick={viewFavorites}
            style={{
              background: '#FF6D1F',
              color: 'white',
              padding: '0.5rem 1.2rem',
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ❤️ {favorites.length}
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {currentItems.map(land => (
            <div key={land.id} style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <button
                onClick={() => toggleFavorite(land.id)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'white',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  zIndex: 10
                }}
              >
                {favorites.includes(land.id) ? '❤️' : '🤍'}
              </button>
              <img src={land.image} alt={land.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#F5E7C6',
                  color: '#FF6D1F',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginBottom: '0.8rem'
                }}>
                  {land.category}
                </span>
                <h3 style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#222'
                }}>
                  {land.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  📍 {land.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #E0D7C1', borderBottom: '1px solid #E0D7C1', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.3rem' }}>Size</div>
                    <div style={{ fontWeight: '600', color: '#222', fontSize: '0.95rem' }}>{land.size}</div>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FF6D1F', marginBottom: '1rem' }}>
                  {land.price}
                </div>
                <button
                  onClick={() => openModal(land)}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: '#FF6D1F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h3 style={{ fontFamily: 'Lora, serif', fontSize: '2rem', marginBottom: '1rem', color: '#222' }}>
              No Properties Found
            </h3>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.8rem 1.5rem',
                background: 'white',
                color: '#222',
                border: '2px solid #E0D7C1',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1
              }}
            >
              Previous
            </button>
            <span style={{ fontWeight: '500', color: '#666' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.8rem 1.5rem',
                background: 'white',
                color: '#222',
                border: '2px solid #E0D7C1',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-title">AapkiZameen</h3>
              <p className="footer-text">Your trusted partner for transparent and secure land transactions across India.</p>
              <div className="footer-contact">
                <p>📍 123 Business District, Mumbai 400001</p>
                <p>📞 +91 9876543210</p>
                <p>✉️ sahay@aapkizameen.org</p>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/#about">About Us</a></li>
                <li><a href="/#properties">Properties</a></li>
                <li><a href="/#contact">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Follow Us</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">📘</a>
                <a href="#" className="social-link" aria-label="Instagram">📷</a>
                <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 AapkiZameen. All rights reserved. | Trusted land services across India</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && selectedProperty && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              ×
            </button>
            <img
              src={selectedProperty.image}
              alt={selectedProperty.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '2rem' }}>
              <span style={{
                display: 'inline-block',
                background: '#F5E7C6',
                color: '#FF6D1F',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {selectedProperty.category}
              </span>
              <h2 style={{
                fontFamily: 'Lora, serif',
                fontSize: '2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#222'
              }}>
                {selectedProperty.title}
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#666',
                fontSize: '1rem',
                marginBottom: '1.5rem'
              }}>
                📍 {selectedProperty.location}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                padding: '1.5rem',
                background: '#FAF3E1',
                borderRadius: '10px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>Price</span>
                  <span style={{ fontWeight: '600', color: '#222', fontSize: '1.1rem' }}>{selectedProperty.price}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>Size</span>
                  <span style={{ fontWeight: '600', color: '#222', fontSize: '1.1rem' }}>{selectedProperty.size}</span>
                </div>
              </div>
              <p style={{
                color: '#666',
                lineHeight: '1.8',
                marginBottom: '2rem'
              }}>
                {selectedProperty.description}
              </p>
              <Link href="/#contact" style={{
                display: 'inline-block',
                width: '100%',
                padding: '1.2rem',
                background: '#FF6D1F',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                fontSize: '1.1rem',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'background 0.3s'
              }}>
                Get More Info
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Featured() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeaturedContent />
    </Suspense>
  );
}

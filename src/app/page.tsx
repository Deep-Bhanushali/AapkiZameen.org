'use client';

import { useState, useEffect } from 'react';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  location: string;
  purpose: string;
  budget: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  city?: string;
  location?: string;
  purpose?: string;
  consent?: string;
}

export default function Home() {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    location: '',
    purpose: '',
    budget: '',
    message: '',
    consent: false
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testimonials = [
    {
      text: "\"AapkiZameen helped me find the perfect agricultural land in Punjab. Their team handled all the documentation seamlessly. Highly recommended for anyone looking to invest in land.\"",
      author: "Rajesh Kumar",
      location: "Dholera",
      photo: "https://cdn-icons-png.flaticon.com/512/15181/15181452.png"
    },
    {
      text: "\"I sold my property through AapkiZameen and the experience was fantastic. They found genuine buyers quickly and made the entire process transparent and hassle-free.\"",
      author: "Priya Sharma",
      location: "Dholera",
      photo: "https://cdn-icons-png.flaticon.com/512/15181/15181452.png"
    },
    {
      text: "\"Professional service with complete legal support. AapkiZameen's advisors guided us through every detail. We're now proud owners of a beautiful farmhouse plot near Pune!\"",
      author: "Amit Patel",
      location: "Dholera",
      photo: "https://cdn-icons-png.flaticon.com/512/15181/15181452.png"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) errors.phone = 'Please enter a valid 10-digit phone number';
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.city.trim()) errors.city = 'City/State is required';
    if (!formData.location.trim()) errors.location = 'Interested location is required';
    if (!formData.purpose.trim()) errors.purpose = 'Purpose is required';
    if (!formData.consent) errors.consent = 'You must agree to be contacted';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          city: '',
          location: '',
          purpose: '',
          budget: '',
          message: '',
          consent: false
        });
        setFormErrors({});
      } else {
        alert('Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
  };

  return (
    <>
      {/* Header */}
      <header className="header" id="header">
        <div className="container">
          <div className="header-content">
            <a href="#" className="logo">
              <span className="logo-text">AapkiZameen</span>
            </a>

            <nav className={`nav ${mobileMenuActive ? 'active' : ''}`} id="nav">
              <ul className="nav-list">
                <li><a href="#about" className="nav-link" onClick={() => setMobileMenuActive(false)}>About</a></li>
                <li><a href="#properties" className="nav-link" onClick={() => setMobileMenuActive(false)}>Properties</a></li>
                <li><a href="#why-us" className="nav-link" onClick={() => setMobileMenuActive(false)}>Why Us</a></li>
                <li><a href="#testimonials" className="nav-link" onClick={() => setMobileMenuActive(false)}>Testimonials</a></li>
                <li><a href="#contact" className="nav-link" onClick={() => setMobileMenuActive(false)}>Contact</a></li>
              </ul>
            </nav>

            <button className="mobile-toggle" id="mobileToggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">AapkiZameen — Your Trusted Partner for Land Across India</h1>
            <p className="hero-subtitle">Transparent deals • Verified documents • Expert guidance — Buy or sell land with confidence.</p>

            <div className="hero-cta">
              <a href="#contact" className="btn btn-primary">Get a Free Consultation</a>
              <a href="/featured" className="btn btn-secondary">See Featured Lands</a>
            </div>

            <div className="trust-badges">
              <div className="badge">
                <div className="badge-icon">🏆</div>
                <div className="badge-text">
                  <strong>10+ Years</strong>
                  <span>Experience</span>
                </div>
              </div>
              <div className="badge">
                <div className="badge-icon">✓</div>
                <div className="badge-text">
                  <strong>1000+</strong>
                  <span>Properties Verified</span>
                </div>
              </div>
              <div className="badge">
                <div className="badge-icon">⚖️</div>
                <div className="badge-text">
                  <strong>Legal Assistance</strong>
                  <span>Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" alt="AapkiZameen Team" loading="lazy" />
            </div>
            <div className="about-content">
              <h2 className="section-title">About AapkiZameen</h2>
              <p className="about-text">For over a decade, AapkiZameen has been India's trusted partner in land transactions. We believe that buying or selling land should be transparent, secure, and stress-free. Our mission is to connect buyers and sellers across the nation with verified properties and comprehensive legal support.</p>
              <p className="about-text">From agricultural lands to prime commercial plots, we ensure every transaction is backed by thorough documentation, expert guidance, and personalized service. Your dream property is closer than you think.</p>
              <blockquote className="founder-quote">
                <p>"We built AapkiZameen on the foundation of trust and transparency. Every property, every client, every deal matters to us."</p>
                <cite>— Founder, AapkiZameen</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="properties" id="properties">
        <div className="container">
          <h2 className="section-title center">Featured Land Categories</h2>
          <p className="section-subtitle">Discover premium land opportunities across India</p>

          <div className="properties-grid">
            <a href="/featured?category=Agricultural" className="property-card-link">
              <div className="property-card">
                <div className="property-image">
                  <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop" alt="Agricultural Land" loading="lazy" />
                </div>
                <div className="property-content">
                  <h3 className="property-title">Agricultural Land</h3>
                  <p className="property-description">Fertile plots for crops & investment</p>
                  <span className="property-cta">Explore Options →</span>
                </div>
              </div>
            </a>

            <a href="/featured?category=Residential Plot" className="property-card-link">
              <div className="property-card">
                <div className="property-image">
                  <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop" alt="Residential Plots" loading="lazy" />
                </div>
                <div className="property-content">
                  <h3 className="property-title">Residential Plots</h3>
                  <p className="property-description">Verified plots near urban centers</p>
                  <span className="property-cta">Explore Options →</span>
                </div>
              </div>
            </a>

            <a href="/featured?category=Commercial" className="property-card-link">
              <div className="property-card">
                <div className="property-image">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" alt="Commercial Land" loading="lazy" />
                </div>
                <div className="property-content">
                  <h3 className="property-title">Commercial Land</h3>
                  <p className="property-description">High-potential commercial plots</p>
                  <span className="property-cta">Explore Options →</span>
                </div>
              </div>
            </a>

            <a href="/featured?category=Farmhouse" className="property-card-link">
              <div className="property-card">
                <div className="property-image">
                  <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop" alt="Farmhouse Plots" loading="lazy" />
                </div>
                <div className="property-content">
                  <h3 className="property-title">Farmhouse Plots</h3>
                  <p className="property-description">Premium rural plots for weekend homes</p>
                  <span className="property-cta">Explore Options →</span>
                </div>
              </div>
            </a>

            <a href="/featured?category=Industrial" className="property-card-link">
              <div className="property-card">
                <div className="property-image">
                  <img src="https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&h=400&fit=crop" alt="Industrial Land" loading="lazy" />
                </div>
                <div className="property-content">
                  <h3 className="property-title">Industrial Land</h3>
                  <p className="property-description">Ready-to-develop industrial land</p>
                  <span className="property-cta">Explore Options →</span>
                </div>
              </div>
            </a>

            <a href="/featured?category=Investment" className="property-card-link">
              <div className="property-card">
                <div className="property-image">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop" alt="Investment Opportunities" loading="lazy" />
                </div>
                <div className="property-content">
                  <h3 className="property-title">Investment Opportunities</h3>
                  <p className="property-description">Curated plots with strong ROI</p>
                  <span className="property-cta">Explore Options →</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us" id="why-us">
        <div className="container">
          <h2 className="section-title center">Why Choose AapkiZameen</h2>
          <p className="section-subtitle">Your success is our commitment</p>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">✓</div>
              <h3 className="why-title">Verified Listings</h3>
              <p className="why-description">Every property undergoes rigorous verification to ensure authenticity and legal compliance.</p>
            </div>

            <div className="why-card">
              <div className="why-icon">⚖️</div>
              <h3 className="why-title">Legal & Documentation Support</h3>
              <p className="why-description">Complete assistance with paperwork, title verification, and legal formalities.</p>
            </div>

            <div className="why-card">
              <div className="why-icon">🌏</div>
              <h3 className="why-title">Pan-India Reach</h3>
              <p className="why-description">Access to properties across all major cities and rural areas throughout India.</p>
            </div>

            <div className="why-card">
              <div className="why-icon">👤</div>
              <h3 className="why-title">Personalized Advisory</h3>
              <p className="why-description">Dedicated advisors who understand your needs and guide you every step of the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <h2 className="section-title center">What Our Clients Say</h2>
          <p className="section-subtitle">Real stories from satisfied customers</p>

          <div className="testimonial-carousel">
            <div className="testimonial-track" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <img src={testimonial.photo} alt={testimonial.author} className="testimonial-photo" />
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-btn prev"
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous testimonial"
            >
              ‹
            </button>
            <button
              className="carousel-btn next"
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              aria-label="Next testimonial"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to find the perfect land? Let's talk.</h2>
            <a href="#contact" className="btn btn-primary btn-large">Request a Callback</a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact" id="contact">
        <div className="container">
          <h2 className="section-title center">Get a Free Consultation</h2>
          <p className="section-subtitle">Our experts are here to help you find or sell the perfect property</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${formErrors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
                {formErrors.fullName && <span className="form-error show">{formErrors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${formErrors.phone ? 'error' : ''}`}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handlePhoneInput}
                  required
                  aria-required="true"
                  pattern="[0-9]{10}"
                />
                {formErrors.phone && <span className="form-error show">{formErrors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && <span className="form-error show">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">City / State <span className="required">*</span></label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`form-input ${formErrors.city ? 'error' : ''}`}
                  placeholder="e.g., Mumbai, Maharashtra"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
                {formErrors.city && <span className="form-error show">{formErrors.city}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location" className="form-label">Interested Location <span className="required">*</span></label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`form-input ${formErrors.location ? 'error' : ''}`}
                  placeholder="Where are you looking for land?"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
                {formErrors.location && <span className="form-error show">{formErrors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="purpose" className="form-label">Purpose <span className="required">*</span></label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  className={`form-input ${formErrors.purpose ? 'error' : ''}`}
                  placeholder="e.g., Residential, Investment, Agricultural"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
                {formErrors.purpose && <span className="form-error show">{formErrors.purpose}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget" className="form-label">Budget Range</label>
              <select
                id="budget"
                name="budget"
                className="form-input"
                value={formData.budget}
                onChange={handleInputChange}
              >
                <option value="">Select budget range</option>
                <option value="below5">Below ₹5 Lakhs</option>
                <option value="5to20">₹5L – ₹20L</option>
                <option value="20to100">₹20L – ₹1 Crore</option>
                <option value="above100">Above ₹1 Crore</option>
                <option value="discuss">Open to Discuss</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message / Additional Requirements</label>
              <textarea
                id="message"
                name="message"
                className="form-input"
                rows={4}
                placeholder="Tell us more about your requirements..."
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
                <span>I agree to be contacted by AapkiZameen for property consultation <span className="required">*</span></span>
              </label>
              {formErrors.consent && <span className="form-error show">{formErrors.consent}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-large" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Request Consultation'}
            </button>
          </form>

          {showSuccess && (
            <div className="success-message show">
              <div className="success-icon">✓</div>
              <h3>Thank You!</h3>
              <p>We will connect with you soon.</p>
              <button className="btn btn-secondary" onClick={closeSuccess}>Close</button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-title">AapkiZameen</h3>
              <p className="footer-text">Your trusted partner for transparent and secure land transactions across India.</p>
              <div className="footer-contact">
                {/* <p>📍 </p> */}
                <p>📞 +91 8319872570</p>
                <p>✉️ sahay@aapkizameen.org</p>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#properties">Properties</a></li>
                <li><a href="#contact">Contact</a></li>
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
    </>
  );
}

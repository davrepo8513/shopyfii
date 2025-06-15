import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Size Guide', path: '/size-guide' },
      { name: 'Shipping Info', path: '/shipping' },
      { name: 'Returns', path: '/returns' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Refund Policy', path: '/refund' }
    ],
    categories: [
      { name: 'Running Shoes', path: '/category/running' },
      { name: 'Basketball', path: '/category/basketball' },
      { name: 'Lifestyle', path: '/category/lifestyle' },
      { name: 'Skateboarding', path: '/category/skateboarding' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={20} />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <Twitter size={20} />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com' },
    { name: 'YouTube', icon: <Youtube size={20} />, url: 'https://youtube.com' }
  ];

  const features = [
    {
      icon: <Truck size={24} />,
      title: 'Free Shipping',
      description: 'On orders above ₹999'
    },
    {
      icon: <RotateCcw size={24} />,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Multiple Payment',
      description: 'Card, UPI, Net Banking'
    }
  ];

  return (
    <footer className="footer">
      {/* Features Section */}
      <div className="footer-features">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay in the Loop</h3>
              <p>Subscribe to get special offers, free giveaways, and exclusive deals.</p>
            </div>
            <form className="newsletter-form">
              <div className="input-group">
                <Mail size={20} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <h2>Shopyfi</h2>
              </Link>
              <p className="brand-description">
                Your ultimate destination for premium footwear. We bring you the latest 
                styles from top brands with unmatched quality and comfort.
              </p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>123 Fashion Street, Mumbai, India 400001</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+91 1800-123-4567</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>support@shopyfi.com</span>
                </div>
              </div>

              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="footer-links">
              <div className="links-column">
                <h4>Company</h4>
                <ul>
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4>Support</h4>
                <ul>
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4>Categories</h4>
                <ul>
                  {footerLinks.categories.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4>Legal</h4>
                <ul>
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Shopyfi. All rights reserved.</p>
            </div>
            
            <div className="payment-methods">
              <span>We Accept:</span>
              <div className="payment-icons">
                <div className="payment-icon">Visa</div>
                <div className="payment-icon">MC</div>
                <div className="payment-icon">RuPay</div>
                <div className="payment-icon">UPI</div>
                <div className="payment-icon">PayTM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
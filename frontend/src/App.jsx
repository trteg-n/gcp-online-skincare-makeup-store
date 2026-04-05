import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Leaf, TestTube } from 'lucide-react';
import './App.css'
import { db } from './supabase.js'

const PRODUCTS = [
  { id:1,  name:'Vitamin C Brightening Serum',    category:'Serum',        price:38, images:['/images/serum-1.jpg','/images/serum-2.jpg','/images/serum-3.jpg'], skin:['Dull','Uneven Tone'],badge:'Best Seller', desc:'A stable 15% Vitamin C serum targeting hyperpigmentation and dullness. Enhanced with ferulic acid for extended potency.', ingredients:'Aqua, Ascorbic Acid 15%, Propanediol, Glycerin, Ferulic Acid, Tocopherol, Sodium Hyaluronate' },
  { id:2,  name:'Hydra-Barrier Moisturiser SPF30', category:'Moisturiser',  price:45, images:['/images/moisturiser-5.jpg','/images/moisturiser-7.jpg'], skin:['Dry','Sensitive'], badge:'New', desc:'A ceramide-rich moisturiser with SPF 30. Repairs the skin barrier while providing daily UV protection.', ingredients:'Aqua, Ceramide NP, Glycerin, Niacinamide, Zinc Oxide, Shea Butter, Panthenol' },
  { id:3,  name:'Skin-Tint Foundation 30ml',       category:'Foundation',   price:32, images:['/images/foundation-1.jpg','/images/foundation-3.jpg','/images/foundation-4.jpg'], skin:['All Types'], badge:null, desc:'A lightweight skin-tint foundation with buildable coverage. Enriched with hyaluronic acid for a dewy finish.', ingredients:'Aqua, Cyclopentasiloxane, Titanium Dioxide, Hyaluronic Acid, Niacinamide, Glycerin' },
  { id:4,  name:'Daily Mineral Sunscreen SPF50',   category:'SPF',          price:28, images:['/images/spf-1.jpg','/images/spf-2.jpg','/images/spf-3.jpg','/images/spf-4.jpg'], skin:['All Types','Sensitive'], badge:'Must Have', desc:'A 100% mineral SPF 50 sunscreen with zinc oxide. Fragrance-free and reef-safe formula.', ingredients:'Zinc Oxide 20%, Aqua, Caprylic/Capric Triglyceride, Glycerin, Bisabolol' },
  { id:5,  name:'Peptide Eye Cream 15ml',          category:'Eye Care',     price:34, images:['/images/eyecream-2.jpg','/images/eyecream-1.jpg'], skin:['Mature','Dry'], badge:null, desc:'A concentrated peptide eye cream targeting fine lines and dark circles. Caffeine reduces puffiness overnight.', ingredients:'Aqua, Palmitoyl Tripeptide-1, Caffeine, Hyaluronic Acid, Niacinamide, Glycerin' },
  { id:6,  name:'Niacinamide 10% Pore Serum',      category:'Serum',        price:22, images:['/images/serum-2.jpg','/images/serum-1.jpg','/images/serum-3.jpg'], skin:['Oily','Acne-Prone'], badge:'Best Seller', desc:'A 10% niacinamide serum that visibly minimises pores and controls excess sebum within 4 weeks.', ingredients:'Aqua, Niacinamide 10%, Zinc PCA, Propanediol, Panthenol, Glycerin' },
  { id:7,  name:'Retinol 0.5% Night Serum',        category:'Serum',        price:42, images:['/images/serum-3.jpg','/images/serum-4.jpg','/images/serum-1.jpg'], skin:['Mature','Uneven Tone'], badge:null, desc:'An encapsulated 0.5% retinol serum for overnight skin renewal. Paired with bakuchiol for gentle delivery.', ingredients:'Aqua, Retinol 0.5% (encapsulated), Bakuchiol, Squalane, Glycerin, Ceramide AP' },
  { id:8,  name:'Brightening Day Cream SPF20',     category:'Moisturiser',  price:36, images:['/images/moisturiser-2.jpg','/images/moisturiser-3.jpg'], skin:['Dull','Combination'], badge:null, desc:'A multitasking day cream combining SPF 20 with a 5% vitamin C derivative for daily brightening.', ingredients:'Aqua, Ascorbyl Glucoside 5%, Titanium Dioxide, Niacinamide, Glycerin, Ceramide NP' },
  { id:9,  name:'Glow-Prep Exfoliating Toner',     category:'Toner',        price:24, images:['/images/toner-1.jpg','/images/serum-2.jpg'], skin:['Dull','Congested'], badge:'New', desc:'An AHA/BHA toner with 5% glycolic acid and 2% salicylic acid. Removes dead skin cells and refines pores.', ingredients:'Aqua, Glycolic Acid 5%, Salicylic Acid 2%, Niacinamide, Aloe Vera, Panthenol' },
  { id:10, name:'Mineral UV Shield SPF50',         category:'SPF',          price:30, images:['/images/spf-2.jpg','/images/spf-1.jpg','/images/spf-3.jpg'], skin:['Sensitive','Acne-Prone'], badge:null, desc:'A weightless mineral sunscreen with a universal tint. Zero white cast, suitable for all skin tones.', ingredients:'Zinc Oxide 18%, Titanium Dioxide 5%, Aqua, Squalane, Glycerin, Bisabolol' },
  { id:11, name:'Dragonfruit Glow Mask',           category:'Treatment',    price:26, images:['/images/mask-1.jpg','/images/mask-2.jpg','/images/mask-3.jpg'], skin:['Dull','Dry'], badge:'New', desc:'A 10-minute brightening mask packed with dragonfruit extract and vitamin C. Leaves skin visibly glowing.', ingredients:'Aqua, Hylocereus Undatus Extract, Ascorbic Acid, Kaolin, Glycerin, Allantoin' },
  { id:12, name:'Ceramide Barrier Serum',          category:'Serum',        price:40, images:['/images/serum-21.jpg','/images/serum-22.jpg'], skin:['Sensitive','Dry'], badge:null, desc:'A barrier-repair serum with three essential ceramides, cholesterol and fatty acids in the skin-identical ratio.', ingredients:'Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Fatty Acids, Glycerin' },
  { id:13, name:'Tinted Lip Treatment SPF15',      category:'Lip Care',     price:18, images:['/images/lipcare-2.jpg','/images/lipbalm.jpg'], skin:['All Types'], badge:'Best Seller', desc:'A nourishing tinted lip balm with SPF 15. Shea butter and vitamin E keep lips soft all day.', ingredients:'Shea Butter, Castor Oil, Tocopherol, Titanium Dioxide, Candelilla Wax' },
  { id:14, name:'Lip Plumer Hydration',            category:'Lip Care',     price:18, images:['/images/lipgloss-2.jpg','/images/lipgloss-1.jpg','/images/lipstick-4.jpg','/images/lipstick-3.jpg'], skin:['All Types'], badge:'Best Seller', desc:'A nourishing tinted lip balm with SPF 15. Shea butter and vitamin E keep lips soft all day.', ingredients:'Shea Butter, Castor Oil, Tocopherol, Titanium Dioxide, Candelilla Wax' },
  { id:15, name:'Peptide Lip Treatment',           category:'Lip Care',     price:15, images:['/images/lipgloss-3.jpg','/images/lipgloss-4.jpg'], skin:['All Types'], badge:'Best Seller', desc:'A nourishing tinted lip balm with SPF 15. Shea butter and vitamin E keep lips soft all day.', ingredients:'Shea Butter, Castor Oil, Tocopherol, Titanium Dioxide, Candelilla Wax' },
  { id:16, name:'AHA Resurfacing Night Mask',      category:'Treatment',    price:32, images:['/images/mask-2.jpg','/images/mask-3.jpg','/images/mask-1.jpg'], skin:['Mature','Dull'], badge:null, desc:'An overnight resurfacing mask with 10% lactic acid. Wake up to visibly smoother, more radiant skin.', ingredients:'Aqua, Lactic Acid 10%, Glycerin, Shea Butter, Ceramide NP, Niacinamide, Allantoin' },
  { id:17, name:'Squalane Cleansing Oil',          category:'Cleanser',     price:22, images:['/images/cleanser-1.jpg','/images/face-1.jpg'], skin:['All Types','Dry'], badge:null, desc:'A gentle oil cleanser that dissolves SPF and makeup without stripping the skin barrier. Rinses clean.', ingredients:'Squalane, Caprylic Triglyceride, PEG-20 Glyceryl Triisostearate, Tocopherol' },
  { id:18, name:'Hyaluronic Acid Serum 2%',        category:'Serum',        price:26, images:['/images/serum-33.jpg'], skin:['Dry','Dehydrated'], badge:null, desc:'A multi-weight hyaluronic acid serum delivering hydration at three skin depths. Plumps and smooths instantly.', ingredients:'Aqua, Sodium Hyaluronate 2% (LMW/HMW/XLMW), Glycerin, Panthenol, Allantoin' },
  { id:19, name:'SPF Mist Setting Spray',          category:'SPF',          price:20, images:['/images/spf-3.jpg','/images/spf-4.jpg','/images/spf-1.jpg'], skin:['All Types'], badge:'New', desc:'A setting spray with SPF 30 for touch-ups on the go. Refreshes makeup while boosting UV protection.', ingredients:'Aqua, Ethylhexyl Methoxycinnamate, Glycerin, Aloe Vera, Niacinamide, Panthenol' },
  { id:20, name:'Azelaic Acid 10% Cream',          category:'Treatment',    price:28, images:['/images/moisturiser-4.jpg','/images/moisturiser-1.jpg'], skin:['Acne-Prone','Rosacea'], badge:null, desc:'A 10% azelaic acid cream targeting blemishes, redness and post-acne marks. Gentle enough for daily use.', ingredients:'Aqua, Azelaic Acid 10%, Glycerin, Dimethicone, Allantoin, Ceramide NP, Panthenol' },
  { id:21, name:'Cream Stick Blush',               category:'Makeup',       price:24, images:['/images/blush-1.jpg','/images/blush-2.jpg','/images/blush-3.jpg'], skin:['All Types'], badge:'Best Seller', desc:'A silky primer with a peach-tinted blur. Fills fine lines and creates a flawless base for foundation.', ingredients:'Aqua, Cyclopentasiloxane, Dimethicone, Niacinamide, Iron Oxides, Glycerin' },
  { id:22, name:'Bakuchiol Firming Serum',         category:'Serum',        price:44, images:['/images/serum-14.jpg'], skin:['Mature','Sensitive'], badge:'New', desc:'A plant-based retinol alternative with 1% bakuchiol. Firms and smooths skin with zero irritation.', ingredients:'Aqua, Bakuchiol 1%, Squalane, Glycerin, Ceramide NP, Niacinamide, Hyaluronic Acid' },
]

const CATEGORIES = ['All','Serum','Moisturiser','Foundation','SPF','Eye Care','Toner','Treatment','Lip Care','Cleanser','Makeup']

function AnnouncementBar() {
  const messages = [
    '✦Free delivery over £40 · Clinically tested · Dermatologist approved✦',
    '✦New: Dragonfruit Glow Mask - 20% off this week!✦',
    '✦Join 50,000+ happy customers · 30-day returns✦',
    '✦Skin quiz takes under 5 minutes · Get personalized recommendations✦'
  ]
  const repeated = [...messages, ...messages]
  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        {repeated.map((msg, i) => (
          <span key={i} className="announcement-item">
            {msg} <span className="announcement-dot"></span>
          </span>
        ))}
      </div>
    </div>
  )
}

function NewsletterPopup({ isOpen, onClose, userId }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [isWidget, setIsWidget] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) return

    setIsSubmitting(true)
    setError(null)
    
    try {
      const { error: insertError } = await db.from('newsletter_subscription').upsert(
        {
          email: email.toLowerCase().trim(),
          user_id: userId || null,
          subscribed_at: new Date().toISOString()
        },
        {
          onConflict: 'email',
          ignoreDuplicates: true
        }
      )
      
      if (insertError) throw insertError
      
      setIsSubmitting(false)
      setSubmitted(true)

      // Close popup after 3 seconds
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setEmail('')
        setIsWidget(false)
        setError(null)
      }, 3000)
    } catch (err) {
      setIsSubmitting(false)
      setError(err.message || 'Failed to subscribe. Please try again.')
      console.error('Newsletter signup error:', err)
    }
  }

  const handleOutsideClick = () => {
    if (!isWidget) {
      setIsWidget(true)
    }
  }

  const closeWidget = () => {
    onClose()
    setIsWidget(false)
  }

  if (!isOpen) return null

  return (
    <div className={`newsletter-popup-overlay ${isWidget ? 'widget-mode' : ''}`} onClick={handleOutsideClick}>
      {!isWidget && (
        <div className="newsletter-popup" onClick={e => e.stopPropagation()}>
          <button className="popup-close" onClick={onClose}>×</button>

          {!submitted ? (
            <>
              <div className="popup-visual">
                <img src="/images/serum-1.jpg" alt="Product" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div className="popup-gradient"></div>
                <div className="popup-discount">10% OFF</div>
              </div>
              <div className="popup-header">
                <h2 className="popup-title">Get 10% Off Your First Order</h2>
                <p className="popup-subtitle">Subscribe for weekly skincare tips & exclusive deals</p>
              </div>

              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Joining...
                      </>
                    ) : (
                      'Get My 10% Off'
                    )}
                  </button>
                </div>
                {error && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 6, padding: '10px 12px', fontSize: 13, color: '#DC2626', marginTop: 8 }}>
                    {error}
                  </div>
                )}
              </form>

              <p className="popup-footer-text">
                No spam, unsubscribe anytime. We respect your privacy! 💕
              </p>
            </>
          ) : (
            <div className="success-message">
              <div className="success-emoji">🎉</div>
              <h3>Welcome to the family!</h3>
              <p>Check your email for your 10% discount code! 💖</p>
            </div>
          )}
        </div>
      )}

      {isWidget && (
        <div className="newsletter-pill" onClick={() => setIsWidget(false)}>
          <span className="newsletter-pill-text">Get 10% Off 💌</span>
          <button className="newsletter-pill-close" onClick={(e) => { e.stopPropagation(); closeWidget(); }}>
            ×
          </button>
        </div>
      )}
    </div>
  )
}

function Nav({ cartCount, userId }) {
  const navigate = useNavigate()
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => navigate('/')} style={{cursor:'pointer'}}>Formula Me</div>
      <div className="nav-links">
        <Link to="/catalogue">Shop</Link>
        <Link to="/quiz">Skin Quiz</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="nav-icons">
        <button className="nav-icon" onClick={() => navigate(userId ? '/profile' : '/login')} title="Account">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button className="nav-icon cart-btn" onClick={() => navigate('/cart')} title="Cart">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </nav>
  )
}

function Footer({ userId }) {
  const navigate = useNavigate()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const [newsletterError, setNewsletterError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail.includes('@')) return

    setIsSubmitting(true)
    setNewsletterError(null)

    try {
      const { error: insertError } = await db.from('newsletter_subscription').upsert(
        {
          email: newsletterEmail.toLowerCase().trim(),
          user_id: userId || null,
          subscribed_at: new Date().toISOString()
        },
        { onConflict: 'email', ignoreDuplicates: true }
      )

      if (insertError) throw insertError

      setNewsletterSubmitted(true)
      setTimeout(() => {
        setNewsletterSubmitted(false)
        setNewsletterEmail('')
        setNewsletterError(null)
      }, 3000)
    } catch (err) {
      setNewsletterError(err.message || 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-brand">Formula Me</div>
            <div className="footer-desc">Skincare-first beauty. Every formula is clinically tested and skin-barrier approved for all skin types.</div>
            <div className="newsletter-section">
              <div className="newsletter-title">Stay in the loop</div>
              <div className="newsletter-desc">Get exclusive offers, new product launches, and skincare tips.</div>
              {newsletterSubmitted ? (
                <div className="newsletter-success">✓ Thanks! Check your email soon.</div>
              ) : (
                <>
                  <form onSubmit={handleNewsletterSubmit} className="newsletter-footer-form">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="newsletter-input"
                      required
                      disabled={isSubmitting}
                    />
                    <motion.button
                      type="submit"
                      className="newsletter-btn"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.05, backgroundColor: 'var(--peach)' }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </motion.button>
                  </form>
                  {newsletterError && (
                    <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: '#DC2626', marginTop: 8 }}>
                      {newsletterError}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Company</div>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/about')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              About Us
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/sustainability')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Sustainability
            </motion.span>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Help</div>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/contact')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Contact Us
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/shipping')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Shipping Info
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/returns')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Returns & Exchanges
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/faq')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              FAQ
            </motion.span>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Account</div>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/login')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Sign In
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/profile')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              My Account
            </motion.span>
            <motion.span
              className="footer-link"
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Order History
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/quiz')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Skin Quiz
            </motion.span>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Shop</div>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/catalogue')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              All Products
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/catalogue')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Skincare
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/catalogue')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              Makeup
            </motion.span>
            <motion.span
              className="footer-link"
              onClick={() => navigate('/catalogue')}
              whileHover={{ x: 5, color: 'var(--peach)' }}
              transition={{ duration: 0.2 }}
            >
              SPF
            </motion.span>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span>© 2026 Formula Me. All rights reserved.</span>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookies</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </>
  )
}

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate()
  
  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="card-img" style={{position:'relative',overflow:'hidden'}}>
        {product.badge && <span className="card-badge">{product.badge}</span>}
        <img src={product.images[0]} alt={product.name}
          style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .3s ease'}}
          onMouseEnter={e => e.target.style.transform='scale(1.1)'}
          onMouseLeave={e => e.target.style.transform='scale(1)'}
          onError={e => { e.target.style.display='none' }}/>
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name">{product.name}</div>
        <div className="card-footer">
          <span className="card-price">£{product.price}.00</span>
          <button className="card-add" onClick={e => { e.stopPropagation(); onAddToCart(product) }} title="Add to cart">+</button>
        </div>
      </div>
    </div>
)}

const features = [
  {
    icon: Sparkles,
    title: 'Radiant Results',
    description: 'Clinically proven formulas that deliver visible results in just weeks',
    color: '#F472B6',
  },
  {
    icon: Leaf,
    title: 'Natural Ingredients',
    description: 'Sustainably sourced botanicals that nourish your skin naturally',
    color: '#F2A07B',
  },
  {
    icon: TestTube,
    title: 'Science-Backed',
    description: 'Innovative research meets nature for optimal skincare solutions',
    color: '#C4B5FD',
  },
];

function Features() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yTop = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yBottom = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={containerRef} className="features-section">
      <motion.div
        style={{ y: yTop }}
        className="feature-bg feature-bg--top"
      />
      <motion.div
        style={{ y: yBottom }}
        className="feature-bg feature-bg--bottom"
      />

      <div className="features-inner">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8 }}
          className="features-header"
        >
          <h2 className="features-title">Why Choose Us</h2>
          <p className="features-subtitle">Premium quality meets sustainable beauty</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="feature-card"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="feature-icon"
                  style={{ boxShadow: `0 18px 50px ${feature.color}30` }}
                >
                  <Icon className="feature-icon-svg" style={{ color: feature.color }} />
                </motion.div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Home({ onAddToCart, userId }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  
  const featured = PRODUCTS.slice(0, 4)
  const cats = [
    { name:'Serums', img:'/images/serum-1.jpg', bg:'#FDE8D8' },
    { name:'Moisturisers', img:'/images/moisturiser-1.jpg', bg:'#FCE7F3' },
    { name:'Makeup', img:'/images/makeup-1.jpg', bg:'#EDE9FE' },
    { name:'Sun Care', img:'/images/spf-1.jpg', bg:'#FEF9C3' },
  ]

  return (
    <div>
      <section className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            New Collection · Spring 2026
          </motion.p>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your skin,<br/><em>your formula</em>
          </motion.h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Makeup engineered to work with your skincare — never against it. Personalised for every skin type and concern.
          </motion.p>
          <motion.div
            className="hero-btns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              className="btn-primary"
              onClick={() => navigate('/catalogue')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
            <motion.button
              className="btn-outline"
              onClick={() => navigate('/quiz')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Take Skin Quiz
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {PRODUCTS.slice(0,3).map((p, index) => (
            <motion.div
              key={p.id}
              className="hero-card"
              onClick={() => navigate(`/product/${p.id}`)}
              style={{cursor:'pointer'}}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <motion.img
                src={p.images[0]}
                alt={p.name}
                style={{width:48,height:48,objectFit:'cover',borderRadius:8}}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="hero-card-name">{p.name}</span>
              <span className="hero-card-price">£{p.price}.00</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        className="section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <span className="section-link" onClick={() => navigate('/catalogue')}>View all 20 products</span>
        </div>
        <div className="product-grid">
          {featured.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={p} onAddToCart={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Features />

      <motion.section
        className="section"
        style={{paddingTop:0}}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <div className="category-grid">
          {cats.map((c, index) => (
            <motion.div
              key={c.name}
              className="cat-tile"
              style={{background:c.bg,overflow:'hidden',position:'relative'}}
              onClick={() => navigate('/catalogue')}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <motion.img
                src={c.img}
                alt={c.name}
                style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.55}}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="cat-tile-name" style={{position:'relative',zIndex:1,fontWeight:600}}>{c.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="section"
        style={{background: 'var(--coconut)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'}}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What Our Customers Say
          </motion.h2>
        </div>
        <CustomerReviewsCarousel />
      </motion.section>

      <Footer userId={userId} />
    </div>
  )
}

function CustomerReviewsCarousel() {
  const [currentReview, setCurrentReview] = useState(0)
  const [reviews, setReviews] = useState([])

  const fallbackReviews = [
    { name: 'Sarah A.', rating: 5, text: 'This has completely transformed my skin. I noticed a difference within two weeks.', location: 'London, UK', skinType: 'Dry Skin' },
    { name: 'Daniel L.', rating: 4, text: 'Really effective formula. Gentle enough for my sensitive skin.', location: 'Manchester, UK', skinType: 'Sensitive Skin' },
    { name: 'Maya K.', rating: 5, text: 'I was sceptical at first but this is genuinely the best skincare I have tried.', location: 'Birmingham, UK', skinType: 'Combination Skin' },
  ]

  useEffect(() => {
    async function fetchBrandReviews() {
      try {
        const { data, error } = await db
          .from('reviews')
          .select('rating, comment, created_at, users(username)')
          .is('product_id', null)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!error && data && data.length > 0) {
          setReviews(data.map(r => ({
            name: r.users?.username || 'Anonymous',
            rating: r.rating,
            text: r.comment || '',
            location: 'UK',
            skinType: 'Formula Me Customer'
          })))
        } else {
          setReviews(fallbackReviews)
        }
      } catch {
        setReviews(fallbackReviews)
      }
    }
    fetchBrandReviews()
  }, [])

  useEffect(() => {
    if (reviews.length === 0) return
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [reviews])

  const nextReview = () => setCurrentReview(prev => (prev + 1) % reviews.length)
  const prevReview = () => setCurrentReview(prev => (prev - 1 + reviews.length) % reviews.length)

  if (reviews.length === 0) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Loading reviews...</div>

  return (
    <motion.div className="reviews-carousel" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <motion.div className="review-card" key={currentReview} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <div className="review-stars">
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= reviews[currentReview].rating ? '#F2A07B' : 'none'} stroke="#F2A07B" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
        </div>
        <blockquote className="review-text">"{reviews[currentReview].text}"</blockquote>
        <div className="review-author">
          <div className="review-name">{reviews[currentReview].name}</div>
          <div className="review-meta">{reviews[currentReview].location} · {reviews[currentReview].skinType}</div>
        </div>
      </motion.div>
      <div className="carousel-controls">
        <button className="carousel-btn" onClick={prevReview}>‹</button>
        <div className="carousel-dots">
          {reviews.map((_, i) => <span key={i} className={`dot ${i === currentReview ? 'active' : ''}`} onClick={() => setCurrentReview(i)}></span>)}
        </div>
        <button className="carousel-btn" onClick={nextReview}>›</button>
      </div>
    </motion.div>
  )
}

function Catalogue({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100)
  const [sortBy, setSortBy] = useState('newest')
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const filtered = PRODUCTS.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.price >= minPrice && p.price <= maxPrice &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'popular') return (PRODUCTS.find(p => p.id === b.id)?.badge?.includes('Best') ? 1 : -1)
    return 0 // newest (default order)
  }) || []

  return (
    <div>
      <div style={{padding:'20px 48px',borderBottom:'1px solid var(--border)'}}>
        <span style={{fontSize:12,color:'var(--charcoal)'}}>All Products</span>
      </div>
      <div className="catalogue-layout">
        <div className="sidebar">
          <div className="sidebar-title">Filter</div>
          <div className="filter-group">
            <div className="filter-group-title">Category</div>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-btn ${activeCategory===c?'active':''}`}
                onClick={() => setActiveCategory(c)}>
                {c}
                <span style={{float:'right',color:'var(--muted)',fontSize:11}}>
                  {c==='All' ? PRODUCTS.length : PRODUCTS.filter(p=>p.category===c).length}
                </span>
              </button>
            ))}
          </div>
          <div className="filter-group">
            <div className="filter-group-title">Price Range</div>
            <div style={{fontSize:13,color:'var(--muted)',marginBottom:8}}>£{minPrice} — £{maxPrice}</div>
            <div style={{marginBottom:8}}>
              <label style={{fontSize:11,color:'var(--muted)',display:'block',marginBottom:4}}>Min</label>
              <input type="range" min="0" max="100" value={minPrice}
                onChange={e => setMinPrice(Number(e.target.value))}
                style={{width:'100%',accentColor:'var(--peach)'}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:'var(--muted)',display:'block',marginBottom:4}}>Max</label>
              <input type="range" min="0" max="100" value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{width:'100%',accentColor:'var(--peach)'}}/>
            </div>
          </div>
        </div>

        <div className="catalogue-main">
          <div className="search-bar">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="catalogue-toolbar">
            <span className="results-count">Showing <strong>{sorted.length} products</strong></span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{background:'transparent',border:'1px solid var(--border)',borderRadius:8,padding:'8px 12px',fontSize:12,color:'var(--charcoal)',cursor:'pointer',fontFamily:'inherit'}}>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          {sorted.length === 0
            ? <div style={{textAlign:'center',padding:'60px',color:'var(--muted)'}}>No products found. Try adjusting your filters.</div>
            : <div className="product-grid three-col">
                {sorted.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
              </div>
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}
function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProductReviews() {
      try {
        const { data, error } = await db
          .from('reviews')
          .select('rating, comment, created_at, users(username)')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
        if (!error && data) setReviews(data)
      } catch (err) {
        console.error('Failed to load reviews:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProductReviews()
  }, [productId])

  const fallback = [
    { users: { username: 'Sarah A.' }, rating: 5, comment: 'This has completely transformed my skin. I noticed a difference within two weeks.', created_at: '2026-02-01' },
    { users: { username: 'Daniel L.' }, rating: 4, comment: 'Really effective formula. Gentle enough for my sensitive skin and no irritation at all.', created_at: '2026-01-01' },
    { users: { username: 'Maya K.' }, rating: 5, comment: 'I was sceptical at first but this is genuinely the best product I have tried.', created_at: '2026-03-01' },
  ]

  const displayReviews = reviews.length > 0 ? reviews : fallback

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="section-header">
        <h2 className="section-title">Customer Reviews</h2>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          {reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'Sample reviews'}
        </span>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Loading reviews...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {displayReviews.map((r, i) => (
              <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= r.rating ? '#F2A07B' : 'none'} stroke="#F2A07B" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--charcoal)', lineHeight: 1.8, marginBottom: 12 }}>{r.comment}</p>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {r.users?.username || 'Anonymous'} · {new Date(r.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
          {reviews.length === 0 && !loading && (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16, textAlign: 'center' }}>
              No reviews yet. Purchase this product and be the first to review it!
            </p>
          )}
        </>
      )}
    </section>
  )
}
function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const product = PRODUCTS.find(p => p.id === parseInt(id))
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  if (!product) return <div style={{padding:48}}>Product not found. <button onClick={() => navigate('/catalogue')}>Back to shop</button></div>

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0,4)

  return (
    <div>
      <div className="breadcrumb">
        <span onClick={() => navigate('/catalogue')} style={{cursor:'pointer',color:'var(--peach)'}}>Shop</span>
        <span> / </span>
        <span>{product.name}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-img">
            <img src={product.images[activeImg]} alt={product.name}
              style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:20}}/>
          </div>
          <div className="detail-thumbs">
            {product.images.map((img,i) => (
              <div key={i} className={`detail-thumb ${activeImg===i?'active':''}`} onClick={() => setActiveImg(i)}>
                <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}}/>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-info">
          <span className="detail-tag">{product.category}</span>
          <div className="detail-name">{product.name}</div>
          <div className="detail-brand">by Formula Me Skin Science</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <div style={{display:'flex',gap:2}}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s<=4?'#F2A07B':'none'} stroke="#F2A07B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
            </div>
            <span style={{fontSize:12,color:'var(--muted)'}}>4.0 · verified reviews</span>          </div>
          <div className="detail-price">£{product.price}.00</div>
          <div className="detail-desc">{product.desc}</div>
          <div style={{fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted)',marginBottom:10}}>Suitable for</div>
          <div className="skin-tags">
            {product.skin.map(s => <span key={s} className="skin-tag">{s}</span>)}
          </div>
          <div className="divider"/>
          <div className="qty-row">
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
            </div>
            <button className="add-cart" onClick={() => { for(let i=0;i<qty;i++) onAddToCart(product) }}>Add to Cart</button>
          </div>
          <div className="divider"/>
          <div className="ingredients-box">
            <div className="ingredients-title">Full Ingredient List</div>
            <div className="ingredients-text">{product.ingredients}</div>
          </div>
          <div className="detail-perks">
            <span className="perk">Free delivery over £40</span>
            <span className="perk">30-day returns</span>
            <span className="perk">Cruelty-free</span>
            <span className="perk">Dermatologist tested</span>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {related.length > 0 && (
        <section className="section" style={{borderTop:'1px solid var(--border)'}}>
          <div className="section-header">
            <h2 className="section-title">You May Also Like</h2>
          </div>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
          </div>
        </section>
      )}
      <Footer/>
    </div>
  )
}

function Cart({ cart, onRemove }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const grouped = cart.reduce((acc, item) => {
    acc[item.id] = acc[item.id] || { ...item, qty: 0 }
    acc[item.id].qty++
    return acc
  }, {})
  const items = Object.values(grouped)

  return (
    <div style={{minHeight:'80vh'}}>
      <div style={{padding:'20px 48px',borderBottom:'1px solid var(--border)'}}>
        <span style={{fontSize:12,color:'var(--charcoal)'}}>Cart</span>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:'48px 24px'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:40,fontWeight:300,marginBottom:32}}>Your Cart</h1>
        {items.length === 0 ? (
          <div style={{textAlign:'center',padding:'80px 0'}}>
            <p style={{color:'var(--muted)',marginBottom:24,fontSize:15}}>Your cart is empty.</p>
            <button className="btn-primary" onClick={() => navigate('/catalogue')}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:32}}>
              {items.map(item => (
                <div key={item.id} style={{display:'flex',gap:20,alignItems:'center',background:'var(--white)',border:'1px solid var(--border)',borderRadius:12,padding:16}}>
                  <img src={item.images[0]} alt={item.name} style={{width:72,height:72,objectFit:'cover',borderRadius:8}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>{item.category}</div>
                    <div style={{fontSize:15,fontWeight:500,color:'var(--charcoal)',marginBottom:4}}>{item.name}</div>
                    <div style={{fontSize:13,color:'var(--peach)',fontWeight:600}}>£{item.price}.00 × {item.qty}</div>
                  </div>
                  <div style={{fontSize:16,fontWeight:600,color:'var(--charcoal)',minWidth:60,textAlign:'right'}}>£{(item.price * item.qty).toFixed(2)}</div>
                  <button onClick={() => onRemove(item.id)} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:18,padding:'0 8px'}}>×</button>
                </div>
              ))}
            </div>
            <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:12,padding:24}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:14,color:'var(--muted)'}}>
                <span>Subtotal</span><span>£{total.toFixed(2)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:14,color:'var(--muted)'}}>
                <span>Delivery</span><span>{total >= 40 ? 'Free' : '£3.99'}</span>
              </div>
              <div style={{height:1,background:'var(--border)',margin:'16px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,fontSize:18,fontWeight:600,color:'var(--charcoal)'}}>
                <span>Total</span><span>£{(total >= 40 ? total : total + 3.99).toFixed(2)}</span>
              </div>
              <button className="btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <Footer/>
    </div>
  )
}


function Checkout({ cart, onClearCart, userId }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [form, setForm] = useState({ name:'', email:'', address:'', city:'', postcode:'', card:'', expiry:'', cvv:'' })
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

 async function applyCoupon() {
  const code = couponCode.toUpperCase().trim()
  setCouponError('')
  setDiscount(0)

  if (!code) {
    setCouponError('Please enter a coupon code')
    return
  }

  try {
    const { data, error } = await db
      .from('coupons')
      .select('*')
      .eq('coupon_code', code)
      .single()

    if (error || !data) {
      setCouponError('Invalid coupon code')
      return
    }

    if (new Date(data.valid_until) < new Date()) {
      setCouponError('This coupon has expired')
      return
    }

    if (data.used_count >= data.max_usage) {
      setCouponError('This coupon has reached its usage limit')
      return
    }

    if (total < data.min_value) {
      setCouponError(`Minimum order value for this coupon is £${data.min_value}`)
      return
    }

    if (data.max_value && total > data.max_value) {
      setCouponError(`This coupon is only valid on orders up to £${data.max_value}`)
      return
    }

    const discountAmount = Math.round((total * data.discount / 100) * 100) / 100
    setDiscount(discountAmount)

    await db.from('coupons')
      .update({ used_count: data.used_count + 1 })
      .eq('coupon_id', data.coupon_id)

  } catch (err) {
    console.error('Error applying coupon:', err)
    setCouponError('Error applying coupon. Please try again.')
  }
}
  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (form.postcode.length < 4) e.postcode = 'Enter a valid postcode'
    if (form.card.replace(/\s/g,'').length < 16) e.card = 'Enter a valid 16-digit card number'
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY'
    if (form.cvv.length < 3) e.cvv = 'Enter a valid CVV'
    return e
  }
  async function handlePlace() {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length !== 0) return
    setLoading(true)

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
    const deliveryCost = subtotal >= 40 ? 0 : 3.99
    const discountedSubtotal = subtotal - discount
    const finalTotal = Math.max(0, discountedSubtotal + deliveryCost)

    // 1 — Save order
    const { data: orderData, error: orderError } = await db
      .from('orders').insert({
        user_id: userId || null,
        total: finalTotal,
        subtotal_total: subtotal,
        discount_amount: discount,
        coupon_code: discount > 0 ? couponCode.toUpperCase() : null,
        status: 'confirmed',
        address: `${form.address}, ${form.city}, ${form.postcode}`,
        phone_number: null,
        created_at: new Date().toISOString()
      }).select().single()

    if (orderError) {
      setLoading(false)
      alert('Order failed: ' + orderError.message)
      return
    }

    // 2 — Save order items
    const orderItems = cart.map(item => ({
      orders_id: orderData.order_id,
      product_id: item.id,
      quantity: 1,
      unit_price: item.price
    }))
    await db.from('order_items').insert(orderItems)

    // 3 — Save address if logged in
    if (userId) {
      await db.from('addresses').insert({
        user_id: userId,
        address_text: form.address,
        city: form.city,
        state: '',
        postal_code: form.postcode,
        country: 'UK'
      })
    }

    setLoading(false)
    setPlaced(true)
    onClearCart()
  }

  function field(label, key, placeholder, type='text') {
    return (
      <div>
        <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>{label}</label>
        <input type={type} value={form[key]} placeholder={placeholder}
          onChange={e => setForm({...form,[key]:e.target.value})}
          style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${errors[key]?'#F87171':'var(--border)'}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',background:'var(--coconut)'}}/>
        {errors[key] && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors[key]}</p>}
      </div>
    )
  }

  if (placed) return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,textAlign:'center',padding:48}}>
      <div style={{width:64,height:64,borderRadius:'50%',background:'var(--peach-light)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width="28" height="28" fill="none" stroke="var(--peach)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:40,fontWeight:300}}>Order Confirmed</h2>
      <p style={{color:'var(--muted)',maxWidth:400,lineHeight:1.8}}>Thank you for your order. A confirmation has been sent to {form.email}. Your products will arrive within 3-5 working days.</p>
      <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  )

  return (
    <div style={{minHeight:'80vh'}}>
      <div style={{padding:'20px 48px',borderBottom:'1px solid var(--border)'}}>
        <span style={{fontSize:12,color:'var(--muted)'}}>Cart / </span>
        <span style={{fontSize:12,color:'var(--charcoal)'}}>Checkout</span>
      </div>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'48px 24px',display:'grid',gridTemplateColumns:'1fr 380px',gap:40}}>
        <div>
          <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:300,marginBottom:32}}>Checkout</h1>
          <div style={{marginBottom:28}}>
            <div style={{fontSize:12,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:16}}>Delivery Information</div>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {field('Full Name','name','Your full name')}
              {field('Email Address','email','you@email.com','email')}
              {field('Street Address','address','123 Skin Street')}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {field('City','city','London')}
                {field('Postcode','postcode','SW1A 1AA')}
              </div>
            </div>
          </div>
          <div>
            <div style={{fontSize:12,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:16}}>Payment Details</div>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {field('Card Number','card','1234 5678 9012 3456')}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {field('Expiry','expiry','MM/YY')}
                {field('CVV','cvv','123')}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:12,padding:24,position:'sticky',top:80}}>
            <div style={{fontSize:13,fontWeight:500,color:'var(--charcoal)',marginBottom:16}}>Order Summary</div>
            {cart.slice(0,3).map((item,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--muted)',marginBottom:8}}>
                <span>{item.name.length > 24 ? item.name.slice(0,24)+'...' : item.name}</span>
                <span>£{item.price}</span>
              </div>
            ))}
            {cart.length > 3 && <div style={{fontSize:11,color:'var(--muted)',marginBottom:8}}>+{cart.length-3} more items</div>}
            <div style={{height:1,background:'var(--border)',margin:'16px 0'}}/>

            {/* Coupon Code Section */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:'var(--muted)',marginBottom:8}}>Have a coupon?</div>
              <div style={{display:'flex',gap:8}}>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex:1,
                    padding:'8px 12px',
                    border:`1px solid ${couponError ? '#EF4444' : 'var(--border)'}`,
                    borderRadius:6,
                    fontSize:12,
                    fontFamily:'inherit',
                    outline:'none',
                    background:'var(--coconut)'
                  }}
                />
                <button
                  onClick={applyCoupon}
                  style={{
                    padding:'8px 16px',
                    background:'var(--charcoal)',
                    color:'white',
                    border:'none',
                    borderRadius:6,
                    fontSize:12,
                    fontWeight:500,
                    cursor:'pointer'
                  }}
                >
                  Apply
                </button>
              </div>
              {couponError && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{couponError}</p>}
              {discount > 0 && <p style={{color:'#10B981',fontSize:11,marginTop:4}}>Coupon applied! £{discount.toFixed(2)} discount</p>}
            </div>

            <div style={{height:1,background:'var(--border)',margin:'16px 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--muted)',marginBottom:8}}>
              <span>Subtotal</span><span>£{total.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'#10B981',marginBottom:8}}>
                <span>Discount ({couponCode.toUpperCase()})</span><span>-£{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--muted)',marginBottom:8}}>
              <span>Delivery</span><span>{total >= 40 ? 'Free' : '£3.99'}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:17,fontWeight:600,color:'var(--charcoal)',marginBottom:20}}>
              <span>Total</span><span>£{(() => {
                const subtotal = total - discount
                const deliveryCost = total >= 40 ? 0 : 3.99
                return Math.max(0, subtotal + deliveryCost).toFixed(2)
              })()}</span>
            </div>
            <button className="btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={handlePlace}>
              Place Order
            </button>
            <p style={{fontSize:11,color:'var(--muted)',textAlign:'center',marginTop:12}}>Your payment details are protected with 256-bit SSL encryption.</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

function SkinQuiz({ userId }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)

  const questions = [
    {
      q: 'How does your skin feel by midday?',
      key: 'midday',
      options: [
        { text: 'Oily and shiny all over',         scores: { oily: 3 } },
        { text: 'Dry, tight or flaky',              scores: { dry: 3 } },
        { text: 'Oily in T-zone, dry on cheeks',   scores: { combination: 3 } },
        { text: 'Normal and comfortable',           scores: { normal: 3 } },
      ]
    },
    {
      q: 'How does your skin feel right after cleansing?',
      key: 'post_cleanse',
      options: [
        { text: 'Very tight and dry',               scores: { dry: 3, sensitive: 1 } },
        { text: 'Still slightly oily',              scores: { oily: 3 } },
        { text: 'Comfortable and balanced',         scores: { normal: 3 } },
        { text: 'Dry on cheeks, fine elsewhere',    scores: { combination: 3 } },
      ]
    },
    {
      q: 'How visible are your pores?',
      key: 'pores',
      options: [
        { text: 'Very visible across my whole face',  scores: { oily: 3 } },
        { text: 'Visible mainly on nose and forehead',scores: { combination: 3 } },
        { text: 'Barely visible',                     scores: { dry: 2, normal: 1 } },
        { text: 'Not visible at all',                 scores: { normal: 2, dry: 1 } },
      ]
    },
    {
      q: 'How often do you experience breakouts?',
      key: 'breakouts',
      options: [
        { text: 'Frequently — multiple times a month', scores: { oily: 2, acne: 3 } },
        { text: 'Occasionally around my T-zone',       scores: { combination: 2, acne: 1 } },
        { text: 'Rarely, usually hormonal',            scores: { normal: 2 } },
        { text: 'Almost never',                        scores: { dry: 1, normal: 1 } },
      ]
    },
    {
      q: 'How does your skin react to new products?',
      key: 'reactivity',
      options: [
        { text: 'Frequently reacts — redness or burning', scores: { sensitive: 3 } },
        { text: 'Sometimes gets a little red',            scores: { sensitive: 2 } },
        { text: 'Occasional breakouts only',              scores: { normal: 1, acne: 1 } },
        { text: 'Rarely or never reacts',                 scores: { normal: 2 } },
      ]
    },
    {
      q: 'How would you describe your skin texture?',
      key: 'texture',
      options: [
        { text: 'Rough, uneven or dull',              scores: { dry: 2, dullness: 2 } },
        { text: 'Bumpy with clogged or enlarged pores',scores: { oily: 2, acne: 2 } },
        { text: 'Smooth but occasional dry patches',   scores: { combination: 2 } },
        { text: 'Generally smooth and even',           scores: { normal: 3 } },
      ]
    },
    {
      q: 'How does your skin behave in cold or dry weather?',
      key: 'cold_weather',
      options: [
        { text: 'Very dry, flaky and uncomfortable',  scores: { dry: 3 } },
        { text: 'Gets dry but manageable',            scores: { combination: 2, dry: 1 } },
        { text: 'Becomes red and irritated',          scores: { sensitive: 3 } },
        { text: 'Barely changes',                     scores: { oily: 2, normal: 1 } },
      ]
    },
    {
      q: 'Do you notice visible redness, flushing or irritation?',
      key: 'redness',
      options: [
        { text: 'Yes, frequently and easily triggered', scores: { sensitive: 3 } },
        { text: 'Occasionally, especially after washing',scores: { sensitive: 2 } },
        { text: 'Rarely — only from specific products', scores: { normal: 2 } },
        { text: 'Almost never',                         scores: { normal: 2, oily: 1 } },
      ]
    },
    {
      q: 'What signs of ageing are you noticing?',
      key: 'ageing',
      options: [
        { text: 'Fine lines and loss of firmness',     scores: { mature: 3 } },
        { text: 'Dark spots or uneven skin tone',      scores: { dullness: 3 } },
        { text: 'Some dehydration lines',              scores: { dry: 2, mature: 1 } },
        { text: 'None — this is not a concern yet',    scores: { normal: 1 } },
      ]
    },
    {
      q: 'What is your biggest skin concern right now?',
      key: 'concern',
      options: [
        { text: 'Dullness and uneven skin tone',   scores: { dullness: 3 } },
        { text: 'Breakouts and clogged pores',     scores: { acne: 3 } },
        { text: 'Dryness and lack of hydration',   scores: { dry: 3 } },
        { text: 'Fine lines and firmness',         scores: { mature: 3 } },
      ]
    },
  ]

  function answer(option) {
    const newAnswers = { ...answers, [step]: option.text }
    setAnswers(newAnswers)

    // Accumulate scores
    const allScores = {}
    const allOptions = Object.values({ ...answers, [step]: option }).map((a, i) => {
      if (typeof a === 'string') return null
      return a
    }).filter(Boolean)

    // Build scores from all answers including current
    const scoreMap = { oily: 0, dry: 0, combination: 0, normal: 0, sensitive: 0, mature: 0, acne: 0, dullness: 0 }

    // Add previous answers' scores
    Object.entries(answers).forEach(([stepIdx, optText]) => {
      const q = questions[parseInt(stepIdx)]
      const opt = q.options.find(o => o.text === optText)
      if (opt) Object.entries(opt.scores).forEach(([k, v]) => { scoreMap[k] = (scoreMap[k] || 0) + v })
    })
    // Add current answer scores
    Object.entries(option.scores).forEach(([k, v]) => { scoreMap[k] = (scoreMap[k] || 0) + v })

    if (step < questions.length - 1) {
      setStep(s => s + 1)
      setAnswers(newAnswers)
    } else {
      // Determine skin type
      const skinTypes = ['oily', 'dry', 'combination', 'normal', 'sensitive']
      const skinType = skinTypes.reduce((a, b) => scoreMap[a] >= scoreMap[b] ? a : b)

      // Determine top 2 concerns
      const concerns = ['acne', 'dullness', 'mature', 'sensitive', 'dry']
        .sort((a, b) => (scoreMap[b] || 0) - (scoreMap[a] || 0))
        .slice(0, 2)

      // Map to product recommendations
      const skinTagMap = {
        oily:        ['Oily', 'Acne-Prone', 'Congested'],
        dry:         ['Dry', 'Dehydrated', 'Sensitive'],
        combination: ['Combination', 'Oily', 'Dull'],
        normal:      ['All Types', 'Normal'],
        sensitive:   ['Sensitive', 'Rosacea'],
      }
      const concernTagMap = {
        acne:     ['Acne-Prone', 'Congested', 'Oily'],
        dullness: ['Dull', 'Uneven Tone'],
        mature:   ['Mature', 'Uneven Tone'],
        dry:      ['Dry', 'Dehydrated'],
        sensitive:['Sensitive', 'Rosacea'],
      }

      const tags = [
        ...(skinTagMap[skinType] || []),
        ...(concerns.flatMap(c => concernTagMap[c] || []))
      ]

      const recs = PRODUCTS
        .filter(p => p.skin.some(s => tags.includes(s)))
        .slice(0, 6)

      const finalResult = { skinType, concerns, recs, scores: scoreMap }
      setResult(finalResult)
      setAnswers(newAnswers)

      // Save to Supabase if logged in
      if (userId) {
        saveProfile(finalResult, newAnswers)
      }
    }
  }

  async function saveProfile(finalResult, allAnswers) {
    await db.from('skin_profile').upsert({
      user_id: userId,
      skin_type: finalResult.skinType,
      concerns: finalResult.concerns,
      quiz_answers: allAnswers,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    setSaved(true)
  }

  const skinTypeInfo = {
    oily:        { label: 'Oily Skin',         emoji: '✨', desc: 'Your skin produces excess sebum, leading to shine and enlarged pores. Focus on balancing and non-comedogenic formulas.' },
    dry:         { label: 'Dry Skin',           emoji: '🌿', desc: 'Your skin lacks moisture and natural oils. Focus on rich hydration, barrier repair and gentle cleansing.' },
    combination: { label: 'Combination Skin',   emoji: '⚖️', desc: 'You have an oily T-zone with drier cheeks. Balance is key — lightweight hydration and targeted treatments.' },
    normal:      { label: 'Normal Skin',        emoji: '🌸', desc: 'Your skin is well-balanced. Focus on maintaining your barrier and preventing future concerns.' },
    sensitive:   { label: 'Sensitive Skin',     emoji: '🤍', desc: 'Your skin reacts easily. Prioritise fragrance-free, gentle formulas that strengthen your skin barrier.' },
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      {!result ? (
        <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--peach)', marginBottom: 16 }}>
            Question {step + 1} of {questions.length}
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 40 }}>
            <div style={{ height: '100%', background: 'linear-gradient(135deg,var(--peach),var(--pink))', borderRadius: 2, width: `${((step + 1) / questions.length) * 100}%`, transition: 'width .4s' }} />
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 34, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 32 }}>
            {questions[step].q}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {questions[step].options.map(opt => (
              <button key={opt.text} onClick={() => answer(opt)} style={{
                padding: '16px 24px', border: '1.5px solid var(--border)', borderRadius: 12,
                background: 'var(--white)', fontSize: 14, color: 'var(--charcoal)', cursor: 'pointer',
                transition: 'all .2s', textAlign: 'left', fontFamily: 'inherit'
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--peach)'; e.currentTarget.style.background = 'var(--peach-light)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--white)' }}>
                {opt.text}
              </button>
            ))}
          </div>
          <button onClick={() => { if (step > 0) { setStep(s => s - 1) } }} style={{ marginTop: 24, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: step > 0 ? 'pointer' : 'default', opacity: step > 0 ? 1 : 0, fontFamily: 'inherit' }}>
            ← Back
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 800, width: '100%' }}>
          {/* Skin Type Result */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{skinTypeInfo[result.skinType]?.emoji}</div>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--peach)', marginBottom: 8 }}>Your Skin Type</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 48, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 16 }}>
              {skinTypeInfo[result.skinType]?.label}
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: 500, margin: '0 auto', lineHeight: 1.9, fontSize: 14 }}>
              {skinTypeInfo[result.skinType]?.desc}
            </p>

            {/* Concerns badges */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
              {result.concerns.map(c => (
                <span key={c} style={{ background: 'var(--peach-light)', color: 'var(--peach)', fontSize: 12, padding: '6px 16px', borderRadius: 20, textTransform: 'capitalize' }}>
                  {c === 'acne' ? 'Acne-Prone' : c === 'dullness' ? 'Dullness & Tone' : c === 'mature' ? 'Anti-Ageing' : c === 'dry' ? 'Dehydration' : 'Sensitivity'}
                </span>
              ))}
            </div>

            {saved && (
              <div style={{ marginTop: 16, fontSize: 12, color: '#166534', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '8px 16px', display: 'inline-block' }}>
                ✓ Skin profile saved to your account
              </div>
            )}
            {!userId && (
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
                <span style={{ color: 'var(--peach)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in</span> to save your skin profile
              </div>
            )}
          </div>

          {/* Product Recommendations */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 40 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 8, textAlign: 'center' }}>Your Formula</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', marginBottom: 32 }}>Personalised picks based on your skin type and concerns</p>
            <div className="product-grid three-col">
              {result.recs.map(p => (
                <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="card-img">
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="card-body">
                    <div className="card-category">{p.category}</div>
                    <div className="card-name">{p.name}</div>
                    <div className="card-price">£{p.price}.00</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
            <button className="btn-primary" onClick={() => navigate('/catalogue')}>Shop All Products</button>
            <button onClick={() => { setStep(0); setAnswers({}); setResult(null); setSaved(false) }}
              style={{ background: 'transparent', border: '1.5px solid var(--border)', padding: '13px 32px', fontSize: 13, borderRadius: 40, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--charcoal)' }}>
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function About() {
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  
  return (
    <div>
      <section style={{background:'linear-gradient(135deg,#FDE8D8,#FCE7F3)',padding:'100px 48px',textAlign:'center'}}>
        <p style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--peach)',marginBottom:16}}>Our Story</p>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:58,fontWeight:300,color:'var(--charcoal)',maxWidth:700,margin:'0 auto 24px',lineHeight:1.15}}>
          Born from frustration.<br/><em style={{color:'var(--pink)'}}>Built for your skin.</em>
        </h1>
        <p style={{fontSize:15,color:'var(--muted)',maxWidth:540,margin:'0 auto',lineHeight:1.9}}>
          Formula Me started with a simple problem — buying the wrong skincare product, again and again.
        </p>
      </section>

      <section style={{maxWidth:760,margin:'0 auto',padding:'80px 48px'}}>
        <div style={{display:'grid',gap:48}}>
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:34,fontWeight:300,color:'var(--charcoal)',marginBottom:20}}>The Problem</h2>
            <p style={{fontSize:15,color:'var(--muted)',lineHeight:2}}>
              I love makeup. Always have. But my skin has never loved it back. For years I bought products that looked beautiful on screen, had thousands of positive reviews, and still managed to break me out, dry me out, or simply do nothing at all. The issue was never the products themselves — it was the mismatch. I was shopping without really knowing my skin.
            </p>
            <p style={{fontSize:15,color:'var(--muted)',lineHeight:2,marginTop:16}}>
              Every wasted product was money gone and, more frustratingly, hope gone. I wanted glowing skin and instead I was cycling through half-used serums and foundations that sat on my shelf doing nothing. I knew there had to be a better way to shop for skincare — one that started with understanding your skin first, not after the damage was done.
            </p>
          </div>

          <div style={{height:1,background:'var(--border)'}}/>

          <div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:34,fontWeight:300,color:'var(--charcoal)',marginBottom:20}}>The Idea</h2>
            <p style={{fontSize:15,color:'var(--muted)',lineHeight:2}}>
              Formula Me was designed around one belief — makeup and skincare should work together, not against each other. Every product on this platform is selected because it pulls double duty: it enhances how you look while actively caring for your skin beneath the surface. No compromise.
            </p>
            <p style={{fontSize:15,color:'var(--muted)',lineHeight:2,marginTop:16}}>
              The Skin Quiz at the heart of Formula Me is the feature I always wished existed. Answer four honest questions about your skin and receive a personalised set of recommendations that are actually matched to you — not to a marketing budget or a trending ingredient.
            </p>
          </div>

          <div style={{height:1,background:'var(--border)'}}/>

          <div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:34,fontWeight:300,color:'var(--charcoal)',marginBottom:20}}>The Project</h2>
            <p style={{fontSize:15,color:'var(--muted)',lineHeight:2}}>
              Formula Me was built as a group computing project at university of west london in 2026. What started as a brief became something that felt genuinely worth building. The platform was designed and developed by a team of five students — covering requirements, planning, design, backend infrastructure, and database architecture — working across four agile sprints.
            </p>
            <p style={{fontSize:15,color:'var(--muted)',lineHeight:2,marginTop:16}}>
              The frontend was designed with the belief that a skincare platform should feel as considered as the products it sells. Clean, warm, and personal — not clinical. Every colour, font, and layout decision was made with that in mind.
            </p>
            <p style={{fontSize:15,color:'var(--muted)',lineHeight:2,marginTop:16}}>
              This may be a university project today. But the problem it solves is real, the need is real, and the idea is one worth taking further. Formula Me is what happens when someone who genuinely struggled to find the right products decides to build the solution they always needed.
            </p>
          </div>

          <div style={{height:1,background:'var(--border)'}}/>

          <div style={{background:'var(--peach-light)',borderRadius:16,padding:36,textAlign:'center'}}>
            <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,fontWeight:300,color:'var(--charcoal)',marginBottom:12}}>Meet the Team</h3>
            <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.9,marginBottom:8}}>
              Formula Me was built by a team of five cyber secuity students as part of a group software development module.
            </p>
            <div style={{display:'flex',justifyContent:'center',gap:32,flexWrap:'wrap',marginTop:24}}>
              {['Zaina Mahien · Frontend Design','Hawa Hayat Ali · Project Planning','Amina Rifa · Requirements','Faiha Mubarak · Backend','Nurah  ·  Database & Security'].map(m => (
                <div key={m} style={{fontSize:12,color:'var(--charcoal)',fontWeight:500}}>{m}</div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section style={{background:'var(--charcoal)',padding:'80px 48px',textAlign:'center'}}>
        <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:38,fontWeight:300,color:'var(--coconut)',marginBottom:16}}>Ready to find your formula?</h2>
        <p style={{color:'#888',marginBottom:32,fontSize:14}}>Take the skin quiz and get products matched to your skin in under a minute.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center'}}>
          <button className="btn-primary" onClick={() => navigate('/quiz')}>Take Skin Quiz</button>
          <button style={{background:'transparent',color:'var(--coconut)',border:'1.5px solid #666',padding:'13px 32px',fontSize:13,letterSpacing:'.08em',textTransform:'uppercase',borderRadius:40,cursor:'pointer'}} onClick={() => navigate('/catalogue')}>Shop Now</button>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e = {}
    if (!isLogin && !form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    setErrors(e)
    setAuthError('')
    if (Object.keys(e).length !== 0) return
    setLoading(true)

    if (isLogin) {
  // ── SIGN IN ──
  const { data, error } = await db.auth.signInWithPassword({
    email: form.email,
    password: form.password
  })
  if (error) {
    setAuthError(error.message)
    try {
      await db.from('failed_logins').insert({ email: form.email, attempted_at: new Date().toISOString() })
    } catch (logErr) {
      console.error('Failed to log login attempt:', logErr)
    }
  } else {
    setLoading(false)
    navigate('/profile')
    return
  }

} else {
  // ── REGISTER ──
  const { data, error } = await db.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: { full_name: form.name }
    }
  })
  if (error) {
    setAuthError(error.message)
  } else {
    setLoading(false)
    navigate('/login')
    return
  }}
  setLoading(false)
  }
  if (submitted) return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <div style={{width:64,height:64,borderRadius:'50%',background:'var(--peach-light)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width="28" height="28" fill="none" stroke="var(--peach)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:300}}>
        {isLogin ? 'Welcome back.' : 'Account created.'}
      </h2>
      <p style={{color:'var(--muted)'}}>
        {isLogin ? 'You are now signed in.' : 'Check your email to confirm your account.'}
      </p>
      <button className="btn-primary" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  )

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
      <div style={{maxWidth:420,width:'100%',background:'var(--white)',border:'1px solid var(--border)',borderRadius:20,padding:40}}>
        <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:300,color:'var(--charcoal)',marginBottom:8,textAlign:'center'}}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{color:'var(--muted)',fontSize:13,textAlign:'center',marginBottom:32}}>
          {isLogin ? 'Sign in to your Formula Me account' : 'Join Formula Me today'}
        </p>

        <div style={{display:'flex',marginBottom:28,border:'1px solid var(--border)',borderRadius:8,overflow:'hidden'}}>
          <button onClick={() => { setIsLogin(true); setAuthError('') }}
            style={{flex:1,padding:'10px',border:'none',background:isLogin?'var(--peach-light)':'transparent',color:isLogin?'var(--charcoal)':'var(--muted)',fontWeight:isLogin?500:400,cursor:'pointer',fontFamily:'inherit',fontSize:13}}>
            Sign In
          </button>
          <button onClick={() => { setIsLogin(false); setAuthError('') }}
            style={{flex:1,padding:'10px',border:'none',background:!isLogin?'var(--peach-light)':'transparent',color:!isLogin?'var(--charcoal)':'var(--muted)',fontWeight:!isLogin?500:400,cursor:'pointer',fontFamily:'inherit',fontSize:13}}>
            Register
          </button>
        </div>

        {authError && (
          <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:12,color:'#DC2626'}}>
            {authError}
          </div>
        )}

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {!isLogin && (
            <div>
              <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>Full Name</label>
              <input value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                placeholder="Your name"
                style={{width:'100%',padding:'12px 16px',border:`1.5px solid ${errors.name?'#F87171':'var(--border)'}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',background:'var(--coconut)'}}/>
              {errors.name && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors.name}</p>}
            </div>
          )}
          <div>
            <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
              placeholder="you@email.com"
              style={{width:'100%',padding:'12px 16px',border:`1.5px solid ${errors.email?'#F87171':'var(--border)'}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',background:'var(--coconut)'}}/>
            {errors.email && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors.email}</p>}
          </div>
          <div>
            <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})}
              placeholder="Min. 8 characters"
              style={{width:'100%',padding:'12px 16px',border:`1.5px solid ${errors.password?'#F87171':'var(--border)'}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',background:'var(--coconut)'}}/>
            {errors.password && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors.password}</p>}
          </div>
          <button className="btn-primary"
            style={{width:'100%',justifyContent:'center',marginTop:8,opacity:loading?0.7:1}}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </div>
      </div>
    </div>
  )
}

function SkinProfileCard({ userId }) {
  const navigate = useNavigate()
  const [skinProfile, setSkinProfile] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    if (!userId) return
    async function load() {
      try {
        const { data, error } = await db
          .from('skin_profile').select('*')
          .eq('user_id', userId).single()
        if (error || !data) return
        setSkinProfile(data)
        const { data: recData, error: recError } = await db
          .from('product_recommendation')
          .select('product_id')
          .eq('skin_type', data.skin_type)
        if (!recError && recData) {
          const ids = recData.map(r => r.product_id)
          const recs = PRODUCTS.filter(p => ids.includes(p.id)).slice(0, 4)
          setRecommendations(recs)
        }
      } catch (err) {
        console.error('Failed to load skin profile:', err)
      }
    }
    load()
  }, [userId])

  const skinTypeInfo = {
    oily:        { label: 'Oily Skin',        emoji: '✨' },
    dry:         { label: 'Dry Skin',         emoji: '🌿' },
    combination: { label: 'Combination Skin', emoji: '⚖️' },
    normal:      { label: 'Normal Skin',      emoji: '🌸' },
    sensitive:   { label: 'Sensitive Skin',   emoji: '🤍' },
  }

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 20 }}>Your Skin Profile</h3>
      {skinProfile ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <span style={{ fontSize: 36 }}>{skinTypeInfo[skinProfile.skin_type]?.emoji}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--charcoal)' }}>{skinTypeInfo[skinProfile.skin_type]?.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Last updated {new Date(skinProfile.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {skinProfile.concerns?.map(c => (
              <span key={c} style={{ background: 'var(--peach-light)', color: 'var(--peach)', fontSize: 11, padding: '4px 14px', borderRadius: 20, textTransform: 'capitalize' }}>{c}</span>
            ))}
          </div>

          {/* Recommended Products */}
          {recommendations.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Recommended for you</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {recommendations.map(p => (
                  <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
                    style={{ cursor: 'pointer', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--coconut)' }}>
                    <img src={p.images[0]} alt={p.name}
                      style={{ width: '100%', height: 80, objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }} />
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{p.category}</div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--charcoal)', lineHeight: 1.3 }}>{p.name.length > 22 ? p.name.slice(0, 22) + '...' : p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--peach)', marginTop: 4 }}>£{p.price}.00</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => navigate('/quiz')} style={{ background: 'transparent', border: '1.5px solid var(--border)', padding: '10px 24px', borderRadius: 40, fontSize: 12, color: 'var(--charcoal)', cursor: 'pointer', fontFamily: 'inherit' }}>
            Retake Quiz
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>You haven't taken the skin quiz yet. Get personalised product recommendations in under 2 minutes.</p>
          <button className="btn-primary" onClick={() => navigate('/quiz')}>Take Skin Quiz</button>
        </div>
      )}
    </div>
  )
}

function Profile({ userId }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [skinProfile, setSkinProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [reviewForm, setReviewForm] = useState({ product_id: '', rating: 5, comment: '' })
  const [orderedProducts, setOrderedProducts] = useState([])
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterDone, setNewsletterDone] = useState(false)
  const [newsletterError, setNewsletterError] = useState(null)
  const [editForm, setEditForm] = useState({ full_name: '', email: '' })
  const [editSaved, setEditSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (!userId) { navigate('/login'); return }
  async function load() {
    const { data: userData } = await db
      .from('users').select('*').eq('user_id', userId).single()
    if (userData) {
      setUser(userData)
      setEditForm({ full_name: userData.username || '', email: userData.email || '' })
      setNewsletterEmail(userData.email || '')
    }

    const { data: orderData } = await db
      .from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (orderData) setOrders(orderData)

    const { data: skinData } = await db
      .from('skin_profile').select('*').eq('user_id', userId).single()
    if (skinData) setSkinProfile(skinData)

    // Load products from user's orders
    const { data: orderItemsData } = await db
      .from('order_items')
      .select('product_id')
      .in('orders_id', orderData?.map(o => o.order_id) || [])

    if (orderItemsData) {
      const uniqueProductIds = [...new Set(orderItemsData.map(i => i.product_id))]
      const purchasedProducts = PRODUCTS.filter(p => uniqueProductIds.includes(p.id))
      setOrderedProducts(purchasedProducts)
    }

    setLoading(false)
  }
  load()
}, [userId])

  async function handleSaveProfile() {
    await db.from('users').update({
      username: editForm.full_name,
      email: editForm.email
    }).eq('user_id', userId)
    setUser(u => ({ ...u, username: editForm.full_name, email: editForm.email }))
    setEditSaved(true)
    setTimeout(() => setEditSaved(false), 2500)
  }

  async function handleNewsletterSignup() {
    if (!newsletterEmail.includes('@')) return
    
    try {
      setNewsletterError(null)
      const { error: insertError } = await db.from('newsletter_subscription').upsert(
        {
          email: newsletterEmail.toLowerCase().trim(),
          user_id: userId || null,
          subscribed_at: new Date().toISOString()
        },
        {
          onConflict: 'email',
          ignoreDuplicates: true
        }
      )
      
      if (insertError) throw insertError
      
      setNewsletterDone(true)
      setTimeout(() => {
        setNewsletterDone(false)
        setNewsletterEmail(user?.email || '')
        setNewsletterError(null)
      }, 4000)
    } catch (err) {
      console.error('Newsletter signup error:', err)
      setNewsletterError(err.message || 'Failed to subscribe. Please try again.')
    }
  }

  async function handleReviewSubmit() {
  if (!reviewForm.comment.trim() || reviewForm.comment.length < 10) return

  const insertData = {
    user_id: userId,
    rating: reviewForm.rating,
    comment: reviewForm.comment.trim(),
    created_at: new Date().toISOString(),
    product_id: reviewForm.review_type === 'product' ? parseInt(reviewForm.product_id) : null
  }

  const { error } = await db.from('reviews').insert(insertData)

  if (error) {
    console.error('Review error:', error)
    alert('Failed to submit review. Please try again.')
    return
  }

  setReviewSubmitted(true)
  setTimeout(() => {
    setReviewSubmitted(false)
    setReviewForm({ product_id: '', rating: 5, comment: '', review_type: 'brand' })
    setOrderedProducts([])
  }, 4000)
}

  async function handleDeleteAccount() {
    await db.from('users').delete().eq('user_id', userId)
    await db.auth.delete()
    navigate('/')
  }

  async function handleLogout() {
    await db.auth.signOut()
    navigate('/')
  }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading your profile...</p>
    </div>
  )

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: 'Orders' },
    { key: 'review', label: 'Leave a Review' },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FDE8D8, #FCE7F3)',
        padding: '48px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--peach)', marginBottom: 8 }}>
              Welcome back
            </p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 8 }}>
              Hello, {user?.username || 'there'} 👋
            </h1>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>
              {user?.email} · Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : ''}
            </p>
          </div>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1.5px solid var(--border)',
            padding: '10px 24px', borderRadius: 40, fontSize: 12,
            color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: '.08em', textTransform: 'uppercase'
          }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--white)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '16px 28px', border: 'none', background: 'transparent',
              fontSize: 13, color: activeTab === t.key ? 'var(--charcoal)' : 'var(--muted)',
              fontWeight: activeTab === t.key ? 500 : 400, cursor: 'pointer',
              borderBottom: activeTab === t.key ? '2px solid var(--peach)' : '2px solid transparent',
              fontFamily: 'inherit', transition: 'all .2s'
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: 24 }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Total Orders', value: orders.length },
                { label: 'Total Spent', value: `£${orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)}` },
                { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).getFullYear() : '—' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <SkinProfileCard userId={userId} />
            {/* Product Recommendation - Show only if quiz hasn't been taken */}
            {!skinProfile && (
              <div style={{ background: 'linear-gradient(135deg, #FDE8D8, #FCE7F3)', borderRadius: 16, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 8 }}>
                    Find your perfect formula ✨
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 400, lineHeight: 1.8 }}>
                    Answer 10 quick questions and get personalised product recommendations matched to your skin type and concerns.
                  </p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/quiz')}>Take Skin Quiz</button>
              </div>
            )}

            {/* Newsletter */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 8 }}>
                Newsletter & Exclusive Offers
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.8 }}>
                Subscribe to get early access to new products, exclusive discount codes, and personalised skincare tips.
              </p>
            {newsletterDone ? (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#166534' }}>
                  🎉 You're subscribed! Check your inbox for a welcome discount code.
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 12, marginBottom: newsletterError ? 12 : 0 }}>
                    <input value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)' }} />
                    <button className="btn-primary" onClick={handleNewsletterSignup}>Subscribe</button>
                  </div>
                  {newsletterError && (
                    <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#DC2626' }}>
                      {newsletterError}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Recent Orders Preview */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 300, color: 'var(--charcoal)' }}>Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--peach)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>View all →</button>
              </div>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 13 }}>No orders yet. <span style={{ color: 'var(--peach)', cursor: 'pointer' }} onClick={() => navigate('/catalogue')}>Start shopping →</span></p>
              ) : (
                orders.slice(0, 3).map(order => (
                  <div key={order.order_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 2 }}>Order #{order.order_id}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>£{order.total?.toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: 'var(--peach)', textTransform: 'capitalize' }}>{order.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 24 }}>Your Orders</h2>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: 'var(--muted)', marginBottom: 20 }}>You haven't placed any orders yet.</p>
                <button className="btn-primary" onClick={() => navigate('/catalogue')}>Start Shopping</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.map(order => (
                  <div key={order.order_id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 4 }}>Order #{order.order_id}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        {order.address && <div style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {order.address}</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 4 }}>£{order.total?.toFixed(2)}</div>
                        <span style={{ background: 'var(--peach-light)', color: 'var(--peach)', fontSize: 11, padding: '4px 12px', borderRadius: 20, textTransform: 'capitalize' }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        
        )}

{activeTab === 'review' && (
  <div style={{ maxWidth: 600 }}>
    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 8 }}>Leave a Review</h2>
    <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32, lineHeight: 1.8 }}>
      Share your experience with Formula Me or review a product you've purchased.
    </p>

    {!userId ? (
      <div style={{ background: 'var(--peach-light)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--charcoal)', marginBottom: 16 }}>You need to be signed in to leave a review.</p>
        <button className="btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    ) : reviewSubmitted ? (
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🌟</div>
        <p style={{ color: '#166534', fontSize: 14 }}>
          {reviewForm.review_type === 'brand'
            ? 'Thank you! Your brand review will appear on our homepage.'
            : 'Thank you! Your product review will appear on the product page.'}
        </p>
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Review Type Toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <button
            onClick={() => setReviewForm({ ...reviewForm, review_type: 'brand', product_id: '' })}
            style={{
              flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
              background: reviewForm.review_type === 'brand' ? 'var(--peach-light)' : 'transparent',
              color: reviewForm.review_type === 'brand' ? 'var(--charcoal)' : 'var(--muted)',
              fontWeight: reviewForm.review_type === 'brand' ? 500 : 400
            }}>
            🌸 Brand Review
          </button>
          <button
            onClick={() => setReviewForm({ ...reviewForm, review_type: 'product' })}
            style={{
              flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
              background: reviewForm.review_type === 'product' ? 'var(--peach-light)' : 'transparent',
              color: reviewForm.review_type === 'product' ? 'var(--charcoal)' : 'var(--muted)',
              fontWeight: reviewForm.review_type === 'product' ? 500 : 400
            }}>
            🧴 Product Review
          </button>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Product selector — only shown for product reviews */}
          {reviewForm.review_type === 'product' && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                Select a Product You've Purchased
              </label>
              {orderedProducts.length === 0 ? (
                <div style={{ background: 'var(--coconut)', borderRadius: 8, padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>
                  You haven't purchased any products yet.{' '}
                  <span style={{ color: 'var(--peach)', cursor: 'pointer' }} onClick={() => navigate('/catalogue')}>
                    Shop now →
                  </span>
                </div>
              ) : (
                <select
                  value={reviewForm.product_id}
                  onChange={e => setReviewForm({ ...reviewForm, product_id: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)' }}>
                  <option value="">Choose a product you've ordered...</option>
                  {orderedProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Brand review helper text */}
          {reviewForm.review_type === 'brand' && (
            <div style={{ background: 'var(--peach-light)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--charcoal)' }}>
              💬 Brand reviews appear on our homepage carousel for all visitors to see.
            </div>
          )}

          {/* Star Rating */}
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Your Rating</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 32, padding: 0,
                    opacity: s <= reviewForm.rating ? 1 : 0.25,
                    transition: 'opacity .2s, transform .2s',
                    transform: s <= reviewForm.rating ? 'scale(1.1)' : 'scale(1)'
                  }}>
                  ★
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
              {reviewForm.rating === 5 ? 'Excellent!' : reviewForm.rating === 4 ? 'Very Good' : reviewForm.rating === 3 ? 'Good' : reviewForm.rating === 2 ? 'Fair' : 'Poor'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
              {reviewForm.review_type === 'brand' ? 'Your Experience with Formula Me' : 'Your Product Review'}
            </label>
            <textarea
              value={reviewForm.comment}
              onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder={reviewForm.review_type === 'brand'
                ? 'Tell us about your overall experience with Formula Me — your skin journey, favourite products, and results...'
                : 'How has this product worked for your skin? Share your honest experience...'}
              rows={5}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)', resize: 'vertical' }}
            />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{reviewForm.comment.length}/500 characters</p>
          </div>

          <button
            className="btn-primary"
            onClick={handleReviewSubmit}
            disabled={
              !reviewForm.comment.trim() ||
              reviewForm.comment.length < 10 ||
              (reviewForm.review_type === 'product' && !reviewForm.product_id)
            }
            style={{
              alignSelf: 'flex-start',
              opacity: (!reviewForm.comment.trim() || reviewForm.comment.length < 10 || (reviewForm.review_type === 'product' && !reviewForm.product_id)) ? 0.5 : 1
            }}>
            Submit Review
          </button>
        </div>
      </div>
    )}
  </div>
)}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300, color: 'var(--charcoal)' }}>Account Settings</h2>

            {/* Edit Profile */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 20 }}>Edit Profile</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                  {editSaved && <span style={{ fontSize: 12, color: '#166534' }}>✓ Saved successfully</span>}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 8 }}>Password</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Send a password reset link to your email.</p>
              <button onClick={async () => {
                await db.auth.resetPasswordForEmail(user?.email)
                alert('Password reset email sent!')
              }} style={{ background: 'transparent', border: '1.5px solid var(--border)', padding: '10px 24px', borderRadius: 40, fontSize: 12, color: 'var(--charcoal)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Send Reset Email
              </button>
            </div>

            {/* Delete Account */}
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, color: '#DC2626', marginBottom: 8 }}>Delete Account</h3>
              <p style={{ fontSize: 13, color: '#EF4444', marginBottom: 16, lineHeight: 1.8 }}>
                This will permanently delete your account, orders, and all saved data. This action cannot be undone.
              </p>
              {!deleteConfirm ? (
                <button onClick={() => setDeleteConfirm(true)} style={{ background: 'transparent', border: '1.5px solid #FECACA', padding: '10px 24px', borderRadius: 40, fontSize: 12, color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Delete My Account
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#DC2626' }}>Are you sure?</span>
                  <button onClick={handleDeleteAccount} style={{ background: '#DC2626', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 40, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Yes, Delete
                  </button>
                  <button onClick={() => setDeleteConfirm(false)} style={{ background: 'transparent', border: '1.5px solid var(--border)', padding: '10px 24px', borderRadius: 40, fontSize: 12, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
function Sustainability() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [activeTab, setActiveTab] = useState('packaging')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'packaging', label: 'Eco Packaging', icon: '📦', color: '#F2A07B' },
    { id: 'ingredients', label: 'Clean Ingredients', icon: '🌿', color: '#F472B6' },
    { id: 'carbon', label: 'Carbon Neutral', icon: '🌍', color: '#C4B5FD' },
    { id: 'community', label: 'Community Impact', icon: '🤝', color: '#FDE8D8' }
  ]

  return (
    <div>
      <section style={{background: 'linear-gradient(135deg, #FDF8F2, #FDE8D8)', padding:'100px 48px', textAlign:'center'}}>
        <p style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'#F2A07B',marginBottom:16}}>Our Commitment</p>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:58,fontWeight:300,color:'#F472B6',maxWidth:700,margin:'0 auto 24px',lineHeight:1.15}}>
          Beauty that <em style={{color:'#C4B5FD'}}>heals</em> the planet
        </h1>
        <p style={{fontSize:15,color:'#666',maxWidth:540,margin:'0 auto',lineHeight:1.9}}>
          Every product is designed with both your skin and our earth in mind. We're on a mission to make beauty sustainable, ethical, and kind.
        </p>
        <div style={{marginTop:40, display:'flex', justifyContent:'center', gap:20, flexWrap:'wrap'}}>
          <div style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', minWidth:200}}>
            <div style={{fontSize:32, marginBottom:8}}>🌱</div>
            <div style={{fontSize:24, fontWeight:'bold', color:'#F2A07B'}}>100%</div>
            <div style={{fontSize:14, color:'#666'}}>Recyclable Packaging</div>
          </div>
          <div style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', minWidth:200}}>
            <div style={{fontSize:32, marginBottom:8}}>♻️</div>
            <div style={{fontSize:24, fontWeight:'bold', color:'#F472B6'}}>50%</div>
            <div style={{fontSize:14, color:'#666'}}>Less Plastic Waste</div>
          </div>
          <div style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', minWidth:200}}>
            <div style={{fontSize:32, marginBottom:8}}>🌍</div>
            <div style={{fontSize:24, fontWeight:'bold', color:'#C4B5FD'}}>Carbon</div>
            <div style={{fontSize:14, color:'#666'}}>Neutral Shipping</div>
          </div>
        </div>
      </section>

      <section style={{padding:'80px 48px'}}>
        <div style={{maxWidth:1000, margin:'0 auto'}}>
          <div style={{display:'flex', gap:0, marginBottom:40, borderBottom:'1px solid #eee'}}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex:1, padding:'20px', border:'none', background:'transparent',
                  borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
                  color: activeTab === tab.id ? tab.color : '#666', fontSize:16, fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor:'pointer', transition:'all .3s', display:'flex', flexDirection:'column', alignItems:'center', gap:8
                }}>
                <span style={{fontSize:24}}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'packaging' && (
            <div style={{textAlign:'center'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#F2A07B', marginBottom:20}}>Revolutionary Packaging</h2>
              <p style={{fontSize:16, color:'#666', lineHeight:1.8, marginBottom:40}}>
                Our packaging is 100% recyclable and made from post-consumer waste. Watch as we transform recycled materials into beautiful, functional designs.
              </p>
              <div style={{background:'#FDF8F2', padding:'40px', borderRadius:20, marginBottom:40}}>
                <div style={{width:'100%', height:8, background:'#eee', borderRadius:4, marginBottom:20, overflow:'hidden'}}>
                  <div style={{width:`${progress}%`, height:'100%', background:`linear-gradient(90deg, #F2A07B, #F472B6)`, transition:'width .1s'}}></div>
                </div>
                <p style={{color:'#666'}}>Recycling Progress: {progress}% of our packaging is now recycled materials</p>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20}}>
                <div style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
                  <div style={{fontSize:40, marginBottom:16}}>📦</div>
                  <h3 style={{color:'#F2A07B', marginBottom:12}}>Smart Boxes</h3>
                  <p style={{color:'#666', lineHeight:1.6}}>Our boxes are designed to be reused as storage or decor. No more waste!</p>
                </div>
                <div style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
                  <div style={{fontSize:40, marginBottom:16}}>🌊</div>
                  <h3 style={{color:'#F472B6', marginBottom:12}}>Ocean-Safe</h3>
                  <p style={{color:'#666', lineHeight:1.6}}>All materials are biodegradable and won't harm marine life if they end up in waterways.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div style={{textAlign:'center'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#F472B6', marginBottom:20}}>Clean Beauty Standards</h2>
              <p style={{fontSize:16, color:'#666', lineHeight:1.8, marginBottom:40}}>
                We believe in transparency. Every ingredient is carefully selected for both efficacy and environmental impact.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20}}>
                {[
                  { name: 'Vegan', icon: '🌱', desc: 'No animal-derived ingredients' },
                  { name: 'Cruelty-Free', icon: '🐰', desc: 'Never tested on animals' },
                  { name: 'Organic', icon: '🍃', desc: 'Sustainably sourced botanicals' },
                  { name: 'Non-Toxic', icon: '✨', desc: 'Safe for skin and planet' }
                ].map(item => (
                  <div key={item.name} style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', textAlign:'center'}}>
                    <div style={{fontSize:32, marginBottom:12}}>{item.icon}</div>
                    <h3 style={{color:'#F472B6', marginBottom:8}}>{item.name}</h3>
                    <p style={{color:'#666', fontSize:14, lineHeight:1.5}}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'carbon' && (
            <div style={{textAlign:'center'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#C4B5FD', marginBottom:20}}>Carbon Neutral Journey</h2>
              <p style={{fontSize:16, color:'#666', lineHeight:1.8, marginBottom:40}}>
                We're committed to achieving carbon neutrality by 2027. Here's how we're getting there.
              </p>
              <div style={{background:'linear-gradient(135deg, #C4B5FD, #FDE8D8)', padding:'40px', borderRadius:20, color:'white'}}>
                <h3 style={{marginBottom:20, fontSize:24}}>Our Carbon Goals</h3>
                <div style={{display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:20}}>
                  <div>
                    <div style={{fontSize:36, fontWeight:'bold'}}>2025</div>
                    <div>50% Reduction</div>
                  </div>
                  <div>
                    <div style={{fontSize:36, fontWeight:'bold'}}>2026</div>
                    <div>75% Reduction</div>
                  </div>
                  <div>
                    <div style={{fontSize:36, fontWeight:'bold'}}>2027</div>
                    <div>Carbon Neutral</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div style={{textAlign:'center'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#FDE8D8', marginBottom:20}}>Giving Back</h2>
              <p style={{fontSize:16, color:'#666', lineHeight:1.8, marginBottom:40}}>
                For every product sold, we donate to organizations fighting climate change and supporting sustainable beauty education.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20}}>
                <div style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
                  <div style={{fontSize:40, marginBottom:16}}>🌳</div>
                  <h3 style={{color:'#F2A07B', marginBottom:12}}>Tree Planting</h3>
                  <p style={{color:'#666', lineHeight:1.6}}>We plant one tree for every order, helping restore forests worldwide.</p>
                </div>
                <div style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
                  <div style={{fontSize:40, marginBottom:16}}>🎓</div>
                  <h3 style={{color:'#F472B6', marginBottom:12}}>Beauty Education</h3>
                  <p style={{color:'#666', lineHeight:1.6}}>Supporting programs that teach sustainable beauty practices to underserved communities.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{background:'#F472B6', padding:'80px 48px', textAlign:'center', color:'white'}}>
        <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:38, fontWeight:300, marginBottom:16}}>Join Our Mission</h2>
        <p style={{fontSize:16, opacity:0.9, marginBottom:32, maxWidth:600, margin:'0 auto'}}>Every purchase contributes to a more sustainable beauty industry. Together, we can make a difference.</p>
        <button className="btn-primary" onClick={() => navigate('/catalogue')} style={{background:'white', color:'#F472B6'}}>Shop Sustainably</button>
      </section>

      <Footer />
    </div>
  )
}

function Contact() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [activeFAQ, setActiveFAQ] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const faqs = [
    { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email with a link to track your package.' },
    { q: 'Can I change my order?', a: 'Orders can be modified within 1 hour of placement. Contact us immediately if you need changes.' },
    { q: 'Do you ship internationally?', a: 'Yes! We ship to over 50 countries. International shipping rates vary by location.' },
    { q: 'What\'s your return policy?', a: 'We offer 30-day returns on all products. Items must be unused and in original packaging.' }
  ]

  return (
    <div>
      <section style={{background: 'linear-gradient(135deg, #FDE8D8, #F2A07B)', padding:'100px 48px', textAlign:'center'}}>
        <p style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'white',marginBottom:16}}>Get In Touch</p>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:58,fontWeight:300,color:'white',maxWidth:700,margin:'0 auto 24px',lineHeight:1.15}}>
          We'd love to hear from <em style={{color:'#C4B5FD'}}>you</em>
        </h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.9)',maxWidth:540,margin:'0 auto',lineHeight:1.9}}>
          Have a question about our products, need help with an order, or just want to say hello? We're here to help!
        </p>
      </section>

      <section style={{padding:'80px 48px'}}>
        <div style={{maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60}}>

          <div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#F2A07B', marginBottom:20}}>Send Us a Message</h2>
            {submitted ? (
              <div style={{background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:16, padding:'40px', textAlign:'center'}}>
                <div style={{fontSize:48, marginBottom:16}}>💌</div>
                <h3 style={{color:'#166534', marginBottom:12}}>Message Sent!</h3>
                <p style={{color:'#166534'}}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:20}}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    style={{padding:'16px', border:'1px solid #ddd', borderRadius:8, fontSize:14}}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    style={{padding:'16px', border:'1px solid #ddd', borderRadius:8, fontSize:14}}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  style={{padding:'16px', border:'1px solid #ddd', borderRadius:8, fontSize:14}}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  rows={6}
                  style={{padding:'16px', border:'1px solid #ddd', borderRadius:8, fontSize:14, resize:'vertical'}}
                  required
                />
                <button type="submit" style={{background:'#F2A07B', color:'white', border:'none', padding:'16px', borderRadius:8, fontSize:16, cursor:'pointer'}}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#F472B6', marginBottom:20}}>Quick Answers</h2>
            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              {faqs.map((faq, i) => (
                <div key={i} style={{border:'1px solid #eee', borderRadius:12, overflow:'hidden'}}>
                  <button
                    onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                    style={{width:'100%', padding:'20px', background:'white', border:'none', textAlign:'left', cursor:'pointer', fontSize:16, fontWeight:500}}
                  >
                    {faq.q}
                    <span style={{float:'right', transform: activeFAQ === i ? 'rotate(45deg)' : 'rotate(0deg)', transition:'transform .3s'}}>+</span>
                  </button>
                  {activeFAQ === i && (
                    <div style={{padding:'0 20px 20px 20px', color:'#666', lineHeight:1.6}}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{marginTop:40, padding:'24px', background:'#FDF8F2', borderRadius:16}}>
              <h3 style={{color:'#F2A07B', marginBottom:12}}>Need Immediate Help?</h3>
              <p style={{color:'#666', marginBottom:16}}>For urgent order issues, call us directly:</p>
              <div style={{fontSize:20, fontWeight:'bold', color:'#F472B6'}}>📞 +44 20 1234 5678</div>
              <div style={{fontSize:14, color:'#666', marginTop:8}}>Mon-Fri 9AM-6PM GMT</div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

function Shipping() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [selectedCountry, setSelectedCountry] = useState('UK')
  const [showCalculator, setShowCalculator] = useState(false)

  const shippingOptions = {
    UK: [
      { method: 'Standard', time: '2-3 business days', cost: 'Free', icon: '🚚' },
      { method: 'Express', time: 'Next business day', cost: '£5.99', icon: '⚡' }
    ],
    EU: [
      { method: 'Standard', time: '3-5 business days', cost: '£8.99', icon: '🚚' },
      { method: 'Express', time: '2-3 business days', cost: '£15.99', icon: '⚡' }
    ],
    US: [
      { method: 'Standard', time: '5-7 business days', cost: '£12.99', icon: '🚚' },
      { method: 'Express', time: '3-4 business days', cost: '£25.99', icon: '⚡' }
    ]
  }

  return (
    <div>
      <section style={{background: 'linear-gradient(135deg, #C4B5FD, #FDE8D8)', padding:'100px 48px', textAlign:'center'}}>
        <p style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'white',marginBottom:16}}>Fast & Reliable</p>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:58,fontWeight:300,color:'white',maxWidth:700,margin:'0 auto 24px',lineHeight:1.15}}>
          Shipping made <em style={{color:'#F2A07B'}}>simple</em>
        </h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.9)',maxWidth:540,margin:'0 auto',lineHeight:1.9}}>
          We partner with the world's best carriers to get your beauty essentials to you quickly and safely.
        </p>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          style={{marginTop:32, background:'white', color:'#C4B5FD', border:'none', padding:'16px 32px', borderRadius:40, fontSize:16, cursor:'pointer', fontWeight:500}}
        >
          {showCalculator ? 'Hide' : 'Show'} Shipping Calculator
        </button>
      </section>

      {showCalculator && (
        <section style={{padding:'40px 48px', background:'#FDF8F2'}}>
          <div style={{maxWidth:600, margin:'0 auto', textAlign:'center'}}>
            <h2 style={{color:'#F2A07B', marginBottom:20}}>Calculate Your Shipping</h2>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              style={{padding:'12px', border:'1px solid #ddd', borderRadius:8, fontSize:16, marginBottom:20, minWidth:200}}
            >
              <option value="UK">United Kingdom</option>
              <option value="EU">European Union</option>
              <option value="US">United States</option>
            </select>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20}}>
              {shippingOptions[selectedCountry].map((option, i) => (
                <div key={i} style={{background:'white', padding:'24px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
                  <div style={{fontSize:32, marginBottom:12}}>{option.icon}</div>
                  <h3 style={{color:'#F472B6', marginBottom:8}}>{option.method}</h3>
                  <div style={{color:'#666', marginBottom:4}}>{option.time}</div>
                  <div style={{fontSize:20, fontWeight:'bold', color:'#F2A07B'}}>{option.cost}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{padding:'80px 48px'}}>
        <div style={{maxWidth:1000, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:60}}>
            <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:40, fontWeight:300, color:'#F472B6', marginBottom:20}}>Shipping Information</h2>
            <p style={{fontSize:16, color:'#666', lineHeight:1.8}}>
              Everything you need to know about getting your Formula Me products delivered to your door.
            </p>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:40}}>
            <div style={{background:'white', padding:'32px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
              <div style={{fontSize:48, marginBottom:20}}>📦</div>
              <h3 style={{color:'#F2A07B', marginBottom:16}}>Order Processing</h3>
              <p style={{color:'#666', lineHeight:1.7}}>
                Orders are processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
              </p>
            </div>

            <div style={{background:'white', padding:'32px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
              <div style={{fontSize:48, marginBottom:20}}>🌍</div>
              <h3 style={{color:'#C4B5FD', marginBottom:16}}>International Shipping</h3>
              <p style={{color:'#666', lineHeight:1.7}}>
                We ship to over 50 countries worldwide. International orders may be subject to customs fees and import duties.
              </p>
            </div>

            <div style={{background:'white', padding:'32px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
              <div style={{fontSize:48, marginBottom:20}}>🔒</div>
              <h3 style={{color:'#F472B6', marginBottom:16}}>Secure Packaging</h3>
              <p style={{color:'#666', lineHeight:1.7}}>
                All products are carefully packaged to prevent damage during transit. Fragile items receive extra protection.
              </p>
            </div>

            <div style={{background:'white', padding:'32px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
              <div style={{fontSize:48, marginBottom:20}}>📱</div>
              <h3 style={{color:'#FDE8D8', marginBottom:16}}>Tracking Updates</h3>
              <p style={{color:'#666', lineHeight:1.7}}>
                Real-time tracking updates are sent via email and SMS. You can also track your order from your account dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{background:'#F2A07B', padding:'80px 48px', textAlign:'center', color:'white'}}>
        <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:38, fontWeight:300, marginBottom:16}}>Questions About Shipping?</h2>
        <p style={{fontSize:16, opacity:0.9, marginBottom:32}}>Our customer service team is here to help with any shipping concerns.</p>
        <button className="btn-primary" onClick={() => navigate('/contact')} style={{background:'white', color:'#F2A07B'}}>Contact Us</button>
      </section>

      <Footer/>
    </div>
  )
}

function Returns() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [step, setStep] = useState(1)
  const [selectedReason, setSelectedReason] = useState('')

  const reasons = [
    { id: 'wrong', label: 'Wrong Item Sent', icon: '❌' },
    { id: 'damaged', label: 'Item Damaged', icon: '💔' },
    { id: 'not-as-described', label: 'Not as Described', icon: '🤔' },
    { id: 'changed-mind', label: 'Changed My Mind', icon: '💭' }
  ]

  return (
    <div>
      <section style={{background: 'linear-gradient(135deg, #F472B6, #C4B5FD)', padding:'100px 48px', textAlign:'center'}}>
        <p style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'white',marginBottom:16}}>Hassle-Free</p>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:58,fontWeight:300,color:'white',maxWidth:700,margin:'0 auto 24px',lineHeight:1.15}}>
          Returns & <em style={{color:'#FDE8D8'}}>Exchanges</em>
        </h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.9)',maxWidth:540,margin:'0 auto',lineHeight:1.9}}>
          Not happy with your purchase? No problem. We offer 30-day returns and easy exchanges on all items.
        </p>
      </section>

      <section style={{padding:'80px 48px'}}>
        <div style={{maxWidth:1000, margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:60}}>

            <div>
              <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#F472B6', marginBottom:20}}>Return Process</h2>
              <div style={{display:'flex', flexDirection:'column', gap:24}}>
                {[
                  { step: 1, title: 'Contact Us', desc: 'Email or call us within 30 days of delivery', icon: '📧' },
                  { step: 2, title: 'Get Approval', desc: 'We\'ll provide a return label and instructions', icon: '✅' },
                  { step: 3, title: 'Pack & Ship', desc: 'Send items back in original packaging', icon: '📦' },
                  { step: 4, title: 'Refund Processed', desc: 'Refunds appear in 3-5 business days', icon: '💰' }
                ].map(item => (
                  <div key={item.step} style={{display:'flex', gap:16, alignItems:'flex-start'}}>
                    <div style={{background:'#FDE8D8', color:'#F472B6', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:'bold', flexShrink:0}}>
                      {item.step}
                    </div>
                    <div>
                      <h3 style={{color:'#F2A07B', marginBottom:4}}>{item.title}</h3>
                      <p style={{color:'#666', lineHeight:1.6}}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#C4B5FD', marginBottom:20}}>Interactive Return Guide</h2>
              <div style={{background:'white', padding:'32px', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:14, color:'#666', marginBottom:8}}>Step {step} of 4</div>
                  <div style={{width:'100%', height:4, background:'#eee', borderRadius:2}}>
                    <div style={{width:`${(step/4)*100}%`, height:'100%', background:'linear-gradient(90deg, #F472B6, #C4B5FD)', borderRadius:2, transition:'width .3s'}}></div>
                  </div>
                </div>

                {step === 1 && (
                  <div>
                    <h3 style={{color:'#F472B6', marginBottom:16}}>Why are you returning?</h3>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                      {reasons.map(reason => (
                        <button
                          key={reason.id}
                          onClick={() => { setSelectedReason(reason.id); setStep(2) }}
                          style={{padding:'16px', border:'1px solid #ddd', borderRadius:8, background:'white', cursor:'pointer', textAlign:'left', transition:'all .2s'}}
                          onMouseOver={e => e.style.borderColor = '#F472B6'}
                          onMouseOut={e => e.style.borderColor = '#ddd'}
                        >
                          <div style={{fontSize:20, marginBottom:8}}>{reason.icon}</div>
                          <div style={{fontSize:14, fontWeight:500}}>{reason.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 style={{color:'#C4B5FD', marginBottom:16}}>Package your items</h3>
                    <p style={{color:'#666', marginBottom:16}}>Make sure to include:</p>
                    <ul style={{color:'#666', lineHeight:1.8}}>
                      <li>✓ Original packaging</li>
                      <li>✓ All accessories and manuals</li>
                      <li>✓ Return authorization label</li>
                    </ul>
                    <button onClick={() => setStep(3)} style={{marginTop:20, background:'#F472B6', color:'white', border:'none', padding:'12px 24px', borderRadius:8, cursor:'pointer'}}>
                      Next Step
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 style={{color:'#F2A07B', marginBottom:16}}>Choose shipping method</h3>
                    <div style={{display:'flex', gap:12, marginBottom:20}}>
                      <button style={{flex:1, padding:'12px', border:'1px solid #F2A07B', borderRadius:8, background:'white', color:'#F2A07B', cursor:'pointer'}}>Free Return Label</button>
                      <button style={{flex:1, padding:'12px', border:'1px solid #ddd', borderRadius:8, background:'white', color:'#666', cursor:'pointer'}}>Drop Off</button>
                    </div>
                    <button onClick={() => setStep(4)} style={{background:'#C4B5FD', color:'white', border:'none', padding:'12px 24px', borderRadius:8, cursor:'pointer'}}>
                      Complete Return
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:48, marginBottom:16}}>🎉</div>
                    <h3 style={{color:'#F472B6', marginBottom:12}}>Return Submitted!</h3>
                    <p style={{color:'#666'}}>We'll process your return within 3-5 business days.</p>
                    <button onClick={() => { setStep(1); setSelectedReason('') }} style={{marginTop:16, background:'#FDE8D8', color:'#F472B6', border:'none', padding:'12px 24px', borderRadius:8, cursor:'pointer'}}>
                      Start Over
                    </button>
                  </div>
                )}

                {step > 1 && step < 4 && (
                  <button onClick={() => setStep(step - 1)} style={{marginTop:16, background:'transparent', color:'#666', border:'1px solid #ddd', padding:'8px 16px', borderRadius:8, cursor:'pointer'}}>
                    ← Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{background:'#FDE8D8', padding:'80px 48px', textAlign:'center'}}>
        <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:38, fontWeight:300, color:'#F472B6', marginBottom:16}}>30-Day Return Guarantee</h2>
        <p style={{fontSize:16, color:'#666', marginBottom:32, maxWidth:600, margin:'0 auto'}}>
          Love it or return it. No questions asked. Your satisfaction is our top priority.
        </p>
        <div style={{display:'flex', justifyContent:'center', gap:20}}>
          <button className="btn-primary" onClick={() => navigate('/contact')} style={{background:'#F472B6'}}>Start Return</button>
          <button onClick={() => navigate('/catalogue')} style={{background:'transparent', color:'#F472B6', border:'1px solid #F472B6', padding:'13px 32px', borderRadius:40, cursor:'pointer'}}>
            Shop Again
          </button>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

function FAQ() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState(new Set())

  const toggleItem = (id) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const faqData = [
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You can pay with card or PayPal.'
    },
    {
      category: 'orders',
      question: 'Can I modify my order after placing it?',
      answer: 'Orders can be modified within 1 hour of placement. Please contact us immediately if you need changes.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to over 50 countries. Shipping costs and delivery times vary by location.'
    },
    {
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'UK orders typically arrive in 2-3 business days. International orders take 5-10 business days.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns on all products. Items must be unused and in original packaging.'
    },
    {
      category: 'returns',
      question: 'How do I start a return?',
      answer: 'Contact our customer service team with your order number. We\'ll provide a return label and instructions.'
    },
    {
      category: 'products',
      question: 'Are your products cruelty-free?',
      answer: 'Yes! All Formula Me products are 100% cruelty-free and never tested on animals.'
    },
    {
      category: 'products',
      question: 'Do you offer samples?',
      answer: 'We occasionally include samples with orders. Sign up for our newsletter to be notified of sample promotions.'
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign In" in the top navigation and select "Register" to create your account.'
    },
    {
      category: 'account',
      question: 'Can I save my skin profile?',
      answer: 'Yes! Take our skin quiz and your results will be saved to your account for personalized recommendations.'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Questions', color: '#F2A07B' },
    { id: 'orders', label: 'Orders', color: '#F472B6' },
    { id: 'shipping', label: 'Shipping', color: '#C4B5FD' },
    { id: 'returns', label: 'Returns', color: '#FDE8D8' },
    { id: 'products', label: 'Products', color: '#F2A07B' },
    { id: 'account', label: 'Account', color: '#F472B6' }
  ]

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <section style={{background: 'linear-gradient(135deg, #F2A07B, #FDE8D8)', padding:'100px 48px', textAlign:'center'}}>
        <p style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'white',marginBottom:16}}>Help Center</p>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:58,fontWeight:300,color:'white',maxWidth:700,margin:'0 auto 24px',lineHeight:1.15}}>
          Frequently Asked <em style={{color:'#C4B5FD'}}>Questions</em>
        </h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.9)',maxWidth:540,margin:'0 auto',lineHeight:1.9}}>
          Can't find what you're looking for? Our FAQ covers everything from orders to skincare advice.
        </p>
        <div style={{marginTop:40, maxWidth:400, margin:'40px auto 0'}}>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{width:'100%', padding:'16px 20px', border:'none', borderRadius:40, fontSize:16, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}
          />
        </div>
      </section>

      <section style={{padding:'60px 48px'}}>
        <div style={{maxWidth:1000, margin:'0 auto'}}>
          <div style={{display:'flex', gap:0, marginBottom:40, borderBottom:'1px solid #eee', overflowX:'auto'}}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding:'16px 24px', border:'none', background:'transparent',
                  borderBottom: activeCategory === cat.id ? `3px solid ${cat.color}` : '3px solid transparent',
                  color: activeCategory === cat.id ? cat.color : '#666', fontSize:14, fontWeight: activeCategory === cat.id ? 600 : 400,
                  cursor:'pointer', transition:'all .3s', whiteSpace:'nowrap', flexShrink:0
                }}>
              </button>
            ))}
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            {filteredFAQs.map((faq, index) => (
              <div key={index} style={{background:'white', border:'1px solid #eee', borderRadius:12, overflow:'hidden'}}>
                <button
                  onClick={() => toggleItem(index)}
                  style={{width:'100%', padding:'24px', background:'white', border:'none', textAlign:'left', cursor:'pointer', fontSize:16, fontWeight:500, display:'flex', justifyContent:'space-between', alignItems:'center'}}
                >
                  <span>{faq.question}</span>
                  <span style={{transform: expandedItems.has(index) ? 'rotate(45deg)' : 'rotate(0deg)', transition:'transform .3s', fontSize:20}}>+</span>
                </button>
                {expandedItems.has(index) && (
                  <div style={{padding:'0 24px 24px 24px', color:'#666', lineHeight:1.7, borderTop:'1px solid #f5f5f5'}}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div style={{textAlign:'center', padding:'60px 0', color:'#666'}}>
              <div style={{fontSize:48, marginBottom:16}}>🤔</div>
              <p>No questions found matching your search.</p>
              <button onClick={() => { setSearchTerm(''); setActiveCategory('all') }} style={{marginTop:16, background:'#F2A07B', color:'white', border:'none', padding:'12px 24px', borderRadius:8, cursor:'pointer'}}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section style={{background:'#C4B5FD', padding:'80px 48px', textAlign:'center', color:'white'}}>
        <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:38, fontWeight:300, marginBottom:16}}>Still Need Help?</h2>
        <p style={{fontSize:16, opacity:0.9, marginBottom:32}}>Our friendly customer service team is here to assist you.</p>
        <div style={{display:'flex', justifyContent:'center', gap:20}}>
          <button className="btn-primary" onClick={() => navigate('/contact')} style={{background:'white', color:'#C4B5FD'}}>Contact Us</button>
          <button onClick={() => navigate('/')} style={{background:'transparent', color:'white', border:'1px solid white', padding:'13px 32px', borderRadius:40, cursor:'pointer'}}>
            Back to Home
          </button>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const [userId, setUserId] = useState(null)
  const [showNewsletter, setShowNewsletter] = useState(false)

  // Show newsletter popup after 5 seconds on first visit
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('newsletter-seen')
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowNewsletter(true)
        localStorage.setItem('newsletter-seen', 'true')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  // ── Track logged-in user ──
  useEffect(() => {
    db.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null)
    })
    db.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id || null)
    })
  }, [])
  useEffect(() => {
  async function loadCart() {
    if (!userId) return

    try {
      const { data: cartData, error: cartError } = await db
        .from('cart')
        .select('cart_id')
        .eq('user_id', userId)
        .single()

      if (cartError || !cartData) return

      const { data: cartItems, error: itemsError } = await db
        .from('cart_item')
        .select('product_id, quantity')
        .eq('cart_id', cartData.cart_id)

      if (itemsError || !cartItems || cartItems.length === 0) return

      const rebuilt = []
      cartItems.forEach(item => {
        const product = PRODUCTS.find(p => p.id === item.product_id)
        if (product) {
          for (let i = 0; i < item.quantity; i++) {
            rebuilt.push(product)
          }
        }
      })

      setCart(rebuilt)
    } catch (err) {
      console.error('Failed to load cart:', err)
    }
  }

  loadCart()
}, [userId]) // runs every time userId changes (i.e. on login)
  // ── Add to cart ──
  async function addToCart(product) {
    setCart(c => [...c, product])

    if (userId) {
      // Get or create cart for user
      let { data: cartData } = await db
        .from('cart').select('cart_id')
        .eq('user_id', userId).single()

      if (!cartData) {
        const { data: newCart } = await db
          .from('cart').insert({ user_id: userId })
          .select().single()
        cartData = newCart
      }

      // Add to cart_item
      const { data: existing } = await db
        .from('cart_item')
        .select('cart_item_id, quantity')
        .eq('cart_id', cartData.cart_id)
        .eq('product_id', product.id)
        .single()

      if (existing) {
        await db.from('cart_item')
          .update({ quantity: existing.quantity + 1 })
          .eq('cart_item_id', existing.cart_item_id)
      } else {
        await db.from('cart_item').insert({
          cart_id: cartData.cart_id,
          product_id: product.id,
          quantity: 1
        })
      }
    }
  }

  // ── Remove from cart ──
  async function removeFromCart(productId) {
    setCart(c => {
      const idx = c.findLastIndex(p => p.id === productId)
      if (idx === -1) return c
      return [...c.slice(0, idx), ...c.slice(idx + 1)]
    })

    if (userId) {
      try {
        const { data: cartData, error: cartError } = await db
          .from('cart').select('cart_id')
          .eq('user_id', userId).single()

        if (cartError || !cartData) return

        const { data: existing } = await db
          .from('cart_item')
          .select('cart_item_id, quantity')
          .eq('cart_id', cartData.cart_id)
          .eq('product_id', productId)
          .single()

        if (existing && existing.quantity > 1) {
          await db.from('cart_item')
            .eq('cart_item_id', existing.cart_item_id)
        } else {
          await db.from('cart_item')
            .delete()
            .eq('cart_id', cartData.cart_id)
            .eq('product_id', productId)
        }
      } catch (err) {
        console.error('Failed to remove from cart:', err)
      }
    }
  }

  function clearCart() {
    setCart([])
    if (userId) {
      // Clear cart from database for logged-in users
      db.from('cart')
        .select('cart_id')
        .eq('user_id', userId)
        .single()
        .then(({ data: cartData }) => {
          if (cartData) {
            db.from('cart_item')
              .delete()
              .eq('cart_id', cartData.cart_id)
          }
        })
        .catch(err => console.error('Failed to clear cart from database:', err))
    }
  }

  return (
    <BrowserRouter>
      <AnnouncementBar />
      <Nav cartCount={cart.length} userId={userId}/>
      <Routes>
        <Route path="/" element={<Home onAddToCart={addToCart} userId={userId} />}/>
        <Route path="/catalogue" element={<Catalogue onAddToCart={addToCart} />}/>
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />}/>
        <Route path="/quiz" element={<SkinQuiz userId={userId}/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/sustainability" element={<Sustainability/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/shipping" element={<Shipping/>}/>
        <Route path="/returns" element={<Returns/>}/>
        <Route path="/faq" element={<FAQ/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart}/>}/>
        <Route path="/checkout" element={<Checkout cart={cart} onClearCart={clearCart} userId={userId}/>}/>
        <Route path="/profile" element={<Profile userId={userId}/>}/>
      </Routes>
      <NewsletterPopup
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
        userId={userId}
      />
    </BrowserRouter>
  )
}

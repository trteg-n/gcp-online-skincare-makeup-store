import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
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

function NewsletterPopup({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isWidget, setIsWidget] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)

    // Close popup after 3 seconds
    setTimeout(() => {
      onClose()
      setSubmitted(false)
      setEmail('')
      setIsWidget(false)
    }, 3000)
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
      <div className={`newsletter-popup ${isWidget ? 'widget' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={isWidget ? closeWidget : onClose}>×</button>

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
      {isWidget && (
        <div className="newsletter-fab" onClick={() => setIsWidget(false)}>
          💌
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
  <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
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

function Footer() {
  const navigate = useNavigate()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (newsletterEmail.includes('@')) {
      setNewsletterSubmitted(true)
      setTimeout(() => {
        setNewsletterSubmitted(false)
        setNewsletterEmail('')
      }, 3000)
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
                <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
              )}
            </div>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Company</div>
            <span className="footer-link" onClick={() => navigate('/about')}>About Us</span>
            <span className="footer-link">Our Story</span>
            <span className="footer-link">Careers</span>
            <span className="footer-link">Press</span>
            <span className="footer-link">Sustainability</span>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Help</div>
            <span className="footer-link">Contact Us</span>
            <span className="footer-link">Shipping Info</span>
            <span className="footer-link">Returns & Exchanges</span>
            <span className="footer-link">Size Guide</span>
            <span className="footer-link">FAQ</span>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Account</div>
            <span className="footer-link" onClick={() => navigate('/login')}>Sign In</span>
            <span className="footer-link" onClick={() => navigate('/profile')}>My Account</span>
            <span className="footer-link">Order History</span>
            <span className="footer-link" onClick={() => navigate('/quiz')}>Skin Quiz</span>
            <span className="footer-link">Wishlist</span>
          </div>

          <div className="footer-section">
            <div className="footer-col-title">Shop</div>
            <span className="footer-link" onClick={() => navigate('/catalogue')}>All Products</span>
            <span className="footer-link" onClick={() => navigate('/catalogue')}>Skincare</span>
            <span className="footer-link" onClick={() => navigate('/catalogue')}>Makeup</span>
            <span className="footer-link" onClick={() => navigate('/catalogue')}>SPF</span>
            <span className="footer-link">Gift Cards</span>
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

function ProductCard({ product, onAddToCart, onQuickView, wishlist, onToggleWishlist }) {
  const navigate = useNavigate()
  const isWishlisted = wishlist.some(p => p.id === product.id)
  
  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="card-img" style={{position:'relative',overflow:'hidden'}}>
        {product.badge && <span className="card-badge">{product.badge}</span>}
        <img src={product.images[0]} alt={product.name}
          style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .3s ease'}}
          onMouseEnter={e => e.target.style.transform='scale(1.1)'}
          onMouseLeave={e => e.target.style.transform='scale(1)'}
          onError={e => { e.target.style.display='none' }}/>
        <button 
          onClick={e => { e.stopPropagation(); onToggleWishlist(product) }}
          style={{position:'absolute',top:12,right:12,width:32,height:32,borderRadius:'50%',background:isWishlisted?'var(--pink)':'rgba(255,255,255,0.9)',border:'none',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s',zIndex:10}}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          {isWishlisted ? '♥' : '♡'}
        </button>
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
  )
}

function Home({ onAddToCart, wishlist, onToggleWishlist }) {
  const navigate = useNavigate()
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
        <div className="hero-text">
          <p className="hero-eyebrow">New Collection · Spring 2026</p>
          <h1 className="hero-title">Your skin,<br/><em>your formula</em></h1>
          <p className="hero-sub">Makeup engineered to work with your skincare — never against it. Personalised for every skin type and concern.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/catalogue')}>Shop Now</button>
            <button className="btn-outline" onClick={() => navigate('/quiz')}>Take Skin Quiz</button>
          </div>
        </div>
        <div className="hero-visual">
          {PRODUCTS.slice(0,3).map(p => (
            <div key={p.id} className="hero-card" onClick={() => navigate(`/product/${p.id}`)} style={{cursor:'pointer'}}>
              <img src={p.images[0]} alt={p.name} style={{width:48,height:48,objectFit:'cover',borderRadius:8}}/>
              <span className="hero-card-name">{p.name}</span>
              <span className="hero-card-price">£{p.price}.00</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <span className="section-link" onClick={() => navigate('/catalogue')}>View all 20 products</span>
        </div>
        <div className="product-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist}/>)}
        </div>
      </section>

      <section className="section" style={{paddingTop:0}}>
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <div className="category-grid">
          {cats.map(c => (
            <div key={c.name} className="cat-tile" style={{background:c.bg,overflow:'hidden',position:'relative'}}
              onClick={() => navigate('/catalogue')}>
              <img src={c.img} alt={c.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.55}}/>
              <span className="cat-tile-name" style={{position:'relative',zIndex:1,fontWeight:600}}>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{background: 'var(--coconut)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'}}>
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <CustomerReviewsCarousel />
      </section>

      <Footer/>
    </div>
  )
}

function CustomerReviewsCarousel() {
  const [currentReview, setCurrentReview] = useState(0)
  const reviews = [
    {
      name: 'Sarah A.',
      rating: 5,
      text: 'This has completely transformed my skin. I noticed a difference within two weeks.',
      location: 'London, UK',
      skinType: 'Dry Skin'
    },
    {
      name: 'Daniel L.',
      rating: 4,
      text: 'Really effective formula. Gentle enough for my sensitive skin and no irritation at all.',
      location: 'Manchester, UK',
      skinType: 'Sensitive Skin'
    },
    {
      name: 'Maya K.',
      rating: 5,
      text: 'I was sceptical at first but this is genuinely the best product I have tried for my skin type.',
      location: 'Birmingham, UK',
      skinType: 'Combination Skin'
    },
    {
      name: 'James R.',
      rating: 5,
      text: 'The skin quiz was spot on! Products matched my concerns perfectly.',
      location: 'Edinburgh, UK',
      skinType: 'Oily Skin'
    },
    {
      name: 'Emma T.',
      rating: 4,
      text: 'Love the clean ingredients and how gentle everything is on my skin.',
      location: 'Bristol, UK',
      skinType: 'Normal Skin'
    },
    {
      name: 'Alex M.',
      rating: 5,
      text: 'Finally found products that work with my skincare routine, not against it.',
      location: 'Leeds, UK',
      skinType: 'Mature Skin'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length)
    }, 5000) // Change every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const nextReview = () => setCurrentReview(prev => (prev + 1) % reviews.length)
  const prevReview = () => setCurrentReview(prev => (prev - 1 + reviews.length) % reviews.length)

  return (
    <div className="reviews-carousel">
      <div className="review-card">
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
      </div>
      <div className="carousel-controls">
        <button className="carousel-btn" onClick={prevReview}>‹</button>
        <div className="carousel-dots">
          {reviews.map((_, i) => (
            <span key={i} className={`dot ${i === currentReview ? 'active' : ''}`} onClick={() => setCurrentReview(i)}></span>
          ))}
        </div>
        <button className="carousel-btn" onClick={nextReview}>›</button>
      </div>
    </div>
  )
}

function Catalogue({ onAddToCart, wishlist, onToggleWishlist }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100)
  const [sortBy, setSortBy] = useState('newest')

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
        <span style={{fontSize:12,color:'var(--muted)'}}>Home / </span>
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
                {sorted.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist}/>)}
              </div>
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

function ProductDetail({ onAddToCart, wishlist, onToggleWishlist }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find(p => p.id === parseInt(id))
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const isWishlisted = wishlist.some(p => p.id === product?.id)

  if (!product) return <div style={{padding:48}}>Product not found. <button onClick={() => navigate('/catalogue')}>Back to shop</button></div>

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0,4)

  const reviews = [
    { name:'Sarah A.', rating:5, text:'This has completely transformed my skin. I noticed a difference within two weeks.', date:'February 2026' },
    { name:'Daniel L.', rating:4, text:'Really effective formula. Gentle enough for my sensitive skin and no irritation at all.', date:'January 2026' },
    { name:'Maya K.', rating:5, text:'I was sceptical at first but this is genuinely the best product I have tried for my skin type.', date:'March 2026' },
  ]

  return (
    <div>
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{cursor:'pointer',color:'var(--peach)'}}>Home</span>
        <span> / </span>
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
            <span style={{fontSize:12,color:'var(--muted)'}}>4.0 · {reviews.length} reviews</span>
          </div>
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
            <button className="wishlist" onClick={() => onToggleWishlist(product)} title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{background:isWishlisted?'var(--pink)':'transparent'}}>
              {isWishlisted ? '♥' : '♡'}
            </button>
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

      <section className="section" style={{borderTop:'1px solid var(--border)'}}>
        <div className="section-header">
          <h2 className="section-title">Customer Reviews</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {reviews.map((r,i) => (
            <div key={i} style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:12,padding:24}}>
              <div style={{display:'flex',gap:2,marginBottom:10}}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s<=r.rating?'#F2A07B':'none'} stroke="#F2A07B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p style={{fontSize:13,color:'var(--charcoal)',lineHeight:1.8,marginBottom:12}}>{r.text}</p>
              <div style={{fontSize:11,color:'var(--muted)'}}>{r.name} · {r.date}</div>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{borderTop:'1px solid var(--border)'}}>
          <div className="section-header">
            <h2 className="section-title">You May Also Like</h2>
          </div>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist}/>)}
          </div>
        </section>
      )}
      <Footer/>
    </div>
  )
}

function Cart({ cart, onRemove }) {
  const navigate = useNavigate()
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
        <span style={{fontSize:12,color:'var(--muted)'}}>Home / </span>
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
  const [form, setForm] = useState({ name:'', email:'', address:'', city:'', postcode:'', card:'', expiry:'', cvv:'' })
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const [loading, setLoading] = useState(false)

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

    const total = cart.reduce((sum, item) => sum + item.price, 0)
    const deliveryCost = total >= 40 ? 0 : 3.99
    const finalTotal = total + deliveryCost

    // 1 — Save order
    const { data: orderData, error: orderError } = await db
      .from('orders').insert({
        user_id: userId || null,
        total: finalTotal,
        subtotal_total: total,
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
        <span style={{fontSize:12,color:'var(--muted)'}}>Home / Cart / </span>
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
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--muted)',marginBottom:8}}>
              <span>Delivery</span><span>{total >= 40 ? 'Free' : '£3.99'}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:17,fontWeight:600,color:'var(--charcoal)',marginBottom:20}}>
              <span>Total</span><span>£{(total >= 40 ? total : total + 3.99).toFixed(2)}</span>
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
    setSubmitted(true)
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
    setSubmitted(true)
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
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>You haven't taken the skin quiz yet. Get personalised product recommendations in under 5 minutes.</p>
          <button className="btn-primary" onClick={() => navigate('/quiz')}>Take Skin Quiz</button>
        </div>
      )}
    </div>
  )
}

function Profile({ userId }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [reviewForm, setReviewForm] = useState({ product_id: '', rating: 5, comment: '' })
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterDone, setNewsletterDone] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: '', email: '' })
  const [editSaved, setEditSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { navigate('/login'); return }
    async function load() {
      // Load user info
      const { data: userData } = await db
        .from('users').select('*').eq('user_id', userId).single()
      if (userData) {
        setUser(userData)
        setEditForm({ full_name: userData.username || '', email: userData.email || '' })
        setNewsletterEmail(userData.email || '')
      }
      // Load orders
      const { data: orderData } = await db
        .from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      if (orderData) setOrders(orderData)
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
    await db.from('newsletter_subscription').upsert({ email: newsletterEmail, user_id: userId })
    setNewsletterDone(true)
  }

  async function handleReviewSubmit() {
    if (!reviewForm.product_id) return
    await db.from('reviews').insert({
      user_id: userId,
      product_id: parseInt(reviewForm.product_id),
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      created_at: new Date().toISOString()
    })
    setReviewSubmitted(true)
    setTimeout(() => { setReviewSubmitted(false); setReviewForm({ product_id: '', rating: 5, comment: '' }) }, 3000)
  }

  async function handleDeleteAccount() {
    await db.from('users').delete().eq('user_id', userId)
    await db.auth.signOut()
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
            {/* Product Recommendation */}
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
                <div style={{ display: 'flex', gap: 12 }}>
                  <input value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)' }} />
                  <button className="btn-primary" onClick={handleNewsletterSignup}>Subscribe</button>
                </div>
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

        {/* ── REVIEW TAB ── */}
        {activeTab === 'review' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 8 }}>Leave a Review</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32, lineHeight: 1.8 }}>Loved a product? Share your experience to help others find their formula.</p>
            {reviewSubmitted ? (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🌟</div>
                <p style={{ color: '#166534', fontSize: 14 }}>Thank you for your review!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Select Product</label>
                  <select value={reviewForm.product_id} onChange={e => setReviewForm({ ...reviewForm, product_id: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)' }}>
                    <option value="">Choose a product...</option>
                    {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Rating</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, padding: 0, opacity: s <= reviewForm.rating ? 1 : 0.3, transition: 'opacity .2s' }}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Your Review</label>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Tell us about your experience with this product..."
                    rows={4}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--coconut)', resize: 'vertical' }} />
                </div>
                <button className="btn-primary" onClick={handleReviewSubmit} style={{ alignSelf: 'flex-start' }}>Submit Review</button>
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
export default function App() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [toast, setToast] = useState(null)
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
    setToast(`${product.name} added to cart`)
    setTimeout(() => setToast(null), 2500)

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
            .update({ quantity: existing.quantity - 1 })
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

  // ── Toggle wishlist ──
  function toggleWishlist(product) {
    if (wishlist.some(p => p.id === product.id)) {
      setWishlist(w => w.filter(p => p.id !== product.id))
    } else {
      setWishlist(w => [...w, product])
      setToast(`${product.name} added to wishlist`)
    }
  }

  function clearCart() { setCart([]) }

  return (
    <BrowserRouter>
      <AnnouncementBar />
      <Nav cartCount={cart.length} userId={userId}/>
      <Routes>
        <Route path="/" element={<Home onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist}/>}/>
        <Route path="/catalogue" element={<Catalogue onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist}/>}/>
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist}/>}/>
        <Route path="/quiz" element={<SkinQuiz userId={userId}/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart}/>}/>
        <Route path="/checkout" element={<Checkout cart={cart} onClearCart={clearCart} userId={userId}/>}/>
        <Route path="/profile" element={<Profile userId={userId}/>}/>
      </Routes>
      {toast && <div className="toast">{toast}</div>}
      <NewsletterPopup
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
      />
    </BrowserRouter>
  )
}

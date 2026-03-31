import { useState, useEffect, useRef, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { supabase } from './supabase.js'
import './App.css'

/* ─── Scroll-reveal hook ─── */
function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el) } },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, isVisible]
}

/* ─── Scroll to top on route change ─── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [pathname])
  return null
}

/* ─── Back-to-top button ─── */
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      className={`back-to-top ${show ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
    </button>
  )
}

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

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [ref, isVisible] = useScrollReveal()
  const dirClass = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal-up'
  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${isVisible ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function Nav({ cartCount }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => navigate('/')} style={{cursor:'pointer'}}>Formula Me</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/catalogue">Shop</Link>
          <Link to="/quiz">Skin Quiz</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="nav-icons">
          <button className="nav-icon" onClick={() => navigate('/login')} title="Account">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button className="nav-icon cart-btn" onClick={() => navigate('/cart')} title="Cart">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="cart-count" key={cartCount}>{cartCount}</span>}
          </button>
          <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`}/>
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`}/>
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`}/>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
        <Link to="/catalogue" onClick={() => setMobileOpen(false)}>Shop</Link>
        <Link to="/quiz" onClick={() => setMobileOpen(false)}>Skin Quiz</Link>
        <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
        <Link to="/login" onClick={() => setMobileOpen(false)}>Account</Link>
        <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
      </div>
    </>
  )
}

function Footer() {
  const navigate = useNavigate()
  const [ref, isVisible] = useScrollReveal()
  return (
    <>
      <footer className="footer" ref={ref}>
        <div className={`reveal reveal-up ${isVisible ? 'revealed' : ''}`}>
          <div className="footer-brand">Formula Me</div>
          <div className="footer-desc">Skincare-first beauty. Every formula is clinically tested and skin-barrier approved for all skin types.</div>
        </div>
        <div className={`reveal reveal-up ${isVisible ? 'revealed' : ''}`} style={{transitionDelay:'100ms'}}>
          <div className="footer-col-title">Shop</div>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>All Products</span>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>Skincare</span>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>Makeup</span>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>SPF</span>
        </div>
        <div className={`reveal reveal-up ${isVisible ? 'revealed' : ''}`} style={{transitionDelay:'200ms'}}>
          <div className="footer-col-title">Explore</div>
          <span className="footer-link" onClick={() => navigate('/quiz')}>Skin Quiz</span>
          <span className="footer-link" onClick={() => navigate('/about')}>About</span>
          <span className="footer-link" onClick={() => navigate('/login')}>My Account</span>
        </div>
        <div className={`reveal reveal-up ${isVisible ? 'revealed' : ''}`} style={{transitionDelay:'300ms'}}>
          <div className="footer-col-title">Follow</div>
          <span className="footer-link">Instagram</span>
          <span className="footer-link">TikTok</span>
          <span className="footer-link">Pinterest</span>
        </div>
      </footer>
      <div className="footer-bottom">
        <span>&copy; 2026 Formula Me. All rights reserved.</span>
        <span>Privacy &middot; Cookies &middot; Terms</span>
      </div>
    </>
  )
}

function ProductCard({ product, onAddToCart, delay = 0 }) {
  const navigate = useNavigate()
  const [ref, isVisible] = useScrollReveal()
  const [added, setAdded] = useState(false)

  function handleAdd(e) {
    e.stopPropagation()
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 600)
  }

  return (
    <div
      ref={ref}
      className={`product-card reveal reveal-up ${isVisible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="card-img">
        {product.badge && <span className="card-badge">{product.badge}</span>}
        <img src={product.images[0]} alt={product.name}
          style={{width:'100%',height:'100%',objectFit:'cover'}}
          onError={e => { e.target.style.display='none' }}/>
        <div className="card-img-overlay">
          <span className="card-quick-view">Quick View</span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name">{product.name}</div>
        <div className="card-footer">
          <span className="card-price">&pound;{product.price}.00</span>
          <button className={`card-add ${added ? 'card-add-pop' : ''}`} onClick={handleAdd}>
            {added ? <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Home({ onAddToCart }) {
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
      <div className="banner">
        <div className="banner-scroll">
          <span>Free delivery over &pound;40 &middot; Clinically tested &middot; Dermatologist approved &middot; </span>
          <span>Free delivery over &pound;40 &middot; Clinically tested &middot; Dermatologist approved &middot; </span>
        </div>
      </div>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow animate-fade-down" style={{animationDelay:'0.1s'}}>New Collection &middot; Spring 2026</p>
          <h1 className="hero-title animate-fade-down" style={{animationDelay:'0.25s'}}>Your skin,<br/><em>your formula</em></h1>
          <p className="hero-sub animate-fade-down" style={{animationDelay:'0.4s'}}>Makeup engineered to work with your skincare — never against it. Personalised for every skin type and concern.</p>
          <div className="hero-btns animate-fade-down" style={{animationDelay:'0.55s'}}>
            <button className="btn-primary btn-shimmer" onClick={() => navigate('/catalogue')}>Shop Now</button>
            <button className="btn-outline" onClick={() => navigate('/quiz')}>Take Skin Quiz</button>
          </div>
        </div>
        <div className="hero-visual">
          {PRODUCTS.slice(0,3).map((p, i) => (
            <div key={p.id} className="hero-card animate-fade-up" style={{animationDelay:`${0.3 + i * 0.15}s`, cursor:'pointer'}} onClick={() => navigate(`/product/${p.id}`)}>
              <img src={p.images[0]} alt={p.name} style={{width:48,height:48,objectFit:'cover',borderRadius:8}}/>
              <span className="hero-card-name">{p.name}</span>
              <span className="hero-card-price">&pound;{p.price}.00</span>
            </div>
          ))}
        </div>
        <div className="hero-blob hero-blob-1"/>
        <div className="hero-blob hero-blob-2"/>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <span className="section-link" onClick={() => navigate('/catalogue')}>View all {PRODUCTS.length} products</span>
          </div>
        </Reveal>
        <div className="product-grid">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} delay={i * 100}/>)}
        </div>
      </section>

      <section className="section" style={{paddingTop:0}}>
        <Reveal>
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
          </div>
        </Reveal>
        <div className="category-grid">
          {cats.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <div className="cat-tile" style={{background:c.bg,overflow:'hidden',position:'relative'}}
                onClick={() => navigate('/catalogue')}>
                <img src={c.img} alt={c.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.55,transition:'transform .5s ease, opacity .4s ease'}}
                  className="cat-tile-img"/>
                <span className="cat-tile-name" style={{position:'relative',zIndex:1,fontWeight:600}}>{c.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  )
}

function Catalogue({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100)
  const [sortBy, setSortBy] = useState('default')

  let filtered = PRODUCTS.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.price >= minPrice && p.price <= maxPrice &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  )

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  else if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))

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
            <div style={{fontSize:13,color:'var(--muted)',marginBottom:8}}>&pound;{minPrice} — &pound;{maxPrice}</div>
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
            <span className="results-count">Showing <strong>{filtered.length} products</strong></span>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
          {filtered.length === 0
            ? <div style={{textAlign:'center',padding:'60px',color:'var(--muted)'}}>No products found. Try adjusting your filters.</div>
            : <div className="product-grid three-col">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} delay={i * 60}/>)}
              </div>
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find(p => p.id === parseInt(id))
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [imgTransition, setImgTransition] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  if (!product) return <div style={{padding:48}}>Product not found. <button onClick={() => navigate('/catalogue')}>Back to shop</button></div>

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0,4)

  const reviews = [
    { name:'Sarah A.', rating:5, text:'This has completely transformed my skin. I noticed a difference within two weeks.', date:'February 2026' },
    { name:'Daniel L.', rating:4, text:'Really effective formula. Gentle enough for my sensitive skin and no irritation at all.', date:'January 2026' },
    { name:'Maya K.', rating:5, text:'I was sceptical at first but this is genuinely the best product I have tried for my skin type.', date:'March 2026' },
  ]

  function switchImage(i) {
    if (i === activeImg) return
    setImgTransition(true)
    setTimeout(() => { setActiveImg(i); setImgTransition(false) }, 200)
  }

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) onAddToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

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
        <div className="detail-gallery animate-fade-right">
          <div className="detail-main-img">
            <img src={product.images[activeImg]} alt={product.name}
              className={`detail-main-photo ${imgTransition ? 'img-fade-out' : 'img-fade-in'}`}
              style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:20}}/>
          </div>
          <div className="detail-thumbs">
            {product.images.map((img,i) => (
              <div key={i} className={`detail-thumb ${activeImg===i?'active':''}`} onClick={() => switchImage(i)}>
                <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}}/>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-info animate-fade-left">
          <span className="detail-tag">{product.category}</span>
          <div className="detail-name">{product.name}</div>
          <div className="detail-brand">by Formula Me Skin Science</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <div style={{display:'flex',gap:2}}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s<=4?'#F2A07B':'none'} stroke="#F2A07B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
            </div>
            <span style={{fontSize:12,color:'var(--muted)'}}>4.0 &middot; {reviews.length} reviews</span>
          </div>
          <div className="detail-price">&pound;{product.price}.00</div>

          <div className="detail-tabs">
            <button className={`detail-tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button className={`detail-tab ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>Ingredients</button>
            <button className={`detail-tab ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>Shipping</button>
          </div>
          <div className="detail-tab-content">
            {activeTab === 'description' && <p className="detail-desc">{product.desc}</p>}
            {activeTab === 'ingredients' && <p className="detail-desc">{product.ingredients}</p>}
            {activeTab === 'shipping' && <p className="detail-desc">Free standard delivery on orders over &pound;40. Express delivery available for &pound;5.99. All orders dispatched within 1-2 working days.</p>}
          </div>

          <div style={{fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted)',marginBottom:10}}>Suitable for</div>
          <div className="skin-tags">
            {product.skin.map(s => <span key={s} className="skin-tag">{s}</span>)}
          </div>
          <div className="divider"/>
          <div className="qty-row">
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>&#8722;</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
            </div>
            <button className={`add-cart ${addedToCart ? 'add-cart-success' : ''}`} onClick={handleAddToCart}>
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </button>
            <button className={`wishlist ${wishlisted ? 'wishlisted' : ''}`} onClick={() => setWishlisted(w => !w)}>
              {wishlisted ? <span style={{color:'#E11D48'}}>&#9829;</span> : <span>&#9825;</span>}
            </button>
          </div>
          <div className="detail-perks">
            <span className="perk"><svg width="14" height="14" fill="none" stroke="var(--peach)" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Free delivery over &pound;40</span>
            <span className="perk"><svg width="14" height="14" fill="none" stroke="var(--peach)" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg> 30-day returns</span>
            <span className="perk"><svg width="14" height="14" fill="none" stroke="var(--peach)" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Cruelty-free</span>
            <span className="perk"><svg width="14" height="14" fill="none" stroke="var(--peach)" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Dermatologist tested</span>
          </div>
        </div>
      </div>

      <section className="section" style={{borderTop:'1px solid var(--border)'}}>
        <Reveal>
          <div className="section-header">
            <h2 className="section-title">Customer Reviews</h2>
          </div>
        </Reveal>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {reviews.map((r,i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="review-card">
                <div style={{display:'flex',gap:2,marginBottom:10}}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s<=r.rating?'#F2A07B':'none'} stroke="#F2A07B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p style={{fontSize:13,color:'var(--charcoal)',lineHeight:1.8,marginBottom:12}}>"{r.text}"</p>
                <div style={{fontSize:11,color:'var(--muted)'}}>{r.name} &middot; {r.date}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{borderTop:'1px solid var(--border)'}}>
          <Reveal>
            <div className="section-header">
              <h2 className="section-title">You May Also Like</h2>
            </div>
          </Reveal>
          <div className="product-grid">
            {related.map((p, i) => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} delay={i * 100}/>)}
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
  const freeDeliveryProgress = Math.min((total / 40) * 100, 100)

  return (
    <div style={{minHeight:'80vh'}}>
      <div style={{padding:'20px 48px',borderBottom:'1px solid var(--border)'}}>
        <span style={{fontSize:12,color:'var(--muted)'}}>Home / </span>
        <span style={{fontSize:12,color:'var(--charcoal)'}}>Cart</span>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:'48px 24px'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:40,fontWeight:300,marginBottom:32}}>Your Cart</h1>
        {items.length === 0 ? (
          <div className="empty-cart animate-fade-up">
            <div className="empty-cart-icon">
              <svg width="48" height="48" fill="none" stroke="var(--peach)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <p style={{color:'var(--muted)',marginBottom:24,fontSize:15}}>Your cart is empty.</p>
            <button className="btn-primary btn-shimmer" onClick={() => navigate('/catalogue')}>Continue Shopping</button>
          </div>
        ) : (
          <>
            {total < 40 && (
              <div className="free-delivery-bar animate-fade-down">
                <p style={{fontSize:12,color:'var(--muted)',marginBottom:8}}>
                  Spend &pound;{(40 - total).toFixed(2)} more for <strong>free delivery</strong>
                </p>
                <div className="delivery-progress">
                  <div className="delivery-progress-fill" style={{width:`${freeDeliveryProgress}%`}}/>
                </div>
              </div>
            )}
            {total >= 40 && (
              <div className="free-delivery-bar animate-fade-down" style={{background:'#ECFDF5',border:'1px solid #A7F3D0'}}>
                <p style={{fontSize:12,color:'#065F46'}}>You qualify for <strong>free delivery!</strong></p>
              </div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:32}}>
              {items.map((item, i) => (
                <div key={item.id} className="cart-item animate-fade-up" style={{animationDelay:`${i * 0.08}s`}}>
                  <img src={item.images[0]} alt={item.name} style={{width:72,height:72,objectFit:'cover',borderRadius:8}}
                    onClick={() => navigate(`/product/${item.id}`)} className="cart-item-img"/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>{item.category}</div>
                    <div style={{fontSize:15,fontWeight:500,color:'var(--charcoal)',marginBottom:4}}>{item.name}</div>
                    <div style={{fontSize:13,color:'var(--peach)',fontWeight:600}}>&pound;{item.price}.00 &times; {item.qty}</div>
                  </div>
                  <div style={{fontSize:16,fontWeight:600,color:'var(--charcoal)',minWidth:60,textAlign:'right'}}>&pound;{(item.price * item.qty).toFixed(2)}</div>
                  <button className="cart-remove-btn" onClick={() => onRemove(item.id)} aria-label="Remove">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
            <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:12,padding:24}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:14,color:'var(--muted)'}}>
                <span>Subtotal</span><span>&pound;{total.toFixed(2)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:14,color:'var(--muted)'}}>
                <span>Delivery</span><span>{total >= 40 ? 'Free' : '£3.99'}</span>
              </div>
              <div style={{height:1,background:'var(--border)',margin:'16px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,fontSize:18,fontWeight:600,color:'var(--charcoal)'}}>
                <span>Total</span><span>&pound;{(total >= 40 ? total : total + 3.99).toFixed(2)}</span>
              </div>
              <button className="btn-primary btn-shimmer" style={{width:'100%',justifyContent:'center'}} onClick={() => navigate('/checkout')}>
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

function Checkout({ cart, onClearCart }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', address:'', city:'', postcode:'', card:'', expiry:'', cvv:'' })
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)
  const [processing, setProcessing] = useState(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)

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

  function handlePlace() {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length === 0) {
      setProcessing(true)
      setTimeout(() => {
        setPlaced(true)
        onClearCart()
        setProcessing(false)
      }, 1500)
    }
  }

  function field(label, key, placeholder, type='text') {
    return (
      <div>
        <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>{label}</label>
        <input type={type} value={form[key]} placeholder={placeholder}
          onChange={e => setForm({...form,[key]:e.target.value})}
          className={`checkout-input ${errors[key] ? 'checkout-input-error' : ''}`}/>
        {errors[key] && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors[key]}</p>}
      </div>
    )
  }

  if (placed) return (
    <div className="order-confirmed animate-scale-in">
      <div className="confetti-burst"/>
      <div style={{width:80,height:80,borderRadius:'50%',background:'var(--peach-light)',display:'flex',alignItems:'center',justifyContent:'center',animation:'checkPop .5s ease'}}>
        <svg width="36" height="36" fill="none" stroke="var(--peach)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" className="check-draw"/></svg>
      </div>
      <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:40,fontWeight:300}}>Order Confirmed</h2>
      <p style={{color:'var(--muted)',maxWidth:400,lineHeight:1.8}}>Thank you for your order. A confirmation has been sent to {form.email}. Your products will arrive within 3-5 working days.</p>
      <button className="btn-primary btn-shimmer" onClick={() => navigate('/')}>Back to Home</button>
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
                <span>&pound;{item.price}</span>
              </div>
            ))}
            {cart.length > 3 && <div style={{fontSize:11,color:'var(--muted)',marginBottom:8}}>+{cart.length-3} more items</div>}
            <div style={{height:1,background:'var(--border)',margin:'16px 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--muted)',marginBottom:8}}>
              <span>Delivery</span><span>{total >= 40 ? 'Free' : '£3.99'}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:17,fontWeight:600,color:'var(--charcoal)',marginBottom:20}}>
              <span>Total</span><span>&pound;{(total >= 40 ? total : total + 3.99).toFixed(2)}</span>
            </div>
            <button className={`btn-primary btn-shimmer ${processing ? 'btn-processing' : ''}`} style={{width:'100%',justifyContent:'center'}} onClick={handlePlace} disabled={processing}>
              {processing ? (
                <span className="btn-spinner"/>
              ) : 'Place Order'}
            </button>
            <p style={{fontSize:11,color:'var(--muted)',textAlign:'center',marginTop:12}}>Your payment details are protected with 256-bit SSL encryption.</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

function SkinQuiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [selectedOpt, setSelectedOpt] = useState(null)

  const questions = [
    { q:'How does your skin feel by midday?', options:['Oily all over','Dry and tight','Oily in T-zone only','Normal and balanced'] },
    { q:'How sensitive is your skin?', options:['Very sensitive — reacts easily','Mildly sensitive','Not sensitive at all','I get breakouts often'] },
    { q:'What is your main skin concern?', options:['Dullness and uneven tone','Dryness and dehydration','Breakouts and pores','Ageing and fine lines'] },
    { q:'Do you currently use SPF daily?', options:['Yes, every morning','Sometimes','Rarely','Never'] },
  ]

  function answer(opt) {
    setSelectedOpt(opt)
    const newAnswers = { ...answers, [step]: opt }
    setAnswers(newAnswers)

    setTimeout(() => {
      setTransitioning(true)
      setTimeout(() => {
        if (step < questions.length - 1) {
          setStep(s => s+1)
        } else {
          const concern = newAnswers[2]
          const recs = {
            'Dullness and uneven tone': PRODUCTS.filter(p => p.skin.includes('Dull') || p.skin.includes('Uneven Tone')).slice(0,3),
            'Dryness and dehydration':  PRODUCTS.filter(p => p.skin.includes('Dry') || p.skin.includes('Dehydrated')).slice(0,3),
            'Breakouts and pores':      PRODUCTS.filter(p => p.skin.includes('Acne-Prone') || p.skin.includes('Oily')).slice(0,3),
            'Ageing and fine lines':    PRODUCTS.filter(p => p.skin.includes('Mature')).slice(0,3),
          }
          setResult(recs[concern] || PRODUCTS.slice(0,3))
        }
        setTransitioning(false)
        setSelectedOpt(null)
      }, 400)
    }, 300)
  }

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
      {!result ? (
        <div className={`quiz-container ${transitioning ? 'quiz-fade-out' : 'quiz-fade-in'}`}>
          <div style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--peach)',marginBottom:16}}>
            Question {step+1} of {questions.length}
          </div>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{width:`${((step+1)/questions.length)*100}%`}}/>
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:300,color:'var(--charcoal)',marginBottom:32}}>
            {questions[step].q}
          </h2>
          <div style={{display:'grid',gap:12}}>
            {questions[step].options.map((opt, i) => (
              <button key={opt} onClick={() => answer(opt)}
                className={`quiz-option ${selectedOpt === opt ? 'quiz-option-selected' : ''}`}
                style={{animationDelay:`${i * 0.08}s`}}>
                <span className="quiz-option-indicator">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="quiz-back" onClick={() => { setStep(s => s - 1); setSelectedOpt(null) }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Previous question
            </button>
          )}
        </div>
      ) : (
        <div className="quiz-results animate-scale-in">
          <div className="quiz-results-badge">Your Results</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:42,fontWeight:300,color:'var(--charcoal)',marginBottom:8}}>Your Formula</h2>
          <p style={{color:'var(--muted)',marginBottom:40}}>Based on your answers, we recommend these products for your skin.</p>
          <div className="product-grid three-col">
            {result.map((p, i) => (
              <div key={p.id} className="product-card animate-fade-up" style={{animationDelay:`${0.2 + i * 0.15}s`, cursor:'pointer'}} onClick={() => navigate(`/product/${p.id}`)}>
                <div className="card-img">
                  <img src={p.images[0]} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
                <div className="card-body">
                  <div className="card-category">{p.category}</div>
                  <div className="card-name">{p.name}</div>
                  <div className="card-price">&pound;{p.price}.00</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:32}}>
            <button className="btn-primary btn-shimmer" onClick={() => navigate('/catalogue')}>Shop All Products</button>
            <button className="btn-outline" onClick={() => { setResult(null); setStep(0); setAnswers({}); setSelectedOpt(null) }}>Retake Quiz</button>
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
      <section style={{background:'linear-gradient(135deg,#FDE8D8,#FCE7F3)',padding:'100px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div className="hero-blob hero-blob-1"/>
        <div className="hero-blob hero-blob-2"/>
        <p className="animate-fade-down" style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--peach)',marginBottom:16,position:'relative'}}>Our Story</p>
        <h1 className="animate-fade-down" style={{fontFamily:'Cormorant Garamond,serif',fontSize:58,fontWeight:300,color:'var(--charcoal)',maxWidth:700,margin:'0 auto 24px',lineHeight:1.15,animationDelay:'.15s',position:'relative'}}>
          Born from frustration.<br/><em style={{color:'var(--pink)'}}>Built for your skin.</em>
        </h1>
        <p className="animate-fade-down" style={{fontSize:15,color:'var(--muted)',maxWidth:540,margin:'0 auto',lineHeight:1.9,animationDelay:'.3s',position:'relative'}}>
          Formula Me started with a simple problem — buying the wrong skincare product, again and again.
        </p>
      </section>

      <section style={{maxWidth:760,margin:'0 auto',padding:'80px 48px'}}>
        <div style={{display:'grid',gap:48}}>
          <Reveal>
            <div>
              <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:34,fontWeight:300,color:'var(--charcoal)',marginBottom:20}}>The Problem</h2>
              <p style={{fontSize:15,color:'var(--muted)',lineHeight:2}}>
                I love makeup. Always have. But my skin has never loved it back. For years I bought products that looked beautiful on screen, had thousands of positive reviews, and still managed to break me out, dry me out, or simply do nothing at all. The issue was never the products themselves — it was the mismatch. I was shopping without really knowing my skin.
              </p>
              <p style={{fontSize:15,color:'var(--muted)',lineHeight:2,marginTop:16}}>
                Every wasted product was money gone and, more frustratingly, hope gone. I wanted glowing skin and instead I was cycling through half-used serums and foundations that sat on my shelf doing nothing. I knew there had to be a better way to shop for skincare — one that started with understanding your skin first, not after the damage was done.
              </p>
            </div>
          </Reveal>

          <div style={{height:1,background:'var(--border)'}}/>

          <Reveal>
            <div>
              <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:34,fontWeight:300,color:'var(--charcoal)',marginBottom:20}}>The Idea</h2>
              <p style={{fontSize:15,color:'var(--muted)',lineHeight:2}}>
                Formula Me was designed around one belief — makeup and skincare should work together, not against each other. Every product on this platform is selected because it pulls double duty: it enhances how you look while actively caring for your skin beneath the surface. No compromise.
              </p>
              <p style={{fontSize:15,color:'var(--muted)',lineHeight:2,marginTop:16}}>
                The Skin Quiz at the heart of Formula Me is the feature I always wished existed. Answer four honest questions about your skin and receive a personalised set of recommendations that are actually matched to you — not to a marketing budget or a trending ingredient.
              </p>
            </div>
          </Reveal>

          <div style={{height:1,background:'var(--border)'}}/>

          <Reveal>
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
          </Reveal>

          <div style={{height:1,background:'var(--border)'}}/>

          <Reveal>
            <div style={{background:'var(--peach-light)',borderRadius:16,padding:36,textAlign:'center'}}>
              <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,fontWeight:300,color:'var(--charcoal)',marginBottom:12}}>Meet the Team</h3>
              <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.9,marginBottom:8}}>
                Formula Me was built by a team of five cyber secuity students as part of a group software development module.
              </p>
              <div style={{display:'flex',justifyContent:'center',gap:32,flexWrap:'wrap',marginTop:24}}>
                {['Zaina Mahien \u00b7 Frontend Design','Hawa Hayat Ali \u00b7 Project Planning','Amina Rifa \u00b7 Requirements','Faiha Mubarak \u00b7 Backend','Nurah  \u00b7  Database & Security'].map((m, i) => (
                  <div key={m} className="team-member animate-fade-up" style={{animationDelay:`${i * 0.1}s`}}>{m}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{background:'var(--charcoal)',padding:'80px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <Reveal>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:38,fontWeight:300,color:'var(--coconut)',marginBottom:16}}>Ready to find your formula?</h2>
          <p style={{color:'#888',marginBottom:32,fontSize:14}}>Take the skin quiz and get products matched to your skin in under a minute.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button className="btn-primary btn-shimmer" onClick={() => navigate('/quiz')}>Take Skin Quiz</button>
            <button style={{background:'transparent',color:'var(--coconut)',border:'1.5px solid #666',padding:'13px 32px',fontSize:13,letterSpacing:'.08em',textTransform:'uppercase',borderRadius:40,cursor:'pointer',transition:'all .3s'}} onClick={() => navigate('/catalogue')}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--peach)'; e.currentTarget.style.color = 'var(--peach)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = 'var(--coconut)' }}>
              Shop Now
            </button>
          </div>
        </Reveal>
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
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

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
    if (Object.keys(e).length > 0) return

    setLoading(true)
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) {
          setErrors({ form: error.message })
          setLoading(false)
          return
        }
        if (data.user) {
          try {
            await fetch('/api/save-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: data.user.id,
                fullName: data.user.user_metadata?.full_name || '',
                email: data.user.email,
              }),
            })
          } catch (e) {
            // Non-blocking
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
          },
        })
        if (error) {
          setErrors({ form: error.message })
          setLoading(false)
          return
        }
        if (data.user) {
          try {
            const res = await fetch('/api/save-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: data.user.id,
                fullName: form.name,
                email: form.email,
              }),
            })
            if (!res.ok) {
              const err = await res.json()
              console.error('Profile save error:', err.error)
            }
          } catch (e) {
            console.error('Profile save error:', e.message)
          }
        }
      }
      setSubmitted(true)
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' })
    }
    setLoading(false)
  }

  if (submitted) return (
    <div className="order-confirmed animate-scale-in">
      <div style={{width:64,height:64,borderRadius:'50%',background:'var(--peach-light)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width="28" height="28" fill="none" stroke="var(--peach)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" className="check-draw"/></svg>
      </div>
      <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:300}}>{isLogin ? 'Welcome back.' : 'Account created.'}</h2>
      <p style={{color:'var(--muted)'}}>You are now signed in to Formula Me.</p>
      <button className="btn-primary btn-shimmer" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  )

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
      <div className="login-card animate-scale-in">
        <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:300,color:'var(--charcoal)',marginBottom:8,textAlign:'center'}}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{color:'var(--muted)',fontSize:13,textAlign:'center',marginBottom:32}}>
          {isLogin ? 'Sign in to your Formula Me account' : 'Join Formula Me today'}
        </p>
        <div className="login-tabs">
          <button onClick={() => setIsLogin(true)} className={`login-tab ${isLogin ? 'active' : ''}`}>Sign In</button>
          <button onClick={() => setIsLogin(false)} className={`login-tab ${!isLogin ? 'active' : ''}`}>Register</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {errors.form && <p className="form-error animate-shake">{errors.form}</p>}
          {!isLogin && (
            <div className="animate-fade-down">
              <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>Full Name</label>
              <input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Your name"
                className={`checkout-input ${errors.name ? 'checkout-input-error' : ''}`}/>
              {errors.name && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors.name}</p>}
            </div>
          )}
          <div>
            <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@email.com"
              className={`checkout-input ${errors.email ? 'checkout-input-error' : ''}`}/>
            {errors.email && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors.email}</p>}
          </div>
          <div>
            <label style={{fontSize:12,color:'var(--muted)',display:'block',marginBottom:6}}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="Min. 8 characters"
              className={`checkout-input ${errors.password ? 'checkout-input-error' : ''}`}/>
            {errors.password && <p style={{color:'#EF4444',fontSize:11,marginTop:4}}>{errors.password}</p>}
          </div>
          <button className={`btn-primary btn-shimmer ${loading ? 'btn-processing' : ''}`} style={{width:'100%',justifyContent:'center',marginTop:8}} onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="btn-spinner"/> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)

  function addToCart(product) {
    setCart(c => [...c, product])
    setToast(`${product.name} added to cart`)
    setTimeout(() => setToast(null), 2500)
  }

  function removeFromCart(productId) {
    setCart(c => {
      const idx = c.findLastIndex(p => p.id === productId)
      if (idx === -1) return c
      return [...c.slice(0, idx), ...c.slice(idx + 1)]
    })
  }

  function clearCart() {
    setCart([])
  }

  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Nav cartCount={cart.length}/>
      <Routes>
        <Route path="/" element={<Home onAddToCart={addToCart}/>}/>
        <Route path="/catalogue" element={<Catalogue onAddToCart={addToCart}/>}/>
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart}/>}/>
        <Route path="/quiz" element={<SkinQuiz/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart}/>}/>
        <Route path="/checkout" element={<Checkout cart={cart} onClearCart={clearCart}/>}/>
      </Routes>
      {toast && (
        <div className="toast" key={toast}>
          <svg width="16" height="16" fill="none" stroke="var(--peach)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{toast}</span>
          <div className="toast-progress"/>
        </div>
      )}
      <BackToTop/>
    </BrowserRouter>
  )
}

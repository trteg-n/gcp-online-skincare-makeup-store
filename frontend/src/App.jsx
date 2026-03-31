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

function Nav({ cartCount }) {
  const navigate = useNavigate()
  return (
    <nav className="nav">
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
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </nav>
  )
}

function Footer() {
  const navigate = useNavigate()
  return (
    <>
      <footer className="footer">
        <div>
          <div className="footer-brand">Formula Me</div>
          <div className="footer-desc">Skincare-first beauty. Every formula is clinically tested and skin-barrier approved for all skin types.</div>
        </div>
        <div>
          <div className="footer-col-title">Shop</div>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>All Products</span>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>Skincare</span>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>Makeup</span>
          <span className="footer-link" onClick={() => navigate('/catalogue')}>SPF</span>
        </div>
        <div>
          <div className="footer-col-title">Explore</div>
          <span className="footer-link" onClick={() => navigate('/quiz')}>Skin Quiz</span>
          <span className="footer-link" onClick={() => navigate('/about')}>About</span>
          <span className="footer-link" onClick={() => navigate('/login')}>My Account</span>
        </div>
        <div>
          <div className="footer-col-title">Follow</div>
          <span className="footer-link">Instagram</span>
          <span className="footer-link">TikTok</span>
          <span className="footer-link">Pinterest</span>
        </div>
      </footer>
      <div className="footer-bottom">
        <span>© 2026 Formula Me. All rights reserved.</span>
        <span>Privacy · Cookies · Terms</span>
      </div>
    </>
  )
}

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate()
  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="card-img">
        {product.badge && <span className="card-badge">{product.badge}</span>}
        <img src={product.images[0]} alt={product.name}
          style={{width:'100%',height:'100%',objectFit:'cover'}}
          onError={e => { e.target.style.display='none' }}/>
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name">{product.name}</div>
        <div className="card-footer">
          <span className="card-price">£{product.price}.00</span>
          <button className="card-add" onClick={e => { e.stopPropagation(); onAddToCart(product) }}>+</button>
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
      <div className="banner">Free delivery over £40 · Clinically tested · Dermatologist approved</div>
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
          {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart}/>)}
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

      <Footer/>
    </div>
  )
}

function Catalogue({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100)

  const filtered = PRODUCTS.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.price >= minPrice && p.price <= maxPrice &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  )

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
            <span className="results-count">Showing <strong>{filtered.length} products</strong></span>
          </div>
          {filtered.length === 0
            ? <div style={{textAlign:'center',padding:'60px',color:'var(--muted)'}}>No products found. Try adjusting your filters.</div>
            : <div className="product-grid three-col">
                {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart}/>)}
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
            <button className="wishlist">♡</button>
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
            {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart}/>)}
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


function Checkout({ cart, onClearCart,user_id}) {
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

function SkinQuiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const questions = [
    { q:'How does your skin feel by midday?', options:['Oily all over','Dry and tight','Oily in T-zone only','Normal and balanced'] },
    { q:'How sensitive is your skin?', options:['Very sensitive — reacts easily','Mildly sensitive','Not sensitive at all','I get breakouts often'] },
    { q:'What is your main skin concern?', options:['Dullness and uneven tone','Dryness and dehydration','Breakouts and pores','Ageing and fine lines'] },
    { q:'Do you currently use SPF daily?', options:['Yes, every morning','Sometimes','Rarely','Never'] },
  ]

  function answer(opt) {
    const newAnswers = { ...answers, [step]: opt }
    setAnswers(newAnswers)
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
  }

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
      {!result ? (
        <div style={{maxWidth:560,width:'100%',textAlign:'center'}}>
          <div style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--peach)',marginBottom:16}}>
            Question {step+1} of {questions.length}
          </div>
          <div style={{height:4,background:'var(--border)',borderRadius:2,marginBottom:40}}>
            <div style={{height:'100%',background:'linear-gradient(135deg,var(--peach),var(--pink))',borderRadius:2,width:`${((step+1)/questions.length)*100}%`,transition:'width .4s'}}/>
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:300,color:'var(--charcoal)',marginBottom:32}}>
            {questions[step].q}
          </h2>
          <div style={{display:'grid',gap:12}}>
            {questions[step].options.map(opt => (
              <button key={opt} onClick={() => answer(opt)} style={{
                padding:'16px 24px',border:'1.5px solid var(--border)',borderRadius:12,
                background:'var(--white)',fontSize:14,color:'var(--charcoal)',cursor:'pointer',
                transition:'all .2s',textAlign:'left',fontFamily:'inherit'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor='var(--peach)'; e.currentTarget.style.background='var(--peach-light)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--white)' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{maxWidth:700,width:'100%',textAlign:'center'}}>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:42,fontWeight:300,color:'var(--charcoal)',marginBottom:8}}>Your Formula</h2>
          <p style={{color:'var(--muted)',marginBottom:40}}>Based on your answers, we recommend these products for your skin.</p>
          <div className="product-grid three-col">
            {result.map(p => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)} style={{cursor:'pointer'}}>
                <div className="card-img">
                  <img src={p.images[0]} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
                <div className="card-body">
                  <div className="card-category">{p.category}</div>
                  <div className="card-name">{p.name}</div>
                  <div className="card-price">£{p.price}.00</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{marginTop:32}} onClick={() => navigate('/catalogue')}>Shop All Products</button>
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
        // Log failed login attempt
        await db.from('failed_logins').insert({ email: form.email })
      } else {
        setSubmitted(true)
      }

    } else {
      // ── REGISTER ──
      const { data, error } = await db.auth.signUp({
        email: form.email,
        password: form.password
      })
      if (error) {
        setAuthError(error.message)
      } else {
        // Save to public.users table
        const { error: profileError } = await db.from('users').insert({
          user_id: data.user.id,
          email: form.email,
          username: form.name,
          password_hash: 'SUPABASE_AUTH',
          created_at: new Date().toISOString()
        })
        if (profileError) {
          setAuthError('Profile save failed: ' + profileError.message)
        } else {
          setSubmitted(true)
        }
      }
    }
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

export default function App() {
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)
  const [userId, setUserId] = useState(null)

  // ── Track logged-in user ──
  useEffect(() => {
    db.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null)
    })
    db.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id || null)
    })
  }, [])

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
      const { data: cartData } = await db
        .from('cart').select('cart_id')
        .eq('user_id', userId).single()

      if (cartData) {
        await db.from('cart_item')
          .delete()
          .eq('cart_id', cartData.cart_id)
          .eq('product_id', productId)
      }
    }
  }

  function clearCart() { setCart([]) }

  return (
    <BrowserRouter>
      <Nav cartCount={cart.length}/>
      <Routes>
        <Route path="/" element={<Home onAddToCart={addToCart}/>}/>
        <Route path="/catalogue" element={<Catalogue onAddToCart={addToCart}/>}/>
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart}/>}/>
        <Route path="/quiz" element={<SkinQuiz/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart}/>}/>
        <Route path="/checkout" element={<Checkout cart={cart} onClearCart={clearCart} userId={userId}/>}/>
        <Route path="/profile" element={<Profile userId={userId}/>}/>
      </Routes>
      {toast && <div className="toast">{toast}</div>}
    </BrowserRouter>
  )
}

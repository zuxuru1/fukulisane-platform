import { useState, useEffect } from 'react'
import {
  Phone, Mail, MapPin, Star, MessageCircle, ExternalLink, ChevronRight,
  Menu, X, Hammer, Wrench, CheckCircle2, ArrowUpRight, Send, Building,
  Shield, Heart, Award, FileText, Megaphone, Camera, Users, Clock,
  Globe, ChevronLeft, Calendar, Map, Download, Share2, Eye, Target,
  PenTool, Home, Paintbrush, Zap, Timer, TrendingUp, Calculator,
  Percent, CircleDollarSign, Sparkles, BadgeCheck, ThumbsUp, Flame
} from 'lucide-react'

const BIZ_SLUG = 'fukulisane-construction'

type SiteData = {
  id: string; name: string; slug: string; description: string; tagline: string; phone: string; email: string; whatsapp: string; address: string
  logoUrl: string | null; coverUrl: string | null; primaryColor: string; secondaryColor: string; accentColor: string
  services: { id: string; name: string; description: string; priceRange: string | null }[]
  projects: { id: string; title: string; description: string; category: string; imageUrl: string | null; location: string | null; isFeatured: boolean }[]
  testimonials: { id: string; clientName: string; content: string; rating: number; projectName: string | null }[]
  socialLinks: { platform: string; url: string }[]
  galleryImages: { id: string; url: string; caption: string | null }[]
}

const SERVICE_CATEGORIES = [
  {
    title: 'Residential Construction',
    icon: Home,
    color: '#059669',
    items: [
      'New House Construction', 'Foundations & Slabs', 'Brickwork & Masonry',
      'Roofing Installation', 'Boundary Walls', 'Garages & Carports',
      'Plumbing & Electrical', 'Concrete Work'
    ]
  },
  {
    title: 'Home Renovations',
    icon: Paintbrush,
    color: '#d4a843',
    items: [
      'House Extensions', 'Kitchen Renovations', 'Bathroom Renovations',
      'Ceiling & Drywall', 'Flooring & Tiling', 'Painting & Plastering',
      'Interior Remodeling', 'Wallpaper & Decor'
    ]
  },
  {
    title: 'General Construction',
    icon: Wrench,
    color: '#2563eb',
    items: [
      'Paving & Driveways', 'Retaining Walls', 'Fencing & Gates',
      'Small Commercial Projects', 'Property Maintenance',
      'Office Fit-Outs', 'Retail Spaces', 'School & Church Buildings'
    ]
  }
]

const GALLERY_ITEMS = [
  { src: '/assets/flyers/flyer-townsfolk.png', caption: 'Modern Township Homes', category: 'Residential' },
  { src: '/assets/flyers/flyer-tshwala.png', caption: 'Complete Building Solutions', category: 'Services' },
  { src: '/assets/flyers/flyer-campaign.png', caption: 'Current Campaign Specials', category: 'Promotions' },
  { src: '/assets/flyers/flyer-profile.png', caption: 'Company Profile', category: 'About' },
]

const TEAM = [
  { name: 'Managing Director', role: 'Leadership & Strategy', emoji: '👷', desc: 'Oversees all operations and business growth' },
  { name: 'Site Supervisor', role: 'Project Management', emoji: '📋', desc: 'Manages on-site construction and quality' },
  { name: 'Bricklayers', role: 'Masonry', emoji: '🧱', desc: 'Expert brickwork and structural builds' },
  { name: 'Carpenters', role: 'Woodwork', emoji: '🪚', desc: 'Roofing frames, doors, and custom woodwork' },
  { name: 'Painters', role: 'Finishing', emoji: '🎨', desc: 'Interior and exterior painting specialists' },
  { name: 'Tilers', role: 'Flooring', emoji: '🔲', desc: 'Floor and wall tiling, mosaics' },
]

const OPENING_HOURS = [
  { day: 'Monday', hours: '07:00 – 17:00' },
  { day: 'Tuesday', hours: '07:00 – 17:00' },
  { day: 'Wednesday', hours: '07:00 – 17:00' },
  { day: 'Thursday', hours: '07:00 – 17:00' },
  { day: 'Friday', hours: '07:00 – 17:00' },
  { day: 'Saturday', hours: '08:00 – 13:00' },
  { day: 'Sunday', hours: 'Closed' },
]

const SERVICE_AREAS = [
  'Durban', 'Pinetown', 'Umbilo', 'Chatsworth', 'Amanzimtoti',
  'KwaMashu', 'Umlazi', 'Isipingo', 'Queensburgh', 'Hillcrest',
  'Ezimbokodweni', 'Malagazi', 'KZN South Coast', 'KZN Midlands',
  'Pietermaritzburg', 'Richards Bay', 'Newcastle'
]

const BLOG_POSTS = [
  { id: '1', title: '5 Signs Your Roof Needs Replacing', category: 'Tips', date: '2026-07-01', readTime: '3 min', image: '/assets/flyers/flyer-tshwala.png', excerpt: 'A damaged roof can lead to costly water damage. Learn the key warning signs before it\'s too late.' },
  { id: '2', title: 'Kitchen Renovation Trends for 2026', category: 'Inspiration', date: '2026-06-15', readTime: '4 min', image: '/assets/flyers/flyer-townsfolk.png', excerpt: 'From open-plan designs to smart storage, discover what\'s trending in kitchen renovations this year.' },
  { id: '3', title: 'How to Budget for a Home Build', category: 'Guide', date: '2026-05-20', readTime: '5 min', image: '/assets/flyers/flyer-campaign.png', excerpt: 'Building a home is a major investment. Here\'s how to plan your budget and avoid unexpected costs.' },
]

const PRICING_PACKAGES = [
  {
    name: 'Basic Build',
    subtitle: 'Get started affordably',
    price: 'R180,000',
    priceNote: 'Starting from',
    color: '#059669',
    popular: false,
    features: [
      'Foundation & slab', 'Brickwork (single skin)', 'Roofing (corrugated iron)',
      'Basic electrical wiring', '1 bathroom', 'Concrete flooring',
      'Basic finishes', 'Up to 80m² floor area'
    ],
    cta: 'Get Basic Quote'
  },
  {
    name: 'Standard Build',
    subtitle: 'Most popular choice',
    price: 'R350,000',
    priceNote: 'Starting from',
    color: '#d4a843',
    popular: true,
    features: [
      'Foundation & slab', 'Brickwork (double skin)', 'Roofing (tile/colorbond)',
      'Full electrical + plumbing', '2 bathrooms', 'Ceiling & insulation',
      'Tiled flooring', 'Built-in cupboards', 'Up to 120m² floor area'
    ],
    cta: 'Get Standard Quote'
  },
  {
    name: 'Premium Build',
    subtitle: 'Complete luxury home',
    price: 'R600,000',
    priceNote: 'Starting from',
    color: '#2563eb',
    popular: false,
    features: [
      'Foundation & slab', 'Brickwork (face brick)', 'Premium roofing',
      'Full electrical + plumbing + solar', '3+ bathrooms', 'Designer ceilings',
      'Porcelain tiling', 'Kitchen fitted units', 'Built-in cupboards',
      'Alarm system', 'Up to 200m² floor area'
    ],
    cta: 'Get Premium Quote'
  }
]

const HOW_IT_WORKS = [
  { step: 1, icon: MessageCircle, title: 'Contact Us', desc: 'Send a WhatsApp or fill out the quote form. Tell us about your dream project.', color: '#25d366', time: '5 minutes' },
  { step: 2, icon: FileText, title: 'Free Quote', desc: 'We visit your site, understand your needs, and send a detailed quote — completely free.', color: '#d4a843', time: '1-2 days' },
  { step: 3, icon: Hammer, title: 'We Build', desc: 'Our skilled team gets to work. You get daily updates and progress photos.', color: '#2563eb', time: '2-8 weeks' },
  { step: 4, icon: BadgeCheck, title: 'Handover', desc: 'Final inspection together. You only pay when you\'re 100% satisfied with the result.', color: '#059669', time: 'Same day' },
]

const GUARANTEES = [
  { icon: CircleDollarSign, title: '100% Free Quote', desc: 'No hidden costs. No obligation. The quote is your final price — guaranteed.', color: '#059669' },
  { icon: Shield, title: '12-Month Warranty', desc: 'Every project comes with a 12-month workmanship warranty. If anything goes wrong, we fix it.', color: '#2563eb' },
  { icon: ThumbsUp, title: 'Pay When Satisfied', desc: 'You only make the final payment after your final walkthrough. No surprises.', color: '#d4a843' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'We commit to timelines and stick to them. Delays? We cover the extra costs.', color: '#dc2626' },
]

const WHY_US = [
  { feature: 'Free Site Visit & Quote', us: true, them: false },
  { feature: 'Written Contract & Timeline', us: true, them: false },
  { feature: '12-Month Workmanship Warranty', us: true, them: false },
  { feature: 'Daily Progress Updates & Photos', us: true, them: false },
  { feature: 'Pay Only When Satisfied', us: true, them: false },
  { feature: 'Licensed & Insured', us: true, them: 'Sometimes' },
  { feature: 'No Hidden Costs', us: true, them: false },
  { feature: 'Quality Materials', us: true, them: 'Varies' },
]

const COST_ITEMS = [
  { label: 'House Construction', perSqm: 3500, unit: 'm²', typical: '100-150 m²' },
  { label: 'House Extension', perSqm: 2800, unit: 'm²', typical: '20-50 m²' },
  { label: 'Boundary Wall', perSqm: 850, unit: 'm²', typical: '30-60 m²' },
  { label: 'Paving / Driveway', perSqm: 450, unit: 'm²', typical: '20-40 m²' },
  { label: 'Roof Replacement', perSqm: 600, unit: 'm²', typical: '80-150 m²' },
  { label: 'Kitchen Renovation', perSqm: 5000, unit: 'project', typical: 'R35,000-R80,000' },
  { label: 'Bathroom Renovation', perSqm: 3500, unit: 'project', typical: 'R25,000-R60,000' },
  { label: 'Interior Painting', perSqm: 85, unit: 'm²', typical: '80-150 m²' },
]

const OFFER_BANNER = {
  title: 'Winter Special: 10% OFF Renovations',
  subtitle: 'Limited to 5 slots this month — book your free site visit now!',
  expires: '31 August 2026',
  code: 'WINTER10',
}

export default function FukulisaneWebsite() {
  const [data, setData] = useState<SiteData | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [galleryFilter, setGalleryFilter] = useState('All')
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)
  const [estimatorService, setEstimatorService] = useState(0)
  const [estimatorSize, setEstimatorSize] = useState(100)

  useEffect(() => {
    fetch(`/api/construction-site/${BIZ_SLUG}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        if (d?.id) {
          fetch(`/api/posts?businessId=${d.id}`)
            .then(r => r.json())
            .then(d => setPosts(Array.isArray(d) ? d : d?.items ?? []))
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const sections = ['home', 'about', 'services', 'gallery', 'projects', 'team', 'blog', 'reviews', 'contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-[#d4a843] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  const waLink = `https://wa.me/${data.whatsapp?.replace(/[^0-9]/g, '') || '27817746377'}?text=${encodeURIComponent('Hi Fukulisane Construction! I would like to inquire about your services.')}`

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'projects', label: 'Projects' },
    { id: 'team', label: 'Team' },
    { id: 'blog', label: 'Blog' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ]

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Hi Fukulisane Construction! I'd like a quote.\n\nName: ${quoteForm.name}\nPhone: ${quoteForm.phone}\nService: ${quoteForm.service}\n\n${quoteForm.message}`
    window.open(`https://wa.me/27817746377?text=${encodeURIComponent(msg)}`, '_blank')
    setQuoteSubmitted(true)
    setTimeout(() => { setQuoteOpen(false); setQuoteSubmitted(false) }, 3000)
  }

  const galleryFilters = ['All', ...new Set(GALLERY_ITEMS.map(g => g.category))]
  const filteredGallery = galleryFilter === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.category === galleryFilter)

  const allServices = data.services.length > 0 ? data.services : SERVICE_CATEGORIES.flatMap(c => c.items.map(item => ({ id: item, name: item, description: '', priceRange: null })))

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ━━━ HEADER ━━━ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Fukulisane Construction" className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeSection === n.id ? 'bg-[#d4a843]/10 text-[#b8941f]' : 'text-gray-500 hover:text-gray-900'
                }`}>{n.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setQuoteOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#d4a843] text-white text-xs font-bold hover:bg-[#c9a433] transition shadow-md">
              <FileText className="h-3.5 w-3.5" /> Get Quote
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25d366] text-white text-xs font-bold hover:bg-[#1fb855] transition shadow-md">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a href={`tel:${data.phone}`}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d4a843] text-white text-xs font-bold hover:bg-[#c9a433] transition shadow-md">
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(n => (
                <button key={n.id} onClick={() => scrollTo(n.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                    activeSection === n.id ? 'bg-[#d4a843]/10 text-[#b8941f]' : 'text-gray-600'
                  }`}>{n.label}</button>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setQuoteOpen(true); setMenuOpen(false) }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#d4a843] text-white text-xs font-bold">
                  <FileText className="h-3.5 w-3.5" /> Get Quote
                </button>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#25d366] text-white text-xs font-bold">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ━━━ HERO ━━━ */}
      <section id="home" className="pt-16">
        <div className="relative bg-[#111] overflow-hidden min-h-[480px] md:min-h-[560px]">
          <img src="/assets/flyers/flyer-townsfolk.png" alt="Fukulisane Construction"
            className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 via-[#1a2332]/70 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/15 border border-[#d4a843]/25 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-[#d4a843] animate-pulse" />
                <span className="text-[10px] font-bold text-[#d4a843] tracking-widest uppercase">KwaZulu-Natal's Trusted Builders</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                Build Your Dream<br /><span className="text-[#d4a843]">Home Today</span>
              </h1>
              <p className="text-lg text-gray-300 mb-2 italic">"{data.tagline || 'Sakha Namuhla. Sakhela Ikusasa.'}"</p>
              <p className="text-sm text-gray-400 mb-8 max-w-md leading-relaxed">
                From new builds to renovations, we deliver quality construction you can trust. Professional teams, honest pricing, and lasting results.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setQuoteOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4a843] text-black text-sm font-bold hover:bg-[#c9a433] transition shadow-lg shadow-[#d4a843]/20">
                  <FileText className="h-4 w-4" /> Request a Quote
                </button>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25d366] text-white text-sm font-bold hover:bg-[#1fb855] transition shadow-lg shadow-[#25d366]/20">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
                <a href={`tel:${data.phone}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition border border-white/20">
                  <Phone className="h-4 w-4" /> {data.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ URGENCY OFFER BANNER ━━━ */}
      <div className="bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#dc2626] py-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-white blur-lg" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white blur-lg" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-white animate-pulse" />
            <span className="text-sm font-extrabold text-white">{OFFER_BANNER.title}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/30" />
          <p className="text-xs text-white/90">{OFFER_BANNER.subtitle}</p>
          <button onClick={() => setQuoteOpen(true)}
            className="px-4 py-1.5 rounded-full bg-white text-[#dc2626] text-xs font-extrabold hover:bg-gray-100 transition shrink-0">
            Claim Offer →
          </button>
        </div>
      </div>

      {/* ━━━ TRUST BAR ━━━ */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: CheckCircle2, label: 'Licensed & Insured', desc: 'Fully registered' },
            { icon: Star, label: '5-Star Reviews', desc: 'Client verified' },
            { icon: Hammer, label: '50+ Projects', desc: 'Completed' },
            { icon: Award, label: '10+ Years', desc: 'Experience' },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#d4a843]/10 flex items-center justify-center shrink-0">
                <t.icon className="h-5 w-5 text-[#b8941f]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{t.label}</p>
                <p className="text-[10px] text-gray-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ GUARANTEES ━━━ */}
      <section className="py-8 bg-[#1a2332] border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GUARANTEES.map(g => (
              <div key={g.title} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${g.color}20` }}>
                  <g.icon className="h-4 w-4" style={{ color: g.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{g.title}</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ ABOUT ━━━ */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
                <Building className="h-3 w-3 text-[#b8941f]" />
                <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">About Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Building Better Homes,<br /><span className="text-[#b8941f]">Building Better Lives</span>
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Fukulisane Construction is a KwaZulu-Natal-based construction company specializing in residential building, home renovations, and property maintenance. We serve communities from Durban to rural KZN with quality workmanship.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                <strong className="text-gray-700">Our Mission:</strong> To provide high-quality, affordable, and reliable residential construction and renovation services that exceed customer expectations while contributing to community development and job creation.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                <strong className="text-gray-700">Our Vision:</strong> To become a trusted and respected construction company known for quality workmanship, integrity, and customer satisfaction throughout South Africa.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, label: 'Quality First', desc: 'Durable materials' },
                  { icon: Heart, label: 'Client Focus', desc: 'Your vision matters' },
                  { icon: Award, label: 'Fair Pricing', desc: 'No hidden costs' },
                ].map(v => (
                  <div key={v.label} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <v.icon className="h-5 w-5 text-[#b8941f] mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-gray-900">{v.label}</p>
                    <p className="text-[9px] text-gray-400">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 shadow-lg">
                <img src="/assets/flyers/flyer-profile.png" alt="Fukulisane Construction - Company Profile"
                  className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#25d366] flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-900">WhatsApp Us</p>
                  <p className="text-[9px] text-[#25d366] font-medium">Instant response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ PROMO BANNER ━━━ */}
      <section className="bg-[#1a2332] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden hover:shadow-2xl transition group relative">
            <img src="/assets/flyers/flyer-campaign.png" alt="Campaign Special"
              className="w-full h-auto group-hover:scale-[1.02] transition duration-700" />
          </a>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Timer className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">How It Works</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">4 simple steps from dream to reality</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={h.step} className="relative">
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition">
                  <div className="h-14 w-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${h.color}12` }}>
                    <h.icon className="h-7 w-7" style={{ color: h.color }} />
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 mb-2">
                    <span className="text-[9px] font-bold text-gray-500">Step {h.step}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-1">{h.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">{h.desc}</p>
                  <p className="text-[10px] font-bold" style={{ color: h.color }}>⏱ {h.time}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4a843] text-white text-sm font-bold hover:bg-[#c9a433] transition shadow-lg shadow-[#d4a843]/20">
              <MessageCircle className="h-4 w-4" /> Start Step 1 — Contact Us Now
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ SERVICES (Full Breakdown) ━━━ */}
      <section id="services" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Wrench className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Our Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">What We Do</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Professional construction services across KwaZulu-Natal</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map(cat => (
              <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${cat.color}12` }}>
                  <cat.icon className="h-6 w-6" style={{ color: cat.color }} />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-3">{cat.title}</h3>
                <div className="space-y-2">
                  {cat.items.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#b8941f] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <button onClick={() => setQuoteOpen(true)}
                  className="w-full mt-5 py-2.5 rounded-xl text-sm font-bold transition border-2 hover:text-white"
                  style={{ borderColor: cat.color, color: cat.color }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = cat.color; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = cat.color }}>
                  Get a Quote
                </button>
              </div>
            ))}
          </div>

          {data.services.length > 0 && (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.services.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-[#d4a843]/30 transition group">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{s.name}</h4>
                  {s.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{s.description}</p>}
                  {s.priceRange && <p className="text-xs text-[#b8941f] font-bold mt-2">From {s.priceRange}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━ PRICING PACKAGES ━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <CircleDollarSign className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Transparent Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Choose Your Package</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Starting prices — actual quotes are customized to your exact needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PACKAGES.map(pkg => (
              <div key={pkg.name} className={`relative bg-white rounded-2xl border-2 p-6 transition hover:shadow-xl ${
                pkg.popular ? 'border-[#d4a843] shadow-lg' : 'border-gray-200'
              }`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d4a843] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="text-center mb-5">
                  <p className="text-xs text-gray-400 font-medium">{pkg.subtitle}</p>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-1">{pkg.name}</h3>
                  <div className="mt-3">
                    <p className="text-[10px] text-gray-400">{pkg.priceNote}</p>
                    <p className="text-3xl font-extrabold" style={{ color: pkg.color }}>{pkg.price}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {pkg.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: pkg.color }} />
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => setQuoteOpen(true)}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition ${
                    pkg.popular
                      ? 'bg-[#d4a843] text-white hover:bg-[#c9a433] shadow-md'
                      : 'border-2 hover:text-white'
                  }`}
                  style={!pkg.popular ? { borderColor: pkg.color, color: pkg.color } : undefined}
                  onMouseEnter={e => { if (!pkg.popular) { e.currentTarget.style.backgroundColor = pkg.color; e.currentTarget.style.color = '#fff' } }}
                  onMouseLeave={e => { if (!pkg.popular) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = pkg.color } }}>
                  {pkg.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">All prices are estimates. Final pricing depends on site conditions and your exact requirements.</p>
        </div>
      </section>

      {/* ━━━ COST ESTIMATOR ━━━ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Calculator className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Cost Estimator</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Estimate Your Budget</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Get a rough idea before you commit — then get an exact free quote</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-5">
                <label className="text-xs font-bold text-gray-700 mb-2 block">What do you need?</label>
                <select value={estimatorService}
                  onChange={e => setEstimatorService(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#d4a843]/30 focus:border-[#d4a843] bg-white">
                  {COST_ITEMS.map((item, i) => (
                    <option key={i} value={i}>{item.label} — ~R{item.perSqm.toLocaleString()}/{item.unit}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Typical size: {COST_ITEMS[estimatorService].typical}</p>
              </div>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">
                    {COST_ITEMS[estimatorService].unit === 'project' ? 'Budget Level' : `Size (${COST_ITEMS[estimatorService].unit})`}
                  </label>
                  <span className="text-sm font-extrabold text-[#b8941f]">
                    {COST_ITEMS[estimatorService].unit === 'project'
                      ? ['Basic', 'Standard', 'Premium'][Math.min(2, Math.floor(estimatorSize / 40))]
                      : estimatorSize}
                    {COST_ITEMS[estimatorService].unit !== 'project' && ` ${COST_ITEMS[estimatorService].unit}`}
                  </span>
                </div>
                <input type="range" min={COST_ITEMS[estimatorService].unit === 'project' ? 1 : 10}
                  max={COST_ITEMS[estimatorService].unit === 'project' ? 100 : 300}
                  value={estimatorSize}
                  onChange={e => setEstimatorSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#d4a843]" />
                <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                  {COST_ITEMS[estimatorService].unit === 'project' ? (
                    <><span>Budget</span><span>Standard</span><span>Premium</span></>
                  ) : (
                    <><span>10 {COST_ITEMS[estimatorService].unit}</span><span>150 {COST_ITEMS[estimatorService].unit}</span><span>300 {COST_ITEMS[estimatorService].unit}</span></>
                  )}
                </div>
              </div>
              <div className="bg-[#1a2332] rounded-xl p-5 text-center">
                <p className="text-[10px] text-gray-400 mb-1">Estimated Cost</p>
                <p className="text-3xl font-extrabold text-[#d4a843]">
                  R{(COST_ITEMS[estimatorService].perSqm * (COST_ITEMS[estimatorService].unit === 'project' ? 10 : estimatorSize)).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">*Estimate only — get an exact free quote below</p>
                <button onClick={() => setQuoteOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4a843] text-white text-sm font-bold hover:bg-[#c9a433] transition">
                  <FileText className="h-4 w-4" /> Get Exact Free Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ GALLERY ━━━ */}
      <section id="gallery" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Camera className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Our Gallery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Photo Gallery</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">See our work and company materials</p>
          </div>
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {galleryFilters.map(f => (
              <button key={f} onClick={() => setGalleryFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  galleryFilter === f ? 'bg-[#d4a843] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>{f}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredGallery.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition group">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={img.src} alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs font-bold text-gray-900">{img.caption}</p>
                  <p className="text-[10px] text-gray-400">{img.category}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">More photos available on our social media pages</p>
        </div>
      </section>

      {/* ━━━ PROJECTS ━━━ */}
      <section id="projects" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Hammer className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Our Work</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Completed Projects</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">See the quality of our work for yourself</p>
          </div>
          {data.projects.length === 0 ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { src: '/assets/flyers/flyer-tshwala.png', alt: 'Residential Construction', label: 'Residential Builds' },
                { src: '/assets/flyers/flyer-townsfolk.png', alt: 'Home Construction Styles', label: 'Home Styles' },
              ].map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs font-bold text-gray-900">{img.label}</p>
                    <p className="text-[10px] text-gray-400">Fukulisane Construction</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.projects.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#d4a843]/30 transition group">
                  {p.imageUrl ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <Hammer className="h-12 w-12 text-gray-200" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-gray-900">{p.title}</h3>
                      {p.isFeatured && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#d4a843] text-white">Featured</span>}
                    </div>
                    {p.category && <p className="text-[10px] text-gray-400 font-medium">{p.category}</p>}
                    {p.location && <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1"><MapPin className="h-2.5 w-2.5" /> {p.location}</p>}
                    {p.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━ WHY US ━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Target className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Us vs. The Rest</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">See why 50+ clients chose Fukulisane Construction</p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-[#1a2332] text-white text-xs font-bold">
              <div className="p-4">Feature</div>
              <div className="p-4 text-center text-[#d4a843]">🏆 Fukulisane</div>
              <div className="p-4 text-center text-gray-400">Others</div>
            </div>
            {WHY_US.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="p-4 text-xs font-medium text-gray-700 border-r border-gray-100">{row.feature}</div>
                <div className="p-4 text-center border-r border-gray-100">
                  {row.us === true ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-xs text-gray-500">{String(row.us)}</span>
                  )}
                </div>
                <div className="p-4 text-center">
                  {row.them === true ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : row.them === false ? (
                    <X className="h-5 w-5 text-gray-300 mx-auto" />
                  ) : (
                    <span className="text-xs text-gray-400">{row.them}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#d4a843] text-white text-sm font-bold hover:bg-[#c9a433] transition shadow-lg shadow-[#d4a843]/20">
              <Sparkles className="h-4 w-4" /> Experience the Difference — Get a Free Quote
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ TEAM ━━━ */}
      <section id="team" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Users className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Meet the Experts</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Skilled professionals delivering quality on every project</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map(member => (
              <div key={member.name} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-[#d4a843]/30 transition text-center">
                <div className="h-16 w-16 rounded-2xl bg-[#d4a843]/10 flex items-center justify-center text-3xl mx-auto mb-3">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-xs text-[#b8941f] font-medium">{member.role}</p>
                <p className="text-xs text-gray-400 mt-2">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ BLOG ━━━ */}
      <section id="blog" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <PenTool className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Blog</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Tips & Inspiration</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Expert advice for your building projects</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#d4a843]/30 transition group">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#d4a843]/10 text-[#b8941f]">{post.category}</span>
                    <span className="text-[10px] text-gray-400">{post.readTime} read</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#b8941f] transition">{post.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {posts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-extrabold text-gray-900 mb-4">Latest Updates</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((p: any) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                    {p.imageUrl ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <Megaphone className="h-10 w-10 text-gray-200" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          p.category === 'promotion' ? 'bg-red-50 text-red-600' :
                          p.category === 'service' ? 'bg-blue-50 text-blue-600' : 'bg-[#d4a843]/10 text-[#b09430]'
                        }`}>{p.category}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{p.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ━━━ REVIEWS ━━━ */}
      <section id="reviews" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Star className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">What Our Clients Say</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Real reviews from real customers</p>
          </div>
          {data.testimonials.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-3">Reviews coming soon.</p>
              <a href="https://g.page/r/CZvrH_lDzSdJEBI/review" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4a843] text-white text-xs font-bold hover:bg-[#c9a433] transition">
                <Star className="h-3.5 w-3.5" /> Leave Us a Review
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.testimonials.map(t => (
                <div key={t.id} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#d4a843] text-[#d4a843]" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 italic mb-4 leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="h-9 w-9 rounded-full bg-[#d4a843]/10 flex items-center justify-center text-sm font-bold text-[#b8941f]">
                      {t.clientName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.clientName}</p>
                      {t.projectName && <p className="text-[10px] text-gray-400">{t.projectName}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <img src="/assets/flyers/flyer-tshwala.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332]/95 via-[#1a2332]/90 to-[#15202b]/95" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Get a free quote today. No obligations, no hidden costs. Just honest advice and quality work.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setQuoteOpen(true)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#d4a843] text-white text-sm font-bold hover:bg-[#c9a433] transition shadow-lg shadow-[#d4a843]/20">
              <FileText className="h-4 w-4" /> Request Free Quote
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#25d366] text-white text-sm font-bold hover:bg-[#1fb855] transition shadow-lg shadow-[#25d366]/20">
              <MessageCircle className="h-4 w-4" /> WhatsApp Us Now
            </a>
            <a href={`tel:${data.phone}`}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition border border-white/20">
              <Phone className="h-4 w-4" /> Call {data.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ CONTACT ━━━ */}
      <section id="contact" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a843]/10 mb-4">
              <Phone className="h-3 w-3 text-[#b8941f]" />
              <span className="text-[10px] font-bold text-[#b8941f] tracking-widest uppercase">Contact Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Get In Touch</h2>
            <p className="text-sm text-gray-500">We'd love to hear about your project</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Phone, label: 'Call Us', value: data.phone, link: `tel:${data.phone}`, color: '#d4a843' },
              { icon: MessageCircle, label: 'WhatsApp', value: data.whatsapp || data.phone, link: waLink, color: '#25d366' },
              { icon: Mail, label: 'Email Us', value: data.email, link: `mailto:${data.email}`, color: '#2563eb' },
            ].map(c => (
              <a key={c.label} href={c.link} target={c.label === 'WhatsApp' ? '_blank' : undefined} rel="noopener noreferrer"
                className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:border-[#d4a843]/30 transition group">
                <div className="h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${c.color}12` }}>
                  <c.icon className="h-6 w-6" style={{ color: c.color }} />
                </div>
                <p className="text-xs text-gray-400 font-medium mb-1">{c.label}</p>
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#b8941f] transition">{c.value}</p>
              </a>
            ))}
          </div>

          {/* Address & Opening Hours */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="h-5 w-5 text-[#b8941f] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Our Location</p>
                  <p className="text-sm text-gray-500">{data.address}</p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 h-48">
                <iframe
                  title="Fukulisane Construction Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3475.5!2d30.9!3d-29.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU3JzAwLjAiUyAzMMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sza!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-[#b8941f]" />
                <p className="text-sm font-bold text-gray-900">Opening Hours</p>
              </div>
              <div className="space-y-2">
                {OPENING_HOURS.map(h => {
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
                  return (
                    <div key={h.day} className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                      h.day === today ? 'bg-[#d4a843]/10 border border-[#d4a843]/20' : ''
                    }`}>
                      <p className="text-xs font-bold text-gray-700">{h.day}</p>
                      <p className={`text-xs ${h.hours === 'Closed' ? 'text-gray-400' : 'text-gray-600'}`}>{h.hours}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-5 w-5 text-[#b8941f]" />
              <p className="text-sm font-bold text-gray-900">Service Areas</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map(area => (
                <span key={area} className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600">
                  📍 {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="bg-[#1a2332] border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/logo.png" alt="Fukulisane Construction" className="h-10 w-auto" />
              </div>
              <p className="text-xs text-gray-400 italic mb-3">"{data.tagline || 'Sakha Namuhla. Sakhela Ikusasa.'}"</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">Building Today, Creating Tomorrow. KwaZulu-Natal's trusted construction partner.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2">
                {navItems.map(n => (
                  <button key={n.id} onClick={() => scrollTo(n.id)}
                    className="block text-xs text-gray-400 hover:text-[#d4a843] transition">{n.label}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Contact</h4>
              <div className="space-y-2">
                <p className="text-xs text-gray-400 flex items-center gap-2"><Phone className="h-3 w-3" /> {data.phone}</p>
                <p className="text-xs text-gray-400 flex items-center gap-2"><Mail className="h-3 w-3" /> {data.email}</p>
                <p className="text-xs text-gray-400 flex items-center gap-2"><MapPin className="h-3 w-3" /> {data.address}</p>
              </div>
              <a href="#" className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-xs text-gray-400 hover:bg-[#d4a843] hover:text-white transition">
                <Download className="h-3.5 w-3.5" /> Company Profile (PDF)
              </a>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Follow Us</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'F', url: 'https://www.facebook.com/', name: 'Facebook' },
                  { label: 'I', url: 'https://www.instagram.com/', name: 'Instagram' },
                  { label: 'T', url: 'https://www.tiktok.com/', name: 'TikTok' },
                  { label: 'Y', url: 'https://www.youtube.com/', name: 'YouTube' },
                  { label: 'L', url: 'https://www.linkedin.com/', name: 'LinkedIn' },
                  { label: 'P', url: 'https://www.pinterest.com/', name: 'Pinterest' },
                ].map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
                    className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#d4a843] hover:text-white transition text-xs font-bold">
                    {s.label}
                  </a>
                ))}
              </div>
              <a href="https://g.page/r/CZvrH_lDzSdJEBI/review" target="_blank" rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#d4a843]/10 text-xs text-[#d4a843] hover:bg-[#d4a843] hover:text-white transition">
                <Star className="h-3.5 w-3.5" /> Leave a Google Review
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-[10px] text-gray-500">© {new Date().getFullYear()} Fukulisane Construction (Pty) Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ━━━ FLOATING WHATSAPP ━━━ */}
      <a href={waLink} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-xl shadow-[#25d366]/30 hover:scale-110 transition-transform">
        <MessageCircle className="h-6 w-6 text-white" />
      </a>

      {/* ━━━ STICKY MOBILE CTA ━━━ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden">
        <div className="flex">
          <a href={`tel:${data.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-r border-gray-100 text-[#b8941f]">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-bold">Call</span>
          </a>
          <button onClick={() => setQuoteOpen(true)}
            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#d4a843] text-white">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-bold">Get Free Quote</span>
          </button>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 border-l border-gray-100 text-[#25d366]">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-bold">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ━━━ QUOTE REQUEST MODAL ━━━ */}
      {quoteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setQuoteOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {quoteSubmitted ? (
              <div className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">Quote Request Sent!</h3>
                <p className="text-sm text-gray-500">We'll get back to you shortly via WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-extrabold text-gray-900">Request a Free Quote</h3>
                  <button type="button" onClick={() => setQuoteOpen(false)} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-4">Fill in the details below and we'll send your quote request via WhatsApp.</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name *</label>
                    <input required value={quoteForm.name} onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/30 focus:border-[#d4a843]"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Phone *</label>
                    <input required value={quoteForm.phone} onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/30 focus:border-[#d4a843]"
                      placeholder="081 774 6377" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
                    <input type="email" value={quoteForm.email} onChange={e => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/30 focus:border-[#d4a843]"
                      placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Service Needed *</label>
                    <select required value={quoteForm.service} onChange={e => setQuoteForm({ ...quoteForm, service: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/30 focus:border-[#d4a843] bg-white">
                      <option value="">Select a service</option>
                      <option>New House Construction</option>
                      <option>House Extension</option>
                      <option>Kitchen Renovation</option>
                      <option>Bathroom Renovation</option>
                      <option>Roofing</option>
                      <option>Painting</option>
                      <option>Paving & Driveways</option>
                      <option>Boundary Wall</option>
                      <option>General Renovation</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Project Details</label>
                    <textarea value={quoteForm.message} onChange={e => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/30 focus:border-[#d4a843] resize-none"
                      rows={3} placeholder="Tell us about your project, budget, timeline..." />
                  </div>
                </div>
                <button type="submit"
                  className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25d366] text-white text-sm font-bold hover:bg-[#1fb855] transition">
                  <MessageCircle className="h-4 w-4" /> Send Quote via WhatsApp
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-3">This will open WhatsApp with your quote request</p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

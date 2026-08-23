import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Phone, MessageCircle, Mail, MapPin, Clock, Star, CheckCircle2,
  ChevronDown, ArrowRight, Home, Wrench, Hammer, Paintbrush,
  Grid3x3, Building, Menu, X, Send, Award, Shield, Users,
  Droplets, DoorOpen, Layers, Ruler, Fence, HammerIcon, HardHat
} from 'lucide-react'

const BIZ_SLUG = 'fukulisane-construction'
const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

const SERVICES_FULL = [
  { name: 'Residential Construction', zulu: 'Ukwakhiwa Kwezindlu', desc: 'New house construction from foundations to completion. Township, rural, and suburban styles.', icon: Home },
  { name: 'Home Renovations', zulu: 'Ukulungisa Amakhaya', desc: 'Kitchen, bathroom, house extensions, ceiling installation, drywall partitioning.', icon: Wrench },
  { name: 'Roofing', zulu: 'Ukwapha Uphahla', desc: 'New roof installation, roof repairs, and waterproofing for all building types.', icon: Hammer },
  { name: 'Painting', zulu: 'Upenyo Nokulungisa', desc: 'Interior and exterior painting, tiling, flooring, and plastering.', icon: Paintbrush },
  { name: 'Paving & Concrete', zulu: 'Amaphangi Nezindawo', desc: 'Driveways, walkways, concrete works, and outdoor paving.', icon: Grid3x3 },
  { name: 'Boundary Walls', zulu: 'Izindonga Nezivalo', desc: 'Security walls, boundary fencing, pre-cast, brick, and electric fencing.', icon: Fence },
]

const WHY_CHOOSE = [
  { label: 'Experienced Workmanship', zulu: 'Umsebenzi Osezingeni Eliphezulu' },
  { label: 'Competitive Pricing', zulu: 'Intengo Efanelekile' },
  { label: 'High-Quality Materials', zulu: 'Izinto Ezinhle' },
  { label: 'Reliable Project Management', zulu: 'Ukuqedwa Ngesebenbhti' },
  { label: 'Transparent Quotations', zulu: 'Amabhalo Angabazeki' },
  { label: 'Professional Customer Service', zulu: 'Inkonzo Enobungcweti' },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Free Consultation & Site Visit', icon: Phone },
  { num: '02', title: 'Needs Assessment & Planning', icon: Ruler },
  { num: '03', title: 'Detailed Quotation', icon: FileIcon },
  { num: '04', title: 'Project Scheduling', icon: Clock },
  { num: '05', title: 'Construction or Renovation', icon: Hammer },
  { num: '06', title: 'Quality Inspection', icon: CheckCircle2 },
  { num: '07', title: 'Project Handover & Satisfaction', icon: Award },
]

function FileIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
}

const PROJECTS_DATA = [
  { title: 'Modern Township Home', desc: 'Isitayela SaseTownship — beautiful, affordable homes built to last.', style: 'Township', img: '/api/files/ChatGPT_Image_Aug_3__2026__06_23_16_AM.png' },
  { title: 'Rural Estate Home', desc: 'Isitayela Sasemaphandleni — custom homes for rural properties.', style: 'Rural', img: '/api/files/ChatGPT_Image_Aug_3__2026__06_23_39_AM.png' },
  { title: 'Modern Residential Build', desc: 'Amakhaya Asemanje — contemporary designs with premium finishes.', style: 'Modern', img: '/api/files/ChatGPT_Image_Aug_3__2026__06_15_36_AM.png' },
]

const TESTIMONIALS_SEED = [
  { name: 'Thabo M.', project: '4-Room Township House', content: 'Fukulisane built our dream home in 8 weeks. Professional team, transparent pricing, and the quality is outstanding. Highly recommend!', rating: 5 },
  { name: 'Nomvula K.', project: 'Kitchen Renovation', content: 'Our kitchen looks brand new! They worked within our budget and finished ahead of schedule. Will definitely use them again.', rating: 5 },
  { name: 'Sipho D.', project: 'Boundary Wall & Paving', content: 'Excellent work on our boundary wall and driveway paving. The team was punctual and the workmanship is top-notch.', rating: 5 },
  { name: 'Lindiwe N.', project: 'Full Home Renovation', content: 'We hired Fukulisane for a full house renovation. The result exceeded our expectations. Our home looks completely different now!', rating: 5 },
  { name: 'Mandla P.', project: '5-Room House Construction', content: 'They built us a beautiful 5-room house. From the foundation to the roof, everything was done with care. Thank you!', rating: 5 },
]

interface Props { slug?: string }

export default function Storefront({ slug }: Props) {
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    clientName: '', clientPhone: '', clientEmail: '', serviceType: '',
    projectDesc: '', address: '', budget: '',
  })
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/construction-site/${BIZ_SLUG}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setBusiness(d); setLoading(false) })
      .catch(() => {
        setBusiness({
          name: 'Fukulisane Construction (Pty) Ltd',
          tagline: 'Sakha Namuhla. Sakhela Ikusasa.',
          phone: '081 774 6377', email: 'fukulisane.construction@gmail.com',
          address: 'C260 Mbomu Road, Ezimbokodweni, 4126',
          whatsapp: '27817746377',
          testimonials: TESTIMONIALS_SEED.map((t, i) => ({ id: String(i), ...t })),
          projects: PROJECTS_DATA.map((p, i) => ({ id: String(i), ...p, imageUrl: p.img })),
        })
        setLoading(false)
      })
  }, [])

  const submitQuote = async () => {
    if (!quoteForm.clientName || !quoteForm.clientPhone) return
    try {
      await fetch('/api/quote-requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: BIZ_ID, ...quoteForm }),
      })
    } catch {}
    setQuoteSubmitted(true)
    setTimeout(() => { setQuoteOpen(false); setQuoteSubmitted(false); setQuoteForm({
      clientName: '', clientPhone: '', clientEmail: '', serviceType: '',
      projectDesc: '', address: '', budget: '',
    })}, 2500)
  }

  const testimonials = business?.testimonials?.length ? business.testimonials : TESTIMONIALS_SEED
  const projects = business?.projects?.length ? business.projects : PROJECTS_DATA

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false) }
  const wa = (text?: string) => `https://wa.me/${business?.whatsapp || '27817746377'}${text ? `?text=${encodeURIComponent(text)}` : ''}`

  const navItems = [
    { id: 'about', label: 'About' }, { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' }, { id: 'process', label: 'Process' },
    { id: 'testimonials', label: 'Reviews' }, { id: 'contact', label: 'Contact' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Hammer className="h-8 w-8 text-black" />
        </div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center">
              <Hammer className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="font-extrabold text-sm leading-tight text-gray-900 tracking-wide">FUKULISANE</p>
              <p className="text-[9px] text-[#d4af37] font-bold tracking-widest">CONSTRUCTION</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)}
                className="text-sm text-gray-500 hover:text-[#d4af37] font-medium transition">{n.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={wa('Hi Fukulisane, I need a quote please.')} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <Button onClick={() => { scrollTo('contact'); setQuoteOpen(true) }}
              className="bg-[#d4af37] text-black hover:bg-[#c9a433] text-xs font-bold">Get Quote</Button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-500">
              {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="p-4 space-y-1">
              {navItems.map(n => (
                <button key={n.id} onClick={() => scrollTo(n.id)}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#d4af37] transition font-medium">{n.label}</button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO with real image ─── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/api/files/ChatGPT_Image_Aug_3__2026__06_23_39_AM.png"
            alt="Fukulisane Construction" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-xl">
            <Badge variant="outline" className="border-[#d4af37]/50 text-[#d4af37] mb-6 text-xs bg-black/40 backdrop-blur">
              🏗️ KwaZulu-Natal's Trusted Builders
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-white">
              Sakha <span className="text-[#d4af37]">Amakhaya</span> Anesitayela
            </h1>
            <p className="text-xl text-gray-200 mb-2 font-medium">
              Building Better Homes. Building Better Lives.
            </p>
            <p className="text-sm text-gray-300 mb-8">
              Sakha amakhaya esimanje, anethezekile futhi aqinile — whether you're in the city, township, or rural areas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => { scrollTo('contact'); setQuoteOpen(true) }}
                className="bg-[#d4af37] text-black hover:bg-[#c9a433] text-sm font-bold px-8 py-3 h-auto">
                Get Free Quote <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <a href={wa('Hi, I need a construction quote please.')}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition justify-center">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us Now
              </a>
            </div>
            <div className="flex flex-wrap gap-4 mt-8 text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#d4af37]" /> Quality Workmanship</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#d4af37]" /> Competitive Pricing</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#d4af37]" /> On Time Delivery</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#d4af37]" /> Safe Work Practices</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] mb-4 text-xs">About Us</Badge>
              <h2 className="text-3xl font-extrabold mb-4 text-gray-900">
                <span className="text-[#d4af37]">Fukulisane</span> Construction (Pty) Ltd
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Fukulisane Construction (Pty) Ltd is a South African construction company committed to delivering quality workmanship, reliable service, and innovative building solutions. We specialize in residential construction, home renovations, and general building projects tailored to the needs of homeowners and property investors.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our approach is built on professionalism, integrity, and attention to detail. Whether renovating an existing home or completing a new building project, we strive to exceed client expectations through quality craftsmanship and excellent customer service.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {WHY_CHOOSE.map(f => (
                  <div key={f.label} className="flex items-start gap-2 p-3 rounded-xl bg-gray-50">
                    <CheckCircle2 className="h-4 w-4 text-[#d4af37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{f.label}</p>
                      <p className="text-[10px] text-gray-500">{f.zulu}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="/api/files/ChatGPT_Image_Aug_3__2026__06_10_41_AM.png"
                alt="Company Profile" className="rounded-2xl shadow-2xl w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES (comprehensive, from real company profile) ─── */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] mb-4 text-xs">Our Services</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Amasevisi <span className="text-[#d4af37]">Ethu</span></h2>
            <p className="text-gray-500 text-sm mt-2">We don't just build structures, we build relationships that last.</p>
          </div>

          {/* Service categories from the real company profile */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Home Renovations */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-extrabold text-lg text-gray-900 mb-1">Home Renovations</h3>
                <p className="text-xs text-[#d4af37] font-medium mb-3">Ukulungisa Amakhaya</p>
                <ul className="space-y-2">
                  {['Kitchen renovations', 'Bathroom renovations', 'House extensions', 'Ceiling installation', 'Drywall partitioning', 'Painting', 'Tiling', 'Flooring', 'Roofing repairs', 'Plastering'].map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37] shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Residential Construction */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-extrabold text-lg text-gray-900 mb-1">Residential Construction</h3>
                <p className="text-xs text-[#d4af37] font-medium mb-3">Ukwakhiwa Kwezindlu</p>
                <ul className="space-y-2">
                  {['New house construction', 'Foundations', 'Bricklaying', 'Concrete works', 'Boundary walls', 'Garages', 'Carports'].map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37] shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* General Building */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-extrabold text-lg text-gray-900 mb-1">General Building Services</h3>
                <p className="text-xs text-[#d4af37] font-medium mb-3">Izinkonzo Zokwakha</p>
                <ul className="space-y-2">
                  {['Paving', 'Boundary fencing', 'Property maintenance', 'Waterproofing', 'Minor commercial renovations'].map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37] shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── PROJECTS GALLERY (using real images) ─── */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] mb-4 text-xs">Our Work</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Completed <span className="text-[#d4af37]">Projects</span></h2>
            <p className="text-gray-500 text-sm mt-2">Senza amaphupho akhaya abe yiqiniso!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p: any) => (
              <div key={p.id} className="group rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img src={p.imageUrl || p.img || '/api/files/ChatGPT_Image_Aug_3__2026__06_15_36_AM.png'}
                    alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.style && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#d4af37] text-black text-[10px] font-bold">{p.style}</Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold text-lg text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.description || p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Full-width showcase */}
          <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
            <img src="/api/files/ChatGPT_Image_Aug_3__2026__06_23_16_AM.png"
              alt="Fukulisane Construction Projects" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* ─── PROCESS (7 steps from company profile) ─── */}
      <section id="process" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] mb-4 text-xs">Our Process</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">How We <span className="text-[#d4af37]">Work</span></h2>
            <p className="text-gray-500 text-sm mt-2">7 steps from consultation to your dream home</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.slice(0, 4).map(step => (
              <div key={step.num} className="relative p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-3">
                  <step.icon className="h-5 w-5 text-[#d4af37]" />
                </div>
                <p className="text-[10px] text-[#d4af37] font-bold mb-1">STEP {step.num}</p>
                <h3 className="font-bold text-sm text-gray-900">{step.title}</h3>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            {PROCESS_STEPS.slice(4).map(step => (
              <div key={step.num} className="relative p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-3">
                  <step.icon className="h-5 w-5 text-[#d4af37]" />
                </div>
                <p className="text-[10px] text-[#d4af37] font-bold mb-1">STEP {step.num}</p>
                <h3 className="font-bold text-sm text-gray-900">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] mb-4 text-xs">Client Reviews</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">What Our <span className="text-[#d4af37]">Clients Say</span></h2>
            <p className="text-gray-500 text-sm mt-2">We proudly serve: Homeowners, Property Investors, Developers, Schools, Churches, and Community Organisations</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t: any) => (
              <Card key={t.id} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-sm font-bold text-[#d4af37]">
                      {t.clientName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.clientName}</p>
                      <p className="text-[10px] text-gray-500">{t.projectName || t.project}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMISE ─── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our <span className="text-[#d4af37]">Promise</span></h2>
          <p className="text-gray-600 mb-8">At Fukulisane Construction (Pty) Ltd, we believe that every successful project is built on trust, communication, and quality workmanship.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Deliver quality work', 'Complete projects on time', 'Maintain transparent communication', 'Provide competitive pricing', 'Exceed client expectations', 'Build long-term relationships'].map(item => (
              <div key={item} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-[#d4af37] shrink-0" />
                <p className="text-sm font-medium text-gray-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-16 px-4 bg-[#1a2744]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Senza Amaphupho Akhaya Abe YiQiniso!</h2>
          <p className="text-gray-300 text-sm mb-2">Let's build your dream together!</p>
          <p className="text-gray-400 text-xs mb-8">Get a free consultation and quote. No obligation, no hidden fees.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={wa('Hi Fukulisane, I\'d like a quote please.')}
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition">
              <MessageCircle className="h-4 w-4" /> WhatsApp Now
            </a>
            <a href={`tel:${business?.phone || '0817746377'}`}
              className="px-6 py-3 rounded-xl bg-white text-gray-900 text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition">
              <Phone className="h-4 w-4" /> Call {business?.phone || '081 774 6377'}
            </a>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] mb-4 text-xs">Xhumana Nathi</Badge>
              <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Contact <span className="text-[#d4af37]">Us</span></h2>
              <div className="space-y-4">
                <a href={`tel:${business?.phone || '0817746377'}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#d4af37]/50 transition">
                  <div className="h-10 w-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center"><Phone className="h-5 w-5 text-[#d4af37]" /></div>
                  <div><p className="text-xs text-gray-500">Call Us</p><p className="font-bold text-sm text-gray-900">{business?.phone || '081 774 6377'}</p></div>
                </a>
                <a href={wa('Hi, I need a quote.')} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-green-500/50 transition">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center"><MessageCircle className="h-5 w-5 text-green-600" /></div>
                  <div><p className="text-xs text-gray-500">WhatsApp</p><p className="font-bold text-sm text-gray-900">Chat With Us</p></div>
                </a>
                <a href={`mailto:${business?.email || 'fukulisane.construction@gmail.com'}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#d4af37]/50 transition">
                  <div className="h-10 w-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center"><Mail className="h-5 w-5 text-[#d4af37]" /></div>
                  <div><p className="text-xs text-gray-500">Email</p><p className="font-bold text-sm text-gray-900">{business?.email || 'fukulisane.construction@gmail.com'}</p></div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="h-10 w-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-[#d4af37]" /></div>
                  <div><p className="text-xs text-gray-500">Location</p><p className="font-bold text-sm text-gray-900">{business?.address || 'C260 Mbomu Road, Ezimbokodweni, Malagazi 4126'}</p></div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="h-10 w-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center"><Clock className="h-5 w-5 text-[#d4af37]" /></div>
                  <div><p className="text-xs text-gray-500">Hours</p><p className="font-bold text-sm text-gray-900">Mon–Fri: 7AM–5PM | Sat: 8AM–2PM</p></div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <a href="https://www.instagram.com/fukulisaneconstruction/" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#d4af37] transition text-xs flex items-center gap-1">
                  📷 @fukulisaneconstruction
                </a>
                <a href="https://www.facebook.com/FukulisaneConstruction" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#d4af37] transition text-xs flex items-center gap-1">
                  📘 Fukulisane Construction
                </a>
              </div>
            </div>

            {/* Quote form */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <h3 className="font-extrabold text-lg text-gray-900 mb-4">📋 Request a Quote</h3>
              <p className="text-xs text-gray-500 mb-4">Sithembele I-email. Siqedwa ngesikhathi. Xhumana nathi namhlanje!</p>
              <div className="space-y-3">
                <div><Label className="text-xs text-gray-500">Your Name *</Label>
                  <Input value={quoteForm.clientName} onChange={e => setQuoteForm({ ...quoteForm, clientName: e.target.value })}
                    className="bg-white border-gray-200 mt-1" placeholder="Your full name" /></div>
                <div><Label className="text-xs text-gray-500">Phone *</Label>
                  <Input value={quoteForm.clientPhone} onChange={e => setQuoteForm({ ...quoteForm, clientPhone: e.target.value })}
                    className="bg-white border-gray-200 mt-1" placeholder="081..." /></div>
                <div><Label className="text-xs text-gray-500">Service Needed</Label>
                  <select value={quoteForm.serviceType} onChange={e => setQuoteForm({ ...quoteForm, serviceType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900">
                    <option value="">Select a service...</option>
                    {SERVICES_FULL.map(s => <option key={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div><Label className="text-xs text-gray-500">Project Details</Label>
                  <Textarea value={quoteForm.projectDesc} onChange={e => setQuoteForm({ ...quoteForm, projectDesc: e.target.value })}
                    className="bg-white border-gray-200 mt-1" placeholder="Tell us about your project..." rows={3} /></div>
                <div><Label className="text-xs text-gray-500">Estimated Budget</Label>
                  <Input value={quoteForm.budget} onChange={e => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                    className="bg-white border-gray-200 mt-1" placeholder="e.g. R50,000 – R100,000" /></div>
                <Button onClick={submitQuote} className="w-full bg-[#d4af37] text-black hover:bg-[#c9a433] font-bold">
                  {quoteSubmitted ? '✓ Quote Sent!' : 'Send Quote Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-4 bg-[#1a2744] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center">
                  <Hammer className="h-5 w-5 text-black" />
                </div>
                <div><p className="font-extrabold text-sm">FUKULISANE</p><p className="text-[9px] text-[#d4af37]">CONSTRUCTION</p></div>
              </div>
              <p className="text-xs text-gray-400 italic">"Building Today, Creating Tomorrow."</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Our Services</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>Residential Construction</li><li>Home Renovations</li><li>Roofing</li><li>Painting & Tiling</li><li>Paving & Concrete</li><li>Boundary Walls</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Contact</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>📞 {business?.phone || '081 774 6377'}</li>
                <li>✉️ {business?.email || 'fukulisane.construction@gmail.com'}</li>
                <li>📍 Ezimbokodweni, Malagazi 4126</li>
                <li>📷 @fukulisaneconstruction</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">We Serve</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>Homeowners</li><li>Property Investors</li><li>Residential Developers</li><li>Small Businesses</li><li>Schools & Churches</li><li>Community Organisations</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
            <p>© {new Date().getFullYear()} Fukulisane Construction (Pty) Ltd. All rights reserved.</p>
            <p className="italic">Sakha Namuhla, Sidala Ikusasa.</p>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING WHATSAPP ─── */}
      <a href={wa('Hi Fukulisane, I\'m interested in your services.')}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg hover:bg-green-700 transition hover:scale-110">
        <MessageCircle className="h-7 w-7 text-white" />
      </a>

      {/* ─── QUOTE DIALOG ─── */}
      {quoteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setQuoteOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 max-h-[90vh] overflow-auto shadow-2xl">
            {quoteSubmitted ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-extrabold text-xl mb-2 text-gray-900">Quote Request Sent!</h3>
                <p className="text-sm text-gray-500">We'll contact you within 24 hours. Asenzi ngokukhawuleza!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-lg text-gray-900">📋 Request a Quote</h3>
                  <button onClick={() => setQuoteOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-3">
                  <div><Label className="text-xs text-gray-500">Full Name *</Label><Input value={quoteForm.clientName} onChange={e => setQuoteForm({ ...quoteForm, clientName: e.target.value })} className="bg-gray-50 border-gray-200 mt-1" placeholder="Your full name" /></div>
                  <div><Label className="text-xs text-gray-500">Phone Number *</Label><Input value={quoteForm.clientPhone} onChange={e => setQuoteForm({ ...quoteForm, clientPhone: e.target.value })} className="bg-gray-50 border-gray-200 mt-1" placeholder="081 000 0000" /></div>
                  <div><Label className="text-xs text-gray-500">Email (optional)</Label><Input value={quoteForm.clientEmail} onChange={e => setQuoteForm({ ...quoteForm, clientEmail: e.target.value })} className="bg-gray-50 border-gray-200 mt-1" placeholder="you@email.com" /></div>
                  <div><Label className="text-xs text-gray-500">Service Needed</Label>
                    <select value={quoteForm.serviceType} onChange={e => setQuoteForm({ ...quoteForm, serviceType: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900">
                      <option value="">Select...</option>
                      {SERVICES_FULL.map(s => <option key={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div><Label className="text-xs text-gray-500">Project Description</Label><Textarea value={quoteForm.projectDesc} onChange={e => setQuoteForm({ ...quoteForm, projectDesc: e.target.value })} className="bg-gray-50 border-gray-200 mt-1" placeholder="Tell us about your project..." rows={3} /></div>
                  <div><Label className="text-xs text-gray-500">Budget (optional)</Label><Input value={quoteForm.budget} onChange={e => setQuoteForm({ ...quoteForm, budget: e.target.value })} className="bg-gray-50 border-gray-200 mt-1" placeholder="e.g. R50,000 – R100,000" /></div>
                  <Button onClick={submitQuote} className="w-full bg-[#d4af37] text-black hover:bg-[#c9a433] font-bold mt-2">Submit Quote Request</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

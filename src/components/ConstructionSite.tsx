import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Store, Phone, Mail, MapPin, MessageCircle, Shield, Star,
  Users, CheckCircle2, Clock, Hammer, Home, HardHat, PaintBucket,
  ChevronDown, ChevronUp, ArrowRight, Quote, Award, Eye,
  Heart, Handshake, Wrench, Building, Droplets, Pencil
} from 'lucide-react'

interface Props { slug: string }

export default function ConstructionSite({ slug }: Props) {
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [inquiry, setInquiry] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [inquirySent, setInquirySent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch(`/api/store/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setBusiness(d); setLoading(false) })
      .catch(() => { setError('Store not found'); setLoading(false) })
  }, [slug])

  const sendInquiry = async () => {
    if (!inquiry.message || !inquiry.name) return
    setSending(true)
    try {
      await fetch(`/api/businesses/${business.id}/inquiries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiry, source: 'website' }),
      })
      setInquirySent(true)
    } catch {} finally { setSending(false) }
  }

  const orderViaWhatsApp = (service?: string) => {
    if (!business?.whatsapp) return
    const phone = business.whatsapp.replace(/[^0-9]/g, '')
    let msg = `Molo! Ngingu-${inquiry.name || 'Ikhasimende'}.\n\n`
    if (service) msg += `Ngifuna ukubonisana nge: *${service}*\n\n`
    else msg += `Ngifuna ukubonisana ngephrojekthi yokwakha.\n\n`
    if (inquiry.message) msg += `${inquiry.message}\n\n`
    msg += `Ngiyabonga! 🙏`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  )

  if (error || !business) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Ikhava Elilahlekile</h2>
        <p className="text-gray-500 mb-4">Leli khasi alikho noma selilishiwo.</p>
        <a href="?mall=true" className="text-blue-600 hover:underline font-medium">← Buyela ekhasini</a>
      </div>
    </div>
  )

  const primary = business.primaryColor || '#1a56db'
  const whatsapp = business.whatsapp?.replace(/[^0-9]/g, '')
  const services = business.products?.filter((p: any) => p.isAvailable) || []

  const processSteps = [
    { icon: Quote, title: 'Ukubonisana', desc: 'Sihlangana nekhasimende ukuze siqonde izidingo zalo.' },
    { icon: Eye, title: 'Ukuhlolwa Kwendawo', desc: 'Sihlola indawo ngokuningiliziwe.' },
    { icon: CheckCircle2, title: 'Isilinganiso Sentengo', desc: 'Silungisa i-quotation ecacisa umsebenzi, izinto ezidingekayo kanye nesikhathi.' },
    { icon: Building, title: 'Ukuhlela', desc: 'Sihlela umsebenzi, sithenge izinto futhi silungiselele ukuqala.' },
    { icon: Hammer, title: 'Ukwakhiwa', desc: 'Ithimba lethu liqala umsebenzi ngokulandela amapulani nezindinganiso zokwakha.' },
    { icon: Shield, title: 'Ukuhlolwa Kwekhwalithi', desc: 'Sihlola umsebenzi njalo ukuqinisekisa ikhwalithi.' },
    { icon: Home, title: 'Ukudluliselwa Komsebenzi', desc: 'Umsebenzi unikezwa ikhasimende ngemva kokuhlolwa kokugcina.' },
  ]

  const values = [
    { icon: Heart, name: 'Ubuqotho' },
    { icon: Star, name: 'Ikhwalithi' },
    { icon: Award, name: 'Ubungcweti' },
    { icon: Users, name: 'Ukwaneliseka Kwekhasimende' },
    { icon: Shield, name: 'Ukuphepha Kuqala' },
    { icon: CheckCircle2, name: 'Ukwethembeka' },
    { icon: Handshake, name: 'Ukwazibophezela' },
    { icon: Eye, name: 'Ukuqamba Okusha' },
    { icon: Users, name: 'Ukusebenzisana' },
  ]

  const clientTypes = [
    'Abanikazi bezindlu', 'Abatshalizimali bezakhiwo', 'Abathuthukisi bezindlu',
    'Abaphathi bezindawo zokuhlala', 'Amabhizinisi amancane', 'Izikole',
    'Amasonto', 'Izinhlangano zomphakathi',
  ]

  const whyChooseUs = [
    'Umsebenzi osezingeni', 'Amanani ancintisanayo', 'Ukuphathwa kahle kwamaphrojekthi',
    'Ithimba elinolwazi', 'Izinto zokwakha ezisezingeni', 'Ukuqeda umsebenzi ngesikhathi',
    'Izilinganiso ezicacile', 'Inkonzo egxile kumakhasimende', 'Ukuphepha emsebenzini',
    'Ukunaka yonke imininingwane',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ━━━━━━ HERO ━━━━━━ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img src="https://images.pexels.com/photos/38706740/pexels-photo-38706740/free-photo-of-construction-workers-at-busy-building-site.jpeg"
          alt="Construction site" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${primary}e0 0%, ${primary}aa 50%, ${primary}80 100%)`
        }} />

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-white">
          <Badge className="bg-white/20 text-white border-white/30 mb-6 text-sm px-4 py-1">
            Iphrofayela Yenkampuni
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            FUKULISANE<br />CONSTRUCTION
          </h1>
          <p className="text-xl md:text-2xl font-bold text-white/90 mb-2">(Pty) Ltd</p>
          <p className="text-base md:text-lg text-white/70 mb-2">
            Ukwakhiwa Kwezindlu • Ukulungiswa Kwezindlu • Imisebenzi Yokwakha
          </p>
          <p className="text-lg md:text-xl italic text-white/80 mb-8 max-w-xl">
            "{business.tagline}"
          </p>
          <div className="flex flex-wrap gap-3">
            {whatsapp && (
              <button onClick={() => orderViaWhatsApp()}
                className="px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-bold flex items-center gap-2 hover:opacity-90 transition text-base">
                <MessageCircle className="h-5 w-5" /> Xhumana Nathi ngeWhatsApp
              </button>
            )}
            <a href={`tel:${business.phone}`}
              className="px-6 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm text-white font-bold flex items-center gap-2 hover:bg-white/25 transition text-base border border-white/20">
              <Phone className="h-5 w-5" /> {business.phone}
            </a>
          </div>
        </div>
        <a href="?mall=true"
          className="absolute top-6 left-6 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 backdrop-blur-sm transition border border-white/20">
          ← Mall
        </a>
      </section>

      {/* ━━━━━━ ABOUT ━━━━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Mayelana Ngathi</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: primary }}>Singobani</h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  I-Fukulisane Construction (Pty) Ltd iyinkampani yaseNingizimu Afrika egxile ekwakheni izindlu,
                  ukulungisa izindlu, kanye nokuhlinzeka ngemisebenzi yokwakha esezingeni eliphezulu.
                </p>
                <p>
                  Sihlanganisa ubungcweti bokwakha, ukuphathwa kwamaphrojekthi ngendlela efanele kanye nenkonzo
                  enhle kumakhasimende ukuze silethe umsebenzi osezingeni, ophephile futhi ohlangabezana nezidingo zamakhasimende ethu.
                </p>
                <p>
                  Kungakhathaliseki ukuthi ufuna ukwakha ikhaya elisha, ukulungisa elikhona noma ukwandisa impahla yakho,
                  sisebenzisana nawe kusukela ekuhleleni kuze kuphele umsebenzi ukuze siqinisekise ukuthi iphrojekthi yakho
                  iqedwa ngesikhathi, ngaphakathi kwesabelomali futhi ngendlela efanele.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.pexels.com/photos/28852853/pexels-photo-28852853.jpeg"
                alt="Construction workers" className="rounded-2xl shadow-xl w-full h-80 object-cover" />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
                <p className="text-2xl font-extrabold" style={{ color: primary }}>15+</p>
                <p className="text-xs text-gray-500">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━ VISION & MISSION ━━━━━━ */}
      <section className="py-16 md:py-20" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${primary}15` }}>
                  <Eye className="h-6 w-6" style={{ color: primary }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Umbono</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ukuba enye yezinkampani zokwakha ezihlonishwayo nezithembekile eNingizimu Afrika
                  ngokuletha umsebenzi osezingeni eliphezulu njalo.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${primary}15` }}>
                  <Star className="h-6 w-6" style={{ color: primary }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Umgomo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ukuhlinzeka ngezixazululo zokwakha ezisezingeni, ezingabizi futhi ezintsha
                  ezandisa inani, ukunethezeka kanye nokusebenza kahle kwezindlu zamakhasimende ethu.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ━━━━━━ VALUES ━━━━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Amagugu Ethu</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: primary }}>Yini Esiyikholelwa</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {values.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                <div className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primary}15` }}>
                  <v.icon className="h-5 w-5" style={{ color: primary }} />
                </div>
                <p className="text-xs font-semibold text-center">{v.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ SERVICES ━━━━━━ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Izinsiza Zethu</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: primary }}>Imisebenzi Yethu</h2>
          </div>

          {/* Main Services */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition overflow-hidden">
              <img src="https://images.pexels.com/photos/33595992/pexels-photo-33595992/free-photo-of-construction-workers-laying-foundation-bricks-outdoors.jpeg"
                alt="Ukwakhiwa Kwezindlu" className="w-full h-44 object-cover" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Ukwakhiwa Kwezindlu</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ukwakhiwa kwezindlu ezintsha</li>
                  <li>• Izisekelo (Foundations)</li>
                  <li>• Ukubeka izitini</li>
                  <li>• Imisebenzi kakhonkolo</li>
                  <li>• Izindonga ezibiyayo</li>
                  <li>• AmaGaraji</li>
                  <li>• AmaCarport</li>
                  <li>• Ukulungisa noma ukwandisa isakhiwo</li>
                </ul>
                <button onClick={() => orderViaWhatsApp('Ukwakhiwa Kwezindlu')}
                  className="mt-4 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: primary }}>
                  Bona ukubonisana <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition overflow-hidden">
              <img src="https://images.pexels.com/photos/37627682/pexels-photo-37627682.jpeg?cs=srgb&dl=pexels-d-goug-211350543-37627682.jpg&fm=jpg"
                alt="Ukulungiswa Kwezindlu" className="w-full h-44 object-cover" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Ukulungiswa Kwezindlu</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ukulungisa amakhishi</li>
                  <li>• Ukulungisa amagumbi okugeza</li>
                  <li>• Ukwandisa izindlu</li>
                  <li>• Ukufakwa kwamaCeiling</li>
                  <li>• AmaDrywall Partition</li>
                  <li>• Ukulungisa uphahla</li>
                  <li>• Ukupenda</li>
                  <li>• Ukufaka amathayela / amaFloor</li>
                  <li>• Ukupulasta</li>
                </ul>
                <button onClick={() => orderViaWhatsApp('Ukulungiswa Kwezindlu')}
                  className="mt-4 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: primary }}>
                  Bona ukubonisana <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition overflow-hidden">
              <img src="https://images.pexels.com/photos/30661413/pexels-photo-30661413/free-photo-of-construction-workers-on-scaffolding-in-nairobi.jpeg"
                alt="Eminye Imisebenzi Yokwakha" className="w-full h-44 object-cover" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Eminye Imisebenzi Yokwakha</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ukufakwa kwamaphaving</li>
                  <li>• AmaDriveway</li>
                  <li>• Izicingo nezindonga</li>
                  <li>• Ukuvikela ukuvuza kwamanzi</li>
                  <li>• Ukunakekelwa kwezakhiwo</li>
                  <li>• Ukulungisa izakhiwo zamabhizinisi</li>
                </ul>
                <button onClick={() => orderViaWhatsApp('Eminye Imisebenzi Yokwakha')}
                  className="mt-4 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: primary }}>
                  Bona ukubonisana <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ━━━━━━ PROMOTIONS GALLERY ━━━━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Izikhangiso Zethu</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: primary }}>Amaphromoshini Namaprofayela</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.filter((p: any) => p.imageUrl).map((product: any) => (
              <div key={product.id} className="group cursor-pointer" onClick={() => window.open(product.imageUrl, '_blank')}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                  <img src={product.imageUrl} alt={product.name}
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">{product.name}</h3>
                    <p className="text-white/80 text-xs line-clamp-2">{product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ WHY CHOOSE US ━━━━━━ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <Badge variant="outline" className="mb-4">Kungani Ukhetha Thina</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: primary }}>
            Kungani Ukhetha iFukulisane Construction?
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Ukukhetha usonkontileka ofanele kuyisinyathelo esibalulekile empumelelweni yanoma iyiphi iphrojekthi yokwakha.
            Sizibophezele ekuletheni umsebenzi osezingeni eliphezulu ngobuqotho, ngobungcweti nangokuxhumana okuhle kusukela ekuqaleni kuze kuphele umsebenzi.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: primary }} />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ PROCESS ━━━━━━ */}
      <section className="py-16 md:py-20" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Indlela Esisebenza Ngayo</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: primary }}>Izinyathelo Zethu</h2>
          </div>
          <div className="space-y-4">
            {processSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm">
                <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                  style={{ backgroundColor: primary }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
                <step.icon className="h-5 w-5 text-gray-300 mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ SAFETY & QUALITY ━━━━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img src="https://images.pexels.com/photos/19982408/pexels-photo-19982408/free-photo-of-worker-at-construction-site.jpeg"
                  alt="Safety and Quality" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50" />
              </div>
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${primary}15` }}>
                    <Shield className="h-6 w-6" style={{ color: primary }} />
                  </div>
                  <h2 className="text-2xl font-extrabold" style={{ color: primary }}>Ezempilo, Ukuphepha NeKhwalithi</h2>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Ukuphepha nekhwalithi kuyisisekelo sayo yonke imisebenzi yethu.
                  Sizibophezele ekugcineni indawo yokusebenza iphephile kanye nokuletha umsebenzi osezingeni eliphezulu.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Ukulandela yonke imithetho yezempilo nokuphepha',
                    'Ukusebenzisa izinto zokwakha ezisezingeni',
                    'Abasebenzi abanamakhono',
                    'Ukuhlolwa kwekhwalithi njalo',
                    'Izindawo zokusebenza ezihlanzekile',
                    'Ukunakekela imvelo',
                    'Ukwanelisa amakhasimende',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-white rounded-lg">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: primary }} />
                      <span className="text-xs font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━ CLIENTS ━━━━━━ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">Amakhasimende Ethu</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: primary }}>Sisebenzela Bonke</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {clientTypes.map((client, i) => (
              <div key={i} className="p-4 bg-white rounded-xl text-center">
                <Users className="h-6 w-6 mx-auto mb-2" style={{ color: primary }} />
                <p className="text-sm font-medium">{client}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Kungakhathaliseki ukuthi umsebenzi mncane noma mkhulu, wonke amakhasimende ethu athola isevisi efanayo yobungcweti nekhwalithi.
          </p>
        </div>
      </section>

      {/* ━━━━━━ PROMISE ━━━━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge variant="outline" className="mb-4">Isithembiso Sethu</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: primary }}>Siyakuthembisa</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Star, text: 'Umsebenzi osezingeni eliphezulu' },
              { icon: Clock, text: 'Ukuqeda umsebenzi ngesikhathi' },
              { icon: Users, text: 'Ukuxhumana ngokusobala' },
              { icon: CheckCircle2, text: 'Amanani afanele' },
              { icon: Award, text: 'Ukwedlula okulindelwe amakhasimende' },
              { icon: Handshake, text: 'Ukwakha ubudlelwano besikhathi eside' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <item.icon className="h-5 w-5 shrink-0" style={{ color: primary }} />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 italic max-w-2xl mx-auto">
            Umbono wakho uyinto eza kuqala kithi, futhi sizimisele ukuwuguqula ube yisakhiwo esiqinile nesihlala isikhathi eside.
          </p>
        </div>
      </section>

      {/* ━━━━━━ CONTACT ━━━━━━ */}
      <section className="py-16 md:py-20" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Xhumana Nathi</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: primary }}>Khuluma Nathi</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">FUKULISANE CONSTRUCTION (PTY) LTD</h3>
              <p className="text-sm text-gray-500">Ukwakhiwa Kwezindlu • Ukulungiswa Kwezindlu • Imisebenzi Yokwakha</p>

              <div className="space-y-4">
                <a href={`tel:${business.phone}`} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition">
                  <Phone className="h-5 w-5" style={{ color: primary }} />
                  <div>
                    <p className="text-xs text-gray-500">Ucingo</p>
                    <p className="font-semibold">{business.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${business.email}`} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition">
                  <Mail className="h-5 w-5" style={{ color: primary }} />
                  <div>
                    <p className="text-xs text-gray-500">I-imeyili</p>
                    <p className="font-semibold">{business.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                  <MapPin className="h-5 w-5 shrink-0" style={{ color: primary }} />
                  <div>
                    <p className="text-xs text-gray-500">Ikheli</p>
                    <p className="font-semibold text-sm">{business.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:opacity-90 transition">
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Inquiry Form */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                {inquirySent ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4" style={{ color: primary }} />
                    <h3 className="text-xl font-bold mb-2">Siyabonga!</h3>
                    <p className="text-gray-500">Sizokuxhumana nawe maduze.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Thumela Iburhafu</h3>
                    <div>
                      <Label className="text-xs">Igama *</Label>
                      <Input value={inquiry.name} onChange={e => setInquiry({ ...inquiry, name: e.target.value })}
                        placeholder="Igama lakho" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Ucingo</Label>
                        <Input value={inquiry.phone} onChange={e => setInquiry({ ...inquiry, phone: e.target.value })}
                          placeholder="081..." className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">I-imeyili</Label>
                        <Input value={inquiry.email} onChange={e => setInquiry({ ...inquiry, email: e.target.value })}
                          placeholder="email@..." className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Uhlobo Lomsebenzi</Label>
                      <select value={inquiry.service} onChange={e => setInquiry({ ...inquiry, service: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-white text-sm">
                        <option value="">Khetha...</option>
                        <option>Ukwakhiwa Kwezindlu</option>
                        <option>Ukulungiswa Kwezindlu</option>
                        <option>Eminye Imisebenzi Yokwakha</option>
                        <option>Isilinganiso Sentengo</option>
                        <option>Okunye</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Umlayezo *</Label>
                      <Textarea value={inquiry.message} onChange={e => setInquiry({ ...inquiry, message: e.target.value })}
                        placeholder="Chaza iphrojekthi yakho..." rows={3} className="mt-1" />
                    </div>
                    <Button onClick={sendInquiry} disabled={!inquiry.name || !inquiry.message || sending}
                      className="w-full" style={{ backgroundColor: primary }}>
                      {sending ? 'Iythumela...' : 'Thumela Iburhafu'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ━━━━━━ FOOTER ━━━━━━ */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-xl font-extrabold mb-1">FUKULISANE CONSTRUCTION</h3>
          <p className="text-gray-400 text-sm mb-4">(Pty) Ltd</p>
          <p className="text-white/80 italic text-lg mb-6">"{business.tagline}"</p>
          <div className="flex justify-center gap-4 mb-6">
            <a href={`tel:${business.phone}`} className="text-gray-400 hover:text-white transition">
              <Phone className="h-5 w-5" />
            </a>
            <a href={`mailto:${business.email}`} className="text-gray-400 hover:text-white transition">
              <Mail className="h-5 w-5" />
            </a>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition">
                <MessageCircle className="h-5 w-5" />
              </a>
            )}
          </div>
          <p className="text-xs text-gray-500">© 2026 Fukulisane Construction (Pty) Ltd. All rights reserved.</p>
        </div>
      </footer>

      {/* ━━━━━━ FLOATING WHATSAPP ━━━━━━ */}
      {whatsapp && (
        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Molo! Ngifuna ukubonisana ngephrojekthi yokwakha.')}`}
          target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition"
          style={{ backgroundColor: '#25D366' }}>
          <MessageCircle className="h-7 w-7 text-white" />
        </a>
      )}
    </div>
  )
}

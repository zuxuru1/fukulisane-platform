import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ChevronRight, ChevronLeft, ExternalLink, CheckCircle2, Circle,
  Globe, ArrowUpRight, Sparkles, Rocket, Link2, Copy, Building2,
  Phone, Mail, MapPin, Star, Zap, Target
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

const STORAGE_KEY = 'platform_wizard_status'

type PlatformStatus = 'not_started' | 'connected'

interface PlatformStep {
  id: string
  icon: string
  title: string
  subtitle: string
  url: string
  urlLabel: string
  tips: string[]
  whatToFill: string[]
  color: string
}

const PLATFORMS: PlatformStep[] = [
  {
    id: 'branding',
    icon: '🎨',
    title: 'Brand Identity',
    subtitle: 'Set your brand name, colors, and logo before connecting platforms',
    url: '',
    urlLabel: '',
    tips: [
      'Use the same logo and colors everywhere',
      'Your brand name should match across all platforms',
      'Pick a primary color and stick with it',
    ],
    whatToFill: ['Brand name', 'Primary color', 'Logo image', 'Phone number', 'Email address', 'Physical address'],
    color: '#7c3aed',
  },
  {
    id: 'google-business',
    icon: '📍',
    title: 'Google Business Profile',
    subtitle: 'Get found on Google Search and Maps — most important platform',
    url: 'https://business.google.com/',
    urlLabel: 'Open Google Business Profile',
    tips: [
      'Use your exact business name — no keyword stuffing',
      'Add your real physical address for Maps listing',
      'Upload at least 10 photos of your work',
      'Select the right categories: "Construction Company", "Home Builder"',
    ],
    whatToFill: ['Business name', 'Address', 'Phone', 'Business hours', 'Category', 'Description', 'Photos'],
    color: '#4285f4',
  },
  {
    id: 'whatsapp-business',
    icon: '💬',
    title: 'WhatsApp Business',
    subtitle: 'Direct chat with customers — set auto-replies and catalog',
    url: 'https://www.whatsapp.com/business/',
    urlLabel: 'Download WhatsApp Business',
    tips: [
      'Use your business phone number (081 774 6377)',
      'Set up quick replies for common questions',
      'Create a catalog with your services',
      'Set a professional business profile with hours',
    ],
    whatToFill: ['Business name', 'Description', 'Business hours', 'Catalog items', 'Quick replies'],
    color: '#25d366',
  },
  {
    id: 'facebook-page',
    icon: '📘',
    title: 'Facebook Business Page',
    subtitle: 'Reach thousands of local customers with posts and ads',
    url: 'https://www.facebook.com/pages/create/',
    urlLabel: 'Create Facebook Page',
    tips: [
      'Choose "Construction Company" as your page category',
      'Complete the "About" section fully',
      'Add a call-to-action button: "Send Message" or "Call Now"',
      'Post at least 3 times per week',
    ],
    whatToFill: ['Page name', 'Category', 'Description', 'Contact info', 'Cover photo', 'Profile picture'],
    color: '#1877f2',
  },
  {
    id: 'instagram',
    icon: '📸',
    title: 'Instagram Business',
    subtitle: 'Showcase your best work with photos and reels',
    url: 'https://www.instagram.com/',
    urlLabel: 'Set Up Instagram',
    tips: [
      'Switch to a Professional/Business account for insights',
      'Use hashtags like #ConstructionKZN #BuildersSA #HomeBuild',
      'Post before/after photos — they get the most engagement',
      'Use Reels for 3x more reach than static posts',
    ],
    whatToFill: ['Username', 'Bio', 'Profile photo', 'Contact buttons', 'Highlights'],
    color: '#e4405f',
  },
  {
    id: 'tiktok',
    icon: '🎵',
    title: 'TikTok Business',
    subtitle: 'Go viral with construction time-lapse and before/after videos',
    url: 'https://www.tiktok.com/business/',
    urlLabel: 'Open TikTok Business',
    tips: [
      'Post short videos of your builds — time-lapses work great',
      'Use trending sounds to boost views',
      'Show the transformation: demolition → finished project',
      'Behind-the-scenes content performs well',
    ],
    whatToFill: ['Username', 'Bio', 'Profile photo', 'Business category'],
    color: '#010101',
  },
  {
    id: 'youtube',
    icon: '🎬',
    title: 'YouTube Channel',
    subtitle: 'Long-form project walkthroughs and tutorials',
    url: 'https://www.youtube.com/create_channel',
    urlLabel: 'Create YouTube Channel',
    tips: [
      'Film full project walkthroughs (5-15 minutes)',
      'Create tutorials: "How to build a boundary wall"',
      'Add your contact info in every video description',
      'Use SEO titles like "House Build in KwaZulu-Natal"',
    ],
    whatToFill: ['Channel name', 'Description', 'Profile picture', 'Banner image', 'Contact info'],
    color: '#ff0000',
  },
  {
    id: 'linkedin',
    icon: '💼',
    title: 'LinkedIn Company Page',
    subtitle: 'Professional networking and B2B connections',
    url: 'https://www.linkedin.com/company/setup/new/',
    urlLabel: 'Create LinkedIn Page',
    tips: [
      'Great for attracting commercial/industrial projects',
      'Post project case studies and milestones',
      'Connect with architects, quantity surveyors, and suppliers',
      'Share industry news and your expert opinions',
    ],
    whatToFill: ['Company name', 'Industry', 'Description', 'Logo', 'Cover image', 'Website'],
    color: '#0a66c2',
  },
  {
    id: 'wordpress',
    icon: '🌐',
    title: 'Website (WordPress)',
    subtitle: 'Your own website — the hub all other platforms link back to',
    url: 'https://wordpress.com/',
    urlLabel: 'Start WordPress Site',
    tips: [
      'Choose a clean, professional theme',
      'Must-have pages: Home, Services, Projects/Portfolio, Contact',
      'Add a contact form and WhatsApp button',
      'List all your services with descriptions and prices',
    ],
    whatToFill: ['Site title', 'Tagline', 'Home page content', 'Services page', 'Contact page', 'Portfolio images'],
    color: '#21759b',
  },
  {
    id: 'pinterest',
    icon: '📌',
    title: 'Pinterest Business',
    subtitle: 'Share construction inspiration and attract design-minded clients',
    url: 'https://business.pinterest.com/',
    urlLabel: 'Open Pinterest Business',
    tips: [
      'Create boards: "House Designs", "Kitchen Ideas", "Renovations"',
      'Pin your own project photos with keyword-rich descriptions',
      'Link pins back to your website or portfolio',
      'Great for long-term passive traffic to your site',
    ],
    whatToFill: ['Business name', 'Profile photo', 'Boards', 'Pin descriptions'],
    color: '#bd081c',
  },
  {
    id: 'link-hub',
    icon: '🔗',
    title: 'Link Hub (Linktree / Canva)',
    subtitle: 'One link with ALL your platform links — use in social bios',
    url: 'https://www.canva.com/',
    urlLabel: 'Design with Canva',
    tips: [
      'Use this single link in all your social media bios',
      'Include: Website, WhatsApp, Google Reviews, Facebook',
      'Keep it clean — max 8-10 links',
      'Update it whenever you add a new platform',
    ],
    whatToFill: ['All platform URLs collected', 'Link order', 'Design/theme'],
    color: '#00c4cc',
  },
  {
    id: 'google-reviews',
    icon: '⭐',
    title: 'Google Reviews Strategy',
    subtitle: 'Collect reviews to build trust and rank higher on Google',
    url: 'https://g.page/r/CZvrH_lDzSdJEBI/review',
    urlLabel: 'Open Your Review Link',
    tips: [
      'Ask every happy customer to leave a Google review',
      'Share your review link via WhatsApp after project completion',
      'Respond to every review — thank positive, address negative',
      'Aim for at least 2 new reviews per project',
    ],
    whatToFill: ['Review link saved', 'WhatsApp review request template', 'Response templates'],
    color: '#fbbc04',
  },
]

function loadStatus(): Record<string, PlatformStatus> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function saveStatus(status: Record<string, PlatformStatus>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
}

export default function PlatformWizard() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<Record<string, PlatformStatus>>(loadStatus)
  const [brandInfo, setBrandInfo] = useState({ name: '', phone: '', email: '', address: '', color: '#d4a843' })
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => { saveStatus(status) }, [status])

  const connected = Object.values(status).filter(s => s === 'connected').length
  const total = PLATFORMS.length
  const pct = Math.round((connected / total) * 100)
  const current = PLATFORMS[step]

  const toggleConnected = (id: string) => {
    setStatus(prev => ({
      ...prev,
      [id]: prev[id] === 'connected' ? 'not_started' : 'connected',
    }))
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const isBrandComplete = brandInfo.name && brandInfo.phone && brandInfo.email

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Rocket className="h-6 w-6 text-[#d4a843]" /> Platform Setup Wizard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Connect your business to {total} platforms — one step at a time
        </p>
      </div>

      {/* Progress */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              {connected} of {total} platforms connected
            </p>
            <p className="text-sm font-bold text-[#b8941f]">{pct}%</p>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d4a843] to-[#b8941f] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {PLATFORMS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setStep(i)}
                className={`h-7 min-w-[28px] px-1.5 rounded-md text-[10px] font-bold transition border flex items-center gap-1 ${
                  step === i
                    ? 'bg-[#d4a843]/10 border-[#d4a843] text-[#b8941f]'
                    : status[p.id] === 'connected'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                <span>{p.icon}</span>
                {i + 1}
                {status[p.id] === 'connected' && <CheckCircle2 className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      {current && (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main card */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{current.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-gray-900">
                          Step {step + 1}: {current.title}
                        </h2>
                        {status[current.id] === 'connected' && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                            ✓ Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{current.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Direct link button */}
                {current.url && (
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition hover:shadow-md group mb-4"
                    style={{ borderColor: `${current.color}40`, backgroundColor: `${current.color}08` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${current.color}15` }}
                      >
                        <ExternalLink className="h-5 w-5" style={{ color: current.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#b8941f] transition">
                          {current.urlLabel}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[300px]">{current.url}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-[#b8941f] transition" />
                  </a>
                )}

                {/* Tips */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Setup Tips</h3>
                  <div className="space-y-2">
                    {current.tips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <Zap className="h-3.5 w-3.5 text-[#d4a843] mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mark connected */}
                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <button
                    onClick={() => toggleConnected(current.id)}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    {status[current.id] === 'connected' ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {status[current.id] === 'connected' ? 'Connected ✓' : 'Mark as connected'}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {status[current.id] === 'connected'
                          ? 'Click to undo'
                          : 'Click after you\'ve created your account on this platform'}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    disabled={step === 0}
                    onClick={() => setStep(step - 1)}
                    className="border-gray-200 text-gray-600 text-xs"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    disabled={step === PLATFORMS.length - 1}
                    onClick={() => setStep(step + 1)}
                    className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-xs"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* What to fill */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <Target className="h-3.5 w-3.5 inline mr-1" /> What You'll Need
                </h3>
                <div className="space-y-1.5">
                  {current.whatToFill.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#d4a843] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick brand info (for branding step) */}
            {current.id === 'branding' && (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Building2 className="h-3.5 w-3.5 inline mr-1" /> Your Brand Info
                  </h3>
                  <div>
                    <Label className="text-[10px] text-gray-500">Business Name</Label>
                    <Input
                      value={brandInfo.name}
                      onChange={e => setBrandInfo({ ...brandInfo, name: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-xs h-8 mt-1"
                      placeholder="Fukulisane Construction"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-gray-500">Phone</Label>
                    <Input
                      value={brandInfo.phone}
                      onChange={e => setBrandInfo({ ...brandInfo, phone: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-xs h-8 mt-1"
                      placeholder="081 774 6377"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-gray-500">Email</Label>
                    <Input
                      value={brandInfo.email}
                      onChange={e => setBrandInfo({ ...brandInfo, email: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-xs h-8 mt-1"
                      placeholder="fukulisane.construction@gmail.com"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-gray-500">Primary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={brandInfo.color}
                        onChange={e => setBrandInfo({ ...brandInfo, color: e.target.value })}
                        className="h-8 w-8 rounded border border-gray-200 cursor-pointer"
                      />
                      <Input
                        value={brandInfo.color}
                        onChange={e => setBrandInfo({ ...brandInfo, color: e.target.value })}
                        className="bg-gray-50 border-gray-200 text-xs h-8 flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[10px] text-gray-500">Address</Label>
                    <Textarea
                      value={brandInfo.address}
                      onChange={e => setBrandInfo({ ...brandInfo, address: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-xs mt-1"
                      rows={2}
                      placeholder="C260 Mbomu Road, Ezimbokodweni, 4126"
                    />
                  </div>
                  {isBrandComplete && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] text-emerald-600 font-medium">
                        ✓ Brand info saved — use these details on every platform
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Copyable info for other steps */}
            {current.id !== 'branding' && isBrandComplete && (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    <Copy className="h-3.5 w-3.5 inline mr-1" /> Quick Copy
                  </h3>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Business Name', value: brandInfo.name },
                      { label: 'Phone', value: brandInfo.phone },
                      { label: 'Email', value: brandInfo.email },
                      { label: 'Address', value: brandInfo.address },
                    ].filter(f => f.value).map(f => (
                      <button
                        key={f.label}
                        onClick={() => copyText(f.value, f.label)}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition text-left"
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] text-gray-400">{f.label}</p>
                          <p className="text-xs text-gray-700 font-medium truncate">{f.value}</p>
                        </div>
                        <span className="text-[10px] text-[#b8941f] shrink-0 ml-2">
                          {copied === f.label ? '✓' : 'Copy'}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completion summary */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <Sparkles className="h-3.5 w-3.5 inline mr-1" /> All Platforms
                </h3>
                <div className="space-y-1">
                  {PLATFORMS.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setStep(i)}
                      className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition ${
                        step === i ? 'bg-[#d4a843]/10' : 'hover:bg-gray-50'
                      }`}
                    >
                      {status[p.id] === 'connected' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                      )}
                      <span className="text-xs text-gray-600 truncate">
                        {p.icon} {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Completion banner */}
      {connected === total && (
        <Card className="bg-gradient-to-r from-emerald-50 to-[#d4a843]/10 border-emerald-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">All Platforms Connected!</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Your business is now present on {total} platforms. Keep posting consistently and
              engaging with customers to grow your online presence.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

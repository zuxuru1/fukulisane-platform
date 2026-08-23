import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Globe, ExternalLink, Phone, MessageCircle, Mail,
  Building2, Users, Hammer, DollarSign, ShoppingCart,
  Megaphone, Search, MapPin, Star, Target, Zap,
  TrendingUp, Eye, MousePointerClick, ArrowUpRight,
  CheckCircle2, Circle, AlertTriangle, Clock,
  Sparkles, Rocket, Link2, Network, Activity,
  FileText, BarChart3, Briefcase, Calendar,
  Settings, Wifi, WifiOff, RefreshCw
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

type Platform = {
  id: string
  icon: string
  name: string
  url: string
  color: string
  category: 'core' | 'social' | 'business' | 'tools'
  status: 'connected' | 'not_connected' | 'pending'
  description: string
}

type Metric = {
  label: string
  value: string | number
  icon: any
  color: string
  change?: string
  trend?: 'up' | 'down' | 'flat'
}

type HealthCheck = {
  name: string
  status: 'healthy' | 'warning' | 'error'
  score: number
  detail: string
}

const PLATFORMS: Platform[] = [
  { id: 'website', icon: '🌐', name: 'Website', url: '/', color: '#059669', category: 'core', status: 'connected', description: 'Fukulisane Construction website' },
  { id: 'google-business', icon: '📍', name: 'Google Business', url: 'https://business.google.com/', color: '#4285f4', category: 'core', status: 'not_connected', description: 'Google Maps & Search listing' },
  { id: 'whatsapp', icon: '💬', name: 'WhatsApp Business', url: 'https://www.whatsapp.com/business/', color: '#25d366', category: 'core', status: 'not_connected', description: 'Direct customer chat & catalog' },
  { id: 'facebook', icon: '📘', name: 'Facebook Page', url: 'https://www.facebook.com/pages/create/', color: '#1877f2', category: 'social', status: 'not_connected', description: 'Business page & community' },
  { id: 'instagram', icon: '📸', name: 'Instagram', url: 'https://www.instagram.com/', color: '#e4405f', category: 'social', status: 'not_connected', description: 'Photo & Reels showcase' },
  { id: 'tiktok', icon: '🎵', name: 'TikTok', url: 'https://www.tiktok.com/business/', color: '#010101', category: 'social', status: 'not_connected', description: 'Construction viral videos' },
  { id: 'youtube', icon: '🎬', name: 'YouTube', url: 'https://www.youtube.com/create_channel', color: '#ff0000', category: 'social', status: 'not_connected', description: 'Project walkthroughs & tutorials' },
  { id: 'linkedin', icon: '💼', name: 'LinkedIn', url: 'https://www.linkedin.com/company/setup/new/', color: '#0a66c2', category: 'business', status: 'not_connected', description: 'Professional B2B networking' },
  { id: 'pinterest', icon: '📌', name: 'Pinterest', url: 'https://business.pinterest.com/', color: '#bd081c', category: 'social', status: 'not_connected', description: 'Design inspiration boards' },
  { id: 'seo', icon: '🔍', name: 'SEO & Listings', url: '#', color: '#d97706', category: 'tools', status: 'not_connected', description: 'Search engine optimization' },
]

const CATEGORIES = [
  { id: 'core', label: 'Core Presence', color: '#059669', description: 'Your essential digital footprint' },
  { id: 'social', label: 'Social Channels', color: '#7c3aed', description: 'Reach and engage audiences' },
  { id: 'business', label: 'Business Network', color: '#2563eb', description: 'Professional connections' },
  { id: 'tools', label: 'Growth Tools', color: '#d4a843', description: 'SEO, analytics & automation' },
]

export default function DigitalEcosystem() {
  const [platformStatus, setPlatformStatus] = useState<Record<string, string>>({})
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [seoRecords, setSeoRecords] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [campRes, listRes, seoRes, invRes, svcRes] = await Promise.allSettled([
          fetch(`/api/marketing-campaigns`).then(r => r.json()),
          fetch(`/api/local-listings`).then(r => r.json()),
          fetch(`/api/seo-records`).then(r => r.json()),
          fetch(`/api/invoices`).then(r => r.json()),
          fetch(`/api/services`).then(r => r.json()),
        ])
        if (campRes.status === 'fulfilled') {
          const d = campRes.value
          setCampaigns(Array.isArray(d) ? d : d?.items ?? [])
        }
        if (listRes.status === 'fulfilled') {
          const d = listRes.value
          setListings(Array.isArray(d) ? d : d?.items ?? [])
        }
        if (seoRes.status === 'fulfilled') {
          const d = seoRes.value
          setSeoRecords(Array.isArray(d) ? d : d?.items ?? [])
        }
        if (invRes.status === 'fulfilled') {
          const d = invRes.value
          setInvoices(Array.isArray(d) ? d : d?.items ?? [])
        }
        if (svcRes.status === 'fulfilled') {
          const d = svcRes.value
          setServices(Array.isArray(d) ? d : d?.items ?? [])
        }
      } catch {}
      setLoading(false)
    }
    loadAll()
  }, [])

  const connectedPlatforms = PLATFORMS.filter(p => p.status === 'connected').length
  const ecosystemScore = Math.round((connectedPlatforms / PLATFORMS.length) * 100)
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length
  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)

  const healthChecks: HealthCheck[] = [
    { name: 'Website', status: 'healthy', score: 100, detail: 'Live and accessible' },
    { name: 'WhatsApp', status: 'not_connected' as any, score: 0, detail: 'Not yet connected' },
    { name: 'Google Business', status: 'not_connected' as any, score: 0, detail: 'Not yet connected' },
    { name: 'Social Media', status: connectedPlatforms >= 3 ? 'healthy' : 'warning', score: Math.min(100, Math.round((connectedPlatforms / 5) * 100)), detail: `${connectedPlatforms} of 5 connected` },
    { name: 'SEO', status: seoRecords.length > 0 ? 'healthy' : 'warning', score: seoRecords.length > 0 ? 80 : 0, detail: seoRecords.length > 0 ? `${seoRecords.length} pages optimized` : 'Generate SEO first' },
    { name: 'Marketing', status: activeCampaigns > 0 ? 'healthy' : 'warning', score: activeCampaigns > 0 ? 90 : 0, detail: activeCampaigns > 0 ? `${activeCampaigns} active campaigns` : 'No active campaigns' },
    { name: 'Revenue', status: totalRevenue > 0 ? 'healthy' : 'warning', score: totalRevenue > 0 ? 85 : 0, detail: totalRevenue > 0 ? `R${totalRevenue.toLocaleString()}` : 'No invoices yet' },
  ]
  const avgHealth = Math.round(healthChecks.reduce((s, h) => s + h.score, 0) / healthChecks.length)

  const ecosystemMetrics: Metric[] = [
    { label: 'Platforms', value: `${connectedPlatforms}/${PLATFORMS.length}`, icon: Link2, color: '#059669', change: ecosystemScore === 100 ? '✓ Complete' : `${PLATFORMS.length - connectedPlatforms} remaining` },
    { label: 'Campaigns', value: campaigns.length, icon: Megaphone, color: '#dc2626', change: activeCampaigns > 0 ? `${activeCampaigns} active` : 'None active', trend: activeCampaigns > 0 ? 'up' : 'flat' },
    { label: 'Listings', value: listings.length, icon: MapPin, color: '#d97706', change: listings.length > 0 ? 'Active' : 'Generate first' },
    { label: 'Revenue', value: `R${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#d4a843', change: `${invoices.length} invoices`, trend: totalRevenue > 0 ? 'up' : 'flat' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Network className="h-6 w-6 text-[#d4a843]" /> Digital Ecosystem
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your complete business digital presence — all systems connected</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}
          className="border-gray-200 text-gray-600 text-xs">
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Ecosystem Health Score */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3">
            {/* Score circle */}
            <div className="p-6 flex flex-col items-center justify-center border-r border-gray-100">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none"
                    stroke={avgHealth >= 70 ? '#059669' : avgHealth >= 40 ? '#d4a843' : '#dc2626'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(avgHealth / 100) * 264} 264`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-extrabold text-gray-900">{avgHealth}%</p>
                  <p className="text-[9px] text-gray-400 font-medium">HEALTH</p>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-700 mt-2">Ecosystem Health</p>
              <p className="text-[10px] text-gray-400">
                {avgHealth >= 70 ? 'Strong digital presence' : avgHealth >= 40 ? 'Getting there — connect more' : 'Build your presence'}
              </p>
            </div>

            {/* Health checks */}
            <div className="p-6 md:col-span-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                <Activity className="h-3.5 w-3.5 inline mr-1" /> System Health
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {healthChecks.map(h => (
                  <div key={h.name} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      {h.status === 'healthy' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : h.status === 'warning' ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                      )}
                      <p className="text-xs font-bold text-gray-700 truncate">{h.name}</p>
                    </div>
                    <p className="text-[10px] text-gray-400">{h.detail}</p>
                    {h.score > 0 && (
                      <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${h.score >= 80 ? 'bg-emerald-500' : 'bg-[#d4a843]'}`}
                          style={{ width: `${h.score}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ecosystemMetrics.map(m => (
          <Card key={m.label} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${m.color}12` }}>
                  <m.icon className="h-5 w-5" style={{ color: m.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{m.value}</p>
                  <p className="text-[10px] text-gray-400">{m.label}</p>
                  {m.change && <p className="text-[9px] text-gray-400">{m.change}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Connections Grid */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5 inline mr-1" /> Platform Connections
            </h3>
            <Badge variant="outline" className={`text-[10px] ${ecosystemScore === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
              {connectedPlatforms}/{PLATFORMS.length} active
            </Badge>
          </div>

          <div className="space-y-5">
            {CATEGORIES.map(cat => {
              const catPlatforms = PLATFORMS.filter(p => p.category === cat.id)
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <p className="text-xs font-bold text-gray-700">{cat.label}</p>
                    <p className="text-[10px] text-gray-400">— {cat.description}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {catPlatforms.map(p => (
                      <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-xl border transition hover:shadow-sm group ${
                          p.status === 'connected'
                            ? 'border-emerald-200 bg-emerald-50/50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}>
                        <span className="text-2xl shrink-0">{p.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                            {p.status === 'connected' ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="h-3 w-3 text-gray-300 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 truncate">{p.description}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-[#b8941f] transition shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Flow Pipeline */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            <TrendingUp className="h-3.5 w-3.5 inline mr-1" /> Revenue Flow
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { icon: Eye, label: 'Impressions', value: '—', color: '#2563eb', desc: 'People see your brand' },
              { icon: MousePointerClick, label: 'Engagement', value: '—', color: '#7c3aed', desc: 'They interact with you' },
              { icon: Users, label: 'Leads', value: '—', color: '#d97706', desc: 'Potential customers' },
              { icon: FileText, label: 'Quotes', value: '—', color: '#dc2626', desc: 'Quotes sent' },
              { icon: DollarSign, label: 'Invoices', value: invoices.length, color: '#059669', desc: `${invoices.length} invoices` },
              { icon: Star, label: 'Revenue', value: `R${totalRevenue.toLocaleString()}`, color: '#d4a843', desc: 'Total earned' },
            ].map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2 shrink-0">
                {i > 0 && <div className="h-px w-6 bg-gray-200 shrink-0" />}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center min-w-[100px]">
                  <div className="h-8 w-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ backgroundColor: `${stage.color}12` }}>
                    <stage.icon className="h-4 w-4" style={{ color: stage.color }} />
                  </div>
                  <p className="text-xs font-bold text-gray-900">{stage.value}</p>
                  <p className="text-[9px] text-gray-400">{stage.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two-column: Quick Actions + Ecosystem Tips */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              <Zap className="h-3.5 w-3.5 inline mr-1" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { icon: Rocket, label: 'Platform Setup Wizard', desc: 'Connect all 12 platforms step by step', color: '#d4a843', href: '#wizard' },
                { icon: Megaphone, label: 'Marketing Campaigns', desc: 'Create and manage ad campaigns', color: '#dc2626', href: '#marketing' },
                { icon: Search, label: 'SEO & Local Listings', desc: 'Improve search visibility', color: '#d97706', href: '#seo' },
                { icon: MapPin, label: 'Google Business Profile', desc: 'Set up your Maps listing', color: '#4285f4', href: 'https://business.google.com/' },
                { icon: MessageCircle, label: 'WhatsApp Business', desc: 'Start chatting with customers', color: '#25d366', href: 'https://www.whatsapp.com/business/' },
                { icon: Globe, label: 'Website & Store', desc: 'Manage your online presence', color: '#059669', href: '/' },
              ].map(action => (
                <a key={action.label} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition border border-gray-100 group">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${action.color}12` }}>
                    <action.icon className="h-4.5 w-4.5" style={{ color: action.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#b8941f] transition">{action.label}</p>
                    <p className="text-[10px] text-gray-400">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-[#b8941f] transition shrink-0" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Roadmap */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              <Target className="h-3.5 w-3.5 inline mr-1" /> Growth Roadmap
            </h3>
            <div className="space-y-3">
              {[
                { step: 1, label: 'Complete Platform Setup', desc: 'Connect WhatsApp, Google Business, and social channels', done: false },
                { step: 2, label: 'Build Your Brand', desc: 'Consistent logo, colors, and messaging everywhere', done: false },
                { step: 3, label: 'Launch First Campaign', desc: 'Promote your services on Facebook/Instagram', done: false },
                { step: 4, label: 'Collect Reviews', desc: 'Ask happy customers to leave Google reviews', done: false },
                { step: 5, label: 'Automate & Scale', desc: 'Set up auto-replies, content scheduling, and leads', done: false },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-[#d4a843]/10 text-[#b8941f]'
                  }`}>
                    {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : item.step}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{item.label}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-gray-100" />

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 inline mr-1" /> AI & Automation
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🤖', label: 'AI Content Writer', desc: 'Auto-generate posts' },
                { icon: '📊', label: 'Smart Analytics', desc: 'Real-time insights' },
                { icon: '💬', label: 'Auto-Reply Bot', desc: 'WhatsApp responses' },
                { icon: '📧', label: 'Email Sequences', desc: 'Follow-up campaigns' },
              ].map(item => (
                <div key={item.label} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-lg mb-0.5">{item.icon}</p>
                  <p className="text-[10px] font-bold text-gray-700">{item.label}</p>
                  <p className="text-[9px] text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ecosystem Flyer Banner */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <div className="relative">
          <img src="/assets/flyers/flyer-campaign.png" alt="Fukulisane Ecosystem"
            className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/90 to-transparent flex items-center">
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-white mb-1">Ready to Grow Your Business?</h3>
              <p className="text-sm text-gray-300 mb-3 max-w-md">
                Your digital ecosystem is the foundation for growth. Connect platforms, run campaigns, and watch your business thrive.
              </p>
              <a href="/?page=wizard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4a843] text-white text-sm font-bold hover:bg-[#c9a433] transition">
                <Rocket className="h-4 w-4" /> Start Platform Setup
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

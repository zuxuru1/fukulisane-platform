import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
  Megaphone, TrendingUp, Eye, MousePointerClick, Users, Target,
  Plus, BarChart3, DollarSign, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Clock, Globe, Search, MapPin, Star, Sparkles
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

type Campaign = {
  id: string; name: string; type: string; channel: string; status: string
  budget: number; spent: number; impressions: number; clicks: number
  leads: number; conversions: number; content: string | null
  targetAudience: string | null; startDate: string | null; endDate: string | null
  createdAt: string
}

type Summary = {
  totalCampaigns: number; activeCampaigns: number
  totalImpressions: number; totalClicks: number; ctr: number
  totalSpent: number; totalLeads: number; totalRevenue: number
  conversionRate: number
}

type Listing = {
  id: string; platform: string; listingUrl: string | null
  status: string; rating: number | null; reviewCount: number
}

type SEORecord = {
  id: string; page: string; title: string | null
  description: string | null; keywords: string | null; score: number
}

export default function MarketingEcosystem({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [tab, setTab] = useState<'overview' | 'campaigns' | 'local' | 'seo' | 'listings'>('overview')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [seoRecords, setSeoRecords] = useState<SEORecord[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'social', channel: 'facebook', budget: '', content: '', targetAudience: '' })

  useEffect(() => {
    fetch(`/api/marketing/summary/${BIZ_ID}`).then(r => r.json()).then(setSummary).catch(() => {})
    fetch(`/api/marketing/campaigns/${BIZ_ID}`).then(r => r.json()).then(d => setCampaigns(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`/api/local/listings/${BIZ_ID}`).then(r => r.json()).then(d => setListings(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`/api/seo/records/${BIZ_ID}`).then(r => r.json()).then(d => setSeoRecords(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const createCampaign = async () => {
    if (!form.name) return
    const res = await fetch(`/api/marketing/campaigns/${BIZ_ID}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, budget: parseFloat(form.budget || '0') }),
    })
    const created = await res.json()
    setCampaigns([created, ...campaigns])
    setForm({ name: '', type: 'social', channel: 'facebook', budget: '', content: '', targetAudience: '' })
    setOpen(false)
    showToast('Campaign created')
  }

  const activateCampaign = async (campaign: Campaign) => {
    await fetch(`/api/marketing/campaigns/${campaign.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: campaign.status === 'active' ? 'paused' : 'active' }),
    })
    setCampaigns(campaigns.map(c => c.id === campaign.id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c))
    showToast(`Campaign ${campaign.status === 'active' ? 'paused' : 'activated'}`)
  }

  const deleteCampaign = async (id: string) => {
    await fetch(`/api/marketing/campaigns/${id}`, { method: 'DELETE' })
    setCampaigns(campaigns.filter(c => c.id !== id))
    showToast('Campaign deleted')
  }

  const generateSEO = async () => {
    const res = await fetch(`/api/seo/generate/${BIZ_ID}`, { method: 'POST' })
    const data = await res.json()
    if (data.ok) {
      showToast(`SEO generated: ${data.seoPages} pages, ${data.listings} listings`)
      fetch(`/api/seo/records/${BIZ_ID}`).then(r => r.json()).then(d => setSeoRecords(Array.isArray(d) ? d : [])).catch(() => {})
      fetch(`/api/local/listings/${BIZ_ID}`).then(r => r.json()).then(d => setListings(Array.isArray(d) ? d : [])).catch(() => {})
    }
  }

  const seedPlans = async () => {
    const res = await fetch('/api/sub/seed-plans', { method: 'POST' })
    const data = await res.json()
    showToast(data.ok ? 'Subscription plans ready' : 'Failed')
  }

  const platformIcons: Record<string, string> = {
    'google-business': '🔍', facebook: '📘', instagram: '📸', whatsapp: '💬',
    tiktok: '🎵', youtube: '🎬', linkedin: '💼', pinterest: '📌',
  }
  const statusColor: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700', paused: 'bg-amber-100 text-amber-700',
    draft: 'bg-gray-100 text-gray-500', completed: 'bg-blue-100 text-blue-700',
    connected: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700',
  }

  const tabs = [
    { id: 'overview' as const, label: '📊 Overview' },
    { id: 'campaigns' as const, label: '📢 Campaigns' },
    { id: 'listings' as const, label: '📍 Local Listings' },
    { id: 'seo' as const, label: '🔍 SEO' },
    { id: 'local' as const, label: '💰 Subscriptions' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">🚀 Marketing Ecosystem</h1>
        <p className="text-gray-500 text-sm mt-1">Campaigns, local visibility, SEO, and subscriptions</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && summary && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Campaigns', value: summary.totalCampaigns, icon: Megaphone, color: '#dc2626', sub: `${summary.activeCampaigns} active` },
              { label: 'Impressions', value: summary.totalImpressions.toLocaleString(), icon: Eye, color: '#2563eb', sub: `${summary.ctr}% CTR` },
              { label: 'Leads', value: summary.totalLeads, icon: Users, color: '#059669', sub: `${summary.conversionRate}% conversion` },
              { label: 'Revenue', value: `R${summary.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#d4a843', sub: `R${summary.totalSpent.toLocaleString()} spent` },
            ].map(k => (
              <Card key={k.label} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}12` }}>
                      <k.icon className="h-5 w-5" style={{ color: k.color }} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{k.value}</p>
                      <p className="text-[10px] text-gray-400">{k.label}</p>
                      <p className="text-[9px] text-gray-400">{k.sub}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'New Campaign', icon: Plus, action: () => { setTab('campaigns'); setOpen(true) } },
                  { label: 'Generate SEO', icon: Search, action: generateSEO },
                  { label: 'Local Listings', icon: MapPin, action: () => setTab('listings') },
                  { label: 'Setup Plans', icon: Sparkles, action: seedPlans },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-sm font-medium text-gray-700 border border-gray-100">
                    <a.icon className="h-4 w-4 text-[#d4a843]" />
                    {a.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{campaigns.length} campaigns</p>
            <Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]">
              <Plus className="h-4 w-4 mr-1" /> New Campaign
            </Button>
          </div>
          {campaigns.length === 0 ? (
            <Card className="bg-white border-gray-200"><CardContent className="p-8 text-center">
              <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No campaigns yet. Create your first one.</p>
            </CardContent></Card>
          ) : campaigns.map(c => (
            <Card key={c.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">{c.name}</p>
                      <Badge variant="outline" className={`text-[9px] capitalize ${statusColor[c.status] || ''}`}>{c.status}</Badge>
                      <Badge variant="secondary" className="text-[9px]">{c.channel}</Badge>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{c.type} • {c.targetAudience || 'All audiences'}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] text-gray-500"><Eye className="h-3 w-3 inline mr-0.5" />{c.impressions.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-500"><MousePointerClick className="h-3 w-3 inline mr-0.5" />{c.clicks}</span>
                      <span className="text-[10px] text-gray-500"><Users className="h-3 w-3 inline mr-0.5" />{c.leads}</span>
                      {c.budget > 0 && <span className="text-[10px] text-gray-500"><DollarSign className="h-3 w-3 inline mr-0.5" />R{c.budget}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => activateCampaign(c)}>
                      {c.status === 'active' ? '⏸ Pause' : '▶ Activate'}
                    </Button>
                    <button onClick={() => deleteCampaign(c.id)} className="text-[10px] text-red-500 hover:text-red-600 font-medium px-2">Delete</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Local listings & map visibility</p>
            <Button onClick={generateSEO} className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Generate All
            </Button>
          </div>
          {listings.length === 0 ? (
            <Card className="bg-white border-gray-200"><CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-2">No local listings yet.</p>
              <Button onClick={generateSEO} size="sm" className="bg-[#d4a843] text-white hover:bg-[#c9a433]">Generate Listings</Button>
            </CardContent></Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {listings.map(l => (
                <Card key={l.id} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platformIcons[l.platform] || '🌐'}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900 capitalize">{l.platform.replace('-', ' ')}</p>
                        <Badge variant="outline" className={`text-[9px] capitalize ${statusColor[l.status] || ''}`}>{l.status}</Badge>
                        {l.rating && <span className="text-[10px] text-gray-500 ml-2">⭐ {l.rating} ({l.reviewCount} reviews)</span>}
                      </div>
                      {l.listingUrl && (
                        <a href={l.listingUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                          Open <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">SEO records for each page</p>
            <Button onClick={generateSEO} className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Generate SEO
            </Button>
          </div>
          {seoRecords.length === 0 ? (
            <Card className="bg-white border-gray-200"><CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-2">No SEO records yet.</p>
              <Button onClick={generateSEO} size="sm" className="bg-[#d4a843] text-white hover:bg-[#c9a433]">Generate SEO</Button>
            </CardContent></Card>
          ) : seoRecords.map(r => (
            <Card key={r.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-[#b8941f] capitalize">{r.page}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.score >= 80 ? 'bg-emerald-500' : r.score >= 50 ? 'bg-[#d4a843]' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(r.score, 100)}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{r.score}%</span>
                </div>
                {r.title && <p className="text-xs text-gray-700 font-medium mb-0.5">Title: {r.title}</p>}
                {r.description && <p className="text-[10px] text-gray-500 line-clamp-2">Description: {r.description}</p>}
                {r.keywords && <p className="text-[10px] text-gray-400 mt-1">Keywords: {r.keywords}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'local' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Affordable subscription plans</p>
          {[
            { name: 'Starter', price: 99, features: ['5 products', '100 orders/mo', '2 AI agents', 'Basic marketing', 'Email support'], popular: false },
            { name: 'Growth', price: 249, features: ['50 products', '500 orders/mo', '5 AI agents', 'Full marketing suite', 'Priority support', 'SEO tools', 'Analytics'], popular: true },
            { name: 'Enterprise', price: 499, features: ['Unlimited products', 'Unlimited orders', 'Unlimited AI agents', 'All features', 'Dedicated support', 'Custom integrations', 'White-label options'], popular: false },
          ].map(p => (
            <Card key={p.name} className={`bg-white border-2 shadow-sm ${p.popular ? 'border-[#d4a843]' : 'border-gray-200'}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                    {p.popular && <Badge className="bg-[#d4a843] text-white text-[9px] mt-1">Most Popular</Badge>}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-gray-900">R{p.price}</p>
                    <p className="text-[10px] text-gray-400">/month</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button className={`w-full mt-4 ${p.popular ? 'bg-[#d4a843] text-white hover:bg-[#c9a433]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {p.popular ? 'Get Started' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>New Campaign</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Campaign Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. Winter Special Promo" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Type</Label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  <option value="social">Social Media</option><option value="email">Email</option><option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option><option value="local">Local/Maps</option><option value="referral">Referral</option>
                </select>
              </div>
              <div><Label className="text-xs">Channel</Label>
                <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  <option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option>
                  <option value="whatsapp">WhatsApp</option><option value="google">Google</option><option value="email">Email</option>
                  <option value="all">All Channels</option>
                </select>
              </div>
            </div>
            <div><Label className="text-xs">Budget (R)</Label><Input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="0" /></div>
            <div><Label className="text-xs">Content</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} placeholder="Campaign message..." /></div>
            <div><Label className="text-xs">Target Audience</Label><Input value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. Homeowners in Durban" /></div>
            <Button onClick={createCampaign} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Create Campaign</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

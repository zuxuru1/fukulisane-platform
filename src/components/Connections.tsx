import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Wifi, WifiOff, CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  ExternalLink, Key, Lock, Globe, Plus, Trash2, Eye, EyeOff,
  Zap, ArrowRight, Shield, Clock, Database, Server, Send,
  MessageCircle, Mail, Users, BarChart3, Search, Filter,
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

interface Provider {
  slug: string
  name: string
  authType: 'oauth' | 'api_key' | 'link_only' | 'whatsapp_business'
  authTypeLabel: string
  authUrl?: string
  setupUrl?: string
  docsUrl?: string
  description: string
}

interface Connection {
  id: string
  businessId: string
  provider: string
  displayName: string
  authType: string
  status: 'disconnected' | 'connecting' | 'connected' | 'error' | 'sealed'
  accountEmail?: string
  accountName?: string
  lastSyncAt?: string
  lastError?: string
  syncCount: number
  scopes?: string
  createdAt: string
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  connected: { color: '#059669', bg: '#ecfdf5', icon: CheckCircle2, label: 'Connected' },
  disconnected: { color: '#6b7280', bg: '#f9fafb', icon: WifiOff, label: 'Not Connected' },
  connecting: { color: '#d97706', bg: '#fffbeb', icon: RefreshCw, label: 'Connecting...' },
  error: { color: '#dc2626', bg: '#fef2f2', icon: XCircle, label: 'Error' },
  sealed: { color: '#2563eb', bg: '#eff6ff', icon: Shield, label: 'Sealed' },
}

const PROVIDER_ICONS: Record<string, string> = {
  'google-business': '🔵', 'facebook': '🔵', 'instagram': '📸',
  'whatsapp-business': '💚', 'tiktok': '🎵', 'youtube': '🔴',
  'linkedin': '💼', 'pinterest': '📌', 'x': '𝕏',
  'wordpress': '📝', 'stripe': '💳', 'smtp-email': '📧', 'sms-gateway': '📱',
}

const CATEGORY_ORDER = ['Core Business', 'Social Media', 'Communications', 'Payments & Finance']

function categorize(slug: string): string {
  if (['google-business', 'wordpress'].includes(slug)) return 'Core Business'
  if (['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'pinterest', 'x'].includes(slug)) return 'Social Media'
  if (['whatsapp-business', 'smtp-email', 'sms-gateway'].includes(slug)) return 'Communications'
  if (['stripe'].includes(slug)) return 'Payments & Finance'
  return 'Other'
}

export default function Connections() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'connected' | 'disconnected'>('all')
  const [search, setSearch] = useState('')
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [apiKeyForm, setApiKeyForm] = useState({ apiKey: '', accountEmail: '', accountName: '' })
  const [showingKey, setShowingKey] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [provRes, connRes] = await Promise.all([
        fetch('/api/connections/providers').then(r => r.json()),
        fetch(`/api/connections/${BIZ_ID}`).then(r => r.json()),
      ])
      setProviders(Array.isArray(provRes) ? provRes : [])
      setConnections(Array.isArray(connRes) ? connRes : [])
    } catch (err) {
      showToast('Failed to load connections', 'error')
    }
    setLoading(false)
  }

  const seedConnections = async () => {
    const res = await fetch(`/api/connections/${BIZ_ID}/seed`, { method: 'POST' })
    const data = await res.json()
    showToast(`Seeded ${data.seeded} providers`)
    loadData()
  }

  const startOAuth = async (provider: string) => {
    const res = await fetch(`/api/connections/${BIZ_ID}/auth-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    })
    const data = await res.json()
    if (data.authUrl) {
      window.open(data.authUrl, '_blank', 'width=600,height=700')
      showToast('Opening authorization page...')
      // Poll for connection status
      setTimeout(loadData, 5000)
    } else {
      showToast(data.error || 'Failed to generate auth URL', 'error')
    }
  }

  const saveApiKey = async (provider: string) => {
    const res = await fetch(`/api/connections/${BIZ_ID}/api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, ...apiKeyForm }),
    })
    const data = await res.json()
    if (data.ok) {
      showToast(`Connected to ${provider}`)
      setShowApiKey(null)
      setApiKeyForm({ apiKey: '', accountEmail: '', accountName: '' })
    } else {
      showToast(data.error || 'Connection test failed', 'error')
    }
    loadData()
  }

  const disconnect = async (provider: string) => {
    await fetch(`/api/connections/${BIZ_ID}/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    })
    showToast('Disconnected')
    loadData()
  }

  const testConnection = async (provider: string) => {
    setTesting(provider)
    const res = await fetch(`/api/connections/${BIZ_ID}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    })
    const data = await res.json()
    setTesting(null)
    if (data.health === 'healthy') showToast('Connection is healthy ✓')
    else if (data.health === 'degraded') showToast(`Degraded: ${data.message}`, 'error')
    else showToast(`Error: ${data.message}`, 'error')
    loadData()
  }

  const getConnection = (slug: string) => connections.find(c => c.provider === slug)

  const filteredProviders = providers.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false
    const conn = getConnection(p.slug)
    if (tab === 'connected' && (!conn || conn.status !== 'connected')) return false
    if (tab === 'disconnected' && conn?.status === 'connected') return false
    return true
  })

  const grouped = CATEGORY_ORDER.reduce<Record<string, Provider[]>>((acc, cat) => {
    const items = filteredProviders.filter(p => categorize(p.slug) === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const totalConnected = connections.filter(c => c.status === 'connected').length
  const totalProviders = providers.length
  const connectionScore = totalProviders ? Math.round((totalConnected / totalProviders) * 100) : 0

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-[70] px-5 py-3 rounded-lg shadow-lg text-white text-sm font-semibold ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🔌 Platform Connections</h1>
          <p className="text-gray-500 text-sm mt-1">OAuth adapters, API keys, and provider integrations</p>
        </div>
        <div className="flex gap-2">
          {connections.length === 0 && (
            <Button onClick={seedConnections} variant="outline" className="border-gray-200 text-gray-600 text-xs">
              <Zap className="h-3.5 w-3.5 mr-1" /> Seed Providers
            </Button>
          )}
          <Button onClick={loadData} variant="outline" className="border-gray-200 text-gray-600 text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Providers', value: totalProviders, icon: Globe, color: '#2563eb' },
          { label: 'Connected', value: totalConnected, icon: CheckCircle2, color: '#059669' },
          { label: 'Disconnected', value: totalProviders - totalConnected, icon: WifiOff, color: '#6b7280' },
          { label: 'Connection Score', value: `${connectionScore}%`, icon: BarChart3, color: '#d4a843' },
        ].map(s => (
          <Card key={s.label} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-[#d4a843]/10 to-[#d4a843]/5 border-[#d4a843]/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Connection Health</p>
              <p className="text-xs text-gray-500 mt-0.5">{totalConnected}/{totalProviders} platforms connected</p>
            </div>
            <div className="w-48">
              <Progress value={connectionScore} className="h-3" />
            </div>
            <span className="text-lg font-extrabold text-[#b8941f]">{connectionScore}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-gray-50 border-gray-200" placeholder="Search providers..." />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'connected', 'disconnected'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'all' ? 'All' : t} ({t === 'all' ? totalProviders : t === 'connected' ? totalConnected : totalProviders - totalConnected})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-white border-gray-200"><CardContent className="p-4 animate-pulse">
              <div className="flex items-center gap-4"><div className="h-12 w-12 rounded-xl bg-gray-100" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-1/3" /><div className="h-3 bg-gray-100 rounded w-2/3" /></div></div>
            </CardContent></Card>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card className="bg-white border-gray-200"><CardContent className="p-12 text-center">
          <Wifi className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">No providers found</h3>
          <p className="text-sm text-gray-500 mb-4">{search ? 'Try a different search' : 'Click "Seed Providers" to initialize the connection registry'}</p>
          {connections.length === 0 && <Button onClick={seedConnections} className="bg-[#d4a843] text-white"><Zap className="h-4 w-4 mr-1" /> Seed Providers</Button>}
        </CardContent></Card>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map(provider => {
                const conn = getConnection(provider.slug)
                const status = conn?.status || 'disconnected'
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.disconnected
                const StatusIcon = cfg.icon

                return (
                  <Card key={provider.slug} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${cfg.color}10` }}>
                          {PROVIDER_ICONS[provider.slug] || '🔗'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-gray-900">{provider.name}</p>
                            <Badge variant="outline" className="text-[9px]" style={{ borderColor: cfg.color, color: cfg.color }}>
                              <StatusIcon className="h-3 w-3 mr-0.5" /> {cfg.label}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] border-gray-200 text-gray-400">{provider.authTypeLabel}</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{provider.description}</p>
                          {conn?.accountName && <p className="text-[10px] text-gray-400 mt-0.5">Account: {conn.accountName}{conn.accountEmail ? ` (${conn.accountEmail})` : ''}</p>}
                          {conn?.lastError && <p className="text-[10px] text-red-500 mt-0.5">⚠ {conn.lastError}</p>}
                          {conn?.lastSyncAt && <p className="text-[10px] text-gray-400 mt-0.5">Last sync: {new Date(conn.lastSyncAt).toLocaleString()}</p>}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          {status === 'disconnected' && (
                            provider.authType === 'oauth' ? (
                              <Button size="sm" onClick={() => startOAuth(provider.slug)}
                                className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-[11px]">
                                <Lock className="h-3 w-3 mr-1" /> Connect OAuth
                              </Button>
                            ) : provider.authType === 'api_key' ? (
                              <Button size="sm" onClick={() => setShowApiKey(provider.slug)}
                                className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-[11px]">
                                <Key className="h-3 w-3 mr-1" /> Add API Key
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => window.open(provider.setupUrl, '_blank')}
                                className="border-gray-200 text-gray-600 text-[11px]">
                                <ExternalLink className="h-3 w-3 mr-1" /> Open Setup
                              </Button>
                            )
                          )}
                          {status === 'connected' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => testConnection(provider.slug)}
                                disabled={testing === provider.slug}
                                className="border-gray-200 text-gray-600 text-[11px]">
                                {testing === provider.slug ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : <Zap className="h-3 w-3 mr-1" />}
                                Test
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => disconnect(provider.slug)}
                                className="border-red-200 text-red-500 text-[11px] hover:bg-red-50">
                                <WifiOff className="h-3 w-3 mr-1" /> Disconnect
                              </Button>
                            </>
                          )}
                          {status === 'error' && (
                            <Button size="sm" onClick={() => provider.authType === 'oauth' ? startOAuth(provider.slug) : setShowApiKey(provider.slug)}
                              className="bg-red-600 text-white hover:bg-red-700 text-[11px]">
                              <RefreshCw className="h-3 w-3 mr-1" /> Reconnect
                            </Button>
                          )}
                          {provider.setupUrl && provider.setupUrl !== '#' && (
                            <Button size="sm" variant="ghost" onClick={() => window.open(provider.setupUrl, '_blank')}
                              className="text-gray-400 hover:text-gray-600 text-[11px]">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      )}

      <Dialog open={!!showApiKey} onOpenChange={() => setShowApiKey(null)}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle>Connect {providers.find(p => p.slug === showApiKey)?.name || showApiKey}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <p className="text-xs text-gray-500">Enter your API key to establish a live connection. The key will be tested automatically.</p>
            <div>
              <Label className="text-xs">API Key *</Label>
              <div className="relative">
                <Input
                  type={showingKey ? 'text' : 'password'}
                  value={apiKeyForm.apiKey}
                  onChange={e => setApiKeyForm({ ...apiKeyForm, apiKey: e.target.value })}
                  className="bg-gray-50 border-gray-200 pr-10 font-mono text-sm"
                  placeholder="sk_live_..."
                />
                <button onClick={() => setShowingKey(!showingKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showingKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Account Email</Label>
                <Input value={apiKeyForm.accountEmail} onChange={e => setApiKeyForm({ ...apiKeyForm, accountEmail: e.target.value })}
                  className="bg-gray-50 border-gray-200" placeholder="you@company.com" />
              </div>
              <div>
                <Label className="text-xs">Account Name</Label>
                <Input value={apiKeyForm.accountName} onChange={e => setApiKeyForm({ ...apiKeyForm, accountName: e.target.value })}
                  className="bg-gray-50 border-gray-200" placeholder="Business Name" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Shield className="h-3 w-3" /> Your key is encrypted and stored securely in the database.
            </p>
            <Button onClick={() => showApiKey && saveApiKey(showApiKey)} disabled={!apiKeyForm.apiKey}
              className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">
              <Lock className="h-4 w-4 mr-1" /> Save & Test Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

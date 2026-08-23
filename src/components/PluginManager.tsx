import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Puzzle, Globe, MessageSquare, MapPin, ShoppingCart,
  CreditCard, Truck, BarChart3, Share2, Code, Copy,
  CheckCircle2, ExternalLink, Settings, Zap, Key,
  Smartphone, Mail, Bell, FileText, Link2, Store,
  RefreshCw, Palette, Search, ImageIcon
} from 'lucide-react'

interface PluginManagerProps {
  businessId: string
  businessSlug: string
  businessName: string
  showToast: (msg: string, type?: 'success' | 'error') => void
}

interface PluginDef {
  id: string
  name: string
  slug: string
  description: string
  category: string
  icon: React.ReactNode
  color: string
  enabled: boolean
  config?: Record<string, string>
  setupSteps: string[]
  actionUrl?: string
  embedCode?: string
}

const PLUGIN_CATALOG: Omit<PluginDef, 'enabled' | 'config'>[] = [
  {
    id: 'embed-widget',
    name: 'Website Embed Widget',
    slug: 'embed-widget',
    description: 'Add your store to any website with a copy-paste code snippet',
    category: 'connect',
    icon: <Code className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-700',
    setupSteps: ['Copy the embed code below', 'Paste it into your website HTML', 'The store loads automatically'],
  },
  {
    id: 'whatsapp-orders',
    name: 'WhatsApp Order Button',
    slug: 'whatsapp-orders',
    description: 'Customers order directly via WhatsApp — zero friction',
    category: 'connect',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'bg-green-100 text-green-700',
    setupSteps: ['Add your WhatsApp number', 'Order button appears on your store', 'Orders arrive in your WhatsApp chat'],
  },
  {
    id: 'google-business',
    name: 'Google Business Profile',
    slug: 'google-business',
    description: 'Register on Google Maps and appear in "near me" searches',
    category: 'visibility',
    icon: <MapPin className="h-5 w-5" />,
    color: 'bg-red-100 text-red-700',
    setupSteps: ['Click register link', 'Follow Google\'s verification steps', 'Your business appears on Google Maps'],
    actionUrl: 'https://business.google.com/create',
  },
  {
    id: 'facebook-shop',
    name: 'Facebook & Instagram Shop',
    slug: 'facebook-shop',
    description: 'Sync your products to Facebook Shop and Instagram Shopping',
    category: 'visibility',
    icon: <Share2 className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-700',
    setupSteps: ['Create a Facebook Business Page', 'Set up Facebook Commerce Manager', 'Sync your product catalog'],
    actionUrl: 'https://business.facebook.com/commerce/',
  },
  {
    id: 'pos-integration',
    name: 'POS Integration (Yoco/Square)',
    slug: 'pos-integration',
    description: 'Connect your in-store card machine to your online orders',
    category: 'payments',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-orange-100 text-orange-700',
    setupSteps: ['Enter your POS API key', 'Map your product IDs', 'Sales sync automatically'],
  },
  {
    id: 'delivery-partner',
    name: 'Delivery Partner (Mr D / UberEats)',
    slug: 'delivery-partner',
    description: 'Connect to delivery services for automatic order dispatch',
    category: 'operations',
    icon: <Truck className="h-5 w-5" />,
    color: 'bg-yellow-100 text-yellow-700',
    setupSteps: ['Register as a partner', 'Enter your partner ID', 'Orders auto-dispatch when ready'],
  },
  {
    id: 'sms-marketing',
    name: 'Bulk SMS Marketing',
    slug: 'sms-marketing',
    description: 'Send promotions via SMS — 95% open rate',
    category: 'marketing',
    icon: <Mail className="h-5 w-5" />,
    color: 'bg-teal-100 text-teal-700',
    setupSteps: ['Add your SMS provider API key', 'Import your customer list', 'Send campaigns from the dashboard'],
  },
  {
    id: 'payfast-yoco',
    name: 'Payment Gateway (PayFast/Yoco)',
    slug: 'payfast-yoco',
    description: 'Accept card and EFT payments online',
    category: 'payments',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-700',
    setupSteps: ['Create a PayFast/Yoco account', 'Enter your merchant ID and key', 'Customers pay online, money hits your account'],
    actionUrl: 'https://www.payfast.co.za/',
  },
  {
    id: 'inventory-sync',
    name: 'Inventory Auto-Sync',
    slug: 'inventory-sync',
    description: 'Keep online and in-store stock counts in sync',
    category: 'operations',
    icon: <ShoppingCart className="h-5 w-5" />,
    color: 'bg-cyan-100 text-cyan-700',
    setupSteps: ['Connect your inventory system', 'Map product IDs', 'Stock levels update in real-time'],
  },
  {
    id: 'seo-optimizer',
    name: 'SEO Auto-Optimizer',
    slug: 'seo-optimizer',
    description: 'Auto-generate meta tags, schema markup, and sitemaps',
    category: 'visibility',
    icon: <Globe className="h-5 w-5" />,
    color: 'bg-emerald-100 text-emerald-700',
    setupSteps: ['AI scans your store content', 'Generates optimized meta tags', 'Adds structured data for Google'],
  },
  {
    id: 'push-notifications',
    name: 'Push Notifications',
    slug: 'push-notifications',
    description: 'Send browser notifications about specials and new products',
    category: 'marketing',
    icon: <Bell className="h-5 w-5" />,
    color: 'bg-pink-100 text-pink-700',
    setupSteps: ['Enable push notifications', 'Customers opt in on your store', 'Send promos that pop up on their phone'],
  },
  {
    id: 'accounting',
    name: 'Accounting (Xero/Wave)',
    slug: 'accounting',
    description: 'Auto-sync sales to your accounting software',
    category: 'operations',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-violet-100 text-violet-700',
    setupSteps: ['Connect your Xero/Wave account', 'Map your products to ledger codes', 'Sales appear in your books automatically'],
    actionUrl: 'https://www.waveapps.com/',
  },
  // ═══════════ AI STORE BUILDER PLUGINS ═══════════
  {
    id: 'ai-storebuilder',
    name: 'AI Store Builder',
    slug: 'ai-storebuilder',
    description: 'The core engine — AI generates your entire store from products, branding, and business info',
    category: 'ai',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    setupSteps: ['Upload your products (images, CSV, or Google Drive)', 'AI analyzes and categorizes everything', 'AI generates your complete store design', 'Preview, edit, and publish — done'],
  },
  {
    id: 'ai-regenerator',
    name: 'AI Store Regenerator',
    slug: 'ai-regenerator',
    description: 'When you add new products, AI rebuilds your homepage, collections, SEO, and marketing assets',
    category: 'ai',
    icon: <RefreshCw className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-700',
    setupSteps: ['Enable auto-regeneration or manual mode', 'Upload new products anytime', 'AI rebuilds homepage, categories, collections', 'SEO, marketing assets, and search updated automatically'],
  },
  {
    id: 'ai-content-engine',
    name: 'AI Content Engine',
    slug: 'ai-content-engine',
    description: 'Generates product descriptions, blog posts, landing pages, FAQs, and email content',
    category: 'ai',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-700',
    setupSteps: ['AI scans your products and brand', 'Generates compelling product descriptions', 'Creates blog articles and landing pages', 'Produces email and social content'],
  },
  {
    id: 'ai-seo-generator',
    name: 'AI SEO Generator',
    slug: 'ai-seo-generator',
    description: 'Auto-generates meta tags, schema markup, sitemaps, and local SEO for Google',
    category: 'ai',
    icon: <Globe className="h-5 w-5" />,
    color: 'bg-emerald-100 text-emerald-700',
    setupSteps: ['AI analyzes your store content', 'Generates optimized meta titles & descriptions', 'Adds structured data (schema.org)', 'Submits sitemap to Google Search Console'],
  },
  {
    id: 'ai-marketing-generator',
    name: 'AI Marketing Generator',
    slug: 'ai-marketing-generator',
    description: 'Auto-creates social media posts, WhatsApp campaigns, and promotional content',
    category: 'ai',
    icon: <Smartphone className="h-5 w-5" />,
    color: 'bg-pink-100 text-pink-700',
    setupSteps: ['AI reads your products and brand', 'Generates Instagram/Facebook posts', 'Creates WhatsApp broadcast campaigns', 'Schedules and tracks performance'],
  },
  {
    id: 'ai-image-optimizer',
    name: 'AI Image Optimizer',
    slug: 'ai-image-optimizer',
    description: 'Auto-compresses, resizes, and optimizes product images for fast loading',
    category: 'ai',
    icon: <ImageIcon className="h-5 w-5" />,
    color: 'bg-amber-100 text-amber-700',
    setupSteps: ['Enable image optimization', 'AI compresses all images (WebP)', 'Creates responsive sizes for mobile/tablet', 'CDN delivery for fastest loading'],
  },
  {
    id: 'ai-product-analyzer',
    name: 'AI Product Analyzer',
    slug: 'ai-product-analyzer',
    description: 'Upload a product photo — AI detects type, colors, materials, suggests description and price',
    category: 'ai',
    icon: <Search className="h-5 w-5" />,
    color: 'bg-cyan-100 text-cyan-700',
    setupSteps: ['Upload any product image', 'AI detects product type & features', 'Generates title, description, tags', 'Suggests competitive pricing'],
  },
  {
    id: 'ai-brand-generator',
    name: 'AI Brand Generator',
    slug: 'ai-brand-generator',
    description: 'AI creates your brand identity — colors, fonts, logo refinement, brand voice, and messaging',
    category: 'ai',
    icon: <Palette className="h-5 w-5" />,
    color: 'bg-fuchsia-100 text-fuchsia-700',
    setupSteps: ['Tell AI about your business', 'AI generates brand color palette', 'Creates typography recommendations', 'Defines brand voice and messaging style'],
  },
  // ═══════════ AI AGENT PLUGINS (Industry) ═══════════
  {
    id: 'agent-restaurant',
    name: 'Restaurant Growth Agent',
    slug: 'agent-restaurant',
    description: 'AI agent specialized for restaurants — menu optimization, peak hour management, delivery coordination',
    category: 'agents',
    icon: <Store className="h-5 w-5" />,
    color: 'bg-orange-100 text-orange-700',
    setupSteps: ['Install the Restaurant Agent', 'AI learns your menu and peak hours', 'Auto-optimizes pricing and promotions', 'Manages delivery and table bookings'],
  },
  {
    id: 'agent-gym',
    name: 'Gym Growth Agent',
    slug: 'agent-gym',
    description: 'AI agent for fitness businesses — member retention, class scheduling, trainer optimization',
    category: 'agents',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-red-100 text-red-700',
    setupSteps: ['Install the Gym Agent', 'AI tracks member attendance patterns', 'Predicts and prevents churn', 'Optimizes class schedules and trainer allocation'],
  },
  {
    id: 'agent-retail',
    name: 'Retail Growth Agent',
    slug: 'agent-retail',
    description: 'AI agent for retail — stock forecasting, seasonal trends, visual merchandising, loyalty programs',
    category: 'agents',
    icon: <ShoppingCart className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-700',
    setupSteps: ['Install the Retail Agent', 'AI analyzes sales patterns and seasons', 'Auto-recommends stock and pricing', 'Creates loyalty and promotion campaigns'],
  },
  {
    id: 'agent-beauty',
    name: 'Salon Growth Agent',
    slug: 'agent-beauty',
    description: 'AI agent for salons & spas — appointment optimization, stylist performance, product cross-sell',
    category: 'agents',
    icon: <Store className="h-5 w-5" />,
    color: 'bg-pink-100 text-pink-700',
    setupSteps: ['Install the Salon Agent', 'AI fills booking gaps with promotions', 'Suggests product combos per client', 'Optimizes stylist schedules for revenue'],
  },
  {
    id: 'agent-construction',
    name: 'Construction Growth Agent',
    slug: 'agent-construction',
    description: 'AI agent for contractors — project tracking, material estimation, crew scheduling, client updates',
    category: 'agents',
    icon: <Truck className="h-5 w-5" />,
    color: 'bg-yellow-100 text-yellow-700',
    setupSteps: ['Install the Construction Agent', 'AI tracks project timelines and materials', 'Manages crew schedules and safety compliance', 'Sends automatic client progress updates'],
  },
  {
    id: 'agent-logistics',
    name: 'Logistics Growth Agent',
    slug: 'agent-logistics',
    description: 'AI agent for delivery & logistics — route optimization, fleet management, real-time tracking',
    category: 'agents',
    icon: <Truck className="h-5 w-5" />,
    color: 'bg-sky-100 text-sky-700',
    setupSteps: ['Install the Logistics Agent', 'AI optimizes delivery routes in real-time', 'Tracks fleet health and fuel costs', 'Manages customer ETA notifications'],
  },
]

export default function PluginManager({ businessId, businessSlug, businessName, showToast }: PluginManagerProps) {
  const [plugins, setPlugins] = useState<PluginDef[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPlugin, setSelectedPlugin] = useState<PluginDef | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadPlugins = useCallback(async () => {
    try {
      const res = await fetch(`/api/plugins?businessId=${businessId}`)
      if (res.ok) {
        const data = await res.json()
        const saved = Array.isArray(data) ? data : data?.items ?? []
        setPlugins(PLUGIN_CATALOG.map(p => {
          const s = saved.find((x: { slug: string }) => x.slug === p.slug)
          return { ...p, enabled: s?.isEnabled ?? false, config: s?.config ? JSON.parse(s.config) : {} }
        }))
      } else {
        setPlugins(PLUGIN_CATALOG.map(p => ({ ...p, enabled: false })))
      }
    } catch {
      setPlugins(PLUGIN_CATALOG.map(p => ({ ...p, enabled: false })))
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => { loadPlugins() }, [loadPlugins])

  const togglePlugin = async (plugin: PluginDef) => {
    try {
      const method = plugin.enabled ? 'DELETE' : 'POST'
      const url = plugin.enabled
        ? `/api/plugins/${businessId}/${plugin.slug}`
        : '/api/plugins'
      const body = plugin.enabled
        ? undefined
        : JSON.stringify({ businessId, name: plugin.name, slug: plugin.slug, description: plugin.description, category: plugin.category, isEnabled: true })
      const res = await fetch(url, {
        method,
        headers: plugin.enabled ? {} : { 'Content-Type': 'application/json' },
        body: plugin.enabled ? undefined : body,
      })
      if (res.ok || res.status === 204) {
        setPlugins(prev => prev.map(p =>
          p.slug === plugin.slug ? { ...p, enabled: !p.enabled } : p
        ))
        showToast(`${plugin.name} ${plugin.enabled ? 'disabled' : 'enabled'}`)
      }
    } catch {
      showToast('Failed to update plugin', 'error')
    }
  }

  const copyEmbedCode = () => {
    const code = `<iframe src="${window.location.origin}?store=${businessSlug}" width="100%" height="600" frameborder="0" style="border:1px solid #e5e7eb;border-radius:12px;"></iframe>`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyWidgetCode = () => {
    const code = `<!-- LocalBiz Connect Widget -->
<div id="localbiz-widget"></div>
<script>
  (function(){
    var s=document.createElement('script');
    s.src='${window.location.origin}/widget.js';
    s.setAttribute('data-store','${businessSlug}');
    s.setAttribute('data-theme','emerald');
    document.getElementById('localbiz-widget').appendChild(s);
  })();
</script>`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyApiCode = () => {
    const code = `// API Access — fetch your store data
const API = '${window.location.origin}/api'

// Get store info
const store = await fetch(\`\${API}/store/${businessSlug}\`).then(r=>r.json())

// Get products
const products = await fetch(\`\${API}/products?businessId=${businessId}\`).then(r=>r.json())

// Create order (from your website)
const order = await fetch(\`\${API}/orders\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessId: '${businessId}',
    customerName: 'John',
    customerPhone: '0821234567',
    items: JSON.stringify([{name:'Product',qty:1,price:100}]),
    subtotal: 100, deliveryFee: 0, total: 100,
    deliveryMethod: 'pickup'
  })
}).then(r=>r.json())`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const categories = [
    { id: 'all', label: 'All Plugins', icon: <Puzzle className="h-4 w-4" /> },
    { id: 'connect', label: 'Connect', icon: <Link2 className="h-4 w-4" /> },
    { id: 'ai', label: 'AI Engines', icon: <Zap className="h-4 w-4" /> },
    { id: 'agents', label: 'AI Agents', icon: <Settings className="h-4 w-4" /> },
    { id: 'visibility', label: 'Visibility', icon: <Globe className="h-4 w-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'operations', label: 'Operations', icon: <Truck className="h-4 w-4" /> },
    { id: 'marketing', label: 'Marketing', icon: <Mail className="h-4 w-4" /> },
  ]

  const filtered = activeCategory === 'all' ? plugins : plugins.filter(p => p.category === activeCategory)
  const enabledCount = plugins.filter(p => p.enabled).length

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Puzzle className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{plugins.length}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{enabledCount}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Store className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{plugins.length - enabledCount}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Embed & API Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="h-5 w-5 text-emerald-600" />
            Plug Into Any Website
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1"
              onClick={copyEmbedCode}
            >
              <Code className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium">
                {copied ? '✓ Copied!' : 'Embed iFrame'}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1"
              onClick={copyWidgetCode}
            >
              <Smartphone className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-medium">Widget Script</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1"
              onClick={copyApiCode}
            >
              <Key className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-medium">API Access</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Paste any code above into your existing website to connect your store
          </p>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.icon}
            <span className="hidden sm:inline">{cat.label}</span>
          </Button>
        ))}
      </div>

      {/* Plugin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(plugin => (
          <Card
            key={plugin.id}
            className={`border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              plugin.enabled ? 'ring-2 ring-emerald-200 bg-emerald-50/30' : ''
            }`}
            onClick={() => setSelectedPlugin(selectedPlugin?.slug === plugin.slug ? null : plugin)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg ${plugin.color} flex items-center justify-center shrink-0`}>
                    {plugin.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{plugin.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{plugin.description}</p>
                  </div>
                </div>
                <Badge
                  variant={plugin.enabled ? 'default' : 'outline'}
                  className={`shrink-0 ${plugin.enabled ? 'bg-emerald-600' : ''}`}
                >
                  {plugin.enabled ? 'ON' : 'OFF'}
                </Badge>
              </div>

              {selectedPlugin?.slug === plugin.slug && (
                <div className="mt-4 space-y-3" onClick={e => e.stopPropagation()}>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Setup Steps:</p>
                    <ol className="space-y-1.5">
                      {plugin.setupSteps.map((step, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {plugin.slug === 'embed-widget' && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium mb-1">Embed Code:</p>
                      <code className="text-[10px] text-gray-600 break-all block">
                        {`<iframe src="${window.location.origin}?store=${businessSlug}" width="100%" height="600" frameborder="0"></iframe>`}
                      </code>
                    </div>
                  )}

                  {plugin.slug === 'pos-integration' && (
                    <div className="space-y-2">
                      <Label className="text-xs">POS API Key</Label>
                      <Input
                        placeholder="Enter your POS API key"
                        className="h-8 text-xs"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                      />
                    </div>
                  )}

                  {plugin.actionUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => window.open(plugin.actionUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open {plugin.name}
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant={plugin.enabled ? 'destructive' : 'default'}
                    onClick={() => togglePlugin(plugin)}
                    className="w-full"
                  >
                    {plugin.enabled ? 'Disable Plugin' : 'Enable Plugin'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How Plugins Work */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            How Plugins Work
          </h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Enable a plugin above — it connects to your store data' },
              { step: '2', text: 'Follow the setup steps — each plugin has clear instructions' },
              { step: '3', text: 'The plugin works in the background — syncing, marketing, delivering' },
              { step: '4', text: 'You focus on your craft — the AI handles the business side' },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {item.step}
                </span>
                <p className="text-xs text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Integration */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Settings className="h-4 w-4 text-purple-600" />
            AI-Powered Auto-Configuration
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            When you enable a plugin, AI automatically configures it for your business:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Auto-maps product categories',
              'Generates SEO-friendly descriptions',
              'Sets optimal delivery zones',
              'Creates marketing templates',
              'Configures payment flows',
              'Syncs inventory rules',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3 w-3 text-purple-600 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
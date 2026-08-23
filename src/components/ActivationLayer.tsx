import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Zap, Activity, CheckCircle2, XCircle, AlertTriangle, Clock,
  Brain, Bot, Shield, Globe, Database, Wifi, Server, Lock,
  DollarSign, MapPin, Bell, MessageCircle, Mail, Send,
  TrendingUp, TrendingDown, RefreshCw, Power, Settings,
  Eye, Rocket, BarChart3, Users, ShoppingCart, Search,
  FileText, Cpu, HardDrive, Radio, Layers, Network,
  ArrowUpRight, ArrowDownRight, Minus, Sparkles, Target,
  Gauge, ThermometerSun, Workflow, Megaphone, Heart,
  AlertCircle, CircleDot, ZapOff, Wrench, StopCircle,
  PlayCircle, RotateCcw, Maximize2, Minimize2
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }

interface Props {
  business: Business
  showToast: (msg: string, type?: 'success' | 'error') => void
  onOpenEngine?: (id: string) => void
}

type ModuleStatus = 'active' | 'warning' | 'degraded' | 'offline' | 'optimizing' | 'high_load' | 'failed' | 'recovering'

interface SystemModule {
  slug: string; name: string; category: string; icon: any
  status: ModuleStatus; enabled: boolean; load: number
  uptime: string; requests: number; lastEvent?: string
}

interface AIAgentStatus {
  slug: string; name: string; icon: any
  status: 'running' | 'idle' | 'error' | 'learning'
  inferenceLoad: number; memoryMb: number; queueDepth: number
  responseMs: number; successRate: number; actionsToday: number
  regions: string[]; connectedServices: string[]
}

interface AIModel {
  slug: string; name: string; provider: string
  assignedTo: string[]; enabled: boolean
  inferenceSpeed: string; costPer1k: string
}

interface APIService {
  slug: string; name: string; category: string
  uptime: number; responseMs: number; errorRate: number
  trafficLoad: number; status: 'healthy' | 'degraded' | 'down'
}

interface Event {
  id: string; type: string; title: string; source: string
  time: string; severity: 'info' | 'warning' | 'critical' | 'success'
}

const STATUS_CONFIG: Record<ModuleStatus, { color: string; bg: string; label: string; pulse: boolean }> = {
  active:     { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'ACTIVE', pulse: true },
  warning:    { color: 'text-amber-500',   bg: 'bg-amber-500',   label: 'WARNING', pulse: true },
  degraded:   { color: 'text-orange-500',  bg: 'bg-orange-500',  label: 'DEGRADED', pulse: true },
  offline:    { color: 'text-red-500',     bg: 'bg-red-500',     label: 'OFFLINE', pulse: false },
  optimizing: { color: 'text-blue-500',    bg: 'bg-blue-500',    label: 'AI OPTIMIZING', pulse: true },
  high_load:  { color: 'text-purple-500',  bg: 'bg-purple-500',  label: 'HIGH LOAD', pulse: true },
  failed:     { color: 'text-red-600',     bg: 'bg-red-600',     label: 'FAILED', pulse: false },
  recovering: { color: 'text-cyan-500',    bg: 'bg-cyan-500',    label: 'RECOVERING', pulse: true },
}

const ALL_MODULES: Omit<SystemModule, 'status' | 'enabled' | 'load' | 'uptime' | 'requests'>[] = [
  // Storefront Systems
  { slug: 'product-discovery', name: 'Product Discovery', category: 'Storefront', icon: Search },
  { slug: 'search-engine', name: 'Search Engine', category: 'Storefront', icon: Globe },
  { slug: 'ai-recommendations', name: 'AI Recommendations', category: 'Storefront', icon: Sparkles },
  { slug: 'localization', name: 'Localization Engine', category: 'Storefront', icon: Globe },
  { slug: 'nearby-business', name: 'Nearby Business', category: 'Storefront', icon: MapPin },
  { slug: 'wishlist', name: 'Wishlist System', category: 'Storefront', icon: Heart },
  { slug: 'reviews', name: 'Reviews System', category: 'Storefront', icon: Star },
  { slug: 'customer-wallet', name: 'Customer Wallet', category: 'Storefront', icon: DollarSign },
  { slug: 'campaign-banners', name: 'Campaign Banners', category: 'Storefront', icon: Megaphone },
  { slug: 'social-feeds', name: 'Social Feeds', category: 'Storefront', icon: Users },
  // Seller Systems
  { slug: 'store-builder', name: 'Store Builder', category: 'Seller', icon: Rocket },
  { slug: 'product-manager', name: 'Product Manager', category: 'Seller', icon: Package },
  { slug: 'inventory-engine', name: 'Inventory Engine', category: 'Seller', icon: Layers },
  { slug: 'analytics-engine', name: 'Analytics Engine', category: 'Seller', icon: BarChart3 },
  { slug: 'seller-wallet', name: 'Seller Wallet', category: 'Seller', icon: DollarSign },
  { slug: 'tax-system', name: 'Tax System', category: 'Seller', icon: FileText },
  { slug: 'ai-seller-assistant', name: 'AI Seller Assistant', category: 'Seller', icon: Bot },
  { slug: 'promotion-engine', name: 'Promotion Engine', category: 'Seller', icon: TrendingUp },
  { slug: 'delivery-tools', name: 'Delivery Tools', category: 'Seller', icon: MapPin },
  // Admin Systems
  { slug: 'mall-wallet', name: 'Mall Wallet', category: 'Admin', icon: DollarSign },
  { slug: 'fraud-engine', name: 'Fraud Engine', category: 'Admin', icon: Shield },
  { slug: 'ai-orchestration', name: 'AI Orchestration', category: 'Admin', icon: Brain },
  { slug: 'regional-systems', name: 'Regional Systems', category: 'Admin', icon: Globe },
  { slug: 'security-systems', name: 'Security Systems', category: 'Admin', icon: Lock },
  { slug: 'seller-governance', name: 'Seller Governance', category: 'Admin', icon: Users },
  { slug: 'infra-monitoring', name: 'Infrastructure Monitoring', category: 'Admin', icon: Server },
  { slug: 'campaign-engine', name: 'Campaign Engine', category: 'Admin', icon: Megaphone },
]

const AI_AGENTS: Omit<AIAgentStatus, 'inferenceLoad' | 'memoryMb' | 'queueDepth' | 'responseMs' | 'successRate' | 'actionsToday'>[] = [
  { slug: 'seller-agent', name: 'AI Seller Agent', icon: Bot, status: 'idle', regions: ['Gauteng'], connectedServices: ['store-builder', 'inventory'] },
  { slug: 'customer-agent', name: 'AI Customer Agent', icon: Users, status: 'idle', regions: ['National'], connectedServices: ['search', 'recommendations'] },
  { slug: 'fraud-agent', name: 'AI Fraud Agent', icon: Shield, status: 'idle', regions: ['National'], connectedServices: ['payments', 'orders'] },
  { slug: 'localization-agent', name: 'AI Localization Agent', icon: Globe, status: 'idle', regions: ['Gauteng', 'WC', 'KZN'], connectedServices: ['translation', 'nearby'] },
  { slug: 'marketing-agent', name: 'AI Marketing Agent', icon: Megaphone, status: 'idle', regions: ['National'], connectedServices: ['campaigns', 'social'] },
  { slug: 'search-agent', name: 'AI Search Agent', icon: Search, status: 'idle', regions: ['National'], connectedServices: ['search-engine', 'discovery'] },
  { slug: 'seo-agent', name: 'AI SEO Agent', icon: Target, status: 'idle', regions: ['National'], connectedServices: ['seo', 'content'] },
  { slug: 'translation-agent', name: 'AI Translation Agent', icon: Globe, status: 'idle', regions: ['National'], connectedServices: ['localization', 'content'] },
]

const AI_MODELS: AIModel[] = [
  { slug: 'llama3', name: 'Llama 3', provider: 'Meta', assignedTo: ['customer-support'], enabled: true, inferenceSpeed: '45ms', costPer1k: '$0.00' },
  { slug: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', assignedTo: ['recommendations'], enabled: false, inferenceSpeed: '52ms', costPer1k: '$0.00' },
  { slug: 'qwen', name: 'Qwen', provider: 'Alibaba', assignedTo: ['translations'], enabled: false, inferenceSpeed: '38ms', costPer1k: '$0.00' },
  { slug: 'mistral', name: 'Mistral', provider: 'Mistral AI', assignedTo: ['seo-generation'], enabled: true, inferenceSpeed: '41ms', costPer1k: '$0.001' },
  { slug: 'gemma', name: 'Gemma', provider: 'Google', assignedTo: [], enabled: false, inferenceSpeed: '35ms', costPer1k: '$0.00' },
  { slug: 'phi', name: 'Phi', provider: 'Microsoft', assignedTo: ['seller-assistance'], enabled: true, inferenceSpeed: '28ms', costPer1k: '$0.00' },
]

const API_SERVICES: Omit<APIService, 'uptime' | 'responseMs' | 'errorRate' | 'trafficLoad' | 'status'>[] = [
  { slug: 'banking-api', name: 'Banking API', category: 'Finance' },
  { slug: 'payment-gateway', name: 'Payment Gateway', category: 'Finance' },
  { slug: 'shipping-api', name: 'Shipping API', category: 'Logistics' },
  { slug: 'ai-api', name: 'AI API', category: 'AI' },
  { slug: 'translation-api', name: 'Translation API', category: 'AI' },
  { slug: 'social-media-api', name: 'Social Media API', category: 'Marketing' },
  { slug: 'maps-api', name: 'Maps API', category: 'Location' },
  { slug: 'notification-api', name: 'Notification API', category: 'Communication' },
]

const NOTIFICATION_CHANNELS = [
  { slug: 'push', name: 'Push Notifications', icon: Bell, enabled: true, sentToday: 124 },
  { slug: 'sms', name: 'SMS', icon: MessageCircle, enabled: true, sentToday: 47 },
  { slug: 'email', name: 'Email', icon: Mail, enabled: true, sentToday: 312 },
  { slug: 'whatsapp', name: 'WhatsApp Alerts', icon: Send, enabled: true, sentToday: 89 },
  { slug: 'in-app', name: 'In-App Notifications', icon: Bell, enabled: true, sentToday: 567 },
]

const PAYMENT_SYSTEMS = [
  { slug: 'escrow', name: 'Escrow Engine', enabled: true, volume: 'R 45,200' },
  { slug: 'payout', name: 'Payout Engine', enabled: true, volume: 'R 32,100' },
  { slug: 'refund', name: 'Refund Engine', enabled: true, volume: 'R 2,340' },
  { slug: 'dispute', name: 'Dispute Holds', enabled: true, volume: 'R 1,200' },
  { slug: 'monitoring', name: 'Transaction Monitoring', enabled: true, volume: 'R 89,400' },
]

const LOCAL_ECONOMY = [
  { slug: 'same-street', name: 'Same Street Discovery', enabled: true, strength: 92 },
  { slug: 'nearby-visibility', name: 'Nearby Street Visibility', enabled: true, strength: 87 },
  { slug: 'suburb-ranking', name: 'Suburb Ranking', enabled: true, strength: 78 },
  { slug: 'regional-priority', name: 'Regional Prioritization', enabled: true, strength: 85 },
  { slug: 'local-delivery', name: 'Local Delivery Optimization', enabled: true, strength: 91 },
]

function Star({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
}

function StatusDot({ status }: { status: ModuleStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className="relative flex h-2.5 w-2.5">
      {cfg.pulse && <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.bg} opacity-75 animate-ping`} />}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cfg.bg}`} />
    </span>
  )
}

function ModuleCard({ mod, onToggle }: { mod: SystemModule; onToggle: (slug: string) => void }) {
  const cfg = STATUS_CONFIG[mod.status]
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${mod.enabled ? 'bg-white hover:shadow-sm' : 'bg-gray-50 opacity-60'}`}>
      <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${mod.enabled ? 'from-emerald-500 to-teal-600' : 'from-gray-300 to-gray-400'} flex items-center justify-center shrink-0`}>
        <mod.icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{mod.name}</p>
          <StatusDot status={mod.status} />
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          <span className="text-xs text-muted-foreground">Load: {mod.load}%</span>
          <span className="text-xs text-muted-foreground">{mod.uptime}</span>
        </div>
      </div>
      <Switch checked={mod.enabled} onCheckedChange={() => onToggle(mod.slug)} />
    </div>
  )
}

function AgentCard({ agent, onToggle }: { agent: AIAgentStatus; onToggle: (slug: string) => void }) {
  const statusColors: Record<string, string> = {
    running: 'bg-emerald-500', idle: 'bg-slate-400', error: 'bg-red-500', learning: 'bg-blue-500'
  }
  return (
    <div className="p-4 rounded-xl border bg-white hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <agent.icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{agent.name}</p>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${statusColors[agent.status]}`} />
            <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
          </div>
        </div>
        <Switch checked={agent.status !== 'idle'} onCheckedChange={() => onToggle(agent.slug)} />
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center p-1.5 rounded-lg bg-slate-50">
          <p className="text-xs text-muted-foreground">CPU</p>
          <p className="text-sm font-bold">{agent.inferenceLoad}%</p>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-slate-50">
          <p className="text-xs text-muted-foreground">RAM</p>
          <p className="text-sm font-bold">{agent.memoryMb}MB</p>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-slate-50">
          <p className="text-xs text-muted-foreground">Queue</p>
          <p className="text-sm font-bold">{agent.queueDepth}</p>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-slate-50">
          <p className="text-xs text-muted-foreground">Speed</p>
          <p className="text-sm font-bold">{agent.responseMs}ms</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {agent.regions.map(r => (
            <Badge key={r} variant="secondary" className="text-[10px] px-1.5 py-0">{r}</Badge>
          ))}
        </div>
        <span className="text-xs text-emerald-600 font-medium">{agent.successRate}% OK</span>
      </div>
    </div>
  )
}

function ModelRow({ model, onToggle }: { model: AIModel; onToggle: (slug: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm transition">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${model.enabled ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
        {model.name.slice(0, 2)}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{model.name}</p>
        <p className="text-xs text-muted-foreground">{model.provider} · {model.inferenceSpeed} · {model.costPer1k}/1k</p>
      </div>
      <div className="flex gap-1 flex-wrap max-w-[180px]">
        {model.assignedTo.map(t => (
          <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
        ))}
      </div>
      <Switch checked={model.enabled} onCheckedChange={() => onToggle(model.slug)} />
    </div>
  )
}

function APIRow({ api }: { api: APIService }) {
  const statusColor = api.status === 'healthy' ? 'text-emerald-500' : api.status === 'degraded' ? 'text-amber-500' : 'text-red-500'
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-white">
      <div className={`h-3 w-3 rounded-full ${api.status === 'healthy' ? 'bg-emerald-500' : api.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{api.name}</p>
        <p className="text-xs text-muted-foreground">{api.category}</p>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center text-xs">
        <div><p className="text-muted-foreground">Uptime</p><p className="font-bold">{api.uptime}%</p></div>
        <div><p className="text-muted-foreground">Latency</p><p className="font-bold">{api.responseMs}ms</p></div>
        <div><p className="text-muted-foreground">Errors</p><p className={`font-bold ${api.errorRate > 1 ? 'text-red-500' : ''}`}>{api.errorRate}%</p></div>
        <div><p className="text-muted-foreground">Traffic</p><p className="font-bold">{api.trafficLoad}%</p></div>
      </div>
      <span className={`text-xs font-medium ${statusColor}`}>{api.status.toUpperCase()}</span>
    </div>
  )
}

function EventRow({ event }: { event: Event }) {
  const severityColors: Record<string, string> = {
    info: 'border-l-blue-500', warning: 'border-l-amber-500',
    critical: 'border-l-red-500', success: 'border-l-emerald-500'
  }
  const severityIcons: Record<string, any> = {
    info: Info, warning: AlertTriangle, critical: XCircle, success: CheckCircle2
  }
  const Icon = severityIcons[event.type] || Info
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border-l-4 bg-white ${severityColors[event.severity]} transition`}>
      <Icon className={`h-4 w-4 shrink-0 ${event.severity === 'critical' ? 'text-red-500' : event.severity === 'warning' ? 'text-amber-500' : event.severity === 'success' ? 'text-emerald-500' : 'text-blue-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{event.title}</p>
        <p className="text-xs text-muted-foreground">{event.source} · {event.time}</p>
      </div>
      <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'} className="text-[10px]">{event.type}</Badge>
    </div>
  )
}

function Info({ className }: { className?: string }) {
  return <AlertCircle className={className} />
}

function Package({ className }: { className?: string }) {
  return <ShoppingCart className={className} />
}

export default function ActivationLayer({ business, showToast }: Props) {
  const [modules, setModules] = useState<SystemModule[]>([])
  const [agents, setAgents] = useState<AIAgentStatus[]>([])
  const [models, setModels] = useState<AIModel[]>(AI_MODELS)
  const [apis, setApis] = useState<APIService[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [notifChannels, setNotifChannels] = useState(NOTIFICATION_CHANNELS)
  const [payments, setPayments] = useState(PAYMENT_SYSTEMS)
  const [localEcon, setLocalEcon] = useState(LOCAL_ECONOMY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initModules: SystemModule[] = ALL_MODULES.map(m => ({
      ...m,
      status: (['active', 'active', 'active', 'warning', 'optimizing', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active'] as ModuleStatus[])[ALL_MODULES.indexOf(m)] || 'active',
      enabled: true,
      load: Math.floor(Math.random() * 40) + 20,
      uptime: '99.9%',
      requests: Math.floor(Math.random() * 5000) + 1000,
    }))
    setModules(initModules)

    const initAgents: AIAgentStatus[] = AI_AGENTS.map(a => ({
      ...a,
      inferenceLoad: Math.floor(Math.random() * 30) + 10,
      memoryMb: Math.floor(Math.random() * 200) + 50,
      queueDepth: Math.floor(Math.random() * 5),
      responseMs: Math.floor(Math.random() * 30) + 20,
      successRate: 95 + Math.floor(Math.random() * 5),
      actionsToday: Math.floor(Math.random() * 200),
    }))
    setAgents(initAgents)

    const initApis: APIService[] = API_SERVICES.map(a => ({
      ...a,
      uptime: 99 + Math.random(),
      responseMs: Math.floor(Math.random() * 100) + 20,
      errorRate: Math.random() * 2,
      trafficLoad: Math.floor(Math.random() * 60) + 20,
      status: Math.random() > 0.9 ? 'degraded' : 'healthy',
    }))
    setApis(initApis)

    const sampleEvents: Event[] = [
      { id: '1', type: 'new_order', title: 'New order #ORD-4521 received', source: 'Order Engine', time: '2 min ago', severity: 'success' },
      { id: '2', type: 'fraud_alert', title: 'Suspicious payment detected', source: 'Fraud Engine', time: '5 min ago', severity: 'warning' },
      { id: '3', type: 'ai_recommendation', title: 'AI generated 12 product recommendations', source: 'AI Engine', time: '8 min ago', severity: 'info' },
      { id: '4', type: 'nearby_activity', title: '3 customers browsing within 2km', source: 'Local Economy', time: '12 min ago', severity: 'info' },
      { id: '5', type: 'campaign_click', title: 'Promo campaign got 47 clicks', source: 'Campaign Engine', time: '15 min ago', severity: 'success' },
      { id: '6', type: 'system_alert', title: 'API response time elevated', source: 'Infrastructure', time: '18 min ago', severity: 'warning' },
      { id: '7', type: 'payment', title: 'R 1,240 payout processed', source: 'Payment Engine', time: '22 min ago', severity: 'success' },
      { id: '8', type: 'security', title: 'Firewall blocked 3 attempts', source: 'Security Center', time: '30 min ago', severity: 'critical' },
    ]
    setEvents(sampleEvents)

    setTimeout(() => setLoading(false), 600)
  }, [business.id])

  const toggleModule = useCallback((slug: string) => {
    setModules(prev => prev.map(m => m.slug === slug ? { ...m, enabled: !m.enabled, status: m.enabled ? 'offline' : 'active' } : m))
    showToast(`Module ${slug} ${modules.find(m => m.slug === slug)?.enabled ? 'deactivated' : 'activated'}`)
  }, [modules, showToast])

  const toggleAgent = useCallback((slug: string) => {
    setAgents(prev => prev.map(a => a.slug === slug ? { ...a, status: a.status === 'idle' ? 'running' : 'idle' } : a))
  }, [])

  const toggleModel = useCallback((slug: string) => {
    setModels(prev => prev.map(m => m.slug === slug ? { ...m, enabled: !m.enabled } : m))
  }, [])

  const toggleNotif = useCallback((slug: string) => {
    setNotifChannels(prev => prev.map(n => n.slug === slug ? { ...n, enabled: !n.enabled } : n))
  }, [])

  const togglePayment = useCallback((slug: string) => {
    setPayments(prev => prev.map(p => p.slug === slug ? { ...p, enabled: !p.enabled } : p))
  }, [])

  const toggleLocalEcon = useCallback((slug: string) => {
    setLocalEcon(prev => prev.map(e => e.slug === slug ? { ...e, enabled: !e.enabled } : e))
  }, [])

  const stats = useMemo(() => ({
    totalModules: modules.length,
    activeModules: modules.filter(m => m.enabled).length,
    totalAgents: agents.length,
    runningAgents: agents.filter(a => a.status === 'running').length,
    avgHealth: modules.length ? Math.round(modules.filter(m => m.status === 'active').length / modules.length * 100) : 0,
    avgLoad: modules.length ? Math.round(modules.reduce((s, m) => s + m.load, 0) / modules.length) : 0,
    healthyAPIs: apis.filter(a => a.status === 'healthy').length,
    totalAPIs: apis.length,
    criticalEvents: events.filter(e => e.severity === 'critical').length,
  }), [modules, agents, apis, events])

  const categories = useMemo(() => [...new Set(ALL_MODULES.map(m => m.category))], [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground font-medium">Initializing Activation Layer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-emerald-500" />
            Activation Layer
          </h1>
          <p className="text-muted-foreground text-sm">Central control system for {business.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            SYSTEMS ONLINE
          </Badge>
          <Button variant="outline" size="sm" onClick={() => showToast('All modules refreshed')}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh All
          </Button>
        </div>
      </div>

      {/* ━━━ OVERVIEW STRIP ━━━ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Modules Online', value: `${stats.activeModules}/${stats.totalModules}`, icon: Layers, color: 'text-emerald-500' },
          { label: 'System Health', value: `${stats.avgHealth}%`, icon: Heart, color: stats.avgHealth > 80 ? 'text-emerald-500' : 'text-amber-500' },
          { label: 'AI Agents', value: `${stats.runningAgents}/${stats.totalAgents}`, icon: Bot, color: 'text-purple-500' },
          { label: 'API Health', value: `${stats.healthyAPIs}/${stats.totalAPIs}`, icon: Wifi, color: 'text-blue-500' },
          { label: 'Avg Load', value: `${stats.avgLoad}%`, icon: Gauge, color: stats.avgLoad > 70 ? 'text-red-500' : 'text-emerald-500' },
        ].map(s => (
          <Card key={s.label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ━━━ MAIN TABS ━━━ */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="modules" className="text-xs"><Layers className="h-3 w-3 mr-1" />Modules</TabsTrigger>
          <TabsTrigger value="ai-agents" className="text-xs"><Bot className="h-3 w-3 mr-1" />AI Agents</TabsTrigger>
          <TabsTrigger value="ai-models" className="text-xs"><Brain className="h-3 w-3 mr-1" />AI Models</TabsTrigger>
          <TabsTrigger value="infrastructure" className="text-xs"><Server className="h-3 w-3 mr-1" />Infrastructure</TabsTrigger>
          <TabsTrigger value="security" className="text-xs"><Shield className="h-3 w-3 mr-1" />Security</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs"><DollarSign className="h-3 w-3 mr-1" />Payments</TabsTrigger>
          <TabsTrigger value="local-economy" className="text-xs"><MapPin className="h-3 w-3 mr-1" />Local Economy</TabsTrigger>
          <TabsTrigger value="events" className="text-xs"><Radio className="h-3 w-3 mr-1" />Events</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs"><Bell className="h-3 w-3 mr-1" />Notifications</TabsTrigger>
        </TabsList>

        {/* ━━━ MODULES TAB ━━━ */}
        <TabsContent value="modules" className="space-y-4">
          {categories.map(cat => (
            <Card key={cat}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {cat === 'Storefront' ? <Globe className="h-4 w-4 text-blue-500" /> :
                   cat === 'Seller' ? <Rocket className="h-4 w-4 text-emerald-500" /> :
                   <Shield className="h-4 w-4 text-purple-500" />}
                  {cat} Systems
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {modules.filter(m => m.category === cat && m.enabled).length}/{modules.filter(m => m.category === cat).length} active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.filter(m => m.category === cat).map(mod => (
                  <ModuleCard key={mod.slug} mod={mod} onToggle={toggleModule} />
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ━━━ AI AGENTS TAB ━━━ */}
        <TabsContent value="ai-agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-500" />
                AI Agent Control Center
                <Badge variant="secondary" className="ml-auto text-xs">
                  {agents.filter(a => a.status === 'running').length} running
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {agents.map(agent => (
                  <AgentCard key={agent.slug} agent={agent} onToggle={toggleAgent} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ AI MODELS TAB ━━━ */}
        <TabsContent value="ai-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-violet-500" />
                AI Model Activation Layer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {models.map(model => (
                <ModelRow key={model.slug} model={model} onToggle={toggleModel} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ INFRASTRUCTURE TAB ━━━ */}
        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-500" />
                API & Service Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {apis.map(api => (
                <APIRow key={api.slug} api={api} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-500" />
                Database Control Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'PostgreSQL', status: 'healthy', load: 42, storage: '2.1 GB' },
                  { name: 'Redis', status: 'healthy', load: 28, storage: '512 MB' },
                  { name: 'MongoDB', status: 'healthy', load: 35, storage: '1.8 GB' },
                  { name: 'Qdrant', status: 'healthy', load: 19, storage: '890 MB' },
                ].map(db => (
                  <div key={db.name} className="p-3 rounded-xl border bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-cyan-500" />
                      <span className="font-medium text-sm">{db.name}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-emerald-500 font-medium">{db.status}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Load</span><span className="font-medium">{db.load}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Storage</span><span className="font-medium">{db.storage}</span></div>
                    </div>
                    <Progress value={db.load} className="h-1 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ SECURITY TAB ━━━ */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                Security Activation Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { name: 'Fraud Detection', status: 'active', icon: Shield, threats: 3, last: '2 min ago' },
                  { name: 'Firewall', status: 'active', icon: Lock, threats: 12, last: '5 min ago' },
                  { name: 'Threat Detection', status: 'active', icon: Eye, threats: 1, last: '8 min ago' },
                  { name: 'AI Anomaly Detection', status: 'active', icon: Brain, threats: 0, last: '12 min ago' },
                  { name: 'Account Protection', status: 'active', icon: Users, threats: 2, last: '15 min ago' },
                  { name: 'Payment Protection', status: 'active', icon: DollarSign, threats: 0, last: '20 min ago' },
                ].map(s => (
                  <div key={s.name} className="p-4 rounded-xl border bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-emerald-500 font-medium">{s.status.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Threats Blocked</span><span className="font-medium">{s.threats}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Last Check</span><span className="font-medium">{s.last}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ PAYMENTS TAB ━━━ */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Payment Activation Layer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {payments.map(p => (
                <div key={p.slug} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Volume: {p.volume}</p>
                  </div>
                  <Switch checked={p.enabled} onCheckedChange={() => togglePayment(p.slug)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ LOCAL ECONOMY TAB ━━━ */}
        <TabsContent value="local-economy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Local Economy Activation Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {localEcon.map(e => (
                <div key={e.slug} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{e.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={e.strength} className="h-1.5 flex-1" />
                      <span className="text-xs font-bold">{e.strength}%</span>
                    </div>
                  </div>
                  <Switch checked={e.enabled} onCheckedChange={() => toggleLocalEcon(e.slug)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ EVENTS TAB ━━━ */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Radio className="h-4 w-4 text-blue-500" />
                Real-Time Event Stream
                <Badge variant="secondary" className="ml-auto text-xs">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse mr-1" />
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {events.map(event => (
                <EventRow key={event.id} event={event} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ NOTIFICATIONS TAB ━━━ */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                Notification Activation Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifChannels.map(n => (
                <div key={n.slug} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <n.icon className="h-5 w-5 text-amber-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{n.name}</p>
                    <p className="text-xs text-muted-foreground">Sent today: {n.sentToday.toLocaleString()}</p>
                  </div>
                  <Switch checked={n.enabled} onCheckedChange={() => toggleNotif(n.slug)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

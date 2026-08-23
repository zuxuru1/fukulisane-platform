import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Brain, Activity, TrendingUp, TrendingDown, AlertTriangle,
  Users, DollarSign, Target, Heart, Zap, BarChart3,
  RefreshCw, CheckCircle2, XCircle, Clock, Bot,
  Lightbulb, Rocket, Shield, ArrowUpRight, ArrowDownRight,
  Minus, Eye, Megaphone, Search, Handshake, Sparkles,
  ShoppingCart, ChevronRight, Globe, TrendingUp as Revenue,
  Network, Settings, BookOpen, Layers
} from 'lucide-react'

interface Business {
  id: string; name: string; category?: string; slug?: string;
}

interface EngineData {
  id: string; label: string; icon: any; color: string;
  purpose: string; successMetric: string;
  health: number; status: 'active' | 'learning' | 'idle' | 'alert';
  lastAction?: string; actionsToday: number;
  feedsInto: string[];
}

interface Priority {
  id: string; title: string; engine: string; type: 'risk' | 'opportunity' | 'action';
  impact: string; roi?: string; urgent?: boolean;
}

interface Props {
  business: Business
  showToast: (msg: string, type?: 'success' | 'error') => void
  onOpenEngine?: (id: string) => void
}

const ALL_ENGINES: EngineData[] = [
  { id: 'intelligence', label: 'Business Intelligence', icon: Brain, color: 'from-purple-500 to-indigo-600', purpose: 'Diagnose business health', successMetric: 'Health score improves', health: 82, status: 'active', actionsToday: 14, feedsInto: ['sales', 'marketing', 'lead'] },
  { id: 'lead', label: 'Lead Engine', icon: Target, color: 'from-blue-500 to-cyan-600', purpose: 'Find qualified prospects', successMetric: 'More qualified leads', health: 68, status: 'active', lastAction: 'Found 3 hot leads on Instagram', actionsToday: 8, feedsInto: ['sales', 'customer'] },
  { id: 'sales', label: 'Sales Engine', icon: TrendingUp, color: 'from-green-500 to-emerald-600', purpose: 'Convert leads to revenue', successMetric: 'Higher conversion rate', health: 75, status: 'active', lastAction: 'Converted 2 inquiries today', actionsToday: 5, feedsInto: ['intelligence', 'financial'] },
  { id: 'marketing', label: 'Marketing Engine', icon: Megaphone, color: 'from-orange-500 to-red-600', purpose: 'Create and distribute content', successMetric: 'Lower acquisition cost', health: 88, status: 'active', lastAction: 'Posted 3 stories to Instagram', actionsToday: 12, feedsInto: ['lead', 'community', 'seo'] },
  { id: 'customer', label: 'Customer Success', icon: Heart, color: 'from-pink-500 to-rose-600', purpose: 'Keep customers happy', successMetric: 'Higher retention rate', health: 71, status: 'learning', lastAction: 'Analyzing churn patterns', actionsToday: 3, feedsInto: ['sales', 'community', 'intelligence'] },
  { id: 'community', label: 'Community Engine', icon: Users, color: 'from-violet-500 to-purple-600', purpose: 'Build loyal audiences', successMetric: 'More referrals', health: 59, status: 'learning', lastAction: 'Engaging 12 followers', actionsToday: 7, feedsInto: ['lead', 'marketing'] },
  { id: 'seo', label: 'SEO & Visibility', icon: Globe, color: 'from-teal-500 to-cyan-600', purpose: 'Increase discoverability', successMetric: 'More organic traffic', health: 64, status: 'active', lastAction: 'Optimized Google Business Profile', actionsToday: 4, feedsInto: ['lead', 'intelligence'] },
  { id: 'competitor', label: 'Competitor Intelligence', icon: Eye, color: 'from-slate-500 to-zinc-600', purpose: 'Identify market opportunities', successMetric: 'Faster market response', health: 45, status: 'idle', lastAction: 'Tracking 5 competitors', actionsToday: 2, feedsInto: ['marketing', 'intelligence'] },
  { id: 'financial', label: 'Financial Intelligence', icon: DollarSign, color: 'from-emerald-500 to-green-600', purpose: 'Improve profitability', successMetric: 'Higher profit margin', health: 78, status: 'active', lastAction: 'Optimized pricing on 3 products', actionsToday: 6, feedsInto: ['sales', 'intelligence', 'funding'] },
  { id: 'funding', label: 'Funding Engine', icon: Rocket, color: 'from-amber-500 to-orange-600', purpose: 'Unlock growth capital', successMetric: 'Funding readiness score', health: 32, status: 'idle', lastAction: 'Building financial history', actionsToday: 1, feedsInto: ['partnership'] },
  { id: 'partnership', label: 'Partnership Engine', icon: Handshake, color: 'from-blue-500 to-indigo-600', purpose: 'Connect businesses', successMetric: 'Successful partnerships', health: 28, status: 'idle', lastAction: 'Scanning for matches', actionsToday: 0, feedsInto: ['intelligence'] },
  { id: 'learning', label: 'AI Learning Engine', icon: Network, color: 'from-fuchsia-500 to-pink-600', purpose: 'Improve recommendations', successMetric: 'Higher acceptance rate', health: 91, status: 'active', lastAction: 'Accepted 94% of suggestions', actionsToday: 22, feedsInto: ['intelligence'] },
  { id: 'digitaltwin', label: 'Business Digital Twin', icon: Sparkles, color: 'from-indigo-500 to-violet-600', purpose: 'Simulate business decisions', successMetric: 'Accurate impact predictions', health: 68, status: 'learning', lastAction: 'Modeled "hire 2 employees" scenario', actionsToday: 3, feedsInto: ['intelligence', 'financial'] },
]

const DEMO_PRIORITIES: Priority[] = [
  { id: '1', title: 'WhatsApp follow-up: 3 customers abandoned cart', engine: 'sales', type: 'action', impact: 'Recover R1,200 in potential revenue', roi: 'R1,200', urgent: true },
  { id: '2', title: 'Instagram post engagement dropped 15% this week', engine: 'marketing', type: 'risk', impact: 'Reach declining, brand visibility at risk' },
  { id: '3', title: 'New competitor opened 2km away offering 10% lower prices', engine: 'competitor', type: 'risk', impact: 'Potential 5-8% customer loss in 30 days', urgent: true },
  { id: '4', title: 'Opportunity: Partner with local real estate agents for builder referrals', engine: 'partnership', type: 'opportunity', impact: 'Access 50+ homebuyers needing construction services', roi: 'R45,000/quarter' },
  { id: '5', title: 'Google Business Profile updated — +23% views this week', engine: 'seo', type: 'action', impact: 'Organic traffic improving' },
  { id: '6', title: '3 customers at risk of churn — send win-back offer', engine: 'customer', type: 'action', impact: 'Retain R4,800 in lifetime value', roi: 'R4,800' },
  { id: '7', title: 'Revenue up 12% — consider increasing ad spend by R500', engine: 'financial', type: 'opportunity', impact: 'Projected 20% ROI on ad spend', roi: 'R1,000' },
  { id: '8', title: 'Funding readiness at 32% — build 3 more months of history', engine: 'funding', type: 'action', impact: 'Unlock R50K-200K growth capital' },
]

export default function AIMissionControl({ business, showToast, onOpenEngine }: Props) {
  const [engines] = useState<EngineData[]>(ALL_ENGINES)
  const [priorities] = useState<Priority[]>(DEMO_PRIORITIES)
  const [tab, setTab] = useState('overview')

  const overallHealth = useMemo(() => {
    const total = engines.reduce((s, e) => s + e.health, 0)
    return Math.round(total / engines.length)
  }, [engines])

  const activeEngines = engines.filter(e => e.status === 'active').length
  const totalActions = engines.reduce((s, e) => s + e.actionsToday, 0)
  const risks = priorities.filter(p => p.type === 'risk')
  const opportunities = priorities.filter(p => p.type === 'opportunity')
  const actions = priorities.filter(p => p.type === 'action')

  const healthColor = overallHealth >= 75 ? 'text-emerald-600' : overallHealth >= 50 ? 'text-amber-600' : 'text-red-600'
  const healthBg = overallHealth >= 75 ? 'from-emerald-500 to-green-600' : overallHealth >= 50 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Mission Control
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {business.name} — AI-powered Business Operating System
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {activeEngines}/{engines.length} engines active
        </Badge>
      </div>

      {/* ━━━ Top Stats ━━━ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${healthBg}`} />
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Business Health</p>
            <div className="flex items-end gap-2 mt-1">
              <p className={`text-3xl font-bold ${healthColor}`}>{overallHealth}</p>
              <p className="text-xs text-muted-foreground mb-1">/100</p>
            </div>
            <Progress value={overallHealth} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Actions Today</p>
            <p className="text-3xl font-bold mt-1">{totalActions}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> across {activeEngines} engines
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Risks Detected</p>
            <p className="text-3xl font-bold mt-1 text-red-600">{risks.length}</p>
            {risks.some(r => r.urgent) && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {risks.filter(r => r.urgent).length} urgent
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Opportunities</p>
            <p className="text-3xl font-bold mt-1 text-blue-600">{opportunities.length}</p>
            {opportunities.some(o => o.roi) && (
              <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> potential ROI available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Today</TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
          <TabsTrigger value="roi">ROI Tracker</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        {/* ━━━ TAB: Today's Overview ━━━ */}
        <TabsContent value="overview" className="space-y-4">
          {/* Priorities */}
          <div className="grid md:grid-cols-3 gap-3">
            {/* Risks */}
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                  <Shield className="h-4 w-4" /> Risks ({risks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {risks.map(r => (
                  <div key={r.id} className="p-2.5 rounded-lg bg-red-50 border border-red-100">
                    <div className="flex items-start gap-2">
                      {r.urgent && <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{r.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{r.impact}</p>
                        <Badge variant="outline" className="text-[10px] mt-1 border-red-200 text-red-600">
                          {engines.find(e => e.id === r.engine)?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {risks.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No risks detected ✨</p>}
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                  <Lightbulb className="h-4 w-4" /> Opportunities ({opportunities.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {opportunities.map(o => (
                  <div key={o.id} className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{o.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{o.impact}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600">
                            {engines.find(e => e.id === o.engine)?.label}
                          </Badge>
                          {o.roi && <span className="text-[10px] font-bold text-emerald-600">ROI: {o.roi}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {opportunities.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Scanning for opportunities...</p>}
              </CardContent>
            </Card>

            {/* Actions Needed */}
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                  <Zap className="h-4 w-4" /> Actions ({actions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {actions.map(a => (
                  <div key={a.id} className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex items-start gap-2">
                      <Zap className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{a.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{a.impact}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-600">
                            {engines.find(e => e.id === a.engine)?.label}
                          </Badge>
                          {a.roi && <span className="text-[10px] font-bold text-emerald-600">ROI: {a.roi}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {actions.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">All caught up! 🎉</p>}
              </CardContent>
            </Card>
          </div>

          {/* Engine Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" /> Engine Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {engines.map(eng => (
                  <button key={eng.id} onClick={() => onOpenEngine?.(eng.id)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted/50 transition text-left group">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${eng.color} flex items-center justify-center shrink-0`}>
                      <eng.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium truncate">{eng.label}</p>
                        {eng.status === 'active' && <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 shrink-0" />}
                        {eng.status === 'learning' && <Brain className="h-2.5 w-2.5 text-blue-500 shrink-0 animate-pulse" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{eng.actionsToday} actions today</p>
                    </div>
                    <div className="shrink-0">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-[10px] font-bold">{eng.health}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ TAB: Ecosystem Map ━━━ */}
        <TabsContent value="ecosystem" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Network className="h-4 w-4" /> Engine Ecosystem
              </CardTitle>
              <p className="text-xs text-muted-foreground">Each engine feeds data to others — creating a flywheel of intelligence</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {engines.map(eng => (
                  <div key={eng.id} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/30 transition">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${eng.color} flex items-center justify-center shrink-0`}>
                      <eng.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{eng.label}</p>
                        <Badge variant="secondary" className="text-[10px]">{eng.health}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{eng.purpose}</p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className="text-[10px] text-muted-foreground">Feeds into:</span>
                        {eng.feedsInto.map(f => {
                          const target = engines.find(e => e.id === f)
                          return target ? (
                            <Badge key={f} variant="outline" className="text-[9px] px-1.5 py-0">
                              {target.label}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-medium">{eng.actionsToday} actions</p>
                      <p className="text-[10px] text-muted-foreground">{eng.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connection Flywheel */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto">
                  <Network className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-lg">The Flywheel Effect</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Every engine creates data that powers the others. Marketing finds leads,
                  sales converts them, customer success retains them, financial tracks the ROI,
                  and the learning engine makes every engine smarter.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Marketing → Leads</Badge>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Leads → Sales</Badge>
                  <Badge className="bg-pink-100 text-pink-700 border-pink-200">Sales → Revenue</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Revenue → Intelligence</Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Intelligence → Better Marketing</Badge>
                  <Badge className="bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200">Learning → Smarter Everything</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ TAB: ROI Tracker ━━━ */}
        <TabsContent value="roi" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold mt-1">R12,400</p>
                <p className="text-xs text-muted-foreground">across all engines</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-muted-foreground">Total Returned</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">R34,800</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> 2.8x ROI
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-muted-foreground">Projected (Next 30d)</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">R41,200</p>
                <p className="text-xs text-blue-600 mt-1">if current trends continue</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">ROI by Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { engine: 'Marketing Engine', invested: 2400, returned: 9800, roi: '4.1x' },
                { engine: 'Lead Engine', invested: 1800, returned: 7200, roi: '4.0x' },
                { engine: 'SEO & Visibility', invested: 800, returned: 5400, roi: '6.8x' },
                { engine: 'Sales Engine', invested: 3200, returned: 8400, roi: '2.6x' },
                { engine: 'Customer Success', invested: 1600, returned: 4000, roi: '2.5x' },
                { engine: 'Community Engine', invested: 2600, returned: 0, roi: 'building...' },
              ].map(r => (
                <div key={r.engine} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{r.engine}</p>
                      <span className="text-sm font-bold text-emerald-600">{r.roi}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">R{r.invested.toLocaleString()} invested</span>
                      <span className="text-xs text-emerald-600">R{r.returned.toLocaleString()} returned</span>
                    </div>
                    <Progress value={Math.min(100, (r.returned / Math.max(r.invested, 1)) * 25)} className="h-1.5 mt-1.5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ TAB: Learning ━━━ */}
        <TabsContent value="learning" className="space-y-4">
          <Card className="border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">AI Learning Engine</h3>
                  <p className="text-sm text-muted-foreground">91% health — learning from every interaction</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-white/60">
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Recommendation acceptance rate</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/60">
                  <p className="text-2xl font-bold">847</p>
                  <p className="text-xs text-muted-foreground">Data points learned this week</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/60">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Pattern improvements made</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> What the AI Has Learned
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { what: 'Best posting times for construction content', detail: 'Tue/Thu 11am-1pm get 3x more engagement for project photos', confidence: 94 },
                { what: 'Price sensitivity of customers', detail: 'Free quotes convert 3x better than fixed price listings', confidence: 87 },
                { what: 'Churn risk signals', detail: 'No response in 7 days = 80% chance lead goes cold', confidence: 82 },
                { what: 'Top lead source', detail: 'Google Business Profile referrals convert 4x better than social', confidence: 91 },
                { what: 'Seasonal demand patterns', detail: 'Sep-Nov and Feb-Apr are peak building season in KZN', confidence: 78 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white border">
                  <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.what}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{item.confidence}% confident</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" /> Learning Boundaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-700 mb-2">✅ Safe to Learn Automatically</p>
                  <ul className="space-y-1">
                    <li className="text-[11px] text-emerald-600">• Which marketing messages work best</li>
                    <li className="text-[11px] text-emerald-600">• Optimal follow-up timing</li>
                    <li className="text-[11px] text-emerald-600">• Customer engagement patterns</li>
                    <li className="text-[11px] text-emerald-600">• Content performance trends</li>
                    <li className="text-[11px] text-emerald-600">• Best-performing product bundles</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 mb-2">🔒 Requires Human Approval</p>
                  <ul className="space-y-1">
                    <li className="text-[11px] text-amber-600">• Pricing changes</li>
                    <li className="text-[11px] text-amber-600">• Financial decisions</li>
                    <li className="text-[11px] text-amber-600">• Legal document changes</li>
                    <li className="text-[11px] text-amber-600">• Brand identity modifications</li>
                    <li className="text-[11px] text-amber-600">• Partnership commitments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

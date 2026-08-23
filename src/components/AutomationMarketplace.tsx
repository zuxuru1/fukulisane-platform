import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Zap, Clock, Mail, MessageCircle, ShoppingCart, Star,
  Bell, RefreshCw, TrendingUp, Users, Eye, Heart,
  Settings, ChevronRight, CheckCircle2, ArrowRight,
  Package, AlertTriangle, DollarSign, Target, Globe,
  Megaphone, Handshake, BarChart3, Shield, Bot
} from 'lucide-react'

interface Business { id: string; name: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

interface AutomationWorkflow {
  id: string; name: string; description: string; icon: any
  category: string; trigger: string; action: string
  enabled: boolean; runs: number; lastRun?: string
  approvalNeeded: boolean
}

const INITIAL_WORKFLOWS: AutomationWorkflow[] = [
  { id: 'review-after-order', name: 'Request Review After Order', description: 'Send WhatsApp message 2 hours after delivery asking for a review', icon: Star, category: 'Customer Success', trigger: 'Order delivered', action: 'Send review request via WhatsApp', enabled: true, runs: 47, lastRun: '2 hours ago', approvalNeeded: false },
  { id: 'low-stock-alert', name: 'Low Stock Alert', description: 'Notify when product stock drops below threshold', icon: AlertTriangle, category: 'Sales', trigger: 'Stock < 5', action: 'Send notification + suggest reorder', enabled: true, runs: 12, lastRun: '1 day ago', approvalNeeded: false },
  { id: 'win-back-churn', name: 'Win-Back Churning Customers', description: 'Send special offer to customers who haven\'t visited in 14+ days', icon: Heart, category: 'Customer Success', trigger: 'No activity 14 days', action: 'Send personalized discount offer', enabled: false, runs: 0, approvalNeeded: true },
  { id: 'auto-social-post', name: 'Auto Social Post', description: 'Post product highlights to Instagram/Facebook when new product is added', icon: Megaphone, category: 'Marketing', trigger: 'New product added', action: 'Create & schedule social post', enabled: true, runs: 23, lastRun: '5 hours ago', approvalNeeded: true },
  { id: 'lead-followup', name: 'Lead Auto-Followup', description: 'Follow up with new leads within 30 minutes via WhatsApp', icon: Target, category: 'Lead Engine', trigger: 'New inquiry received', action: 'Send welcome message + catalog', enabled: true, runs: 89, lastRun: '15 min ago', approvalNeeded: false },
  { id: 'daily-report', name: 'Daily Business Report', description: 'Send morning summary with yesterday\'s revenue, orders, and alerts', icon: BarChart3, category: 'Business Intelligence', trigger: 'Every day 7am', action: 'Generate & send daily report', enabled: true, runs: 30, lastRun: 'Today 7:00am', approvalNeeded: false },
  { id: 'competitor-monitor', name: 'Competitor Price Monitor', description: 'Track competitor pricing changes and alert when undercut', icon: Eye, category: 'Competitor Intelligence', trigger: 'Weekly scan', action: 'Compare prices + suggest adjustments', enabled: false, runs: 0, approvalNeeded: true },
  { id: 'upsell-cross-sell', name: 'Smart Upsell', description: 'Suggest complementary products during checkout based on cart contents', icon: ShoppingCart, category: 'Sales', trigger: 'Cart item added', action: 'Show "Frequently bought together"', enabled: true, runs: 156, lastRun: '3 min ago', approvalNeeded: false },
  { id: 'google-biz-sync', name: 'Google Business Sync', description: 'Keep Google Business Profile updated with hours, photos, and posts', icon: Globe, category: 'SEO & Visibility', trigger: 'Business info changed', action: 'Update Google Business Profile', enabled: true, runs: 18, lastRun: '1 day ago', approvalNeeded: false },
  { id: 'partnership-scout', name: 'Partnership Scout', description: 'Scan for potential business partners in the same area and industry', icon: Handshake, category: 'Partnership Engine', trigger: 'Monthly scan', action: 'Find & suggest partnership opportunities', enabled: false, runs: 0, approvalNeeded: true },
  { id: 'review-response', name: 'AI Review Response', description: 'Draft personalized responses to new Google and Facebook reviews', icon: MessageCircle, category: 'Community Engine', trigger: 'New review received', action: 'Draft response for approval', enabled: false, runs: 0, approvalNeeded: true },
  { id: 'dynamic-pricing', name: 'Smart Pricing Suggestions', description: 'Suggest price adjustments based on demand, competition, and margins', icon: DollarSign, category: 'Financial Intelligence', trigger: 'Weekly analysis', action: 'Price optimization suggestions', enabled: false, runs: 0, approvalNeeded: true },
]

const CATEGORIES = ['All', 'Customer Success', 'Sales', 'Marketing', 'Lead Engine', 'Business Intelligence', 'Competitor Intelligence', 'SEO & Visibility', 'Partnership Engine', 'Community Engine', 'Financial Intelligence']

export default function AutomationMarketplace({ business, showToast }: Props) {
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS)
  const [category, setCategory] = useState('All')
  const [tab, setTab] = useState('marketplace')

  const filtered = category === 'All' ? workflows : workflows.filter(w => w.category === category)
  const enabledCount = workflows.filter(w => w.enabled).length
  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0)
  const needsApproval = workflows.filter(w => w.enabled && w.approvalNeeded).length

  const toggle = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        const next = { ...w, enabled: !w.enabled }
        if (next.enabled) showToast(`${w.name} enabled! ⚡`)
        else showToast(`${w.name} disabled`)
        return next
      }
      return w
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-600" />
          Automation Marketplace
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pre-built AI workflows — enable them and watch your business run on autopilot
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Active Workflows</p>
            <p className="text-2xl font-bold">{enabledCount}<span className="text-sm text-muted-foreground">/{workflows.length}</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Total Runs</p>
            <p className="text-2xl font-bold">{totalRuns.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Needs Approval</p>
            <p className="text-2xl font-bold text-amber-600">{needsApproval}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${category === c ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-white border hover:bg-muted/50'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Workflow Cards */}
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map(w => (
              <Card key={w.id} className={`transition ${w.enabled ? 'border-emerald-200 bg-emerald-50/30' : ''}`}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                      <w.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{w.name}</p>
                        {w.enabled && <Badge className="text-[9px] bg-emerald-100 text-emerald-700">ACTIVE</Badge>}
                        {w.approvalNeeded && <Badge variant="outline" className="text-[9px] border-amber-200 text-amber-600">
                          <Shield className="h-2.5 w-2.5 mr-0.5" /> Approval
                        </Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{w.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {w.trigger}
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Zap className="h-3 w-3" /> {w.action}
                        </div>
                      </div>
                      {w.runs > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          Ran {w.runs} times • Last: {w.lastRun}
                        </p>
                      )}
                    </div>
                    <Switch checked={w.enabled} onCheckedChange={() => toggle(w.id)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-3">
          {workflows.filter(w => w.enabled).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Zap className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground">No active workflows yet</p>
                <p className="text-xs text-muted-foreground mt-1">Browse the marketplace to enable your first automation</p>
              </CardContent>
            </Card>
          ) : (
            workflows.filter(w => w.enabled).map(w => (
              <Card key={w.id}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                      <w.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.runs} runs • {w.lastRun || 'never'}</p>
                    </div>
                    <Switch checked={w.enabled} onCheckedChange={() => toggle(w.id)} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

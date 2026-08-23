import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield, CheckCircle2, XCircle, Clock, AlertTriangle,
  Settings, DollarSign, Edit3, Users, Megaphone,
  Handshake, Globe, Bot, Lock, Unlock, Eye
} from 'lucide-react'

interface Business { id: string; name: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

interface ApprovalLevel {
  id: string; category: string; icon: any
  description: string
  autoMode: 'full' | 'notify' | 'approve' | 'disabled'
  pendingCount: number
}

interface PendingApproval {
  id: string; engine: string; title: string; description: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
}

const APPROVAL_LEVELS: ApprovalLevel[] = [
  { id: 'social-posting', category: 'Social Media Posting', icon: Megaphone, description: 'AI creates and posts content to social channels', autoMode: 'full', pendingCount: 0 },
  { id: 'lead-followup', category: 'Lead Follow-up', icon: Users, description: 'AI sends welcome messages and follow-ups to new leads', autoMode: 'full', pendingCount: 0 },
  { id: 'review-response', category: 'Review Responses', icon: Edit3, description: 'AI drafts responses to customer reviews', autoMode: 'approve', pendingCount: 2 },
  { id: 'pricing', category: 'Pricing Changes', icon: DollarSign, description: 'AI suggests price adjustments based on market data', autoMode: 'approve', pendingCount: 1 },
  { id: 'promotions', category: 'Promotions & Discounts', icon: DollarSign, description: 'AI creates and activates special offers', autoMode: 'notify', pendingCount: 0 },
  { id: 'partnerships', category: 'Partnership Outreach', icon: Handshake, description: 'AI reaches out to potential partners', autoMode: 'approve', pendingCount: 0 },
  { id: 'google-biz', category: 'Google Business Profile', icon: Globe, description: 'AI updates your Google listing (hours, photos, posts)', autoMode: 'full', pendingCount: 0 },
  { id: 'financial', category: 'Financial Decisions', icon: DollarSign, description: 'AI makes spending or investment recommendations', autoMode: 'approve', pendingCount: 0 },
  { id: 'branding', category: 'Brand & Design', icon: Edit3, description: 'AI modifies brand assets, colors, or messaging', autoMode: 'approve', pendingCount: 0 },
  { id: 'customer-data', category: 'Customer Data', icon: Lock, description: 'AI shares customer data with third parties', autoMode: 'disabled', pendingCount: 0 },
]

const PENDING: PendingApproval[] = [
  { id: '1', engine: 'Marketing', title: 'Post Instagram Story: "New Summer Collection 🌴"', description: 'AI generated a story post with your product images and trending hashtags. Will reach ~800 followers.', riskLevel: 'low', timestamp: '10 min ago' },
  { id: '2', engine: 'Customer Success', title: 'Respond to review: "Great service!" (5 stars)', description: 'AI drafted: "Thank you so much for the kind words, Sipho! We\'re thrilled you loved it. See you again soon! 🙏"', riskLevel: 'low', timestamp: '25 min ago' },
  { id: '3', engine: 'Financial', title: 'Increase Cappuccino price from R42 to R45', description: 'Market analysis shows competitors charging R48-55. This 7% increase still keeps you competitive and improves margin by 12%.', riskLevel: 'high', timestamp: '1 hour ago' },
  { id: '4', engine: 'Customer Success', title: 'Send win-back offer: 15% off to 3 inactive customers', description: 'Customers Sipho, Thabo, and Naledi haven\'t visited in 18+ days. AI suggests a personalized 15% discount.', riskLevel: 'medium', timestamp: '2 hours ago' },
]

const MODE_LABELS = {
  full: { label: 'Full Auto', color: 'bg-emerald-100 text-emerald-700', icon: Bot, desc: 'AI runs without asking' },
  notify: { label: 'Notify Me', color: 'bg-blue-100 text-blue-700', icon: Eye, desc: 'AI acts, you get notified' },
  approve: { label: 'Require Approval', color: 'bg-amber-100 text-amber-700', icon: Shield, desc: 'AI asks permission first' },
  disabled: { label: 'Disabled', color: 'bg-gray-100 text-gray-700', icon: Lock, desc: 'AI cannot do this' },
}

const RISK_COLORS = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-amber-100 text-amber-700 border-amber-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
}

export default function ApprovalSystem({ business, showToast }: Props) {
  const [levels, setLevels] = useState(APPROVAL_LEVELS)
  const [pending, setPending] = useState(PENDING)
  const [tab, setTab] = useState('pending')

  const updateMode = (id: string, mode: ApprovalLevel['autoMode']) => {
    setLevels(prev => prev.map(l => l.id === id ? { ...l, autoMode: mode } : l))
    showToast(`Permission updated`)
  }

  const approve = (id: string) => {
    const item = pending.find(p => p.id === id)
    setPending(prev => prev.filter(p => p.id !== id))
    if (item) showToast(`✅ Approved: ${item.title}`)
  }

  const reject = (id: string) => {
    const item = pending.find(p => p.id === id)
    setPending(prev => prev.filter(p => p.id !== id))
    if (item) showToast(`❌ Rejected: ${item.title}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-amber-600" />
          Approval Levels
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Control what AI can do automatically vs what needs your approval
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="levels">Permission Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {pending.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-emerald-500 opacity-50" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No actions need your approval right now</p>
              </CardContent>
            </Card>
          ) : (
            pending.map(item => (
              <Card key={item.id} className={`border-l-4 ${
                item.riskLevel === 'critical' ? 'border-l-red-500' :
                item.riskLevel === 'high' ? 'border-l-amber-500' :
                item.riskLevel === 'medium' ? 'border-l-blue-500' : 'border-l-emerald-500'
              }`}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {item.riskLevel === 'critical' ? <AlertTriangle className="h-5 w-5 text-red-500" /> :
                       item.riskLevel === 'high' ? <AlertTriangle className="h-5 w-5 text-amber-500" /> :
                       <Bot className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold">{item.title}</p>
                        <Badge variant="outline" className={`text-[9px] ${RISK_COLORS[item.riskLevel]}`}>
                          {item.riskLevel} risk
                        </Badge>
                        <Badge variant="secondary" className="text-[9px]">{item.engine}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.timestamp}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => reject(item.id)}
                        className="text-red-600 hover:bg-red-50 border-red-200">
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => approve(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="levels" className="space-y-3">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-bold">How Permission Levels Work</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(MODE_LABELS).map(([key, val]) => (
                  <div key={key} className="p-2 rounded-lg bg-white/60 text-center">
                    <val.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-[10px] font-bold">{val.label}</p>
                    <p className="text-[9px] text-muted-foreground">{val.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {levels.map(level => (
            <Card key={level.id}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <level.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{level.category}</p>
                      {level.pendingCount > 0 && (
                        <Badge className="text-[9px] bg-amber-100 text-amber-700">{level.pendingCount} pending</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {(['full', 'notify', 'approve', 'disabled'] as const).map(mode => (
                      <button key={mode}
                        onClick={() => updateMode(level.id, mode)}
                        className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${
                          level.autoMode === mode ? MODE_LABELS[mode].color : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}>
                        {MODE_LABELS[mode].label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Brain, Activity, TrendingUp, AlertTriangle, Users, Zap,
  Lightbulb, RefreshCw, CheckCircle2, ChevronRight, Clock,
  ShoppingCart, DollarSign, Target, Megaphone, Globe,
  Heart, Eye, Settings, BarChart3, Sparkles
} from 'lucide-react'

interface Business {
  id: string; name: string; category?: string
}

interface AIRecommendation {
  id: string; title: string; category: string
  impact: string; confidence: number
  type: 'action' | 'insight' | 'warning' | 'opportunity'
  roi?: string; urgent?: boolean
}

interface HealthMetric {
  label: string; value: number; max: number
  trend: 'up' | 'down' | 'stable'; icon: any
}

interface Props {
  business: Business
  showToast: (msg: string, type?: 'success' | 'error') => void
}

const RECOMMENDATIONS: AIRecommendation[] = [
  { id: '1', title: 'Post before-and-after photos of your latest renovation on Instagram & Facebook', category: 'Marketing', impact: 'Project showcase posts get 3x more engagement — drives inbound leads', confidence: 91, type: 'action', roi: '+R12,000' },
  { id: '2', title: 'Follow up with 5 customers who requested quotes but haven\'t responded', category: 'Sales', impact: '72% chance of converting at least 2 — avg project value R45,000', confidence: 84, type: 'action', roi: '+R90,000' },
  { id: '3', title: 'Price increase opportunity: Your roofing rates are 12% below KZN market average', category: 'Financial', impact: 'R800/m² increase = +R24,000/project with zero churn risk', confidence: 78, type: 'opportunity', roi: '+R24,000/project' },
  { id: '4', title: 'Google Business Profile needs 5 more project photos to rank in top 3 local results', category: 'SEO', impact: 'Top 3 in Google Maps = +45% quote requests from nearby areas', confidence: 87, type: 'action' },
  { id: '5', title: 'Urgent: 3 active projects approaching deadline — schedule extra team for on-time delivery', category: 'Operations', impact: 'On-time completion = +90% review rate, late = 60% negative reviews', confidence: 92, type: 'warning', urgent: true },
  { id: '6', title: 'New competitor offering cheap builds — differentiate with quality guarantees and testimonials', category: 'Competitor', impact: 'Quality positioning prevents price wars, maintains margins', confidence: 70, type: 'warning' },
  { id: '7', title: 'Partnership opportunity: Local real estate agents want to refer buyers for new builds', category: 'Partnership', impact: 'Agent referrals convert at 40% — potential R500,000+ in projects', confidence: 75, type: 'opportunity', roi: '+R200,000/quarter' },
  { id: '8', title: 'Cement and brick supplier has a bulk discount this month — stock up for active projects', category: 'Operations', impact: 'Bulk purchase saves R8,000-15,000 on materials for current pipeline', confidence: 88, type: 'insight' },
]

export default function AIBrain({ business, showToast }: Props) {
  const [recommendations] = useState(RECOMMENDATIONS)
  const [activeTab, setActiveTab] = useState('recommendations')

  const healthScore = 78
  const healthColor = healthScore >= 75 ? 'text-emerald-600' : healthScore >= 50 ? 'text-amber-600' : 'text-red-600'

  const metrics: HealthMetric[] = [
    { label: 'Revenue', value: 42000, max: 50000, trend: 'up', icon: DollarSign },
    { label: 'Customers', value: 156, max: 200, trend: 'up', icon: Users },
    { label: 'Conversion', value: 3.2, max: 5, trend: 'stable', icon: Target },
    { label: 'Retention', value: 72, max: 100, trend: 'down', icon: Heart },
    { label: 'Visibility', value: 64, max: 100, trend: 'up', icon: Globe },
    { label: 'Engagement', value: 89, max: 100, trend: 'up', icon: Megaphone },
  ]

  const urgentCount = recommendations.filter(r => r.urgent).length
  const actionCount = recommendations.filter(r => r.type === 'action').length
  const totalROI = recommendations.filter(r => r.roi).map(r => r.roi).join(' + ')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Brain
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your business intelligence engine — analyzing everything, recommending actions
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3 text-purple-500" />
          Learning active
        </Badge>
      </div>

      {/* Health Score */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Business Health Score</p>
              <div className="flex items-end gap-2">
                <p className={`text-5xl font-bold ${healthColor}`}>{healthScore}</p>
                <p className="text-sm text-muted-foreground mb-1">/100</p>
                <Badge className="ml-2 bg-emerald-100 text-emerald-700">
                  <TrendingUp className="h-3 w-3 mr-1" /> +3 this week
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Last analyzed</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> 2 min ago
              </p>
            </div>
          </div>
          <Progress value={healthScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {metrics.map(m => (
          <Card key={m.label}>
            <CardContent className="pt-3 pb-2 px-3">
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
              <p className="text-lg font-bold">{typeof m.value === 'number' && m.value > 100 ? `R${(m.value / 1000).toFixed(0)}K` : m.value}{m.label === 'Conversion' ? '%' : m.label === 'Retention' ? '%' : ''}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {m.trend === 'up' && <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />}
                {m.trend === 'down' && <AlertTriangle className="h-2.5 w-2.5 text-red-500" />}
                {m.trend === 'stable' && <Activity className="h-2.5 w-2.5 text-amber-500" />}
                <Progress value={(m.value / m.max) * 100} className="h-1 flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">
            Actions ({actionCount})
          </TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-3">
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700 font-medium">
                {urgentCount} urgent action{urgentCount !== 1 ? 's' : ''} needed
              </p>
            </div>
          )}

          {recommendations.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0)).map(rec => (
            <Card key={rec.id} className={`${rec.urgent ? 'border-red-200' : ''}`}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    rec.type === 'action' ? 'bg-blue-100 text-blue-600' :
                    rec.type === 'opportunity' ? 'bg-emerald-100 text-emerald-600' :
                    rec.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {rec.type === 'action' ? <Zap className="h-4 w-4" /> :
                     rec.type === 'opportunity' ? <Lightbulb className="h-4 w-4" /> :
                     rec.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                     <Eye className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{rec.title}</p>
                      {rec.urgent && <Badge className="text-[9px] bg-red-100 text-red-700">URGENT</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.impact}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-[9px]">{rec.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{rec.confidence}% confidence</span>
                      {rec.roi && <span className="text-[10px] font-bold text-emerald-600">ROI: {rec.roi}</span>}
                    </div>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 shrink-0 text-xs">
                    Act Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">What the AI Sees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Revenue Growth Pattern', detail: 'Revenue has grown 12% over 3 weeks. Growth is primarily driven by repeat customers, not new acquisitions. Focus on lead generation to sustain momentum.', icon: TrendingUp, color: 'text-emerald-600' },
                { title: 'Customer Behavior Shift', detail: 'Weekday traffic is up 18%, weekend traffic down 8%. Consider weekday-specific promotions and weekend family bundles.', icon: Users, color: 'text-blue-600' },
                { title: 'Product Performance Gap', detail: '3 products have >40% margin but <5% of sales. These are underperforming gold mines — feature them on your homepage.', icon: Target, color: 'text-purple-600' },
                { title: 'Seasonal Alert', detail: 'Based on industry data, expect a 25% traffic increase in the next 2 weeks. Prepare inventory and staff.', icon: Clock, color: 'text-amber-600' },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                  <insight.icon className={`h-5 w-5 ${insight.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{insight.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">30-Day Trends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Revenue', current: 'R42K', previous: 'R37K', change: '+13.5%', positive: true },
                { label: 'Orders', current: '186', previous: '162', change: '+14.8%', positive: true },
                { label: 'Avg Order Value', current: 'R226', previous: 'R228', change: '-0.9%', positive: false },
                { label: 'New Customers', current: '42', previous: '38', change: '+10.5%', positive: true },
                { label: 'Return Rate', current: '2.1%', previous: '3.4%', change: '-38%', positive: true },
                { label: 'Google Ranking', current: '#4', previous: '#7', change: '+3 spots', positive: true },
              ].map(t => (
                <div key={t.label} className="flex items-center justify-between">
                  <p className="text-sm">{t.label}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{t.previous}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-bold">{t.current}</span>
                    <Badge variant="secondary" className={`text-[10px] ${t.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  ShoppingCart, Package, Users, TrendingUp, TrendingDown, DollarSign,
  BarChart3, Brain, Target, Megaphone, Search, RefreshCw, Eye,
  ArrowUpRight, ArrowDownRight, Minus, Sparkles, Star, MapPin,
  Clock, AlertTriangle, CheckCircle2, XCircle, Zap, Globe,
  MessageCircle, Mail, Send, Bell, Heart, Repeat, Tag, Truck
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function StoreBrain({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  const [autoOptimize, setAutoOptimize] = useState(true)

  useEffect(() => { setTimeout(() => setLoading(false), 500) }, [business.id])

  const stats = useMemo(() => ({
    revenue: 47820, revenueChange: 14.2,
    orders: 186, ordersChange: 8.7,
    visitors: 4320, visitorsChange: 22.1,
    conversion: 4.3, conversionChange: 0.8,
    avgOrder: 257, avgOrderChange: -2.1,
    repeatRate: 34, repeatChange: 5.2,
    totalProducts: 84, activeProducts: 72,
    totalCustomers: 412, newCustomers: 28,
  }), [])

  const recentOrders = [
    { id: 'ORD-4521', customer: 'Thabo M.', items: 3, total: 'R 1,240', status: 'delivered', time: '2h ago' },
    { id: 'ORD-4520', customer: 'Sarah K.', items: 1, total: 'R 450', status: 'shipped', time: '4h ago' },
    { id: 'ORD-4519', customer: 'David N.', items: 5, total: 'R 2,100', status: 'processing', time: '5h ago' },
    { id: 'ORD-4518', customer: 'Lisa P.', items: 2, total: 'R 780', status: 'pending', time: '6h ago' },
    { id: 'ORD-4517', customer: 'James W.', items: 1, total: 'R 320', status: 'delivered', time: '8h ago' },
  ]

  const topProducts = [
    { name: 'Premium Leather Bag', sold: 47, revenue: 'R 18,800', trend: 'up' },
    { name: 'Wireless Earbuds Pro', sold: 38, revenue: 'R 11,400', trend: 'up' },
    { name: 'Organic Face Cream', sold: 34, revenue: 'R 6,120', trend: 'stable' },
    { name: 'Cotton Throw Blanket', sold: 29, revenue: 'R 5,800', trend: 'up' },
    { name: 'Bamboo Water Bottle', sold: 22, revenue: 'R 3,740', trend: 'down' },
  ]

  const aiInsights = [
    { title: 'Increase social posting to 3x/day', impact: '+18% traffic', type: 'marketing', confidence: 92 },
    { title: 'Bundle top 3 products together', impact: '+R 4,200/mo', type: 'sales', confidence: 88 },
    { title: 'Add WhatsApp order reminders', impact: '+12% repeat', type: 'retention', confidence: 85 },
    { title: 'Run weekend flash sale on slow movers', impact: '+R 2,800', type: 'promotion', confidence: 79 },
    { title: 'Optimize product photos (add lifestyle shots)', impact: '+8% conversion', type: 'optimization', confidence: 91 },
  ]

  const statusColors: Record<string, string> = {
    delivered: 'bg-emerald-100 text-emerald-700',
    shipped: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    pending: 'bg-slate-100 text-slate-600',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground font-medium">StoreBrain initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            StoreBrain
          </h1>
          <p className="text-muted-foreground text-sm">AI-powered store intelligence for {business.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1"><span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />AI Active</Badge>
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Revenue (30d)', value: `R ${stats.revenue.toLocaleString()}`, change: stats.revenueChange, icon: DollarSign },
          { label: 'Orders', value: stats.orders.toString(), change: stats.ordersChange, icon: ShoppingCart },
          { label: 'Visitors', value: stats.visitors.toLocaleString(), change: stats.visitorsChange, icon: Eye },
          { label: 'Conversion', value: `${stats.conversion}%`, change: stats.conversionChange, icon: Target },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {s.change > 0 ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                <span className={`text-xs font-medium ${s.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{Math.abs(s.change)}%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="text-xs"><BarChart3 className="h-3 w-3 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="orders" className="text-xs"><ShoppingCart className="h-3 w-3 mr-1" />Orders</TabsTrigger>
          <TabsTrigger value="products" className="text-xs"><Package className="h-3 w-3 mr-1" />Products</TabsTrigger>
          <TabsTrigger value="customers" className="text-xs"><Users className="h-3 w-3 mr-1" />Customers</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs"><Brain className="h-3 w-3 mr-1" />AI Insights</TabsTrigger>
          <TabsTrigger value="marketing" className="text-xs"><Megaphone className="h-3 w-3 mr-1" />Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Store Health Score</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="87, 100" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">87%</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Product Completeness</span><span className="font-medium">92%</span></div>
                    <Progress value={92} className="h-1" />
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">SEO Score</span><span className="font-medium">78%</span></div>
                    <Progress value={78} className="h-1" />
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Page Speed</span><span className="font-medium">85%</span></div>
                    <Progress value={85} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue Trend (7 days)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-24">
                  {[3200, 4100, 3800, 5200, 4600, 5800, 6200].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t" style={{ height: `${(v / 6200) * 100}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Orders</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentOrders.map(o => (
                  <div key={o.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center"><ShoppingCart className="h-4 w-4 text-purple-600" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{o.id}</span>
                        <Badge className={statusColors[o.status]}>{o.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{o.customer} · {o.items} items · {o.time}</p>
                    </div>
                    <span className="font-bold text-sm">{o.total}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Pending', value: '12', color: 'text-amber-600' },
              { label: 'Processing', value: '8', color: 'text-blue-600' },
              { label: 'Shipped', value: '15', color: 'text-purple-600' },
              { label: 'Delivered', value: '151', color: 'text-emerald-600' },
            ].map(s => (
              <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">All Orders</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">{o.id.slice(-2)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="font-medium text-sm">{o.id}</span><Badge className={statusColors[o.status]}>{o.status}</Badge></div>
                    <p className="text-xs text-muted-foreground">{o.customer} · {o.items} items · {o.time}</p>
                  </div>
                  <span className="font-bold">{o.total}</span>
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.totalProducts}</p><p className="text-xs text-muted-foreground">Total Products</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{stats.activeProducts}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{stats.totalProducts - stats.activeProducts}</p><p className="text-xs text-muted-foreground">Low Stock</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">12</p><p className="text-xs text-muted-foreground">Categories</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Top Products</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sold} sold</p>
                  </div>
                  <span className="font-bold text-sm">{p.revenue}</span>
                  {p.trend === 'up' ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : p.trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-500" /> : <Minus className="h-4 w-4 text-slate-400" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.totalCustomers}</p><p className="text-xs text-muted-foreground">Total Customers</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{stats.newCustomers}</p><p className="text-xs text-muted-foreground">New (30d)</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.repeatRate}%</p><p className="text-xs text-muted-foreground">Repeat Rate</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">R {stats.avgOrder}</p><p className="text-xs text-muted-foreground">Avg Order Value</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Customer Segments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'VIP Customers', count: 42, pct: 10, desc: 'Spent R 2,000+', color: 'from-amber-500 to-orange-600' },
                { name: 'Regular Buyers', count: 128, pct: 31, desc: '3+ orders', color: 'from-emerald-500 to-teal-600' },
                { name: 'New Customers', count: 156, pct: 38, desc: 'First order', color: 'from-blue-500 to-indigo-600' },
                { name: 'At Risk', count: 86, pct: 21, desc: 'No order in 60d', color: 'from-red-500 to-rose-600' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-xs font-bold`}>{s.pct}%</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.count} customers · {s.desc}</p>
                  </div>
                  <Progress value={s.pct} className="w-20 h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-500" />AI Recommendations</h3>
              <p className="text-xs text-muted-foreground">Auto-generated insights to grow your store</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Auto-optimize</span>
              <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
            </div>
          </div>
          <div className="space-y-2">
            {aiInsights.map((insight, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{insight.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px]">{insight.type}</Badge>
                        <span className="text-xs text-emerald-600 font-medium">{insight.impact}</span>
                        <span className="text-xs text-muted-foreground">Confidence: {insight.confidence}%</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => showToast('AI action applied!')}>Apply</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">3</p><p className="text-xs text-muted-foreground">Active Campaigns</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">R 12,400</p><p className="text-xs text-muted-foreground">Campaign Revenue</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-purple-600">1,247</p><p className="text-xs text-muted-foreground">Social Reach</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">6</p><p className="text-xs text-muted-foreground">Coupons Active</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Marketing Channels</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'WhatsApp', icon: MessageCircle, sent: 89, opened: 76, color: 'text-emerald-600' },
                { name: 'Email', icon: Mail, sent: 312, opened: 145, color: 'text-blue-600' },
                { name: 'SMS', icon: Send, sent: 47, opened: 38, color: 'text-amber-600' },
                { name: 'Social Media', icon: Globe, sent: 24, opened: 1247, color: 'text-purple-600' },
              ].map(ch => (
                <div key={ch.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <ch.icon className={`h-5 w-5 ${ch.color}`} />
                  <div className="flex-1"><p className="font-medium text-sm">{ch.name}</p><p className="text-xs text-muted-foreground">{ch.sent} sent · {ch.opened} {ch.name === 'Social Media' ? 'reach' : 'opened'}</p></div>
                  <Badge variant="secondary" className="text-xs">{ch.name === 'Social Media' ? `${Math.round(ch.opened / ch.sent)}x reach` : `${Math.round(ch.opened / ch.sent * 100)}% open`}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

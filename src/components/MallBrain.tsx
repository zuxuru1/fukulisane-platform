import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  Brain, Store, Users, TrendingUp, TrendingDown, DollarSign,
  BarChart3, Globe, MapPin, Target, Megaphone, Sparkles, Eye,
  ArrowUpRight, ArrowDownRight, ShoppingCart, Package, Star,
  AlertTriangle, CheckCircle2, Clock, Zap, Crown, Shield,
  Search, Filter, Rocket, RefreshCw, Activity
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function MallBrain({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)

  useEffect(() => { setTimeout(() => setLoading(false), 500) }, [business.id])

  const mallStats = useMemo(() => ({
    totalStores: 247, activeStores: 231, pendingStores: 8, suspendedStores: 8,
    totalRevenue: 4287600, revenueChange: 18.4,
    totalOrders: 18420, ordersChange: 12.7,
    totalCustomers: 34200, customersChange: 24.3,
    avgStoreRevenue: 18560,
    platformFee: 428760,
    categories: 24,
    regions: 9,
  }), [])

  const topStores = [
    { name: 'Thabo Fashion House', category: 'Fashion', revenue: 'R 189,200', orders: 842, rating: 4.9, status: 'growing' },
    { name: 'Cape Electronics', category: 'Electronics', revenue: 'R 156,400', orders: 634, rating: 4.8, status: 'growing' },
    { name: 'Ubuntu Health Store', category: 'Health', revenue: 'R 124,800', orders: 521, rating: 4.7, status: 'stable' },
    { name: 'JHB Organic Market', category: 'Grocery', revenue: 'R 98,200', orders: 1240, rating: 4.6, status: 'growing' },
    { name: 'Durban Surf Co', category: 'Fashion', revenue: 'R 87,600', orders: 312, rating: 4.8, status: 'new' },
    { name: 'Pretoria Pet Supplies', category: 'Pets', revenue: 'R 76,400', orders: 289, rating: 4.5, status: 'stable' },
  ]

  const regions = [
    { name: 'Gauteng', stores: 98, revenue: 'R 1.8M', growth: 22 },
    { name: 'Western Cape', stores: 54, revenue: 'R 1.1M', growth: 18 },
    { name: 'KwaZulu-Natal', stores: 38, revenue: 'R 680K', growth: 15 },
    { name: 'Free State', stores: 18, revenue: 'R 240K', growth: 8 },
    { name: 'Limpopo', stores: 14, revenue: 'R 180K', growth: 12 },
    { name: 'Mpumalanga', stores: 12, revenue: 'R 145K', growth: 10 },
    { name: 'North West', stores: 8, revenue: 'R 98K', growth: 6 },
    { name: 'Eastern Cape', stores: 5, revenue: 'R 62K', growth: 4 },
  ]

  const campaigns = [
    { name: 'Back to School Sale', stores: 42, reach: 18400, revenue: 'R 234,000', status: 'active' },
    { name: 'Heritage Day Promos', stores: 67, reach: 32100, revenue: 'R 456,000', status: 'scheduled' },
    { name: 'Women\'s Day Special', stores: 38, reach: 15200, revenue: 'R 189,000', status: 'completed' },
    { name: 'Local Business Spotlight', stores: 24, reach: 8900, revenue: 'R 67,000', status: 'active' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground font-medium">MallBrain initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-500" />
            MallBrain
          </h1>
          <p className="text-muted-foreground text-sm">Central marketplace intelligence — {mallStats.activeStores} active stores</p>
        </div>
        <Badge variant="secondary" className="gap-1"><span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />MALL ONLINE</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: `R ${(mallStats.totalRevenue / 1000000).toFixed(1)}M`, change: mallStats.revenueChange, icon: DollarSign },
          { label: 'Active Stores', value: mallStats.activeStores.toString(), change: 5.2, icon: Store },
          { label: 'Total Orders', value: mallStats.totalOrders.toLocaleString(), change: mallStats.ordersChange, icon: ShoppingCart },
          { label: 'Customers', value: (mallStats.totalCustomers / 1000).toFixed(1) + 'K', change: mallStats.customersChange, icon: Users },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-500">{s.change}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="stores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stores" className="text-xs"><Store className="h-3 w-3 mr-1" />Stores</TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs"><DollarSign className="h-3 w-3 mr-1" />Revenue</TabsTrigger>
          <TabsTrigger value="regions" className="text-xs"><MapPin className="h-3 w-3 mr-1" />Regions</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs"><Megaphone className="h-3 w-3 mr-1" />Campaigns</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs"><Sparkles className="h-3 w-3 mr-1" />AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active', value: mallStats.activeStores, color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { label: 'Pending', value: mallStats.pendingStores, color: 'text-amber-600', bg: 'bg-amber-100' },
              { label: 'Suspended', value: mallStats.suspendedStores, color: 'text-red-600', bg: 'bg-red-100' },
              { label: 'Categories', value: mallStats.categories, color: 'text-blue-600', bg: 'bg-blue-100' },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-4 text-center">
                  <Badge className={`${s.bg} ${s.color}`}>{s.label}</Badge>
                  <p className="text-2xl font-bold mt-2">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Crown className="h-4 w-4 text-amber-500" />Top Performing Stores</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {topStores.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{s.name[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{s.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                      {s.status === 'growing' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                      {s.status === 'new' && <Badge className="bg-blue-100 text-blue-700 text-[10px]">NEW</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{s.orders} orders · ⭐ {s.rating}</p>
                  </div>
                  <span className="font-bold text-sm">{s.revenue}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Platform Revenue (Monthly)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32 mb-2">
                {[280, 320, 350, 310, 380, 420, 390, 450, 480, 510, 540, 580].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t" style={{ height: `${(v / 580) * 100}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 rounded-xl bg-emerald-50">
                  <p className="text-xs text-muted-foreground">Platform Fees</p>
                  <p className="text-lg font-bold text-emerald-600">R {(mallStats.platformFee).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50">
                  <p className="text-xs text-muted-foreground">Avg/Store</p>
                  <p className="text-lg font-bold text-blue-600">R {mallStats.avgStoreRevenue.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-50">
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="text-lg font-bold text-purple-600">+{mallStats.revenueChange}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Regional Performance</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {regions.map(r => (
                <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.stores} stores · {r.revenue}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">+{r.growth}%</span>
                  </div>
                  <Progress value={r.growth * 3} className="w-20 h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Active Campaigns</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {campaigns.map(c => (
                <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <Megaphone className="h-5 w-5 text-amber-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.stores} stores · {c.reach.toLocaleString()} reach · {c.revenue}</p>
                  </div>
                  <Badge variant={c.status === 'active' ? 'default' : c.status === 'scheduled' ? 'secondary' : 'outline'} className={c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : ''}>{c.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-500" />MallBrain AI Insights</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Boost local businesses in Gauteng', impact: '+15% local revenue', action: 'Enable regional priority ranking' },
                { title: 'Launch weekend flash sale campaign', impact: '+R 120K projected', action: 'Activate across 50+ stores' },
                { title: 'Enable cross-store recommendations', impact: '+8% basket size', action: 'Activate recommendation engine' },
                { title: 'Run re-engagement for dormant customers', impact: 'Recover 2,400 users', action: 'Trigger email + WhatsApp sequence' },
                { title: 'Optimize search ranking algorithm', impact: '+22% discovery', action: 'Deploy AI search update' },
              ].map((insight, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Brain className="h-4 w-4 text-white" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">{insight.action}</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">{insight.impact}</span>
                  <Button size="sm" variant="outline" onClick={() => showToast('MallBrain action applied!')}>Apply</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

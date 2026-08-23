import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  ShoppingCart, Package, Truck, RotateCcw, DollarSign, CreditCard,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, XCircle, AlertTriangle,
  Eye, RefreshCw, MapPin, Tag, Receipt, Wallet, Banknote, ArrowLeftRight
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function CommerceEngine({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  const orders = [
    { id: 'ORD-4521', customer: 'Thabo M.', items: 3, total: 1240, status: 'delivered', payment: 'paid', shipping: 'courier', date: '19 Jul' },
    { id: 'ORD-4520', customer: 'Sarah K.', items: 1, total: 450, status: 'shipped', payment: 'paid', shipping: 'pickup', date: '19 Jul' },
    { id: 'ORD-4519', customer: 'David N.', items: 5, total: 2100, status: 'processing', payment: 'paid', shipping: 'courier', date: '18 Jul' },
    { id: 'ORD-4518', customer: 'Lisa P.', items: 2, total: 780, status: 'pending', payment: 'pending', shipping: 'delivery', date: '18 Jul' },
    { id: 'ORD-4517', customer: 'James W.', items: 1, total: 320, status: 'delivered', payment: 'paid', shipping: 'pickup', date: '17 Jul' },
    { id: 'ORD-4516', customer: 'Nomsa B.', items: 4, total: 1890, status: 'returned', payment: 'refunded', shipping: 'courier', date: '17 Jul' },
  ]

  const statusIcon: Record<string, any> = {
    delivered: CheckCircle2, shipped: Truck, processing: RefreshCw, pending: Clock, returned: RotateCcw
  }
  const statusColor: Record<string, string> = {
    delivered: 'text-emerald-500', shipped: 'text-blue-500', processing: 'text-amber-500', pending: 'text-slate-400', returned: 'text-red-500'
  }
  const badgeColor: Record<string, string> = {
    delivered: 'bg-emerald-100 text-emerald-700', shipped: 'bg-blue-100 text-blue-700', processing: 'bg-amber-100 text-amber-700', pending: 'bg-slate-100 text-slate-600', returned: 'bg-red-100 text-red-700'
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="h-6 w-6 text-emerald-500" />Commerce Engine</h1>
          <p className="text-muted-foreground text-sm">Orders, payments, shipping & returns</p>
        </div>
        <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Sync</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Orders', value: '186', change: 8.7, icon: ShoppingCart },
          { label: 'Revenue', value: 'R 47,820', change: 14.2, icon: DollarSign },
          { label: 'Pending', value: '12', icon: Clock },
          { label: 'In Transit', value: '15', icon: Truck },
          { label: 'Returns', value: '3', icon: RotateCcw },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              {'change' in s && s.change !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500">+{s.change}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders" className="text-xs"><ShoppingCart className="h-3 w-3 mr-1" />Orders</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs"><CreditCard className="h-3 w-3 mr-1" />Payments</TabsTrigger>
          <TabsTrigger value="shipping" className="text-xs"><Truck className="h-3 w-3 mr-1" />Shipping</TabsTrigger>
          <TabsTrigger value="returns" className="text-xs"><RotateCcw className="h-3 w-3 mr-1" />Returns</TabsTrigger>
          <TabsTrigger value="taxes" className="text-xs"><Receipt className="h-3 w-3 mr-1" />Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-2">
          {orders.map(o => {
            const Icon = statusIcon[o.status] || Clock
            return (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
                <Icon className={`h-5 w-5 ${statusColor[o.status]}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{o.id}</span>
                    <Badge className={badgeColor[o.status]}>{o.status}</Badge>
                    <Badge variant="outline" className="text-[10px]">{o.payment}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{o.customer} · {o.items} items · {o.shipping} · {o.date}</p>
                </div>
                <span className="font-bold">R {o.total.toLocaleString()}</span>
                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
              </div>
            )
          })}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Paid', value: 'R 44,200', color: 'text-emerald-600' },
              { label: 'Pending', value: 'R 2,340', color: 'text-amber-600' },
              { label: 'Refunded', value: 'R 1,280', color: 'text-red-600' },
              { label: 'Held (Escrow)', value: 'R 3,400', color: 'text-blue-600' },
            ].map(p => (
              <Card key={p.label}><CardContent className="p-4 text-center"><p className={`text-xl font-bold ${p.color}`}>{p.value}</p><p className="text-xs text-muted-foreground">{p.label}</p></CardContent></Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Payment Methods</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'Yoco', pct: 35, vol: 'R 16,737', status: true },
                { name: 'Ozow (EFT)', pct: 28, vol: 'R 13,390', status: true },
                { name: 'PayFast', pct: 22, vol: 'R 10,520', status: true },
                { name: 'SnapScan', pct: 10, vol: 'R 4,782', status: false },
                { name: 'Cash on Delivery', pct: 5, vol: 'R 2,391', status: true },
              ].map(pm => (
                <div key={pm.name} className="flex items-center gap-3 p-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1"><p className="font-medium text-sm">{pm.name}</p></div>
                  <span className="text-xs text-muted-foreground">{pm.vol}</span>
                  <Progress value={pm.pct} className="w-16 h-1.5" />
                  <Switch checked={pm.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'The Courier Guy', active: 62, avg: '2 days', cost: 'R 65', status: true },
              { name: 'Pargo (Pickup Points)', active: 24, avg: '3 days', cost: 'R 45', status: true },
              { name: 'Self-Delivery', active: 14, avg: 'Same day', cost: 'R 0', status: true },
            ].map(s => (
              <Card key={s.name}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-sm">{s.name}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Orders</span><span className="font-medium">{s.active}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Avg Time</span><span className="font-medium">{s.avg}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Avg Cost</span><span className="font-medium">{s.cost}</span></div>
                  </div>
                  <Switch checked={s.status} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Recent Returns</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: 'RET-089', order: 'ORD-4516', reason: 'Wrong size', status: 'completed', refund: 'R 470' },
                { id: 'RET-088', order: 'ORD-4502', reason: 'Damaged item', status: 'processing', refund: 'R 320' },
                { id: 'RET-087', order: 'ORD-4498', reason: 'Not as described', status: 'pending', refund: 'R 490' },
              ].map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <RotateCcw className="h-5 w-5 text-red-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.id}</span>
                      <Badge variant="secondary" className="text-[10px]">{r.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.order} · {r.reason}</p>
                  </div>
                  <span className="font-bold text-sm text-red-600">{r.refund}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Tax Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'VAT (15%)', enabled: true, collected: 'R 6,187' },
                { name: 'Zero-rated items', enabled: true, items: 12 },
                { name: 'Tax-exempt customers', enabled: false, count: 0 },
              ].map(t => (
                <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <Receipt className="h-5 w-5 text-emerald-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{'collected' in t ? `Collected: ${t.collected}` : 'items' in t ? `${t.items} items` : `${t.count} customers`}</p>
                  </div>
                  <Switch checked={t.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

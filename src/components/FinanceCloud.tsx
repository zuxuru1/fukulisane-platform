import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  DollarSign, TrendingUp, TrendingDown, PiggyBank, CreditCard,
  ArrowUpRight, ArrowDownRight, Banknote, Receipt, Landmark,
  Target, AlertTriangle, CheckCircle2, BarChart3, Wallet,
  Calculator, FileText, Building2, Briefcase, ArrowRight
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function FinanceCloud({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><DollarSign className="h-6 w-6 text-emerald-500" />Finance Cloud</h1>
          <p className="text-muted-foreground text-sm">Cashflow, forecasting, funding readiness & tax</p>
        </div>
        <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" />Export Report</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Revenue (30d)', value: 'R 47,820', change: 14.2, icon: DollarSign },
          { label: 'Expenses', value: 'R 18,400', change: 3.1, icon: CreditCard, neg: true },
          { label: 'Net Profit', value: 'R 29,420', change: 22.4, icon: TrendingUp },
          { label: 'Cash Balance', value: 'R 84,200', change: 8.6, icon: Wallet },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className="h-4 w-4 text-muted-foreground" /></div>
            <p className="text-xl font-bold">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {(s.neg ? (s.change > 0) : (s.change > 0)) ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
              <span className={`text-xs font-medium ${s.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{Math.abs(s.change)}%</span>
            </div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="cashflow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cashflow" className="text-xs"><BarChart3 className="h-3 w-3 mr-1" />Cashflow</TabsTrigger>
          <TabsTrigger value="forecast" className="text-xs"><Target className="h-3 w-3 mr-1" />Forecast</TabsTrigger>
          <TabsTrigger value="funding" className="text-xs"><Landmark className="h-3 w-3 mr-1" />Funding</TabsTrigger>
          <TabsTrigger value="tax" className="text-xs"><Receipt className="h-3 w-3 mr-1" />Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Cashflow (12 months)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-32 mb-2">
                {[32, 38, 42, 35, 48, 52, 45, 58, 62, 55, 67, 72].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-end gap-0.5">
                    <div className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-t" style={{ height: `${v}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                {['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'].map(m => <span key={m}>{m}</span>)}
              </div>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Income Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'Product Sales', amount: 'R 42,100', pct: 88 },
                  { name: 'Delivery Fees', amount: 'R 3,200', pct: 7 },
                  { name: 'Commission', amount: 'R 1,520', pct: 3 },
                  { name: 'Other', amount: 'R 1,000', pct: 2 },
                ].map(i => (
                  <div key={i.name} className="flex items-center gap-2"><span className="text-sm flex-1">{i.name}</span><span className="text-xs font-medium">{i.amount}</span><Progress value={i.pct} className="w-16 h-1.5" /></div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Expense Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'Platform Subscription', amount: 'R 2,400', pct: 13 },
                  { name: 'Shipping Costs', amount: 'R 4,800', pct: 26 },
                  { name: 'Marketing', amount: 'R 3,200', pct: 17 },
                  { name: 'AI Usage', amount: 'R 1,800', pct: 10 },
                  { name: 'Payment Fees', amount: 'R 2,100', pct: 11 },
                  { name: 'Other', amount: 'R 4,100', pct: 23 },
                ].map(e => (
                  <div key={e.name} className="flex items-center gap-2"><span className="text-sm flex-1">{e.name}</span><span className="text-xs font-medium">{e.amount}</span><Progress value={e.pct} className="w-16 h-1.5" /></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-blue-500" />AI Financial Forecast</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { period: 'Next 30 days', revenue: 'R 52,400', confidence: 87, drivers: ['Seasonal uptick', 'New product launch', 'WhatsApp campaign'] },
                { period: 'Next 90 days', revenue: 'R 158,200', confidence: 72, drivers: ['Back-to-school demand', 'Loyalty program growth', 'Regional expansion'] },
                { period: 'Next 12 months', revenue: 'R 648,000', confidence: 58, drivers: ['Market growth', 'AI optimization', 'Customer retention'] },
              ].map(f => (
                <div key={f.period} className="p-4 rounded-xl border bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{f.period}</span>
                    <span className="text-lg font-bold text-emerald-600">{f.revenue}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <Progress value={f.confidence} className="flex-1 h-1.5" />
                    <span className="text-xs font-medium">{f.confidence}%</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">{f.drivers.map(d => <Badge key={d} variant="secondary" className="text-[10px]">{d}</Badge>)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Landmark className="h-4 w-4 text-purple-500" />Funding Readiness</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="72, 100" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">72%</span>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { name: 'Business Registration', done: true },
                    { name: 'Financial Records (6+ months)', done: true },
                    { name: 'Tax Compliance', done: true },
                    { name: 'Business Plan', done: false },
                    { name: 'Bank Statements', done: false },
                  ].map(r => (
                    <div key={r.name} className="flex items-center gap-2">
                      {r.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      <span className="text-sm">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'SEFA Loan', amount: 'Up to R 500K', type: 'Government' },
                  { name: 'Bank Loan', amount: 'R 50K - R 2M', type: 'Commercial' },
                  { name: 'Angel Investor', amount: 'R 200K+', type: 'Equity' },
                ].map(f => (
                  <div key={f.name} className="p-3 rounded-xl border bg-white text-center">
                    <p className="font-medium text-sm">{f.name}</p>
                    <p className="text-xs text-emerald-600 font-bold">{f.amount}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">{f.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Tax Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'VAT Collected', amount: 'R 6,187', period: 'This quarter', status: 'Filed' },
                { name: 'PAYE', amount: 'R 0', period: 'No employees', status: 'N/A' },
                { name: 'Income Tax', amount: 'R 14,346', period: 'Annual estimate', status: 'Pending' },
                { name: 'Provisional Tax', amount: 'R 7,173', period: '6-monthly', status: 'Due Aug' },
              ].map(t => (
                <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <Receipt className="h-5 w-5 text-emerald-500" />
                  <div className="flex-1"><p className="font-medium text-sm">{t.name}</p><p className="text-xs text-muted-foreground">{t.period}</p></div>
                  <span className="font-bold">{t.amount}</span>
                  <Badge variant="secondary" className="text-xs">{t.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

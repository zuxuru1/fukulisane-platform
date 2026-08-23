import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  Users, UserPlus, FileText, ClipboardList, Mail, Phone, DollarSign,
  Calendar, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, Eye,
  Plus, Star, MessageCircle, Target, Briefcase, Building2
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function BusinessEngine({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  const leads = [
    { name: 'Sipho Dlamini', source: 'WhatsApp', value: 'R 4,200', stage: 'qualified', score: 87, contact: '+27 82 456 7890' },
    { name: 'Emily Chen', source: 'Website', value: 'R 8,900', stage: 'proposal', score: 92, contact: 'emily@company.co.za' },
    { name: 'Pieter van Zyl', source: 'Instagram', value: 'R 2,100', stage: 'contacted', score: 65, contact: '+27 83 123 4567' },
    { name: 'Fatima Patel', source: 'Referral', value: 'R 12,400', stage: 'negotiation', score: 95, contact: 'fatima.p@gmail.com' },
    { name: 'Brian Nkosi', source: 'Facebook', value: 'R 1,800', stage: 'new', score: 45, contact: '+27 84 789 0123' },
  ]

  const invoices = [
    { id: 'INV-089', client: 'Sipho Dlamini', amount: 'R 4,200', status: 'paid', due: '15 Jul', created: '01 Jul' },
    { id: 'INV-088', client: 'Emily Chen', amount: 'R 8,900', status: 'sent', due: '22 Jul', created: '08 Jul' },
    { id: 'INV-087', client: 'Fatima Patel', amount: 'R 12,400', status: 'overdue', due: '10 Jul', created: '25 Jun' },
    { id: 'INV-086', client: 'Pieter van Zyl', amount: 'R 2,100', status: 'paid', due: '05 Jul', created: '20 Jun' },
  ]

  const quotations = [
    { id: 'QTN-034', client: 'Brian Nkosi', amount: 'R 6,800', valid: '26 Jul', status: 'pending' },
    { id: 'QTN-033', client: 'Lisa Williams', amount: 'R 3,400', valid: '20 Jul', status: 'accepted' },
    { id: 'QTN-032', client: 'David Okafor', amount: 'R 15,200', valid: '18 Jul', status: 'expired' },
  ]

  const tasks = [
    { title: 'Follow up with Emily Chen', due: 'Today', priority: 'high', done: false },
    { title: 'Send quotation to Brian Nkosi', due: 'Tomorrow', priority: 'medium', done: false },
    { title: 'Process Fatima Patel order', due: 'Today', priority: 'high', done: false },
    { title: 'Update product pricing', due: '22 Jul', priority: 'low', done: true },
    { title: 'Review monthly invoices', due: '19 Jul', priority: 'medium', done: false },
  ]

  const stageColors: Record<string, string> = {
    new: 'bg-slate-100 text-slate-600', contacted: 'bg-blue-100 text-blue-700',
    qualified: 'bg-amber-100 text-amber-700', proposal: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-emerald-100 text-emerald-700',
  }
  const invoiceColors: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700', sent: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700', draft: 'bg-slate-100 text-slate-600',
  }
  const priorityColors: Record<string, string> = {
    high: 'text-red-500', medium: 'text-amber-500', low: 'text-emerald-500'
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="h-6 w-6 text-blue-500" />Business Engine</h1>
          <p className="text-muted-foreground text-sm">CRM, leads, invoices, quotations & tasks</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Lead</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: '24', icon: UserPlus, color: 'text-blue-500' },
          { label: 'Pipeline Value', value: 'R 29,400', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Outstanding', value: 'R 21,300', icon: FileText, color: 'text-amber-500' },
          { label: 'Open Tasks', value: '4', icon: ClipboardList, color: 'text-purple-500' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            <p className="text-xl font-bold">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads" className="text-xs"><UserPlus className="h-3 w-3 mr-1" />Leads</TabsTrigger>
          <TabsTrigger value="invoices" className="text-xs"><FileText className="h-3 w-3 mr-1" />Invoices</TabsTrigger>
          <TabsTrigger value="quotations" className="text-xs"><ClipboardList className="h-3 w-3 mr-1" />Quotations</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Pipeline</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {['new', 'contacted', 'qualified', 'proposal', 'negotiation'].map(stage => (
                  <div key={stage} className="flex-1 text-center">
                    <Badge className={stageColors[stage]}>{stage}</Badge>
                    <p className="text-lg font-bold mt-1">{leads.filter(l => l.stage === stage).length}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {leads.map(l => (
                  <div key={l.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">{l.name[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><span className="font-medium text-sm">{l.name}</span><Badge className={stageColors[l.stage]}>{l.stage}</Badge></div>
                      <p className="text-xs text-muted-foreground">{l.source} · {l.contact}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{l.value}</p>
                      <div className="flex items-center gap-1"><Target className={`h-3 w-3 ${l.score > 80 ? 'text-emerald-500' : l.score > 60 ? 'text-amber-500' : 'text-red-500'}`} /><span className="text-xs">{l.score}</span></div>
                    </div>
                    <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Mail className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Paid', value: 'R 6,300', color: 'text-emerald-600' },
                { label: 'Sent', value: 'R 8,900', color: 'text-blue-600' },
                { label: 'Overdue', value: 'R 12,400', color: 'text-red-600' },
              ].map(p => (
                <Card key={p.label}><CardContent className="p-3 text-center"><p className={`text-lg font-bold ${p.color}`}>{p.value}</p><p className="text-xs text-muted-foreground">{p.label}</p></CardContent></Card>
              ))}
            </div>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Create Invoice</Button>
          </div>
          {invoices.map(inv => (
            <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-medium text-sm">{inv.id}</span><Badge className={invoiceColors[inv.status]}>{inv.status}</Badge></div>
                <p className="text-xs text-muted-foreground">{inv.client} · Due: {inv.due}</p>
              </div>
              <span className="font-bold">{inv.amount}</span>
              <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="quotations" className="space-y-2">
          <div className="flex justify-end"><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Quotation</Button></div>
          {quotations.map(q => (
            <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-medium text-sm">{q.id}</span><Badge variant="secondary">{q.status}</Badge></div>
                <p className="text-xs text-muted-foreground">{q.client} · Valid until {q.valid}</p>
              </div>
              <span className="font-bold">{q.amount}</span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-2">
          <div className="flex justify-end"><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Task</Button></div>
          {tasks.map((t, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm ${t.done ? 'opacity-50' : ''}`}>
              <CheckCircle2 className={`h-5 w-5 ${t.done ? 'text-emerald-500 fill-emerald-50' : 'text-slate-300 cursor-pointer'}`} />
              <div className="flex-1">
                <p className={`font-medium text-sm ${t.done ? 'line-through' : ''}`}>{t.title}</p>
                <p className="text-xs text-muted-foreground">Due: {t.due}</p>
              </div>
              <Badge variant="outline" className={priorityColors[t.priority]}>{t.priority}</Badge>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

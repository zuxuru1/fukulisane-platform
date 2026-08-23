import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Bell, Mail, MessageCircle, Send, Smartphone, Volume2, Sparkles, Edit3,
  CheckCircle2, Clock, AlertTriangle, Settings, RefreshCw,
  TrendingUp, Eye, MousePointerClick, BarChart3, Plus
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function NotificationCenter({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  const notifications = [
    { title: 'New order #ORD-4521 received', type: 'order', time: '2 min ago', read: false, channel: 'in-app' },
    { title: 'Payment of R 1,240 confirmed', type: 'payment', time: '5 min ago', read: false, channel: 'whatsapp' },
    { title: 'Product "Leather Bag" is low stock', type: 'alert', time: '1h ago', read: false, channel: 'email' },
    { title: 'Customer left a 5-star review', type: 'review', time: '2h ago', read: true, channel: 'in-app' },
    { title: 'Weekly sales report ready', type: 'report', time: '6h ago', read: true, channel: 'email' },
    { title: 'AI recommendation: Run flash sale', type: 'ai', time: '8h ago', read: true, channel: 'in-app' },
    { title: 'Delivery completed for #ORD-4519', type: 'delivery', time: '12h ago', read: true, channel: 'sms' },
    { title: 'New follower on Instagram', type: 'social', time: '1d ago', read: true, channel: 'in-app' },
  ]

  const channels = [
    { name: 'Email', icon: Mail, enabled: true, sent: 312, opened: 145, rate: 46, config: 'SMTP configured' },
    { name: 'SMS', icon: Smartphone, enabled: true, sent: 47, opened: 38, rate: 81, config: 'Twilio connected' },
    { name: 'WhatsApp', icon: MessageCircle, enabled: true, sent: 89, opened: 76, rate: 85, config: 'Business API active' },
    { name: 'Push Notifications', icon: Bell, enabled: true, sent: 1240, opened: 560, rate: 45, config: 'Firebase configured' },
    { name: 'In-App', icon: Volume2, enabled: true, sent: 567, opened: 567, rate: 100, config: 'Always on' },
  ]

  const typeIcons: Record<string, any> = {
    order: CheckCircle2, payment: CheckCircle2, alert: AlertTriangle, review: Eye,
    report: BarChart3, ai: Sparkles, delivery: Clock, social: TrendingUp
  }
  const typeColors: Record<string, string> = {
    order: 'text-emerald-500', payment: 'text-blue-500', alert: 'text-amber-500', review: 'text-purple-500',
    report: 'text-cyan-500', ai: 'text-indigo-500', delivery: 'text-emerald-500', social: 'text-pink-500'
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-amber-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Bell className="h-6 w-6 text-amber-500" />Notification Center</h1>
          <p className="text-muted-foreground text-sm">Email, SMS, WhatsApp, push & in-app notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1"><span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />3 unread</Badge>
          <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-1" />Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sent (30d)', value: '2,255', icon: Send },
          { label: 'Avg Open Rate', value: '52%', icon: Eye },
          { label: 'Active Channels', value: '5/5', icon: Bell },
          { label: 'AI-Generated', value: '67%', icon: Sparkles },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className="h-4 w-4 text-amber-500" /></div>
            <p className="text-xl font-bold">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox" className="text-xs"><Bell className="h-3 w-3 mr-1" />Inbox</TabsTrigger>
          <TabsTrigger value="channels" className="text-xs"><Send className="h-3 w-3 mr-1" />Channels</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs"><Mail className="h-3 w-3 mr-1" />Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-2">
          {notifications.map((n, i) => {
            const Icon = typeIcons[n.type] || Bell
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition ${!n.read ? 'bg-amber-50 border-amber-200' : 'bg-white'}`}>
                <Icon className={`h-5 w-5 ${typeColors[n.type]}`} />
                <div className="flex-1">
                  <p className={`text-sm ${!n.read ? 'font-bold' : 'font-medium'}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time} · via {n.channel}</p>
                </div>
                {!n.read && <div className="h-2 w-2 rounded-full bg-amber-500" />}
              </div>
            )
          })}
        </TabsContent>

        <TabsContent value="channels" className="space-y-3">
          {channels.map(ch => (
            <Card key={ch.name}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ch.icon className="h-5 w-5 text-amber-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{ch.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{ch.config}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Sent: {ch.sent}</span>
                      <span>Opened: {ch.opened}</span>
                      <span className="text-emerald-600 font-medium">{ch.rate}% rate</span>
                    </div>
                  </div>
                  <Switch checked={ch.enabled} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-3">
          {[
            { name: 'Order Confirmation', channel: 'Email + WhatsApp', lastUsed: '2h ago' },
            { name: 'Shipping Update', channel: 'SMS + Email', lastUsed: '5h ago' },
            { name: 'Payment Received', channel: 'WhatsApp', lastUsed: '1h ago' },
            { name: 'Review Request', channel: 'Email', lastUsed: '1d ago' },
            { name: 'Promotional Offer', channel: 'SMS + Email + Push', lastUsed: '3d ago' },
            { name: 'Abandoned Cart', channel: 'Email + WhatsApp', lastUsed: '2d ago' },
          ].map(t => (
            <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
              <Mail className="h-5 w-5 text-amber-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.channel} · Last used: {t.lastUsed}</p>
              </div>
              <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

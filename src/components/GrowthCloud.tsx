import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  Rocket, TrendingUp, Globe, Search, Mail, MessageCircle, Send,
  Star, Users, Repeat, Heart, Tag, Megaphone, Target, Eye,
  ArrowUpRight, BarChart3, Sparkles, CheckCircle2, Plus
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function GrowthCloud({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-pink-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Rocket className="h-6 w-6 text-pink-500" />Growth Cloud</h1>
          <p className="text-muted-foreground text-sm">Marketing automation, SEO, reviews, referrals & loyalty</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Campaign</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Leads Generated', value: '247', change: 32, icon: Users },
          { label: 'SEO Score', value: '78/100', icon: Search },
          { label: 'Referral Revenue', value: 'R 8,400', change: 18, icon: Repeat },
          { label: 'Loyalty Members', value: '156', change: 24, icon: Heart },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className="h-4 w-4 text-pink-500" /></div>
            <p className="text-xl font-bold">{s.value}</p>
            {'change' in s && <div className="flex items-center gap-1 mt-1"><ArrowUpRight className="h-3 w-3 text-emerald-500" /><span className="text-xs text-emerald-500">+{s.change}%</span></div>}
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="marketing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketing" className="text-xs"><Megaphone className="h-3 w-3 mr-1" />Marketing</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs"><Search className="h-3 w-3 mr-1" />SEO</TabsTrigger>
          <TabsTrigger value="social" className="text-xs"><Globe className="h-3 w-3 mr-1" />Social</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs"><Star className="h-3 w-3 mr-1" />Reviews</TabsTrigger>
          <TabsTrigger value="referrals" className="text-xs"><Repeat className="h-3 w-3 mr-1" />Referrals</TabsTrigger>
          <TabsTrigger value="loyalty" className="text-xs"><Heart className="h-3 w-3 mr-1" />Loyalty</TabsTrigger>
        </TabsList>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Active Campaigns</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'WhatsApp Weekend Sale', channel: 'WhatsApp', reach: 342, opened: 287, clicks: 89, revenue: 'R 4,200', status: 'active' },
                { name: 'Email Newsletter', channel: 'Email', reach: 1240, opened: 456, clicks: 123, revenue: 'R 2,800', status: 'active' },
                { name: 'Instagram Promo', channel: 'Social', reach: 4500, opened: 2100, clicks: 340, revenue: 'R 6,100', status: 'active' },
                { name: 'SMS Flash Sale', channel: 'SMS', reach: 180, opened: 156, clicks: 45, revenue: 'R 1,200', status: 'completed' },
              ].map(c => (
                <div key={c.name} className="p-3 rounded-xl border bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{c.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{c.channel}</Badge>
                    </div>
                    <Badge className={c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>{c.status}</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div><p className="text-muted-foreground">Reach</p><p className="font-bold">{c.reach.toLocaleString()}</p></div>
                    <div><p className="text-muted-foreground">Opened</p><p className="font-bold">{c.opened.toLocaleString()}</p></div>
                    <div><p className="text-muted-foreground">Clicks</p><p className="font-bold">{c.clicks}</p></div>
                    <div><p className="text-muted-foreground">Revenue</p><p className="font-bold text-emerald-600">{c.revenue}</p></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">SEO Health</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Meta Titles', score: 85, status: 'good' },
                { name: 'Meta Descriptions', score: 72, status: 'ok' },
                { name: 'Image Alt Tags', score: 45, status: 'poor' },
                { name: 'Page Speed', score: 78, status: 'ok' },
                { name: 'Mobile Friendly', score: 92, status: 'good' },
                { name: 'Schema Markup', score: 60, status: 'ok' },
                { name: 'Internal Links', score: 55, status: 'poor' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-sm flex-1">{s.name}</span>
                  <Progress value={s.score} className="w-32 h-1.5" />
                  <span className="text-xs font-medium w-8 text-right">{s.score}</span>
                  <Badge variant="secondary" className={`text-[10px] ${s.status === 'good' ? 'text-emerald-600' : s.status === 'ok' ? 'text-amber-600' : 'text-red-600'}`}>{s.status}</Badge>
                </div>
              ))}
              <Button size="sm" onClick={() => showToast('AI SEO optimization started')}>Run AI SEO Audit</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Instagram', followers: '1,247', posts: 42, engagement: '4.2%', status: true },
              { name: 'Facebook', followers: '890', posts: 28, engagement: '3.1%', status: true },
              { name: 'TikTok', followers: '2,100', posts: 18, engagement: '7.8%', status: false },
              { name: 'WhatsApp', followers: '342', posts: 12, engagement: '89%', status: true },
            ].map(s => (
              <Card key={s.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{s.name}</span>
                    <Switch checked={s.status} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div><p className="text-muted-foreground">Followers</p><p className="font-bold">{s.followers}</p></div>
                    <div><p className="text-muted-foreground">Posts</p><p className="font-bold">{s.posts}</p></div>
                    <div><p className="text-muted-foreground">Engagement</p><p className="font-bold text-emerald-600">{s.engagement}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Customer Reviews</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center"><p className="text-3xl font-bold">4.7</p><p className="text-xs text-muted-foreground">Average</p></div>
                <div className="flex-1 space-y-1">
                  {[5,4,3,2,1].map(n => (
                    <div key={n} className="flex items-center gap-2 text-xs">
                      <span className="w-2">{n}</span>
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <Progress value={[65, 25, 7, 2, 1][5-n]} className="h-1.5 flex-1" />
                      <span className="w-6 text-right">{[89, 34, 10, 3, 1][5-n]}</span>
                    </div>
                  ))}
                </div>
              </div>
              {[
                { name: 'Thabo M.', rating: 5, text: 'Amazing quality! Fast delivery.', date: '2 days ago' },
                { name: 'Sarah K.', rating: 4, text: 'Great products, will order again.', date: '5 days ago' },
                { name: 'David N.', rating: 5, text: 'Best online store experience!', date: '1 week ago' },
              ].map(r => (
                <div key={r.name} className="p-3 rounded-xl border bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{r.name}</span>
                    <div className="flex">{Array.from({length: r.rating}).map((_, i) => <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />)}</div>
                    <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Referral Program</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-emerald-50"><p className="text-2xl font-bold text-emerald-600">34</p><p className="text-xs text-muted-foreground">Referrals Sent</p></div>
                <div className="text-center p-3 rounded-xl bg-blue-50"><p className="text-2xl font-bold text-blue-600">12</p><p className="text-xs text-muted-foreground">Converted</p></div>
                <div className="text-center p-3 rounded-xl bg-purple-50"><p className="text-2xl font-bold text-purple-600">R 8,400</p><p className="text-xs text-muted-foreground">Revenue</p></div>
              </div>
              <div className="p-3 rounded-xl border bg-white">
                <p className="font-medium text-sm">Referral Reward</p>
                <p className="text-xs text-muted-foreground">Give R 50 credit, Get R 50 credit per successful referral</p>
                <Switch checked className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Loyalty Program</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-amber-50"><p className="text-2xl font-bold text-amber-600">156</p><p className="text-xs text-muted-foreground">Members</p></div>
                <div className="text-center p-3 rounded-xl bg-emerald-50"><p className="text-2xl font-bold text-emerald-600">R 12,400</p><p className="text-xs text-muted-foreground">Points Value</p></div>
                <div className="text-center p-3 rounded-xl bg-purple-50"><p className="text-2xl font-bold text-purple-600">34%</p><p className="text-xs text-muted-foreground">Redemption Rate</p></div>
              </div>
              <div className="p-3 rounded-xl border bg-white">
                <p className="font-medium text-sm mb-2">Tiers</p>
                {[
                  { name: 'Bronze', min: 'R 0', members: 89, color: 'bg-amber-100 text-amber-700' },
                  { name: 'Silver', min: 'R 1,000', members: 45, color: 'bg-slate-200 text-slate-700' },
                  { name: 'Gold', min: 'R 5,000', members: 18, color: 'bg-amber-200 text-amber-800' },
                  { name: 'VIP', min: 'R 15,000', members: 4, color: 'bg-purple-100 text-purple-700' },
                ].map(t => (
                  <div key={t.name} className="flex items-center gap-2 py-1">
                    <Badge className={t.color}>{t.name}</Badge>
                    <span className="text-xs text-muted-foreground flex-1">Min: {t.min}</span>
                    <span className="text-xs font-medium">{t.members} members</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

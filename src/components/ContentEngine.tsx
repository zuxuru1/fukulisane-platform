import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  FileText, Image, Video, Headphones, Plus, Eye, Edit3,
  Globe, Sparkles, TrendingUp, Clock, CheckCircle2, BarChart3,
  Layout, Type, Palette, Megaphone
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function ContentEngine({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  const blogs = [
    { title: '5 Ways to Boost Your Business in 2026', status: 'published', views: 1240, date: '15 Jul', type: 'Blog' },
    { title: 'Behind the Scenes: Our Story', status: 'published', views: 890, date: '10 Jul', type: 'Blog' },
    { title: 'New Collection Launch', status: 'draft', views: 0, date: '18 Jul', type: 'Blog' },
    { title: 'Customer Spotlight: Thabo\'s Journey', status: 'published', views: 560, date: '5 Jul', type: 'Blog' },
  ]

  const landingPages = [
    { title: 'Summer Sale 2026', status: 'live', visits: 3420, conversions: 156, rate: 4.6 },
    { title: 'New Arrivals Collection', status: 'live', visits: 2180, conversions: 89, rate: 4.1 },
    { title: 'Referral Program', status: 'draft', visits: 0, conversions: 0, rate: 0 },
  ]

  const productDescs = [
    { product: 'Premium Leather Bag', status: 'optimized', seo: 92, readability: 88 },
    { product: 'Wireless Earbuds Pro', status: 'optimized', seo: 88, readability: 91 },
    { product: 'Organic Face Cream', status: 'needs-review', seo: 65, readability: 72 },
    { product: 'Bamboo Water Bottle', status: 'optimized', seo: 90, readability: 85 },
  ]

  const media = [
    { name: 'Product Photos', type: 'images', count: 84, size: '240 MB' },
    { name: 'Promotional Videos', type: 'videos', count: 6, size: '1.2 GB' },
    { name: 'Brand Assets', type: 'assets', count: 24, size: '45 MB' },
  ]

  const statusColors: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-700', draft: 'bg-slate-100 text-slate-600', live: 'bg-emerald-100 text-emerald-700',
    optimized: 'bg-emerald-100 text-emerald-700', 'needs-review': 'bg-amber-100 text-amber-700',
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6 text-cyan-500" />Content Engine</h1>
          <p className="text-muted-foreground text-sm">Blogs, landing pages, product descriptions & media</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />Generate Content</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Blog Posts', value: '4', icon: FileText },
          { label: 'Landing Pages', value: '3', icon: Layout },
          { label: 'Total Views', value: '2,690', icon: Eye, change: 18 },
          { label: 'Media Files', value: '114', icon: Image },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className="h-4 w-4 text-cyan-500" /></div>
            <p className="text-xl font-bold">{s.value}</p>
            {'change' in s && <div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-emerald-500" /><span className="text-xs text-emerald-500">+{s.change}%</span></div>}
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="blog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blog" className="text-xs"><FileText className="h-3 w-3 mr-1" />Blog</TabsTrigger>
          <TabsTrigger value="landing" className="text-xs"><Layout className="h-3 w-3 mr-1" />Landing Pages</TabsTrigger>
          <TabsTrigger value="descriptions" className="text-xs"><Type className="h-3 w-3 mr-1" />Product Desc</TabsTrigger>
          <TabsTrigger value="media" className="text-xs"><Image className="h-3 w-3 mr-1" />Media</TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-2">
          <div className="flex justify-end"><Button size="sm"><Sparkles className="h-4 w-4 mr-1" />AI Generate Blog</Button></div>
          {blogs.map(b => (
            <div key={b.title} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
              <FileText className="h-5 w-5 text-cyan-500" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-medium text-sm">{b.title}</span><Badge className={statusColors[b.status]}>{b.status}</Badge></div>
                <p className="text-xs text-muted-foreground">{b.date} · {b.views > 0 ? `${b.views.toLocaleString()} views` : 'Not published'}</p>
              </div>
              <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="landing" className="space-y-3">
          <div className="flex justify-end"><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Landing Page</Button></div>
          {landingPages.map(lp => (
            <Card key={lp.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{lp.title}</span>
                    <Badge className={statusColors[lp.status]}>{lp.status}</Badge>
                  </div>
                  <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div><p className="text-muted-foreground">Visits</p><p className="font-bold">{lp.visits.toLocaleString()}</p></div>
                  <div><p className="text-muted-foreground">Conversions</p><p className="font-bold">{lp.conversions}</p></div>
                  <div><p className="text-muted-foreground">Rate</p><p className="font-bold">{lp.rate}%</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="descriptions" className="space-y-3">
          <div className="flex justify-end"><Button size="sm"><Sparkles className="h-4 w-4 mr-1" />AI Optimize All</Button></div>
          {productDescs.map(p => (
            <div key={p.product} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
              <Type className="h-5 w-5 text-cyan-500" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-medium text-sm">{p.product}</span><Badge className={statusColors[p.status]}>{p.status}</Badge></div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs"><span className="text-muted-foreground">SEO:</span><Progress value={p.seo} className="w-16 h-1" /><span>{p.seo}</span></div>
                  <div className="flex items-center gap-1 text-xs"><span className="text-muted-foreground">Readability:</span><Progress value={p.readability} className="w-16 h-1" /><span>{p.readability}</span></div>
                </div>
              </div>
              <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="media" className="space-y-3">
          <div className="flex justify-end"><Button size="sm"><Plus className="h-4 w-4 mr-1" />Upload Media</Button></div>
          {media.map(m => (
            <Card key={m.name}>
              <CardContent className="p-4 flex items-center gap-3">
                {m.type === 'images' ? <Image className="h-5 w-5 text-cyan-500" /> : m.type === 'videos' ? <Video className="h-5 w-5 text-cyan-500" /> : <Palette className="h-5 w-5 text-cyan-500" />}
                <div className="flex-1">
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.count} files · {m.size}</p>
                </div>
                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

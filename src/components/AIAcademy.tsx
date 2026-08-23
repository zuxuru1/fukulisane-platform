import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  GraduationCap, BookOpen, Award, Brain, Play, Clock, Users,
  Star, CheckCircle2, Lock, Sparkles, TrendingUp, Target, Video,
  Headphones, FileText, ChevronRight, Trophy, Zap
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function AIAcademy({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  const courses = [
    { title: 'Digital Marketing Mastery', category: 'Marketing', lessons: 12, duration: '4h 30m', progress: 75, rating: 4.8, students: 1240, instructor: 'AI Coach', level: 'Intermediate' },
    { title: 'Social Media for Business', category: 'Marketing', lessons: 8, duration: '2h 15m', progress: 100, rating: 4.9, students: 890, instructor: 'AI Coach', level: 'Beginner' },
    { title: 'Financial Management 101', category: 'Finance', lessons: 10, duration: '3h 45m', progress: 40, rating: 4.7, students: 560, instructor: 'AI Coach', level: 'Beginner' },
    { title: 'SEO & Content Strategy', category: 'Marketing', lessons: 15, duration: '5h 20m', progress: 0, rating: 4.8, students: 720, instructor: 'AI Coach', level: 'Advanced' },
    { title: 'Customer Service Excellence', category: 'Operations', lessons: 6, duration: '1h 50m', progress: 100, rating: 4.6, students: 430, instructor: 'AI Coach', level: 'Beginner' },
    { title: 'Scaling Your E-commerce', category: 'Growth', lessons: 14, duration: '4h 10m', progress: 0, rating: 4.9, students: 380, instructor: 'AI Coach', level: 'Advanced', locked: true },
  ]

  const coaching = [
    { title: 'Business Health Check', type: 'AI Analysis', status: 'completed', result: 'Score: 87/100', icon: Brain },
    { title: 'Pricing Strategy Review', type: 'AI Coaching', status: 'active', result: '3 recommendations', icon: Target },
    { title: 'Customer Retention Plan', type: 'AI Strategy', status: 'scheduled', result: 'Tomorrow 10:00', icon: Users },
    { title: 'Growth Opportunity Report', type: 'AI Research', status: 'completed', result: '5 opportunities found', icon: TrendingUp },
  ]

  const playbooks = [
    { title: 'Restaurant Growth Playbook', industry: 'Food & Beverage', pages: 42, rating: 4.8 },
    { title: 'Retail Success Guide', industry: 'Retail', pages: 38, rating: 4.7 },
    { title: 'Fashion Brand Starter Kit', industry: 'Fashion', pages: 28, rating: 4.9 },
    { title: 'Health & Beauty Business Guide', industry: 'Health', pages: 32, rating: 4.6 },
  ]

  const certificates = [
    { name: 'Digital Marketing Fundamentals', earned: 'Jun 2026', level: 'Bronze' },
    { name: 'Customer Service Excellence', earned: 'May 2026', level: 'Bronze' },
  ]

  const categoryColors: Record<string, string> = {
    Marketing: 'bg-blue-100 text-blue-700', Finance: 'bg-emerald-100 text-emerald-700',
    Operations: 'bg-amber-100 text-amber-700', Growth: 'bg-purple-100 text-purple-700',
  }
  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700', active: 'bg-blue-100 text-blue-700', scheduled: 'bg-slate-100 text-slate-600',
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-violet-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><GraduationCap className="h-6 w-6 text-violet-500" />AI Academy</h1>
          <p className="text-muted-foreground text-sm">Courses, certifications, AI coaching & industry playbooks</p>
        </div>
        <Badge variant="secondary" className="gap-1"><Trophy className="h-3 w-3 text-amber-500" />2 Certificates</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Courses Enrolled', value: '4', icon: BookOpen },
          { label: 'Completed', value: '2', icon: CheckCircle2 },
          { label: 'Learning Hours', value: '12h', icon: Clock },
          { label: 'AI Coaching', value: '8 sessions', icon: Brain },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className="h-4 w-4 text-violet-500" /></div>
            <p className="text-xl font-bold">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses" className="text-xs"><BookOpen className="h-3 w-3 mr-1" />Courses</TabsTrigger>
          <TabsTrigger value="coaching" className="text-xs"><Brain className="h-3 w-3 mr-1" />AI Coaching</TabsTrigger>
          <TabsTrigger value="playbooks" className="text-xs"><FileText className="h-3 w-3 mr-1" />Playbooks</TabsTrigger>
          <TabsTrigger value="certs" className="text-xs"><Award className="h-3 w-3 mr-1" />Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-3">
          {courses.map(c => (
            <Card key={c.title} className={c.locked ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    {c.locked ? <Lock className="h-5 w-5 text-white" /> : c.progress === 100 ? <CheckCircle2 className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{c.title}</span>
                      <Badge className={categoryColors[c.category]}>{c.category}</Badge>
                      <Badge variant="outline" className="text-[10px]">{c.level}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.lessons} lessons · {c.duration} · ⭐ {c.rating} · {c.students} students</p>
                    {c.progress > 0 && <Progress value={c.progress} className="h-1.5 mt-1" />}
                  </div>
                  <div className="text-right">
                    {c.progress === 100 ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Complete</Badge>
                    ) : c.progress > 0 ? (
                      <span className="text-sm font-bold text-violet-600">{c.progress}%</span>
                    ) : c.locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => showToast('Starting course...')}>Start</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="coaching" className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-500" />AI Business Coaching</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {coaching.map(c => (
                <div key={c.title} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><c.icon className="h-4 w-4 text-white" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="font-medium text-sm">{c.title}</span><Badge className={statusColors[c.status]}>{c.status}</Badge></div>
                    <p className="text-xs text-muted-foreground">{c.type} · {c.result}</p>
                  </div>
                  {c.status === 'active' && <Button size="sm" variant="outline">Continue</Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playbooks" className="space-y-3">
          {playbooks.map(p => (
            <Card key={p.title}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-violet-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.industry} · {p.pages} pages · ⭐ {p.rating}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => showToast('Opening playbook...')}>Read</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="certs" className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            {certificates.map(c => (
              <Card key={c.name}>
                <CardContent className="p-6 text-center">
                  <Award className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Earned: {c.earned}</p>
                  <Badge className="mt-2 bg-amber-100 text-amber-700">{c.level}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  CheckSquare, Home, BookOpen, Image, Users, UserCog, ClipboardCheck,
  CalendarOff, ShoppingCart, Truck, Package, Calculator, Sparkles, BarChart3,
  DollarSign, TrendingUp, UserSearch, Target, Zap, Network, Settings, Plus,
  Trash2, Edit3, Clock, MapPin, Phone, Mail, Star, AlertTriangle, CheckCircle2,
  Circle, ArrowUpRight, Calendar, FileText, Send, Download, Eye, Search,
  Filter, RefreshCw, ChevronDown, ChevronRight, X, Hammer, Wrench, Globe,
  MessageCircle, Copy, Building, ExternalLink, Wifi, WifiOff, Server,
  Shield, Bell, Database, Cloud, Activity, BarChart, PieChart, TrendingDown,
  Award, Briefcase, Users2, Layers, GitBranch, Cpu, Monitor, HardDrive,
  Thermometer, Fuel, Wrench as WrenchIcon, Key, Lock, UserPlus, Archive,
  Timer, PlayCircle, PauseCircle, StopCircle, RotateCcw, Upload
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

const fetchJson = async (url: string) => {
  try {
    const r = await fetch(url)
    const d = await r.json()
    return Array.isArray(d) ? d : d.items ?? d.data ?? d.results ?? []
  } catch { return [] }
}

const postJson = async (url: string, body: any) => {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return r.json()
}

const patchJson = async (url: string, body: any) => {
  const r = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return r.json()
}

const deleteJson = async (url: string) => fetch(url, { method: 'DELETE' })

const SectionHeader = ({ icon: Icon, title, desc, color, action }: { icon: any; title: string; desc: string; color: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
        </div>
      </div>
    </div>
    {action}
  </div>
)

const EmptyState = ({ icon: Icon, title, desc, action }: { icon: any; title: string; desc: string; action?: React.ReactNode }) => (
  <Card className="bg-white border-gray-200">
    <CardContent className="p-12 text-center">
      <Icon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{desc}</p>
      {action}
    </CardContent>
  </Card>
)

const StatCard = ({ label, value, icon: Icon, color, sub }: { label: string; value: any; icon: any; color: string; sub?: string }) => (
  <Card className="bg-white border-gray-200 shadow-sm">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-[11px] text-gray-400 font-medium">{label}</p>
          {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. TASKS — Project task management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function TasksPipeline() {
  const [tasks, setTasks] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', projectId: '', priority: 'medium', dueDate: '' })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchJson(`/api/projects?businessId=${BIZ_ID}`).then(setProjects)
    const stored = localStorage.getItem('fuku_tasks')
    if (stored) setTasks(JSON.parse(stored))
  }, [])

  const saveTasks = (t: any[]) => { setTasks(t); localStorage.setItem('fuku_tasks', JSON.stringify(t)) }

  const addTask = () => {
    if (!form.title) return
    const task = { id: `t_${Date.now()}`, ...form, status: 'todo', createdAt: new Date().toISOString() }
    saveTasks([task, ...tasks])
    setForm({ title: '', description: '', projectId: '', priority: 'medium', dueDate: '' })
    setOpen(false)
  }

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t))
  }

  const deleteTask = (id: string) => saveTasks(tasks.filter(t => t.id !== id))

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter)
  const done = tasks.filter(t => t.status === 'done').length
  const priorityColor: Record<string, string> = { high: '#dc2626', medium: '#d97706', low: '#059669' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={CheckSquare} title="Tasks" desc={`${tasks.length} tasks, ${done} completed`} color="#2563eb"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Task</Button>} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={CheckSquare} label="Total" value={tasks.length} color="#2563eb" />
        <StatCard icon={Clock} label="In Progress" value={tasks.filter(t => t.status === 'in_progress').length} color="#d97706" />
        <StatCard icon={CheckCircle2} label="Done" value={done} color="#059669" sub={tasks.length ? `${Math.round(done/tasks.length*100)}%` : ''} />
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {['all', 'todo', 'in_progress', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f === 'all' ? 'All' : f.replace('_', ' ')} ({f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks yet" desc="Add tasks to track project work" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add First Task</Button>} />
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <Card key={t.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <button onClick={() => toggleTask(t.id)} className="shrink-0">
                  {t.status === 'done' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-gray-300 hover:text-gray-500" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{t.title}</p>
                  {t.description && <p className="text-[10px] text-gray-400 truncate">{t.description}</p>}
                </div>
                <Badge variant="outline" className="text-[9px] shrink-0" style={{ borderColor: priorityColor[t.priority], color: priorityColor[t.priority] }}>{t.priority}</Badge>
                {t.dueDate && <span className="text-[10px] text-gray-400 shrink-0">{t.dueDate}</span>}
                <button onClick={() => deleteTask(t.id)} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Task</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="Task title..." /></div>
            <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Priority</Label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div><Label className="text-xs">Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            {projects.length > 0 && <div><Label className="text-xs">Project</Label>
              <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                <option value="">No project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>}
            <Button onClick={addTask} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Task</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. HOUSE PLANS — Blueprint management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function HousePlansPipeline() {
  const [plans, setPlans] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: '3-room', bedrooms: '3', bathrooms: '1', area: '', imageUrl: '' })

  useEffect(() => {
    const stored = localStorage.getItem('fuku_plans')
    if (stored) setPlans(JSON.parse(stored))
  }, [])

  const savePlans = (p: any[]) => { setPlans(p); localStorage.setItem('fuku_plans', JSON.stringify(p)) }

  const addPlan = () => {
    if (!form.title) return
    savePlans([{ id: `plan_${Date.now()}`, ...form, status: 'draft', createdAt: new Date().toISOString() }, ...plans])
    setForm({ title: '', description: '', category: '3-room', bedrooms: '3', bathrooms: '1', area: '', imageUrl: '' })
    setOpen(false)
  }

  const deletePlan = (id: string) => savePlans(plans.filter(p => p.id !== id))

  const categoryColors: Record<string, string> = { '3-room': '#2563eb', '4-room': '#7c3aed', '5-room': '#059669', 'renovation': '#d97706', 'custom': '#dc2626' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Home} title="House Plans" desc={`${plans.length} plans in library`} color="#7c3aed"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Plan</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <StatCard key={cat} icon={Home} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={plans.filter(p => p.category === cat).length} color={color} />
        ))}
      </div>

      {plans.length === 0 ? (
        <EmptyState icon={Home} title="No house plans yet" desc="Add blueprints and floor plans for your projects" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add First Plan</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(p => (
            <Card key={p.id} className="bg-white border-gray-200 shadow-sm overflow-hidden">
              {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover" /> : (
                <div className="w-full h-40 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center"><Home className="h-10 text-purple-200" /></div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-gray-900">{p.title}</h3>
                  <Badge variant="outline" className="text-[9px]" style={{ borderColor: categoryColors[p.category], color: categoryColors[p.category] }}>{p.category}</Badge>
                </div>
                <div className="flex gap-3 text-[10px] text-gray-400 mt-1">
                  <span>🛏️ {p.bedrooms} bed</span><span>🚿 {p.bathrooms} bath</span>{p.area && <span>📐 {p.area}m²</span>}
                </div>
                {p.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.description}</p>}
                <button onClick={() => deletePlan(p.id)} className="text-[10px] text-red-500 hover:text-red-600 mt-2 font-medium">Remove</button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add House Plan</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Plan Name *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. 4-Room Modern" /></div>
            <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Category</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                  <option value="3-room">3-Room</option><option value="4-room">4-Room</option><option value="5-room">5-Room</option><option value="renovation">Renovation</option><option value="custom">Custom</option>
                </select>
              </div>
              <div><Label className="text-xs">Bedrooms</Label><Input type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Bathrooms</Label><Input type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Area (m²)</Label><Input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. 85" /></div>
              <div><Label className="text-xs">Image URL</Label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="https://..." /></div>
            </div>
            <Button onClick={addPlan} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Plan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. SITE DIARY — Daily site logs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function SiteDiaryPipeline() {
  const [entries, setEntries] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], projectId: '', weather: 'sunny', workers: '', activities: '', issues: '', photos: '' })

  useEffect(() => {
    fetchJson(`/api/projects?businessId=${BIZ_ID}`).then(setProjects)
    const stored = localStorage.getItem('fuku_diary')
    if (stored) setEntries(JSON.parse(stored))
  }, [])

  const saveEntries = (e: any[]) => { setEntries(e); localStorage.setItem('fuku_diary', JSON.stringify(e)) }

  const addEntry = () => {
    if (!form.activities) return
    saveEntries([{ id: `diary_${Date.now()}`, ...form, createdAt: new Date().toISOString() }, ...entries])
    setForm({ date: new Date().toISOString().split('T')[0], projectId: '', weather: 'sunny', workers: '', activities: '', issues: '', photos: '' })
    setOpen(false)
  }

  const weatherEmoji: Record<string, string> = { sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', windy: '💨' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={BookOpen} title="Site Diary" desc={`${entries.length} daily entries`} color="#d97706"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> New Entry</Button>} />

      {entries.length === 0 ? (
        <EmptyState icon={BookOpen} title="No diary entries" desc="Log daily site activities, weather, and progress" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> First Entry</Button>} />
      ) : (
        <div className="space-y-3">
          {entries.map(e => (
            <Card key={e.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{weatherEmoji[e.weather] || '☀️'}</span>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      {e.projectId && <p className="text-[10px] text-gray-400">{projects.find(p => p.id === e.projectId)?.title || 'Project'}</p>}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(e.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Activities</p>
                    <p className="text-xs text-gray-700 mt-1">{e.activities}</p>
                  </div>
                  {e.workers && <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Workers</p>
                    <p className="text-xs text-gray-700 mt-1">{e.workers}</p>
                  </div>}
                  {e.issues && <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-[10px] font-bold text-red-500 uppercase">Issues</p>
                    <p className="text-xs text-red-600 mt-1">{e.issues}</p>
                  </div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Site Diary Entry</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Date *</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Weather</Label>
                <select value={form.weather} onChange={e => setForm({ ...form, weather: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                  <option value="sunny">☀️ Sunny</option><option value="cloudy">☁️ Cloudy</option><option value="rainy">🌧️ Rainy</option><option value="stormy">⛈️ Stormy</option><option value="windy">💨 Windy</option>
                </select>
              </div>
            </div>
            {projects.length > 0 && <div><Label className="text-xs">Project</Label>
              <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                <option value="">Select project...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>}
            <div><Label className="text-xs">Workers on Site</Label><Input value={form.workers} onChange={e => setForm({ ...form, workers: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. 5 bricklayers, 2 plumbers" /></div>
            <div><Label className="text-xs">Activities *</Label><Textarea value={form.activities} onChange={e => setForm({ ...form, activities: e.target.value })} className="bg-gray-50 border-gray-200" rows={3} placeholder="What was done today..." /></div>
            <div><Label className="text-xs">Issues / Delays</Label><Textarea value={form.issues} onChange={e => setForm({ ...form, issues: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} placeholder="Any problems encountered..." /></div>
            <Button onClick={addEntry} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Save Entry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. PHOTO GALLERY — Project photos
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function PhotoGalleryPipeline() {
  const [images, setImages] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ imageUrl: '', caption: '' })

  useEffect(() => { fetchJson(`/api/businesses/${BIZ_ID}/gallery`).then(setImages) }, [])

  const addImage = async () => {
    if (!form.imageUrl) return
    const res = await postJson(`/api/businesses/${BIZ_ID}/gallery`, form)
    setImages([res, ...images])
    setForm({ imageUrl: '', caption: '' })
    setOpen(false)
  }

  const deleteImage = async (id: string) => {
    await deleteJson(`/api/gallery-images/${id}`)
    setImages(images.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Image} title="Photo Gallery" desc={`${images.length} photos`} color="#dc2626"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Photo</Button>} />

      {images.length === 0 ? (
        <EmptyState icon={Image} title="No photos yet" desc="Upload project photos to showcase your work" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add First Photo</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map(img => (
            <Card key={img.id} className="bg-white border-gray-200 shadow-sm overflow-hidden group">
              <div className="relative">
                <img src={img.imageUrl} alt={img.caption || 'Gallery'} className="w-full h-48 object-cover" />
                <button onClick={() => deleteImage(img.id)} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              {img.caption && <CardContent className="p-3"><p className="text-xs text-gray-600">{img.caption}</p></CardContent>}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Photo</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Image URL *</Label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="https://..." /></div>
            <div><Label className="text-xs">Caption</Label><Input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. Completed 4-room house" /></div>
            <Button onClick={addImage} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Photo</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. CLIENTS — Customer database
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function ClientsPipeline() {
  const [clients, setClients] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '', notes: '' })

  useEffect(() => {
    fetchJson(`/api/businesses/${BIZ_ID}/customers`).then(setClients)
    fetchJson(`/api/leads?businessId=${BIZ_ID}`).then(setLeads)
    fetchJson(`/api/invoices?businessId=${BIZ_ID}`).then(setInvoices)
  }, [])

  const wonLeads = leads.filter(l => l.status === 'won' || l.stage === 'completed')
  const allClients = [...clients, ...wonLeads.map(l => ({ ...l, name: l.name || l.clientName, source: 'lead' }))]
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)

  const addClient = async () => {
    if (!form.name) return
    await postJson(`/api/businesses/${BIZ_ID}/customers`, { ...form, source: 'manual' })
    setClients([form, ...clients])
    setForm({ name: '', phone: '', email: '', location: '', notes: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title="Clients" desc={`${allClients.length} clients in database`} color="#059669"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Client</Button>} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Users} label="Total Clients" value={allClients.length} color="#059669" />
        <StatCard icon={DollarSign} label="Revenue" value={`R${totalRevenue.toLocaleString()}`} color="#2563eb" />
        <StatCard icon={TrendingUp} label="Won Leads" value={wonLeads.length} color="#d97706" />
      </div>

      {allClients.length === 0 ? (
        <EmptyState icon={Users} title="No clients yet" desc="Clients appear here from leads and manual entry" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add Client</Button>} />
      ) : (
        <div className="space-y-2">
          {allClients.map((c, i) => (
            <Card key={c.id || i} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-600 shrink-0">{c.name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {c.phone && `📱 ${c.phone}`}{c.email && ` • ✉️ ${c.email}`}{c.location && ` • 📍 ${c.location}`}
                  </p>
                </div>
                {c.source && <Badge variant="outline" className="text-[9px]">{c.source}</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Client</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="Town/city" /></div>
            <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} /></div>
            <Button onClick={addClient} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Client</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. EMPLOYEES — Staff directory
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function EmployeesPipeline() {
  const [staff, setStaff] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', role: '', department: '', hourlyRate: '' })

  useEffect(() => { fetchJson(`/api/staff?businessId=${BIZ_ID}`).then(setStaff) }, [])

  const addStaff = async () => {
    if (!form.firstName || !form.role) return
    const res = await postJson('/api/staff', { businessId: BIZ_ID, ...form, hourlyRate: parseFloat(form.hourlyRate) || 0 })
    setStaff([res.data ?? res, ...staff])
    setForm({ firstName: '', lastName: '', phone: '', email: '', role: '', department: '', hourlyRate: '' })
    setOpen(false)
  }

  const toggleStatus = async (s: any) => {
    const newStatus = s.status === 'active' ? 'inactive' : 'active'
    await patchJson(`/api/staff/${s.id}`, { status: newStatus })
    setStaff(staff.map(st => st.id === s.id ? { ...st, status: newStatus } : st))
  }

  const roleColors: Record<string, string> = { foreman: '#059669', bricklayer: '#2563eb', plumber: '#7c3aed', electrician: '#d97706', painter: '#dc2626', carpenter: '#d4a843', general: '#6b7280' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={UserCog} title="Employees" desc={`${staff.length} team members`} color="#2563eb"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Staff</Button>} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={UserCog} label="Total Staff" value={staff.length} color="#2563eb" />
        <StatCard icon={CheckCircle2} label="Active" value={staff.filter(s => s.status === 'active').length} color="#059669" />
        <StatCard icon={DollarSign} label="Avg Hourly" value={staff.length ? `R${Math.round(staff.reduce((s, st) => s + (st.hourlyRate || 0), 0) / staff.length)}` : 'R0'} color="#d97706" />
      </div>

      {staff.length === 0 ? (
        <EmptyState icon={UserCog} title="No staff added" desc="Add your team members to manage workforce" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add Staff</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {staff.map(s => (
            <Card key={s.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: roleColors[s.role?.toLowerCase()] || '#6b7280' }}>
                    {s.firstName?.charAt(0)}{s.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{s.firstName} {s.lastName}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] capitalize">{s.role}</Badge>
                      {s.department && <span className="text-[10px] text-gray-400">{s.department}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    {s.hourlyRate > 0 && <p className="text-xs font-bold text-gray-700">R{s.hourlyRate}/hr</p>}
                    <button onClick={() => toggleStatus(s)} className={`text-[10px] font-medium ${s.status === 'active' ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {s.status === 'active' ? '● Active' : '○ Inactive'}
                    </button>
                  </div>
                </div>
                {s.phone && <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1"><Phone className="h-3 w-3" /> {s.phone}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">First Name *</Label><Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Last Name</Label><Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Role *</Label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                  <option value="">Select...</option><option>Foreman</option><option>Bricklayer</option><option>Plumber</option><option>Electrician</option><option>Painter</option><option>Carpenter</option><option>General Labour</option>
                </select>
              </div>
              <div><Label className="text-xs">Department</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. Construction" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Hourly Rate (R)</Label><Input type="number" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <Button onClick={addStaff} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Staff</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. ATTENDANCE — Daily attendance tracking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function AttendancePipeline() {
  const [staff, setStaff] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [today] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchJson(`/api/staff?businessId=${BIZ_ID}`).then(setStaff)
    const stored = localStorage.getItem('fuku_attendance')
    if (stored) setRecords(JSON.parse(stored))
  }, [])

  const saveRecords = (r: any[]) => { setRecords(r); localStorage.setItem('fuku_attendance', JSON.stringify(r)) }

  const todayRecords = records.filter(r => r.date === today)

  const markAttendance = (staffId: string, status: string) => {
    const existing = records.findIndex(r => r.staffId === staffId && r.date === today)
    const newRecord = { staffId, date: today, status, checkIn: new Date().toISOString() }
    if (existing >= 0) {
      const updated = [...records]; updated[existing] = newRecord; saveRecords(updated)
    } else {
      saveRecords([newRecord, ...records])
    }
  }

  const statusColors: Record<string, string> = { present: '#059669', absent: '#dc2626', late: '#d97706', leave: '#7c3aed' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={ClipboardCheck} title="Attendance" desc={`Today: ${today}`} color="#059669" />

      <div className="grid grid-cols-4 gap-3">
        {['present', 'absent', 'late', 'leave'].map(s => (
          <StatCard key={s} icon={s === 'present' ? CheckCircle2 : s === 'absent' ? X : s === 'late' ? Clock : CalendarOff}
            label={s.charAt(0).toUpperCase() + s.slice(1)} value={todayRecords.filter(r => r.status === s).length} color={statusColors[s]} />
        ))}
      </div>

      {staff.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No staff to track" desc="Add employees first, then mark daily attendance" />
      ) : (
        <div className="space-y-2">
          {staff.map(s => {
            const record = todayRecords.find(r => r.staffId === s.id)
            const status = record?.status || 'none'
            return (
              <Card key={s.id} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {s.firstName?.charAt(0)}{s.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{s.firstName} {s.lastName}</p>
                    <p className="text-[10px] text-gray-400">{s.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {['present', 'absent', 'late', 'leave'].map(st => (
                      <button key={st} onClick={() => markAttendance(s.id, st)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition border ${status === st ? 'border-current' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}
                        style={status === st ? { color: statusColors[st], backgroundColor: `${statusColors[st]}10` } : {}}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. LEAVE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function LeaveManagementPipeline() {
  const [staff, setStaff] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ staffId: '', type: 'annual', startDate: '', endDate: '', reason: '' })

  useEffect(() => {
    fetchJson(`/api/staff?businessId=${BIZ_ID}`).then(setStaff)
    const stored = localStorage.getItem('fuku_leave')
    if (stored) setRequests(JSON.parse(stored))
  }, [])

  const saveRequests = (r: any[]) => { setRequests(r); localStorage.setItem('fuku_leave', JSON.stringify(r)) }

  const addRequest = () => {
    if (!form.staffId || !form.startDate) return
    saveRequests([{ id: `leave_${Date.now()}`, ...form, status: 'pending', createdAt: new Date().toISOString() }, ...requests])
    setForm({ staffId: '', type: 'annual', startDate: '', endDate: '', reason: '' })
    setOpen(false)
  }

  const updateStatus = (id: string, status: string) => {
    saveRequests(requests.map(r => r.id === id ? { ...r, status } : r))
  }

  const typeColors: Record<string, string> = { annual: '#2563eb', sick: '#dc2626', family: '#7c3aed', unpaid: '#6b7280' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={CalendarOff} title="Leave Management" desc={`${requests.length} requests`} color="#dc2626"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Request Leave</Button>} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Clock} label="Pending" value={requests.filter(r => r.status === 'pending').length} color="#d97706" />
        <StatCard icon={CheckCircle2} label="Approved" value={requests.filter(r => r.status === 'approved').length} color="#059669" />
        <StatCard icon={X} label="Rejected" value={requests.filter(r => r.status === 'rejected').length} color="#dc2626" />
      </div>

      {requests.length === 0 ? (
        <EmptyState icon={CalendarOff} title="No leave requests" desc="Staff can request time off here" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Request Leave</Button>} />
      ) : (
        <div className="space-y-2">
          {requests.map(r => {
            const member = staff.find(s => s.id === r.staffId)
            return (
              <Card key={r.id} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900">{member ? `${member.firstName} ${member.lastName}` : 'Unknown'}</p>
                      <Badge variant="outline" className="text-[9px] capitalize" style={{ borderColor: typeColors[r.type], color: typeColors[r.type] }}>{r.type}</Badge>
                      <Badge variant="outline" className={`text-[9px] capitalize ${r.status === 'approved' ? 'border-emerald-300 text-emerald-600' : r.status === 'rejected' ? 'border-red-300 text-red-600' : 'border-amber-300 text-amber-600'}`}>{r.status}</Badge>
                    </div>
                    <p className="text-[10px] text-gray-400">{r.startDate} → {r.endDate || '...'}</p>
                    {r.reason && <p className="text-xs text-gray-500 mt-1">{r.reason}</p>}
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-emerald-600" onClick={() => updateStatus(r.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-red-500" onClick={() => updateStatus(r.id, 'rejected')}>Reject</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Request Leave</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Staff Member *</Label>
              <select value={form.staffId} onChange={e => setForm({ ...form, staffId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                <option value="">Select...</option>{staff.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Type</Label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                <option value="annual">Annual Leave</option><option value="sick">Sick Leave</option><option value="family">Family Responsibility</option><option value="unpaid">Unpaid Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Start Date *</Label><Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <div><Label className="text-xs">Reason</Label><Textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} /></div>
            <Button onClick={addRequest} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Submit Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. PURCHASE ORDERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function PurchaseOrdersPipeline() {
  const [orders, setOrders] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ supplier: '', items: '', amount: '', dueDate: '', notes: '' })

  useEffect(() => {
    const stored = localStorage.getItem('fuku_pos')
    if (stored) setOrders(JSON.parse(stored))
  }, [])

  const saveOrders = (o: any[]) => { setOrders(o); localStorage.setItem('fuku_pos', JSON.stringify(o)) }

  const addOrder = () => {
    if (!form.supplier || !form.items) return
    const num = `PO-${String(orders.length + 1).padStart(4, '0')}`
    saveOrders([{ id: `po_${Date.now()}`, number: num, ...form, amount: parseFloat(form.amount) || 0, status: 'pending', createdAt: new Date().toISOString() }, ...orders])
    setForm({ supplier: '', items: '', amount: '', dueDate: '', notes: '' })
    setOpen(false)
  }

  const updateStatus = (id: string, status: string) => saveOrders(orders.map(o => o.id === id ? { ...o, status } : o))
  const deleteOrder = (id: string) => saveOrders(orders.filter(o => o.id !== id))

  const totalPending = orders.filter(o => o.status !== 'received').reduce((s, o) => s + o.amount, 0)

  return (
    <div className="space-y-6">
      <SectionHeader icon={ShoppingCart} title="Purchase Orders" desc={`${orders.length} orders, R${totalPending.toLocaleString()} pending`} color="#7c3aed"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> New PO</Button>} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={ShoppingCart} label="Pending" value={orders.filter(o => o.status === 'pending').length} color="#d97706" />
        <StatCard icon={Send} label="Sent" value={orders.filter(o => o.status === 'sent').length} color="#2563eb" />
        <StatCard icon={CheckCircle2} label="Received" value={orders.filter(o => o.status === 'received').length} color="#059669" />
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No purchase orders" desc="Create POs for materials and supplies" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Create PO</Button>} />
      ) : (
        <div className="space-y-2">
          {orders.map(o => (
            <Card key={o.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">{o.number}</p>
                      <Badge variant="outline" className="text-[9px] capitalize">{o.status}</Badge>
                    </div>
                    <p className="text-[10px] text-gray-400">{o.supplier} • {new Date(o.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{o.items}</p>
                  </div>
                  <p className="font-bold text-gray-900 shrink-0">R{o.amount.toLocaleString()}</p>
                  <div className="flex gap-1 shrink-0">
                    {o.status === 'pending' && <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => updateStatus(o.id, 'sent')}>Send</Button>}
                    {o.status === 'sent' && <Button size="sm" variant="ghost" className="h-7 text-[10px] text-emerald-600" onClick={() => updateStatus(o.id, 'received')}>Received</Button>}
                    <button onClick={() => deleteOrder(o.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Supplier *</Label><Input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="Supplier name" /></div>
            <div><Label className="text-xs">Items *</Label><Textarea value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} placeholder="List materials needed..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Amount (R)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <Button onClick={addOrder} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Create PO</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. SUPPLIERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function SuppliersPipeline() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', category: '', address: '', notes: '' })

  useEffect(() => {
    const stored = localStorage.getItem('fuku_suppliers')
    if (stored) setSuppliers(JSON.parse(stored))
  }, [])

  const saveSuppliers = (s: any[]) => { setSuppliers(s); localStorage.setItem('fuku_suppliers', JSON.stringify(s)) }

  const addSupplier = () => {
    if (!form.name) return
    saveSuppliers([{ id: `sup_${Date.now()}`, ...form, createdAt: new Date().toISOString() }, ...suppliers])
    setForm({ name: '', phone: '', email: '', category: '', address: '', notes: '' })
    setOpen(false)
  }

  const deleteSupplier = (id: string) => saveSuppliers(suppliers.filter(s => s.id !== id))

  const catEmoji: Record<string, string> = { cement: '🏗️', bricks: '🧱', plumbing: '🔧', electrical: '⚡', paint: '🎨', timber: '🪵', roofing: '🏠', hardware: '🔨', other: '📦' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Truck} title="Suppliers" desc={`${suppliers.length} suppliers`} color="#d97706"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Supplier</Button>} />

      {suppliers.length === 0 ? (
        <EmptyState icon={Truck} title="No suppliers yet" desc="Add your material suppliers for quick reference" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add Supplier</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {suppliers.map(s => (
            <Card key={s.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{catEmoji[s.category?.toLowerCase()] || '📦'}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{s.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{s.category || 'General'}</p>
                    {s.phone && <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Phone className="h-3 w-3" /> {s.phone}</p>}
                    {s.email && <p className="text-[10px] text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {s.email}</p>}
                    {s.notes && <p className="text-xs text-gray-500 mt-1">{s.notes}</p>}
                  </div>
                  <button onClick={() => deleteSupplier(s.id)} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="Supplier name" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Category</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                  <option value="">Select...</option><option>Cement</option><option>Bricks</option><option>Plumbing</option><option>Electrical</option><option>Paint</option><option>Timber</option><option>Roofing</option><option>Hardware</option><option>Other</option>
                </select>
              </div>
            </div>
            <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} placeholder="Payment terms, delivery notes..." /></div>
            <Button onClick={addSupplier} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Supplier</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. EQUIPMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function EquipmentPipeline() {
  const [equipment, setEquipment] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', status: 'available', location: '', lastService: '', nextService: '', condition: 'good' })

  useEffect(() => {
    const stored = localStorage.getItem('fuku_equipment')
    if (stored) setEquipment(JSON.parse(stored))
  }, [])

  const saveEquipment = (e: any[]) => { setEquipment(e); localStorage.setItem('fuku_equipment', JSON.stringify(e)) }

  const addEquipment = () => {
    if (!form.name) return
    saveEquipment([{ id: `eq_${Date.now()}`, ...form, createdAt: new Date().toISOString() }, ...equipment])
    setForm({ name: '', type: '', status: 'available', location: '', lastService: '', nextService: '', condition: 'good' })
    setOpen(false)
  }

  const deleteEquipment = (id: string) => saveEquipment(equipment.filter(e => e.id !== id))

  const statusColor: Record<string, string> = { available: '#059669', in_use: '#2563eb', maintenance: '#d97706', retired: '#dc2626' }
  const condColor: Record<string, string> = { excellent: '#059669', good: '#2563eb', fair: '#d97706', poor: '#dc2626' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Hammer} title="Equipment" desc={`${equipment.length} items tracked`} color="#059669"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Equipment</Button>} />

      <div className="grid grid-cols-4 gap-3">
        {Object.entries(statusColor).map(([s, c]) => (
          <StatCard key={s} icon={Hammer} label={s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} value={equipment.filter(e => e.status === s).length} color={c} />
        ))}
      </div>

      {equipment.length === 0 ? (
        <EmptyState icon={Hammer} title="No equipment tracked" desc="Add machinery and tools to track availability and maintenance" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add Equipment</Button>} />
      ) : (
        <div className="space-y-2">
          {equipment.map(e => (
            <Card key={e.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${statusColor[e.status]}12` }}>
                  <Hammer className="h-4 w-4" style={{ color: statusColor[e.status] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{e.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] capitalize" style={{ borderColor: statusColor[e.status], color: statusColor[e.status] }}>{e.status.replace('_', ' ')}</Badge>
                    {e.type && <span className="text-[10px] text-gray-400">{e.type}</span>}
                    <Badge variant="outline" className="text-[9px] capitalize" style={{ borderColor: condColor[e.condition], color: condColor[e.condition] }}>{e.condition}</Badge>
                  </div>
                </div>
                <button onClick={() => deleteEquipment(e.id)} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Equipment</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. cement mixer" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Type</Label><Input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. heavy machinery" /></div>
              <div><Label className="text-xs">Status</Label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                  <option value="available">Available</option><option value="in_use">In Use</option><option value="maintenance">Maintenance</option><option value="retired">Retired</option>
                </select>
              </div>
            </div>
            <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="Where is it stored?" /></div>
            <Button onClick={addEquipment} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Equipment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. INVENTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function InventoryPipeline() {
  const [items, setItems] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', quantity: '0', unit: 'pcs', minStock: '10', cost: '' })

  useEffect(() => {
    const stored = localStorage.getItem('fuku_inventory')
    if (stored) setItems(JSON.parse(stored))
  }, [])

  const saveItems = (i: any[]) => { setItems(i); localStorage.setItem('fuku_inventory', JSON.stringify(i)) }

  const addItem = () => {
    if (!form.name) return
    saveItems([{ id: `inv_${Date.now()}`, ...form, quantity: parseInt(form.quantity) || 0, minStock: parseInt(form.minStock) || 10, cost: parseFloat(form.cost) || 0, createdAt: new Date().toISOString() }, ...items])
    setForm({ name: '', category: '', quantity: '0', unit: 'pcs', minStock: '10', cost: '' })
    setOpen(false)
  }

  const updateQty = (id: string, delta: number) => {
    saveItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
  }

  const deleteItem = (id: string) => saveItems(items.filter(i => i.id !== id))

  const totalValue = items.reduce((s, i) => s + (i.quantity * i.cost), 0)
  const lowStock = items.filter(i => i.quantity <= i.minStock)

  return (
    <div className="space-y-6">
      <SectionHeader icon={Package} title="Inventory" desc={`${items.length} items, R${totalValue.toLocaleString()} total value`} color="#2563eb"
        action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]"><Plus className="h-4 w-4 mr-1" /> Add Item</Button>} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Package} label="Total Items" value={items.length} color="#2563eb" />
        <StatCard icon={DollarSign} label="Total Value" value={`R${totalValue.toLocaleString()}`} color="#059669" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} color="#dc2626" />
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Package} title="No inventory items" desc="Track materials and supplies stock levels" action={<Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white"><Plus className="h-4 w-4 mr-1" /> Add Item</Button>} />
      ) : (
        <div className="space-y-2">
          {items.map(i => (
            <Card key={i.id} className={`bg-white shadow-sm ${i.quantity <= i.minStock ? 'border-red-200' : 'border-gray-200'}`}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${i.quantity <= i.minStock ? 'bg-red-50' : 'bg-blue-50'}`}>
                  <Package className={`h-4 w-4 ${i.quantity <= i.minStock ? 'text-red-500' : 'text-blue-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900">{i.name}</p>
                    {i.quantity <= i.minStock && <Badge className="bg-red-50 text-red-600 text-[9px]">Low Stock</Badge>}
                  </div>
                  <p className="text-[10px] text-gray-400">{i.category || 'General'} • R{i.cost} each</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => updateQty(i.id, -1)} className="h-7 w-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">-</button>
                  <span className="font-bold text-sm text-gray-900 w-10 text-center">{i.quantity} <span className="text-[9px] text-gray-400">{i.unit}</span></span>
                  <button onClick={() => updateQty(i.id, 1)} className="h-7 w-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                </div>
                <button onClick={() => deleteItem(i.id)} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. Cement 50kg" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Category</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. Building Materials" /></div>
              <div><Label className="text-xs">Unit</Label>
                <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                  <option value="pcs">Pieces</option><option value="bags">Bags</option><option value="kg">Kilograms</option><option value="m">Meters</option><option value="m²">Square Meters</option><option value="litres">Litres</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Min Stock</Label><Input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Cost (R)</Label><Input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <Button onClick={addItem} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Item</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. BOQ CALCULATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function BOQCalculatorPipeline() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ description: '', quantity: '', unit: 'pcs', unitPrice: '' })

  const addItem = () => {
    if (!form.description || !form.unitPrice) return
    setItems([...items, { id: Date.now(), ...form, quantity: parseFloat(form.quantity) || 1, unitPrice: parseFloat(form.unitPrice) || 0 }])
    setForm({ description: '', quantity: '', unit: 'pcs', unitPrice: '' })
  }

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id))

  const total = items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0)
  const vat = total * 0.15
  const grandTotal = total + vat

  const exportCSV = () => {
    const csv = 'Description,Quantity,Unit,Unit Price,Total\n' + items.map(i => `"${i.description}",${i.quantity},${i.unit},${i.unitPrice},${i.quantity * i.unitPrice}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `boq-${new Date().toISOString().split('T')[0]}.csv`; a.click()
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Calculator} title="BOQ Calculator" desc="Bill of Quantities estimator" color="#7c3aed"
        action={<div className="flex gap-2">
          {items.length > 0 && <Button variant="outline" onClick={exportCSV} className="border-gray-200 text-gray-600 text-xs"><Download className="h-4 w-4 mr-1" /> Export CSV</Button>}
        </div>} />

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Add Item</h3>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5"><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-gray-50 border-gray-200 text-sm" placeholder="Description..." /></div>
            <div className="col-span-2"><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="bg-gray-50 border-gray-200 text-sm" placeholder="Qty" /></div>
            <div className="col-span-2">
              <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                <option value="pcs">pcs</option><option value="m">m</option><option value="m²">m²</option><option value="m³">m³</option><option value="kg">kg</option><option value="bags">bags</option><option value="hrs">hrs</option><option value="lot">lot</option>
              </select>
            </div>
            <div className="col-span-2"><Input type="number" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} className="bg-gray-50 border-gray-200 text-sm" placeholder="R price" /></div>
            <div className="col-span-1"><Button onClick={addItem} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433] h-10"><Plus className="h-4 w-4" /></Button></div>
          </div>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Description</th>
                  <th className="text-right px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Qty</th>
                  <th className="text-right px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Unit</th>
                  <th className="text-right px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Price</th>
                  <th className="text-right px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-2 w-8"></th>
                </tr></thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{i.description}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{i.quantity}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{i.unit}</td>
                      <td className="px-4 py-2 text-right text-gray-600">R{i.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900">R{(i.quantity * i.unitPrice).toLocaleString()}</td>
                      <td className="px-4 py-2"><button onClick={() => removeItem(i.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="bg-[#d4a843]/10 border-[#d4a843]/20 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-bold text-gray-900">R{total.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">VAT (15%)</span><span className="text-gray-700">R{vat.toLocaleString()}</span></div>
              <div className="flex justify-between text-lg border-t border-[#d4a843]/20 pt-2"><span className="font-bold text-gray-900">Grand Total</span><span className="font-extrabold text-[#b8941f]">R{grandTotal.toLocaleString()}</span></div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 14. AI ESTIMATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function AIEstimatorPipeline() {
  const [projectType, setProjectType] = useState('house-4')
  const [area, setArea] = useState('')
  const [location, setLocation] = useState('urban')
  const [quality, setQuality] = useState('standard')
  const [estimate, setEstimate] = useState<any>(null)

  const rates: Record<string, Record<string, Record<string, number>>> = {
    'house-3': { urban: { economy: 5500, standard: 7500, premium: 10000 }, rural: { economy: 4000, standard: 5500, premium: 8000 } },
    'house-4': { urban: { economy: 6000, standard: 8500, premium: 12000 }, rural: { economy: 4500, standard: 6500, premium: 9500 } },
    'house-5': { urban: { economy: 7000, standard: 10000, premium: 15000 }, rural: { economy: 5000, standard: 7500, premium: 11000 } },
    'renovation': { urban: { economy: 3000, standard: 5000, premium: 8000 }, rural: { economy: 2000, standard: 3500, premium: 6000 } },
    'roofing': { urban: { economy: 250, standard: 400, premium: 600 }, rural: { economy: 200, standard: 300, premium: 500 } },
    'paving': { urban: { economy: 180, standard: 280, premium: 450 }, rural: { economy: 150, standard: 220, premium: 350 } },
  }

  const calculate = () => {
    const areaNum = parseFloat(area) || 100
    const rate = rates[projectType]?.[location]?.[quality] || 7000
    const buildCost = areaNum * rate
    const contingency = buildCost * 0.1
    const professional = buildCost * 0.08
    const total = buildCost + contingency + professional

    setEstimate({
      buildCost, contingency, professional, total,
      perSqm: rate, area: areaNum,
      breakdown: [
        { label: 'Construction', amount: buildCost, pct: 65 },
        { label: 'Materials', amount: buildCost * 0.45, pct: 45 },
        { label: 'Labour', amount: buildCost * 0.35, pct: 35 },
        { label: 'Equipment', amount: buildCost * 0.12, pct: 12 },
        { label: 'Overheads', amount: buildCost * 0.08, pct: 8 },
      ]
    })
  }

  const typeLabels: Record<string, string> = { 'house-3': '3-Room House', 'house-4': '4-Room House', 'house-5': '5-Room House', renovation: 'Renovation', roofing: 'Roofing', paving: 'Paving' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Sparkles} title="AI Estimator" desc="Get instant project cost estimates" color="#d4a843" />

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Project Type</Label>
              <select value={projectType} onChange={e => setProjectType(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">{projectType === 'roofing' || projectType === 'paving' ? 'Area (m²)' : 'Floor Area (m²)'}</Label>
              <Input type="number" value={area} onChange={e => setArea(e.target.value)} className="bg-gray-50 border-gray-200" placeholder={projectType.startsWith('house') ? 'e.g. 120' : 'e.g. 50'} />
            </div>
            <div><Label className="text-xs">Location</Label>
              <select value={location} onChange={e => setLocation(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                <option value="urban">Urban / City</option><option value="rural">Rural / Township</option>
              </select>
            </div>
            <div><Label className="text-xs">Quality Level</Label>
              <select value={quality} onChange={e => setQuality(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                <option value="economy">Economy</option><option value="standard">Standard</option><option value="premium">Premium</option>
              </select>
            </div>
          </div>
          <Button onClick={calculate} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">
            <Sparkles className="h-4 w-4 mr-2" /> Generate Estimate
          </Button>
        </CardContent>
      </Card>

      {estimate && (
        <Card className="bg-white border-[#d4a843]/30 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Estimated Total</p>
              <p className="text-4xl font-extrabold text-[#b8941f]">R{estimate.total.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{typeLabels[projectType]} • {estimate.area}m² • R{estimate.perSqm.toLocaleString()}/m²</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                <p className="text-xs text-gray-400">Contingency</p>
                <p className="text-sm font-bold text-gray-900">R{estimate.contingency.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                <p className="text-xs text-gray-400">Professional Fees</p>
                <p className="text-sm font-bold text-gray-900">R{estimate.professional.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                <p className="text-xs text-gray-400">Construction</p>
                <p className="text-sm font-bold text-gray-900">R{estimate.buildCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">Cost Breakdown</p>
              {estimate.breakdown.map((b: any) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-24">{b.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d4a843] rounded-full" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">R{b.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 15. REPORTS — Aggregate analytics
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function ReportsPipeline() {
  const [projects, setProjects] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    fetchJson(`/api/projects?businessId=${BIZ_ID}`).then(setProjects)
    fetchJson(`/api/leads?businessId=${BIZ_ID}`).then(setLeads)
    fetchJson(`/api/invoices?businessId=${BIZ_ID}`).then(setInvoices)
    fetchJson(`/api/testimonials?businessId=${BIZ_ID}`).then(setReviews)
    fetchJson(`/api/services?businessId=${BIZ_ID}`).then(setServices)
  }, [])

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const outstanding = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0)
  const wonLeads = leads.filter(l => l.status === 'won' || l.stage === 'completed')
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1) : '0'

  const metrics = [
    { label: 'Total Revenue', value: `R${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#059669' },
    { label: 'Outstanding', value: `R${outstanding.toLocaleString()}`, icon: Clock, color: '#d97706' },
    { label: 'Projects', value: projects.length, icon: Hammer, color: '#2563eb' },
    { label: 'Leads Won', value: wonLeads.length, icon: Target, color: '#7c3aed' },
    { label: 'Conversion', value: leads.length ? `${Math.round(wonLeads.length / leads.length * 100)}%` : '0%', icon: TrendingUp, color: '#d4a843' },
    { label: 'Avg Rating', value: `${avgRating}⭐`, icon: Star, color: '#d4a843' },
    { label: 'Services', value: services.length, icon: Wrench, color: '#059669' },
    { label: 'Invoices', value: invoices.length, icon: FileText, color: '#2563eb' },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader icon={BarChart3} title="Reports" desc="Business performance overview" color="#059669" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(m => <StatCard key={m.label} {...m} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">📋 Pipeline Summary</h3>
            {['new', 'contacted', 'quoted', 'won', 'lost'].map(stage => {
              const count = leads.filter(l => l.stage === stage || l.status === stage).length
              const pct = leads.length ? (count / leads.length * 100) : 0
              return (
                <div key={stage} className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-600 capitalize w-20">{stage}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d4a843] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">💰 Revenue by Invoice Status</h3>
            {['draft', 'sent', 'paid', 'overdue'].map(status => {
              const total = invoices.filter(i => i.status === status).reduce((s, i) => s + i.total, 0)
              const colors: Record<string, string> = { draft: '#6b7280', sent: '#2563eb', paid: '#059669', overdue: '#dc2626' }
              return (
                <div key={status} className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: colors[status] }} />
                  <span className="text-xs text-gray-600 capitalize w-16">{status}</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto">R{total.toLocaleString()}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16-19. INTELLIGENCE PAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function BusinessIntelPipeline() {
  const [leads, setLeads] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetchJson(`/api/leads?businessId=${BIZ_ID}`).then(setLeads)
    fetchJson(`/api/invoices?businessId=${BIZ_ID}`).then(setInvoices)
    fetchJson(`/api/projects?businessId=${BIZ_ID}`).then(setProjects)
  }, [])

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const pipelineValue = leads.filter(l => l.stage !== 'lost' && l.status !== 'lost').reduce((s, l) => s + (l.estimatedValue || 0), 0)
  const wonLeads = leads.filter(l => l.status === 'won' || l.stage === 'completed')
  const conversionRate = leads.length ? (wonLeads.length / leads.length * 100).toFixed(1) : '0'

  const insights = [
    { title: 'Revenue Health', value: totalRevenue > 0 ? 'Active' : 'No Revenue', desc: `R${totalRevenue.toLocaleString()} collected`, color: totalRevenue > 0 ? '#059669' : '#dc2626', icon: DollarSign },
    { title: 'Pipeline Strength', value: `${leads.length} leads`, desc: `R${pipelineValue.toLocaleString()} potential`, color: '#2563eb', icon: TrendingUp },
    { title: 'Win Rate', value: `${conversionRate}%`, desc: `${wonLeads.length} of ${leads.length} leads`, color: '#d4a843', icon: Target },
    { title: 'Project Portfolio', value: `${projects.length} projects`, desc: 'Active construction', color: '#7c3aed', icon: Hammer },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader icon={TrendingUp} title="Business Intelligence" desc="Revenue trends, growth metrics, and forecasts" color="#2563eb" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map(i => (
          <Card key={i.title} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${i.color}12` }}>
                  <i.icon className="h-5 w-5" style={{ color: i.color }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{i.value}</p>
                  <p className="text-[10px] text-gray-400">{i.desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">📈 Monthly Overview</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-xl font-bold text-gray-900">{invoices.length}</p><p className="text-[10px] text-gray-400">Invoices</p></div>
            <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-xl font-bold text-emerald-600">{invoices.filter(i => i.status === 'paid').length}</p><p className="text-[10px] text-gray-400">Paid</p></div>
            <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-xl font-bold text-amber-600">{invoices.filter(i => i.status !== 'paid').length}</p><p className="text-[10px] text-gray-400">Pending</p></div>
            <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-xl font-bold text-red-600">{invoices.filter(i => i.status === 'overdue').length}</p><p className="text-[10px] text-gray-400">Overdue</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CustomerIntelPipeline() {
  const [leads, setLeads] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    fetchJson(`/api/leads?businessId=${BIZ_ID}`).then(setLeads)
    fetchJson(`/api/testimonials?businessId=${BIZ_ID}`).then(setReviews)
    fetchJson(`/api/invoices?businessId=${BIZ_ID}`).then(setInvoices)
  }, [])

  const sourceCount: Record<string, number> = {}
  leads.forEach(l => { sourceCount[l.source || 'unknown'] = (sourceCount[l.source || 'unknown'] || 0) + 1 })
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      <SectionHeader icon={UserSearch} title="Customer Intelligence" desc="Client insights, satisfaction, and retention" color="#7c3aed" />
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Users} label="Total Leads" value={leads.length} color="#7c3aed" />
        <StatCard icon={Star} label="Avg Rating" value={`${avgRating}⭐`} color="#d4a843" />
        <StatCard icon={DollarSign} label="Avg Invoice" value={invoices.length ? `R${Math.round(invoices.reduce((s, i) => s + i.total, 0) / invoices.length).toLocaleString()}` : 'R0'} color="#059669" />
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">📊 Lead Sources</h3>
          {Object.entries(sourceCount).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
            <div key={source} className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-600 capitalize w-24">{source}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(count / leads.length * 100)}%` }} />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
            </div>
          ))}
          {Object.keys(sourceCount).length === 0 && <p className="text-xs text-gray-400">No lead data yet</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export function OpportunityIntelPipeline() {
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => { fetchJson(`/api/leads?businessId=${BIZ_ID}`).then(setLeads) }, [])

  const stages = ['discovery', 'engagement', 'qualification', 'proposal', 'negotiation', 'won', 'lost']
  const stageColors: Record<string, string> = { discovery: '#6b7280', engagement: '#2563eb', qualification: '#d97706', proposal: '#7c3aed', negotiation: '#d4a843', won: '#059669', lost: '#dc2626' }
  const totalValue = leads.reduce((s, l) => s + (l.estimatedValue || 0), 0)

  return (
    <div className="space-y-6">
      <SectionHeader icon={Target} title="Opportunity Intel" desc="Pipeline analysis, conversion rates, win/loss" color="#d97706" />
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Target} label="Pipeline Value" value={`R${totalValue.toLocaleString()}`} color="#d97706" />
        <StatCard icon={TrendingUp} label="Active Deals" value={leads.filter(l => l.status !== 'won' && l.status !== 'lost' && l.stage !== 'won' && l.stage !== 'lost').length} color="#2563eb" />
        <StatCard icon={CheckCircle2} label="Won" value={leads.filter(l => l.status === 'won' || l.stage === 'won' || l.stage === 'completed').length} color="#059669" />
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">🎯 Pipeline by Stage</h3>
          {stages.map(s => {
            const count = leads.filter(l => l.stage === s || l.status === s).length
            const value = leads.filter(l => l.stage === s || l.status === s).reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
            return (
              <div key={s} className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 rounded" style={{ backgroundColor: stageColors[s] }} />
                <span className="text-xs text-gray-600 capitalize w-24">{s}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${leads.length ? (count / leads.length * 100) : 0}%`, backgroundColor: stageColors[s] }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                {value > 0 && <span className="text-[10px] text-gray-400 w-20 text-right">R{value.toLocaleString()}</span>}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

export function ExecutionIntelPipeline() {
  const [projects, setProjects] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    fetchJson(`/api/projects?businessId=${BIZ_ID}`).then(setProjects)
    fetchJson(`/api/leads?businessId=${BIZ_ID}`).then(setLeads)
  }, [])

  const completed = projects.filter(p => p.completedAt)
  const inProgress = projects.filter(p => !p.completedAt)

  return (
    <div className="space-y-6">
      <SectionHeader icon={Zap} title="Execution Intel" desc="Project timelines, delays, and performance" color="#dc2626" />
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Hammer} label="In Progress" value={inProgress.length} color="#d97706" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed.length} color="#059669" />
        <StatCard icon={Zap} label="Total Leads" value={leads.length} color="#dc2626" />
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">🏗️ Project Status</h3>
          {projects.length === 0 ? <p className="text-xs text-gray-400">No projects to analyze</p> : projects.map(p => (
            <div key={p.id} className="flex items-center gap-3 mb-2 p-2 rounded-lg bg-gray-50">
              <div className={`h-3 w-3 rounded-full ${p.completedAt ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span className="text-sm text-gray-700 flex-1">{p.title}</span>
              <Badge variant="outline" className={`text-[9px] ${p.completedAt ? 'border-emerald-300 text-emerald-600' : 'border-amber-300 text-amber-600'}`}>
                {p.completedAt ? 'Done' : 'Active'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 20. OMNIROUTE GATEWAY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function OmniRoutePipeline() {
  const [automations, setAutomations] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    fetchJson(`/api/businesses/${BIZ_ID}/automations`).then(setAutomations)
  }, [])

  const channels = [
    { name: 'WhatsApp Business', status: 'active', icon: MessageCircle, color: '#25d366', messages: 156 },
    { name: 'Google Business', status: 'active', icon: Globe, color: '#4285f4', messages: 42 },
    { name: 'Facebook Messenger', status: 'configured', icon: MessageCircle, color: '#1877f2', messages: 28 },
    { name: 'Instagram DMs', status: 'configured', icon: MessageCircle, color: '#e4405f', messages: 15 },
    { name: 'Email (SMTP)', status: 'active', icon: Mail, color: '#d97706', messages: 89 },
    { name: 'SMS Gateway', status: 'pending', icon: Send, color: '#7c3aed', messages: 0 },
  ]

  const statusColor: Record<string, string> = { active: '#059669', configured: '#2563eb', pending: '#d97706', inactive: '#dc2626' }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Network} title="OmniRoute Gateway" desc="Communication routing and channel management" color="#7c3aed" />

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Network} label="Channels" value={channels.filter(c => c.status === 'active').length} color="#7c3aed" />
        <StatCard icon={Send} label="Total Messages" value={channels.reduce((s, c) => s + c.messages, 0).toLocaleString()} color="#2563eb" />
        <StatCard icon={Zap} label="Automations" value={automations.length} color="#d97706" />
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">📡 Communication Channels</h3>
          <div className="space-y-2">
            {channels.map(ch => (
              <div key={ch.name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ch.color}12` }}>
                  <ch.icon className="h-4 w-4" style={{ color: ch.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{ch.name}</p>
                  <p className="text-[10px] text-gray-400">{ch.messages} messages this month</p>
                </div>
                <Badge variant="outline" className="text-[9px] capitalize" style={{ borderColor: statusColor[ch.status], color: statusColor[ch.status] }}>{ch.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 21. SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function SettingsPipeline() {
  const [modules, setModules] = useState<any[]>([])

  useEffect(() => { fetchJson(`/api/businesses/${BIZ_ID}/modules`).then(setModules) }, [])

  const settingSections = [
    { title: 'Business Profile', icon: Building, color: '#059669', items: ['Company Name', 'Phone', 'Email', 'Address', 'Logo', 'Tagline'] },
    { title: 'Notifications', icon: Bell, color: '#d97706', items: ['Email Alerts', 'SMS Alerts', 'WhatsApp Alerts', 'New Lead Alert', 'Payment Alert'] },
    { title: 'Security', icon: Shield, color: '#dc2626', items: ['Password', 'Two-Factor Auth', 'Session Management', 'API Keys'] },
    { title: 'Integrations', icon: Globe, color: '#2563eb', items: ['Google Business', 'WhatsApp Business', 'Facebook', 'Instagram', 'Email SMTP'] },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader icon={Settings} title="Settings" desc="System preferences and account configuration" color="#6b7280" />

      <div className="grid sm:grid-cols-2 gap-4">
        {settingSections.map(s => (
          <Card key={s.title} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <s.icon className="h-5 w-5" style={{ color: s.color }} />
                <h3 className="font-bold text-sm text-gray-900">{s.title}</h3>
              </div>
              <div className="space-y-2">
                {s.items.map(item => (
                  <div key={item} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-700">{item}</span>
                    <div className="h-5 w-9 rounded-full bg-gray-200 flex items-center p-0.5 cursor-pointer">
                      <div className="h-4 w-4 rounded-full bg-white shadow" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

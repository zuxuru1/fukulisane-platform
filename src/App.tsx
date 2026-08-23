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
  LayoutDashboard, Hammer, Wrench, MessageCircle, FileText, Megaphone,
  Globe, FolderOpen, Eye, Star, Plus, Menu, X, Phone, Mail, MapPin,
  ExternalLink, Send, Copy, Building, CheckCircle2, Circle, ChevronRight,
  ChevronLeft, Link2, Palette, Calendar, BarChart3, ArrowUpRight, Sparkles,
  CheckSquare, Home, BookOpen, Image, Users, UserCog, ClipboardCheck,
  CalendarOff, ShoppingCart, Truck, Package, Calculator, DollarSign,
  TrendingUp, UserSearch, Target, Zap, Network, Settings, AlertTriangle
} from 'lucide-react'
import FukulisaneWebsite from '@/components/FukulisaneWebsite'
import MarketingEcosystem from '@/components/MarketingEcosystem'
import DigitalEcosystem from '@/components/DigitalEcosystem'
import PlatformWizard from '@/components/PlatformWizard'
import SalesPointSystem from '@/components/SalesPointSystem'
import MarketplaceIntelligence from '@/components/MarketplaceIntelligence'
import AdminPanel from '@/components/AdminPanel'
import Connections from '@/components/Connections'
import {
  TasksPipeline, HousePlansPipeline, SiteDiaryPipeline, PhotoGalleryPipeline,
  ClientsPipeline, EmployeesPipeline, AttendancePipeline, LeaveManagementPipeline,
  PurchaseOrdersPipeline, SuppliersPipeline, EquipmentPipeline, InventoryPipeline,
  BOQCalculatorPipeline, AIEstimatorPipeline, ReportsPipeline,
  BusinessIntelPipeline, CustomerIntelPipeline, OpportunityIntelPipeline, ExecutionIntelPipeline,
  OmniRoutePipeline, SettingsPipeline
} from '@/components/PipelineEngines'
import ConstructionSidebar, { type Page } from '@/components/ConstructionSidebar'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'
const BIZ_SLUG = 'fukulisane-construction'

type WizardEngineData = {
  id: string; stepNumber: number; stepSlug: string; title: string
  status: string; config: string | null; output: string | null; lastRunAt: string | null
}

export default function App() {
  const urlParams = new URLSearchParams(window.location.search)
  const storeSlug = urlParams.get('store')
  const adminPage = urlParams.get('page') as Page | null
  const isAdmin = adminPage !== null

  if (storeSlug === BIZ_SLUG || !isAdmin) {
    return <FukulisaneWebsite />
  }

  const [page, setPage] = useState<Page>(adminPage || 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {toast && (
        <div className={`fixed top-4 right-4 z-[70] px-5 py-3 rounded-lg shadow-lg text-white text-sm font-semibold ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>{toast.msg}</div>
      )}

      <ConstructionSidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 min-h-screen overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-8">
          {page === 'dashboard' && <DashboardPage showToast={showToast} setPage={setPage} />}
          {page === 'wizard' && <PlatformWizard />}
          {page === 'projects' && <ProjectsPage showToast={showToast} />}
          {page === 'tasks' && <TasksPipeline />}
          {page === 'house-plans' && <HousePlansPipeline />}
          {page === 'site-diary' && <SiteDiaryPipeline />}
          {page === 'photo-gallery' && <PhotoGalleryPipeline />}
          {page === 'clients' && <ClientsPipeline />}
          {page === 'leads-marketing' && <MarketingPage />}
          {page === 'employees' && <EmployeesPipeline />}
          {page === 'attendance' && <AttendancePipeline />}
          {page === 'leave-management' && <LeaveManagementPipeline />}
          {page === 'purchase-orders' && <PurchaseOrdersPipeline />}
          {page === 'suppliers' && <SuppliersPipeline />}
          {page === 'equipment' && <EquipmentPipeline />}
          {page === 'inventory' && <InventoryPipeline />}
          {page === 'boq-calculator' && <BOQCalculatorPipeline />}
          {page === 'ai-estimator' && <AIEstimatorPipeline />}
          {page === 'reports' && <ReportsPipeline />}
          {page === 'finance' && <InvoicesPage showToast={showToast} />}
          {page === 'business-intel' && <BusinessIntelPipeline />}
          {page === 'customer-intel' && <CustomerIntelPipeline />}
          {page === 'opportunity-intel' && <OpportunityIntelPipeline />}
          {page === 'execution-intel' && <ExecutionIntelPipeline />}
          {page === 'website-builder' && <DigitalSetupPage />}
          {page === 'connections' && <Connections />}
          {page === 'omniroute' && <OmniRoutePipeline />}
          {page === 'settings' && <SettingsPipeline />}
          {page === 'services' && <ServicesPage showToast={showToast} />}
          {page === 'quotes' && <QuotesPage showToast={showToast} />}
          {page === 'invoices' && <InvoicesPage showToast={showToast} />}
          {page === 'reviews' && <ReviewsPage showToast={showToast} />}
          {page === 'marketing' && <MarketingPage />}
          {page === 'posts' && <PostsPage showToast={showToast} />}
          {page === 'digital' && <DigitalSetupPage />}
          {page === 'ecosystem' && <DigitalEcosystem />}
          {page === 'sps' && <SalesPointSystem />}
          {page === 'marketplace' && <MarketplaceIntelligence />}
        </div>
      </main>
    </div>
  )
}

// ━━━━━ PLACEHOLDER PAGE ━━━━━
function PlaceholderPage({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${color}15` }}>
            <Icon className="h-8 w-8" style={{ color }} />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">{desc}</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Coming soon — full module under development</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ━━━━━ SETUP WIZARD — ENGINE POWERED ━━━━━
function SetupWizardPage({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [engines, setEngines] = useState<WizardEngineData[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [running, setRunning] = useState<number | null>(null)
  const [output, setOutput] = useState<any>(null)
  const [progress, setProgress] = useState({ done: 0, total: 14, pct: 0 })

  const STEPS_META = [
    { icon: '🎨', desc: 'Set up your brand identity to use across ALL platforms.', link: null, linkLabel: null },
    { icon: '📍', desc: 'Create or claim your Google listing so customers find you on Search and Maps.', link: 'https://business.google.com/', linkLabel: 'Open Google Business' },
    { icon: '🌐', desc: 'Create a website where customers can see your work and contact you.', link: 'https://wordpress.com/', linkLabel: 'Open WordPress' },
    { icon: '📘', desc: 'Create your Facebook business page for social media presence.', link: 'https://www.facebook.com/pages/create/', linkLabel: 'Create Facebook Page' },
    { icon: '📸', desc: 'Create a professional Instagram account to showcase your work.', link: 'https://www.instagram.com/', linkLabel: 'Open Instagram' },
    { icon: '🎵', desc: 'Create TikTok account to reach younger customers with construction videos.', link: 'https://www.tiktok.com/business/', linkLabel: 'Open TikTok Business' },
    { icon: '🎬', desc: 'Create YouTube channel to upload project videos and tutorials.', link: 'https://www.youtube.com/create_channel', linkLabel: 'Create YouTube Channel' },
    { icon: '💼', desc: 'Create a LinkedIn company page for professional networking.', link: 'https://www.linkedin.com/company/setup/new/', linkLabel: 'Create LinkedIn Page' },
    { icon: '💬', desc: 'Set up WhatsApp Business with your catalog and auto-replies.', link: 'https://www.whatsapp.com/business/', linkLabel: 'Download WhatsApp Business' },
    { icon: '📌', desc: 'Create Pinterest account to share construction inspiration images.', link: 'https://business.pinterest.com/', linkLabel: 'Open Pinterest Business' },
    { icon: '🔗', desc: 'Create a single landing page with ALL your platform links in one place.', link: 'https://www.canva.com/', linkLabel: 'Design with Canva' },
    { icon: '📋', desc: 'Follow these rules to keep your brand consistent everywhere.', link: 'https://www.canva.com/', linkLabel: 'Create on Canva' },
    { icon: '📅', desc: 'Follow this weekly posting schedule across all platforms.', link: null, linkLabel: null },
    { icon: '📊', desc: 'Track these numbers every month to measure your growth.', link: null, linkLabel: null },
  ]

  useEffect(() => {
    fetchEngines()
  }, [])

  const fetchEngines = async () => {
    const res = await fetch(`/api/wizard/engines/${BIZ_ID}`)
    const data = await res.json()
    setEngines(data.engines)
    setProgress(data.progress)
  }

  const runEngine = async (stepNumber: number) => {
    setRunning(stepNumber)
    setOutput(null)
    try {
      const res = await fetch(`/api/wizard/engines/${BIZ_ID}/run/${stepNumber}`, { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setOutput(data.output)
        showToast(`Engine ${stepNumber} completed`)
        await fetchEngines()
      }
    } catch {
      showToast('Engine failed', 'error')
    }
    setRunning(null)
  }

  const markComplete = async (stepNumber: number) => {
    await fetch(`/api/wizard/engines/${BIZ_ID}/step/${stepNumber}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'complete' }),
    })
    showToast('Marked complete')
    await fetchEngines()
  }

  const engine = engines[activeStep]
  const meta = STEPS_META[activeStep]
  const engineOutput = engine?.output ? JSON.parse(engine.output) : null

  const renderOutput = (slug: string, out: any) => {
    if (!out) return <p className="text-xs text-gray-400 italic">Run the engine to see results</p>

    if (slug === 'brand-standards' || slug === 'branding-rules') {
      return (
        <div className="space-y-2">
          {[
            { label: 'Brand Name', value: out.brandName, ok: !!out.brandName },
            { label: 'Tagline', value: out.tagline, ok: !!out.tagline },
            { label: 'Primary Color', value: out.primaryColor, ok: !!out.primaryColor, color: out.primaryColor },
            { label: 'Phone', value: out.phone, ok: !!out.phone },
            { label: 'Email', value: out.email, ok: !!out.email },
            { label: 'Address', value: out.address, ok: !!out.address },
            { label: 'Logo', value: out.hasLogo ? '✅ Uploaded' : '❌ Missing', ok: out.hasLogo },
            { label: 'Brand Story', value: out.hasStory ? '✅ Written' : '❌ Missing', ok: out.hasStory },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <div className={`h-2 w-2 rounded-full shrink-0 ${item.ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
              <span className="text-xs text-gray-500 w-24 shrink-0">{item.label}</span>
              <span className="text-xs text-gray-700 font-medium flex-1">
                {item.color ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border" style={{ backgroundColor: item.color }} /> {item.value}
                  </span>
                ) : item.value}
              </span>
            </div>
          ))}
          <div className="p-2 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/20 text-center">
            <p className="text-sm font-bold text-[#b8941f]">Brand Score: {out.score}/8</p>
          </div>
        </div>
      )
    }

    if (['google-business','facebook','instagram','tiktok','youtube','linkedin','whatsapp','pinterest'].includes(slug)) {
      return (
        <div className="space-y-2">
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${out.isConnected ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`h-3 w-3 rounded-full ${out.isConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            <span className="text-sm font-bold text-gray-900">{out.isConnected ? '✅ Connected' : '⚠️ Not Connected Yet'}</span>
          </div>
          {out.profileUrl && (
            <a href={out.profileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs text-blue-600 hover:underline">
              <ExternalLink className="h-3 w-3" /> {out.profileUrl}
            </a>
          )}
          {!out.isConnected && (
            <p className="text-xs text-gray-500">Click the link above to set up this platform, then run the engine again.</p>
          )}
        </div>
      )
    }

    if (slug === 'website') {
      return (
        <div className="space-y-2">
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${out.storeUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`h-3 w-3 rounded-full ${out.storeUrl ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            <span className="text-sm font-bold text-gray-900">{out.storeUrl ? '✅ Website Live' : '⚠️ Not Live Yet'}</span>
          </div>
          {out.storeUrl && (
            <a href={out.storeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs text-blue-600 hover:underline">
              <Eye className="h-3 w-3" /> View Website: {out.storeUrl}
            </a>
          )}
          <div className="text-xs text-gray-500">Status: {out.storeStatus || 'draft'} | Description: {out.hasDescription ? '✅' : '❌'}</div>
        </div>
      )
    }

    if (slug === 'link-hub') {
      return (
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-sm font-bold text-gray-900">{out.totalLinks} platforms linked</p>
          </div>
          {out.links?.map((l: any) => (
            <div key={l.platform} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-xs text-gray-700 capitalize">{l.platform}</span>
              <span className="text-[10px] text-gray-400 truncate flex-1">{l.url}</span>
            </div>
          ))}
          {out.totalLinks === 0 && <p className="text-xs text-gray-500">No platforms connected yet. Complete steps 2-10 first.</p>}
        </div>
      )
    }

    if (slug === 'weekly-content') {
      return (
        <div className="space-y-2">
          <div className="flex gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-center flex-1">
              <p className="text-lg font-bold text-gray-900">{out.totalPosts}</p>
              <p className="text-[10px] text-gray-400">Total Posts</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-center flex-1">
              <p className="text-lg font-bold text-emerald-600">{out.published}</p>
              <p className="text-[10px] text-gray-400">Published</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-center flex-1">
              <p className="text-lg font-bold text-amber-600">{out.draft}</p>
              <p className="text-[10px] text-gray-400">Drafts</p>
            </div>
          </div>
          {out.schedule?.map((s: any) => (
            <div key={s.day} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-xs font-bold text-gray-700 w-20">{s.day}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#d4a843] rounded-full" style={{ width: `${Math.min(s.posts * 33, 100)}%` }} />
              </div>
              <span className="text-[10px] text-gray-400">{s.posts} posts</span>
            </div>
          ))}
        </div>
      )
    }

    if (slug === 'monthly-review') {
      return (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-2">Period: {out.period}</p>
          {out.kpis?.map((kpi: any) => (
            <div key={kpi.name} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-xs text-gray-700 w-36 shrink-0 font-medium">{kpi.name}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${kpi.pct >= 100 ? 'bg-emerald-500' : kpi.pct >= 50 ? 'bg-[#d4a843]' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(kpi.pct, 100)}%` }} />
              </div>
              <span className="text-[10px] text-gray-500 w-16 text-right">{kpi.actual}/{kpi.target} {kpi.unit}</span>
              <span className={`text-[10px] font-bold w-10 text-right ${kpi.pct >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{kpi.pct}%</span>
            </div>
          ))}
          {out.counts && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {Object.entries(out.counts).map(([k, v]) => (
                <div key={k} className="text-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-lg font-bold text-gray-900">{v as number}</p>
                  <p className="text-[9px] text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg overflow-auto max-h-60">{JSON.stringify(out, null, 2)}</pre>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">🔧 Setup Wizard</h1>
        <p className="text-gray-500 text-sm mt-1">14 engines — each one processes your real business data</p>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">{progress.done} of {progress.total} engines complete</p>
            <p className="text-sm font-bold text-[#b8941f]">{progress.pct}%</p>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#d4a843] to-[#b8941f] rounded-full transition-all duration-500" style={{ width: `${progress.pct}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {engines.map((eng, i) => {
          const meta = STEPS_META[i]
          if (!meta) return null
          return (
            <button key={eng.id} onClick={() => { setActiveStep(i); setOutput(null) }}
              className={`p-2.5 rounded-xl text-center transition border ${
                activeStep === i
                  ? 'bg-[#d4a843]/10 border-[#d4a843] shadow-sm'
                  : 'bg-white border-gray-200 hover:border-[#d4a843]/40'
              }`}>
              <p className="text-xl mb-1">{meta.icon}</p>
              <p className="text-[10px] font-bold text-gray-700 leading-tight">Step {i + 1}</p>
              <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{eng.title}</p>
              {eng.status === 'complete' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto mt-1" />
              ) : eng.status === 'in_progress' ? (
                <div className="h-4 w-4 rounded-full border-2 border-amber-400 mx-auto mt-1" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300 mx-auto mt-1" />
              )}
            </button>
          )
        })}
      </div>

      {engine && meta && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{meta.icon}</span>
                  <h2 className="text-lg font-extrabold text-gray-900">Step {activeStep + 1}: {engine.title}</h2>
                  <Badge variant="outline" className={`text-[9px] ${
                    engine.status === 'complete' ? 'border-emerald-300 text-emerald-600' :
                    engine.status === 'in_progress' ? 'border-amber-300 text-amber-600' :
                    'border-gray-200 text-gray-400'
                  }`}>{engine.status}</Badge>
                </div>
                <p className="text-sm text-gray-500">{meta.desc}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                {meta.link && (
                  <a href={meta.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition">
                    {meta.linkLabel || 'Open'} <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
                <Button
                  onClick={() => runEngine(activeStep + 1)}
                  disabled={running === activeStep + 1}
                  className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-xs"
                >
                  {running === activeStep + 1 ? (
                    <><div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" /> Running...</>
                  ) : (
                    '▶ Run Engine'
                  )}
                </Button>
                {engine.status !== 'complete' && (
                  <Button variant="outline" onClick={() => markComplete(activeStep + 1)}
                    className="text-xs border-gray-200 text-gray-600">
                    ✓ Mark Done
                  </Button>
                )}
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Engine Output</h3>
              {renderOutput(engine.stepSlug, output || engineOutput)}
            </div>

            {engine.lastRunAt && (
              <p className="text-[10px] text-gray-400 mt-3">Last run: {new Date(engine.lastRunAt).toLocaleString()}</p>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" disabled={activeStep === 0} onClick={() => { setActiveStep(activeStep - 1); setOutput(null) }}
                className="border-gray-200 text-gray-600 text-xs">
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button disabled={activeStep === engines.length - 1} onClick={() => { setActiveStep(activeStep + 1); setOutput(null) }}
                className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-xs">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ━━━━━ DASHBOARD ━━━━━
function DashboardPage({ showToast, setPage }: { showToast: (m: string, t?: 'success' | 'error') => void; setPage: (p: Page) => void }) {
  const [projects, setProjects] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/projects?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
    fetch(`/api/services?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
    fetch(`/api/testimonials?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setReviews(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
    fetch(`/api/quote-requests?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setQuotes(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
  }, [])

  const kpis = [
    { label: 'Projects', value: projects.length, icon: Hammer, color: '#059669', bg: '#ecfdf5' },
    { label: 'Services', value: services.length, icon: Wrench, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Reviews', value: reviews.length, icon: Star, color: '#d4a843', bg: '#fefce8' },
    { label: 'Quotes', value: quotes.length, icon: MessageCircle, color: '#d97706', bg: '#fffbeb' },
  ]

  const constructionTips = [
    { day: 'Mon', emoji: '🧱', type: 'Brickwork Tip', content: 'Use a string line for straight courses — saves time on plastering later', platform: 'Facebook, Instagram' },
    { day: 'Tue', emoji: '📸', type: 'Before & After', content: 'Share a completed renovation transformation with client permission', platform: 'Instagram, TikTok' },
    { day: 'Wed', emoji: '⭐', type: 'Client Review', content: 'Post a 5-star Google review screenshot with project photo', platform: 'Facebook, Google, Instagram' },
    { day: 'Thu', emoji: '🏗️', type: 'Site Progress', content: 'Time-lapse or progress photos of active builds — show the journey', platform: 'Instagram Stories, TikTok' },
    { day: 'Fri', emoji: '🏠', type: 'Completed Project', content: 'Showcase a finished house with proud homeowner — the money shot', platform: 'All platforms' },
    { day: 'Sat', emoji: '👷', type: 'Team Feature', content: 'Highlight a skilled tradesperson — bricklayer, plumber, or electrician', platform: 'Facebook, Instagram, LinkedIn' },
    { day: 'Sun', emoji: '✨', type: 'Design Inspiration', content: 'Share trending house designs in KZN — modern township homes', platform: 'Pinterest, Instagram' },
  ]

  const photoIdeas = [
    { title: 'Foundation Pour', desc: 'Concrete pouring day — action shot with team', best: 'Instagram Reels, TikTok' },
    { title: 'Roof Installation', desc: 'Completed roof structure from above — drone or elevated angle', best: 'Facebook, Instagram' },
    { title: 'Kitchen Renovation', desc: 'Before/after of a modern kitchen makeover', best: 'Pinterest, Instagram, Google' },
    { title: 'Boundary Wall Build', desc: 'Security wall going up — shows capability and quality', best: 'Facebook, Google Business' },
    { title: 'Paving Project', desc: 'New driveway transformation — clean lines, professional finish', best: 'Instagram, Pinterest' },
    { title: 'House Extension', desc: 'Seamless integration of new rooms with existing structure', best: 'All platforms' },
  ]

  const constructionInspiration = [
    { title: 'Modern Township Home', desc: '4-room face brick with flat roof — trending in KZN townships', tags: ['#ModernHome', '#FaceBrick', '#KwaZuluNatal'] },
    { title: 'Renovated Kitchen', desc: 'Granite countertops, new cupboards, recessed lighting — before/after series', tags: ['#KitchenReno', '#ModernKitchen', '#HomeDesign'] },
    { title: 'Boundary Wall + Gate', desc: 'Brick wall with automated gate — security meets style', tags: ['#BoundaryWall', '#Security', '#HomeSecurity'] },
    { title: 'Paved Driveway', desc: 'Brick paving with drainage — functional and beautiful', tags: ['#Paving', '#Driveway', '#OutdoorDesign'] },
    { title: 'Second Storey Extension', desc: 'Adding space upward — the smart way to expand', tags: ['#HouseExtension', '#SecondStorey', '#BuildUp'] },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Fukulisane Construction — Business Control Center</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: k.bg }}>
                  <k.icon className="h-5 w-5" style={{ color: k.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{k.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm text-gray-900 mb-3">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Setup Wizard', icon: CheckCircle2, color: '#d4a843', action: () => setPage('wizard') },
              { label: 'View Projects', icon: Hammer, color: '#059669', action: () => setPage('projects') },
              { label: 'Leads & Quotes', icon: Send, color: '#d97706', action: () => setPage('quotes') },
              { label: 'Google Business', icon: ExternalLink, color: '#2563eb', action: () => window.open('https://business.google.com/', '_blank') },
            ].map(a => (
              <button key={a.label} onClick={a.action}
                className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-sm font-medium text-gray-700 border border-gray-100">
                <a.icon className="h-4 w-4" style={{ color: a.color }} />
                {a.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Construction Content Calendar */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm text-gray-900 mb-3">📅 Weekly Construction Content Plan</h3>
          <div className="space-y-2">
            {constructionTips.map(d => (
              <div key={d.day} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-center shrink-0 w-12">
                  <p className="text-xl">{d.emoji}</p>
                  <p className="text-[10px] font-bold text-gray-700">{d.day}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">{d.type}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{d.content}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] text-gray-400">{d.platform}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Ideas for Social Media */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm text-gray-900 mb-3">📸 Construction Photo Ideas</h3>
          <p className="text-[10px] text-gray-400 mb-3">What to photograph this week for maximum social media impact</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {photoIdeas.map(p => (
              <div key={p.title} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="h-20 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center mb-2">
                  <Image className="h-8 w-8 text-amber-300" />
                </div>
                <p className="text-xs font-bold text-gray-900">{p.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{p.desc}</p>
                <p className="text-[9px] text-[#b8941f] mt-1 font-medium">Best for: {p.best}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Construction Inspiration Gallery */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm text-gray-900 mb-3">✨ Construction Inspiration</h3>
          <p className="text-[10px] text-gray-400 mb-3">Trending designs and ideas to inspire your content</p>
          <div className="space-y-2">
            {constructionInspiration.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Home className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                  <div className="flex gap-1 mt-1">
                    {item.tags.map(t => <Badge key={t} variant="outline" className="text-[8px] border-gray-200 text-gray-400">{t}</Badge>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Details */}
      <Card className="bg-white border-[#d4a843]/20 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-3 text-[#b8941f]">🏢 Brand Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600"><Building className="h-4 w-4 text-gray-400" /> Fukulisane Construction (Pty) Ltd</div>
            <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4 text-gray-400" /> 081 774 6577</div>
            <div className="flex items-center gap-2 text-gray-600"><Mail className="h-4 w-4 text-gray-400" /> donegendwear@gmail.com</div>
            <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4 text-gray-400" /> C260 Mbomu Road, Ezimbokodweni, 4126</div>
            <div className="flex items-center gap-2 text-gray-600"><Star className="h-4 w-4 text-gray-400" /> @FukulisaneConstruction</div>
            <div className="flex items-center gap-2 text-gray-600"><MessageCircle className="h-4 w-4 text-gray-400" /> WhatsApp: 081 774 6577</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ━━━━━ PROJECTS ━━━━━
function ProjectsPage({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [projects, setProjects] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', imageUrl: '' })

  useEffect(() => {
    fetch(`/api/projects?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
  }, [])

  const addProject = async () => {
    if (!form.title) return
    const res = await fetch('/api/projects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: BIZ_ID, ...form }),
    })
    const created = await res.json()
    setProjects([created.data ?? created, ...projects])
    setForm({ title: '', description: '', category: '', location: '', imageUrl: '' })
    setOpen(false)
    showToast('Project added')
  }

  const deleteProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setProjects(projects.filter(p => p.id !== id))
    showToast('Project removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🏗️ Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} projects in portfolio</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433] shadow-sm">
          <Plus className="h-4 w-4 mr-1" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-8 text-center">
            <Hammer className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-1">No projects yet.</p>
            <p className="text-gray-400 text-xs">Add your completed work to build your portfolio.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <Card key={p.id} className="bg-white border-gray-200 overflow-hidden shadow-sm">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <Hammer className="h-10 w-10 text-gray-200" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-gray-900">{p.title}</h3>
                  {p.isFeatured && <Badge className="bg-[#d4a843] text-white text-[9px]">Featured</Badge>}
                </div>
                {p.category && <Badge variant="outline" className="text-[9px] border-gray-200 text-gray-500">{p.category}</Badge>}
                {p.location && <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</p>}
                {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => deleteProject(p.id)} className="text-[10px] text-red-500 hover:text-red-600 font-medium">Remove</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Project</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. 4-Room House in Ezimbokodweni" /></div>
            <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} placeholder="Brief project description..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Category</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  <option value="">Select...</option>
                  <option>House Construction</option><option>Renovation</option><option>Roofing</option><option>Painting</option><option>Paving</option><option>Boundary Wall</option>
                </select>
              </div>
              <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="Town/city" /></div>
            </div>
            <div><Label className="text-xs">Image URL (optional)</Label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="https://..." /></div>
            <Button onClick={addProject} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Project</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━ SERVICES ━━━━━
function ServicesPage({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [services, setServices] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', priceRange: '' })

  useEffect(() => {
    fetch(`/api/services?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
  }, [])

  const addService = async () => {
    if (!form.name) return
    const res = await fetch('/api/services', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: BIZ_ID, ...form }),
    })
    const created = await res.json()
    setServices([created.data ?? created, ...services])
    setForm({ name: '', description: '', priceRange: '' })
    setOpen(false)
    showToast('Service added')
  }

  const deleteService = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
    setServices(services.filter(s => s.id !== id))
    showToast('Service removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🔧 Services</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} services you offer</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433] shadow-sm">
          <Plus className="h-4 w-4 mr-1" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-8 text-center">
            <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No services yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map(s => (
            <Card key={s.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{s.name}</h3>
                    {s.description && <p className="text-xs text-gray-500 mt-1">{s.description}</p>}
                    {s.priceRange && <p className="text-xs text-[#b8941f] mt-2 font-semibold">{s.priceRange}</p>}
                  </div>
                  <button onClick={() => deleteService(s.id)} className="text-[10px] text-red-500 hover:text-red-600 shrink-0 ml-2 font-medium">Remove</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Service Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. House Construction" /></div>
            <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} placeholder="What this service includes..." /></div>
            <div><Label className="text-xs">Price Range</Label><Input value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. From R350,000" /></div>
            <Button onClick={addService} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Add Service</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━ LEADS & QUOTES ━━━━━
function QuotesPage({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [leads, setLeads] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [tab, setTab] = useState<'quotes' | 'leads'>('quotes')

  useEffect(() => {
    fetch(`/api/quote-requests?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setQuotes(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
    fetch(`/api/leads?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setLeads(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
  }, [])

  const updateQuoteStatus = async (quote: any, status: string) => {
    await fetch(`/api/quote-requests/${quote.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setQuotes(quotes.map(q => q.id === quote.id ? { ...q, status } : q))
    showToast(`Quote ${status}`)
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'won': case 'approved': return '#059669'
      case 'contacted': case 'sent': return '#2563eb'
      case 'quoted': case 'pending': return '#d97706'
      case 'lost': case 'rejected': return '#dc2626'
      default: return '#6b7280'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">👥 Leads & Quotes</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your sales pipeline</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        <button onClick={() => setTab('quotes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'quotes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          📋 Quote Requests ({quotes.length})
        </button>
        <button onClick={() => setTab('leads')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'leads' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          👤 Leads ({leads.length})
        </button>
      </div>

      {tab === 'quotes' && (
        <div className="space-y-3">
          {quotes.length === 0 ? (
            <Card className="bg-white border-gray-200"><CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No quote requests yet. They'll appear here when customers submit them.</p>
            </CardContent></Card>
          ) : quotes.map(q => (
            <Card key={q.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: `${statusColor(q.status)}15`, color: statusColor(q.status) }}>
                    {q.clientName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900">{q.clientName}</p>
                      <Badge variant="outline" className="text-[9px] capitalize" style={{ borderColor: statusColor(q.status), color: statusColor(q.status) }}>{q.status}</Badge>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {q.serviceType && `${q.serviceType} • `}{q.clientPhone} • {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                    {q.projectDesc && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{q.projectDesc}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {q.status === 'new' && <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => updateQuoteStatus(q, 'contacted')}>Contact</Button>}
                    {q.status === 'contacted' && <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => updateQuoteStatus(q, 'quoted')}>Quote Sent</Button>}
                    {q.status !== 'approved' && q.status !== 'rejected' && (
                      <>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] text-emerald-600" onClick={() => updateQuoteStatus(q, 'approved')}>✓ Won</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] text-red-500" onClick={() => updateQuoteStatus(q, 'rejected')}>Lost</Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'leads' && (
        <div className="space-y-3">
          {leads.length === 0 ? (
            <Card className="bg-white border-gray-200"><CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No leads yet. Add them as you meet potential clients.</p>
            </CardContent></Card>
          ) : leads.map(lead => (
            <Card key={lead.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                    {lead.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{lead.name}</p>
                    <p className="text-[10px] text-gray-400">{lead.phone && `${lead.phone} • `}{lead.source || 'Unknown'} • {new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ━━━━━ INVOICES ━━━━━
function InvoicesPage({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [invoices, setInvoices] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ clientName: '', clientPhone: '', items: '', amount: '', tax: '', dueDate: '', note: '' })

  useEffect(() => {
    fetch(`/api/invoices?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setInvoices(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
  }, [])

  const createInvoice = async () => {
    if (!form.clientName || !form.amount) return
    const subtotal = parseFloat(form.amount)
    const tax = parseFloat(form.tax || '0')
    const num = `INV-${String(invoices.length + 1).padStart(4, '0')}`
    const res = await fetch('/api/invoices', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: BIZ_ID, number: num, clientName: form.clientName, clientPhone: form.clientPhone, items: form.items, subtotal, tax, total: subtotal + tax, status: 'draft', dueDate: form.dueDate || null, note: form.note }),
    })
    const created = await res.json()
    setInvoices([created, ...invoices])
    setForm({ clientName: '', clientPhone: '', items: '', amount: '', tax: '', dueDate: '', note: '' })
    setOpen(false)
    showToast(`Invoice ${num} created`)
  }

  const updateStatus = async (inv: any, status: string) => {
    await fetch(`/api/invoices/${inv.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paidDate: status === 'paid' ? new Date().toISOString() : null }),
    })
    setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status } : i))
    showToast(`Invoice ${status}`)
  }

  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">💰 Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">{invoices.length} invoices</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433] shadow-sm">
          <Plus className="h-4 w-4 mr-1" /> New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm"><CardContent className="p-4">
          <p className="text-xs text-gray-400">Outstanding</p>
          <p className="text-2xl font-bold text-amber-600">R{totalOutstanding.toLocaleString()}</p>
        </CardContent></Card>
        <Card className="bg-white border-gray-200 shadow-sm"><CardContent className="p-4">
          <p className="text-xs text-gray-400">Paid</p>
          <p className="text-2xl font-bold text-emerald-600">R{totalPaid.toLocaleString()}</p>
        </CardContent></Card>
      </div>

      <div className="space-y-2">
        {invoices.length === 0 ? (
          <Card className="bg-white border-gray-200"><CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No invoices yet.</p>
          </CardContent></Card>
        ) : invoices.map(inv => (
          <Card key={inv.id} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-900">{inv.number}</p>
                    <Badge variant="outline" className="text-[9px] capitalize" style={{ borderColor: inv.status === 'paid' ? '#059669' : inv.status === 'sent' ? '#2563eb' : inv.status === 'overdue' ? '#dc2626' : '#9ca3af', color: inv.status === 'paid' ? '#059669' : inv.status === 'sent' ? '#2563eb' : inv.status === 'overdue' ? '#dc2626' : '#6b7280' }}>{inv.status}</Badge>
                  </div>
                  <p className="text-[10px] text-gray-400">{inv.clientName} • {new Date(inv.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-gray-900">R{inv.total.toLocaleString()}</p>
                <div className="flex gap-1">
                  {inv.status === 'draft' && <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => updateStatus(inv, 'sent')}>Send</Button>}
                  {inv.status !== 'paid' && <Button size="sm" variant="ghost" className="h-7 text-[10px] text-emerald-600" onClick={() => updateStatus(inv, 'paid')}>Paid</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Client Name *</Label><Input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            <div><Label className="text-xs">Phone</Label><Input value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            <div><Label className="text-xs">Description</Label><Textarea value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} className="bg-gray-50 border-gray-200" rows={2} placeholder="What was done..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Amount (R) *</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
              <div><Label className="text-xs">Tax (R)</Label><Input type="number" value={form.tax} onChange={e => setForm({ ...form, tax: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            </div>
            <div><Label className="text-xs">Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="bg-gray-50 border-gray-200" /></div>
            <Button onClick={createInvoice} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Create Invoice</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━ REVIEWS ━━━━━
function ReviewsPage({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/testimonials?businessId=${BIZ_ID}`).then(r => r.json()).then(d => setReviews(Array.isArray(d) ? d : d.items ?? [])).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">⭐ Reviews & Testimonials</h1>
        <p className="text-gray-500 text-sm mt-1">{reviews.length} client reviews</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map(t => (
            <Card key={t.id} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#d4a843] text-[#d4a843]" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic mb-3">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#d4a843]/10 flex items-center justify-center text-xs font-bold text-[#b8941f]">
                    {t.clientName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.clientName}</p>
                    <p className="text-[10px] text-gray-400">{t.projectName || 'Verified Customer'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ━━━━━ MARKETING ━━━━━
function MarketingPage() {
  const [tab, setTab] = useState<'hooks' | 'seo' | 'cta' | 'calendar' | 'whatsapp'>('hooks')

  const hooks = [
    'Building Dreams, One Brick at a Time', 'Your Home Deserves the Best',
    'From Foundation to Finish — We Deliver', 'Quality Construction, Honest Service',
    "We Don't Just Build Houses — We Build Homes", 'Your Vision, Our Expertise',
    'Transforming Spaces, Transforming Lives', 'Making Your Dream Home a Reality',
    'Where Quality Meets Affordability', 'Trusted Builders Since Day One',
    'Construction Excellence in KwaZulu-Natal', 'Your Project, Our Priority',
    'Building Better Homes, Building Better Lives', 'We Build What You Imagine',
    'Reliable Builders You Can Trust',
  ]

  const seoKeywords = [
    { cat: 'Primary', kw: ['Construction Company KwaZulu-Natal', 'Builders in Durban', 'Home Renovations KZN', 'Affordable Builders South Africa'] },
    { cat: 'Services', kw: ['Roof Repairs', 'House Painting', 'Kitchen Renovations', 'Bathroom Renovations', 'House Extensions', 'Boundary Walls', 'Driveways', 'Paving Contractors', 'Bricklayers', 'Waterproofing'] },
    { cat: 'Location', kw: ['Township House Builders', 'Rural Home Builders', 'Modern House Construction', 'Building Contractors Malagazi', 'Builders Ezimbokodweni'] },
    { cat: 'Blog Titles', kw: ['How Much Does It Cost To Build a House?', 'Top 10 Modern Township House Designs', 'Kitchen Renovation Guide', 'House Extension Guide', 'Choosing the Right Builder', 'Building Without Hidden Costs'] },
  ]

  const ctas = [
    '📞 Call Us Today for a Free Quote', '💬 WhatsApp Us Now', '📋 Request a Free Consultation',
    '🏠 View Our Projects', '⭐ Read Customer Reviews', '📄 Download Company Profile',
    '🗓️ Book a Site Visit', '💰 Get Your Free Quote Today', '📸 See Before & After',
    '🏗️ Start Your Project Now', '👍 Follow Us for Daily Tips', '🔔 Get a Free Estimate',
  ]

  const whatsappTemplates = [
    { title: 'Welcome Message', msg: 'Thank you for contacting Fukulisane Construction! 🏗️\n\nPlease send:\n• Your Name\n• Project Location\n• Service Needed\n• Photos (if available)\n\nWe will respond within 24 hours.' },
    { title: 'Quote Follow-up', msg: "Hi! Following up on your quote request. We'd love to help with your project. When can we schedule a site visit? 📋" },
    { title: 'Project Update', msg: "Hi! Here's an update on your project. We're on track and will share photos soon. Thank you for your trust! 🏠" },
    { title: 'Review Request', msg: 'Hi! We hope you love your new space! 🌟\n\nWould you mind leaving us a Google review?\nhttps://g.page/r/CZvrH_lDzSdJEBI/review\n\nThank you! 🙏' },
  ]

  const copy = (text: string) => { navigator.clipboard.writeText(text) }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">📢 Marketing</h1>
        <p className="text-gray-500 text-sm mt-1">Content plan, hooks, SEO keywords, and campaigns</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {([
          { id: 'hooks' as const, label: '🎯 Hooks' },
          { id: 'seo' as const, label: '🔍 SEO' },
          { id: 'cta' as const, label: '📢 CTAs' },
          { id: 'calendar' as const, label: '📅 Calendar' },
          { id: 'whatsapp' as const, label: '💬 WhatsApp' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hooks' && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">🎯 Marketing Hooks</h3>
            <div className="space-y-2">
              {hooks.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[#b8941f] font-bold text-sm shrink-0 w-6">{i + 1}</span>
                  <p className="text-sm text-gray-700 flex-1">{h}</p>
                  <button onClick={() => copy(h)} className="text-gray-400 hover:text-[#b8941f] transition"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'seo' && (
        <div className="space-y-4">
          {seoKeywords.map(cat => (
            <Card key={cat.cat} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3">🔍 {cat.cat} Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.kw.map(k => <Badge key={k} variant="secondary" className="bg-gray-100 text-gray-600 border-0">{k}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'cta' && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">📢 Calls to Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ctas.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-700 flex-1">{c}</p>
                  <button onClick={() => copy(c)} className="text-gray-400 hover:text-[#b8941f] transition"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'calendar' && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">📅 Weekly Content Plan</h3>
            <div className="space-y-3">
              {[
                { day: 'Monday', content: 'Construction Tip — Foundation, Brickwork, or Roofing advice', emoji: '💡', platforms: 'Facebook, Instagram, LinkedIn' },
                { day: 'Tuesday', content: 'Before & After — Transformation of a completed project', emoji: '📸', platforms: 'Instagram, Facebook, TikTok' },
                { day: 'Wednesday', content: 'Client Testimonial — Google review screenshot + project photo', emoji: '⭐', platforms: 'Facebook, Instagram, Google' },
                { day: 'Thursday', content: 'Site Progress — Active build photos or time-lapse', emoji: '🏗️', platforms: 'Instagram Stories, TikTok' },
                { day: 'Friday', content: 'Completed Project Showcase — Finished house with homeowner', emoji: '🏠', platforms: 'All platforms' },
                { day: 'Saturday', content: 'Team Feature — Skilled tradesperson spotlight', emoji: '👷', platforms: 'Facebook, Instagram' },
                { day: 'Sunday', content: 'Design Inspiration — Modern KZN house designs', emoji: '✨', platforms: 'Pinterest, Instagram' },
              ].map(d => (
                <div key={d.day} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-xl">{d.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{d.day} — {d.content}</p>
                    <p className="text-[10px] text-gray-400">{d.platforms}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'whatsapp' && (
        <div className="space-y-4">
          {whatsappTemplates.map(t => (
            <Card key={t.title} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-gray-900">💬 {t.title}</h3>
                  <button onClick={() => copy(t.msg)} className="text-[10px] text-[#b8941f] flex items-center gap-1 font-medium"><Copy className="h-3 w-3" /> Copy</button>
                </div>
                <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap font-sans border border-gray-100">{t.msg}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ━━━━━ POSTS — live content feed ━━━━━
function PostsPage({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [posts, setPosts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', category: 'update' })

  useEffect(() => {
    fetch(`/api/posts?businessId=${BIZ_ID}`).then(r => r.json()).then(raw => {
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : []
      setPosts(list)
    }).catch(() => {})
  }, [])

  const addPost = async () => {
    if (!form.title || !form.content) return
    const res = await fetch('/api/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: BIZ_ID, ...form, imageUrl: form.imageUrl || null }),
    })
    const created = await res.json()
    setPosts([created, ...posts])
    setForm({ title: '', content: '', imageUrl: '', category: 'update' })
    setOpen(false)
    showToast('Post published — shows on your website')
  }

  const deletePost = async (id: string) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setPosts(posts.filter(p => p.id !== id))
    showToast('Post removed')
  }

  const catColors: Record<string, string> = {
    promotion: 'bg-red-50 text-red-600',
    service: 'bg-blue-50 text-blue-600',
    about: 'bg-[#d4a843]/10 text-[#b09430]',
    update: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">📢 Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} posts — these show live on your website</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433] shadow-sm">
          <Plus className="h-4 w-4 mr-1" /> New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-8 text-center">
            <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No posts yet. Create your first post to share on your website.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {posts.map(p => (
            <Card key={p.id} className="bg-white border-gray-200 shadow-sm overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <Megaphone className="h-8 w-8 text-gray-200" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={`text-[9px] capitalize ${catColors[p.category] || catColors.update}`}>{p.category}</Badge>
                  <span className="text-[10px] text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{p.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-3">{p.content}</p>
                <button onClick={() => deletePost(p.id)} className="text-[10px] text-red-500 hover:text-red-600 mt-3 font-medium">Delete</button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader><DialogTitle>Create Post</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. 10% OFF Renovations This Month" /></div>
            <div><Label className="text-xs">Content *</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="bg-gray-50 border-gray-200" rows={4} placeholder="Write your post content here..." /></div>
            <div><Label className="text-xs">Image URL (optional)</Label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="https://..." /></div>
            <div><Label className="text-xs">Category</Label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                <option value="update">Update</option>
                <option value="promotion">Promotion</option>
                <option value="service">Service</option>
                <option value="about">About</option>
              </select>
            </div>
            <Button onClick={addPost} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Publish Post</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ━━━━━ DIGITAL SETUP ━━━━━
function DigitalSetupPage() {
  const platforms = [
    { name: 'Google Business', desc: 'Create/manage your listing', url: 'https://business.google.com/', color: '#4285f4' },
    { name: 'Facebook Business', desc: 'Create your Facebook page', url: 'https://www.facebook.com/pages/create/', color: '#1877f2' },
    { name: 'Meta Business Suite', desc: 'Manage Facebook & Instagram', url: 'https://business.facebook.com/', color: '#0668e1' },
    { name: 'Instagram', desc: 'Create professional account', url: 'https://www.instagram.com/', color: '#e4405f' },
    { name: 'TikTok Business', desc: 'Create TikTok business profile', url: 'https://www.tiktok.com/business/', color: '#010101' },
    { name: 'YouTube', desc: 'Create your channel', url: 'https://www.youtube.com/create_channel', color: '#ff0000' },
    { name: 'LinkedIn', desc: 'Create company page', url: 'https://www.linkedin.com/company/setup/new/', color: '#0a66c2' },
    { name: 'WhatsApp Business', desc: 'Download WhatsApp Business', url: 'https://www.whatsapp.com/business/', color: '#25d366' },
    { name: 'Canva', desc: 'Design marketing materials', url: 'https://www.canva.com/', color: '#00c4cc' },
    { name: 'Google Reviews', desc: 'Collect customer reviews', url: 'https://g.page/r/CZvrH_lDzSdJEBI/review', color: '#fbbc04' },
    { name: 'Google Maps', desc: 'Verify business location', url: 'https://maps.google.com/', color: '#4285f4' },
    { name: 'WordPress', desc: 'Create company website', url: 'https://wordpress.com/', color: '#21759b' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">🌐 Digital Setup Hub</h1>
        <p className="text-gray-500 text-sm mt-1">Click each link to create your online presence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map(p => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[#d4a843]/40 hover:shadow-md transition group shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${p.color}12` }}>
                <Globe className="h-5 w-5" style={{ color: p.color }} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#b8941f] transition">{p.name}</h3>
                <p className="text-[10px] text-gray-400">{p.desc}</p>
              </div>
            </div>
            <span className="text-[10px] text-[#b8941f] flex items-center gap-1 font-medium">Open <ArrowUpRight className="h-3 w-3" /></span>
          </a>
        ))}
      </div>

      <Card className="bg-white border-[#d4a843]/20 shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-bold text-sm mb-3 text-[#b8941f]">📋 Recommended Setup Order</h3>
          <ol className="space-y-2">
            {['Google Business Profile', 'WhatsApp Business', 'Facebook Business Page', 'Instagram Professional Account', 'Website', 'LinkedIn Company Page', 'YouTube Channel', 'TikTok Business', 'Canva for Branding'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="h-6 w-6 rounded-full bg-[#d4a843]/10 text-[#b8941f] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

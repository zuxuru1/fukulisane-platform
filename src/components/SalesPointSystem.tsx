import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  TrendingUp, TrendingDown, Users, Target, Award, Zap,
  Phone, MessageCircle, Mail, MapPin, ExternalLink,
  CheckCircle2, Circle, AlertTriangle, Clock, Flame,
  ArrowUpRight, ChevronRight, ChevronDown, Eye, Star,
  FileText, Send, Calendar, BarChart3, Activity,
  Plus, Search, Filter, Sparkles, Trophy, DollarSign,
  Handshake, UserPlus, Clock3, RefreshCw, Bell
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

const STAGE_CONFIG: Record<string, { label: string; color: string; icon: any; range: string }> = {
  discovery:     { label: 'Visitor',    color: '#6b7280', icon: Eye,        range: '0–30' },
  engagement:    { label: 'Interested', color: '#2563eb', icon: MessageCircle, range: '31–120' },
  qualification: { label: 'Qualified',  color: '#d97706', icon: Target,     range: '121–250' },
  sales:         { label: 'Active',     color: '#dc2626', icon: Handshake,  range: '251–700' },
  success:       { label: 'Advocate',   color: '#059669', icon: Award,      range: '701+' },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bgColor: string; emoji: string }> = {
  hot_lead:       { label: 'Hot Lead',       color: '#dc2626', bgColor: '#fef2f2', emoji: '🔴' },
  warm_lead:      { label: 'Warm Lead',      color: '#ea580c', bgColor: '#fff7ed', emoji: '🟠' },
  active_prospect:{ label: 'Active Prospect', color: '#d97706', bgColor: '#fffbeb', emoji: '🟡' },
  new_lead:       { label: 'New Lead',       color: '#2563eb', bgColor: '#eff6ff', emoji: '🔵' },
}

const ACTION_POINTS: Record<string, { points: number; stage: string; label: string }> = {
  website_visit:      { points: 2,   stage: 'discovery',     label: 'Website Visit' },
  gbp_view:           { points: 3,   stage: 'discovery',     label: 'Google Business View' },
  maps_directions:    { points: 10,  stage: 'discovery',     label: 'Map Directions' },
  view_service:       { points: 5,   stage: 'discovery',     label: 'Viewed Service Page' },
  view_gallery:       { points: 6,   stage: 'discovery',     label: 'Viewed Gallery' },
  watch_video:        { points: 8,   stage: 'discovery',     label: 'Watched Video' },
  download_profile:   { points: 10,  stage: 'discovery',     label: 'Downloaded Profile' },
  read_reviews:       { points: 6,   stage: 'discovery',     label: 'Read Reviews' },
  view_pricing:       { points: 12,  stage: 'discovery',     label: 'Visited Pricing' },
  click_call:         { points: 20,  stage: 'engagement',    label: 'Clicked Call' },
  click_whatsapp:     { points: 20,  stage: 'engagement',    label: 'Clicked WhatsApp' },
  send_whatsapp:      { points: 30,  stage: 'engagement',    label: 'Sent WhatsApp' },
  submit_form:        { points: 30,  stage: 'engagement',    label: 'Submitted Form' },
  request_quote:      { points: 50,  stage: 'engagement',    label: 'Requested Quote' },
  upload_photos:      { points: 25,  stage: 'engagement',    label: 'Uploaded Photos' },
  book_site_visit:    { points: 60,  stage: 'engagement',    label: 'Booked Site Visit' },
  site_inspection:    { points: 80,  stage: 'qualification', label: 'Site Inspection Done' },
  requirements_confirmed: { points: 40, stage: 'qualification', label: 'Requirements Confirmed' },
  budget_discussed:   { points: 30,  stage: 'qualification', label: 'Budget Discussed' },
  timeline_agreed:    { points: 20,  stage: 'qualification', label: 'Timeline Agreed' },
  quote_sent:         { points: 50,  stage: 'qualification', label: 'Quote Sent' },
  quote_opened:       { points: 20,  stage: 'qualification', label: 'Customer Opened Quote' },
  quote_changes:      { points: 20,  stage: 'qualification', label: 'Requested Changes' },
  accepted_quote:     { points: 100, stage: 'sales',         label: 'Accepted Quote' },
  signed_contract:    { points: 200, stage: 'sales',         label: 'Signed Contract' },
  deposit_received:   { points: 250, stage: 'sales',         label: 'Deposit Received' },
  project_scheduled:  { points: 100, stage: 'sales',         label: 'Project Scheduled' },
  construction_started:{ points: 100, stage: 'sales',        label: 'Construction Started' },
  project_completed:  { points: 200, stage: 'success',       label: 'Project Completed' },
  final_payment:      { points: 100, stage: 'success',       label: 'Final Payment Received' },
  left_review:        { points: 50,  stage: 'success',       label: 'Left Google Review' },
  social_share:       { points: 50,  stage: 'success',       label: 'Shared on Social Media' },
  referred_customer:  { points: 150, stage: 'success',       label: 'Referred a Customer' },
  returned_project:   { points: 200, stage: 'success',       label: 'Returned for New Project' },
}

function getStage(score: number): string {
  if (score >= 701) return 'success'
  if (score >= 251) return 'sales'
  if (score >= 121) return 'qualification'
  if (score >= 31) return 'engagement'
  return 'discovery'
}

function getPriority(score: number): string {
  if (score >= 500) return 'hot_lead'
  if (score >= 250) return 'warm_lead'
  if (score >= 100) return 'active_prospect'
  return 'new_lead'
}

function getProbability(score: number): number {
  if (score >= 701) return 95
  if (score >= 500) return 80
  if (score >= 250) return 55
  if (score >= 121) return 30
  if (score >= 31) return 12
  return 3
}

function getNextAction(score: number): string {
  if (score >= 701) return 'Request Google review & referral'
  if (score >= 500) return 'Send contract for signature'
  if (score >= 250) return 'Schedule project start date'
  if (score >= 121) return 'Send detailed quotation'
  if (score >= 31) return 'Respond to inquiry within 1 hour'
  return 'No action needed yet'
}

type Lead = {
  id: string; name: string; email?: string; phone?: string; source?: string; service?: string
  status: string; score: number; stage: string; priority: string; estimatedValue?: number
  probability: number; nextAction?: string; lastActivity?: string; notes?: string
  assignedTo?: string; convertedAt?: string; createdAt: string; updatedAt: string
  activities?: { id: string; action: string; points: number; category?: string; createdAt: string }[]
}

export default function SalesPointSystem() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAddLead, setShowAddLead] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState<string | null>(null)
  const [addForm, setAddForm] = useState({ name: '', phone: '', email: '', source: '', service: '' })
  const [activityForm, setActivityForm] = useState({ action: 'website_visit', notes: '' })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leads`)
      const d = await res.json()
      const items = Array.isArray(d) ? d : d?.items ?? []
      setLeads(items.map((l: any) => ({
        ...l,
        stage: l.stage || getStage(l.score || 0),
        priority: l.priority || getPriority(l.score || 0),
        probability: l.probability || getProbability(l.score || 0),
      })))
    } catch {}
    setLoading(false)
  }

  const addLead = async () => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: BIZ_ID,
          name: addForm.name,
          phone: addForm.phone,
          email: addForm.email || undefined,
          source: addForm.source || 'manual',
          service: addForm.service || undefined,
          score: 1,
          stage: 'discovery',
          priority: 'new_lead',
          status: 'new',
        }),
      })
      setShowAddLead(false)
      setAddForm({ name: '', phone: '', email: '', source: '', service: '' })
      fetchLeads()
    } catch {}
  }

  const addActivity = async (leadId: string) => {
    const act = ACTION_POINTS[activityForm.action]
    if (!act) return
    try {
      const lead = leads.find(l => l.id === leadId)
      if (!lead) return
      const newScore = lead.score + act.points
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: newScore,
          stage: getStage(newScore),
          priority: getPriority(newScore),
          probability: getProbability(newScore),
          nextAction: getNextAction(newScore),
          lastActivity: act.label,
        }),
      })
      setShowAddActivity(null)
      setActivityForm({ action: 'website_visit', notes: '' })
      fetchLeads()
    } catch {}
  }

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone?.includes(searchQuery) || l.email?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStage = stageFilter === 'all' || l.stage === stageFilter
      const matchPriority = priorityFilter === 'all' || l.priority === priorityFilter
      return matchSearch && matchStage && matchPriority
    }).sort((a, b) => b.score - a.score)
  }, [leads, searchQuery, stageFilter, priorityFilter])

  const stats = useMemo(() => {
    const total = leads.length
    const hotLeads = leads.filter(l => l.priority === 'hot_lead').length
    const warmLeads = leads.filter(l => l.priority === 'warm_lead').length
    const totalPipeline = leads.reduce((sum, l) => sum + ((l.estimatedValue || 0) * (l.probability / 100)), 0)
    const converted = leads.filter(l => l.convertedAt).length
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0
    const avgScore = total > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / total) : 0

    const stageCounts = Object.keys(STAGE_CONFIG).map(stage => ({
      stage,
      ...STAGE_CONFIG[stage],
      count: leads.filter(l => l.stage === stage).length,
    }))

    return { total, hotLeads, warmLeads, totalPipeline, converted, conversionRate, avgScore, stageCounts }
  }, [leads])

  const leaderboard = useMemo(() => {
    const sourceMap = new Map<string, { count: number; totalScore: number; revenue: number }>()
    leads.forEach(l => {
      const src = l.source || 'Unknown'
      const existing = sourceMap.get(src) || { count: 0, totalScore: 0, revenue: 0 }
      sourceMap.set(src, {
        count: existing.count + 1,
        totalScore: existing.totalScore + l.score,
        revenue: existing.revenue + (l.estimatedValue || 0),
      })
    })
    return Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      ...data,
      avgScore: Math.round(data.totalScore / data.count),
    })).sort((a, b) => b.totalScore - a.totalScore)
  }, [leads])

  const automations = useMemo(() => {
    const rules: { icon: any; title: string; desc: string; leads: Lead[]; color: string; action: string }[] = []

    const needsFollowup = leads.filter(l => l.score >= 31 && l.score < 121 && l.status === 'new')
    if (needsFollowup.length > 0) rules.push({
      icon: Phone, title: 'Follow Up on New Leads',
      desc: `${needsFollowup.length} interested leads need a response within 1 hour`,
      leads: needsFollowup, color: '#2563eb', action: 'Call Now',
    })

    const readyForQuote = leads.filter(l => l.score >= 121 && l.score < 251)
    if (readyForQuote.length > 0) rules.push({
      icon: FileText, title: 'Send Quotations',
      desc: `${readyForQuote.length} qualified leads are ready for a detailed quote`,
      leads: readyForQuote, color: '#d97706', action: 'Send Quote',
    })

    const readyForContract = leads.filter(l => l.score >= 500 && l.score < 701)
    if (readyForContract.length > 0) rules.push({
      icon: Handshake, title: 'Close Active Deals',
      desc: `${readyForContract.length} hot leads should receive contracts`,
      leads: readyForContract, color: '#dc2626', action: 'Send Contract',
    })

    const completedNoReview = leads.filter(l => l.score >= 701 && !l.activities?.some(a => a.action === 'left_review'))
    if (completedNoReview.length > 0) rules.push({
      icon: Star, title: 'Request Google Reviews',
      desc: `${completedNoReview.length} satisfied customers haven't left a review yet`,
      leads: completedNoReview, color: '#059669', action: 'Request Review',
    })

    return rules
  }, [leads])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Flame className="h-6 w-6 text-[#d4a843]" /> Sales Point System
          </h1>
          <p className="text-gray-500 text-sm mt-1">BGOS — Buy Intent Score Engine for Fukulisane Construction</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchLeads}
            className="border-gray-200 text-gray-600 text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAddLead(true)}
            className="bg-[#d4a843] text-white hover:bg-[#c9a433] text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: stats.total, icon: Users, color: '#2563eb', sub: `${stats.avgScore} avg score` },
          { label: 'Hot Leads', value: stats.hotLeads, icon: Flame, color: '#dc2626', sub: 'Score 500+' },
          { label: 'Pipeline Value', value: `R${Math.round(stats.totalPipeline).toLocaleString()}`, icon: DollarSign, color: '#d4a843', sub: 'Weighted value' },
          { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: '#059669', sub: `${stats.converted} converted` },
        ].map(m => (
          <Card key={m.label} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${m.color}12` }}>
                  <m.icon className="h-5 w-5" style={{ color: m.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{m.value}</p>
                  <p className="text-[10px] text-gray-400">{m.label}</p>
                  <p className="text-[9px] text-gray-400">{m.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            <BarChart3 className="h-3.5 w-3.5 inline mr-1" /> Sales Pipeline
          </h3>
          <div className="flex items-end gap-3 overflow-x-auto pb-2">
            {stats.stageCounts.map((s, i) => {
              const pct = stats.total > 0 ? Math.round((s.count / stats.total) * 100) : 0
              const maxH = 120
              const h = Math.max(20, (s.count / Math.max(1, stats.total)) * maxH)
              return (
                <div key={s.stage} className="flex flex-col items-center gap-1 min-w-[80px]">
                  <p className="text-xs font-bold text-gray-900">{s.count}</p>
                  <div className="w-full rounded-t-lg transition-all" style={{ height: h, backgroundColor: `${s.color}20`, borderBottom: `3px solid ${s.color}` }}>
                    <div className="w-full h-full rounded-t-lg flex items-center justify-center">
                      <s.icon className="h-4 w-4" style={{ color: s.color }} />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[9px] text-gray-400">{s.range}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      {automations.length > 0 && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              <Zap className="h-3.5 w-3.5 inline mr-1" /> Recommended Actions
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {automations.map((rule, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${rule.color}12` }}>
                      <rule.icon className="h-4 w-4" style={{ color: rule.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900">{rule.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{rule.desc}</p>
                      <div className="flex gap-1.5 mt-2">
                        {rule.leads.slice(0, 3).map(l => (
                          <span key={l.id} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-gray-200 text-gray-600">
                            {l.name}
                          </span>
                        ))}
                        {rule.leads.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-400">
                            +{rule.leads.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters + Search */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="pl-9 bg-gray-50 border-gray-200 text-xs h-9" />
            </div>
            <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white h-9">
              <option value="all">All Stages</option>
              {Object.entries(STAGE_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white h-9">
              <option value="all">All Priorities</option>
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400">{filteredLeads.length} leads</p>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Probability</th>
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Next Action</th>
                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400 text-sm">Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400 text-sm">
                  <div className="flex flex-col items-center">
                    <Users className="h-10 w-10 text-gray-300 mb-2" />
                    <p>No leads yet. Add your first lead to get started.</p>
                  </div>
                </td></tr>
              ) : filteredLeads.map(lead => {
                const stage = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.discovery
                const priority = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.new_lead
                return (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#d4a843]/10 flex items-center justify-center text-xs font-bold text-[#b8941f] shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{lead.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{lead.phone || lead.email || lead.source}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-extrabold" style={{ color: stage.color }}>{lead.score}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] font-bold" style={{ color: stage.color, borderColor: `${stage.color}30` }}>
                        {stage.label}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold" style={{ color: priority.color }}>
                        {priority.emoji} {priority.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${lead.probability}%`, backgroundColor: stage.color }} />
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">{lead.probability}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-gray-700 font-medium">
                        {lead.estimatedValue ? `R${lead.estimatedValue.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] text-gray-500 max-w-[140px] truncate block">{lead.nextAction || getNextAction(lead.score)}</span>
                    </td>
                    <td className="p-3">
                      <button onClick={(e) => { e.stopPropagation(); setShowAddActivity(lead.id) }}
                        className="h-7 w-7 rounded-lg bg-gray-100 hover:bg-[#d4a843]/10 flex items-center justify-center transition">
                        <Plus className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead Detail Panel */}
      {selectedLead && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#d4a843]/10 flex items-center justify-center text-lg font-bold text-[#b8941f]">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-extrabold" style={{ color: STAGE_CONFIG[selectedLead.stage]?.color }}>
                      {selectedLead.score} pts
                    </span>
                    <Badge variant="outline" className="text-[10px]"
                      style={{ color: STAGE_CONFIG[selectedLead.stage]?.color, borderColor: `${STAGE_CONFIG[selectedLead.stage]?.color}30` }}>
                      {STAGE_CONFIG[selectedLead.stage]?.label}
                    </Badge>
                    <span className="text-[10px]" style={{ color: PRIORITY_CONFIG[selectedLead.priority]?.color }}>
                      {PRIORITY_CONFIG[selectedLead.priority]?.emoji} {PRIORITY_CONFIG[selectedLead.priority]?.label}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] text-gray-400 mb-0.5">Contact</p>
                {selectedLead.phone && <p className="text-xs text-gray-700 flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedLead.phone}</p>}
                {selectedLead.email && <p className="text-xs text-gray-700 flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedLead.email}</p>}
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] text-gray-400 mb-0.5">Details</p>
                <p className="text-xs text-gray-700">Source: {selectedLead.source || 'Unknown'}</p>
                {selectedLead.service && <p className="text-xs text-gray-700">Service: {selectedLead.service}</p>}
                {selectedLead.estimatedValue && <p className="text-xs text-gray-700">Value: R{selectedLead.estimatedValue.toLocaleString()}</p>}
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] text-gray-400 mb-0.5">Next Action</p>
                <p className="text-xs text-gray-700 font-medium">{selectedLead.nextAction || getNextAction(selectedLead.score)}</p>
                <p className="text-[10px] text-gray-400 mt-1">Probability: {selectedLead.probability}%</p>
              </div>
            </div>

            {/* Activity Log */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                <Clock3 className="h-3.5 w-3.5 inline mr-1" /> Activity History
              </h4>
              {selectedLead.activities && selectedLead.activities.length > 0 ? (
                <div className="space-y-2">
                  {selectedLead.activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(act => (
                    <div key={act.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="h-7 w-7 rounded-lg bg-[#d4a843]/10 flex items-center justify-center shrink-0">
                        <Zap className="h-3.5 w-3.5 text-[#b8941f]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700">{act.action}</p>
                        {act.category && <p className="text-[9px] text-gray-400">{act.category}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-[#b8941f]">+{act.points}</p>
                        <p className="text-[9px] text-gray-400">{new Date(act.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-3 text-center">No activities recorded yet</p>
              )}
              <Button size="sm" variant="outline" onClick={() => setShowAddActivity(selectedLead.id)}
                className="mt-3 border-gray-200 text-gray-600 text-xs w-full">
                <Plus className="h-3.5 w-3.5 mr-1" /> Record Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            <Trophy className="h-3.5 w-3.5 inline mr-1" /> Lead Sources Leaderboard
          </h3>
          {leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <div key={entry.source} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-[#d4a843] text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 capitalize">{entry.source}</p>
                    <p className="text-[10px] text-gray-400">{entry.count} leads · avg score {entry.avgScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{entry.totalScore}</p>
                    <p className="text-[10px] text-gray-400">total pts</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">No data yet</p>
          )}
        </CardContent>
      </Card>

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddLead(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-extrabold text-gray-900">Add New Lead</h3>
                <button onClick={() => setShowAddLead(false)} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">×</span>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-[10px] font-bold text-gray-500">Name *</Label>
                  <Input required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                    className="bg-gray-50 border-gray-200 text-xs h-9 mt-1" placeholder="Customer name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] font-bold text-gray-500">Phone</Label>
                    <Input value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-xs h-9 mt-1" placeholder="081 774 6377" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-gray-500">Email</Label>
                    <Input value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-xs h-9 mt-1" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] font-bold text-gray-500">Source</Label>
                    <select value={addForm.source} onChange={e => setAddForm({ ...addForm, source: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white h-9">
                      <option value="">Select source</option>
                      <option value="website">Website</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone_call">Phone Call</option>
                      <option value="google">Google</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="referral">Referral</option>
                      <option value="walk_in">Walk-In</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-gray-500">Service Needed</Label>
                    <select value={addForm.service} onChange={e => setAddForm({ ...addForm, service: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white h-9">
                      <option value="">Select service</option>
                      <option value="new_construction">New Construction</option>
                      <option value="renovation">Renovation</option>
                      <option value="extensions">Extensions</option>
                      <option value="roofing">Roofing</option>
                      <option value="painting">Painting</option>
                      <option value="paving">Paving</option>
                      <option value="boundary_wall">Boundary Wall</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <button onClick={addLead} disabled={!addForm.name}
                  className="w-full mt-4 py-3 rounded-xl bg-[#d4a843] text-white text-sm font-bold hover:bg-[#c9a433] transition disabled:opacity-50">
                  <UserPlus className="h-4 w-4 inline mr-1" /> Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddActivity(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-extrabold text-gray-900">Record Activity</h3>
                <button onClick={() => setShowAddActivity(null)} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">×</span>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-[10px] font-bold text-gray-500">Action *</Label>
                  <select value={activityForm.action} onChange={e => setActivityForm({ ...activityForm, action: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white">
                    <optgroup label="Stage 1 – Discovery">
                      <option value="website_visit">Website Visit (+2)</option>
                      <option value="gbp_view">Google Business View (+3)</option>
                      <option value="maps_directions">Map Directions (+10)</option>
                      <option value="view_service">Viewed Service Page (+5)</option>
                      <option value="view_gallery">Viewed Gallery (+6)</option>
                      <option value="watch_video">Watched Video (+8)</option>
                      <option value="download_profile">Downloaded Profile (+10)</option>
                      <option value="read_reviews">Read Reviews (+6)</option>
                      <option value="view_pricing">Visited Pricing (+12)</option>
                    </optgroup>
                    <optgroup label="Stage 2 – Engagement">
                      <option value="click_call">Clicked Call (+20)</option>
                      <option value="click_whatsapp">Clicked WhatsApp (+20)</option>
                      <option value="send_whatsapp">Sent WhatsApp (+30)</option>
                      <option value="submit_form">Submitted Form (+30)</option>
                      <option value="request_quote">Requested Quote (+50)</option>
                      <option value="upload_photos">Uploaded Photos (+25)</option>
                      <option value="book_site_visit">Booked Site Visit (+60)</option>
                    </optgroup>
                    <optgroup label="Stage 3 – Qualification">
                      <option value="site_inspection">Site Inspection Done (+80)</option>
                      <option value="requirements_confirmed">Requirements Confirmed (+40)</option>
                      <option value="budget_discussed">Budget Discussed (+30)</option>
                      <option value="timeline_agreed">Timeline Agreed (+20)</option>
                      <option value="quote_sent">Quote Sent (+50)</option>
                      <option value="quote_opened">Customer Opened Quote (+20)</option>
                      <option value="quote_changes">Requested Changes (+20)</option>
                    </optgroup>
                    <optgroup label="Stage 4 – Sales">
                      <option value="accepted_quote">Accepted Quote (+100)</option>
                      <option value="signed_contract">Signed Contract (+200)</option>
                      <option value="deposit_received">Deposit Received (+250)</option>
                      <option value="project_scheduled">Project Scheduled (+100)</option>
                      <option value="construction_started">Construction Started (+100)</option>
                    </optgroup>
                    <optgroup label="Stage 5 – Customer Success">
                      <option value="project_completed">Project Completed (+200)</option>
                      <option value="final_payment">Final Payment (+100)</option>
                      <option value="left_review">Left Google Review (+50)</option>
                      <option value="social_share">Shared on Social (+50)</option>
                      <option value="referred_customer">Referred a Customer (+150)</option>
                      <option value="returned_project">Returned for New Project (+200)</option>
                    </optgroup>
                  </select>
                  <p className="text-[10px] text-[#b8941f] font-bold mt-1">
                    +{ACTION_POINTS[activityForm.action]?.points || 0} points → {ACTION_POINTS[activityForm.action]?.stage || '?'}
                  </p>
                </div>
                <button onClick={() => showAddActivity && addActivity(showAddActivity)}
                  className="w-full mt-4 py-3 rounded-xl bg-[#d4a843] text-white text-sm font-bold hover:bg-[#c9a433] transition">
                  <Zap className="h-4 w-4 inline mr-1" /> Record & Score
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function X({ className }: { className?: string }) {
  return <span className={className}>×</span>
}

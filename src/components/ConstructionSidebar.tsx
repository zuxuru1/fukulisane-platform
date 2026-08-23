import { useState } from 'react'
import {
  LayoutDashboard, Hammer, CheckSquare, Home, BookOpen, Image,
  Users, Megaphone, UserCog, ClipboardCheck, CalendarOff,
  ShoppingCart, Truck, Package, Calculator, Sparkles, BarChart3,
  DollarSign, TrendingUp, UserSearch, Target, Zap, Globe,
  Network, Settings, ChevronDown, ChevronRight, Eye, ExternalLink,
  Phone, X, Menu, FolderOpen, Flame, Wrench, MessageCircle,
  FileText, Star, Send, CreditCard, Puzzle, Shield, Wifi
} from 'lucide-react'

export type Page =
  | 'dashboard'
  | 'projects' | 'tasks' | 'house-plans' | 'site-diary' | 'photo-gallery'
  | 'clients' | 'leads-marketing' | 'employees'
  | 'attendance' | 'leave-management'
  | 'purchase-orders' | 'suppliers'
  | 'equipment' | 'inventory'
  | 'boq-calculator' | 'ai-estimator' | 'reports'
  | 'finance'
  | 'business-intel' | 'customer-intel' | 'opportunity-intel' | 'execution-intel'
  | 'website-builder'
  | 'omniroute' | 'connections' | 'settings'
  | 'services' | 'quotes' | 'invoices' | 'reviews' | 'marketing' | 'posts' | 'digital' | 'ecosystem' | 'wizard' | 'sps' | 'marketplace' | 'admin'

type NavItem = { id: Page; label: string; icon: any; color: string }
type NavSection = { label: string; items: NavItem[] }

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#d4a843' },
    ],
  },
  {
    label: 'Construction',
    items: [
      { id: 'projects', label: 'Projects', icon: Hammer, color: '#059669' },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: '#2563eb' },
      { id: 'house-plans', label: 'House Plans', icon: Home, color: '#7c3aed' },
      { id: 'site-diary', label: 'Site Diary', icon: BookOpen, color: '#d97706' },
      { id: 'photo-gallery', label: 'Photo Gallery', icon: Image, color: '#dc2626' },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'clients', label: 'Clients', icon: Users, color: '#059669' },
      { id: 'leads-marketing', label: 'Leads & Marketing', icon: Megaphone, color: '#d97706' },
      { id: 'employees', label: 'Employees', icon: UserCog, color: '#2563eb' },
      { id: 'services', label: 'Services', icon: Wrench, color: '#059669' },
      { id: 'quotes', label: 'Quotes', icon: MessageCircle, color: '#d97706' },
      { id: 'invoices', label: 'Invoices', icon: FileText, color: '#2563eb' },
      { id: 'reviews', label: 'Reviews', icon: Star, color: '#d4a843' },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, color: '#059669' },
      { id: 'leave-management', label: 'Leave Management', icon: CalendarOff, color: '#dc2626' },
    ],
  },
  {
    label: 'Procurement',
    items: [
      { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, color: '#7c3aed' },
      { id: 'suppliers', label: 'Suppliers', icon: Truck, color: '#d97706' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'equipment', label: 'Equipment', icon: Hammer, color: '#059669' },
      { id: 'inventory', label: 'Inventory', icon: Package, color: '#2563eb' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'boq-calculator', label: 'BOQ Calculator', icon: Calculator, color: '#7c3aed' },
      { id: 'ai-estimator', label: 'AI Estimator', icon: Sparkles, color: '#d4a843' },
      { id: 'reports', label: 'Reports', icon: BarChart3, color: '#059669' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { id: 'finance', label: 'Finance', icon: DollarSign, color: '#059669' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'business-intel', label: 'Business Intelligence', icon: TrendingUp, color: '#2563eb' },
      { id: 'customer-intel', label: 'Customer Intelligence', icon: UserSearch, color: '#7c3aed' },
      { id: 'opportunity-intel', label: 'Opportunity Intel', icon: Target, color: '#d97706' },
      { id: 'execution-intel', label: 'Execution Intel', icon: Zap, color: '#dc2626' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { id: 'website-builder', label: 'Website Builder', icon: Globe, color: '#059669' },
      { id: 'ecosystem', label: 'Digital Ecosystem', icon: Network, color: '#7c3aed' },
      { id: 'marketing', label: 'Marketing', icon: Send, color: '#d97706' },
      { id: 'posts', label: 'Posts', icon: Megaphone, color: '#dc2626' },
      { id: 'sps', label: 'Sales Point System', icon: Flame, color: '#dc2626' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'admin', label: 'Admin Panel', icon: Shield, color: '#dc2626' },
      { id: 'connections', label: 'Platform Connections', icon: Wifi, color: '#2563eb' },
      { id: 'omniroute', label: 'OmniRoute Gateway', icon: Network, color: '#7c3aed' },
      { id: 'marketplace', label: 'Marketplace Intelligence', icon: Puzzle, color: '#d4a843' },
      { id: 'settings', label: 'Settings', icon: Settings, color: '#6b7280' },
    ],
  },
]

const BIZ_SLUG = 'fukulisane-construction'

interface ConstructionSidebarProps {
  page: Page
  setPage: (p: Page) => void
  open: boolean
  setOpen: (v: boolean) => void
}

export default function ConstructionSidebar({ page, setPage, open, setOpen }: ConstructionSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleSection = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const handleNav = (id: Page) => {
    setPage(id)
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden h-11 w-11 rounded-xl bg-white border border-gray-200 shadow flex items-center justify-center">
        {open ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
      </button>

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#d4a843] flex items-center justify-center">
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 leading-tight">Solid Foundation</p>
              <p className="text-[10px] text-gray-400 font-medium">Construction</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-auto py-2 px-2">
          {NAV_SECTIONS.map(section => {
            const isCollapsed = collapsed[section.label]
            const hasActive = section.items.some(i => i.id === page)

            return (
              <div key={section.label} className="mb-1">
                <button onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition">
                  <span>{section.label}</span>
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {section.items.map(item => {
                      const active = page === item.id
                      return (
                        <button key={item.id} onClick={() => handleNav(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition ${active
                            ? 'bg-[#d4a843]/10 text-[#b8941f] border border-[#d4a843]/20'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                          }`}>
                          <item.icon className="h-4 w-4 shrink-0" style={active ? { color: item.color } : {}} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1.5">
          <a href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-600 text-xs font-medium hover:bg-gray-100 transition border border-gray-200">
            <Eye className="h-3.5 w-3.5" /> View Website
          </a>
          <a href={`/?store=${BIZ_SLUG}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition border border-gray-200">
            <ExternalLink className="h-3.5 w-3.5" /> Open in New Tab
          </a>
          <div className="flex items-center gap-2 px-3 py-1 text-[10px] text-gray-400">
            <Phone className="h-3 w-3" /> 081 774 6377
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}

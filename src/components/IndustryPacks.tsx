import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dumbbell, Coffee, ShoppingBag, HardHat, Scissors, Stethoscope,
  Gavel, Truck, GraduationCap, Home, Baby, Dog,
  CheckCircle2, ArrowRight, Layers, Package, Star, Zap
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

interface IndustryPack {
  id: string; name: string; industry: string; icon: any; color: string
  description: string
  features: string[]
  workflows: string[]
  kpis: string[]
  installed: boolean
}

const INDUSTRY_PACKS: IndustryPack[] = [
  {
    id: 'gym-fitness', name: 'Gym & Fitness', industry: 'Fitness', icon: Dumbbell, color: 'from-red-500 to-orange-600',
    description: 'Complete fitness business operating system with member management, class scheduling, trainer optimization, and churn prevention.',
    features: ['Member check-in tracking', 'Class booking system', 'Trainer utilization dashboard', 'Churn prediction AI', 'Membership renewal automation', 'Personal training upsell'],
    workflows: ['Auto-renewal reminders 7 days before expiry', 'Churn risk → personalized retention offer', 'New member → onboarding sequence', 'Low attendance → re-engagement campaign'],
    kpis: ['Member Retention Rate', 'Avg Attendance/Week', 'Revenue per Member', 'Trainer Utilization %', 'Churn Rate', 'LTV:CAC Ratio'],
    installed: true
  },
  {
    id: 'restaurant-cafe', name: 'Restaurant & Café', industry: 'Food & Beverage', icon: Coffee, color: 'from-amber-500 to-orange-600',
    description: 'Restaurant operations AI with menu optimization, inventory tracking, peak-hour management, and delivery coordination.',
    features: ['Menu performance analytics', 'Inventory auto-reorder', 'Peak hour staff scheduling', 'Online ordering management', 'Customer taste profiling', 'Supplier price comparison'],
    workflows: ['Low stock → auto reorder alert', 'New dish launch → social media blitz', 'Slow day → flash sale push notification', 'Delivery delay → customer apology + discount'],
    kpis: ['Food Cost %', 'Table Turnover Rate', 'Avg Order Value', 'Delivery Time', 'Customer Satisfaction', 'Waste %'],
    installed: false
  },
  {
    id: 'retail', name: 'Retail Store', industry: 'Retail', icon: ShoppingBag, color: 'from-purple-500 to-indigo-600',
    description: 'Retail intelligence with stock management, seasonal forecasting, customer segmentation, and visual merchandising AI.',
    features: ['Smart inventory management', 'Seasonal demand forecasting', 'Customer segmentation AI', 'Price optimization engine', 'Visual merchandising suggestions', 'Loyalty program automation'],
    workflows: ['Seasonal trend → pre-stock recommendations', 'Customer segment → personalized promotions', 'Competitor price change → instant alert', 'New arrival → targeted email campaign'],
    kpis: ['Sell-through Rate', 'Inventory Turnover', 'Customer Lifetime Value', 'Basket Size', 'Return Rate', 'Gross Margin'],
    installed: false
  },
  {
    id: 'construction', name: 'Construction', industry: 'Construction', icon: HardHat, color: 'from-yellow-500 to-amber-600',
    description: 'Project management AI for contractors with job tracking, material estimation, crew scheduling, and client communication.',
    features: ['Project timeline tracking', 'Material cost estimation', 'Crew scheduling optimization', 'Client progress reports', 'Subcontractor management', 'Safety compliance tracking'],
    workflows: ['Project milestone → client update', 'Material delay → reschedule crew', 'Weather alert → project adjustment', 'Invoice due → payment reminder'],
    kpis: ['Project Profit Margin', 'On-time Completion %', 'Material Waste %', 'Crew Utilization', 'Client Satisfaction', 'Safety Score'],
    installed: false
  },
  {
    id: 'salon-spa', name: 'Salon & Spa', industry: 'Beauty', icon: Scissors, color: 'from-pink-500 to-rose-600',
    description: 'Beauty business AI with appointment optimization, stylist performance, product recommendations, and loyalty programs.',
    features: ['Smart appointment scheduling', 'Stylist performance dashboard', 'Product cross-sell engine', 'Client style preferences AI', 'Loyalty points automation', 'Walk-in prediction'],
    workflows: ['Appointment gap → fill with promotions', 'Client visit → personalized product suggestion', 'Stylist birthday → team celebration post', 'Inactive client → re-engagement offer'],
    kpis: ['Booking Rate', 'Revenue per Stylist', 'Product Sales %', 'Client Retention', 'Avg Service Value', 'Rebooking Rate'],
    installed: false
  },
  {
    id: 'healthcare', name: 'Healthcare', industry: 'Healthcare', icon: Stethoscope, color: 'from-emerald-500 to-teal-600',
    description: 'Healthcare practice AI with patient management, appointment flow, insurance handling, and health outcome tracking.',
    features: ['Patient flow optimization', 'Insurance verification AI', 'Appointment no-show prediction', 'Health outcome tracking', 'Referral management', 'Prescription refill reminders'],
    workflows: ['No-show risk → reminder call 24h before', 'Lab results ready → patient notification', 'Prescription expiry → refill reminder', 'New patient → welcome packet'],
    kpis: ['Patient Satisfaction', 'No-show Rate', 'Avg Wait Time', 'Revenue per Visit', 'Referral Rate', 'Claim Approval Rate'],
    installed: false
  },
  {
    id: 'legal', name: 'Legal Practice', industry: 'Legal', icon: Gavel, color: 'from-slate-500 to-zinc-600',
    description: 'Legal practice AI with case management, client intake, billing optimization, and deadline tracking.',
    features: ['Case deadline tracking', 'Client intake automation', 'Billable hour optimization', 'Document generation AI', 'Court date management', 'Client communication log'],
    workflows: ['Deadline approaching → team alert', 'New inquiry → intake form sent', 'Billable hour gap → productivity alert', 'Case milestone → client update'],
    kpis: ['Billable Hours/Week', 'Client Satisfaction', 'Case Win Rate', 'Revenue per Attorney', 'Collection Rate', 'Avg Case Duration'],
    installed: false
  },
  {
    id: 'logistics', name: 'Logistics & Delivery', industry: 'Logistics', icon: Truck, color: 'from-blue-500 to-indigo-600',
    description: 'Delivery business AI with route optimization, fleet management, real-time tracking, and customer notifications.',
    features: ['Route optimization AI', 'Fleet maintenance scheduling', 'Real-time delivery tracking', 'Customer ETA notifications', 'Driver performance scoring', 'Fuel cost optimization'],
    workflows: ['Delivery delay → auto customer alert', 'Vehicle due for service → schedule maintenance', 'Peak demand → surge pricing suggestion', 'Driver overtime risk → shift rebalance'],
    kpis: ['On-time Delivery %', 'Cost per Delivery', 'Fleet Utilization', 'Customer Satisfaction', 'Fuel Efficiency', 'Delivery Density'],
    installed: false
  },
]

export default function IndustryPacks({ business, showToast }: Props) {
  const [packs, setPacks] = useState(INDUSTRY_PACKS)
  const [selected, setSelected] = useState<IndustryPack | null>(null)

  const install = (id: string) => {
    setPacks(prev => prev.map(p => p.id === id ? { ...p, installed: true } : p))
    showToast(`${packs.find(p => p.id === id)?.name} pack installed! 🎉`)
  }

  const suggested = business.category?.toLowerCase() || ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="h-6 w-6 text-indigo-600" />
          Industry Packs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tailored workflows, KPIs, and dashboards for your specific industry
        </p>
      </div>

      {selected ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSelected(null)} className="text-muted-foreground">
            ← Back to all packs
          </Button>
          <Card className={`border-2 border-${selected.color.includes('red') ? 'red' : selected.color.includes('amber') ? 'amber' : selected.color.includes('purple') ? 'purple' : selected.color.includes('blue') ? 'blue' : selected.color.includes('pink') ? 'pink' : selected.color.includes('emerald') ? 'emerald' : selected.color.includes('slate') ? 'slate' : 'indigo'}-200`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center`}>
                  <selected.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{selected.industry}</p>
                </div>
                {selected.installed && <Badge className="ml-auto bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-3 w-3 mr-1" /> Installed</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selected.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Features</h3>
                  <div className="space-y-1">
                    {selected.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Auto Workflows</h3>
                  <div className="space-y-1">
                    {selected.workflows.map((w, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Zap className="h-3 w-3 text-amber-500 shrink-0" /> {w}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Key KPIs</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.kpis.map((kpi, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{kpi}</Badge>
                  ))}
                </div>
              </div>

              {!selected.installed && (
                <Button onClick={() => install(selected.id)}
                  className={`w-full mt-4 bg-gradient-to-r ${selected.color} text-white`}>
                  Install {selected.name} Pack
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Suggested */}
          {suggested && (
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-2">✨ Suggested for your business</p>
              <div className="grid md:grid-cols-2 gap-3">
                {packs.filter(p => suggested.includes(p.industry.toLowerCase()) || p.id === 'gym-fitness').slice(0, 2).map(p => (
                  <Card key={p.id} className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 cursor-pointer hover:shadow-md transition" onClick={() => setSelected(p)}>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                          <p.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.features.length} features • {p.workflows.length} workflows</p>
                        </div>
                        {p.installed ? <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">Installed</Badge> : <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Packs */}
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2">All Industry Packs</p>
            <div className="grid md:grid-cols-2 gap-3">
              {packs.map(p => (
                <Card key={p.id} className="cursor-pointer hover:shadow-md transition" onClick={() => setSelected(p)}>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0`}>
                        <p.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{p.name}</p>
                          {p.installed && <Badge className="text-[9px] bg-emerald-100 text-emerald-700">Installed</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          <Badge variant="secondary" className="text-[9px]">{p.features.length} features</Badge>
                          <Badge variant="secondary" className="text-[9px]">{p.workflows.length} workflows</Badge>
                          <Badge variant="secondary" className="text-[9px]">{p.kpis.length} KPIs</Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

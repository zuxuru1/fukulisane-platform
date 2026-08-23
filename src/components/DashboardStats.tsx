import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp, ShoppingCart, Package, Users, DollarSign,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'

interface Stats {
  productCount: number
  todaySales: number
  weekSales: number
  monthSales: number
  totalRevenue: number
  todayRevenue: number
  orderCount: number
}

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  icon: any
  color: string
  subtitle?: string
}

function StatCard({ label, value, change, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(change)}% vs last week
              </div>
            )}
          </div>
          <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardStats({ businessId }: { businessId: string }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/businesses/${businessId}/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [businessId])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-20 mb-2" />
              <div className="h-8 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const formatCurrency = (n: number) => `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Today's Revenue"
        value={formatCurrency(stats.todayRevenue)}
        icon={DollarSign}
        color="from-emerald-500 to-green-600"
        subtitle={`${stats.todaySales} sale(s) today`}
      />
      <StatCard
        label="Month Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={TrendingUp}
        color="from-blue-500 to-indigo-600"
        subtitle={`${stats.monthSales} sales this month`}
      />
      <StatCard
        label="Products"
        value={stats.productCount}
        icon={Package}
        color="from-violet-500 to-purple-600"
      />
      <StatCard
        label="Orders"
        value={stats.orderCount}
        icon={ShoppingCart}
        color="from-orange-500 to-red-600"
        subtitle="All time"
      />
    </div>
  )
}

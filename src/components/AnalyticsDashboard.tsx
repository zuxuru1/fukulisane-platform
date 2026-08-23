import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  Calendar, Download, Filter, ArrowUpRight, ArrowDownRight,
  Activity, Target, Zap, Clock, UserCheck, UserX
} from 'lucide-react'

interface Business {
  id: string
  name: string
}

interface AnalyticsDashboardProps {
  business: Business
  showToast: (msg: string, type?: 'success' | 'error') => void
}

const REVENUE_DATA = [
  { month: 'Jan', revenue: 245000, members: 132 },
  { month: 'Feb', revenue: 268000, members: 138 },
  { month: 'Mar', revenue: 284000, members: 145 },
  { month: 'Apr', revenue: 276000, members: 142 },
  { month: 'May', revenue: 298000, members: 152 },
  { month: 'Jun', revenue: 312000, members: 158 },
]

const MEMBERSHIP_DATA = [
  { type: 'Standard', count: 85, percentage: 54, revenue: 127500 },
  { type: 'Premium', count: 42, percentage: 27, revenue: 126000 },
  { type: 'VIP', count: 18, percentage: 11, revenue: 90000 },
  { type: 'Student', count: 11, percentage: 7, revenue: 16500 },
]

const PEAK_HOURS = [
  { hour: '06:00', traffic: 45 },
  { hour: '07:00', traffic: 78 },
  { hour: '08:00', traffic: 62 },
  { hour: '09:00', traffic: 35 },
  { hour: '10:00', traffic: 28 },
  { hour: '11:00', traffic: 32 },
  { hour: '12:00', traffic: 55 },
  { hour: '13:00', traffic: 48 },
  { hour: '14:00', traffic: 30 },
  { hour: '15:00', traffic: 35 },
  { hour: '16:00', traffic: 52 },
  { hour: '17:00', traffic: 85 },
  { hour: '18:00', traffic: 92 },
  { hour: '19:00', traffic: 72 },
  { hour: '20:00', traffic: 45 },
]

const CLASS_POPULARITY = [
  { name: 'HIIT', bookings: 245, trend: 12 },
  { name: 'Yoga', bookings: 198, trend: 8 },
  { name: 'Spin', bookings: 176, trend: -3 },
  { name: 'CrossFit', bookings: 154, trend: 15 },
  { name: 'Pilates', bookings: 132, trend: 5 },
  { name: 'Boxing', bookings: 98, trend: 22 },
]

const TOP_TRAINERS = [
  { name: 'James M.', clients: 28, rating: 4.9, revenue: 42000 },
  { name: 'Sarah K.', clients: 24, rating: 4.8, revenue: 36000 },
  { name: 'Mike T.', clients: 22, rating: 4.7, revenue: 33000 },
  { name: 'Lisa P.', clients: 19, rating: 4.9, revenue: 28500 },
]

function MetricCard({ icon: Icon, title, value, change, changeLabel, color }: {
  icon: typeof TrendingUp
  title: string
  value: string
  change: number
  changeLabel: string
  color: string
}) {
  const isPositive = change >= 0
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function BarChartSimple({ data, maxHeight = 120 }: { data: { label: string; value: number }[]; maxHeight?: number }) {
  const maxValue = Math.max(...data.map(d => d.value))
  return (
    <div className="flex items-end gap-2" style={{ height: maxHeight }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
            style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: 4 }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard({ business, showToast }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const totalRevenue = REVENUE_DATA[REVENUE_DATA.length - 1].revenue
  const totalMembers = REVENUE_DATA[REVENUE_DATA.length - 1].members
  const avgRevenuePerMember = Math.round(totalRevenue / totalMembers)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Business intelligence and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          title="Total Revenue"
          value={`R ${(totalRevenue / 1000).toFixed(0)}K`}
          change={12}
          changeLabel="vs last month"
          color="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          icon={Users}
          title="Active Members"
          value={totalMembers.toString()}
          change={4.2}
          changeLabel="vs last month"
          color="bg-blue-100 text-blue-600"
        />
        <MetricCard
          icon={Target}
          title="Avg Revenue/Member"
          value={`R ${avgRevenuePerMember.toLocaleString()}`}
          change={7.5}
          changeLabel="vs last month"
          color="bg-purple-100 text-purple-600"
        />
        <MetricCard
          icon={Activity}
          title="Retention Rate"
          value="87%"
          change={-2}
          changeLabel="vs last month"
          color="bg-amber-100 text-amber-600"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-1.5">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-1.5">
            <Activity className="h-4 w-4" />
            Operations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Revenue Trend</span>
                  <Badge variant="outline">+12% MTD</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {REVENUE_DATA.map((item) => (
                    <div key={item.month} className="flex items-center gap-4">
                      <span className="w-8 text-sm text-muted-foreground">{item.month}</span>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          style={{ width: `${(item.revenue / 350000) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 text-sm font-medium text-right">R {(item.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MEMBERSHIP_DATA.map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm text-muted-foreground">{item.count} members</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={item.percentage} className="h-2 flex-1" />
                        <span className="w-12 text-sm text-right">{item.percentage}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">R {item.revenue.toLocaleString()} revenue</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-40">
                {PEAK_HOURS.map((item) => (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${item.traffic}%`,
                        backgroundColor: item.traffic > 70 ? '#10b981' : item.traffic > 40 ? '#3b82f6' : '#94a3b8'
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{item.hour.slice(0, 2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-emerald-500 rounded" />
                  <span className="text-xs text-muted-foreground">Peak (&gt;70)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-blue-500 rounded" />
                  <span className="text-xs text-muted-foreground">Moderate (40-70)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-slate-400 rounded" />
                  <span className="text-xs text-muted-foreground">Low (&lt;40)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">140</p>
                    <p className="text-xs text-muted-foreground">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.2</p>
                    <p className="text-xs text-muted-foreground">Avg Visits/Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <UserX className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">At Risk of Churn</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Class Popularity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CLASS_POPULARITY.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="w-20 text-sm font-medium">{item.name}</span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                        style={{ width: `${(item.bookings / 250) * 100}%` }}
                      />
                    </div>
                    <span className="w-16 text-sm text-right">{item.bookings}</span>
                    <span className={`w-12 text-sm text-right ${item.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.trend >= 0 ? '+' : ''}{item.trend}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { source: 'Memberships', amount: 359500, percentage: 68 },
                    { source: 'Personal Training', amount: 85000, percentage: 16 },
                    { source: 'Classes', amount: 42000, percentage: 8 },
                    { source: 'Merchandise', amount: 21000, percentage: 4 },
                    { source: 'Other', amount: 21500, percentage: 4 },
                  ].map((item) => (
                    <div key={item.source} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.source}</span>
                        <span className="text-sm font-medium">R {item.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-xl font-bold">R 312,000</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Month</p>
                      <p className="text-xl font-bold">R 284,000</p>
                    </div>
                    <span className="text-sm text-emerald-600 font-medium">+9.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TOP_TRAINERS.map((trainer, i) => (
                  <div key={trainer.name} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{trainer.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="text-sm">{trainer.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{trainer.clients} clients</span>
                        <span>R {trainer.revenue.toLocaleString()} revenue</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Equipment Uptime</p>
                  <p className="text-2xl font-bold text-emerald-600">96.5%</p>
                  <Progress value={96.5} className="h-2 mt-2" />
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Class Fill Rate</p>
                  <p className="text-2xl font-bold text-blue-600">78%</p>
                  <Progress value={78} className="h-2 mt-2" />
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Staff Utilization</p>
                  <p className="text-2xl font-bold text-purple-600">82%</p>
                  <Progress value={82} className="h-2 mt-2" />
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Member Satisfaction</p>
                  <p className="text-2xl font-bold text-amber-600">4.6/5</p>
                  <Progress value={92} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

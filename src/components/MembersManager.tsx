import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Users, UserPlus, Search, Filter, Download, Plus,
  Calendar, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Clock, Phone, Mail, MoreVertical,
  ChevronRight, Star, Target, Activity
} from 'lucide-react'

interface Business {
  id: string
  name: string
}

interface MembersManagerProps {
  business: Business
  showToast: (msg: string, type?: 'success' | 'error') => void
}

interface Member {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  membershipType: 'standard' | 'premium' | 'vip' | 'student'
  status: 'active' | 'inactive' | 'frozen' | 'cancelled'
  joinDate: string
  lastVisit?: string
  attendanceCount: number
  totalSpent: number
  healthScore: number
  churnRisk: number
  trainer?: string
}

const MOCK_MEMBERS: Member[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@email.com', phone: '+27 82 555 0101', membershipType: 'vip', status: 'active', joinDate: '2024-01-15', lastVisit: 'Today', attendanceCount: 156, totalSpent: 45000, healthScore: 92, churnRisk: 5, trainer: 'James M.' },
  { id: '2', firstName: 'Mike', lastName: 'Chen', email: 'mike@email.com', phone: '+27 83 555 0202', membershipType: 'premium', status: 'active', joinDate: '2024-03-20', lastVisit: 'Yesterday', attendanceCount: 89, totalSpent: 28000, healthScore: 78, churnRisk: 15, trainer: 'Sarah K.' },
  { id: '3', firstName: 'Emma', lastName: 'Williams', phone: '+27 84 555 0303', membershipType: 'standard', status: 'active', joinDate: '2024-06-10', lastVisit: '2 days ago', attendanceCount: 34, totalSpent: 8500, healthScore: 65, churnRisk: 35, trainer: 'Mike T.' },
  { id: '4', firstName: 'David', lastName: 'Brown', email: 'david@email.com', membershipType: 'vip', status: 'active', joinDate: '2023-08-05', lastVisit: 'Today', attendanceCount: 245, totalSpent: 72000, healthScore: 95, churnRisk: 2, trainer: 'James M.' },
  { id: '5', firstName: 'Lisa', lastName: 'Taylor', email: 'lisa@email.com', phone: '+27 85 555 0505', membershipType: 'student', status: 'inactive', joinDate: '2024-09-01', lastVisit: '3 weeks ago', attendanceCount: 12, totalSpent: 3000, healthScore: 30, churnRisk: 75 },
  { id: '6', firstName: 'James', lastName: 'Wilson', membershipType: 'premium', status: 'frozen', joinDate: '2024-02-14', lastVisit: '1 month ago', attendanceCount: 67, totalSpent: 21000, healthScore: 45, churnRisk: 55 },
  { id: '7', firstName: 'Sophie', lastName: 'Anderson', email: 'sophie@email.com', membershipType: 'standard', status: 'active', joinDate: '2024-07-20', lastVisit: 'Today', attendanceCount: 28, totalSpent: 7000, healthScore: 72, churnRisk: 20, trainer: 'Lisa P.' },
  { id: '8', firstName: 'Tom', lastName: 'Harris', phone: '+27 86 555 0808', membershipType: 'standard', status: 'cancelled', joinDate: '2024-04-10', lastVisit: '2 months ago', attendanceCount: 45, totalSpent: 11250, healthScore: 0, churnRisk: 100 },
]

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-amber-100 text-amber-700',
  frozen: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
}

const MEMBERSHIP_COLORS = {
  vip: 'bg-purple-100 text-purple-700',
  premium: 'bg-amber-100 text-amber-700',
  standard: 'bg-gray-100 text-gray-700',
  student: 'bg-blue-100 text-blue-700',
}

function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {member.firstName[0]}{member.lastName[0]}
            </div>
            <div>
              <h4 className="font-semibold">{member.firstName} {member.lastName}</h4>
              <div className="flex items-center gap-2">
                <Badge className={MEMBERSHIP_COLORS[member.membershipType]}>
                  {member.membershipType}
                </Badge>
                <Badge className={STATUS_COLORS[member.status]}>
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Health Score</p>
            <div className="flex items-center gap-2">
              <Progress value={member.healthScore} className="h-2 flex-1" />
              <span className="text-sm font-medium">{member.healthScore}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Churn Risk</p>
            <div className="flex items-center gap-2">
              <Progress value={member.churnRisk} className="h-2 flex-1" />
              <span className={`text-sm font-medium ${member.churnRisk > 50 ? 'text-red-600' : member.churnRisk > 25 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {member.churnRisk}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {member.attendanceCount} visits
          </span>
          <span>R {member.totalSpent.toLocaleString()}</span>
        </div>

        {member.trainer && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Trainer: {member.trainer}
            </span>
          </div>
        )}

        {member.lastVisit && (
          <div className="mt-2 text-xs text-muted-foreground">
            Last visit: {member.lastVisit}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MembersManager({ business, showToast }: MembersManagerProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = MOCK_MEMBERS.filter(m => {
    const matchesSearch = `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || m.status === activeTab
    return matchesSearch && matchesTab
  })

  const stats = {
    total: MOCK_MEMBERS.length,
    active: MOCK_MEMBERS.filter(m => m.status === 'active').length,
    atRisk: MOCK_MEMBERS.filter(m => m.churnRisk > 50).length,
    totalRevenue: MOCK_MEMBERS.reduce((sum, m) => sum + m.totalSpent, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Members
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your gym members and track engagement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-1">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.atRisk}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">R {(stats.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Total LTV</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({MOCK_MEMBERS.filter(m => m.status === 'inactive').length})</TabsTrigger>
          <TabsTrigger value="frozen">Frozen ({MOCK_MEMBERS.filter(m => m.status === 'frozen').length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({MOCK_MEMBERS.filter(m => m.status === 'cancelled').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
          {filteredMembers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No members found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

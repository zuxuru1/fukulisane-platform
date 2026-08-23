import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Users, UserPlus, Search, Filter, Star, Clock,
  Phone, Mail, MoreVertical, ChevronRight, Award,
  TrendingUp, Calendar, DollarSign, Target, Activity
} from 'lucide-react'

interface Business {
  id: string
  name: string
}

interface StaffTrainersProps {
  business: Business
  showToast: (msg: string, type?: 'success' | 'error') => void
}

interface Trainer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  specialization: string
  certification?: string
  status: 'active' | 'inactive' | 'on_leave'
  hourlyRate: number
  utilization: number
  rating: number
  clientCount: number
  totalRevenue: number
  joinDate: string
}

interface Staff {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  role: string
  department: string
  status: 'active' | 'inactive'
  shift: string
  hourlyRate: number
  joinDate: string
}

const MOCK_TRAINERS: Trainer[] = [
  { id: '1', firstName: 'James', lastName: 'Mokoena', email: 'james@fukulisane.com', phone: '+27 82 111 1111', specialization: 'Strength & Conditioning', certification: 'NSCA-CSCS', status: 'active', hourlyRate: 350, utilization: 85, rating: 4.9, clientCount: 28, totalRevenue: 42000, joinDate: '2022-03-15' },
  { id: '2', firstName: 'Sarah', lastName: 'Khumalo', email: 'sarah@fukulisane.com', phone: '+27 83 222 2222', specialization: 'Yoga & Pilates', certification: 'RYT-500', status: 'active', hourlyRate: 300, utilization: 78, rating: 4.8, clientCount: 24, totalRevenue: 36000, joinDate: '2022-06-01' },
  { id: '3', firstName: 'Mike', lastName: 'Thompson', email: 'mike@fukulisane.com', specialization: 'CrossFit', certification: 'CF-L3', status: 'active', hourlyRate: 320, utilization: 72, rating: 4.7, clientCount: 22, totalRevenue: 33000, joinDate: '2023-01-10' },
  { id: '4', firstName: 'Lisa', lastName: 'Petersen', phone: '+27 84 444 4444', specialization: 'HIIT & Cardio', certification: 'ACE-CPT', status: 'active', hourlyRate: 280, utilization: 68, rating: 4.9, clientCount: 19, totalRevenue: 28500, joinDate: '2023-05-20' },
  { id: '5', firstName: 'David', lastName: 'Nkosi', specialization: 'Boxing & MMA', certification: 'ISSA-CPT', status: 'on_leave', hourlyRate: 300, utilization: 0, rating: 4.6, clientCount: 15, totalRevenue: 18000, joinDate: '2023-09-01' },
]

const MOCK_STAFF: Staff[] = [
  { id: '1', firstName: 'Thabo', lastName: 'Molefe', email: 'thabo@fukulisane.com', phone: '+27 81 555 0101', role: 'Front Desk Manager', department: 'Operations', status: 'active', shift: 'Morning', hourlyRate: 85, joinDate: '2022-01-10' },
  { id: '2', firstName: 'Nomsa', lastName: 'Dlamini', phone: '+27 82 555 0202', role: 'Receptionist', department: 'Operations', status: 'active', shift: 'Afternoon', hourlyRate: 65, joinDate: '2023-02-15' },
  { id: '3', firstName: 'Sipho', lastName: 'Zulu', email: 'sipho@fukulisane.com', role: 'Maintenance', department: 'Facilities', status: 'active', shift: 'Morning', hourlyRate: 70, joinDate: '2022-08-20' },
  { id: '4', firstName: 'Lerato', lastName: 'Mokoena', role: 'Cleaning Staff', department: 'Facilities', status: 'active', shift: 'Evening', hourlyRate: 55, joinDate: '2023-06-01' },
  { id: '5', firstName: 'Pieter', lastName: 'van der Merwe', phone: '+27 83 555 0505', role: 'Marketing Manager', department: 'Marketing', status: 'active', shift: 'Day', hourlyRate: 120, joinDate: '2022-11-10' },
]

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-700',
  on_leave: 'bg-amber-100 text-amber-700',
}

function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {trainer.firstName[0]}{trainer.lastName[0]}
            </div>
            <div>
              <h4 className="font-semibold">{trainer.firstName} {trainer.lastName}</h4>
              <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={STATUS_COLORS[trainer.status]}>
                  {trainer.status.replace('_', ' ')}
                </Badge>
                {trainer.certification && (
                  <Badge variant="outline" className="gap-1">
                    <Award className="h-3 w-3" />
                    {trainer.certification}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Utilization</p>
            <div className="flex items-center gap-2">
              <Progress value={trainer.utilization} className="h-2 flex-1" />
              <span className="text-sm font-medium">{trainer.utilization}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rating</p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium">{trainer.rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold">{trainer.clientCount}</p>
            <p className="text-xs text-muted-foreground">Clients</p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold">R {trainer.hourlyRate}</p>
            <p className="text-xs text-muted-foreground">Per Hour</p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold">R {(trainer.totalRevenue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          {trainer.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {trainer.email}
            </span>
          )}
          {trainer.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {trainer.phone}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StaffCard({ staff }: { staff: Staff }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
              {staff.firstName[0]}{staff.lastName[0]}
            </div>
            <div>
              <h4 className="font-semibold">{staff.firstName} {staff.lastName}</h4>
              <p className="text-sm text-muted-foreground">{staff.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={STATUS_COLORS[staff.status]}>
                  {staff.status}
                </Badge>
                <Badge variant="outline">{staff.department}</Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-medium">{staff.shift}</p>
            <p className="text-xs text-muted-foreground">Shift</p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-medium">R {staff.hourlyRate}</p>
            <p className="text-xs text-muted-foreground">Per Hour</p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-medium">{new Date(staff.joinDate).getFullYear()}</p>
            <p className="text-xs text-muted-foreground">Joined</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          {staff.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {staff.email}
            </span>
          )}
          {staff.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {staff.phone}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function StaffTrainers({ business, showToast }: StaffTrainersProps) {
  const [activeTab, setActiveTab] = useState('trainers')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTrainers = MOCK_TRAINERS.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStaff = MOCK_STAFF.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const trainerStats = {
    total: MOCK_TRAINERS.length,
    active: MOCK_TRAINERS.filter(t => t.status === 'active').length,
    avgUtilization: Math.round(MOCK_TRAINERS.reduce((sum, t) => sum + t.utilization, 0) / MOCK_TRAINERS.length),
    totalRevenue: MOCK_TRAINERS.reduce((sum, t) => sum + t.totalRevenue, 0),
  }

  const staffStats = {
    total: MOCK_STAFF.length,
    active: MOCK_STAFF.filter(s => s.status === 'active').length,
    departments: [...new Set(MOCK_STAFF.map(s => s.department))].length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            People
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your trainers and staff
          </p>
        </div>
        <Button size="sm" className="gap-1">
          <UserPlus className="h-4 w-4" />
          Add {activeTab === 'trainers' ? 'Trainer' : 'Staff'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trainerStats.total}</p>
                <p className="text-xs text-muted-foreground">Trainers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{staffStats.total}</p>
                <p className="text-xs text-muted-foreground">Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trainerStats.avgUtilization}%</p>
                <p className="text-xs text-muted-foreground">Avg Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">R {(trainerStats.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Trainer Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainers or staff..."
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
          <TabsTrigger value="trainers" className="gap-1.5">
            <Award className="h-4 w-4" />
            Trainers ({trainerStats.total})
          </TabsTrigger>
          <TabsTrigger value="staff" className="gap-1.5">
            <Users className="h-4 w-4" />
            Staff ({staffStats.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrainers.map(trainer => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map(staff => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

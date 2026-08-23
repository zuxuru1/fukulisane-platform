import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Search, MapPin, Users, Target, TrendingUp, Globe,
  Instagram, Facebook, Twitter, Youtube, Linkedin,
  ChevronRight, Filter, Download, RefreshCw, Plus,
  Eye, Star, Clock, Phone, Mail, ExternalLink
} from 'lucide-react'

interface Business {
  id: string
  name: string
}

interface CustomerProfile {
  id: string
  name: string
  source: string
  socialPlatform?: string
  socialHandle?: string
  location: string
  interests: string[]
  engagementScore: number
  lifetimeValue: number
  lastInteraction: string
  status: 'active' | 'prospect' | 'inactive'
  tags: string[]
}

interface Competitor {
  id: string
  name: string
  location: string
  rating: number
  reviews: number
  socialFollowing: number
  threats: string[]
  opportunities: string[]
}

interface SocialMention {
  id: string
  platform: string
  content: string
  sentiment: 'positive' | 'neutral' | 'negative'
  author: string
  timestamp: string
  reach: number
}

interface DiscoveryEngineProps {
  business: Business
  showToast: (msg: string, type?: 'success' | 'error') => void
}

const MOCK_CUSTOMERS: CustomerProfile[] = [
  { id: '1', name: 'Sarah Johnson', source: 'Instagram', socialPlatform: 'Instagram', socialHandle: '@sarahfit', location: 'Sandton', interests: ['Yoga', 'Weight Training', 'Nutrition'], engagementScore: 85, lifetimeValue: 12500, lastInteraction: '2 hours ago', status: 'active', tags: ['VIP', 'Fitness Enthusiast'] },
  { id: '2', name: 'Mike Chen', source: 'Facebook', socialPlatform: 'Facebook', location: 'Rosebank', interests: ['CrossFit', 'HIIT'], engagementScore: 72, lifetimeValue: 8200, lastInteraction: '1 day ago', status: 'active', tags: ['Regular'] },
  { id: '3', name: 'Emma Williams', source: 'Walk-in', location: 'Bryanston', interests: ['Swimming', 'Cardio'], engagementScore: 45, lifetimeValue: 3400, lastInteraction: '1 week ago', status: 'prospect', tags: ['New Lead'] },
  { id: '4', name: 'David Brown', source: 'Referral', location: 'Fourways', interests: ['Bodybuilding', 'Supplements'], engagementScore: 90, lifetimeValue: 18900, lastInteraction: '3 hours ago', status: 'active', tags: ['VIP', 'Long-term'] },
  { id: '5', name: 'Lisa Taylor', source: 'Google Ads', socialPlatform: 'Instagram', socialHandle: '@lisat', location: 'Midrand', interests: ['Pilates', 'Wellness'], engagementScore: 35, lifetimeValue: 1200, lastInteraction: '2 weeks ago', status: 'inactive', tags: ['At Risk'] },
]

const MOCK_COMPETITORS: Competitor[] = [
  { id: '1', name: 'FitZone Gym', location: 'Sandton', rating: 4.2, reviews: 234, socialFollowing: 12500, threats: ['Aggressive pricing', 'New equipment'], opportunities: ['Poor customer service', 'Limited classes'] },
  { id: '2', name: 'PowerHouse Fitness', location: 'Rosebank', rating: 4.5, reviews: 189, socialFollowing: 8900, threats: ['Strong brand', 'Celebrity endorsements'], opportunities: ['No nutrition focus', 'Weak community'] },
  { id: '3', name: 'BodyWorks', location: 'Midrand', rating: 3.9, reviews: 156, socialFollowing: 5600, threats: ['Close proximity', 'Low prices'], opportunities: ['Outdated facilities', 'No PT services'] },
]

const MOCK_SOCIAL_MENTIONS: SocialMention[] = [
  { id: '1', platform: 'Instagram', content: 'Amazing session at @FukulisaneGym! The trainers are incredible 💪 #FitnessGoals', sentiment: 'positive', author: '@fitnessfan', timestamp: '5 min ago', reach: 1250 },
  { id: '2', platform: 'Facebook', content: 'Great community vibes at the gym. Love the group classes!', sentiment: 'positive', author: 'John D.', timestamp: '1 hour ago', reach: 890 },
  { id: '3', platform: 'Twitter', content: 'Wish the parking was better at Fukulisane Gym', sentiment: 'negative', author: '@localuser', timestamp: '3 hours ago', reach: 340 },
  { id: '4', platform: 'Instagram', content: 'Post-workout smoothie game is strong 🥤', sentiment: 'positive', author: '@healthyeats', timestamp: '5 hours ago', reach: 2100 },
]

const PLATFORM_ICONS: Record<string, typeof Instagram> = {
  Instagram, Facebook, Twitter, Youtube, Linkedin
}

const SENTIMENT_COLORS = {
  positive: 'bg-emerald-100 text-emerald-700',
  neutral: 'bg-gray-100 text-gray-700',
  negative: 'bg-red-100 text-red-700',
}

function CustomerCard({ customer }: { customer: CustomerProfile }) {
  const SocialIcon = customer.socialPlatform ? PLATFORM_ICONS[customer.socialPlatform] : null
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold">{customer.name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {customer.location}
              {SocialIcon && (
                <span className="flex items-center gap-1">
                  <SocialIcon className="h-3 w-3" />
                  {customer.socialHandle || customer.socialPlatform}
                </span>
              )}
            </div>
          </div>
          <Badge variant={customer.status === 'active' ? 'default' : customer.status === 'prospect' ? 'secondary' : 'outline'}>
            {customer.status}
          </Badge>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Engagement</span>
            <span className="font-medium">{customer.engagementScore}%</span>
          </div>
          <Progress value={customer.engagementScore} className="h-1.5" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {customer.interests.map(interest => (
            <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">LTV: R {customer.lifetimeValue.toLocaleString()}</span>
          <span className="text-muted-foreground">{customer.lastInteraction}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{competitor.name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              {competitor.location}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold">{competitor.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">{competitor.reviews} reviews</span>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-red-600 mb-1">Threats</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {competitor.threats.map((t, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-red-500">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-600 mb-1">Opportunities</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {competitor.opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-emerald-500">•</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          <Globe className="h-3 w-3 inline mr-1" />
          {competitor.socialFollowing.toLocaleString()} social followers
        </div>
      </CardContent>
    </Card>
  )
}

export default function DiscoveryEngine({ business, showToast }: DiscoveryEngineProps) {
  const [activeTab, setActiveTab] = useState('customers')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalCustomers: MOCK_CUSTOMERS.length,
    activeCustomers: MOCK_CUSTOMERS.filter(c => c.status === 'active').length,
    totalLTV: MOCK_CUSTOMERS.reduce((sum, c) => sum + c.lifetimeValue, 0),
    avgEngagement: Math.round(MOCK_CUSTOMERS.reduce((sum, c) => sum + c.engagementScore, 0) / MOCK_CUSTOMERS.length),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            Discovery Engine
          </h2>
          <p className="text-muted-foreground mt-1">
            Customer intelligence, competitor analysis, and social listening
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Profile
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
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                <p className="text-xs text-muted-foreground">Total Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                <p className="text-xs text-muted-foreground">Active</p>
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
                <p className="text-2xl font-bold">R {(stats.totalLTV / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Total LTV</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgEngagement}%</p>
                <p className="text-xs text-muted-foreground">Avg Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="customers" className="gap-1.5">
            <Users className="h-4 w-4" />
            Customer Profiles
          </TabsTrigger>
          <TabsTrigger value="competitors" className="gap-1.5">
            <Target className="h-4 w-4" />
            Competitors
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5">
            <Globe className="h-4 w-4" />
            Social Listening
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            Location Intel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or location..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_COMPETITORS.map(competitor => (
              <CompetitorCard key={competitor.id} competitor={competitor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SOCIAL_MENTIONS.map(mention => (
              <Card key={mention.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {PLATFORM_ICONS[mention.platform] && (
                        <span className="text-muted-foreground">{PLATFORM_ICONS[mention.platform]({ className: 'h-4 w-4' })}</span>
                      )}
                      <span className="font-medium text-sm">{mention.author}</span>
                    </div>
                    <Badge className={SENTIMENT_COLORS[mention.sentiment]}>
                      {mention.sentiment}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm">{mention.content}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {mention.timestamp}
                    </span>
                    <span>{mention.reach.toLocaleString()} reach</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Primary Area</h4>
                  <p className="text-2xl font-bold">Sandton</p>
                  <p className="text-sm text-muted-foreground">45% of members</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Growth Area</h4>
                  <p className="text-2xl font-bold">Midrand</p>
                  <p className="text-sm text-muted-foreground">+12% new members</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Opportunity Zone</h4>
                  <p className="text-2xl font-bold">Fourways</p>
                  <p className="text-sm text-muted-foreground">Low competition</p>
                </div>
              </div>
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Member Distribution</h4>
                <div className="space-y-2">
                  {[
                    { area: 'Sandton', percentage: 45 },
                    { area: 'Rosebank', percentage: 22 },
                    { area: 'Bryanston', percentage: 15 },
                    { area: 'Midrand', percentage: 10 },
                    { area: 'Other', percentage: 8 },
                  ].map(item => (
                    <div key={item.area} className="flex items-center gap-3">
                      <span className="w-24 text-sm">{item.area}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

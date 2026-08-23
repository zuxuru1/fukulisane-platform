import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Activity, ShoppingCart, TrendingUp, Users, Bell,
  AlertTriangle, CheckCircle2, Zap, Clock
} from 'lucide-react'

interface EngineEvent {
  id: string
  engine: string
  eventType: string
  title: string
  description: string | null
  impactScore: number
  createdAt: string
}

const engineColors: Record<string, string> = {
  sales: 'text-emerald-600 bg-emerald-50',
  members: 'text-blue-600 bg-blue-50',
  discovery: 'text-cyan-600 bg-cyan-50',
  marketing: 'text-orange-600 bg-orange-50',
  people: 'text-violet-600 bg-violet-50',
  analytics: 'text-teal-600 bg-teal-50',
  brain: 'text-purple-600 bg-purple-50',
  system: 'text-gray-600 bg-gray-50',
}

const eventIcons: Record<string, any> = {
  success: CheckCircle2,
  info: Activity,
  warning: AlertTriangle,
  critical: AlertTriangle,
}

export default function ActivityFeed({ businessId }: { businessId: string }) {
  const [events, setEvents] = useState<EngineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/businesses/${businessId}/events?limit=20`)
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [businessId])

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="h-5 bg-muted rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-muted rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-emerald-500" />
        <h3 className="font-bold">Activity Feed</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Live
        </Badge>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        )}
        {events.map(event => {
          const Icon = eventIcons[event.eventType] || Activity
          const colorClass = engineColors[event.engine] || 'text-gray-600 bg-gray-50'
          return (
            <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  {event.impactScore >= 7 && <Badge className="text-[10px] px-1 py-0" variant="destructive">High Impact</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{event.engine} engine · {formatTime(event.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Lightbulb } from 'lucide-react'

export default function AIBrain() {
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    setInsights([
      'Your top product sold 3x more this week',
      'Customer engagement peaks at 6pm on weekdays',
      'Consider running a promotion on slow-moving inventory',
    ])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" /> AI Brain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
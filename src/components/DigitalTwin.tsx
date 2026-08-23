import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles, TrendingUp, TrendingDown, AlertTriangle,
  DollarSign, Users, Clock, Target, Brain,
  ChevronRight, ArrowUpRight, ArrowDownRight, Minus,
  BarChart3, Zap, Shield, Lightbulb, Send
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

interface Simulation {
  id: string; question: string
  revenueImpact: number; costImpact: number; profitChange: number
  cashflowImpact: number; riskLevel: 'low' | 'medium' | 'high'
  confidenceScore: number
  timeline: string; keyRisks: string[]
  recommendation: string
}

const EXAMPLE_QUESTIONS = [
  'What happens if I hire two employees?',
  'Should I open another branch?',
  'What if I increase all prices by 10%?',
  'Should I start a delivery service?',
  'What if I spend R5000 on marketing?',
  'Should I hire a social media manager?',
]

const SIMULATIONS: Record<string, Simulation> = {
  'hire-employees': {
    id: 'hire-employees', question: 'What happens if I hire 2 employees?',
    revenueImpact: 8500, costImpact: 16000, profitChange: -7500,
    cashflowImpact: -12000, riskLevel: 'medium',
    confidenceScore: 72, timeline: '3-6 months to ROI',
    keyRisks: ['Monthly payroll increases by R16,000', 'Revenue may not increase immediately', 'Training costs for first 2 months'],
    recommendation: 'Hire 1 employee first, measure the revenue impact over 3 months, then decide on the second hire.'
  },
  'open-branch': {
    id: 'open-branch', question: 'Should I open another branch?',
    revenueImpact: 45000, costImpact: 38000, profitChange: 7000,
    cashflowImpact: -25000, riskLevel: 'high',
    confidenceScore: 58, timeline: '6-12 months to break even',
    keyRisks: ['R150K+ setup costs', 'Management attention split', 'Location risk — wrong area = lost investment'],
    recommendation: 'Not yet. Build 6 more months of proven revenue, then re-evaluate with real data.'
  },
  'increase-prices': {
    id: 'increase-prices', question: 'What if I increase all prices by 10%?',
    revenueImpact: 4200, costImpact: 0, profitChange: 4200,
    cashflowImpact: 4200, riskLevel: 'medium',
    confidenceScore: 65, timeline: 'Immediate impact',
    keyRisks: ['5-8% customer loss possible', 'Competitor undercut risk', 'Negative reviews from price-sensitive customers'],
    recommendation: 'Increase popular items by 8% first (lower risk), keep staples at current price.'
  },
}

export default function DigitalTwin({ business, showToast }: Props) {
  const [question, setQuestion] = useState('')
  const [simulating, setSimulating] = useState(false)
  const [currentSim, setCurrentSim] = useState<Simulation | null>(null)

  const runSimulation = async (q?: string) => {
    const query = q || question
    if (!query.trim()) return
    setSimulating(true)
    setCurrentSim(null)

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 2000))

    // Match to a simulation
    const lower = query.toLowerCase()
    let sim: Simulation
    if (lower.includes('hire') || lower.includes('employee')) {
      sim = SIMULATIONS['hire-employees']
    } else if (lower.includes('branch') || lower.includes('location') || lower.includes('open')) {
      sim = SIMULATIONS['open-branch']
    } else if (lower.includes('price') || lower.includes('increase') || lower.includes('raise')) {
      sim = SIMULATIONS['increase-prices']
    } else {
      // Default simulation for any question
      sim = {
        id: 'custom', question: query,
        revenueImpact: Math.round(Math.random() * 20000),
        costImpact: Math.round(Math.random() * 15000),
        profitChange: Math.round((Math.random() - 0.3) * 10000),
        cashflowImpact: Math.round((Math.random() - 0.4) * 12000),
        riskLevel: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
        confidenceScore: Math.round(55 + Math.random() * 35),
        timeline: ['1-3 months', '3-6 months', '6-12 months'][Math.floor(Math.random() * 3)],
        keyRisks: ['Market conditions may change', 'Requires careful execution', 'Customer response uncertain'],
        recommendation: 'Start small, measure results over 3 months, then scale what works.'
      }
    }

    setCurrentSim(sim)
    setSimulating(false)
    showToast('Simulation complete')
  }

  const riskColors = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-600" />
          Business Digital Twin
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ask "what if" questions — AI models the impact on your business
        </p>
      </div>

      {/* Current Business Snapshot */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-indigo-600" />
            <p className="text-sm font-bold">Your Digital Twin</p>
            <Badge className="bg-indigo-100 text-indigo-700 text-[9px]">LIVE MODEL</Badge>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-lg bg-white/60">
              <p className="text-lg font-bold">R42K</p>
              <p className="text-[10px] text-muted-foreground">Monthly Revenue</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/60">
              <p className="text-lg font-bold">R28K</p>
              <p className="text-[10px] text-muted-foreground">Monthly Costs</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/60">
              <p className="text-lg font-bold text-emerald-600">R14K</p>
              <p className="text-[10px] text-muted-foreground">Profit</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/60">
              <p className="text-lg font-bold">156</p>
              <p className="text-[10px] text-muted-foreground">Active Customers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Input */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex gap-2">
            <Input value={question} onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runSimulation()}
              placeholder='Ask "What happens if I..."'
              className="text-lg" />
            <Button onClick={() => runSimulation()} disabled={!question.trim() || simulating}
              className="bg-indigo-600 hover:bg-indigo-700 px-4">
              {simulating ? <Brain className="h-5 w-5 animate-pulse" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => { setQuestion(q); runSimulation(q) }}
                className="px-2.5 py-1.5 rounded-lg text-[11px] bg-muted hover:bg-muted/80 transition text-left">
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simulating Animation */}
      {simulating && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="py-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <p className="text-sm font-medium">AI is modeling your business...</p>
            <p className="text-xs text-muted-foreground mt-1">Analyzing revenue impact, costs, risks, and timeline</p>
          </CardContent>
        </Card>
      )}

      {/* Simulation Results */}
      {currentSim && !simulating && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-bold">Simulation: {currentSim.question}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className={`p-3 rounded-xl text-center ${currentSim.revenueImpact >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-[10px] text-muted-foreground">Revenue Impact</p>
                  <p className={`text-xl font-bold ${currentSim.revenueImpact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {currentSim.revenueImpact >= 0 ? '+' : ''}R{Math.abs(currentSim.revenueImpact).toLocaleString()}/mo
                  </p>
                </div>
                <div className="p-3 rounded-xl text-center bg-red-50 border border-red-200">
                  <p className="text-[10px] text-muted-foreground">Cost Increase</p>
                  <p className="text-xl font-bold text-red-600">+R{currentSim.costImpact.toLocaleString()}/mo</p>
                </div>
                <div className={`p-3 rounded-xl text-center ${currentSim.profitChange >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-[10px] text-muted-foreground">Profit Change</p>
                  <p className={`text-xl font-bold ${currentSim.profitChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {currentSim.profitChange >= 0 ? '+' : ''}R{Math.abs(currentSim.profitChange).toLocaleString()}/mo
                  </p>
                </div>
                <div className="p-3 rounded-xl text-center bg-blue-50 border border-blue-200">
                  <p className="text-[10px] text-muted-foreground">Cashflow Impact</p>
                  <p className={`text-xl font-bold ${currentSim.cashflowImpact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {currentSim.cashflowImpact >= 0 ? '+' : ''}R{Math.abs(currentSim.cashflowImpact).toLocaleString()}/mo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 p-2.5 rounded-lg border">
                  <Shield className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Risk Level</p>
                    <Badge className={`text-[10px] ${riskColors[currentSim.riskLevel]}`}>{currentSim.riskLevel}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border">
                  <Target className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Confidence</p>
                    <p className="text-sm font-bold">{currentSim.confidenceScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border">
                  <Clock className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Timeline</p>
                    <p className="text-sm font-bold">{currentSim.timeline}</p>
                  </div>
                </div>
              </div>

              <Progress value={currentSim.confidenceScore} className="h-1.5 mb-3" />

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-3">
                <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Key Risks
                </p>
                <ul className="space-y-0.5">
                  {currentSim.keyRisks.map((risk, i) => (
                    <li key={i} className="text-[11px] text-amber-600">• {risk}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">
                  <Lightbulb className="h-3.5 w-3.5" /> AI Recommendation
                </p>
                <p className="text-xs text-emerald-600">{currentSim.recommendation}</p>
              </div>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                ⚠️ These are forecasts with assumptions, not guarantees. Always consult a financial advisor for major decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

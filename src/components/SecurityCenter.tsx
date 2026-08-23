import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  Shield, Lock, Eye, AlertTriangle, CheckCircle2, XCircle,
  Users, Key, FileText, Clock, Fingerprint, ShieldCheck,
  ShieldAlert, Activity, Database, Globe, RefreshCw, Ban,
  UserCheck, Settings, ChevronRight, Ban as BanIcon
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

export default function SecurityCenter({ business, showToast }: Props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 400) }, [business.id])

  const auditLogs = [
    { action: 'Login from new device', user: 'Business Owner', time: '2 min ago', severity: 'info', ip: '102.134.x.x' },
    { action: 'Product price updated', user: 'AI Agent', time: '15 min ago', severity: 'info', ip: 'System' },
    { action: 'Failed login attempt', user: 'Unknown', time: '1h ago', severity: 'warning', ip: '196.45.x.x' },
    { action: 'Order refunded (R 1,240)', user: 'Business Owner', time: '2h ago', severity: 'info', ip: '102.134.x.x' },
    { action: 'Suspicious payment pattern', user: 'AI Fraud Agent', time: '4h ago', severity: 'critical', ip: 'System' },
    { action: 'Admin settings changed', user: 'Business Owner', time: '6h ago', severity: 'info', ip: '102.134.x.x' },
  ]

  const permissions = [
    { role: 'Owner', users: 1, permissions: ['Full Access'], color: 'from-red-500 to-orange-600' },
    { role: 'Manager', users: 2, permissions: ['Orders', 'Products', 'Analytics', 'Marketing'], color: 'from-blue-500 to-indigo-600' },
    { role: 'Staff', users: 4, permissions: ['Orders', 'Products'], color: 'from-emerald-500 to-teal-600' },
    { role: 'AI Agent', users: 3, permissions: ['Analytics', 'Recommendations', 'Marketing'], color: 'from-purple-500 to-violet-600' },
  ]

  const fraudChecks = [
    { name: 'Payment Velocity Check', status: 'active', blocked: 3, description: 'Detects rapid repeated payment attempts' },
    { name: 'IP Anomaly Detection', status: 'active', blocked: 7, description: 'Identifies suspicious IP patterns' },
    { name: 'Amount Threshold Alert', status: 'active', blocked: 1, description: 'Flags unusually large orders' },
    { name: 'Account Takeover Prevention', status: 'active', blocked: 2, description: 'Detects compromised credentials' },
    { name: 'Bot Traffic Filter', status: 'active', blocked: 156, description: 'Filters automated suspicious traffic' },
  ]

  const securityScore = 87
  const severityColors: Record<string, string> = {
    info: 'text-blue-500', warning: 'text-amber-500', critical: 'text-red-500'
  }
  const severityBg: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700', warning: 'bg-amber-100 text-amber-700', critical: 'bg-red-100 text-red-700'
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6 text-red-500" />Security Center</h1>
          <p className="text-muted-foreground text-sm">Audit logs, permissions, fraud detection & encryption</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" />Secure</Badge>
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Scan</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${securityScore}, 100`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{securityScore}%</span>
              </div>
              <div><p className="text-xs text-muted-foreground">Security Score</p><p className="text-lg font-bold text-emerald-600">Strong</p></div>
            </div>
          </CardContent>
        </Card>
        {[
          { label: 'Threats Blocked', value: '169', icon: ShieldAlert, color: 'text-emerald-500' },
          { label: 'Failed Logins', value: '7', icon: Lock, color: 'text-amber-500' },
          { label: 'Active Sessions', value: '3', icon: Users, color: 'text-blue-500' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            <p className="text-xl font-bold">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit" className="text-xs"><FileText className="h-3 w-3 mr-1" />Audit Log</TabsTrigger>
          <TabsTrigger value="permissions" className="text-xs"><Key className="h-3 w-3 mr-1" />Permissions</TabsTrigger>
          <TabsTrigger value="fraud" className="text-xs"><ShieldAlert className="h-3 w-3 mr-1" />Fraud</TabsTrigger>
          <TabsTrigger value="encryption" className="text-xs"><Lock className="h-3 w-3 mr-1" />Encryption</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-2">
          {auditLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm">
              <Activity className={`h-5 w-5 ${severityColors[log.severity]}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{log.action}</span>
                  <Badge className={severityBg[log.severity]}>{log.severity}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{log.user} · {log.time} · IP: {log.ip}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-3">
          {permissions.map(p => (
            <Card key={p.role}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-xs font-bold`}>{p.users}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{p.role}</p>
                    <div className="flex gap-1 flex-wrap mt-1">{p.permissions.map(per => <Badge key={per} variant="secondary" className="text-[10px]">{per}</Badge>)}</div>
                  </div>
                  <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fraud" className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" />Fraud Detection Engine</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {fraudChecks.map(f => (
                <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{f.name}</span>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{f.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{f.blocked}</p>
                    <p className="text-[10px] text-muted-foreground">blocked</p>
                  </div>
                  <Switch checked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Encryption & Data Protection</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Data at Rest (AES-256)', status: 'active', icon: Database },
                { name: 'Data in Transit (TLS 1.3)', status: 'active', icon: Globe },
                { name: 'Payment Data (PCI DSS)', status: 'active', icon: Lock },
                { name: 'API Keys (Encrypted)', status: 'active', icon: Key },
                { name: 'Customer PII (Masked)', status: 'active', icon: Eye },
                { name: 'Backup Encryption', status: 'active', icon: Database },
              ].map(e => (
                <div key={e.name} className="flex items-center gap-3 p-2">
                  <e.icon className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm flex-1">{e.name}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{e.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

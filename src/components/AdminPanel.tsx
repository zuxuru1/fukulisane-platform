import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Shield, Users, Activity, Key, Database, Globe, Lock, Bell,
  Plus, Trash2, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle,
  Clock, RefreshCw, Copy, Server, FileText, Search, Download,
  Upload, Settings, Cpu, HardDrive, Wifi, Zap, BarChart3,
  UserPlus, UserCog, Mail, Phone, ChevronRight, ExternalLink,
  Copy as CopyIcon, RotateCcw, Power, Terminal
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface TeamUser {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'manager' | 'viewer'
  status: 'active' | 'inactive' | 'invited'
  lastActive: string
  avatar?: string
}

interface AuditEntry {
  id: string
  action: string
  user: string
  target: string
  timestamp: string
  type: 'create' | 'update' | 'delete' | 'login' | 'export' | 'config'
}

interface ApiKey {
  id: string
  name: string
  key: string
  status: 'active' | 'revoked'
  permissions: string[]
  createdAt: string
  lastUsed: string
  callsUsed: number
  callsLimit: number
}

// ══════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════

const MOCK_USERS: TeamUser[] = [
  { id: '1', name: 'Nkuliso Mkhize', email: 'nkuliso@fukulisane.co.za', role: 'owner', status: 'active', lastActive: '2026-07-22T14:30:00' },
  { id: '2', name: 'Sipho Dlamini', email: 'sipho@fukulisane.co.za', role: 'admin', status: 'active', lastActive: '2026-07-22T10:15:00' },
  { id: '3', name: 'Thabo Nkosi', email: 'thabo@fukulisane.co.za', role: 'manager', status: 'active', lastActive: '2026-07-21T16:45:00' },
  { id: '4', name: 'Zanele Mthembu', email: 'zanele@fukulisane.co.za', role: 'viewer', status: 'active', lastActive: '2026-07-20T09:00:00' },
  { id: '5', name: 'Andile Bhengu', email: 'andile@gmail.com', role: 'viewer', status: 'invited', lastActive: '' },
]

const MOCK_AUDIT: AuditEntry[] = [
  { id: '1', action: 'Created project', user: 'Nkuliso Mkhize', target: 'Mbali House Extension', timestamp: '2026-07-22T14:30:00', type: 'create' },
  { id: '2', action: 'Sent quote to', user: 'Sipho Dlamini', target: 'Mrs. Zondi (R85,000)', timestamp: '2026-07-22T10:15:00', type: 'update' },
  { id: '3', action: 'Logged in', user: 'Thabo Nkosi', target: 'from 197.242.xxx.xxx', timestamp: '2026-07-21T16:45:00', type: 'login' },
  { id: '4', action: 'Exported invoices', user: 'Nkuliso Mkhize', target: 'June 2026 (12 invoices)', timestamp: '2026-07-21T11:20:00', type: 'export' },
  { id: '5', action: 'Deleted lead', user: 'Sipho Dlamini', target: 'Duplicate: Test Entry', timestamp: '2026-07-20T15:10:00', type: 'delete' },
  { id: '6', action: 'Updated pricing', user: 'Nkuliso Mkhize', target: 'Roofing R580 → R620/m²', timestamp: '2026-07-20T09:30:00', type: 'config' },
  { id: '7', action: 'Invited team member', user: 'Nkuliso Mkhize', target: 'andile@gmail.com', timestamp: '2026-07-19T14:00:00', type: 'create' },
  { id: '8', action: 'Created invoice', user: 'Thabo Nkosi', target: 'INV-0045 — R42,000', timestamp: '2026-07-19T11:30:00', type: 'create' },
  { id: '9', action: 'Changed settings', user: 'Nkuliso Mkhize', target: 'WhatsApp notifications enabled', timestamp: '2026-07-18T16:00:00', type: 'config' },
  { id: '10', action: 'Logged in', user: 'Zanele Mthembu', target: 'from 105.225.xxx.xxx', timestamp: '2026-07-18T09:00:00', type: 'login' },
]

const MOCK_API_KEYS: ApiKey[] = [
  { id: '1', name: 'Production API', key: 'fuk_live_sk_••••••••••••••••', status: 'active', permissions: ['read', 'write', 'quotes', 'invoices'], createdAt: '2026-06-01', lastUsed: '2026-07-22', callsUsed: 12400, callsLimit: 50000 },
  { id: '2', name: 'Website Integration', key: 'fuk_live_sk_••••••••••••••••', status: 'active', permissions: ['read', 'leads'], createdAt: '2026-06-15', lastUsed: '2026-07-21', callsUsed: 3200, callsLimit: 25000 },
  { id: '3', name: 'Testing Key', key: 'fuk_test_sk_••••••••••••••••', status: 'revoked', permissions: ['read'], createdAt: '2026-05-10', lastUsed: '2026-06-20', callsUsed: 890, callsLimit: 5000 },
]

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function AdminPanel() {
  const [tab, setTab] = useState<'overview' | 'team' | 'audit' | 'api-keys' | 'security' | 'system'>('overview')
  const [users, setUsers] = useState<TeamUser[]>(MOCK_USERS)
  const [audit, setAudit] = useState<AuditEntry[]>(MOCK_AUDIT)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_API_KEYS)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddKey, setShowAddKey] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer' as string })
  const [newKey, setNewKey] = useState({ name: '', permissions: 'read' })

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── User management ──
  const addUser = () => {
    if (!newUser.name || !newUser.email) return
    setUsers([{ id: `u_${Date.now()}`, name: newUser.name, email: newUser.email, role: newUser.role as TeamUser['role'], status: 'invited', lastActive: '' }, ...users])
    showToast(`Invitation sent to ${newUser.email}`)
    setNewUser({ name: '', email: '', role: 'viewer' })
    setShowAddUser(false)
  }

  const removeUser = (id: string) => {
    const u = users.find(u => u.id === id)
    setUsers(users.filter(u => u.id !== id))
    showToast(`${u?.name} removed`)
  }

  const toggleUserRole = (id: string, role: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: role as any } : u))
    showToast('Role updated')
  }

  // ── API Keys ──
  const addApiKey = () => {
    const key = `fuk_live_sk_${Math.random().toString(36).slice(2, 18)}`
    setApiKeys([{ id: `k_${Date.now()}`, name: newKey.name, key, status: 'active', permissions: [newKey.permissions], createdAt: new Date().toISOString().split('T')[0], lastUsed: 'Never', callsUsed: 0, callsLimit: 10000 }, ...apiKeys])
    showToast(`API key "${newKey.name}" created`)
    setNewKey({ name: '', permissions: 'read' })
    setShowAddKey(false)
  }

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k))
    showToast('API key revoked')
  }

  // ── Stats ──
  const activeUsers = users.filter(u => u.status === 'active').length
  const activeKeys = apiKeys.filter(k => k.status === 'active').length
  const totalCalls = apiKeys.reduce((s, k) => s + k.callsUsed, 0)

  const roleColors: Record<string, string> = { owner: '#d4a843', admin: '#dc2626', manager: '#2563eb', viewer: '#6b7280' }
  const typeColors: Record<string, string> = { create: '#059669', update: '#2563eb', delete: '#dc2626', login: '#6b7280', export: '#7c3aed', config: '#d97706' }
  const typeIcons: Record<string, any> = { create: Plus, update: Settings, delete: Trash2, login: Lock, export: Download, config: Settings }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-[70] px-5 py-3 rounded-lg shadow-lg text-white text-sm font-semibold ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>{toast.msg}</div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">🔐 Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">User management, security, audit logs, and system health</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Users className="h-3.5 w-3.5 mr-1.5" /> Team
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Activity className="h-3.5 w-3.5 mr-1.5" /> Audit Log
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Key className="h-3.5 w-3.5 mr-1.5" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Shield className="h-3.5 w-3.5 mr-1.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Server className="h-3.5 w-3.5 mr-1.5" /> System
          </TabsTrigger>
        </TabsList>

        {/* ═══ TAB: OVERVIEW ═══ */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Team Members', value: users.length, icon: Users, color: '#2563eb', sub: `${activeUsers} active` },
              { label: 'API Keys', value: apiKeys.length, icon: Key, color: '#d4a843', sub: `${activeKeys} active` },
              { label: 'API Calls', value: totalCalls.toLocaleString(), icon: Zap, color: '#059669', sub: 'This month' },
              { label: 'Audit Events', value: audit.length, icon: Activity, color: '#7c3aed', sub: 'Last 30 days' },
            ].map(s => (
              <Card key={s.label} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                      <s.icon className="h-5 w-5" style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
                      <p className="text-[10px] text-gray-400">{s.sub}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3">👥 Team by Role</h3>
                {['owner', 'admin', 'manager', 'viewer'].map(role => {
                  const count = users.filter(u => u.role === role).length
                  return (
                    <div key={role} className="flex items-center gap-3 mb-2">
                      <div className="h-3 w-3 rounded" style={{ backgroundColor: roleColors[role] }} />
                      <span className="text-xs text-gray-600 capitalize w-16">{role}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${users.length ? (count / users.length * 100) : 0}%`, backgroundColor: roleColors[role] }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3">🔑 API Usage</h3>
                {apiKeys.filter(k => k.status === 'active').map(k => (
                  <div key={k.id} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{k.name}</span>
                      <span className="text-[10px] text-gray-400">{k.callsUsed.toLocaleString()} / {k.callsLimit.toLocaleString()}</span>
                    </div>
                    <Progress value={(k.callsUsed / k.callsLimit) * 100} className="h-2" />
                  </div>
                ))}
                {apiKeys.filter(k => k.status === 'active').length === 0 && (
                  <p className="text-xs text-gray-400">No active API keys</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">📋 Recent Activity</h3>
              <div className="space-y-2">
                {audit.slice(0, 5).map(a => {
                  const AIcon = typeIcons[a.type] || Activity
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${typeColors[a.type]}12` }}>
                        <AIcon className="h-4 w-4" style={{ color: typeColors[a.type] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700">{a.action} <span className="text-gray-900">{a.target}</span></p>
                        <p className="text-[10px] text-gray-400">{a.user} • {new Date(a.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB: TEAM ═══ */}
        <TabsContent value="team" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Team Management</h2>
              <p className="text-gray-500 text-sm mt-0.5">{users.length} members, {activeUsers} active</p>
            </div>
            <Button onClick={() => setShowAddUser(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]">
              <UserPlus className="h-4 w-4 mr-1" /> Invite Member
            </Button>
          </div>

          <div className="space-y-2">
            {users.map(u => (
              <Card key={u.id} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: roleColors[u.role] }}>
                    {u.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">{u.name}</p>
                      <Badge variant="outline" className="text-[9px] capitalize" style={{ borderColor: roleColors[u.role], color: roleColors[u.role] }}>{u.role}</Badge>
                      <Badge variant="outline" className={`text-[9px] ${u.status === 'active' ? 'border-emerald-300 text-emerald-600' : u.status === 'invited' ? 'border-amber-300 text-amber-600' : 'border-gray-200 text-gray-400'}`}>{u.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                    {u.lastActive && <p className="text-[10px] text-gray-400 mt-0.5">Last active: {new Date(u.lastActive).toLocaleString()}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {u.role !== 'owner' && (
                      <select value={u.role} onChange={e => toggleUserRole(u.id, e.target.value)}
                        className="px-2 py-1 rounded border border-gray-200 bg-gray-50 text-[10px] text-gray-600">
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                    {u.role !== 'owner' && (
                      <button onClick={() => removeUser(u.id)} className="text-gray-300 hover:text-red-500 p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent className="bg-white border-gray-200 text-gray-900">
              <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                <div><Label className="text-xs">Name *</Label><Input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="Full name" /></div>
                <div><Label className="text-xs">Email *</Label><Input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="email@example.com" /></div>
                <div><Label className="text-xs">Role</Label>
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                    <option value="viewer">Viewer — Read only access</option>
                    <option value="manager">Manager — Can manage projects and quotes</option>
                    <option value="admin">Admin — Full access except billing</option>
                  </select>
                </div>
                <Button onClick={addUser} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Send Invitation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ═══ TAB: AUDIT LOG ═══ */}
        <TabsContent value="audit" className="space-y-6 mt-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Audit Log</h2>
            <p className="text-gray-500 text-sm mt-0.5">Track all system activity and changes</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-200 text-gray-600 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Export Log
            </Button>
          </div>

          <div className="space-y-2">
            {audit.map(a => {
              const AIcon = typeIcons[a.type] || Activity
              return (
                <Card key={a.id} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${typeColors[a.type]}12` }}>
                      <AIcon className="h-4 w-4" style={{ color: typeColors[a.type] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{a.action}</p>
                      <p className="text-[10px] text-gray-400">{a.target}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-600">{a.user}</p>
                      <p className="text-[10px] text-gray-400">{new Date(a.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] capitalize shrink-0" style={{ borderColor: typeColors[a.type], color: typeColors[a.type] }}>{a.type}</Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ═══ TAB: API KEYS ═══ */}
        <TabsContent value="api-keys" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">API Keys</h2>
              <p className="text-gray-500 text-sm mt-0.5">Manage API access for integrations</p>
            </div>
            <Button onClick={() => setShowAddKey(true)} className="bg-[#d4a843] text-white hover:bg-[#c9a433]">
              <Key className="h-4 w-4 mr-1" /> Generate Key
            </Button>
          </div>

          <div className="space-y-3">
            {apiKeys.map(k => (
              <Card key={k.id} className={`bg-white shadow-sm ${k.status === 'revoked' ? 'border-red-200 opacity-60' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-gray-900">{k.name}</p>
                        <Badge variant="outline" className={`text-[9px] ${k.status === 'active' ? 'border-emerald-300 text-emerald-600' : 'border-red-300 text-red-600'}`}>{k.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-400 font-mono mt-1">{k.key}</p>
                    </div>
                    {k.status === 'active' && (
                      <Button variant="outline" size="sm" onClick={() => revokeKey(k.id)} className="border-red-200 text-red-600 text-[10px] hover:bg-red-50">
                        <Trash2 className="h-3 w-3 mr-1" /> Revoke
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400">
                    <span>Created: {k.createdAt}</span>
                    <span>Last used: {k.lastUsed}</span>
                    <span>{k.callsUsed.toLocaleString()} / {k.callsLimit.toLocaleString()} calls</span>
                  </div>
                  {k.status === 'active' && (
                    <div className="mt-2">
                      <Progress value={(k.callsUsed / k.callsLimit) * 100} className="h-1.5" />
                    </div>
                  )}
                  <div className="flex gap-1 mt-2">
                    {k.permissions.map(p => (
                      <Badge key={p} variant="outline" className="text-[8px] border-gray-200 text-gray-400">{p}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={showAddKey} onOpenChange={setShowAddKey}>
            <DialogContent className="bg-white border-gray-200 text-gray-900">
              <DialogHeader><DialogTitle>Generate API Key</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                <div><Label className="text-xs">Key Name *</Label><Input value={newKey.name} onChange={e => setNewKey({ ...newKey, name: e.target.value })} className="bg-gray-50 border-gray-200" placeholder="e.g. Website Integration" /></div>
                <div><Label className="text-xs">Permissions</Label>
                  <select value={newKey.permissions} onChange={e => setNewKey({ ...newKey, permissions: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                    <option value="read">Read Only</option>
                    <option value="read,write">Read + Write</option>
                    <option value="read,write,quotes,invoices">Full Access</option>
                  </select>
                </div>
                <Button onClick={addApiKey} className="w-full bg-[#d4a843] text-white hover:bg-[#c9a433]">Generate Key</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ═══ TAB: SECURITY ═══ */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Security Settings</h2>
            <p className="text-gray-500 text-sm mt-0.5">Protect your account and data</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Two-Factor Authentication', icon: Shield, color: '#059669', desc: 'Add an extra layer of security to your account', enabled: true },
              { title: 'Password Policy', icon: Lock, color: '#2563eb', desc: 'Require strong passwords for all team members', enabled: true },
              { title: 'Session Timeout', icon: Clock, color: '#d97706', desc: 'Auto logout after 30 minutes of inactivity', enabled: true },
              { title: 'Login Notifications', icon: Bell, color: '#7c3aed', desc: 'Get alerted when someone logs into your account', enabled: true },
              { title: 'IP Whitelist', icon: Globe, color: '#dc2626', desc: 'Restrict access to specific IP addresses', enabled: false },
              { title: 'Data Encryption', icon: Key, color: '#059669', desc: 'End-to-end encryption for sensitive data', enabled: true },
            ].map(s => (
              <Card key={s.title} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}12` }}>
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{s.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                  <div className={`h-6 w-11 rounded-full flex items-center p-0.5 shrink-0 cursor-pointer transition ${s.enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${s.enabled ? 'translate-x-5' : ''}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">🔑 Active Sessions</h3>
              <div className="space-y-2">
                {[
                  { device: 'Chrome on Windows', ip: '197.242.xxx.xxx', time: 'Current session', current: true },
                  { device: 'Safari on iPhone', ip: '105.225.xxx.xxx', time: '2 hours ago', current: false },
                  { device: 'Chrome on Android', ip: '105.225.xxx.xxx', time: 'Yesterday', current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Wifi className="h-4 w-4 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-gray-700">{s.device}</p>
                        {s.current && <Badge className="bg-emerald-50 text-emerald-600 text-[8px]">Current</Badge>}
                      </div>
                      <p className="text-[10px] text-gray-400">{s.ip} • {s.time}</p>
                    </div>
                    {!s.current && <Button variant="ghost" size="sm" className="text-[10px] text-red-500 hover:bg-red-50">Revoke</Button>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB: SYSTEM ═══ */}
        <TabsContent value="system" className="space-y-6 mt-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">System Health</h2>
            <p className="text-gray-500 text-sm mt-0.5">Monitor platform performance and status</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'API Status', value: 'Operational', icon: Activity, color: '#059669', pct: 100 },
              { label: 'Database', value: 'Healthy', icon: Database, color: '#2563eb', pct: 100 },
              { label: 'Uptime', value: '99.97%', icon: Server, color: '#d4a843', pct: 99.97 },
              { label: 'Response Time', value: '142ms', icon: Zap, color: '#7c3aed', pct: 85 },
            ].map(s => (
              <Card key={s.label} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                      <s.icon className="h-5 w-5" style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-[10px] text-gray-400">{s.label}</p>
                    </div>
                  </div>
                  <Progress value={s.pct} className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3">💾 Storage Usage</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Database', used: '124 MB', total: '5 GB', pct: 2.5 },
                    { label: 'Photo Gallery', used: '2.3 GB', total: '10 GB', pct: 23 },
                    { label: 'Documents', used: '456 MB', total: '5 GB', pct: 9 },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{s.label}</span>
                        <span className="text-[10px] text-gray-400">{s.used} / {s.total}</span>
                      </div>
                      <Progress value={s.pct} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3">⚙️ System Info</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Platform Version', value: 'BGOS v2.5.1' },
                    { label: 'Database', value: 'SQLite (Prisma)' },
                    { label: 'Runtime', value: 'Bun + Hono' },
                    { label: 'Frontend', value: 'Vite + React + TypeScript' },
                    { label: 'Region', value: 'KwaZulu-Natal, South Africa' },
                    { label: 'Last Backup', value: '2026-07-22 03:00 AM' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-500">{s.label}</span>
                      <span className="text-xs font-medium text-gray-700">{s.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">🔧 Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Clear Cache', icon: RotateCcw, color: '#d97706' },
                  { label: 'Export Data', icon: Download, color: '#2563eb' },
                  { label: 'Backup Now', icon: HardDrive, color: '#059669' },
                  { label: 'Run Diagnostics', icon: Terminal, color: '#7c3aed' },
                ].map(a => (
                  <button key={a.label} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-sm font-medium text-gray-700 border border-gray-100">
                    <a.icon className="h-4 w-4" style={{ color: a.color }} />
                    {a.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

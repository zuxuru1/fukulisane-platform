import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  Package, ShoppingCart, TrendingUp, Plus, Trash2, Edit2,
  ExternalLink, Store, Eye, EyeOff, X, Upload, Image as ImageIcon,
  BarChart3, DollarSign, Clock, CheckCircle2, AlertCircle, Truck
} from 'lucide-react'

type Tab = 'overview' | 'products' | 'orders'

interface Props {
  business: any
  onRefresh: () => void
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export default function Dashboard({ business, onRefresh, showToast }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>(business?.products || [])

  useEffect(() => { setProducts(business?.products || []) }, [business])

  useEffect(() => {
    fetch(`/api/businesses/${business.id}/stats`).then(r => r.json()).then(setStats).catch(() => {})
    fetch(`/api/orders?businessId=${business.id}`).then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => {})
  }, [business.id])

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ]

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="flex items-center gap-4">
        {business.logoUrl ? (
          <img src={business.logoUrl} alt={business.name} className="h-14 w-14 rounded-xl object-cover border" />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
            <Store className="h-7 w-7 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-sm text-muted-foreground">{business.tagline || business.description}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={business.storeStatus === 'live' ? 'default' : 'secondary'}>
            {business.storeStatus === 'live' ? '● Live' : '○ Draft'}
          </Badge>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              tab === t.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && <OverviewTab stats={stats} orders={orders} business={business} />}
      {tab === 'products' && <ProductsTab business={business} products={products} setProducts={setProducts} onRefresh={onRefresh} showToast={showToast} />}
      {tab === 'orders' && <OrdersTab orders={orders} setOrders={setOrders} businessId={business.id} showToast={showToast} />}
    </div>
  )
}

// ━━━ OVERVIEW TAB ━━━
function OverviewTab({ stats, orders, business }: { stats: any; orders: any[]; business: any }) {
  const kpis = [
    { label: 'Products', value: stats?.productCount ?? 0, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Revenue', value: `R${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Today\'s Sales', value: stats?.todaySales ?? 0, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Orders', value: stats?.orderCount ?? 0, icon: ShoppingCart, color: 'text-orange-600 bg-orange-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${k.color}`}>
                  <k.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No orders yet. Share your store link to start selling!</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((o: any) => (
                <div key={o.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{o.customerName || 'Customer'}</p>
                    <p className="text-xs text-muted-foreground">{o.orderNumber}</p>
                  </div>
                  <p className="text-sm font-bold">R{o.total.toLocaleString()}</p>
                  <Badge variant={o.status === 'completed' ? 'default' : o.status === 'pending' ? 'secondary' : 'outline'}>
                    {o.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Store Link */}
      <Card className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
            <ExternalLink className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Your Store is Live</p>
            <p className="text-sm text-muted-foreground">{window.location.origin}?store={business.slug}</p>
          </div>
          <Button size="sm" onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}?store=${business.slug}`)
          }}>Copy Link</Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ━━━ PRODUCTS TAB ━━━
function ProductsTab({ business, products, setProducts, onRefresh, showToast }: {
  business: any; products: any[]; setProducts: (p: any[]) => void; onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void
}) {
  const [open, setOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '' })
  const [saving, setSaving] = useState(false)

  const resetForm = () => { setForm({ name: '', description: '', price: '', imageUrl: '' }); setEditProduct(null) }

  const openEdit = (p: any) => {
    setEditProduct(p)
    setForm({ name: p.name, description: p.description || '', price: String(p.price), imageUrl: p.imageUrl || '' })
    setOpen(true)
  }

  const openNew = () => { resetForm(); setOpen(true) }

  const save = async () => {
    if (!form.name || !form.price) { showToast('Name and price required', 'error'); return }
    setSaving(true)
    try {
      if (editProduct) {
        await fetch(`/api/products/${editProduct.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, description: form.description, price: parseFloat(form.price), imageUrl: form.imageUrl || null })
        })
        setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...form, price: parseFloat(form.price) } : p))
        showToast('Product updated')
      } else {
        const res = await fetch('/api/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, price: parseFloat(form.price), businessId: business.id, isAvailable: true })
        })
        const created = await res.json()
        setProducts([...products, created])
        showToast('Product added')
      }
      setOpen(false); resetForm()
    } catch { showToast('Failed to save', 'error') } finally { setSaving(false) }
  }

  const toggleAvailability = async (p: any) => {
    await fetch(`/api/products/${p.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !p.isAvailable })
    })
    setProducts(products.map(prod => prod.id === p.id ? { ...prod, isAvailable: !prod.isAvailable } : prod))
  }

  const deleteProduct = async (p: any) => {
    await fetch(`/api/products/${p.id}`, { method: 'DELETE' })
    setProducts(products.filter(prod => prod.id !== p.id))
    showToast('Product deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{products.length} Products</h3>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
          <DialogTrigger onClick={openNew} className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition">
            <Plus className="h-4 w-4" /> Add Product
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Product Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Protein Shake" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (R)</Label>
                  <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              {form.imageUrl && (
                <div className="relative h-32 rounded-lg overflow-hidden border">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <Button onClick={save} disabled={saving} className="w-full">
                {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No products yet. Add your first product!</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <Card key={p.id} className="overflow-hidden">
              <div className="relative h-40 bg-muted">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                )}
                <Badge variant={p.isAvailable ? 'default' : 'secondary'} className="absolute top-2 right-2 text-xs">
                  {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold text-sm">{p.name}</h4>
                {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                <div className="flex items-center justify-between mt-3">
                  <p className="font-bold text-emerald-600">R{p.price.toLocaleString()}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(p)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleAvailability(p)}>
                      {p.isAvailable ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={() => deleteProduct(p)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ━━━ ORDERS TAB ━━━
function OrdersTab({ orders, setOrders, businessId, showToast }: {
  orders: any[]; setOrders: (o: any[]) => void; businessId: string;
  showToast: (msg: string, type?: 'success' | 'error') => void
}) {
  const updateStatus = async (order: any, status: string) => {
    await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    setOrders(orders.map(o => o.id === order.id ? { ...o, status } : o))
    showToast(`Order ${status}`)
  }

  const deleteOrder = async (order: any) => {
    await fetch(`/api/orders/${order.id}`, { method: 'DELETE' })
    setOrders(orders.filter(o => o.id !== order.id))
    showToast('Order deleted')
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'completed': return 'bg-emerald-100 text-emerald-700'
      case 'preparing': return 'bg-blue-100 text-blue-700'
      case 'ready': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{orders.length} Orders</h3>
      {orders.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No orders yet. Share your store to get started!</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{o.customerName || 'Walk-in Customer'}</p>
                      <Badge className={`text-xs ${statusColor(o.status)}`}>{o.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {o.orderNumber} • {o.deliveryMethod} • {new Date(o.createdAt).toLocaleString()}
                    </p>
                    {o.customerPhone && <p className="text-xs text-muted-foreground">📞 {o.customerPhone}</p>}
                    {o.note && <p className="text-xs text-muted-foreground mt-1 italic">"{o.note}"</p>}
                  </div>
                  <p className="font-bold text-emerald-600">R{o.total.toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-3 ml-14">
                  {o.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateStatus(o, 'preparing')}>
                        <Clock className="h-3 w-3 mr-1" /> Prepare
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 text-red-500" onClick={() => updateStatus(o, 'cancelled')}>
                        Cancel
                      </Button>
                    </>
                  )}
                  {o.status === 'preparing' && (
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateStatus(o, 'ready')}>
                      Ready
                    </Button>
                  )}
                  {o.status === 'ready' && (
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateStatus(o, 'delivered')}>
                      <Truck className="h-3 w-3 mr-1" /> Delivered
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-xs h-7 text-red-500 ml-auto" onClick={() => deleteOrder(o)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

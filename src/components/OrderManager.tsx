import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart, Clock, CheckCircle2, Truck, Package,
  Phone, MapPin, DollarSign, MessageSquare, Filter,
  Plus, Eye, ChevronDown, ChevronUp, XCircle,
} from 'lucide-react'

interface OrderManagerProps {
  businessId: string
  businessName: string
  businessPhone?: string
  businessWhatsapp?: string
  products: { id: string; name: string; price: number; imageUrl?: string; isAvailable: boolean }[]
  showToast: (msg: string, type?: 'success' | 'error') => void
}

interface Order {
  id: string
  orderNumber: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  customerAddress?: string
  items: string
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  deliveryMethod: string
  paymentMethod?: string
  paymentStatus: string
  note?: string
  createdAt: string
}

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'New Order', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-4 w-4" /> },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle2 className="h-4 w-4" /> },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: <Package className="h-4 w-4" /> },
  ready: { label: 'Ready', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <CheckCircle2 className="h-4 w-4" /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200', icon: <Truck className="h-4 w-4" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-4 w-4" /> },
}

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

export default function OrderManager({
  businessId, businessName, businessPhone, businessWhatsapp,
  products, showToast,
}: OrderManagerProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [loading, setLoading] = useState(true)

  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [orderNote, setOrderNote] = useState('')

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?businessId=${businessId}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : data?.items ?? [])
      }
    } catch { /* */ } finally { setLoading(false) }
  }, [businessId])

  useEffect(() => { loadOrders() }, [loadOrders])

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        showToast(`Order updated to ${STATUS_CONFIG[newStatus]?.label}`)
      }
    } catch { showToast('Failed to update', 'error') }
  }

  const updatePayment = async (orderId: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus } : o))
        showToast(`Payment marked as ${paymentStatus}`)
      }
    } catch { showToast('Failed to update payment', 'error') }
  }

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + (deliveryMethod === 'delivery' ? deliveryFee : 0)

  const createOrder = async () => {
    if (cart.length === 0) { showToast('Add items to cart', 'error'); return }
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          customerName: customerName || 'Walk-in',
          customerPhone,
          customerAddress: deliveryMethod === 'delivery' ? customerAddress : null,
          items: JSON.stringify(cart),
          subtotal: cartTotal - (deliveryMethod === 'delivery' ? deliveryFee : 0),
          deliveryFee: deliveryMethod === 'delivery' ? deliveryFee : 0,
          total: cartTotal,
          deliveryMethod,
          note: orderNote,
        }),
      })
      if (res.ok) {
        const order = await res.json()
        setOrders(prev => [order, ...prev])
        setCart([])
        setCustomerName('')
        setCustomerPhone('')
        setCustomerAddress('')
        setOrderNote('')
        setShowNewOrder(false)
        showToast(`Order ${order.orderNumber} created!`)
      }
    } catch { showToast('Failed to create order', 'error') }
  }

  const sendWhatsApp = (order: Order) => {
    const items = JSON.parse(order.items) as CartItem[]
    const itemText = items.map(i => `  ${i.quantity}x ${i.name} — R${(i.price * i.quantity).toFixed(2)}`).join('\n')
    const msg = `🛒 *Order ${order.orderNumber}*\n\n${itemText}\n\n💰 Total: R${order.total.toFixed(2)}\n📦 ${order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}\n📍 ${order.customerAddress || 'Pickup from store'}\n\nThank you for your order! 🙏`
    const phone = businessWhatsapp?.replace(/[^0-9]/g, '') || businessPhone?.replace(/[^0-9]/g, '') || ''
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const todayRevenue = orders
    .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total, 0)

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">R{todayRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* New Order Button + Filters */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto flex-1">
          {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map(s => (
            <Button
              key={s}
              variant={filter === s ? 'default' : 'outline'}
              size="sm"
              className="shrink-0 gap-1"
              onClick={() => setFilter(s)}
            >
              <Filter className="h-3 w-3" />
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label}
              {s === 'pending' && pendingCount > 0 && (
                <span className="ml-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Button>
          ))}
        </div>

        <Dialog open={showNewOrder} onOpenChange={setShowNewOrder}>
          <DialogTrigger>
            <Button size="sm" className="gap-1 shrink-0">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Order</DialogTitle>
            </DialogHeader>

            {/* Product Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Products</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {products.filter(p => p.isAvailable).map(product => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto py-2 px-3 justify-between text-left"
                    onClick={() => addToCart(product)}
                  >
                    <span className="text-xs truncate">{product.name}</span>
                    <span className="text-xs font-bold ml-2 shrink-0">R{product.price}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Cart */}
            {cart.length > 0 && (
              <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                <Label className="text-sm font-medium">Cart</Label>
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFromCart(item.productId)}>
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-sm">
                  <span>Total</span>
                  <span>R{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Customer Name</Label>
                <Input placeholder="Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input placeholder="082 123 4567" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
            </div>

            {/* Delivery Method */}
            <div className="flex gap-2">
              <Button
                variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setDeliveryMethod('pickup')}
              >
                <Package className="h-4 w-4 mr-1" />
                Pickup
              </Button>
              <Button
                variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setDeliveryMethod('delivery')}
              >
                <Truck className="h-4 w-4 mr-1" />
                Delivery
              </Button>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="space-y-2">
                <Label className="text-xs">Delivery Address</Label>
                <Textarea
                  placeholder="Full delivery address"
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  rows={2}
                />
                <div className="space-y-1">
                  <Label className="text-xs">Delivery Fee (R)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={deliveryFee}
                    onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs">Note</Label>
              <Input placeholder="Special instructions" value={orderNote} onChange={e => setOrderNote(e.target.value)} />
            </div>

            <Button className="w-full" onClick={createOrder}>
              Create Order — R{cartTotal.toFixed(2)}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Order List */}
      {filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600">No orders yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Orders from your online store and in-store will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const items = JSON.parse(order.items) as CartItem[]
            const isExpanded = expandedOrder === order.id
            const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]

            return (
              <Card key={order.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold">{order.orderNumber}</span>
                        <Badge className={`${status.color} border text-xs`}>
                          {status.icon}
                          <span className="ml-1">{status.label}</span>
                        </Badge>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'} className="text-xs">
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName || 'Walk-in'}
                        {order.customerPhone && ` · ${order.customerPhone}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">R{order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.deliveryMethod === 'delivery' ? '🚚 Delivery' : '📦 Pickup'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <Eye className="h-3 w-3" />
                      {isExpanded ? 'Hide' : 'Details'}
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>

                    {nextStatus && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => updateStatus(order.id, nextStatus)}
                      >
                        Mark as {STATUS_CONFIG[nextStatus]?.label}
                      </Button>
                    )}

                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-red-600"
                        onClick={() => updateStatus(order.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}

                    {order.customerPhone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => sendWhatsApp(order)}
                      >
                        <MessageSquare className="h-3 w-3" />
                        WhatsApp
                      </Button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 border-t pt-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Items:</p>
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>R{order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.deliveryFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Delivery</span>
                            <span>R{order.deliveryFee.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold">
                          <span>Total</span>
                          <span>R{order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {order.customerAddress && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span>{order.customerAddress}</span>
                        </div>
                      )}

                      {order.note && (
                        <div className="bg-yellow-50 rounded-lg p-2 text-xs">
                          📝 {order.note}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => updatePayment(order.id, order.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                        >
                          Mark as {order.paymentStatus === 'paid' ? 'Unpaid' : 'Paid'}
                        </Button>
                        {order.customerPhone && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1"
                            onClick={() => window.open(`tel:${order.customerPhone}`, '_self')}
                          >
                            <Phone className="h-3 w-3" />
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
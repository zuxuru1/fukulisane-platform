import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Plus, Trash2, ShoppingBag } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
}

interface Sale {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  note: string | null
  createdAt: string
}

interface Props {
  businessId: string
  products: Product[]
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export default function SalesTracker({ businessId, products, showToast }: Props) {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [customPrice, setCustomPrice] = useState('')
  const [note, setNote] = useState('')
  const [recording, setRecording] = useState(false)

  const formatR = (n: number) => `R${n.toFixed(2)}`

  useEffect(() => {
    fetch(`/api/businesses/${businessId}/sales?limit=50`)
      .then((r) => r.json())
      .then(setSales)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [businessId])

  const selectedProd = products.find((p) => p.name === selectedProduct)
  const unitPrice = customPrice ? parseFloat(customPrice) : (selectedProd?.price ?? 0)
  const qty = parseInt(quantity) || 1
  const total = unitPrice * qty

  const recordSale = async () => {
    if (!selectedProduct || !unitPrice) return
    setRecording(true)
    try {
      const res = await fetch(`/api/businesses/${businessId}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct,
          quantity: qty,
          unitPrice,
          note: note || null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const sale = await res.json()
      setSales((prev) => [sale, ...prev])
      setSelectedProduct('')
      setQuantity('1')
      setCustomPrice('')
      setNote('')
      showToast(`Sale recorded: ${formatR(sale.total)}! 🎉`)
    } catch {
      showToast('Failed to record sale', 'error')
    } finally {
      setRecording(false)
    }
  }

  const deleteSale = async (id: string) => {
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setSales((prev) => prev.filter((s) => s.id !== id))
      showToast('Sale removed')
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const todayTotal = sales
    .filter((s) => new Date(s.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="py-4 text-center">
            <p className="text-xs text-emerald-600 font-medium">Today's Revenue</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{formatR(todayTotal)}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4 text-center">
            <p className="text-xs text-blue-600 font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{sales.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Record Sale */}
      <Card className="border-emerald-200">
        <CardContent className="pt-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-600" />
            Record a Sale
          </h3>

          {products.length > 0 ? (
            <>
              <div className="space-y-1">
                <Label>What was sold? *</Label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value)
                    setCustomPrice('')
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>{p.name} — {formatR(p.price)}</option>
                  ))}
                  <option value="custom">Other (enter manually)</option>
                </select>
              </div>

              {(selectedProduct === 'custom' || selectedProduct) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Price per unit (R)</Label>
                    <Input
                      type="number"
                      value={customPrice || (selectedProd?.price ?? '')}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      min="0"
                      step="0.10"
                      disabled={selectedProduct !== 'custom' && !!selectedProd}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label>Note (optional)</Label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Cash, card, credit"
                />
              </div>

              {unitPrice > 0 && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                  <p className="text-xs text-emerald-600">Total</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatR(total)}</p>
                </div>
              )}

              <Button
                onClick={recordSale}
                disabled={!selectedProduct || !unitPrice || recording}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                {recording ? 'Recording...' : `Record Sale — ${formatR(total)}`}
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Add products first in the Products tab, then record sales here.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sales History */}
      <Card>
        <CardContent className="py-5">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Sales History ({sales.length})
          </h3>
          {sales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No sales recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sales.map((sale) => (
                <div key={sale.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{sale.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.quantity}× {formatR(sale.unitPrice)}
                      {sale.note ? ` • ${sale.note}` : ''} •{' '}
                      {new Date(sale.createdAt).toLocaleDateString('en-ZA', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 shrink-0">{formatR(sale.total)}</span>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => deleteSale(sale.id)}
                    className="text-red-500 hover:text-red-700 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

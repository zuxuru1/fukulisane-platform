import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ImageUploader from '@/components/ImageUploader'
import { ShoppingBag, Plus, Trash2, Pencil, Check, X, Camera } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  isAvailable: boolean
}

interface Props {
  businessId: string
  products: Product[]
  onUpdated: () => void
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export default function ProductManager({ businessId, products, onUpdated, showToast }: Props) {
  const [items, setItems] = useState<Product[]>(products)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [uploadingImageFor, setUploadingImageFor] = useState<string | 'new' | null>(null)

  const formatR = (n: number) => `R${n.toFixed(2)}`

  const addProduct = async () => {
    if (!form.name || !form.price) return
    setAdding(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const created = await res.json()
      setItems((prev) => [...prev, created])
      setForm({ name: '', description: '', price: '' })
      showToast('Product added!')
    } catch {
      showToast('Failed to add product', 'error')
    } finally {
      setAdding(false)
    }
  }

  const updateProduct = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      const updated = await res.json()
      setItems((prev) => prev.map((p) => (p.id === id ? updated : p)))
      setEditingId(null)
      setForm({ name: '', description: '', price: '' })
      showToast('Product updated!')
    } catch {
      showToast('Failed to update product', 'error')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setItems((prev) => prev.filter((p) => p.id !== id))
      showToast('Product removed')
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setForm({ name: p.name, description: p.description || '', price: String(p.price) })
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200">
        <CardContent className="pt-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-600" />
            Add a Product
          </h3>
          {uploadingImageFor === 'new' ? (
            <ImageUploader
              label="Product Photo"
              aspectRatio="square"
              onImageReady={(img) => {
                setForm((f) => ({ ...f, imageUrl: img } as any))
                setUploadingImageFor(null)
              }}
              onCancel={() => setUploadingImageFor(null)}
            />
          ) : (
            <>
              {((form as any).imageUrl) && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={(form as any).imageUrl} alt="" className="w-full h-full object-cover" />
                  <Button variant="destructive" size="icon"
                    className="absolute top-0 right-0 h-5 w-5"
                    onClick={() => setForm((f) => { const copy = { ...f }; delete (copy as any).imageUrl; return copy })}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Product name (e.g. Cappuccino)"
                  onKeyDown={(e) => e.key === 'Enter' && addProduct()}
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">R</span>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-24"
                    min="0"
                    step="0.10"
                    onKeyDown={(e) => e.key === 'Enter' && addProduct()}
                  />
                </div>
              </div>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setUploadingImageFor('new')}>
                  <Camera className="h-3.5 w-3.5 mr-1" /> Add Photo
                </Button>
                <Button
                  onClick={addProduct}
                  disabled={!form.name || !form.price || adding}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {adding ? 'Adding...' : 'Add Product'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">No products yet. Add one above!</p>
            </CardContent>
          </Card>
        ) : (
          items.map((product) => (
            <Card key={product.id}>
              <CardContent className="py-4">
                {editingId === product.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Product name"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">R</span>
                        <Input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          className="w-24"
                          min="0"
                          step="0.10"
                        />
                      </div>
                    </div>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateProduct(product.id, {
                          name: form.name,
                          description: form.description,
                          price: parseFloat(form.price),
                        })}
                        disabled={!form.name || !form.price}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-3.5 w-3.5 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {product.imageUrl ? (
                      <div className="relative group shrink-0">
                        <img src={product.imageUrl} alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover" />
                        <button
                          onClick={() => setUploadingImageFor(product.id)}
                          className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Camera className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setUploadingImageFor(product.id)}
                        className="h-12 w-12 rounded-lg bg-gray-100 border-dashed border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors shrink-0"
                      >
                        <Camera className="h-5 w-5" />
                      </button>
                    )}
                    {uploadingImageFor === product.id ? (
                      <div className="flex-1">
                        <ImageUploader
                          label={`Photo for ${product.name}`}
                          aspectRatio="square"
                          onImageReady={async (img) => {
                            await updateProduct(product.id, { imageUrl: img })
                            setUploadingImageFor(null)
                          }}
                          onCancel={() => setUploadingImageFor(null)}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                          )}
                          {!product.imageUrl && (
                            <Badge variant="outline" className="text-[10px] mt-1">No photo</Badge>
                          )}
                        </div>
                        <span className="text-lg font-bold text-emerald-600 shrink-0">
                          {formatR(product.price)}
                        </span>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => startEdit(product)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {items.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {items.length} product{items.length !== 1 ? 's' : ''} — Total catalog value: {formatR(items.reduce((sum, p) => sum + p.price, 0))}
        </p>
      )}
    </div>
  )
}

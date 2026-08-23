import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Store, ArrowRight, ArrowLeft, Plus, Trash2, Check, Zap,
  Rocket, Package, Image as ImageIcon, X
} from 'lucide-react'

const CATEGORIES = [
  'Restaurant & Food', 'Retail & Shopping', 'Beauty & Salon',
  'Health & Fitness', 'Professional Services', 'Automotive',
  'Education & Training', 'Home Services', 'Entertainment', 'Other',
]

interface Props {
  onStoreCreated: (business: any) => void
}

export default function StoreBuilder({ onStoreCreated }: Props) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [biz, setBiz] = useState({
    name: '', slug: '', category: '', description: '', tagline: '',
    phone: '', whatsapp: '', email: '', city: '', address: '',
    primaryColor: '#10b981', secondaryColor: '#059669', accentColor: '#34d399',
  })

  const [products, setProducts] = useState<{ name: string; description: string; price: string; imageUrl: string }[]>([])
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '' })

  const updateBiz = (field: string, value: string) => setBiz(prev => ({ ...prev, [field]: value }))

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    setProducts([...products, { ...newProduct }])
    setNewProduct({ name: '', description: '', price: '', imageUrl: '' })
  }

  const removeProduct = (idx: number) => setProducts(products.filter((_, i) => i !== idx))

  const canNext = () => {
    if (step === 1) return biz.name && biz.category && biz.whatsapp
    if (step === 2) return true
    return true
  }

  const handleCreate = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...biz,
          slug: biz.slug || autoSlug(biz.name),
          userId: 'demo-user-001',
        }),
      })
      if (!res.ok) throw new Error('Failed to create business')
      const created = await res.json()

      for (const p of products) {
        await fetch('/api/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: p.name, description: p.description, price: parseFloat(p.price),
            imageUrl: p.imageUrl || null, businessId: created.id, isAvailable: true,
          }),
        })
      }

      await fetch(`/api/store/deploy/${created.id}`, { method: 'POST' })
      onStoreCreated(created)
    } catch (e) {
      console.error(e)
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Fukulisane Mall</h1>
            <p className="text-xs text-muted-foreground">Your AI-powered online store</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                step >= s ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {s === 1 ? 'Your Business' : s === 2 ? 'Add Products' : 'Go Live'}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-emerald-600' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Tell us about your business</h2>
              <p className="text-sm text-muted-foreground mt-1">This info appears on your public store page.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Business Name *</Label>
                <Input value={biz.name} onChange={e => updateBiz('name', e.target.value)}
                  placeholder="e.g. Mama Zodwa Kitchen" />
              </div>
              <div>
                <Label>Category *</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => updateBiz('category', c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        biz.category === c
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input value={biz.city} onChange={e => updateBiz('city', e.target.value)} placeholder="e.g. Johannesburg" />
                </div>
                <div>
                  <Label>WhatsApp Number *</Label>
                  <Input value={biz.whatsapp} onChange={e => updateBiz('whatsapp', e.target.value)} placeholder="e.g. +27821234567" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input value={biz.phone} onChange={e => updateBiz('phone', e.target.value)} placeholder="Optional" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={biz.email} onChange={e => updateBiz('email', e.target.value)} placeholder="Optional" />
                </div>
              </div>
              <div>
                <Label>Tagline</Label>
                <Input value={biz.tagline} onChange={e => updateBiz('tagline', e.target.value)}
                  placeholder="e.g. Fresh meals, delivered fast!" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={biz.description} onChange={e => updateBiz('description', e.target.value)}
                  placeholder="Tell customers what makes your business special..." rows={3} />
              </div>
              <div>
                <Label>Store Address</Label>
                <Input value={biz.address} onChange={e => updateBiz('address', e.target.value)} placeholder="Street address" />
              </div>
              <div>
                <Label>Brand Color</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="color" value={biz.primaryColor} onChange={e => updateBiz('primaryColor', e.target.value)}
                    className="h-10 w-10 rounded-lg border cursor-pointer" />
                  <Input value={biz.primaryColor} onChange={e => updateBiz('primaryColor', e.target.value)}
                    className="w-32 font-mono" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Add your products</h2>
              <p className="text-sm text-muted-foreground mt-1">Add at least 1 product. You can always add more later.</p>
            </div>

            {/* Add Product Form */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Product Name *</Label>
                    <Input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Protein Shake" />
                  </div>
                  <div>
                    <Label className="text-xs">Price (R) *</Label>
                    <Input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="What is this product?" />
                </div>
                <div>
                  <Label className="text-xs">Image URL (paste a link)</Label>
                  <Input value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg" />
                </div>
                <Button onClick={addProduct} disabled={!newProduct.name || !newProduct.price} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Product
                </Button>
              </CardContent>
            </Card>

            {/* Product List */}
            {products.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{products.length} product{products.length !== 1 ? 's' : ''} added</p>
                {products.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">R{parseFloat(p.price).toLocaleString()}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeProduct(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No products yet. Add one above!</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Review & Go Live</h2>
              <p className="text-sm text-muted-foreground mt-1">Check everything looks good, then publish your store.</p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: biz.primaryColor }}>
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">{biz.name}</h3>
                    <p className="text-xs text-muted-foreground">{biz.category} • {biz.city || 'South Africa'}</p>
                  </div>
                </div>
                {biz.tagline && <p className="text-sm italic text-muted-foreground">"{biz.tagline}"</p>}
                {biz.description && <p className="text-sm">{biz.description}</p>}
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">✓</p>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">✓</p>
                  <p className="text-xs text-muted-foreground">SEO Ready</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                  <Rocket className="h-4 w-4" /> What happens when you publish:
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-emerald-700">
                  <li>• Your store goes live instantly</li>
                  <li>• Customers can browse products & order via WhatsApp</li>
                  <li>• You get a shareable link: yourstore.fukulisane.co.za</li>
                  <li>• AI engines start monitoring your business</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          ) : <div />}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={saving}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700">
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Rocket className="h-4 w-4" /> Publish Store</span>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

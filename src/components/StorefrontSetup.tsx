import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, Store, MapPin, Phone, ShoppingBag, Plus, Trash2, Check } from 'lucide-react'

const CATEGORIES = [
  'Restaurant & Food', 'Retail & Shopping', 'Beauty & Salon',
  'Health & Fitness', 'Professional Services', 'Automotive',
  'Education & Training', 'Home Services', 'Entertainment', 'Other',
]

interface Product {
  name: string
  description: string
  price: number
}

interface Props {
  onSave: (data: {
    name: string; slug: string; description: string; category: string;
    address: string; city: string; country: string; phone: string;
    whatsapp: string; googleMapsUrl: string; openingHours: string;
    videoUrl: string;
    products: Product[];
  }) => Promise<void>
}

export default function StorefrontSetup({ onSave }: Props) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', category: '',
    address: '', city: '', country: 'South Africa', phone: '',
    whatsapp: '', googleMapsUrl: '', openingHours: '', videoUrl: '',
  })
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Product>({ name: '', description: '', price: 0 })

  const update = (key: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && !prev.slug) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }
      return next
    })
  }

  const addProduct = () => {
    if (!newProduct.name) return
    setProducts((prev) => [...prev, { ...newProduct }])
    setNewProduct({ name: '', description: '', price: 0 })
  }

  const removeProduct = (i: number) => {
    setProducts((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await onSave({ ...form, products })
    } finally {
      setSaving(false)
    }
  }

  const canNext = step === 1
    ? form.name.trim().length > 0
    : step === 2
      ? true
      : true

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8 px-1">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
              step >= s ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${step >= s ? 'text-emerald-700' : 'text-muted-foreground'}`}>
              {s === 1 ? 'Your Business' : s === 2 ? 'Location' : 'Products'}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 rounded ${step > s ? 'bg-emerald-600' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Business Basics */}
      {step === 1 && (
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6 text-emerald-600" />
              Tell us about your business
            </h2>
            <p className="text-muted-foreground mt-1">Just the basics — we'll have you live in under 2 minutes.</p>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Sunrise Café" autoFocus />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => update('category', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">What makes you special?</Label>
                <Textarea id="desc" value={form.description} onChange={(e) => update('description', e.target.value)}
                  placeholder="e.g. Fresh coffee & homemade muffins since 2019" rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input id="whatsapp" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                  placeholder="+27 82 345 6789" />
                <p className="text-xs text-muted-foreground">This is how customers will contact you. Include country code.</p>
              </div>
              {form.slug && (
                <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200">
                  <p className="text-xs text-emerald-700">Your public link:</p>
                  <p className="text-sm font-mono text-emerald-800 font-medium">
                    {window.location.host}/?store={form.slug}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-emerald-600" />
              Where can people find you?
            </h2>
            <p className="text-muted-foreground mt-1">Help customers locate your shop or come to you.</p>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" value={form.address} onChange={(e) => update('address', e.target.value)}
                  placeholder="e.g. 42 Commissioner Street" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City / Town</Label>
                  <Input id="city" value={form.city} onChange={(e) => update('city', e.target.value)}
                    placeholder="e.g. Johannesburg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country} onChange={(e) => update('country', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maps">Google Maps Link (optional)</Label>
                <Input id="maps" value={form.googleMapsUrl} onChange={(e) => update('googleMapsUrl', e.target.value)}
                  placeholder="Paste your Google Maps share link" />
                <p className="text-xs text-muted-foreground">
                  Open Google Maps → find your business → Share → Copy link
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Opening Hours</Label>
                <Input id="hours" value={form.openingHours} onChange={(e) => update('openingHours', e.target.value)}
                  placeholder="e.g. Mon-Fri 8AM-5PM, Sat 9AM-2PM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  placeholder="+27 11 234 5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video">Promo Video URL (optional)</Label>
                <Input id="video" value={form.videoUrl} onChange={(e) => update('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or any video link" />
                <p className="text-xs text-muted-foreground">
                  A video banner that plays on your storefront. YouTube, Vimeo, or direct MP4 links work.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Products */}
      {step === 3 && (
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-emerald-600" />
              What do you sell?
            </h2>
            <p className="text-muted-foreground mt-1">Add your top items. You can always add more later.</p>
          </div>

          {/* Add Product Form */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Product name" onKeyDown={(e) => e.key === 'Enter' && addProduct()} />
                <Input type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="Price" className="w-28" />
              </div>
              <div className="flex gap-2">
                <Input value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description (optional)" className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && addProduct()} />
                <Button onClick={addProduct} disabled={!newProduct.name} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product List */}
          {products.length > 0 && (
            <div className="space-y-2">
              {products.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                  <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{p.name}</p>
                    {p.description && <p className="text-xs text-muted-foreground truncate">{p.description}</p>}
                  </div>
                  {p.price > 0 && (
                    <span className="text-sm font-bold text-emerald-600">R{p.price.toFixed(2)}</span>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => removeProduct(i)} className="text-red-500 hover:text-red-700 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No products yet. Add at least one above.</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 mt-auto border-t">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : <div />}

        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}
            className="bg-emerald-600 hover:bg-emerald-700">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={saving || !form.name}
            className="bg-emerald-600 hover:bg-emerald-700" size="lg">
            {saving ? 'Going Live...' : '🚀 Go Live'}
          </Button>
        )}
      </div>
    </div>
  )
}

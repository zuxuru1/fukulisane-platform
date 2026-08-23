import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ImageUploader from '@/components/ImageUploader'
import AIGenerator from '@/components/AIGenerator'
import {
  DollarSign, ShoppingBag, TrendingUp, TrendingDown,
  ArrowUpRight, Share2, Eye, Copy, Check,
  Clock, MapPin, Phone, Camera, Globe, Sparkles,
} from 'lucide-react'

interface Stats {
  productCount: number
  todaySales: number
  weekSales: number
  monthSales: number
  totalRevenue: number
  todayRevenue: number
  recentSales: { id: string; productName: string; quantity: number; total: number; createdAt: string }[]
}

interface Business {
  id: string
  name: string
  slug: string
  description: string
  category: string
  address: string
  city: string
  country: string
  phone: string
  whatsapp: string
  openingHours: string
  products: { id: string; name: string; price: number }[]
}

export default function StoreDashboard({ business, showToast }: { business: Business; showToast?: (msg: string, type?: 'success' | 'error') => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/businesses/${business.id}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
  }, [business.id])

  const formatR = (n: number) => `R${n.toFixed(2)}`

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?store=${business.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const url = `${window.location.origin}?store=${business.slug}`
    const msg = `Check out ${business.name}! 🛍️\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Quick Share */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Your Store Link</p>
              <p className="font-mono text-sm font-medium mt-0.5">
                {window.location.host}/public/{business.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="h-9 px-3 rounded-lg bg-white/20 hover:bg-white/30 flex items-center gap-1.5 text-sm transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={shareWhatsApp}
                className="h-9 px-3 rounded-lg bg-white/20 hover:bg-white/30 flex items-center gap-1.5 text-sm transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-lg font-bold">{stats ? formatR(stats.todayRevenue) : '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-lg font-bold">{stats ? `${stats.weekSales} sales` : '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-lg font-bold">{stats ? formatR(stats.totalRevenue) : '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Products</p>
                <p className="text-lg font-bold">{stats?.productCount ?? '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Info — Opening Hours, Address, Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Opening Hours</p>
                {business.openingHours ? (
                  <p className="text-sm font-medium leading-snug">{business.openingHours}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not set</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Address</p>
                {business.address ? (
                  <p className="text-sm font-medium leading-snug">
                    {business.address}{business.city ? `, ${business.city}` : ''}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not set</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Contact</p>
                {business.phone ? (
                  <p className="text-sm font-medium leading-snug">{business.phone}</p>
                ) : business.whatsapp ? (
                  <p className="text-sm font-medium leading-snug">{business.whatsapp} (WhatsApp)</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not set</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Maps Registration & Business Photo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Google Maps</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Register your store on Google Maps so customers can find you
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => {
                    const query = encodeURIComponent(
                      `${business.name} ${business.address || ''} ${business.city || ''}`
                    )
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
                  }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Find on Google Maps
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Camera className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Business Photo</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Add your shop photo for Google Maps & your storefront
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.capture = 'environment'
                    input.onchange = async (e: any) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = async (ev) => {
                        const dataUrl = ev.target?.result as string
                        await fetch(`/api/businesses/${business.id}/photo`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ businessPhotoUrl: dataUrl }),
                        })
                        window.location.reload()
                      }
                      reader.readAsDataURL(file)
                    }
                    input.click()
                  }}
                >
                  <Camera className="h-3.5 w-3.5" />
                  Take / Upload Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Content Generator */}
      <AIGenerator
        business={business}
        onUpdated={() => {}}
        showToast={(msg, type) => showToast?.(msg, type)}
      />

      {/* Recent Sales */}
      <Card>
        <CardContent className="py-5">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Recent Sales
          </h3>
          {stats && stats.recentSales.length > 0 ? (
            <div className="space-y-2">
              {stats.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{sale.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.quantity}× — {new Date(sale.createdAt).toLocaleDateString('en-ZA', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">{formatR(sale.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No sales yet. Record your first sale in the Sales tab.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Setup Checklist */}
      <Card>
        <CardContent className="py-5">
          <h3 className="font-bold mb-3">Quick Checklist</h3>
          <div className="space-y-2">
            {[
              { done: !!business.name, label: 'Business profile set up' },
              { done: business.products.length > 0, label: 'Products added' },
              { done: !!business.whatsapp, label: 'WhatsApp number added' },
              { done: !!business.address, label: 'Address / location set' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <Check className={`h-4 w-4 ${item.done ? 'text-emerald-600' : 'text-muted-foreground/30'}`} />
                <span className={`text-sm ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

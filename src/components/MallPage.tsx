import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { MapPin, Search, Store, Package } from 'lucide-react'

interface MallBusiness {
  id: string; name: string; slug: string; description: string; category: string;
  city: string; primaryColor: string; storeStatus: string;
  products: { id: string }[]; socialLinks: { platform: string }[]
}

const CATEGORY_EMOJI: Record<string, string> = {
  gym: '🏋️', restaurant: '🍽️', retail: '🛍️', salon: '💇', cafe: '☕',
  bakery: '🧁', grocery: '🥬', automotive: '🚗', default: '🏪',
}

export default function MallPage() {
  const [businesses, setBusinesses] = useState<MallBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/businesses')
      .then(r => r.json())
      .then(d => setBusinesses(Array.isArray(d) ? d : d?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = businesses.filter(b =>
    b.storeStatus === 'live' && (
      !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase()) ||
      b.city?.toLowerCase().includes(search.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading stores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Store className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Fukulisane Mall</h1>
          </div>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Your local digital marketplace. Browse stores, discover products, and shop from businesses in your community.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text" placeholder="Search stores, categories, locations..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm border-0 shadow-lg focus:ring-2 focus:ring-white/50 outline-none"
            />
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-emerald-100">
            <span className="flex items-center gap-1"><Store className="h-4 w-4" /> {businesses.length} Stores</span>
            <span className="flex items-center gap-1">📍 South Africa</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold">All Stores</h2>
          <Badge variant="secondary">{filtered.length}</Badge>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No stores found</p>
            <p className="text-sm text-muted-foreground">Try a different search term</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(biz => (
            <a key={biz.id} href={`?store=${biz.slug}`}
              className="group block bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="h-3 w-full" style={{ background: biz.primaryColor || '#10b981' }} />
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${biz.primaryColor}15` }}>
                    {CATEGORY_EMOJI[biz.category] || CATEGORY_EMOJI.default}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg group-hover:text-emerald-600 transition truncate">{biz.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{biz.category}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{biz.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  {biz.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {biz.city}</span>}
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {biz.products?.length || 0} products</span>
                </div>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  View Store →
                </Badge>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

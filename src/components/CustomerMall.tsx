import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search, MapPin, Star, ShoppingCart, Heart, TrendingUp,
  Store, ArrowRight, Sparkles, Globe, Package, Truck,
  Tag, Zap, ChevronRight, Eye, Users
} from 'lucide-react'

interface Business { id: string; name: string; category?: string }
interface Props { business: Business; showToast: (msg: string, type?: 'success' | 'error') => void }

const CATEGORIES = [
  { name: 'Fashion', icon: '👗', count: 42 },
  { name: 'Electronics', icon: '📱', count: 38 },
  { name: 'Health & Beauty', icon: '💄', count: 31 },
  { name: 'Grocery', icon: '🛒', count: 28 },
  { name: 'Home & Garden', icon: '🏠', count: 22 },
  { name: 'Sports', icon: '⚽', count: 18 },
  { name: 'Pets', icon: '🐾', count: 14 },
  { name: 'Automotive', icon: '🚗', count: 12 },
]

const FEATURED_STORES = [
  { name: 'Thabo Fashion House', category: 'Fashion', rating: 4.9, products: 245, followers: 1240, image: 'T', tag: 'Featured', city: 'Johannesburg' },
  { name: 'Cape Electronics', category: 'Electronics', rating: 4.8, products: 189, followers: 980, image: 'C', tag: 'Top Rated', city: 'Cape Town' },
  { name: 'Ubuntu Health Store', category: 'Health & Beauty', rating: 4.7, products: 156, followers: 870, image: 'U', tag: 'Popular', city: 'Pretoria' },
  { name: 'Durban Surf Co', category: 'Fashion', rating: 4.8, products: 98, followers: 650, image: 'D', tag: 'New', city: 'Durban' },
  { name: 'JHB Organic Market', category: 'Grocery', rating: 4.6, products: 312, followers: 1420, image: 'J', tag: 'Trending', city: 'Johannesburg' },
  { name: 'Pretoria Pet Supplies', category: 'Pets', rating: 4.5, products: 134, followers: 560, image: 'P', tag: 'Local', city: 'Pretoria' },
]

const TRENDING_PRODUCTS = [
  { name: 'Premium Leather Bag', price: 'R 1,200', store: 'Thabo Fashion', rating: 4.9, sold: 342 },
  { name: 'Wireless Earbuds Pro', price: 'R 450', store: 'Cape Electronics', rating: 4.8, sold: 567 },
  { name: 'Organic Face Cream', price: 'R 180', store: 'Ubuntu Health', rating: 4.7, sold: 891 },
  { name: 'Bamboo Water Bottle', price: 'R 120', store: 'JHB Organic', rating: 4.6, sold: 423 },
  { name: 'Cotton Throw Blanket', price: 'R 380', store: 'Durban Surf', rating: 4.5, sold: 198 },
  { name: 'Protein Powder 1kg', price: 'R 420', store: 'Ubuntu Health', rating: 4.8, sold: 654 },
]

const NEARBY_STORES = [
  { name: 'Corner Cafe', distance: '0.5 km', products: 45, rating: 4.3 },
  { name: 'Tech Hub', distance: '1.2 km', products: 120, rating: 4.6 },
  { name: 'Fresh Market', distance: '1.8 km', products: 230, rating: 4.4 },
  { name: 'Style Studio', distance: '2.1 km', products: 87, rating: 4.7 },
]

export default function CustomerMall({ business, showToast }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const tagColors: Record<string, string> = {
    Featured: 'bg-amber-100 text-amber-700',
    'Top Rated': 'bg-emerald-100 text-emerald-700',
    Popular: 'bg-purple-100 text-purple-700',
    New: 'bg-blue-100 text-blue-700',
    Trending: 'bg-rose-100 text-rose-700',
    Local: 'bg-cyan-100 text-cyan-700',
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 h-40 w-40 rounded-full bg-white" />
          <div className="absolute bottom-4 left-10 h-24 w-24 rounded-full bg-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">FUKULISANE Mall</h1>
          <p className="text-white/80 mb-4">South Africa's AI-Powered Digital Marketplace</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stores, products, categories..."
              className="pl-10 bg-white/90 text-gray-900 border-0 placeholder:text-gray-400"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-white/70">
            <span className="flex items-center gap-1"><Store className="h-3 w-3" />247 stores</span>
            <span className="flex items-center gap-1"><Package className="h-3 w-3" />12,400+ products</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />9 provinces</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Categories</h2>
          <Button variant="ghost" size="sm" className="text-xs">View All <ChevronRight className="h-3 w-3 ml-1" /></Button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${selectedCategory === cat.name ? 'bg-indigo-50 border-indigo-300' : 'bg-white hover:shadow-sm'}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] font-medium text-center leading-tight">{cat.name}</span>
              <span className="text-[9px] text-muted-foreground">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Stores */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Featured Stores</h2>
          <Button variant="ghost" size="sm" className="text-xs">See All <ChevronRight className="h-3 w-3 ml-1" /></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {FEATURED_STORES.map(store => (
            <Card key={store.name} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-24 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white/80">{store.image}</span>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{store.name}</h3>
                      <Badge className={`${tagColors[store.tag] || 'bg-gray-100 text-gray-700'} text-[10px]`}>{store.tag}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{store.city} · {store.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{store.rating}</span>
                  <span>{store.products} products</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{store.followers}</span>
                </div>
                <Button className="w-full mt-3" size="sm" onClick={() => showToast(`Opening ${store.name}...`)}>Visit Store <ArrowRight className="h-3 w-3 ml-1" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" />Trending Products</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {TRENDING_PRODUCTS.map(product => (
            <Card key={product.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Package className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">by {product.store}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm">{product.price}</span>
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{product.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">{product.sold} sold</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Heart className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => showToast('Added to cart')}><ShoppingCart className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Nearby & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="p-4 border-b">
            <h3 className="font-bold text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" />Nearby Stores</h3>
          </div>
          <CardContent className="space-y-2 pt-3">
            {NEARBY_STORES.map(store => (
              <div key={store.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><Store className="h-4 w-4 text-blue-600" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{store.name}</p>
                  <p className="text-xs text-muted-foreground">{store.distance} · {store.products} products</p>
                </div>
                <span className="text-xs text-muted-foreground">⭐ {store.rating}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <div className="p-4 border-b">
            <h3 className="font-bold text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" />Quick Actions</h3>
          </div>
          <CardContent className="space-y-2 pt-3">
            {[
              { label: 'Sell on FUKULISANE', desc: 'Lease your AI-powered store', icon: Store, color: 'from-indigo-500 to-purple-600' },
              { label: 'Refer a Business', desc: 'Earn rewards for referrals', icon: Users, color: 'from-emerald-500 to-teal-600' },
              { label: 'Track Order', desc: 'Check delivery status', icon: Truck, color: 'from-blue-500 to-cyan-600' },
              { label: 'AI Shopping Assistant', desc: 'Let AI find what you need', icon: Sparkles, color: 'from-amber-500 to-orange-600' },
            ].map(action => (
              <button key={action.label} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm transition w-full text-left" onClick={() => showToast(action.label)}>
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}><action.icon className="h-4 w-4 text-white" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

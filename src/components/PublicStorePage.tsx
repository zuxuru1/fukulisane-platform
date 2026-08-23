import { useState, useEffect } from 'react'
import Storefront from '@/components/Storefront'

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
  email: string
  website: string
  whatsapp: string
  googleMapsUrl: string
  openingHours: string
  coverUrl: string | null
  logoUrl: string | null
  socialLinks: { platform: string; url: string }[]
  products: { name: string; description: string; price: number; imageUrl: string }[]
}

export default function PublicStorePage({ slug }: { slug: string }) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/store/${slug}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(setBusiness)
      .catch(() => setError('Store not found'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
          <p className="mt-3 text-sm text-muted-foreground">Loading store...</p>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🏪</p>
          <h2 className="text-xl font-bold">Store Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1">{error || 'This store does not exist.'}</p>
        </div>
      </div>
    )
  }

  return <Storefront slug={business.slug} />
}

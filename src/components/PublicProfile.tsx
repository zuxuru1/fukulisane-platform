import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  MapPin, Phone, Mail, Globe, Clock, MessageCircle, ExternalLink, Share2,
  ShoppingBag, Star,
} from 'lucide-react'

interface BusinessData {
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
}

interface SocialLink {
  platform: string
  url: string
}

interface Product {
  name: string
  description: string
  price: number
  imageUrl: string
}

interface Props {
  business: BusinessData
  socialLinks: SocialLink[]
  products: Product[]
}

const PLATFORM_ICONS: Record<string, { label: string; color: string; letter: string }> = {
  instagram: { label: 'Instagram', color: '#E4405F', letter: 'IG' },
  facebook: { label: 'Facebook', color: '#1877F2', letter: 'FB' },
  tiktok: { label: 'TikTok', color: '#000000', letter: 'TT' },
  twitter: { label: 'X', color: '#1DA1F2', letter: 'X' },
  youtube: { label: 'YouTube', color: '#FF0000', letter: 'YT' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', letter: 'LI' },
  pinterest: { label: 'Pinterest', color: '#BD081C', letter: 'PT' },
  threads: { label: 'Threads', color: '#000000', letter: 'TH' },
}

export default function PublicProfile({ business, socialLinks, products }: Props) {
  const whatsappNumber = business.whatsapp?.replace(/[^0-9]/g, '')
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I found ${business.name} and would like to know more.`)}` : null

  const handleShare = () => {
    const url = `${window.location.origin}/public/${business.slug}`
    if (navigator.share) {
      navigator.share({ title: business.name, url })
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-32 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative">
          <div className="absolute -bottom-8 left-4">
            <div className="h-16 w-16 rounded-xl bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-emerald-600 border-2 border-white">
              {business.name?.charAt(0) || 'B'}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share
          </Button>
        </div>

        <CardContent className="pt-12 pb-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold">{business.name}</h2>
            {business.category && (
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                {business.category}
              </span>
            )}
            {business.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{business.description}</p>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((link) => {
                const platform = PLATFORM_ICONS[link.platform]
                if (!platform) return null
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.letter}
                    <span className="hidden sm:inline">{platform.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                )
              })}
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            {business.address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p>{business.address}</p>
                  {business.city && <p className="text-muted-foreground">{business.city}{business.country ? `, ${business.country}` : ''}</p>}
                  {business.googleMapsUrl && (
                    <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-xs">
                      Open in Google Maps →
                    </a>
                  )}
                </div>
              </div>
            )}
            {business.openingHours && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                <p>{business.openingHours}</p>
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <a href={`tel:${business.phone}`} className="hover:underline">{business.phone}</a>
              </div>
            )}
            {business.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:underline">{business.email}</a>
              </div>
            )}
            {business.website && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-600">
                  {business.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>

          {waLink && (
            <>
              <Separator />
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" size="lg">
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
            </>
          )}

          {!waLink && business.phone && (
            <>
              <Separator />
              <a href={`tel:${business.phone}`} className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2" size="lg">
                  <Phone className="h-5 w-5" />
                  Call Now
                </Button>
              </a>
            </>
          )}
        </CardContent>
      </Card>

      {products.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-orange-600" />
              Products & Services
            </h3>
            <div className="space-y-3">
              {products.map((product, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  {product.price > 0 && (
                    <span className="text-sm font-bold text-emerald-600 whitespace-nowrap">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Star className="h-3 w-3" />
          Powered by LocalBiz Connect
        </p>
      </div>
    </div>
  )
}

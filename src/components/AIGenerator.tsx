import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles, Wand2, Copy, Check, RefreshCw, Save, Tag,
  FileText, MessageCircle, Globe, Megaphone,
} from 'lucide-react'

interface Business {
  id: string
  name: string
  slug: string
  description: string
  category: string
  address: string
  city: string
  openingHours: string
}

interface Props {
  business: Business
  onUpdated: () => void
  showToast: (msg: string, type?: 'success' | 'error') => void
}

const CATEGORY_CONTENT: Record<string, {
  descriptions: string[]
  bios: string[]
  tags: string[]
  offers: string[]
}> = {
  'Construction & Building': {
    descriptions: [
      'Professional construction services from foundation to finish. Quality builds, honest pricing, guaranteed workmanship.',
      'Building dreams into reality — from new homes to renovations, we deliver excellence on every project.',
      'Trusted builders in KwaZulu-Natal. We handle everything: new builds, extensions, roofing, paving, and renovations.',
    ],
    bios: ['🏗️ Building dreams, one brick at a time', '🏠 Quality construction, honest service', '🔨 Your trusted builders in KZN'],
    tags: ['Construction', 'Builders', 'Renovation', 'House', 'Roofing', 'Paving', 'Extensions', 'KwaZulu-Natal'],
    offers: ['Free site inspection & quote', '10% off house extensions this month', 'Refer a friend — get R500 off your next project'],
  },
  'Renovation & Maintenance': {
    descriptions: [
      'Transform your space with expert renovations. Kitchens, bathrooms, ceilings, painting — we do it all.',
      'Revitalise your property with professional renovation services. Fresh finishes, modern designs, lasting quality.',
      'From minor repairs to full property makeovers. Keep your home in top condition with our maintenance team.',
    ],
    bios: ['✨ Renovations that transform', '🔧 Property maintenance experts', '🏡 Your home, upgraded'],
    tags: ['Renovation', 'Kitchen', 'Bathroom', 'Painting', 'Plastering', 'Tiling', 'Ceiling', 'Maintenance'],
    offers: ['Free renovation consultation', 'Kitchen makeover from R45,000', 'Annual maintenance contract — save 15%'],
  },
  'Spaza Shop': {
    descriptions: [
      'Your one-stop shop for everyday essentials. Quality products, convenient location, fair prices.',
      'Everything you need, right around the corner. Groceries, airtime, and more — we have it.',
      'Making your day easier with all the basics in one place. Open early, close late.',
    ],
    bios: ['🛒 Everything you need', '🏪 Your corner shop', '🛍️ Convenient & affordable'],
    tags: ['Groceries', 'Airtime', 'Data', 'Essentials', 'Snacks', 'Bread', 'Milk', 'Convenience'],
    offers: ['Airtime & data deals', 'Bread & milk special', 'Buy 2 get 1 free on snacks'],
  },
  'default': {
    descriptions: [
      'Quality products and services at fair prices. We are here to serve our community.',
      'Your trusted local business. Come see what we have to offer.',
      'Built on trust, driven by quality. We deliver what we promise.',
    ],
    bios: ['🌟 Quality you can trust', '💼 Your local experts', '📍 Right here in your area'],
    tags: ['Local', 'Quality', 'Trusted', 'Community', 'Service', 'Affordable'],
    offers: ['Welcome special — 10% off your first visit', 'Refer a friend and save', 'Loyalty rewards program'],
  },
}

const SOCIAL_BIOS: Record<string, string[]> = {
  instagram: [
    '📍 {city} | 🛍️ {name}\n✨ Shop local, live better\n👇 Order below',
    '🏪 {name}\n💬 DM to order | 📦 Delivery available\n🏷️ Best prices in {city}',
  ],
  facebook: [
    'Welcome to {name}! Your go-to {category} in {city}. Like our page for deals and updates.',
    '{name} — Quality {category} products and services. Visit us or order online!',
  ],
  tiktok: [
    '🔥 {name} | {city}\nFollow for daily content!',
    'Behind the scenes at {name} 🎬\n{city}\'s best {category}',
  ],
}

export default function AIGenerator({ business, onUpdated, showToast }: Props) {
  const [activeTab, setActiveTab] = useState<'description' | 'social' | 'tags' | 'offers'>('description')
  const [generatedDesc, setGeneratedDesc] = useState(business.description || '')
  const [generatedBio, setGeneratedBio] = useState('')
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [generatedOffers, setGeneratedOffers] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  const getContent = () => {
    return CATEGORY_CONTENT[business.category] || CATEGORY_CONTENT['default']
  }

  const generateDescription = () => {
    setGenerating(true)
    setTimeout(() => {
      const content = getContent()
      const random = content.descriptions[Math.floor(Math.random() * content.descriptions.length)]
      setGeneratedDesc(random)
      setGenerating(false)
    }, 800)
  }

  const generateSocialBio = (platform: string) => {
    const bios = SOCIAL_BIOS[platform] || SOCIAL_BIOS['instagram']
    const template = bios[Math.floor(Math.random() * bios.length)]
    const filled = template
      .replace('{name}', business.name)
      .replace('{city}', business.city || 'your area')
      .replace('{category}', business.category?.toLowerCase() || 'business')
    setGeneratedBio(filled)
    return filled
  }

  const generateTags = () => {
    setGenerating(true)
    setTimeout(() => {
      const content = getContent()
      const shuffled = [...content.tags].sort(() => Math.random() - 0.5)
      setGeneratedTags(shuffled.slice(0, 6))
      setGenerating(false)
    }, 600)
  }

  const generateOffers = () => {
    setGenerating(true)
    setTimeout(() => {
      const content = getContent()
      setGeneratedOffers(content.offers)
      setGenerating(false)
    }, 600)
  }

  const saveDescription = async () => {
    setSaving(true)
    try {
      await fetch(`/api/businesses/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: generatedDesc }),
      })
      onUpdated()
      showToast('Description saved!')
    } catch {
      showToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
    showToast('Copied!')
  }

  const tabs = [
    { id: 'description' as const, label: 'Description', icon: <FileText className="h-3.5 w-3.5" /> },
    { id: 'social' as const, label: 'Social Bios', icon: <MessageCircle className="h-3.5 w-3.5" /> },
    { id: 'tags' as const, label: 'Tags', icon: <Tag className="h-3.5 w-3.5" /> },
    { id: 'offers' as const, label: 'Offers', icon: <Megaphone className="h-3.5 w-3.5" /> },
  ]

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Content Generator</h3>
            <p className="text-xs text-muted-foreground">Auto-generate marketing content for your store</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1.5 mb-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id)
                if (t.id === 'tags' && !generatedTags.length) generateTags()
                if (t.id === 'offers' && !generatedOffers.length) generateOffers()
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/60 text-gray-600 hover:bg-white'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        {activeTab === 'description' && (
          <div className="space-y-3">
            <Textarea
              value={generatedDesc}
              onChange={(e) => setGeneratedDesc(e.target.value)}
              placeholder="Your business description..."
              rows={3}
              className="bg-white text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={generateDescription}
                disabled={generating}
                className="gap-1 text-xs"
              >
                {generating ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                {generating ? 'Generating...' : 'AI Generate'}
              </Button>
              <Button size="sm" onClick={saveDescription} disabled={saving} className="gap-1 text-xs bg-purple-600 hover:bg-purple-700">
                <Save className="h-3 w-3" /> {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}

        {/* Social Bios */}
        {activeTab === 'social' && (
          <div className="space-y-3">
            {['instagram', 'facebook', 'tiktok'].map(platform => (
              <div key={platform} className="bg-white/60 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize">{platform}</span>
                  <Button
                    size="sm" variant="ghost" className="h-6 text-xs gap-1"
                    onClick={() => {
                      const bio = generateSocialBio(platform)
                      setGeneratedBio(bio)
                    }}
                  >
                    <Wand2 className="h-3 w-3" /> Generate
                  </Button>
                </div>
                {generatedBio && (
                  <div className="relative">
                    <Textarea
                      value={generatedBio}
                      onChange={(e) => setGeneratedBio(e.target.value)}
                      rows={2}
                      className="text-xs bg-white"
                    />
                    <Button
                      size="sm" variant="ghost" className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => copyText(generatedBio, `bio-${platform}`)}
                    >
                      {copied === `bio-${platform}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {activeTab === 'tags' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {generatedTags.map((tag, i) => (
                <Badge key={i} variant="outline" className="bg-white text-purple-700 border-purple-200">
                  #{tag}
                </Badge>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={generateTags} disabled={generating} className="gap-1 text-xs">
              {generating ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
              Regenerate Tags
            </Button>
            <p className="text-[10px] text-muted-foreground">
              Use these hashtags on Instagram, TikTok, and Facebook posts
            </p>
          </div>
        )}

        {/* Offers */}
        {activeTab === 'offers' && (
          <div className="space-y-3">
            {generatedOffers.map((offer, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
                <span className="text-lg">🎁</span>
                <p className="flex-1 text-sm">{offer}</p>
                <Button
                  size="sm" variant="ghost" className="h-6 w-6 p-0"
                  onClick={() => copyText(offer, `offer-${i}`)}
                >
                  {copied === `offer-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={generateOffers} disabled={generating} className="gap-1 text-xs">
              <Wand2 className="h-3 w-3" /> Generate More Offers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

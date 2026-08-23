import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Globe, MapPin, Share2, MessageCircle, Copy, Check, ExternalLink,
  Megaphone, Sparkles, Instagram, Facebook, Play, QrCode,
  Target, Send, Image, TrendingUp, Users, Zap,
} from 'lucide-react'

interface SocialLink {
  id?: string
  platform: string
  url: string
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
  socialLinks: SocialLink[]
}

interface Props {
  business: Business
  onUpdated: () => void
  showToast: (msg: string, type?: 'success' | 'error') => void
}

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E4405F', placeholder: 'https://instagram.com/yourshop' },
  { id: 'facebook', label: 'Facebook', icon: '👤', color: '#1877F2', placeholder: 'https://facebook.com/yourshop' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000', placeholder: 'https://tiktok.com/@yourshop' },
  { id: 'twitter', label: 'X / Twitter', icon: '𝕏', color: '#1DA1F2', placeholder: 'https://x.com/yourshop' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: '#FF0000', placeholder: 'https://youtube.com/@yourshop' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2', placeholder: 'https://linkedin.com/company/yourshop' },
]

const MARKETING_TEMPLATES = [
  {
    title: 'Grand Opening',
    message: (name: string) => `🎉 ${name} is now OPEN! 🎉\n\nCome check out our amazing products and deals!\n\n📍 Visit us today!\n📱 WhatsApp for orders: Click the link below 👇`,
    icon: '🎉',
  },
  {
    title: 'Weekly Special',
    message: (name: string) => `🔥 This Week at ${name} 🔥\n\nSpecial deals happening NOW! Don't miss out.\n\n💬 Reply to this message to order!`,
    icon: '🔥',
  },
  {
    title: 'New Product',
    message: (name: string) => `🆕 NEW at ${name}! 🆕\n\nJust dropped — come see what's new!\n\n📱 Order on WhatsApp 👇`,
    icon: '🆕',
  },
  {
    title: 'Thank You',
    message: (name: string) => `🙏 Thank you for supporting ${name}!\n\nWe appreciate every customer. Tag us in your posts!\n\n#ShopLocal #SupportLocal`,
    icon: '🙏',
  },
]

export default function MarketingHub({ business, onUpdated, showToast }: Props) {
  const [socialUrls, setSocialUrls] = useState<Record<string, string>>(
    Object.fromEntries(PLATFORMS.map(p => {
      const existing = business.socialLinks?.find(s => s.platform === p.id)
      return [p.id, existing?.url || '']
    }))
  )
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'social' | 'google' | 'campaigns' | 'seo'>('overview')
  const [campaignText, setCampaignText] = useState('')
  const [copiedCampaign, setCopiedCampaign] = useState(false)
  const [seoTitle, setSeoTitle] = useState(business.name)
  const [seoDescription, setSeoDescription] = useState(business.description || '')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)

  const storeUrl = `${window.location.origin}?store=${business.slug}`
  const socialCount = Object.values(socialUrls).filter(Boolean).length
  const hasGoogle = business.address && business.city
  const hasWhatsApp = !!business.whatsapp
  const hasProducts = true

  const completeness = [
    { label: 'Store Online', done: true },
    { label: 'Products Added', done: hasProducts },
    { label: 'WhatsApp Connected', done: hasWhatsApp },
    { label: 'Social Media Links', done: socialCount >= 2 },
    { label: 'Google Location', done: hasGoogle },
    { label: 'Business Photo', done: false },
    { label: 'Opening Hours', done: !!business.openingHours },
  ]
  const completenessScore = Math.round((completeness.filter(c => c.done).length / completeness.length) * 100)

  const saveSocialLinks = async () => {
    setSaving(true)
    try {
      for (const [platform, url] of Object.entries(socialUrls)) {
        const existing = business.socialLinks?.find(s => s.platform === platform)
        if (url && !existing) {
          await fetch('/api/social-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform, url, businessId: business.id }),
          })
        } else if (url && existing) {
          await fetch(`/api/social-links/${existing.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          })
        } else if (!url && existing) {
          await fetch(`/api/social-links/${existing.id}`, { method: 'DELETE' })
        }
      }
      onUpdated()
      showToast('Social links saved!')
    } catch {
      showToast('Failed to save social links', 'error')
    } finally {
      setSaving(false)
    }
  }

  const generateCampaign = (template: typeof MARKETING_TEMPLATES[0]) => {
    setCampaignText(template.message(business.name))
    setSelectedTemplate(MARKETING_TEMPLATES.indexOf(template))
  }

  const shareToWhatsApp = () => {
    const num = business.whatsapp?.replace(/[^0-9]/g, '')
    if (num) {
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(campaignText || `Check out ${business.name}! ${storeUrl}`)}`, '_blank')
    } else {
      navigator.clipboard.writeText(campaignText)
      showToast('Campaign copied! Add your WhatsApp number to send directly.')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaignText || `Check out ${business.name}!\n\n${storeUrl}`)
    setCopiedCampaign(true)
    setTimeout(() => setCopiedCampaign(false), 2000)
    showToast('Copied to clipboard!')
  }

  const sections = [
    { id: 'overview' as const, label: 'Overview', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'social' as const, label: 'Social Media', icon: <Share2 className="h-4 w-4" /> },
    { id: 'google' as const, label: 'Google', icon: <Globe className="h-4 w-4" /> },
    { id: 'campaigns' as const, label: 'Campaigns', icon: <Megaphone className="h-4 w-4" /> },
    { id: 'seo' as const, label: 'SEO', icon: <Target className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-4">
      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === s.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {s.icon}
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          {/* Digital Visibility Score */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Digital Visibility Score
                </h3>
                <span className="text-2xl font-bold text-emerald-700">{completenessScore}%</span>
              </div>
              <div className="w-full bg-white/60 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completenessScore}%` }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {completeness.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    {item.done ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={item.done ? 'text-emerald-700 font-medium' : 'text-gray-500'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setActiveSection('social')}>
              <CardContent className="py-4 text-center">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <Share2 className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Social Links</p>
                <p className="text-xs text-muted-foreground">{socialCount} connected</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-green-300 transition-colors" onClick={() => setActiveSection('google')}>
              <CardContent className="py-4 text-center">
                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-medium">Google Maps</p>
                <p className="text-xs text-muted-foreground">{hasGoogle ? 'Location set' : 'Register now'}</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-orange-300 transition-colors" onClick={() => setActiveSection('campaigns')}>
              <CardContent className="py-4 text-center">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2">
                  <Megaphone className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-sm font-medium">Campaigns</p>
                <p className="text-xs text-muted-foreground">Promote your store</p>
              </CardContent>
            </Card>
          </div>

          {/* Shareable Store Link */}
          <Card>
            <CardContent className="py-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-600" />
                Your Store Link — Share Everywhere
              </h3>
              <div className="flex items-center gap-2">
                <Input value={storeUrl} readOnly className="text-xs font-mono" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(storeUrl)
                    showToast('Link copied!')
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={shareToWhatsApp}>
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}`, '_blank')}>
                  <span>👤</span> Facebook
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${business.name}!`)}&url=${encodeURIComponent(storeUrl)}`, '_blank')}>
                  <span>𝕏</span> Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── SOCIAL MEDIA ─── */}
      {activeSection === 'social' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-5">
              <h3 className="font-bold mb-1">Connect Your Social Media</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Add your social profiles. They'll appear on your storefront so customers can follow you.
              </p>
              <div className="space-y-3">
                {PLATFORMS.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center">{p.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{p.label}</span>
                        {socialUrls[p.id] && <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">Connected</Badge>}
                      </div>
                      <Input
                        value={socialUrls[p.id] || ''}
                        onChange={(e) => setSocialUrls(prev => ({ ...prev, [p.id]: e.target.value }))}
                        placeholder={p.placeholder}
                        className="text-xs mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={saveSocialLinks}
                disabled={saving}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? 'Saving...' : 'Save Social Links'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── GOOGLE BUSINESS ─── */}
      {activeSection === 'google' && (
        <div className="space-y-4">
          <Card className="border-blue-200">
            <CardContent className="pt-5">
              <h3 className="font-bold mb-1 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Google Business Profile
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Register your business on Google so customers can find you when they search nearby. This is FREE.
              </p>

              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Why Google Business matters:</p>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li>✅ Show up in Google Maps searches</li>
                    <li>✅ Appear in "near me" results</li>
                    <li>✅ Customers can call, get directions, see reviews</li>
                    <li>✅ Free advertising — 100% worth it</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Your Business Address</Label>
                  <Input value={business.address} readOnly placeholder="Set in store settings" className="text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">City</Label>
                  <Input value={business.city} readOnly placeholder="Set in store settings" className="text-sm" />
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                  onClick={() => {
                    const query = encodeURIComponent(`${business.name} ${business.address || ''} ${business.city || ''}`)
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  Find Your Location on Google Maps
                </Button>

                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                  <p className="font-medium mb-1">How to register (3 steps):</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Click the button above to open Google Maps</li>
                    <li>Search for your business — if not found, click "Add a missing place"</li>
                    <li>Fill in your details, verify by phone/postcard — you're live!</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── CAMPAIGNS ─── */}
      {activeSection === 'campaigns' && (
        <div className="space-y-4">
          <Card className="border-orange-200">
            <CardContent className="pt-5">
              <h3 className="font-bold mb-1 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-orange-600" />
                Marketing Campaigns
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Ready-made messages to share on WhatsApp, Facebook, Instagram, and more. Pick a template and share!
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {MARKETING_TEMPLATES.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => generateCampaign(template)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTemplate === i
                        ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <span className="text-xl">{template.icon}</span>
                    <p className="text-sm font-medium mt-1">{template.title}</p>
                  </button>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Label className="text-sm">Campaign Message</Label>
                <Textarea
                  value={campaignText}
                  onChange={(e) => setCampaignText(e.target.value)}
                  placeholder="Write your marketing message here..."
                  rows={5}
                  className="text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  💡 Tip: Add your store link ({storeUrl.slice(0, 40)}...) to drive traffic
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={shareToWhatsApp} className="bg-green-600 hover:bg-green-700 gap-1">
                    <Send className="h-3.5 w-3.5" /> WhatsApp
                  </Button>
                  <Button onClick={copyToClipboard} variant="outline" className="gap-1">
                    {copiedCampaign ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedCampaign ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Post Generator */}
          <Card className="border-purple-200">
            <CardContent className="pt-5">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Image className="h-5 w-5 text-purple-600" />
                Social Media Posts
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Share your store link with eye-catching posts
              </p>
              <div className="space-y-2">
                {[
                  { platform: 'Instagram', color: 'bg-pink-100 text-pink-700', text: `📸 Check out ${business.name}! New products available now. Link in bio! #ShopLocal #${business.category || 'Business'}` },
                  { platform: 'Facebook', color: 'bg-blue-100 text-blue-700', text: `👍 Support local! ${business.name} has what you need. Visit us today! ${storeUrl}` },
                  { platform: 'TikTok', color: 'bg-gray-100 text-gray-700', text: `🎵 POV: You found the best ${business.category || 'shop'} in ${business.city || 'town'} 🎵 #SmallBusiness #${business.city || 'Local'}` },
                ].map((post, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <Badge className={post.color}>{post.platform}</Badge>
                    <p className="flex-1 text-xs">{post.text}</p>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(post.text)
                        showToast(`${post.platform} post copied!`)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── SEO ─── */}
      {activeSection === 'seo' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-5">
              <h3 className="font-bold mb-1 flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                Search Engine Optimization (SEO)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Help customers find you on Google. These details improve your search ranking.
              </p>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Store Name (appears in Google search)</Label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Your Business Name"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Description (for search results)</Label>
                  <Textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Describe what your business does in 1-2 sentences..."
                    rows={3}
                    className="text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">{seoDescription.length}/160 characters (aim for 120-160)</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium mb-2">Preview — how it looks on Google:</p>
                  <div className="bg-white rounded p-3 border">
                    <p className="text-blue-700 text-sm font-medium hover:underline cursor-pointer">{seoTitle || business.name}</p>
                    <p className="text-green-700 text-xs">{storeUrl}</p>
                    <p className="text-gray-600 text-xs mt-1">{seoDescription || business.description || 'No description set'}</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    showToast('SEO settings saved! Your store page will update.')
                  }}
                >
                  Save SEO Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

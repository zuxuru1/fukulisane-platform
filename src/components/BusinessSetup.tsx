import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { MapPin, Store, Globe, Phone, Mail, Clock, Save } from 'lucide-react'

const CATEGORIES = [
  'Restaurant & Food',
  'Retail & Shopping',
  'Beauty & Salon',
  'Health & Fitness',
  'Professional Services',
  'Automotive',
  'Education & Training',
  'Home Services',
  'Entertainment',
  'Other',
]

interface BusinessData {
  id?: string
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

interface Props {
  business: BusinessData | null
  onSave: (data: BusinessData) => Promise<void>
}

export default function BusinessSetup({ business, onSave }: Props) {
  const [form, setForm] = useState<BusinessData>({
    name: business?.name ?? '',
    slug: business?.slug ?? '',
    description: business?.description ?? '',
    category: business?.category ?? '',
    address: business?.address ?? '',
    city: business?.city ?? '',
    country: business?.country ?? '',
    phone: business?.phone ?? '',
    email: business?.email ?? '',
    website: business?.website ?? '',
    whatsapp: business?.whatsapp ?? '',
    googleMapsUrl: business?.googleMapsUrl ?? '',
    openingHours: business?.openingHours ?? '',
  })
  const [saving, setSaving] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const update = (key: keyof BusinessData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && !prev.id) {
        next.slug = generateSlug(value)
      }
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Store className="h-5 w-5" />
            Business Profile
          </CardTitle>
          <CardDescription>
            Set up your business identity. This info appears on your public visibility page.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Sunrise Café"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Public Link Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">yourbiz.shogo.one/</span>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => update('slug', e.target.value)}
                  placeholder="sunrise-cafe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Tell people what makes your business special..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location & Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Address
              </Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Johannesburg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                  placeholder="South Africa"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleMaps" className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Google Maps URL
              </Label>
              <Input
                id="googleMaps"
                value={form.googleMapsUrl}
                onChange={(e) => update('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Opening Hours
              </Label>
              <Input
                id="hours"
                value={form.openingHours}
                onChange={(e) => update('openingHours', e.target.value)}
                placeholder="Mon-Fri: 8AM-5PM, Sat: 9AM-2PM"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+27 11 234 5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Business Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="hello@sunrisecafe.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Website
              </Label>
              <Input
                id="website"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                placeholder="https://sunrisecafe.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              WhatsApp
            </CardTitle>
            <CardDescription>
              Let customers reach you directly on WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="+27 82 345 6789"
              />
              <p className="text-xs text-muted-foreground">
                Include country code. Customers will see a "Chat on WhatsApp" button.
              </p>
            </div>
            {form.whatsapp && (
              <div className="rounded-lg bg-green-50 p-3 border border-green-200">
                <p className="text-sm text-green-800 font-medium">WhatsApp Preview</p>
                <a
                  href={`https://wa.me/${form.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline"
                >
                  wa.me/{form.whatsapp.replace(/[^0-9]/g, '')}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !form.name || !form.slug} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : business?.id ? 'Update Business' : 'Create Business'}
        </Button>
      </div>
    </div>
  )
}

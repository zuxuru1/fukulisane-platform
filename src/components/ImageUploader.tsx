import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Upload, Camera, Sparkles, RotateCcw, Check, X, Sun, Contrast, Palette
} from 'lucide-react'

interface ImageUploaderProps {
  onImageReady: (dataUrl: string) => void
  onCancel?: () => void
  label?: string
  aspectRatio?: 'square' | 'wide' | 'free'
  maxBytes?: number
}

type FilterPreset = {
  name: string
  label: string
  brightness: number
  contrast: number
  saturation: number
  warmth: number
}

const FILTER_PRESETS: FilterPreset[] = [
  { name: 'original', label: 'Original', brightness: 100, contrast: 100, saturation: 100, warmth: 0 },
  { name: 'vibrant', label: 'Vibrant', brightness: 105, contrast: 110, saturation: 130, warmth: 5 },
  { name: 'clean', label: 'Clean', brightness: 110, contrast: 105, saturation: 90, warmth: 0 },
  { name: 'warm', label: 'Warm', brightness: 102, contrast: 100, saturation: 110, warmth: 15 },
  { name: 'bright', label: 'Bright', brightness: 120, contrast: 95, saturation: 100, warmth: 0 },
  { name: 'pro', label: 'Pro', brightness: 100, contrast: 115, saturation: 115, warmth: -5 },
]

const FILTER_ICONS: Record<string, string> = {
  original: '✨', vibrant: '🌟', clean: '💎', warm: '☀️', bright: '💡', pro: '📸'
}

export default function ImageUploader({
  onImageReady,
  onCancel,
  label = 'Upload Image',
  aspectRatio = 'square',
  maxBytes = 500000,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('original')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [warmth, setWarmth] = useState(0)
  const [showAdjust, setShowAdjust] = useState(false)

  const getFilterCSS = useCallback(() => {
    const warmFilter = warmth > 0
      ? ` sepia(${warmth / 2})`
      : warmth < 0
        ? ` hue-rotate(${warmth}deg)`
        : ''
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)${warmFilter}`
  }, [brightness, contrast, saturation, warmth])

  const applyPreset = (preset: FilterPreset) => {
    setActiveFilter(preset.name)
    setBrightness(preset.brightness)
    setContrast(preset.contrast)
    setSaturation(preset.saturation)
    setWarmth(preset.warmth)
  }

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 2000000) {
      // compress by reading at lower quality
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxDim = 800
          let w = img.width, h = img.height
          if (w > maxDim || h > maxDim) {
            const scale = maxDim / Math.max(w, h)
            w *= scale
            h *= scale
          }
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, w, h)
          const compressed = canvas.toDataURL('image/jpeg', 0.8)
          setPreview(compressed)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const handleEnhance = useCallback(() => {
    if (!preview) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.filter = getFilterCSS()
      ctx.drawImage(img, 0, 0)
      const enhanced = canvas.toDataURL('image/jpeg', 0.85)
      setPreview(enhanced)
      setBrightness(100)
      setContrast(100)
      setSaturation(100)
      setWarmth(0)
      setActiveFilter('original')
    }
    img.src = preview
  }, [preview, getFilterCSS])

  const handleConfirm = () => {
    if (preview) onImageReady(preview)
  }

  const aspectClass = aspectRatio === 'square'
    ? 'aspect-square'
    : aspectRatio === 'wide'
      ? 'aspect-video'
      : ''

  if (!preview) {
    return (
      <Card className="border-dashed border-2 border-gray-300 hover:border-emerald-400 transition-colors cursor-pointer">
        <CardContent
          className="py-8 flex flex-col items-center justify-center gap-3"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Upload className="h-7 w-7 text-emerald-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">Tap to take a photo or choose from gallery</p>
          </div>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs gap-1">
              <Camera className="h-3 w-3" /> Camera
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <Upload className="h-3 w-3" /> Gallery
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className={`relative ${aspectClass} rounded-xl overflow-hidden bg-black/5`}>
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover"
          style={{ filter: getFilterCSS() }}
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={() => { setPreview(null); setActiveFilter('original') }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Presets */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={`flex flex-col items-center gap-1 min-w-[60px] py-2 px-1 rounded-lg text-xs transition-all ${
              activeFilter === preset.name
                ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-base">{FILTER_ICONS[preset.name]}</span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Manual Adjust Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs gap-1.5"
        onClick={() => setShowAdjust(!showAdjust)}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {showAdjust ? 'Hide' : 'Manual Adjust'}
      </Button>

      {/* Manual Sliders */}
      {showAdjust && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1"><Sun className="h-3 w-3" /> Brightness</span>
              <span>{brightness}%</span>
            </div>
            <input type="range" min="50" max="150" value={brightness}
              onChange={(e) => setBrightness(+e.target.value)}
              className="w-full h-1.5 accent-emerald-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1"><Contrast className="h-3 w-3" /> Contrast</span>
              <span>{contrast}%</span>
            </div>
            <input type="range" min="50" max="150" value={contrast}
              onChange={(e) => setContrast(+e.target.value)}
              className="w-full h-1.5 accent-emerald-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1"><Palette className="h-3 w-3" /> Color</span>
              <span>{saturation}%</span>
            </div>
            <input type="range" min="0" max="200" value={saturation}
              onChange={(e) => setSaturation(+e.target.value)}
              className="w-full h-1.5 accent-emerald-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">🌡 Warmth</span>
              <span>{warmth > 0 ? '+' : ''}{warmth}</span>
            </div>
            <input type="range" min="-20" max="30" value={warmth}
              onChange={(e) => setWarmth(+e.target.value)}
              className="w-full h-1.5 accent-emerald-500" />
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleEnhance}>
            <Sparkles className="h-3 w-3 mr-1" /> Apply Enhancement
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => { setPreview(null); setActiveFilter('original') }}>
          <RotateCcw className="h-4 w-4 mr-1" /> Retake
        </Button>
        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirm}>
          <Check className="h-4 w-4 mr-1" /> Use This Photo
        </Button>
      </div>
    </div>
  )
}

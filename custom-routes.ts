// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
import { Hono } from 'hono'
import { prisma } from './src/lib/db'
import { runAllEngines, getEngineLog, getEngineStatus } from './src/lib/engines'

const app = new Hono()

// ── Serve uploaded files ──
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

app.get('/files/:filename', (c) => {
  const filename = c.req.param('filename')
  const filePath = join(process.cwd(), 'files', filename)
  if (!existsSync(filePath)) return c.text('Not found', 404)
  const data = readFileSync(filePath)
  const ext = filename.split('.').pop()?.toLowerCase()
  const mimeMap: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  }
  c.header('Content-Type', mimeMap[ext || ''] || 'application/octet-stream')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(data)
})

// ── Public storefront redirect ──
app.get('/public/:slug', async (c) => {
  const slug = c.req.param('slug')
  return c.redirect(`/?store=${encodeURIComponent(slug)}`, 302)
})

// ── Public storefront by slug ──
app.get('/store/:slug', async (c) => {
  const slug = c.req.param('slug')
  const business = await prisma.business.findUnique({
    where: { slug },
    include: { socialLinks: true, products: true },
  })
  if (!business) return c.json({ error: 'Business not found' }, 404)
  return c.json(business)
})

// ── Business details (admin) ──
app.get('/businesses/:id/details', async (c) => {
  const id = c.req.param('id')
  const business = await prisma.business.findUnique({
    where: { id },
    include: { socialLinks: true, products: true },
  })
  if (!business) return c.json({ error: 'Not found' }, 404)
  return c.json(business)
})

// ── Dashboard stats ──
app.get('/businesses/:id/stats', async (c) => {
  const id = c.req.param('id')
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [productCount, todaySales, weekSales, monthSales, totalRevenue, todayRevenue, recentSales, orderCount] = await Promise.all([
    prisma.product.count({ where: { businessId: id } }),
    prisma.sale.count({ where: { businessId: id, createdAt: { gte: todayStart } } }),
    prisma.sale.count({ where: { businessId: id, createdAt: { gte: weekStart } } }),
    prisma.sale.count({ where: { businessId: id, createdAt: { gte: monthStart } } }),
    prisma.sale.aggregate({ where: { businessId: id }, _sum: { total: true } }),
    prisma.sale.aggregate({ where: { businessId: id, createdAt: { gte: todayStart } }, _sum: { total: true } }),
    prisma.sale.findMany({ where: { businessId: id }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.order.count({ where: { businessId: id } }),
  ])

  return c.json({
    productCount, todaySales, weekSales, monthSales,
    totalRevenue: totalRevenue._sum.total ?? 0,
    todayRevenue: todayRevenue._sum.total ?? 0,
    recentSales, orderCount,
  })
})

// ── Inquiries ──
app.get('/businesses/:id/inquiries', async (c) => {
  const id = c.req.param('id')
  const inquiries = await prisma.inquiry.findMany({
    where: { businessId: id }, orderBy: { createdAt: 'desc' }, take: 50,
  })
  return c.json(inquiries)
})

app.post('/businesses/:id/inquiries', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const inquiry = await prisma.inquiry.create({
    data: {
      businessId: id, name: body.name ?? null, phone: body.phone ?? null,
      message: body.message, source: body.source ?? 'public_page',
    },
  })
  return c.json(inquiry, 201)
})

// ── Sales ──
app.get('/businesses/:id/sales', async (c) => {
  const id = c.req.param('id')
  const limit = parseInt(c.req.query('limit') || '50')
  const sales = await prisma.sale.findMany({
    where: { businessId: id }, orderBy: { createdAt: 'desc' }, take: limit,
  })
  return c.json(sales)
})

app.post('/businesses/:id/sales', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const quantity = body.quantity ?? 1
  const unitPrice = body.unitPrice
  const total = unitPrice * quantity
  const sale = await prisma.sale.create({
    data: { businessId: id, productName: body.productName, quantity, unitPrice, total, note: body.note ?? null },
  })
  return c.json(sale, 201)
})

app.delete('/sales/:id', async (c) => {
  await prisma.sale.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// ── Gallery ──
app.get('/businesses/:id/gallery', async (c) => {
  const images = await prisma.galleryImage.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { sortOrder: 'asc' },
  })
  return c.json(images)
})

app.post('/businesses/:id/gallery', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const count = await prisma.galleryImage.count({ where: { businessId: id } })
  const image = await prisma.galleryImage.create({
    data: { businessId: id, imageUrl: body.imageUrl, caption: body.caption ?? null, sortOrder: count },
  })
  return c.json(image, 201)
})

app.delete('/gallery-images/:id', async (c) => {
  await prisma.galleryImage.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// ── Business photo ──
app.patch('/businesses/:id/photo', async (c) => {
  const body = await c.req.json()
  const business = await prisma.business.update({
    where: { id: c.req.param('id') }, data: { businessPhotoUrl: body.businessPhotoUrl ?? null },
  })
  return c.json(business)
})

// ── Product update ──
app.patch('/products/:id', async (c) => {
  const body = await c.req.json()
  const product = await prisma.product.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(product)
})

// ── Orders (single handler with engine trigger) ──
app.get('/orders', async (c) => {
  const businessId = c.req.query('businessId')
  if (!businessId) return c.json({ error: 'businessId required' }, 400)
  const limit = parseInt(c.req.query('limit') || '50')
  const orders = await prisma.order.findMany({
    where: { businessId }, orderBy: { createdAt: 'desc' }, take: limit,
  })
  return c.json(orders)
})

app.post('/orders', async (c) => {
  const body = await c.req.json()
  const orderCount = await prisma.order.count({ where: { businessId: body.businessId } })
  const order = await prisma.order.create({
    data: {
      businessId: body.businessId,
      orderNumber: `ORD-${String(orderCount + 1).padStart(4, '0')}`,
      customerName: body.customerName ?? null,
      customerPhone: body.customerPhone ?? null,
      customerEmail: body.customerEmail ?? null,
      customerAddress: body.customerAddress ?? null,
      items: body.items ?? '[]',
      subtotal: body.subtotal ?? 0,
      deliveryFee: body.deliveryFee ?? 0,
      total: body.total ?? 0,
      status: 'pending',
      deliveryMethod: body.deliveryMethod ?? 'pickup',
      paymentMethod: body.paymentMethod ?? null,
      paymentStatus: 'unpaid',
      note: body.note ?? null,
    },
  })
  runAllEngines(body.businessId).catch(() => {})
  return c.json(order, 201)
})

app.patch('/orders/:id', async (c) => {
  const body = await c.req.json()
  const order = await prisma.order.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(order)
})

app.delete('/orders/:id', async (c) => {
  await prisma.order.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// ── Plugins ──
app.get('/plugins', async (c) => {
  const businessId = c.req.query('businessId')
  if (!businessId) return c.json({ error: 'businessId required' }, 400)
  const plugins = await prisma.plugin.findMany({
    where: { businessId }, orderBy: { createdAt: 'desc' },
  })
  return c.json(plugins)
})

app.post('/plugins', async (c) => {
  const body = await c.req.json()
  const plugin = await prisma.plugin.create({
    data: {
      businessId: body.businessId, name: body.name, slug: body.slug,
      description: body.description ?? null, category: body.category ?? 'connect',
      config: body.config ?? null, isEnabled: body.isEnabled ?? true, apiKey: body.apiKey ?? null,
    },
  })
  return c.json(plugin, 201)
})

app.delete('/plugins/:businessId/:slug', async (c) => {
  await prisma.plugin.deleteMany({ where: { businessId: c.req.param('businessId'), slug: c.req.param('slug') } })
  return c.json({ ok: true })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INVISIBLE ENGINES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.post('/engines/run/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  await runAllEngines(businessId)
  return c.json({ ok: true, engines: getEngineStatus() })
})

app.get('/engines/status', async (c) => {
  return c.json(getEngineStatus())
})

app.get('/engines/log', async (c) => {
  return c.json(getEngineLog())
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEADS — CRM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/leads', async (c) => {
  const leads = await prisma.lead.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'desc' }, take: 100,
  })
  return c.json(leads)
})

app.post('/businesses/:id/leads', async (c) => {
  const body = await c.req.json()
  const lead = await prisma.lead.create({
    data: {
      businessId: c.req.param('id'), name: body.name, email: body.email ?? null,
      phone: body.phone ?? null, source: body.source ?? 'manual', score: body.score ?? 0,
      notes: body.notes ?? null,
    },
  })
  return c.json(lead, 201)
})

app.patch('/leads/:id', async (c) => {
  const body = await c.req.json()
  const lead = await prisma.lead.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(lead)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOMERS — CRM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/customers', async (c) => {
  const customers = await prisma.customerProfile.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'desc' }, take: 100,
  })
  return c.json(customers)
})

app.post('/businesses/:id/customers', async (c) => {
  const body = await c.req.json()
  const customer = await prisma.customerProfile.create({
    data: {
      businessId: c.req.param('id'), source: body.source ?? 'manual',
      socialPlatform: body.socialPlatform ?? null, socialHandle: body.socialHandle ?? null,
      location: body.location ?? null, interests: body.interests ?? null,
      engagementScore: body.engagementScore ?? 50, lifetimeValue: body.lifetimeValue ?? 0,
      tags: body.tags ?? null,
    },
  })
  return c.json(customer, 201)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENGINE EVENTS — activity log
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/events', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50')
  const events = await prisma.engineEvent.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'desc' }, take: limit,
  })
  return c.json(events)
})

app.post('/businesses/:id/events', async (c) => {
  const body = await c.req.json()
  const event = await prisma.engineEvent.create({
    data: {
      businessId: c.req.param('id'), engine: body.engine ?? 'system',
      eventType: body.eventType ?? 'info', title: body.title,
      description: body.description ?? null, sourceEngine: body.sourceEngine ?? null,
      targetEngine: body.targetEngine ?? null, payload: body.payload ?? null,
      impactScore: body.impactScore ?? 0,
    },
  })
  return c.json(event, 201)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTOMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/automations', async (c) => {
  const automations = await prisma.automation.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'desc' },
  })
  return c.json(automations)
})

app.post('/businesses/:id/automations', async (c) => {
  const body = await c.req.json()
  const automation = await prisma.automation.create({
    data: {
      businessId: c.req.param('id'), name: body.name, slug: body.slug,
      description: body.description ?? '', category: body.category ?? 'general',
      triggerType: body.triggerType ?? 'manual', actionType: body.actionType ?? 'notification',
      isEnabled: body.isEnabled ?? false, icon: body.icon ?? null,
    },
  })
  return c.json(automation, 201)
})

app.patch('/automations/:id', async (c) => {
  const body = await c.req.json()
  const automation = await prisma.automation.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(automation)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPROVALS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/approvals', async (c) => {
  const approvals = await prisma.approval.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'desc' }, take: 50,
  })
  return c.json(approvals)
})

app.post('/businesses/:id/approvals', async (c) => {
  const body = await c.req.json()
  const approval = await prisma.approval.create({
    data: {
      businessId: c.req.param('id'), engine: body.engine ?? 'system',
      actionType: body.actionType ?? 'general', title: body.title,
      description: body.description, riskLevel: body.riskLevel ?? 'low',
    },
  })
  return c.json(approval, 201)
})

app.patch('/approvals/:id', async (c) => {
  const body = await c.req.json()
  const approval = await prisma.approval.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(approval)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI INSIGHTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/insights', async (c) => {
  const insights = await prisma.aIInsight.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'desc' }, take: 50,
  })
  return c.json(insights)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HEALTH METRICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/health', async (c) => {
  const metrics = await prisma.healthMetric.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'desc' },
  })
  return c.json(metrics)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTEM MODULES (Activation Layer)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/modules', async (c) => {
  const modules = await prisma.systemModule.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { moduleName: 'asc' },
  })
  return c.json(modules)
})

app.post('/businesses/:id/modules', async (c) => {
  const body = await c.req.json()
  const existing = await prisma.systemModule.findFirst({
    where: { businessId: c.req.param('id'), moduleSlug: body.moduleSlug },
  })
  if (existing) {
    const updated = await prisma.systemModule.update({ where: { id: existing.id }, data: body })
    return c.json(updated)
  }
  const mod = await prisma.systemModule.create({
    data: {
      businessId: c.req.param('id'), moduleSlug: body.moduleSlug, moduleName: body.moduleName,
      category: body.category ?? 'general', status: body.status ?? 'active',
      isEnabled: body.isEnabled ?? true,
    },
  })
  return c.json(mod, 201)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COACH MESSAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/businesses/:id/coach', async (c) => {
  const messages = await prisma.coachMessage.findMany({
    where: { businessId: c.req.param('id') }, orderBy: { createdAt: 'asc' }, take: 100,
  })
  return c.json(messages)
})

app.post('/businesses/:id/coach', async (c) => {
  const body = await c.req.json()
  const msg = await prisma.coachMessage.create({
    data: { businessId: c.req.param('id'), role: body.role ?? 'assistant', content: body.content },
  })
  return c.json(msg, 201)
})

// ── Store Generation (AI) ──
app.post('/store/generate', async (c) => {
  const body = await c.req.json()
  const { businessId, workflow, data } = body
  if (!businessId || !workflow) return c.json({ error: 'businessId and workflow required' }, 400)

  const business = await prisma.business.findUnique({ where: { id: businessId } })
  if (!business) return c.json({ error: 'Business not found' }, 404)

  const products = await prisma.product.findMany({ where: { businessId } })

  const tagline = data?.tagline || business.tagline || `${business.name} — Your Local Marketplace`
  const brandStory = data?.brandStory || business.brandStory || `Welcome to ${business.name}, where quality meets convenience.`
  const seoTitle = `${business.name} | ${business.category || 'Store'}`
  const seoDescription = `${business.description || brandStory} Shop online via WhatsApp.`
  const keywords = [business.name, business.category, business.city, 'online store', 'whatsapp shopping'].filter(Boolean)

  const phases = [
    { name: 'Product Analysis', status: 'complete', progress: 100 },
    { name: 'Brand Voice', status: 'complete', progress: 100 },
    { name: 'Layout Design', status: 'complete', progress: 100 },
    { name: 'Content Generation', status: 'complete', progress: 100 },
    { name: 'SEO Optimization', status: 'complete', progress: 100 },
    { name: 'Image Optimization', status: 'complete', progress: 100 },
    { name: 'Marketing Content', status: 'complete', progress: 100 },
    { name: 'Engine Activation', status: 'complete', progress: 100 },
  ]

  return c.json({
    success: true, phases,
    generated: {
      tagline, brandStory,
      seo: { title: seoTitle, description: seoDescription, keywords },
      heroText: `Welcome to ${business.name}`,
      categories: products.length > 0 ? [...new Set(products.map(p => p.name.split(' ')[0]))] : ['All Products'],
      productCount: products.length,
    },
  })
})

// ── Product Import (CSV / Platform) ──
app.post('/store/import', async (c) => {
  const body = await c.req.json()
  const { businessId, source, data: importData } = body
  if (!businessId) return c.json({ error: 'businessId required' }, 400)

  let products: any[] = []

  if (source === 'csv' || source === 'paste') {
    const rows = importData?.rows || []
    for (const row of rows) {
      const name = row.name || row.Name || row.title || ''
      const price = parseFloat(row.price || row.Price || '0')
      const description = row.description || row.Description || ''
      const imageUrl = row.image || row.imageUrl || row.Image || null
      if (!name) continue
      const created = await prisma.product.create({
        data: { businessId, name, price, description, imageUrl, isAvailable: true },
      })
      products.push(created)
    }
  } else if (source === 'shopify' || source === 'woocommerce') {
    const url = importData?.url
    if (!url) return c.json({ error: 'Store URL required' }, 400)
    const storeUrl = url.replace(/\/$/, '')
    const apiUrl = source === 'shopify'
      ? `${storeUrl}/products.json?limit=250`
      : `${storeUrl}/wp-json/wc/v3/products?per_page=100`
    try {
      const resp = await fetch(apiUrl)
      if (!resp.ok) return c.json({ error: `Failed to fetch from ${source}: ${resp.status}` }, 502)
      const json = await resp.json()
      const items = source === 'shopify' ? (json.products || []) : (json || [])
      for (const item of items.slice(0, 100)) {
        const name = item.title || item.name || 'Untitled'
        const price = parseFloat(String(item.variants?.[0]?.price || item.price || 0))
        const description = (item.body_html || '').replace(/<[^>]*>/g, '').slice(0, 500) || item.description || ''
        const imageUrl = item.image?.src || item.images?.[0]?.src || null
        const created = await prisma.product.create({
          data: { businessId, name, price, description, imageUrl, isAvailable: true },
        })
        products.push(created)
      }
    } catch (err: any) {
      return c.json({ error: `Import failed: ${err.message}` }, 500)
    }
  }

  return c.json({ success: true, imported: products.length, products })
})

// ── Store Validation (pre-deploy) ──
app.get('/store/validate/:businessId', async (c) => {
  const id = c.req.param('businessId')
  const business = await prisma.business.findUnique({ where: { id }, include: { products: true, socialLinks: true } })
  if (!business) return c.json({ error: 'Business not found' }, 404)

  const checks = [
    { name: 'Store Name', passed: !!business.name, message: business.name ? 'Set' : 'Missing', required: true },
    { name: 'Category', passed: !!business.category, message: business.category || 'No category', required: true },
    { name: 'Description', passed: !!business.description, message: business.description ? 'Set' : 'Missing', required: true },
    { name: 'WhatsApp', passed: !!business.whatsapp, message: business.whatsapp || 'No WhatsApp', required: true },
    { name: 'Logo / Photo', passed: !!(business.logoUrl || business.businessPhotoUrl), message: (business.logoUrl || business.businessPhotoUrl) ? 'Set' : 'No logo', required: false },
    { name: 'Address', passed: !!business.address, message: business.address || 'No address', required: false },
    { name: 'Phone', passed: !!business.phone, message: business.phone || 'No phone', required: false },
    { name: 'Email', passed: !!business.email, message: business.email || 'No email', required: false },
    { name: 'Opening Hours', passed: !!business.openingHours, message: business.openingHours ? 'Set' : 'Not set', required: false },
    { name: 'Products', passed: business.products.length > 0, message: `${business.products.length} product(s)`, required: true },
    { name: 'Product Images', passed: business.products.some(p => !!p.imageUrl), message: `${business.products.filter(p => p.imageUrl).length}/${business.products.length} have images`, required: false },
    { name: 'Google Maps', passed: !!business.googleMapsUrl, message: business.googleMapsUrl ? 'Set' : 'No map', required: false },
    { name: 'Brand Story', passed: !!business.brandStory, message: business.brandStory ? 'Set' : 'No story', required: false },
    { name: 'Social Links', passed: business.socialLinks.length > 0, message: `${business.socialLinks.length} link(s)`, required: false },
    { name: 'Delivery', passed: business.acceptDelivery, message: business.acceptDelivery ? 'Enabled' : 'Pickup only', required: false },
    { name: 'Primary Color', passed: !!business.primaryColor, message: business.primaryColor ? 'Set' : 'No color', required: false },
  ]

  const requiredTotal = checks.filter(c => c.required).length
  const requiredPassed = checks.filter(c => c.required && c.passed).length
  const totalPassed = checks.filter(c => c.passed).length
  const score = Math.round((totalPassed / checks.length) * 100)

  return c.json({
    score, allRequiredPass: requiredPassed === requiredTotal,
    requiredPassed, requiredTotal, checks,
    message: requiredPassed === requiredTotal
      ? `Store ready to go live! (${score}%)`
      : `${requiredTotal - requiredPassed} required field(s) missing`,
  })
})

// ── Store Deploy ──
app.post('/store/deploy/:businessId', async (c) => {
  const id = c.req.param('businessId')
  const business = await prisma.business.findUnique({ where: { id } })
  if (!business) return c.json({ error: 'Business not found' }, 404)

  await prisma.business.update({ where: { id }, data: { storeStatus: 'live', isActive: true } })

  const enginesActivated: string[] = []
  const modules = [
    { slug: 'storefront', name: 'Storefront', category: 'storefront' },
    { slug: 'orders', name: 'Order Manager', category: 'seller' },
    { slug: 'whatsapp', name: 'WhatsApp Orders', category: 'seller' },
    { slug: 'analytics', name: 'Analytics', category: 'admin' },
  ]

  for (const mod of modules) {
    await prisma.systemModule.upsert({
      where: { businessId_moduleSlug: { businessId: id, moduleSlug: mod.slug } },
      create: { businessId: id, moduleSlug: mod.slug, moduleName: mod.name, category: mod.category, status: 'active', isEnabled: true },
      update: { status: 'active', isEnabled: true },
    })
    enginesActivated.push(mod.name)
  }

  runAllEngines(id).catch(() => {})

  return c.json({
    success: true,
    storeUrl: `?store=${business.slug}`,
    storeStatus: 'live',
    enginesActivated,
    message: `${business.name} is now live!`,
  })
})

// ═══════════════════════════════════════════
// CONSTRUCTION APP ROUTES
// ═══════════════════════════════════════════

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WIZARD ENGINES — each step is a real engine
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const WIZARD_STEPS = [
  { step: 1, slug: 'brand-standards', title: 'Brand Standards' },
  { step: 2, slug: 'google-business', title: 'Google Business Profile' },
  { step: 3, slug: 'website', title: 'Website' },
  { step: 4, slug: 'facebook', title: 'Facebook Business Page' },
  { step: 5, slug: 'instagram', title: 'Instagram' },
  { step: 6, slug: 'tiktok', title: 'TikTok Business' },
  { step: 7, slug: 'youtube', title: 'YouTube Channel' },
  { step: 8, slug: 'linkedin', title: 'LinkedIn' },
  { step: 9, slug: 'whatsapp', title: 'WhatsApp Business' },
  { step: 10, slug: 'pinterest', title: 'Pinterest' },
  { step: 11, slug: 'link-hub', title: 'Link Hub' },
  { step: 12, slug: 'branding-rules', title: 'Branding Rules' },
  { step: 13, slug: 'weekly-content', title: 'Weekly Content' },
  { step: 14, slug: 'monthly-review', title: 'Monthly Review' },
]

// Initialize all 14 wizard engines for a business
app.post('/wizard/engines/init/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const created: any[] = []
  for (const step of WIZARD_STEPS) {
    const existing = await prisma.wizardEngine.findUnique({
      where: { businessId_stepNumber: { businessId, stepNumber: step.step } },
    }).catch(() => null)
    if (!existing) {
      const engine = await prisma.wizardEngine.create({
        data: { businessId, stepNumber: step.step, stepSlug: step.slug, title: step.title, status: 'pending' },
      })
      created.push(engine)
    }
  }
  return c.json({ ok: true, initialized: created.length, total: WIZARD_STEPS.length })
})

// Get all wizard engine states for a business
app.get('/wizard/engines/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  let engines = await prisma.wizardEngine.findMany({
    where: { businessId }, orderBy: { stepNumber: 'asc' },
  })
  if (engines.length === 0) {
    // Auto-initialize
    for (const step of WIZARD_STEPS) {
      await prisma.wizardEngine.create({
        data: { businessId, stepNumber: step.step, stepSlug: step.slug, title: step.title, status: 'pending' },
      })
    }
    engines = await prisma.wizardEngine.findMany({
      where: { businessId }, orderBy: { stepNumber: 'asc' },
    })
  }
  const done = engines.filter(e => e.status === 'complete').length
  return c.json({ engines, progress: { done, total: engines.length, pct: Math.round((done / engines.length) * 100) } })
})

// Update a wizard engine step (toggle status, save config/output)
app.patch('/wizard/engines/:businessId/step/:stepNumber', async (c) => {
  const businessId = c.req.param('businessId')
  const stepNumber = parseInt(c.req.param('stepNumber'))
  const body = await c.req.json()
  const engine = await prisma.wizardEngine.upsert({
    where: { businessId_stepNumber: { businessId, stepNumber } },
    create: {
      businessId, stepNumber,
      stepSlug: WIZARD_STEPS[stepNumber - 1]?.slug || `step-${stepNumber}`,
      title: WIZARD_STEPS[stepNumber - 1]?.title || `Step ${stepNumber}`,
      status: body.status || 'in_progress',
      config: body.config ? JSON.stringify(body.config) : null,
      output: body.output ? JSON.stringify(body.output) : null,
    },
    update: {
      status: body.status || undefined,
      config: body.config ? JSON.stringify(body.config) : undefined,
      output: body.output ? JSON.stringify(body.output) : undefined,
      lastRunAt: new Date(),
    },
  })
  return c.json(engine)
})

// Run a specific wizard engine (generates output based on current data)
app.post('/wizard/engines/:businessId/run/:stepNumber', async (c) => {
  const businessId = c.req.param('businessId')
  const stepNumber = parseInt(c.req.param('stepNumber'))
  const step = WIZARD_STEPS[stepNumber - 1]
  if (!step) return c.json({ error: 'Invalid step' }, 400)

  let output: any = {}

  if (step.slug === 'brand-standards' || step.slug === 'branding-rules') {
    const biz = await prisma.business.findUnique({ where: { id: businessId } })
    output = {
      brandName: biz?.name,
      tagline: biz?.tagline,
      primaryColor: biz?.primaryColor || '#d4af37',
      secondaryColor: biz?.secondaryColor || '#000000',
      accentColor: biz?.accentColor || '#ffffff',
      phone: biz?.phone,
      email: biz?.email,
      address: biz?.address,
      hasLogo: !!biz?.logoUrl,
      hasStory: !!biz?.brandStory,
      score: [biz?.name, biz?.tagline, biz?.phone, biz?.email, biz?.address, biz?.logoUrl, biz?.brandStory].filter(Boolean).length,
    }
  } else if (['google-business','facebook','instagram','tiktok','youtube','linkedin','whatsapp','pinterest'].includes(step.slug)) {
    const links = await prisma.socialLink.findMany({ where: { businessId } })
    const platformMap: Record<string, string> = {
      'google-business': 'google', 'facebook': 'facebook', 'instagram': 'instagram',
      'tiktok': 'tiktok', 'youtube': 'youtube', 'linkedin': 'linkedin',
      'whatsapp': 'whatsapp', 'pinterest': 'pinterest',
    }
    const link = links.find(l => l.platform === platformMap[step.slug])
    output = {
      platform: step.slug,
      isConnected: !!link,
      profileUrl: link?.url || null,
      status: link ? 'connected' : 'not_connected',
    }
  } else if (step.slug === 'website') {
    const biz = await prisma.business.findUnique({ where: { id: businessId } })
    output = {
      hasWebsite: !!biz?.website,
      websiteUrl: biz?.website || null,
      hasDescription: !!biz?.description,
      storeStatus: biz?.storeStatus,
      storeUrl: biz?.slug ? `/?store=${biz.slug}` : null,
    }
  } else if (step.slug === 'link-hub') {
    const links = await prisma.socialLink.findMany({ where: { businessId } })
    output = {
      totalLinks: links.length,
      links: links.map(l => ({ platform: l.platform, url: l.url })),
      hasWhatsApp: links.some(l => l.platform === 'whatsapp'),
      hasGoogle: links.some(l => l.platform === 'google'),
    }
  } else if (step.slug === 'weekly-content') {
    const posts = await prisma.contentPost.findMany({ where: { businessId } })
    const byDay = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    output = {
      totalPosts: posts.length,
      schedule: byDay.map(day => ({
        day,
        posts: posts.filter(p => p.dayOfWeek === day).length,
      })),
      published: posts.filter(p => p.status === 'published').length,
      draft: posts.filter(p => p.status === 'draft').length,
    }
  } else if (step.slug === 'monthly-review') {
    const period = new Date().toISOString().slice(0, 7)
    const targets = await prisma.kPITarget.findMany({ where: { businessId, period } })
    const projects = await prisma.project.count({ where: { businessId } })
    const services = await prisma.service.count({ where: { businessId } })
    const testimonials = await prisma.testimonial.count({ where: { businessId } })
    const quotes = await prisma.quoteRequest.count({ where: { businessId } })
    output = {
      period,
      kpis: targets.map(t => ({
        name: t.metricName, target: t.targetValue, actual: t.actualValue, unit: t.unit,
        pct: t.targetValue > 0 ? Math.round((t.actualValue / t.targetValue) * 100) : 0,
      })),
      counts: { projects, services, testimonials, quotes },
    }
  }

  const engine = await prisma.wizardEngine.upsert({
    where: { businessId_stepNumber: { businessId, stepNumber } },
    create: {
      businessId, stepNumber, stepSlug: step.slug, title: step.title,
      status: 'complete', output: JSON.stringify(output), lastRunAt: new Date(),
    },
    update: {
      status: 'complete', output: JSON.stringify(output), lastRunAt: new Date(),
    },
  })

  // Log the engine event
  await prisma.engineEvent.create({
    data: {
      businessId, engine: 'wizard', eventType: 'engine_run',
      title: `Wizard Engine: ${step.title}`, description: `Step ${stepNumber} completed`,
      payload: JSON.stringify({ step: stepNumber, slug: step.slug }), impactScore: 10,
    },
  })

  return c.json({ ok: true, engine, output })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTENT ENGINE — generates and manages weekly posts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/content/posts/:businessId', async (c) => {
  const posts = await prisma.contentPost.findMany({
    where: { businessId: c.req.param('businessId') }, orderBy: { createdAt: 'desc' },
  })
  return c.json(posts)
})

app.post('/content/posts/:businessId', async (c) => {
  const body = await c.req.json()
  const post = await prisma.contentPost.create({
    data: {
      businessId: c.req.param('businessId'),
      platform: body.platform, dayOfWeek: body.dayOfWeek,
      contentType: body.contentType, caption: body.caption,
      hashtags: body.hashtags ?? null, imageUrl: body.imageUrl ?? null,
      status: body.status ?? 'draft',
    },
  })
  return c.json(post, 201)
})

app.patch('/content/posts/:id', async (c) => {
  const body = await c.req.json()
  const post = await prisma.contentPost.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(post)
})

app.delete('/content/posts/:id', async (c) => {
  await prisma.contentPost.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// Generate weekly content for a business
app.post('/content/generate/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const biz = await prisma.business.findUnique({ where: { id: businessId } })
  if (!biz) return c.json({ error: 'Business not found' }, 404)

  const existing = await prisma.contentPost.findMany({ where: { businessId } })
  if (existing.length >= 14) return c.json({ ok: true, message: 'Content already generated', posts: existing.length })

  const weeklyPlan = [
    { day: 'Monday', type: 'tip', platforms: ['facebook','instagram','linkedin'], caption: `🏗️ CONSTRUCTION TIP: Before starting any building project, always check your local municipal building regulations. This saves time, money, and ensures your project is compliant.\n\n#ConstructionTips #BuildingRegulations #KZN #FukulisaneConstruction`, hashtags: '#ConstructionTips #BuildingRegulations #KZN' },
    { day: 'Tuesday', type: 'before-after', platforms: ['instagram','facebook','tiktok'], caption: `📸 TRANSFORMATION TUESDAY: From old to bold! See how we turned this dated kitchen into a modern masterpiece.\n\nEvery project tells a story. What's yours?\n\n#TransformationTuesday #BeforeAndAfter #KitchenRenovation`, hashtags: '#TransformationTuesday #BeforeAndAfter' },
    { day: 'Wednesday', type: 'testimonial', platforms: ['facebook','instagram','google'], caption: `⭐ WHAT OUR CLIENTS SAY:\n\n"${biz.name} exceeded our expectations. Professional, on time, and the quality is outstanding."\n\nThank you for trusting us with your home! 🏠\n\n#ClientReview #Testimonial #QualityWork`, hashtags: '#ClientReview #Testimonial' },
    { day: 'Thursday', type: 'progress', platforms: ['instagram_stories','tiktok'], caption: `🏗️ SITE UPDATE: Work in progress! Our team is making great progress on this build. Follow along for daily updates!\n\n#SiteProgress #ConstructionLife #BuildingDreams`, hashtags: '#SiteProgress #ConstructionLife' },
    { day: 'Friday', type: 'project', platforms: ['facebook','instagram','youtube','linkedin'], caption: `🏠 PROJECT COMPLETE! Another happy homeowner. This beautiful 4-room house in Ezimbokodweni is ready for its new family.\n\nQuality you can trust. Results you can see.\n\n#ProjectComplete #NewHome #QualityConstruction`, hashtags: '#ProjectComplete #NewHome' },
    { day: 'Saturday', type: 'team', platforms: ['facebook','instagram'], caption: `👥 MEET THE TEAM: The skilled hands behind every project. Our dedicated team makes dreams come true, one brick at a time.\n\n#TeamSpotlight #ConstructionCrew #Fukulisane`, hashtags: '#TeamSpotlight #ConstructionCrew' },
    { day: 'Sunday', type: 'inspiration', platforms: ['pinterest','instagram'], caption: `✨ DESIGN INSPIRATION: Modern township homes that turn heads. Which style is your favourite?\n\nDM us to start building YOUR dream home.\n\n#HomeDesign #ModernHome #HouseDesign #KZNHomes`, hashtags: '#HomeDesign #ModernHome' },
  ]

  const created: any[] = []
  for (const plan of weeklyPlan) {
    for (const platform of plan.platforms) {
      const post = await prisma.contentPost.create({
        data: {
          businessId, platform, dayOfWeek: plan.day,
          contentType: plan.type, caption: plan.caption,
          hashtags: plan.hashtags, status: 'draft',
        },
      })
      created.push(post)
    }
  }

  return c.json({ ok: true, postsCreated: created.length })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KPI ENGINE — tracks monthly targets vs actuals
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/kpi/targets/:businessId', async (c) => {
  const period = c.req.query('period') || new Date().toISOString().slice(0, 7)
  const targets = await prisma.kPITarget.findMany({
    where: { businessId: c.req.param('businessId'), period },
  })
  return c.json(targets)
})

app.post('/kpi/targets/:businessId', async (c) => {
  const body = await c.req.json()
  const period = body.period || new Date().toISOString().slice(0, 7)
  const target = await prisma.kPITarget.upsert({
    where: { businessId_metricName_period: { businessId: c.req.param('businessId'), metricName: body.metricName, period } },
    create: {
      businessId: c.req.param('businessId'), metricName: body.metricName,
      targetValue: body.targetValue, actualValue: body.actualValue ?? 0,
      unit: body.unit ?? null, period,
    },
    update: { targetValue: body.targetValue, actualValue: body.actualValue, unit: body.unit },
  })
  return c.json(target)
})

app.patch('/kpi/targets/:id', async (c) => {
  const body = await c.req.json()
  const target = await prisma.kPITarget.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(target)
})

// Initialize KPI targets with construction defaults
app.post('/kpi/init/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const period = new Date().toISOString().slice(0, 7)
  const defaults = [
    { metricName: 'Google Reviews', targetValue: 100, unit: 'reviews' },
    { metricName: 'Website Visitors', targetValue: 2000, unit: 'visitors' },
    { metricName: 'Facebook Followers', targetValue: 10000, unit: 'followers' },
    { metricName: 'Instagram Followers', targetValue: 5000, unit: 'followers' },
    { metricName: 'TikTok Followers', targetValue: 20000, unit: 'followers' },
    { metricName: 'YouTube Subscribers', targetValue: 2000, unit: 'subscribers' },
    { metricName: 'WhatsApp Messages', targetValue: 100, unit: 'messages' },
    { metricName: 'Quotes Sent', targetValue: 40, unit: 'quotes' },
    { metricName: 'Projects Completed', targetValue: 12, unit: 'projects' },
    { metricName: 'Referral Rate', targetValue: 30, unit: '%' },
  ]

  // Auto-populate actuals from database
  const projects = await prisma.project.count({ where: { businessId } })
  const services = await prisma.service.count({ where: { businessId } })
  const testimonials = await prisma.testimonial.count({ where: { businessId } })
  const quotes = await prisma.quoteRequest.count({ where: { businessId } })

  const actuals: Record<string, number> = {
    'Projects Completed': projects,
    'Quotes Sent': quotes,
  }

  const created: any[] = []
  for (const d of defaults) {
    const target = await prisma.kPITarget.upsert({
      where: { businessId_metricName_period: { businessId, metricName: d.metricName, period } },
      create: { businessId, metricName: d.metricName, targetValue: d.targetValue, actualValue: actuals[d.metricName] || 0, unit: d.unit, period },
      update: { targetValue: d.targetValue },
    })
    created.push(target)
  }
  return c.json({ ok: true, targets: created.length })
})

// ── Public construction site data ──
app.get('/construction-site/:slug', async (c) => {
  const slug = c.req.param('slug')
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      socialLinks: true,
      products: true,
      services: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } },
      testimonials: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } },
      projects: { orderBy: { sortOrder: 'asc' } },
      galleryImages: { orderBy: { sortOrder: 'asc' } },
    },
  })
  if (!business) return c.json({ error: 'Business not found' }, 404)
  return c.json(business)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POSTS — live content feed for storefront
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/posts', async (c) => {
  const businessId = c.req.query('businessId')
  if (!businessId) return c.json({ error: 'businessId required' }, 400)
  const posts = await prisma.post.findMany({
    where: { businessId }, orderBy: { createdAt: 'desc' },
  })
  return c.json(posts)
})

app.post('/posts', async (c) => {
  const body = await c.req.json()
  const post = await prisma.post.create({
    data: {
      businessId: body.businessId, title: body.title, content: body.content,
      imageUrl: body.imageUrl ?? null, category: body.category ?? 'update',
      status: body.status ?? 'published',
    },
  })
  return c.json(post, 201)
})

app.patch('/posts/:id', async (c) => {
  const body = await c.req.json()
  const post = await prisma.post.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(post)
})

app.delete('/posts/:id', async (c) => {
  await prisma.post.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// Seed posts from business plan
app.post('/posts/seed/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const existing = await prisma.post.count({ where: { businessId } })
  if (existing >= 6) return c.json({ ok: true, message: 'Posts already seeded', count: existing })

  const seedPosts = [
    { title: '🏗️ New House Construction Now Available', content: 'We are excited to offer complete new house builds from foundation to finish. Custom designs to fit your budget and lifestyle. From 4-room houses to double-storey family homes — we build your dream.', category: 'service', imageUrl: '/api/files/ChatGPT_Image_Aug_3__2026__06_15_36_AM.png' },
    { title: '🎨 Kitchen Renovations — Modern Makeovers', content: 'Transform your kitchen with new cupboards, countertops, plumbing, tiling, and electrical work. We bring modern design to your home. Contact us for a free quote!', category: 'service', imageUrl: '/api/files/ChatGPT_Image_Aug_3__2026__06_23_16_AM.png' },
    { title: '🏠 10% OFF All Renovations This Month', content: 'Take advantage of our winter special! 10% off all renovation work — kitchen, bathroom, painting, tiling, and more. Limited time only. Book your free site visit today.', category: 'promotion', imageUrl: '/api/files/ChatGPT_Image_Aug_3__2026__06_23_39_AM.png' },
    { title: '📋 About Fukulisane Construction', content: 'We are a KwaZulu-Natal-based residential building and renovation contractor. Our mission is to provide high-quality, affordable, and reliable services. Building Today, Creating Tomorrow.', category: 'about', imageUrl: '/api/files/ChatGPT_Image_Aug_3__2026__06_10_41_AM.png' },
    { title: '🧱 Boundary Walls & Paving — Security for Your Home', content: 'Protect your property with our professional boundary walls and paving services. Pre-cast, brick, palisade, and electric fencing options. Driveways, walkways, and patios too.', category: 'service', imageUrl: null },
    { title: '⭐ Thank You to Our Amazing Clients', content: 'We have completed 50+ projects across KwaZulu-Natal. From new builds to renovations, every project is a testament to our commitment to quality. Thank you for trusting us with your homes!', category: 'update', imageUrl: null },
  ]

  const created: any[] = []
  for (const p of seedPosts) {
    const post = await prisma.post.create({ data: { businessId, ...p } })
    created.push(post)
  }
  return c.json({ ok: true, postsCreated: created.length })
})

// ── Projects CRUD ──
app.get('/projects', async (c) => {
  const businessId = c.req.query('businessId')
  if (!businessId) return c.json({ error: 'businessId required' }, 400)
  const projects = await prisma.project.findMany({
    where: { businessId }, orderBy: { sortOrder: 'asc' },
  })
  return c.json(projects)
})

app.post('/projects', async (c) => {
  const body = await c.req.json()
  const count = await prisma.project.count({ where: { businessId: body.businessId } })
  const project = await prisma.project.create({
    data: {
      businessId: body.businessId, title: body.title, description: body.description ?? null,
      category: body.category ?? null, location: body.location ?? null,
      imageUrl: body.imageUrl ?? null, beforeUrl: body.beforeUrl ?? null, afterUrl: body.afterUrl ?? null,
      budget: body.budget ?? null, isFeatured: body.isFeatured ?? false, sortOrder: count,
      completedAt: body.completedAt ? new Date(body.completedAt) : null,
    },
  })
  return c.json(project, 201)
})

app.patch('/projects/:id', async (c) => {
  const body = await c.req.json()
  const project = await prisma.project.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(project)
})

app.delete('/projects/:id', async (c) => {
  await prisma.project.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// ── Testimonials CRUD ──
app.get('/testimonials', async (c) => {
  const businessId = c.req.query('businessId')
  if (!businessId) return c.json({ error: 'businessId required' }, 400)
  const testimonials = await prisma.testimonial.findMany({
    where: { businessId }, orderBy: { sortOrder: 'asc' },
  })
  return c.json(testimonials)
})

app.post('/testimonials', async (c) => {
  const body = await c.req.json()
  const count = await prisma.testimonial.count({ where: { businessId: body.businessId } })
  const testimonial = await prisma.testimonial.create({
    data: {
      businessId: body.businessId, clientName: body.clientName, content: body.content,
      clientPhone: body.clientPhone ?? null, projectName: body.projectName ?? null,
      rating: body.rating ?? 5, imageUrl: body.imageUrl ?? null, sortOrder: count,
    },
  })
  return c.json(testimonial, 201)
})

app.delete('/testimonials/:id', async (c) => {
  await prisma.testimonial.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// ── Services CRUD ──
app.get('/services', async (c) => {
  const businessId = c.req.query('businessId')
  if (!businessId) return c.json({ error: 'businessId required' }, 400)
  const services = await prisma.service.findMany({
    where: { businessId }, orderBy: { sortOrder: 'asc' },
  })
  return c.json(services)
})

app.post('/services', async (c) => {
  const body = await c.req.json()
  const count = await prisma.service.count({ where: { businessId: body.businessId } })
  const service = await prisma.service.create({
    data: {
      businessId: body.businessId, name: body.name, description: body.description ?? null,
      icon: body.icon ?? null, priceRange: body.priceRange ?? null,
      imageUrl: body.imageUrl ?? null, sortOrder: count,
    },
  })
  return c.json(service, 201)
})

app.delete('/services/:id', async (c) => {
  await prisma.service.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

// ── Quote Requests ──
app.get('/quote-requests', async (c) => {
  const businessId = c.req.query('businessId')
  if (!businessId) return c.json({ error: 'businessId required' }, 400)
  const quotes = await prisma.quoteRequest.findMany({
    where: { businessId }, orderBy: { createdAt: 'desc' },
  })
  return c.json(quotes)
})

app.post('/quote-requests', async (c) => {
  const body = await c.req.json()
  const quote = await prisma.quoteRequest.create({
    data: {
      businessId: body.businessId, clientName: body.clientName, clientPhone: body.clientPhone,
      clientEmail: body.clientEmail ?? null, serviceType: body.serviceType ?? null,
      projectDesc: body.projectDesc ?? null, address: body.address ?? null,
      budget: body.budget ?? null, preferredDate: body.preferredDate ?? null,
      notes: body.notes ?? null,
    },
  })
  return c.json(quote, 201)
})

app.patch('/quote-requests/:id', async (c) => {
  const body = await c.req.json()
  const quote = await prisma.quoteRequest.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(quote)
})

// ═══════════════════════════════════════════
// MARKETING ECOSYSTEM ENGINE
// ═══════════════════════════════════════════

app.get('/marketing/campaigns/:businessId', async (c) => {
  const campaigns = await prisma.marketingCampaign.findMany({
    where: { businessId: c.req.param('businessId') }, orderBy: { createdAt: 'desc' },
  })
  return c.json(campaigns)
})

app.post('/marketing/campaigns/:businessId', async (c) => {
  const body = await c.req.json()
  const campaign = await prisma.marketingCampaign.create({
    data: {
      businessId: c.req.param('businessId'), name: body.name, type: body.type ?? 'social',
      channel: body.channel ?? 'facebook', status: 'draft', budget: body.budget ?? 0,
      content: body.content ?? null, targetAudience: body.targetAudience ?? null,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  })
  return c.json(campaign, 201)
})

app.patch('/marketing/campaigns/:id', async (c) => {
  const body = await c.req.json()
  const campaign = await prisma.marketingCampaign.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(campaign)
})

app.delete('/marketing/campaigns/:id', async (c) => {
  await prisma.marketingCampaign.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

app.post('/marketing/campaigns/:id/track', async (c) => {
  const body = await c.req.json()
  const campaign = await prisma.marketingCampaign.findUnique({ where: { id: c.req.param('id') } })
  if (!campaign) return c.json({ error: 'Campaign not found' }, 404)
  const updated = await prisma.marketingCampaign.update({
    where: { id: c.req.param('id') },
    data: {
      impressions: campaign.impressions + (body.impressions ?? 0),
      clicks: campaign.clicks + (body.clicks ?? 0),
      leads: campaign.leads + (body.leads ?? 0),
      conversions: campaign.conversions + (body.conversions ?? 0),
      spent: campaign.spent + (body.spent ?? 0),
    },
  })
  return c.json(updated)
})

app.get('/marketing/summary/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const [campaigns, totalLeads, totalRevenue] = await Promise.all([
    prisma.marketingCampaign.findMany({ where: { businessId } }),
    prisma.lead.count({ where: { businessId } }),
    prisma.sale.aggregate({ where: { businessId }, _sum: { total: true } }),
  ])
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0)
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0)
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0)
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const ctr = totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0
  return c.json({
    totalCampaigns: campaigns.length, activeCampaigns,
    totalImpressions, totalClicks, ctr, totalSpent,
    totalLeads, totalRevenue: totalRevenue._sum.total ?? 0,
    conversionRate: totalClicks > 0 ? Math.round(((totalLeads / totalClicks) * 100) * 100) / 100 : 0,
  })
})

// ═══════════════════════════════════════════
// BRANDING ECOSYSTEM ENGINE
// ═══════════════════════════════════════════

app.get('/brand/assets/:businessId', async (c) => {
  const assets = await prisma.brandAsset.findMany({
    where: { businessId: c.req.param('businessId') }, orderBy: { createdAt: 'desc' },
  })
  return c.json(assets)
})

app.post('/brand/assets/:businessId', async (c) => {
  const body = await c.req.json()
  const asset = await prisma.brandAsset.create({
    data: {
      businessId: c.req.param('businessId'), name: body.name, type: body.type ?? 'color',
      category: body.category ?? 'primary', content: body.content ?? null,
      fileUrl: body.fileUrl ?? null, metadata: body.metadata ?? null,
      isDefault: body.isDefault ?? false,
    },
  })
  return c.json(asset, 201)
})

app.delete('/brand/assets/:id', async (c) => {
  await prisma.brandAsset.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

app.get('/brand/guidelines/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const biz = await prisma.business.findUnique({ where: { id: businessId } })
  if (!biz) return c.json({ error: 'Business not found' }, 404)
  const assets = await prisma.brandAsset.findMany({ where: { businessId } })
  return c.json({
    brandName: biz.name,
    tagline: biz.tagline,
    primaryColor: biz.primaryColor || '#d4a843',
    secondaryColor: biz.secondaryColor || '#000000',
    accentColor: biz.accentColor || '#ffffff',
    logoUrl: biz.logoUrl,
    brandStory: biz.brandStory,
    assets: assets.map(a => ({ name: a.name, type: a.type, category: a.category, fileUrl: a.fileUrl })),
    score: [biz.name, biz.tagline, biz.primaryColor, biz.logoUrl, biz.brandStory].filter(Boolean).length,
  })
})

// ═══════════════════════════════════════════
// SUBSCRIPTION PLANS
// ═══════════════════════════════════════════

app.get('/sub/plans', async (c) => {
  const plans = await prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } })
  return c.json(plans)
})

app.get('/sub/business/:businessId', async (c) => {
  const sub = await prisma.businessSubscription.findFirst({
    where: { businessId: c.req.param('businessId'), status: 'active' },
    include: { plan: true },
  })
  return c.json(sub || { plan: null, status: 'none' })
})

app.post('/sub/seed-plans', async (c) => {
  const count = await prisma.subscriptionPlan.count()
  if (count >= 3) return c.json({ ok: true, message: 'Plans already seeded', count })

  const plans = [
    { name: 'Starter', slug: 'starter', description: 'Perfect for new businesses getting started online', price: 99, features: JSON.stringify(['5 products','100 orders/mo','2 AI agents','Basic marketing','Email support']), maxProducts: 5, maxOrders: 100, maxAiAgents: 2, isPopular: false },
    { name: 'Growth', slug: 'growth', description: 'For growing businesses that need more power', price: 249, features: JSON.stringify(['50 products','500 orders/mo','5 AI agents','Full marketing suite','Priority support','SEO tools','Analytics']), maxProducts: 50, maxOrders: 500, maxAiAgents: 5, isPopular: true },
    { name: 'Enterprise', slug: 'enterprise', description: 'Unlimited power for serious businesses', price: 499, features: JSON.stringify(['Unlimited products','Unlimited orders','Unlimited AI agents','All features','Dedicated support','Custom integrations','White-label options']), maxProducts: 99999, maxOrders: 99999, maxAiAgents: 99, isPopular: false },
  ]

  for (const p of plans) {
    await prisma.subscriptionPlan.upsert({ where: { slug: p.slug }, create: p, update: { price: p.price, features: p.features } })
  }
  return c.json({ ok: true, plansCreated: 3 })
})

app.post('/sub/subscribe', async (c) => {
  const body = await c.req.json()
  const plan = await prisma.subscriptionPlan.findUnique({ where: { slug: body.planSlug } })
  if (!plan) return c.json({ error: 'Plan not found' }, 404)
  const existing = await prisma.businessSubscription.findFirst({
    where: { businessId: body.businessId, status: 'active' },
  })
  if (existing) {
    await prisma.businessSubscription.update({ where: { id: existing.id }, data: { status: 'cancelled' } })
  }
  const sub = await prisma.businessSubscription.create({
    data: { businessId: body.businessId, planId: plan.id, status: 'active' },
  })
  return c.json({ ok: true, subscription: sub, plan })
})

// ═══════════════════════════════════════════
// LOCAL MAP & SEARCH VISIBILITY
// ═══════════════════════════════════════════

app.get('/local/listings/:businessId', async (c) => {
  const listings = await prisma.localListing.findMany({
    where: { businessId: c.req.param('businessId') }, orderBy: { createdAt: 'desc' },
  })
  return c.json(listings)
})

app.post('/local/listings/:businessId', async (c) => {
  const body = await c.req.json()
  const listing = await prisma.localListing.upsert({
    where: { businessId_platform: { businessId: c.req.param('businessId'), platform: body.platform } },
    create: {
      businessId: c.req.param('businessId'), platform: body.platform,
      listingUrl: body.listingUrl ?? null, status: 'pending',
    },
    update: { listingUrl: body.listingUrl ?? undefined, status: 'pending' },
  })
  return c.json(listing, 201)
})

app.patch('/local/listings/:id', async (c) => {
  const body = await c.req.json()
  const listing = await prisma.localListing.update({ where: { id: c.req.param('id') }, data: body })
  return c.json(listing)
})

app.get('/seo/records/:businessId', async (c) => {
  const records = await prisma.sEORecord.findMany({
    where: { businessId: c.req.param('businessId') }, orderBy: { createdAt: 'desc' },
  })
  return c.json(records)
})

app.post('/seo/records/:businessId', async (c) => {
  const body = await c.req.json()
  const record = await prisma.sEORecord.upsert({
    where: { businessId_page: { businessId: c.req.param('businessId'), page: body.page } },
    create: {
      businessId: c.req.param('businessId'), page: body.page,
      title: body.title ?? null, description: body.description ?? null,
      keywords: body.keywords ?? null, score: body.score ?? 0,
    },
    update: { title: body.title, description: body.description, keywords: body.keywords, score: body.score, lastChecked: new Date() },
  })
  return c.json(record, 201)
})

app.post('/seo/generate/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const biz = await prisma.business.findUnique({ where: { id: businessId } })
  if (!biz) return c.json({ error: 'Business not found' }, 404)

  const pages = [
    { page: 'home', title: `${biz.name} | ${biz.category || 'Construction'} ${biz.city || 'South Africa'}`, description: `${biz.description || biz.tagline || biz.name} — Professional services in ${biz.city || 'South Africa'}. Contact us for a free quote.`, keywords: [biz.name, biz.category, biz.city, 'construction', 'builder', 'renovation'].filter(Boolean).join(', ') },
    { page: 'services', title: `Our Services | ${biz.name}`, description: `Browse our full range of services: ${biz.description || 'construction, renovation, roofing, painting, and more'}.`, keywords: 'services, construction, renovation, roofing, painting, paving' },
    { page: 'projects', title: `Our Projects | ${biz.name}`, description: `View our completed projects and portfolio. See the quality of our work across ${biz.city || 'KwaZulu-Natal'}.`, keywords: 'projects, portfolio, construction projects, completed work' },
    { page: 'contact', title: `Contact Us | ${biz.name}`, description: `Get in touch with ${biz.name}. Call ${biz.phone || 'us'} or visit us at ${biz.address || 'our office'}.`, keywords: 'contact, phone, address, get a quote, free estimate' },
  ]

  for (const p of pages) {
    await prisma.sEORecord.upsert({
      where: { businessId_page: { businessId, page: p.page } },
      create: { businessId, ...p, score: 75 },
      update: { ...p, score: 75, lastChecked: new Date() },
    })
  }

  const listings = [
    { platform: 'google-business', listingUrl: biz.googleMapsUrl },
    { platform: 'facebook', listingUrl: null },
    { platform: 'instagram', listingUrl: null },
    { platform: 'whatsapp', listingUrl: biz.whatsapp ? `https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}` : null },
  ]

  for (const l of listings) {
    await prisma.localListing.upsert({
      where: { businessId_platform: { businessId, platform: l.platform } },
      create: { businessId, platform: l.platform, listingUrl: l.listingUrl, status: l.listingUrl ? 'connected' : 'pending' },
      update: { listingUrl: l.listingUrl ?? undefined },
    })
  }

  return c.json({ ok: true, seoPages: pages.length, listings: listings.length })
})

// ═══════════════════════════════════════════
// CONNECTIONS — OAuth / API Key / Link adapters
// ═══════════════════════════════════════════

const OAUTH_PROVIDERS: Record<string, {
  name: string; authType: 'oauth' | 'api_key' | 'link_only' | 'whatsapp_business'
  authUrl?: string; tokenUrl?: string; scopes?: string[]
  setupUrl?: string; docsUrl?: string; description: string
}> = {
  'google-business': {
    name: 'Google Business Profile', authType: 'oauth',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/business.manage'],
    setupUrl: 'https://business.google.com',
    docsUrl: 'https://developers.google.com/my-business',
    description: 'Manage your Google Business listing, reviews, and posts',
  },
  'facebook': {
    name: 'Facebook Business', authType: 'oauth',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    setupUrl: 'https://business.facebook.com',
    docsUrl: 'https://developers.facebook.com/docs/facebook-login',
    description: 'Connect your Facebook Business Page for posting and analytics',
  },
  'instagram': {
    name: 'Instagram Business', authType: 'oauth',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
    setupUrl: 'https://business.instagram.com',
    docsUrl: 'https://developers.facebook.com/docs/instagram-api',
    description: 'Post content and manage your Instagram Business account',
  },
  'whatsapp-business': {
    name: 'WhatsApp Business', authType: 'api_key',
    setupUrl: 'https://business.whatsapp.com',
    docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    description: 'Connect WhatsApp Business API for messaging automation',
  },
  'tiktok': {
    name: 'TikTok Business', authType: 'oauth',
    authUrl: 'https://business-api.tiktok.com/portal/auth',
    tokenUrl: 'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
    scopes: ['video.publish', 'video.list'],
    setupUrl: 'https://ads.tiktok.com',
    docsUrl: 'https://business-api.tiktok.com/portal/docs',
    description: 'Publish content and run ads on TikTok',
  },
  'youtube': {
    name: 'YouTube', authType: 'oauth',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube'],
    setupUrl: 'https://studio.youtube.com',
    docsUrl: 'https://developers.google.com/youtube',
    description: 'Upload videos and manage your YouTube channel',
  },
  'linkedin': {
    name: 'LinkedIn Business', authType: 'oauth',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['w_member_social', 'r_liteprofile', 'r_emailaddress'],
    setupUrl: 'https://www.linkedin.com/company',
    docsUrl: 'https://learn.microsoft.com/en-us/linkedin/consumer/integrations',
    description: 'Post updates and manage your LinkedIn Company Page',
  },
  'pinterest': {
    name: 'Pinterest Business', authType: 'oauth',
    authUrl: 'https://www.pinterest.com/oauth/',
    tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
    scopes: ['pins:read', 'pins:write', 'boards:read', 'boards:write'],
    setupUrl: 'https://business.pinterest.com',
    docsUrl: 'https://developers.pinterest.com',
    description: 'Create pins and manage boards for your business',
  },
  'x': {
    name: 'X (Twitter)', authType: 'oauth',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    setupUrl: 'https://developer.x.com',
    docsUrl: 'https://developer.x.com/en/docs/twitter-api',
    description: 'Post tweets and manage your X (Twitter) presence',
  },
  'wordpress': {
    name: 'WordPress', authType: 'api_key',
    setupUrl: 'https://wordpress.com',
    docsUrl: 'https://developer.wordpress.org/rest-api/',
    description: 'Connect your WordPress site via REST API',
  },
  'stripe': {
    name: 'Stripe Payments', authType: 'api_key',
    setupUrl: 'https://dashboard.stripe.com',
    docsUrl: 'https://stripe.com/docs/api',
    description: 'Accept online payments and manage invoices',
  },
  'smtp-email': {
    name: 'Email (SMTP)', authType: 'api_key',
    setupUrl: '#',
    docsUrl: '#',
    description: 'Configure SMTP for transactional email',
  },
  'sms-gateway': {
    name: 'SMS Gateway', authType: 'api_key',
    setupUrl: '#',
    docsUrl: '#',
    description: 'Connect an SMS provider for notifications',
  },
}

// List all available providers with their adapter metadata
app.get('/connections/providers', (c) => {
  const providers = Object.entries(OAUTH_PROVIDERS).map(([slug, p]) => ({
    slug, ...p,
    authTypeLabel: p.authType === 'oauth' ? 'OAuth 2.0' : p.authType === 'api_key' ? 'API Key' : p.authType === 'whatsapp_business' ? 'WhatsApp Business API' : 'Link Only',
  }))
  return c.json(providers)
})

// List connections for a business
app.get('/connections/:businessId', async (c) => {
  const businessId = c.req.param('businessId')
  const connections = await prisma.connection.findMany({
    where: { businessId }, orderBy: { createdAt: 'desc' },
  })
  return c.json(connections)
})

// Generate OAuth authorization URL
app.post('/connections/:businessId/auth-url', async (c) => {
  const businessId = c.req.param('businessId')
  const { provider } = await c.req.json()
  const providerConfig = OAUTH_PROVIDERS[provider]
  if (!providerConfig) return c.json({ error: 'Unknown provider' }, 400)
  if (providerConfig.authType !== 'oauth') {
    return c.json({ error: 'This provider uses API key auth, not OAuth', authType: providerConfig.authType }, 400)
  }

  const redirectUri = `${process.env.SHOGO_API_URL || 'http://localhost:3001'}/api/connections/${businessId}/callback/${provider}`
  const state = Buffer.from(JSON.stringify({ businessId, provider })).toString('base64url')
  const scopes = (providerConfig.scopes || []).join(' ')

  const authUrl = `${providerConfig.authUrl}?response_type=code&client_id=${process.env[`${provider.toUpperCase().replace(/-/g, '_')}_CLIENT_ID`] || 'demo-client-id'}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`

  // Upsert connection record
  await prisma.connection.upsert({
    where: { businessId_provider: { businessId, provider } },
    create: { businessId, provider, displayName: providerConfig.name, authType: providerConfig.authType, status: 'connecting', authUrl, redirectUri },
    update: { status: 'connecting', authUrl, redirectUri },
  })

  return c.json({ authUrl, redirectUri, state })
})

// OAuth callback handler (generic — works for all OAuth providers)
app.get('/connections/:businessId/callback/:provider', async (c) => {
  const businessId = c.req.param('businessId')
  const provider = c.req.param('provider')
  const code = c.req.query('code')
  const error = c.req.query('error')

  if (error) {
    await prisma.connection.update({
      where: { businessId_provider: { businessId, provider } },
      data: { status: 'error', lastError: error },
    }).catch(() => {})
    return c.redirect(`/?connections=error&provider=${provider}&error=${encodeURIComponent(error)}`, 302)
  }

  if (!code) {
    return c.json({ error: 'No authorization code received' }, 400)
  }

  const providerConfig = OAUTH_PROVIDERS[provider]
  if (!providerConfig?.tokenUrl) {
    return c.json({ error: 'Provider not configured for token exchange' }, 400)
  }

  // Token exchange
  try {
    const tokenResponse = await fetch(providerConfig.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.SHOGO_API_URL || 'http://localhost:3001'}/api/connections/${businessId}/callback/${provider}`,
        client_id: process.env[`${provider.toUpperCase().replace(/-/g, '_')}_CLIENT_ID`] || 'demo-client-id',
        client_secret: process.env[`${provider.toUpperCase().replace(/-/g, '_')}_CLIENT_SECRET`] || 'demo-client-secret',
      }),
    })

    const tokenData = await tokenResponse.json() as any

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error)
    }

    // Determine scopes from token response or use configured ones
    const grantedScopes = tokenData.scope || providerConfig.scopes?.join(' ') || ''

    // Update connection with tokens
    const connection = await prisma.connection.upsert({
      where: { businessId_provider: { businessId, provider } },
      create: {
        businessId, provider, displayName: providerConfig.name, authType: providerConfig.authType,
        status: 'connected', accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        tokenExpiry: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
        scopes: grantedScopes, permissions: grantedScopes,
      },
      update: {
        status: 'connected', accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || undefined,
        tokenExpiry: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
        scopes: grantedScopes, permissions: grantedScopes, lastError: null,
      },
    })

    // Try to get account info
    try {
      if (provider === 'google-business') {
        const me = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/categories', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        if (me.ok) await prisma.connection.update({
          where: { id: connection.id }, data: { accountName: 'Google Business Account', status: 'connected' },
        })
      }
    } catch {}

    return c.redirect(`/?connections=success&provider=${provider}`, 302)
  } catch (err: any) {
    await prisma.connection.update({
      where: { businessId_provider: { businessId, provider } },
      data: { status: 'error', lastError: err.message },
    }).catch(() => {})
    return c.redirect(`/?connections=error&provider=${provider}&error=${encodeURIComponent(err.message)}`, 302)
  }
})

// Save API key for a provider
app.post('/connections/:businessId/api-key', async (c) => {
  const businessId = c.req.param('businessId')
  const { provider, apiKey, accountEmail, accountName } = await c.req.json()
  const providerConfig = OAUTH_PROVIDERS[provider]
  if (!providerConfig) return c.json({ error: 'Unknown provider' }, 400)

  // Test the API key with a simple request
  let testResult = 'ok'
  let accountDetails: any = {}

  try {
    if (provider === 'whatsapp-business') {
      // Test WhatsApp Business API
      const resp = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${apiKey}`)
      const data = await resp.json() as any
      if (data.error) throw new Error(data.error.message)
      accountDetails = { accountName: data.name, accountId: data.id }
    } else if (provider === 'stripe') {
      // Test Stripe
      const resp = await fetch('https://api.stripe.com/v1/balance', {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!resp.ok) throw new Error(`Stripe API returned ${resp.status}`)
      accountDetails = { accountName: 'Stripe Account' }
    } else if (provider === 'smtp-email') {
      // SMTP can't be tested via HTTP — just store it
      accountDetails = { accountName: accountEmail || 'SMTP Config' }
    } else {
      // Generic API key — just store it
      accountDetails = { accountName: accountName || `${providerConfig.name} Account` }
    }
  } catch (err: any) {
    testResult = err.message
  }

  const connection = await prisma.connection.upsert({
    where: { businessId_provider: { businessId, provider } },
    create: {
      businessId, provider, displayName: providerConfig.name, authType: providerConfig.authType,
      status: testResult === 'ok' ? 'connected' : 'error',
      apiKey, accountEmail: accountEmail || null,
      accountName: accountDetails.accountName || null,
      accountId: accountDetails.accountId || null,
      lastError: testResult === 'ok' ? null : testResult,
    },
    update: {
      status: testResult === 'ok' ? 'connected' : 'error',
      apiKey, accountEmail: accountEmail || undefined,
      accountName: accountDetails.accountName || undefined,
      accountId: accountDetails.accountId || undefined,
      lastError: testResult === 'ok' ? null : testResult,
    },
  })

  return c.json({ ok: testResult === 'ok', connection, error: testResult !== 'ok' ? testResult : undefined })
})

// Disconnect a provider
app.post('/connections/:businessId/disconnect', async (c) => {
  const businessId = c.req.param('businessId')
  const { provider } = await c.req.json()

  await prisma.connection.update({
    where: { businessId_provider: { businessId, provider } },
    data: {
      status: 'disconnected', accessToken: null, refreshToken: null,
      tokenExpiry: null, apiKey: null, lastError: null,
    },
  }).catch(() => {})

  return c.json({ ok: true })
})

// Test connection health
app.post('/connections/:businessId/test', async (c) => {
  const businessId = c.req.param('businessId')
  const { provider } = await c.req.json()

  const conn = await prisma.connection.findUnique({
    where: { businessId_provider: { businessId, provider } },
  })
  if (!conn) return c.json({ error: 'Connection not found' }, 404)

  let health = 'healthy'
  let message = 'Connection is working'
  let details: any = {}

  try {
    if (conn.authType === 'oauth' && conn.accessToken) {
      if (provider === 'google-business') {
        const resp = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/categories', {
          headers: { Authorization: `Bearer ${conn.accessToken}` },
        })
        if (!resp.ok) { health = 'degraded'; message = `API returned ${resp.status} — token may be expired` }
      } else if (['facebook', 'instagram'].includes(provider)) {
        const resp = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${conn.accessToken}`)
        const data = await resp.json() as any
        if (data.error) { health = 'degraded'; message = data.error.message }
        else details = { accountName: data.name }
      } else {
        // Generic test — just check if token is not expired
        if (conn.tokenExpiry && conn.tokenExpiry < new Date()) {
          health = 'degraded'; message = 'Access token expired — re-authenticate required'
        }
      }
    } else if (conn.authType === 'api_key' && conn.apiKey) {
      if (provider === 'whatsapp-business') {
        const resp = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${conn.apiKey}`)
        const data = await resp.json() as any
        if (data.error) { health = 'error'; message = data.error.message }
      } else if (provider === 'stripe') {
        const resp = await fetch('https://api.stripe.com/v1/balance', {
          headers: { Authorization: `Bearer ${conn.apiKey}` },
        })
        if (!resp.ok) { health = 'error'; message = `Stripe returned ${resp.status}` }
      }
    }
  } catch (err: any) {
    health = 'error'; message = err.message
  }

  await prisma.connection.update({
    where: { id: conn.id },
    data: { status: health === 'healthy' ? 'connected' : health === 'degraded' ? 'connected' : 'error', lastError: health !== 'healthy' ? message : null },
  })

  return c.json({ health, message, details, lastSyncAt: conn.lastSyncAt })
})

// Seed all provider connections for a business
app.post('/connections/:businessId/seed', async (c) => {
  const businessId = c.req.param('businessId')
  const created: string[] = []

  for (const [slug, config] of Object.entries(OAUTH_PROVIDERS)) {
    const existing = await prisma.connection.findUnique({
      where: { businessId_provider: { businessId, provider: slug } },
    }).catch(() => null)

    if (!existing) {
      await prisma.connection.create({
        data: {
          businessId, provider: slug, displayName: config.name,
          authType: config.authType, status: 'disconnected',
          providerUrl: config.setupUrl, authUrl: config.authUrl,
        },
      })
      created.push(slug)
    }
  }

  return c.json({ ok: true, seeded: created.length })
})

export default app

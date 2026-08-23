// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

// Seed script — creates realistic demo data for the Fukulisane Mall OS

async function main() {
  console.log('🌱 Seeding Fukulisane Mall OS...')

  // Clean
  await prisma.businessDNA.deleteMany()
  await prisma.systemModule.deleteMany()
  await prisma.aIModelConfig.deleteMany()
  await prisma.serviceHealth.deleteMany()
  await prisma.engineEvent.deleteMany()
  await prisma.rOIMetric.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.automation.deleteMany()
  await prisma.industryPack.deleteMany()
  await prisma.healthMetric.deleteMany()
  await prisma.aIInsight.deleteMany()
  await prisma.customerProfile.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.gymMember.deleteMany()
  await prisma.trainer.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.aIAgent.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.order.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.socialLink.deleteMany()
  await prisma.plugin.deleteMany()
  await prisma.coachMessage.deleteMany()
  await prisma.special.deleteMany()
  await prisma.demandSignal.deleteMany()
  await prisma.visibilityAction.deleteMany()
  await prisma.translationLog.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.business.deleteMany()
  await prisma.user.deleteMany()

  // ── Users ──
  const user1 = await prisma.user.create({ data: { email: 'thabo@fukulisane.co.za', name: 'Thabo Mokoena' } })
  const user2 = await prisma.user.create({ data: { email: 'nomsa@fukulisane.co.za', name: 'Nomsa Dlamini' } })
  const user3 = await prisma.user.create({ data: { email: 'sipho@fukulisane.co.za', name: 'Sipho Ndlovu' } })
  console.log('✅ Users created')

  // ── Businesses ──
  const b1 = await prisma.business.create({
    data: {
      userId: user1.id, name: 'Mokoena Fitness Hub', slug: 'mokoena-fitness',
      description: 'Premium gym and fitness center in Soweto. Personal training, group classes, and wellness programs.',
      category: 'gym', tagline: 'Your Body, Your Power', brandStory: 'Founded in 2019 to make fitness accessible in our community.',
      address: '78 Vilakazi Street, Soweto', city: 'Johannesburg', country: 'South Africa',
      phone: '+27 11 936 1234', email: 'info@mokoenafitness.co.za', whatsapp: '+27821234567',
      googleMapsUrl: 'https://maps.google.com/?q=-26.2485,27.8540',
      primaryColor: '#DC2626', secondaryColor: '#1E40AF', accentColor: '#F59E0B',
      openingHours: 'Mon-Fri 5:00-21:00, Sat 6:00-18:00, Sun 7:00-14:00',
      storeStatus: 'live', acceptDelivery: false, acceptPickup: true,
    },
  })

  const b2 = await prisma.business.create({
    data: {
      userId: user2.id, name: 'Dlamini Fashion House', slug: 'dlamini-fashion',
      description: 'African-inspired fashion — traditional and modern wear, accessories, and custom designs.',
      category: 'retail', tagline: 'Wear Your Heritage', brandStory: 'Celebrating African fashion since 2018.',
      address: '45 Commissioner Street, CBD', city: 'Johannesburg', country: 'South Africa',
      phone: '+27 11 403 5678', email: 'hello@dlaminifashion.co.za', whatsapp: '+27829876543',
      primaryColor: '#7C3AED', secondaryColor: '#EC4899', accentColor: '#F59E0B',
      openingHours: 'Mon-Sat 9:00-18:00, Sun 10:00-16:00',
      storeStatus: 'live', acceptDelivery: true, deliveryFee: 50, minOrder: 200, acceptPickup: true,
    },
  })

  const b3 = await prisma.business.create({
    data: {
      userId: user3.id, name: 'Ndlovu Kitchen', slug: 'ndlovu-kitchen',
      description: 'Authentic South African cuisine — pap, vleis, chakalaka, and bunny chows. Catering available.',
      category: 'restaurant', tagline: 'Taste of Home', brandStory: 'Grandma Ndlovu\'s recipes, now in your neighborhood.',
      address: '12 Bree Street, Braamfontein', city: 'Johannesburg', country: 'South Africa',
      phone: '+27 11 403 9999', email: 'orders@ndlovukitchen.co.za', whatsapp: '+27825551234',
      primaryColor: '#EA580C', secondaryColor: '#16A34A', accentColor: '#CA8A04',
      openingHours: 'Mon-Sun 11:00-22:00',
      storeStatus: 'live', acceptDelivery: true, deliveryFee: 35, minOrder: 100, acceptPickup: true,
    },
  })
  console.log('✅ Businesses created')

  // ── Social Links ──
  await prisma.socialLink.createMany({ data: [
    { businessId: b1.id, platform: 'instagram', url: 'https://instagram.com/mokoenafitness' },
    { businessId: b1.id, platform: 'facebook', url: 'https://facebook.com/mokoenafitness' },
    { businessId: b2.id, platform: 'instagram', url: 'https://instagram.com/dlaminifashion' },
    { businessId: b2.id, platform: 'tiktok', url: 'https://tiktok.com/@dlaminifashion' },
    { businessId: b3.id, platform: 'instagram', url: 'https://instagram.com/ndlovukitchen' },
    { businessId: b3.id, platform: 'facebook', url: 'https://facebook.com/ndlovukitchen' },
  ]})

  // ── Products ──
  await prisma.product.createMany({ data: [
    // Gym products
    { businessId: b1.id, name: 'Monthly Membership', description: 'Unlimited access to all gym facilities', price: 450, isAvailable: true },
    { businessId: b1.id, name: '10-Class Pack', description: '10 group fitness classes (spinning, HIIT, yoga)', price: 800, isAvailable: true },
    { businessId: b1.id, name: 'Personal Training (4 sessions)', description: '4x 1-hour sessions with a certified trainer', price: 1200, isAvailable: true },
    { businessId: b1.id, name: 'Protein Shake — Chocolate', description: 'Whey protein shake, 30g protein', price: 65, isAvailable: true },
    { businessId: b1.id, name: 'Gym Towel', description: 'Premium microfiber gym towel', price: 120, isAvailable: true },
    { businessId: b1.id, name: 'Shaker Bottle', description: 'BPA-free shaker bottle 700ml', price: 85, isAvailable: true },
    // Fashion products
    { businessId: b2.id, name: 'Shweshwe Wrap Dress', description: 'Traditional Shweshwe print wrap dress, all sizes', price: 650, isAvailable: true },
    { businessId: b2.id, name: 'Men\'s Madiba Shirt', description: 'Iconic Madiba-print button-up shirt', price: 480, isAvailable: true },
    { businessId: b2.id, name: 'African Bead Necklace', description: 'Handcrafted Zulu beadwork necklace', price: 220, isAvailable: true },
    { businessId: b2.id, name: 'Leather Handbag', description: 'Genuine leather handbag with African motif', price: 890, isAvailable: true },
    { businessId: b2.id, name: 'Headwrap (3-pack)', description: '3 vibrant African print headwraps', price: 180, isAvailable: true },
    // Restaurant products
    { businessId: b3.id, name: 'Bunny Chow — Mutton', description: 'Hollowed bread filled with spicy mutton curry', price: 85, isAvailable: true },
    { businessId: b3.id, name: 'Bunny Chow — Chicken', description: 'Hollowed bread filled with mild chicken curry', price: 75, isAvailable: true },
    { businessId: b3.id, name: 'Pap en Vleis', description: 'Creamy pap with grilled boerewors and chakalaka', price: 110, isAvailable: true },
    { businessId: b3.id, name: 'Chakalaka (side)', description: 'Spicy vegetable relish, serves 2', price: 35, isAvailable: true },
    { businessId: b3.id, name: 'Mogodu (Tripe) Plate', description: 'Slow-cooked tripe with morogo and pap', price: 95, isAvailable: true },
    { businessId: b3.id, name: 'Koeksister (3-pack)', description: 'Traditional syrup-doughnut treats', price: 40, isAvailable: true },
    { businessId: b3.id, name: 'Mageu (1L)', description: 'Traditional fermented maize drink', price: 25, isAvailable: true },
  ]})
  console.log('✅ Products created')

  // ── Gym Members ──
  await prisma.gymMember.createMany({ data: [
    { businessId: b1.id, firstName: 'Lebo', lastName: 'Mahlangu', email: 'lebo@gmail.com', phone: '+27821112222', membershipType: 'premium', status: 'active', attendanceCount: 18, totalSpent: 5400, healthScore: 92, churnRisk: 10 },
    { businessId: b1.id, firstName: 'Tshepo', lastName: 'Mashigo', phone: '+27823334444', membershipType: 'standard', status: 'active', attendanceCount: 12, totalSpent: 3600, healthScore: 78, churnRisk: 25 },
    { businessId: b1.id, firstName: 'Kabelo', lastName: 'Moroka', phone: '+27825556666', membershipType: 'standard', status: 'active', attendanceCount: 8, totalSpent: 2400, healthScore: 65, churnRisk: 55 },
    { businessId: b1.id, firstName: 'Dineo', lastName: 'Phiri', email: 'dineo@yahoo.com', phone: '+27827778888', membershipType: 'premium', status: 'active', attendanceCount: 22, totalSpent: 7200, healthScore: 95, churnRisk: 5 },
    { businessId: b1.id, firstName: 'Thabiso', lastName: 'Khumalo', phone: '+27829990000', membershipType: 'basic', status: 'inactive', attendanceCount: 2, totalSpent: 600, healthScore: 30, churnRisk: 90 },
    { businessId: b1.id, firstName: 'Precious', lastName: 'Ndaba', email: 'precious@gmail.com', membershipType: 'standard', status: 'active', attendanceCount: 15, totalSpent: 4500, healthScore: 82, churnRisk: 15 },
    { businessId: b1.id, firstName: 'Sibusiso', lastName: 'Zulu', membershipType: 'basic', status: 'active', attendanceCount: 6, totalSpent: 1800, healthScore: 55, churnRisk: 60 },
    { businessId: b1.id, firstName: 'Mpho', lastName: 'Tshabalala', phone: '+27824445555', membershipType: 'premium', status: 'active', attendanceCount: 20, totalSpent: 6000, healthScore: 88, churnRisk: 8 },
  ]})
  console.log('✅ Members created')

  // ── Trainers ──
  await prisma.trainer.createMany({ data: [
    { businessId: b1.id, firstName: 'Bongani', lastName: 'Maseko', specialization: 'Strength & Conditioning', certification: 'ACE Certified', status: 'active', hourlyRate: 350, utilization: 85, rating: 4.8, clientCount: 12 },
    { businessId: b1.id, firstName: 'Ayanda', lastName: 'Sithole', specialization: 'Yoga & Wellness', certification: 'RYT-500', status: 'active', hourlyRate: 300, utilization: 72, rating: 4.9, clientCount: 8 },
    { businessId: b1.id, firstName: 'Mandla', lastName: 'Buthelezi', specialization: 'HIIT & Cardio', certification: 'NASM Certified', status: 'active', hourlyRate: 320, utilization: 90, rating: 4.7, clientCount: 15 },
  ]})
  console.log('✅ Trainers created')

  // ── Staff ──
  await prisma.staff.createMany({ data: [
    { businessId: b1.id, firstName: 'Ntokozo', lastName: 'Mkhize', role: 'Front Desk', department: 'Operations', status: 'active', shift: 'Morning', hourlyRate: 85 },
    { businessId: b1.id, firstName: 'Lerato', lastName: 'Motaung', role: 'Manager', department: 'Management', status: 'active', shift: 'Full Day', hourlyRate: 150 },
    { businessId: b3.id, firstName: 'Grace', lastName: 'Mkhize', role: 'Head Chef', department: 'Kitchen', status: 'active', shift: 'Morning', hourlyRate: 120 },
    { businessId: b3.id, firstName: 'David', lastName: 'Molefe', role: 'Waiter', department: 'Floor', status: 'active', shift: 'Evening', hourlyRate: 75 },
    { businessId: b3.id, firstName: 'Thandi', lastName: 'Zulu', role: 'Cashier', department: 'Front', status: 'active', shift: 'Afternoon', hourlyRate: 80 },
  ]})
  console.log('✅ Staff created')

  // ── Sales ──
  const now = new Date()
  const salesData: any[] = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const numSales = Math.floor(Math.random() * 5) + 1
    for (let j = 0; j < numSales; j++) {
      const products = b1Products()
      const p = products[Math.floor(Math.random() * products.length)]
      salesData.push({
        businessId: [b1.id, b2.id, b3.id][Math.floor(Math.random() * 3)],
        productName: p.name, quantity: Math.floor(Math.random() * 3) + 1,
        unitPrice: p.price, total: p.price * (Math.floor(Math.random() * 3) + 1),
        createdAt: date,
      })
    }
  }
  await prisma.sale.createMany({ data: salesData })
  console.log('✅ Sales created')

  // ── Orders ──
  await prisma.order.createMany({ data: [
    { businessId: b3.id, orderNumber: 'ORD-0001', customerName: 'John M.', customerPhone: '+27821111111', items: JSON.stringify([{ name: 'Bunny Chow — Mutton', qty: 2, price: 85 }, { name: 'Mageu (1L)', qty: 1, price: 25 }]), subtotal: 195, total: 195, status: 'delivered', deliveryMethod: 'delivery', paymentMethod: 'whatsapp', paymentStatus: 'paid', deliveryFee: 35 },
    { businessId: b3.id, orderNumber: 'ORD-0002', customerName: 'Sarah K.', customerPhone: '+27822222222', items: JSON.stringify([{ name: 'Pap en Vleis', qty: 1, price: 110 }, { name: 'Chakalaka (side)', qty: 1, price: 35 }]), subtotal: 145, total: 180, status: 'ready', deliveryMethod: 'delivery', paymentMethod: 'cash', paymentStatus: 'paid', deliveryFee: 35 },
    { businessId: b3.id, orderNumber: 'ORD-0003', customerName: 'Peter N.', items: JSON.stringify([{ name: 'Koeksister (3-pack)', qty: 3, price: 40 }]), subtotal: 120, total: 120, status: 'pending', deliveryMethod: 'pickup', paymentMethod: 'whatsapp', paymentStatus: 'unpaid' },
    { businessId: b2.id, orderNumber: 'ORD-0001', customerName: 'Lerato M.', customerPhone: '+27823333333', items: JSON.stringify([{ name: 'Shweshwe Wrap Dress', qty: 1, price: 650 }]), subtotal: 650, total: 700, status: 'shipped', deliveryMethod: 'delivery', paymentMethod: 'card', paymentStatus: 'paid', deliveryFee: 50 },
    { businessId: b2.id, orderNumber: 'ORD-0002', customerName: 'Dineo P.', customerPhone: '+27824444444', items: JSON.stringify([{ name: 'Men\'s Madiba Shirt', qty: 2, price: 480 }, { name: 'Headwrap (3-pack)', qty: 1, price: 180 }]), subtotal: 1140, total: 1140, status: 'pending', deliveryMethod: 'pickup', paymentMethod: 'cash', paymentStatus: 'unpaid' },
  ]})
  console.log('✅ Orders created')

  // ── Customer Profiles ──
  await prisma.customerProfile.createMany({ data: [
    { businessId: b1.id, source: 'whatsapp', socialPlatform: 'instagram', socialHandle: '@lebo_fit', location: 'Soweto', interests: 'fitness,weightlifting', engagementScore: 92, lifetimeValue: 5400, tags: 'premium,vip' },
    { businessId: b1.id, source: 'walk_in', location: 'Soweto', interests: 'yoga,wellness', engagementScore: 78, lifetimeValue: 2400, tags: 'regular' },
    { businessId: b2.id, source: 'instagram', socialPlatform: 'instagram', socialHandle: '@fashionista_za', location: 'Sandton', interests: 'fashion,african-print', engagementScore: 88, lifetimeValue: 3200, tags: 'vip,fashion-forward' },
    { businessId: b3.id, source: 'whatsapp', location: 'Braamfontein', interests: 'food,catering', engagementScore: 95, lifetimeValue: 4800, tags: 'regular,catering-client' },
    { businessId: b3.id, source: 'google', location: 'CBD', interests: 'events,food', engagementScore: 65, lifetimeValue: 800, tags: 'new' },
  ]})
  console.log('✅ Customer profiles created')

  // ── Leads ──
  await prisma.lead.createMany({ data: [
    { businessId: b1.id, name: 'Tshepo M.', phone: '+27825555555', source: 'whatsapp', status: 'qualified', score: 75, notes: 'Interested in personal training package' },
    { businessId: b1.id, name: 'Bonolo K.', email: 'bonolo@gmail.com', source: 'website', status: 'new', score: 40, notes: 'Filled out membership inquiry form' },
    { businessId: b2.id, name: 'Zanele M.', phone: '+27826666666', source: 'instagram', status: 'qualified', score: 85, notes: 'Wants bulk order for wedding' },
    { businessId: b3.id, name: 'SABC Events', email: 'events@sabc.co.za', source: 'email', status: 'new', score: 90, notes: 'Catering inquiry for 200 people at year-end function' },
  ]})
  console.log('✅ Leads created')

  // ── AI Agents ──
  await prisma.aIAgent.createMany({ data: [
    { businessId: b1.id, name: 'Seller Agent', type: 'seller', status: 'active', actionsToday: 24, totalActions: 1560, lastAction: 'Optimized membership pricing', impact: 'high' },
    { businessId: b1.id, name: 'Customer Agent', type: 'customer', status: 'active', actionsToday: 18, totalActions: 890, lastAction: 'Responded to WhatsApp inquiry', impact: 'medium' },
    { businessId: b1.id, name: 'Marketing Agent', type: 'marketing', status: 'active', actionsToday: 12, totalActions: 450, lastAction: 'Posted gym tip on Instagram', impact: 'medium' },
    { businessId: b2.id, name: 'Seller Agent', type: 'seller', status: 'active', actionsToday: 15, totalActions: 780, lastAction: 'Updated product catalog', impact: 'high' },
    { businessId: b3.id, name: 'Seller Agent', type: 'seller', status: 'active', actionsToday: 30, totalActions: 2100, lastAction: 'Processed 5 WhatsApp orders', impact: 'high' },
    { businessId: b3.id, name: 'Fraud Agent', type: 'fraud', status: 'active', actionsToday: 8, totalActions: 340, lastAction: 'Verified order #ORD-0003', impact: 'low' },
  ]})
  console.log('✅ AI Agents created')

  // ── Health Metrics ──
  await prisma.healthMetric.createMany({ data: [
    { businessId: b1.id, metricName: 'Revenue Health', value: 28500, unit: 'ZAR', status: 'healthy', trend: 12, period: 'monthly' },
    { businessId: b1.id, metricName: 'Member Retention', value: 82, unit: '%', status: 'healthy', trend: 3, period: 'monthly' },
    { businessId: b1.id, metricName: 'Trainer Utilization', value: 82, unit: '%', status: 'healthy', trend: 5, period: 'monthly' },
    { businessId: b1.id, metricName: 'Lead Conversion', value: 35, unit: '%', status: 'warning', trend: -2, period: 'monthly' },
    { businessId: b1.id, metricName: 'Overall Health', value: 85, unit: '%', status: 'healthy', trend: 8, period: 'monthly' },
    { businessId: b3.id, metricName: 'Revenue Health', value: 42000, unit: 'ZAR', status: 'healthy', trend: 15, period: 'monthly' },
    { businessId: b3.id, metricName: 'Visibility Score', value: 75, unit: '%', status: 'healthy', trend: 10, period: 'monthly' },
  ]})
  console.log('✅ Health metrics created')

  // ── AI Insights ──
  await prisma.aIInsight.createMany({ data: [
    { businessId: b1.id, type: 'opportunity', title: 'Peak Hours Analysis', description: 'Gym is busiest 17:00-19:00. Consider off-peak discounts.', priority: 'medium', category: 'operations', impact: 'medium' },
    { businessId: b1.id, type: 'alert', title: '3 Members At Risk', description: 'Kabelo, Thabiso, and Sibusiso show low engagement. Send re-engagement campaign.', priority: 'high', category: 'retention', impact: 'high' },
    { businessId: b1.id, type: 'improvement', title: 'Add Protein Bars', description: 'Protein shakes sell well. Add protein bars for cross-sell.', priority: 'low', category: 'products', impact: 'low' },
    { businessId: b3.id, type: 'opportunity', title: 'Catering Inquiry', description: 'SABC wants 200-person catering. Could be R35,000+ order.', priority: 'high', category: 'sales', impact: 'high' },
    { businessId: b3.id, type: 'alert', title: 'Weekend Rush', description: 'Saturday 12:00-14:00 has 45min wait times. Pre-prep strategy needed.', priority: 'medium', category: 'operations', impact: 'medium' },
  ]})
  console.log('✅ AI Insights created')

  // ── Automations ──
  await prisma.automation.createMany({ data: [
    { businessId: b1.id, name: 'Welcome New Members', slug: 'welcome-member', description: 'Auto-send WhatsApp welcome message when member joins', category: 'communication', triggerType: 'event', actionType: 'whatsapp', isEnabled: true, icon: 'message-circle', runCount: 47 },
    { businessId: b1.id, name: 'Churn Prevention', slug: 'churn-prevention', description: 'Send re-engagement offer to members inactive >7 days', category: 'retention', triggerType: 'schedule', actionType: 'whatsapp', isEnabled: true, icon: 'shield', runCount: 12 },
    { businessId: b3.id, name: 'Order Confirmation', slug: 'order-confirm', description: 'WhatsApp confirmation when order placed', category: 'communication', triggerType: 'event', actionType: 'whatsapp', isEnabled: true, icon: 'check-circle', runCount: 234 },
    { businessId: b3.id, name: 'Daily Menu Post', slug: 'daily-menu', description: 'Post daily specials to WhatsApp status at 10am', category: 'marketing', triggerType: 'schedule', actionType: 'notification', isEnabled: true, icon: 'calendar', runCount: 180 },
  ]})
  console.log('✅ Automations created')

  // ── Approvals ──
  await prisma.approval.createMany({ data: [
    { businessId: b1.id, engine: 'marketing', actionType: 'campaign', title: 'Valentine\'s Day Promo', description: '50% off couples membership — Feb 14', riskLevel: 'medium', status: 'pending' },
    { businessId: b3.id, engine: 'sales', actionType: 'pricing', title: 'Weekend Price Adjustment', description: 'Increase bunny chow price by R5 due to ingredient costs', riskLevel: 'low', status: 'approved' },
  ]})
  console.log('✅ Approvals created')

  // ── Engine Events ──
  const eventTypes = ['info', 'success', 'warning', 'critical']
  const engines = ['sales', 'marketing', 'members', 'discovery', 'people', 'analytics']
  const events: any[] = []
  for (let i = 0; i < 30; i++) {
    const d = new Date(now)
    d.setHours(d.getHours() - i * 2)
    events.push({
      businessId: b1.id,
      engine: engines[Math.floor(Math.random() * engines.length)],
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      title: ['New sale recorded', 'Member check-in', 'Marketing post sent', 'Lead qualified', 'Inventory alert', 'AI insight generated', 'WhatsApp sent'][Math.floor(Math.random() * 7)],
      description: 'Automated event from invisible engine',
      impactScore: Math.random() * 10,
      createdAt: d,
    })
  }
  await prisma.engineEvent.createMany({ data: events })
  console.log('✅ Engine events created')

  // ── Coach Messages ──
  await prisma.coachMessage.createMany({ data: [
    { businessId: b1.id, role: 'assistant', content: 'Welcome to your AI Business Coach! I can help you grow Mokoena Fitness Hub. What would you like to discuss?' },
    { businessId: b1.id, role: 'user', content: 'How can I reduce member churn?' },
    { businessId: b1.id, role: 'assistant', content: 'Great question! I see 3 members with high churn risk (>50%). Here\'s my recommendation:\n\n1. **Kabelo Moroka** (55% risk) — hasn\'t attended in 2 weeks. Send a "We miss you" WhatsApp with a free PT session.\n2. **Thabiso Khumalo** (90% risk) — almost inactive. Call him personally, ask about his experience.\n3. **Sibusiso Zulu** (60% risk) — low attendance. Suggest switching to a class package he enjoys more.\n\nI can set up automated WhatsApp messages for these. Want me to?' },
  ]})
  console.log('✅ Coach messages created')

  // ── Business DNA ──
  await prisma.businessDNA.create({
    data: {
      businessId: b1.id,
      mission: 'Make fitness accessible and enjoyable for every South African',
      vision: 'The #1 fitness community in Gauteng by 2028',
      values: 'Community, Inclusivity, Excellence, Fun',
      targetAudience: 'Young professionals (25-40) in Soweto and surrounding areas',
      brandVoice: 'Encouraging, energetic, locally grounded',
      competencies: 'Personal training, group classes, nutrition coaching',
      usp: 'Afro-centric fitness programs that celebrate our culture',
    },
  })
  console.log('✅ Business DNA created')

  console.log('\n🎉 Seed complete!')
  console.log(`   👤 Users: 3`)
  console.log(`   🏪 Businesses: 3`)
  console.log(`   📦 Products: 18`)
  console.log(`   🏋️ Members: 8`)
  console.log(`   👔 Trainers: 3`)
  console.log(`   🤖 AI Agents: 6`)
  console.log(`   📊 Sales: ${salesData.length}`)
  console.log(`   🛒 Orders: 5`)
  console.log(`   👥 Customers: 5`)
  console.log(`   📋 Leads: 4`)
  console.log(`   ⚙️ Automations: 4`)
  console.log(`   🔍 Insights: 5`)
  console.log(`   📰 Events: 30`)

  await prisma.$disconnect()
}

function b1Products() {
  return [
    { name: 'Monthly Membership', price: 450 },
    { name: '10-Class Pack', price: 800 },
    { name: 'Protein Shake', price: 65 },
    { name: 'Gym Towel', price: 120 },
    { name: 'Shaker Bottle', price: 85 },
  ]
}

main().catch((e) => { console.error(e); process.exit(1) })

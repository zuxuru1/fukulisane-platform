import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function seed() {
  console.log('Seeding database...')

  let business = await prisma.business.findFirst()
  if (!business) {
    business = await prisma.business.create({
      data: {
        name: 'Fukulisane Gym',
        category: 'fitness',
        slug: 'fukulisane-gym',
      }
    })
  }
  console.log(`Business: ${business.name} (${business.id})`)

  const memberData = [
    { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@email.com', phone: '+27825550101', membershipType: 'vip', status: 'active', attendanceCount: 156, totalSpent: 45000, healthScore: 92, churnRisk: 5 },
    { firstName: 'Mike', lastName: 'Chen', email: 'mike@email.com', phone: '+27835550202', membershipType: 'premium', status: 'active', attendanceCount: 89, totalSpent: 28000, healthScore: 78, churnRisk: 15 },
    { firstName: 'Emma', lastName: 'Williams', phone: '+27845550303', membershipType: 'standard', status: 'active', attendanceCount: 34, totalSpent: 8500, healthScore: 65, churnRisk: 35 },
    { firstName: 'David', lastName: 'Brown', email: 'david@email.com', membershipType: 'vip', status: 'active', attendanceCount: 245, totalSpent: 72000, healthScore: 95, churnRisk: 2 },
    { firstName: 'Lisa', lastName: 'Taylor', email: 'lisa@email.com', phone: '+27855550505', membershipType: 'student', status: 'inactive', attendanceCount: 12, totalSpent: 3000, healthScore: 30, churnRisk: 75 },
    { firstName: 'James', lastName: 'Wilson', membershipType: 'premium', status: 'frozen', attendanceCount: 67, totalSpent: 21000, healthScore: 45, churnRisk: 55 },
    { firstName: 'Sophie', lastName: 'Anderson', email: 'sophie@email.com', membershipType: 'standard', status: 'active', attendanceCount: 28, totalSpent: 7000, healthScore: 72, churnRisk: 20 },
    { firstName: 'Tom', lastName: 'Harris', phone: '+27865550808', membershipType: 'standard', status: 'cancelled', attendanceCount: 45, totalSpent: 11250, healthScore: 0, churnRisk: 100 },
    { firstName: 'Nomsa', lastName: 'Dlamini', email: 'nomsa@email.com', membershipType: 'premium', status: 'active', attendanceCount: 102, totalSpent: 31000, healthScore: 85, churnRisk: 8 },
    { firstName: 'Pieter', lastName: 'van der Merwe', email: 'pieter@email.com', membershipType: 'vip', status: 'active', attendanceCount: 189, totalSpent: 56000, healthScore: 90, churnRisk: 3 },
  ]

  for (const m of memberData) {
    await prisma.gymMember.create({ data: { ...m, businessId: business.id } })
  }
  console.log(`Created ${memberData.length} gym members`)

  const trainerData = [
    { firstName: 'James', lastName: 'Mokoena', email: 'james@fukulisane.com', phone: '+27821111111', specialization: 'Strength & Conditioning', certification: 'NSCA-CSCS', status: 'active', hourlyRate: 350, utilization: 85, rating: 4.9, clientCount: 28 },
    { firstName: 'Sarah', lastName: 'Khumalo', email: 'sarah@fukulisane.com', phone: '+27832222222', specialization: 'Yoga & Pilates', certification: 'RYT-500', status: 'active', hourlyRate: 300, utilization: 78, rating: 4.8, clientCount: 24 },
    { firstName: 'Mike', lastName: 'Thompson', email: 'mike@fukulisane.com', specialization: 'CrossFit', certification: 'CF-L3', status: 'active', hourlyRate: 320, utilization: 72, rating: 4.7, clientCount: 22 },
    { firstName: 'Lisa', lastName: 'Petersen', phone: '+27844444444', specialization: 'HIIT & Cardio', certification: 'ACE-CPT', status: 'active', hourlyRate: 280, utilization: 68, rating: 4.9, clientCount: 19 },
  ]

  for (const t of trainerData) {
    await prisma.trainer.create({ data: { ...t, businessId: business.id } })
  }
  console.log(`Created ${trainerData.length} trainers`)

  const staffData = [
    { firstName: 'Thabo', lastName: 'Molefe', email: 'thabo@fukulisane.com', phone: '+27815550101', role: 'Front Desk Manager', department: 'Operations', status: 'active', shift: 'Morning', hourlyRate: 85 },
    { firstName: 'Nomsa', lastName: 'Dlamini', phone: '+27825550202', role: 'Receptionist', department: 'Operations', status: 'active', shift: 'Afternoon', hourlyRate: 65 },
    { firstName: 'Sipho', lastName: 'Zulu', email: 'sipho@fukulisane.com', role: 'Maintenance', department: 'Facilities', status: 'active', shift: 'Morning', hourlyRate: 70 },
    { firstName: 'Lerato', lastName: 'Mokoena', role: 'Cleaning Staff', department: 'Facilities', status: 'active', shift: 'Evening', hourlyRate: 55 },
  ]

  for (const s of staffData) {
    await prisma.staff.create({ data: { ...s, businessId: business.id } })
  }
  console.log(`Created ${staffData.length} staff`)

  const agentData = [
    { name: 'PT Agent', type: 'Personal Training Intelligence', status: 'active', actionsToday: 12, totalActions: 342, lastAction: 'Recommended workout plan for 3 at-risk members' },
    { name: 'Nutrition Agent', type: 'Meal Plan Intelligence', status: 'idle', actionsToday: 0, totalActions: 89, lastAction: 'Generated weekly meal plans' },
    { name: 'Marketing Agent', type: 'Campaign Intelligence', status: 'optimizing', actionsToday: 5, totalActions: 156, lastAction: 'Optimizing social media ad spend' },
    { name: 'Sales Agent', type: 'Revenue Intelligence', status: 'active', actionsToday: 3, totalActions: 234, lastAction: 'Identified upsell opportunities for premium members' },
    { name: 'Member Success', type: 'Retention Intelligence', status: 'active', actionsToday: 8, totalActions: 412, lastAction: 'Flagged 3 at-risk members for outreach' },
    { name: 'Analytics Agent', type: 'Business Intelligence', status: 'learning', actionsToday: 2, totalActions: 189, lastAction: 'Analyzing attendance patterns' },
    { name: 'Business Coach', type: 'Strategic Intelligence', status: 'active', actionsToday: 1, totalActions: 67, lastAction: 'Revenue forecast updated' },
  ]

  for (const a of agentData) {
    await prisma.aIAgent.create({ data: { ...a, businessId: business.id } })
  }
  console.log(`Created ${agentData.length} AI agents`)

  const metricData = [
    { metricName: 'Membership Growth', value: 3, unit: '%', status: 'healthy', trend: 3, period: 'monthly' },
    { metricName: 'Revenue Health', value: 284000, unit: 'ZAR', status: 'healthy', trend: 18, period: 'monthly' },
    { metricName: 'Member Retention', value: 87, unit: '%', status: 'warning', trend: -2, period: 'monthly' },
    { metricName: 'Avg Attendance', value: 4.2, unit: 'days/wk', status: 'healthy', trend: 0.3, period: 'monthly' },
    { metricName: 'Lead Conversion', value: 4.2, unit: '%', status: 'warning', trend: 0.8, period: 'monthly' },
    { metricName: 'Satisfaction Score', value: 4.6, unit: '/5', status: 'healthy', trend: 0, period: 'monthly' },
    { metricName: 'Trainer Utilization', value: 78, unit: '%', status: 'healthy', trend: 5, period: 'monthly' },
    { metricName: 'Churn Risk Score', value: 8, unit: 'members', status: 'warning', trend: 2, period: 'monthly' },
  ]

  for (const m of metricData) {
    await prisma.healthMetric.create({ data: { ...m, businessId: business.id } })
  }
  console.log(`Created ${metricData.length} health metrics`)

  const insightData = [
    { type: 'alert', title: 'Churn Risk Increased', description: '8 members showing signs of potential churn. Consider outreach campaigns.', priority: 'high', category: 'retention', impact: 'high' },
    { type: 'opportunity', title: 'Revenue Growth Opportunity', description: 'Personal training packages are underutilized. Bundle opportunities available.', priority: 'medium', category: 'revenue', impact: 'medium' },
    { type: 'improvement', title: 'Attendance Pattern Detected', description: 'Tuesday evenings show 40% lower attendance. Consider special classes.', priority: 'low', category: 'operations', impact: 'low' },
    { type: 'alert', title: 'Trainer Underutilized', description: 'Lisa Petersen at 68% utilization. Could take on 3 more clients.', priority: 'medium', category: 'staff', impact: 'medium' },
    { type: 'opportunity', title: 'Social Media Growth', description: 'Instagram engagement up 23%. Consider influencer partnerships.', priority: 'medium', category: 'marketing', impact: 'high' },
  ]

  for (const i of insightData) {
    await prisma.aIInsight.create({ data: { ...i, businessId: business.id } })
  }
  console.log(`Created ${insightData.length} AI insights`)

  const profileData = [
    { source: 'Instagram', socialPlatform: 'Instagram', socialHandle: '@sarahfit', location: 'Sandton', interests: 'Yoga,Weight Training,Nutrition', engagementScore: 85, lifetimeValue: 12500 },
    { source: 'Facebook', socialPlatform: 'Facebook', location: 'Rosebank', interests: 'CrossFit,HIIT', engagementScore: 72, lifetimeValue: 8200 },
    { source: 'Walk-in', location: 'Bryanston', interests: 'Swimming,Cardio', engagementScore: 45, lifetimeValue: 3400 },
    { source: 'Referral', location: 'Fourways', interests: 'Bodybuilding,Supplements', engagementScore: 90, lifetimeValue: 18900 },
    { source: 'Google Ads', socialPlatform: 'Instagram', socialHandle: '@lisat', location: 'Midrand', interests: 'Pilates,Wellness', engagementScore: 35, lifetimeValue: 1200 },
  ]

  for (const p of profileData) {
    await prisma.customerProfile.create({ data: { ...p, businessId: business.id } })
  }
  console.log(`Created ${profileData.length} customer profiles`)

  const leadData = [
    { name: 'Alex Nkosi', email: 'alex@email.com', phone: '+27820001111', source: 'Instagram', status: 'new', score: 75 },
    { name: 'Thandi Modise', email: 'thandi@email.com', source: 'Referral', status: 'contacted', score: 82 },
    { name: 'Kevin Patel', phone: '+27830003333', source: 'Google Ads', status: 'qualified', score: 68 },
    { name: 'Zanele Khumalo', email: 'zanele@email.com', source: 'Facebook', status: 'new', score: 55 },
  ]

  for (const l of leadData) {
    await prisma.lead.create({ data: { ...l, businessId: business.id } })
  }
  console.log(`Created ${leadData.length} leads`)

  console.log('Seeding complete!')
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

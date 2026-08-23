import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Puzzle, MessageCircle, Megaphone, DollarSign, Hammer, FileText,
  Eye, BarChart3, Zap, Code2, CreditCard, Search, Download, Upload,
  CheckCircle2, XCircle, AlertTriangle, ExternalLink, RefreshCw,
  Shield, Activity, Wifi, WifiOff, Star, TrendingUp, Clock,
  Settings, Power, Trash2, ArrowUpRight, Copy, Globe, Layers,
  Cpu, Database, Lock, Unlock, Terminal, GitBranch, Package,
  Brain, Image, Calendar, Bell, Mail, Phone, MapPin,
  Plus, Minus, Calculator, ChevronRight, ChevronDown, ChevronUp,
  Building, Sparkles, Target, Rocket, Link2, Server, Key,
  BarChart, PieChart, Gauge, Wrench, Home, Truck, ShoppingCart,
  BookOpen, Users, GraduationCap, Palette
} from 'lucide-react'

const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'

// Fallback icon components for icons not in lucide-react
const CarIcon = ({ className, style }: any) => <div className={className} style={{...style, lineHeight:1}}>🚗</div>
const DropletsIcon = ({ className, style }: any) => <div className={className} style={{...style, lineHeight:1}}>💧</div>
const RectangleHorizontalIcon = ({ className, style }: any) => <div className={className} style={{...style, lineHeight:1}}>▬</div>
const Grid3x3Icon = ({ className, style }: any) => <div className={className} style={{...style, lineHeight:1}}>⊞</div>
const SquareIcon = ({ className, style }: any) => <div className={className} style={{...style, lineHeight:1}}>□</div>
const FenceIcon = ({ className, style }: any) => <div className={className} style={{...style, lineHeight:1}}>🏗</div>

// ══════════════════════════════════════════════════════════════
// MARKETPLACE MODULE CATEGORIES — every category from the spec
// ══════════════════════════════════════════════════════════════

type ModuleStatus = 'available' | 'installed' | 'connected' | 'error' | 'updating'

interface MarketplaceModule {
  id: string
  slug: string
  name: string
  description: string
  category: string
  subcategory: string
  provider: string
  version: string
  icon: any
  color: string
  price: number
  isFree: boolean
  rating: number
  reviewCount: number
  installCount: number
  permissions: string[]
  actions: string[]
  status: ModuleStatus
  healthScore: number
  lastSynced: string | null
  isCompatible: boolean
  isFeatured?: boolean
  website?: string
  docs?: string
}

const ALL_MODULES: MarketplaceModule[] = [
  // ── Customer Communication ──
  { id: 'cm-ai-chatbot', slug: 'ai-chatbot', name: 'AI Chatbot', description: '24/7 intelligent customer chat assistant with natural language understanding', category: 'Customer Communication', subcategory: 'Chat', provider: 'BGOS Intelligence', version: '2.4.1', icon: MessageCircle, color: '#2563eb', price: 0, isFree: true, rating: 4.8, reviewCount: 342, installCount: 12400, permissions: ['read:messages', 'write:messages'], actions: ['auto_reply', 'sentiment_analysis', 'lead_capture', 'escalation'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'cm-whatsapp', slug: 'whatsapp-assistant', name: 'WhatsApp Assistant', description: 'Automated WhatsApp Business responses, catalog sync, and broadcast management', category: 'Customer Communication', subcategory: 'Messaging', provider: 'BGOS Intelligence', version: '3.1.0', icon: Phone, color: '#25d366', price: 0, isFree: true, rating: 4.9, reviewCount: 567, installCount: 18900, permissions: ['read:messages', 'write:messages', 'manage:catalog'], actions: ['auto_reply', 'broadcast', 'catalog_sync', 'order_notifications'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'cm-email', slug: 'email-assistant', name: 'Email Assistant', description: 'AI-powered email drafting, scheduling, and response tracking', category: 'Customer Communication', subcategory: 'Email', provider: 'BGOS Intelligence', version: '1.8.2', icon: Mail, color: '#dc2626', price: 0, isFree: true, rating: 4.5, reviewCount: 189, installCount: 7800, permissions: ['read:email', 'write:email'], actions: ['draft_email', 'schedule_send', 'track_opens', 'follow_up'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'cm-voice', slug: 'voice-assistant', name: 'Voice Assistant', description: 'Voice-based customer interaction with call routing and transcription', category: 'Customer Communication', subcategory: 'Voice', provider: 'BGOS Intelligence', version: '1.2.0', icon: Phone, color: '#7c3aed', price: 49, isFree: false, rating: 4.3, reviewCount: 98, installCount: 3200, permissions: ['read:calls', 'write:calls', 'record:audio'], actions: ['voice接听', 'transcribe', 'route_call', 'voicemail_summary'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Marketing ──
  { id: 'mk-content', slug: 'content-generation', name: 'Content Generation', description: 'AI-generated social media posts, blog articles, and marketing copy', category: 'Marketing', subcategory: 'Content', provider: 'BGOS Intelligence', version: '4.0.1', icon: Sparkles, color: '#d4a843', price: 0, isFree: true, rating: 4.7, reviewCount: 456, installCount: 15600, permissions: ['read:content', 'write:content'], actions: ['generate_post', 'generate_blog', 'generate_ad', 'seo_optimize'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'mk-social', slug: 'social-media-scheduler', name: 'Social Media Scheduler', description: 'Schedule and publish posts across Facebook, Instagram, TikTok, LinkedIn', category: 'Marketing', subcategory: 'Social', provider: 'BGOS Intelligence', version: '2.3.0', icon: Calendar, color: '#059669', price: 0, isFree: true, rating: 4.6, reviewCount: 389, installCount: 11200, permissions: ['read:social', 'write:social', 'manage:schedule'], actions: ['schedule_post', 'cross_post', 'analytics', 'optimal_time'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'mk-campaign', slug: 'campaign-optimization', name: 'Campaign Optimization', description: 'AI-driven ad campaign management with budget optimization and A/B testing', category: 'Marketing', subcategory: 'Advertising', provider: 'BGOS Intelligence', version: '1.5.0', icon: Target, color: '#dc2626', price: 29, isFree: false, rating: 4.4, reviewCount: 167, installCount: 5400, permissions: ['read:ads', 'write:ads', 'manage:budget'], actions: ['create_campaign', 'ab_test', 'optimize_budget', 'report'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'mk-seo', slug: 'seo-analysis', name: 'SEO Analysis', description: 'Website SEO auditing, keyword tracking, and optimization recommendations', category: 'Marketing', subcategory: 'SEO', provider: 'BGOS Intelligence', version: '3.2.0', icon: TrendingUp, color: '#2563eb', price: 0, isFree: true, rating: 4.5, reviewCount: 278, installCount: 9800, permissions: ['read:seo', 'write:seo'], actions: ['audit_site', 'track_keywords', 'competitor_analysis', 'optimize'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'mk-keywords', slug: 'keyword-research', name: 'Keyword Research', description: 'Deep keyword research with search volume, difficulty, and opportunity scoring', category: 'Marketing', subcategory: 'SEO', provider: 'BGOS Intelligence', version: '2.1.0', icon: Search, color: '#d97706', price: 0, isFree: true, rating: 4.3, reviewCount: 198, installCount: 7200, permissions: ['read:keywords'], actions: ['research', 'difficulty_score', 'long_tail', 'gap_analysis'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Sales ──
  { id: 'sl-lead-score', slug: 'lead-scoring', name: 'Lead Scoring', description: 'AI-powered lead scoring with behavioral analysis and conversion prediction', category: 'Sales', subcategory: 'Scoring', provider: 'BGOS Intelligence', version: '2.0.0', icon: BarChart3, color: '#d4a843', price: 0, isFree: true, rating: 4.7, reviewCount: 312, installCount: 10200, permissions: ['read:leads', 'write:leads'], actions: ['score_lead', 'predict_conversion', 'segment', 'prioritize'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'sl-crm', slug: 'crm-integration', name: 'CRM Integration', description: 'Connect with HubSpot, Salesforce, or Pipedrive for unified customer management', category: 'Sales', subcategory: 'CRM', provider: 'BGOS Intelligence', version: '1.8.0', icon: Users, color: '#2563eb', price: 0, isFree: true, rating: 4.4, reviewCount: 234, installCount: 8700, permissions: ['read:contacts', 'write:contacts', 'sync:deals'], actions: ['sync_contacts', 'create_deal', 'update_pipeline', 'report'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'sl-quote', slug: 'quote-generation', name: 'Quote Generation', description: 'AI-generated professional quotes with pricing, terms, and digital signatures', category: 'Sales', subcategory: 'Documents', provider: 'BGOS Intelligence', version: '3.0.2', icon: FileText, color: '#059669', price: 0, isFree: true, rating: 4.8, reviewCount: 445, installCount: 14300, permissions: ['read:quotes', 'write:quotes', 'send:quotes'], actions: ['generate_quote', 'send_email', 'track_view', 'convert_to_invoice'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'sl-proposal', slug: 'proposal-generation', name: 'Proposal Generation', description: 'Professional proposal builder with templates, pricing tables, and terms', category: 'Sales', subcategory: 'Documents', provider: 'BGOS Intelligence', version: '1.4.0', icon: BookOpen, color: '#7c3aed', price: 19, isFree: false, rating: 4.3, reviewCount: 134, installCount: 4500, permissions: ['read:proposals', 'write:proposals'], actions: ['create_proposal', 'add_pricing', 'send_for_sign', 'track_status'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'sl-followup', slug: 'follow-up-automation', name: 'Follow-up Automation', description: 'Automated follow-up sequences via email, WhatsApp, and SMS', category: 'Sales', subcategory: 'Automation', provider: 'BGOS Intelligence', version: '2.2.0', icon: Bell, color: '#d97706', price: 0, isFree: true, rating: 4.6, reviewCount: 367, installCount: 12100, permissions: ['read:leads', 'write:messages', 'manage:sequences'], actions: ['create_sequence', 'send_follow_up', 'track_response', 'escalate'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Construction ──
  { id: 'cs-cost', slug: 'cost-estimation', name: 'Cost Estimation', description: 'AI construction cost estimator with South African material pricing data', category: 'Construction', subcategory: 'Estimation', provider: 'BGOS Construction', version: '3.1.0', icon: Calculator, color: '#059669', price: 0, isFree: true, rating: 4.9, reviewCount: 567, installCount: 16800, permissions: ['read:projects', 'write:estimates'], actions: ['estimate_cost', 'compare_materials', 'labor_calc', 'export_boq'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'cs-material', slug: 'material-estimation', name: 'Material Estimation', description: 'Automatic material quantity calculation from plans and dimensions', category: 'Construction', subcategory: 'Estimation', provider: 'BGOS Construction', version: '2.4.0', icon: Package, color: '#d97706', price: 0, isFree: true, rating: 4.7, reviewCount: 389, installCount: 11400, permissions: ['read:projects', 'write:materials'], actions: ['calculate_materials', 'supplier_compare', 'order_list', 'waste_factor'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'cs-schedule', slug: 'project-scheduling', name: 'Project Scheduling', description: 'Gantt chart scheduling with critical path analysis and resource allocation', category: 'Construction', subcategory: 'Planning', provider: 'BGOS Construction', version: '2.0.0', icon: Calendar, color: '#2563eb', price: 0, isFree: true, rating: 4.5, reviewCount: 234, installCount: 8900, permissions: ['read:projects', 'write:schedule'], actions: ['create_gantt', 'critical_path', 'resource_alloc', 'track_progress'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'cs-inspection', slug: 'site-inspection', name: 'Site Inspection Support', description: 'Digital inspection checklists, photo documentation, and compliance tracking', category: 'Construction', subcategory: 'Inspection', provider: 'BGOS Construction', version: '1.6.0', icon: Eye, color: '#7c3aed', price: 0, isFree: true, rating: 4.6, reviewCount: 178, installCount: 6200, permissions: ['read:inspections', 'write:inspections', 'upload:photos'], actions: ['create_checklist', 'take_photos', 'log_issues', 'generate_report'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'cs-reporting', slug: 'progress-reporting', name: 'Progress Reporting', description: 'Automated daily/weekly progress reports with photos and metrics', category: 'Construction', subcategory: 'Reporting', provider: 'BGOS Construction', version: '1.8.0', icon: BarChart, color: '#d4a843', price: 0, isFree: true, rating: 4.4, reviewCount: 156, installCount: 5800, permissions: ['read:projects', 'write:reports'], actions: ['daily_report', 'weekly_summary', 'photo_progress', 'client_update'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Document Intelligence ──
  { id: 'di-ocr', slug: 'ocr-processing', name: 'OCR Processing', description: 'Extract text from scanned documents, receipts, and handwritten notes', category: 'Document Intelligence', subcategory: 'OCR', provider: 'BGOS Intelligence', version: '2.5.0', icon: FileText, color: '#2563eb', price: 0, isFree: true, rating: 4.6, reviewCount: 289, installCount: 9400, permissions: ['read:documents', 'process:images'], actions: ['extract_text', 'recognize_handwriting', 'parse_receipt', 'export_data'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'di-pdf', slug: 'pdf-extraction', name: 'PDF Extraction', description: 'Intelligent PDF parsing for invoices, contracts, and building plans', category: 'Document Intelligence', subcategory: 'Parsing', provider: 'BGOS Intelligence', version: '1.9.0', icon: FileText, color: '#dc2626', price: 0, isFree: true, rating: 4.5, reviewCount: 201, installCount: 7600, permissions: ['read:pdf', 'write:extracted'], actions: ['parse_invoice', 'extract_tables', 'parse_contract', 'summarize'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'di-contract', slug: 'contract-analysis', name: 'Contract Analysis', description: 'AI contract review with risk flagging, term extraction, and compliance checks', category: 'Document Intelligence', subcategory: 'Legal', provider: 'BGOS Intelligence', version: '1.3.0', icon: Shield, color: '#d97706', price: 29, isFree: false, rating: 4.4, reviewCount: 123, installCount: 3800, permissions: ['read:contracts', 'analyze:contracts'], actions: ['review_contract', 'flag_risks', 'extract_terms', 'compare_versions'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'di-invoice', slug: 'invoice-processing', name: 'Invoice Processing', description: 'Automated invoice data extraction, validation, and bookkeeping entry', category: 'Document Intelligence', subcategory: 'Finance', provider: 'BGOS Intelligence', version: '2.1.0', icon: CreditCard, color: '#059669', price: 0, isFree: true, rating: 4.7, reviewCount: 334, installCount: 10800, permissions: ['read:invoices', 'write:accounting'], actions: ['extract_data', 'validate_amounts', 'match_orders', 'bookkeep_entry'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Vision AI ──
  { id: 'vi-progress', slug: 'progress-photos', name: 'Progress Photo Analysis', description: 'AI comparison of construction progress across time-lapse photo sequences', category: 'Vision AI', subcategory: 'Analysis', provider: 'BGOS Intelligence', version: '1.5.0', icon: Image, color: '#7c3aed', price: 0, isFree: true, rating: 4.5, reviewCount: 167, installCount: 5400, permissions: ['read:photos', 'analyze:images'], actions: ['compare_progress', 'measure_area', 'detect_changes', 'timeline'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'vi-damage', slug: 'damage-detection', name: 'Damage Detection', description: 'AI-powered damage identification from site photos with severity scoring', category: 'Vision AI', subcategory: 'Inspection', provider: 'BGOS Intelligence', version: '1.2.0', icon: AlertTriangle, color: '#dc2626', price: 19, isFree: false, rating: 4.3, reviewCount: 89, installCount: 2800, permissions: ['read:photos', 'analyze:damage'], actions: ['detect_damage', 'severity_score', 'recommend_repair', 'track_fixes'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'vi-beforeafter', slug: 'before-after-comparison', name: 'Before/After Comparison', description: 'Side-by-side project transformation visualization for marketing content', category: 'Vision AI', subcategory: 'Visualization', provider: 'BGOS Intelligence', version: '1.0.0', icon: Image, color: '#d4a843', price: 0, isFree: true, rating: 4.8, reviewCount: 234, installCount: 8100, permissions: ['read:photos', 'process:images'], actions: ['align_photos', 'generate_comparison', 'export_marketing', 'share'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'vi-safety', slug: 'safety-observations', name: 'Safety Observations', description: 'AI safety compliance monitoring with PPE detection and hazard flagging', category: 'Vision AI', subcategory: 'Safety', provider: 'BGOS Intelligence', version: '1.1.0', icon: Shield, color: '#059669', price: 0, isFree: true, rating: 4.4, reviewCount: 112, installCount: 3600, permissions: ['read:photos', 'analyze:safety'], actions: ['check_ppe', 'flag_hazards', 'compliance_report', 'alert_team'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Business Intelligence ──
  { id: 'bi-dashboards', slug: 'smart-dashboards', name: 'Smart Dashboards', description: 'Real-time business dashboards with customizable KPIs and widgets', category: 'Business Intelligence', subcategory: 'Visualization', provider: 'BGOS Intelligence', version: '3.0.0', icon: BarChart3, color: '#2563eb', price: 0, isFree: true, rating: 4.8, reviewCount: 456, installCount: 14200, permissions: ['read:all', 'write:dashboard'], actions: ['create_dashboard', 'add_widget', 'export_pdf', 'share_link'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'bi-forecast', slug: 'forecasting', name: 'Forecasting', description: 'Revenue and demand forecasting with AI models trained on your business data', category: 'Business Intelligence', subcategory: 'Analytics', provider: 'BGOS Intelligence', version: '2.1.0', icon: TrendingUp, color: '#059669', price: 0, isFree: true, rating: 4.5, reviewCount: 198, installCount: 6800, permissions: ['read:financials', 'analyze:patterns'], actions: ['forecast_revenue', 'demand_prediction', 'seasonal_analysis', 'export_report'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'bi-competitor', slug: 'competitor-analysis', name: 'Competitor Analysis', description: 'Track competitor pricing, reviews, and market positioning automatically', category: 'Business Intelligence', subcategory: 'Research', provider: 'BGOS Intelligence', version: '1.4.0', icon: Target, color: '#d97706', price: 0, isFree: true, rating: 4.3, reviewCount: 134, installCount: 4500, permissions: ['read:market', 'analyze:competitors'], actions: ['track_competitors', 'price_compare', 'review_monitor', 'market_share'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'bi-trend', slug: 'trend-analysis', name: 'Trend Analysis', description: 'Industry trend detection and market opportunity identification', category: 'Business Intelligence', subcategory: 'Analytics', provider: 'BGOS Intelligence', version: '1.6.0', icon: Activity, color: '#7c3aed', price: 0, isFree: true, rating: 4.4, reviewCount: 167, installCount: 5600, permissions: ['read:market', 'analyze:trends'], actions: ['detect_trends', 'opportunity_scan', 'market_shift', 'recommend'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Automation ──
  { id: 'au-workflow', slug: 'workflow-automation', name: 'Workflow Automation', description: 'Visual workflow builder with triggers, conditions, and multi-step actions', category: 'Automation', subcategory: 'Workflows', provider: 'BGOS Intelligence', version: '4.0.0', icon: Zap, color: '#d4a843', price: 0, isFree: true, rating: 4.7, reviewCount: 389, installCount: 12800, permissions: ['read:all', 'write:all', 'execute:actions'], actions: ['create_flow', 'add_trigger', 'set_conditions', 'run_automation'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'au-calendar', slug: 'calendar-integration', name: 'Calendar Integration', description: 'Sync with Google Calendar for site visits, deadlines, and team scheduling', category: 'Automation', subcategory: 'Scheduling', provider: 'BGOS Intelligence', version: '2.0.0', icon: Calendar, color: '#2563eb', price: 0, isFree: true, rating: 4.6, reviewCount: 234, installCount: 8900, permissions: ['read:calendar', 'write:calendar'], actions: ['sync_events', 'create_meeting', 'reminders', 'team_schedule'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'au-email-auto', slug: 'email-automation', name: 'Email Automation', description: 'Automated email sequences for lead nurture, onboarding, and re-engagement', category: 'Automation', subcategory: 'Email', provider: 'BGOS Intelligence', version: '2.3.0', icon: Mail, color: '#dc2626', price: 0, isFree: true, rating: 4.5, reviewCount: 267, installCount: 9400, permissions: ['read:email', 'write:email', 'manage:sequences'], actions: ['create_sequence', 'trigger_on_event', 'personalize', 'track_metrics'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'au-notifications', slug: 'notification-engine', name: 'Notification Engine', description: 'Multi-channel notifications via push, email, SMS, and WhatsApp', category: 'Automation', subcategory: 'Alerts', provider: 'BGOS Intelligence', version: '1.8.0', icon: Bell, color: '#d97706', price: 0, isFree: true, rating: 4.4, reviewCount: 189, installCount: 6700, permissions: ['send:notifications', 'manage:channels'], actions: ['push_notify', 'sms_notify', 'whatsapp_notify', 'batch_send'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Developer ──
  { id: 'dv-github', slug: 'github-integration', name: 'GitHub Integration', description: 'Connect repositories for code deployment, issue tracking, and CI/CD', category: 'Developer', subcategory: 'DevOps', provider: 'BGOS Intelligence', version: '1.5.0', icon: GitBranch, color: '#1f2937', price: 0, isFree: true, rating: 4.6, reviewCount: 156, installCount: 5200, permissions: ['read:repos', 'write:issues', 'manage:deploy'], actions: ['sync_repos', 'track_issues', 'deploy', 'rollback'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'dv-api', slug: 'api-testing', name: 'API Testing', description: 'Test and monitor API endpoints with automated health checks', category: 'Developer', subcategory: 'Testing', provider: 'BGOS Intelligence', version: '1.2.0', icon: Terminal, color: '#059669', price: 0, isFree: true, rating: 4.3, reviewCount: 98, installCount: 3400, permissions: ['read:api', 'execute:tests'], actions: ['test_endpoint', 'check_health', 'load_test', 'monitor_uptime'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'dv-docs', slug: 'documentation', name: 'Documentation Generator', description: 'Auto-generate API docs, user guides, and technical documentation', category: 'Developer', subcategory: 'Docs', provider: 'BGOS Intelligence', version: '1.0.0', icon: BookOpen, color: '#2563eb', price: 0, isFree: true, rating: 4.2, reviewCount: 78, installCount: 2800, permissions: ['read:code', 'write:docs'], actions: ['generate_api_docs', 'user_guide', 'changelog', 'deploy_docs'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'dv-codegen', slug: 'code-generation', name: 'Code Generation', description: 'AI-assisted code generation for custom features, integrations, and scripts', category: 'Developer', subcategory: 'AI', provider: 'BGOS Intelligence', version: '1.3.0', icon: Code2, color: '#7c3aed', price: 0, isFree: true, rating: 4.5, reviewCount: 189, installCount: 6400, permissions: ['read:code', 'write:code'], actions: ['generate_component', 'create_api', 'write_script', 'refactor'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },

  // ── Finance ──
  { id: 'fn-accounting', slug: 'accounting-integration', name: 'Accounting Integration', description: 'Connect with Xero, QuickBooks, or Sage for automated bookkeeping', category: 'Finance', subcategory: 'Accounting', provider: 'BGOS Intelligence', version: '2.2.0', icon: DollarSign, color: '#059669', price: 0, isFree: true, rating: 4.6, reviewCount: 267, installCount: 9200, permissions: ['read:financials', 'write:transactions'], actions: ['sync_invoices', 'reconcile', 'categorize', 'generate_reports'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true, isFeatured: true },
  { id: 'fn-reconcile', slug: 'payment-reconciliation', name: 'Payment Reconciliation', description: 'Automatic payment matching against invoices with gap detection', category: 'Finance', subcategory: 'Payments', provider: 'BGOS Intelligence', version: '1.7.0', icon: CreditCard, color: '#2563eb', price: 0, isFree: true, rating: 4.5, reviewCount: 198, installCount: 6800, permissions: ['read:payments', 'write:reconciliation'], actions: ['match_payments', 'detect_gaps', 'flag_discrepancies', 'export'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
  { id: 'fn-cashflow', slug: 'cash-flow-analysis', name: 'Cash Flow Analysis', description: 'Real-time cash flow tracking with projections and alerts', category: 'Finance', subcategory: 'Analytics', provider: 'BGOS Intelligence', version: '2.0.0', icon: TrendingUp, color: '#d4a843', price: 0, isFree: true, rating: 4.7, reviewCount: 312, installCount: 10400, permissions: ['read:financials', 'analyze:cashflow'], actions: ['track_flow', 'project_30_days', 'alert_shortage', 'optimize_timing'], status: 'available', healthScore: 100, lastSynced: null, isCompatible: true },
]

// ══════════════════════════════════════════════════════════════
// CONSTRUCTION SERVICES — per-m² pricing for all 22 services
// ══════════════════════════════════════════════════════════════

interface ConstructionService {
  id: string
  name: string
  icon: any
  category: string
  pricePerSqm: number
  minPrice: number
  unit: string
  description: string
  includes: string[]
  region: string
}

const CONSTRUCTION_SERVICES: ConstructionService[] = [
  { id: 'new-house', name: 'New House Construction', icon: Home, category: 'Building', pricePerSqm: 6500, minPrice: 350000, unit: 'm²', description: 'Complete new home builds from foundation to finish', includes: ['Foundation', 'Brickwork', 'Roofing', 'Plumbing', 'Electrical', 'Flooring', 'Painting', 'Finishes'], region: 'KwaZulu-Natal' },
  { id: 'foundations', name: 'Foundations', icon: Layers, category: 'Structural', pricePerSqm: 850, minPrice: 25000, unit: 'm²', description: 'Professional foundation work for new builds and extensions', includes: ['Strip foundations', 'Raft slabs', 'Piling', 'Soil testing', 'Waterproofing'], region: 'KwaZulu-Natal' },
  { id: 'brickwork', name: 'Brickwork', icon: Building, category: 'Structural', pricePerSqm: 420, minPrice: 15000, unit: 'm²', description: 'Expert bricklaying for walls, structures, and decorative features', includes: ['Face brick', 'Plaster bricks', 'Concrete blocks', 'Pointing', 'Cavity walls'], region: 'KwaZulu-Natal' },
  { id: 'roofing', name: 'Roofing', icon: Home, category: 'Structural', pricePerSqm: 580, minPrice: 20000, unit: 'm²', description: 'New roof installation, repairs, and waterproofing', includes: ['Tiled roofing', 'Corrugated iron', 'Flat roof systems', 'Gutters', 'Waterproofing'], region: 'KwaZulu-Natal' },
  { id: 'concrete-slabs', name: 'Concrete Slabs', icon: Layers, category: 'Structural', pricePerSqm: 450, minPrice: 18000, unit: 'm²', description: 'Professional concrete slab pouring for floors, driveways, and foundations', includes: ['Reinforcement', 'Pouring', 'Smoothing', 'Curing', 'Sealing'], region: 'KwaZulu-Natal' },
  { id: 'boundary-walls', name: 'Boundary Walls', icon: Shield, category: 'Security', pricePerSqm: 650, minPrice: 30000, unit: 'm²', description: 'Security boundary walls and fencing', includes: ['Pre-cast walls', 'Brick walls', 'Palisade fencing', 'Electric fencing options', 'Gates'], region: 'KwaZulu-Natal' },
  { id: 'garages', name: 'Garages', icon: CarIcon, category: 'Building', pricePerSqm: 4800, minPrice: 120000, unit: 'm²', description: 'Single and double garage construction', includes: ['Attached/standalone designs', 'Automated doors', 'Roofing', 'Flooring', 'Electrical'], region: 'KwaZulu-Natal' },
  { id: 'carports', name: 'Carports', icon: Truck, category: 'Covering', pricePerSqm: 850, minPrice: 15000, unit: 'm²', description: 'Covered parking structures', includes: ['Steel frames', 'Timber frames', 'Shade net', 'Concrete base', 'Gutters'], region: 'KwaZulu-Natal' },
  { id: 'extensions', name: 'House Extensions', icon: Plus, category: 'Building', pricePerSqm: 5800, minPrice: 150000, unit: 'm²', description: 'Add rooms, extend living space, or add a second storey', includes: ['Room additions', 'Second storey', 'Seamless integration', 'Structural assessment', 'Finishes'], region: 'KwaZulu-Natal' },
  { id: 'kitchen-renos', name: 'Kitchen Renovations', icon: Wrench, category: 'Renovation', pricePerSqm: 3500, minPrice: 45000, unit: 'm²', description: 'Modern kitchen makeovers', includes: ['New cupboards', 'Countertops', 'Plumbing', 'Tiling', 'Electrical', 'Appliance fitting'], region: 'KwaZulu-Natal' },
  { id: 'bathroom-renos', name: 'Bathroom Renovations', icon: DropletsIcon, category: 'Renovation', pricePerSqm: 3200, minPrice: 40000, unit: 'm²', description: 'Complete bathroom upgrades', includes: ['Waterproofing', 'Tiling', 'Fixtures', 'Vanities', 'Plumbing', 'Electrical'], region: 'KwaZulu-Natal' },
  { id: 'ceilings', name: 'Ceiling Installation', icon: Layers, category: 'Interior', pricePerSqm: 380, minPrice: 12000, unit: 'm²', description: 'Plaster, PVC, gypsum, and suspended ceiling installation', includes: ['Plaster ceilings', 'PVC ceilings', 'Gypsum ceilings', 'Suspended ceilings', 'Insulation'], region: 'KwaZulu-Natal' },
  { id: 'drywall', name: 'Drywall Partitioning', icon: RectangleHorizontalIcon, category: 'Interior', pricePerSqm: 320, minPrice: 10000, unit: 'm²', description: 'Interior wall partitioning for offices and homes', includes: ['Plasterboard', 'Stud wall systems', 'Insulation', 'Fire rating', 'Finishing'], region: 'KwaZulu-Natal' },
  { id: 'flooring', name: 'Flooring and Tiling', icon: Grid3x3Icon, category: 'Interior', pricePerSqm: 450, minPrice: 15000, unit: 'm²', description: 'Floor and wall tiling, laminate, vinyl, and ceramic installations', includes: ['Ceramic tiles', 'Porcelain tiles', 'Laminate', 'Vinyl', 'Grouting', 'Underfloor prep'], region: 'KwaZulu-Natal' },
  { id: 'painting', name: 'Painting', icon: Palette, category: 'Finishing', pricePerSqm: 120, minPrice: 8000, unit: 'm²', description: 'Interior and exterior painting', includes: ['Surface prep', 'Priming', 'Two-coat paint', 'Colour consultation', 'Clean-up'], region: 'KwaZulu-Natal' },
  { id: 'plastering', name: 'Plastering', icon: SquareIcon, category: 'Finishing', pricePerSqm: 180, minPrice: 10000, unit: 'm²', description: 'Internal and external plastering', includes: ['Smooth finish', 'Textured finish', 'Decorative finishes', 'Damp proofing', 'Screeding'], region: 'KwaZulu-Natal' },
  { id: 'paving', name: 'Paving', icon: Grid3x3Icon, category: 'Exterior', pricePerSqm: 350, minPrice: 15000, unit: 'm²', description: 'Driveways, walkways, patios, and outdoor areas', includes: ['Brick paving', 'Concrete paving', 'Natural stone', 'Edging', 'Sub-base', 'Compaction'], region: 'KwaZulu-Natal' },
  { id: 'retaining-walls', name: 'Retaining Walls', icon: Shield, category: 'Structural', pricePerSqm: 780, minPrice: 35000, unit: 'm²', description: 'Structural retaining walls for sloped properties', includes: ['Concrete walls', 'Stone walls', 'Gabion systems', 'Drainage', 'Engineering'], region: 'KwaZulu-Natal' },
  { id: 'driveways', name: 'Driveways', icon: Truck, category: 'Exterior', pricePerSqm: 380, minPrice: 20000, unit: 'm²', description: 'New driveway construction and resurfacing', includes: ['Gravel', 'Tar sealing', 'Paving', 'Concrete', 'Edging', 'Drainage'], region: 'KwaZulu-Natal' },
  { id: 'fencing', name: 'Boundary Fencing', icon: FenceIcon, category: 'Security', pricePerSqm: 280, minPrice: 12000, unit: 'm', description: 'Timber, steel, PVC, and wire fencing', includes: ['Timber fencing', 'Steel fencing', 'PVC fencing', 'Wire fencing', 'Palisade', 'Repairs'], region: 'KwaZulu-Natal' },
  { id: 'commercial', name: 'Commercial Projects', icon: Building, category: 'Commercial', pricePerSqm: 5200, minPrice: 200000, unit: 'm²', description: 'Small commercial building projects', includes: ['Office fit-outs', 'Shop renovations', 'Retail spaces', 'Compliance', 'Signage'], region: 'KwaZulu-Natal' },
  { id: 'maintenance', name: 'Property Maintenance', icon: Wrench, category: 'Maintenance', pricePerSqm: 180, minPrice: 5000, unit: 'visit', description: 'Regular property upkeep, repairs, and small fixes', includes: ['Gutter cleaning', 'Paint touch-ups', 'Minor repairs', 'Leak fixes', 'General upkeep'], region: 'KwaZulu-Natal' },
]

// ══════════════════════════════════════════════════════════════
// INTEGRATION WIZARD — Platinum Identity™ platform links
// ══════════════════════════════════════════════════════════════

interface WizardPlatform {
  id: string
  name: string
  category: string
  description: string
  url: string
  color: string
  icon: any
  tier: 'core' | 'enhanced' | 'optional'
  purpose: string
}

const PLATINUM_PLATFORMS: WizardPlatform[] = [
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', description: 'Customer platform, owner dashboard, Platinum Registry UI', url: 'https://nextjs.org/docs', color: '#000000', icon: Code2, tier: 'core', purpose: 'React framework for server-rendered pages and API routes' },
  { id: 'supabase', name: 'Supabase', category: 'Backend', description: 'Database, authentication, storage, real-time updates', url: 'https://supabase.com/docs', color: '#3ecf8e', icon: Database, tier: 'core', purpose: 'Open-source Firebase alternative with PostgreSQL' },
  { id: 'vercel', name: 'Vercel', category: 'Hosting', description: 'Hosting, deployment, scalability, edge functions', url: 'https://vercel.com/docs', color: '#000000', icon: Rocket, tier: 'core', purpose: 'Deploy and scale Next.js applications globally' },
  { id: 'openai', name: 'OpenAI API', category: 'Intelligence', description: 'Intelligence engines for AI-powered features', url: 'https://platform.openai.com/docs', color: '#10a37f', icon: Brain, tier: 'core', purpose: 'GPT models for content generation, analysis, and chat' },
  { id: 'opencv', name: 'OpenCV', category: 'Vision', description: 'Platinum Logo recognition and image processing', url: 'https://docs.opencv.org/', color: '#5c3ee8', icon: Eye, tier: 'enhanced', purpose: 'Computer vision for logo detection and image analysis' },
  { id: 'google-ml', name: 'Google ML Kit', category: 'Vision', description: 'Mobile vision AI for on-site logo and damage detection', url: 'https://developers.google.com/ml-kit', color: '#4285f4', icon: Image, tier: 'enhanced', purpose: 'On-device machine learning for mobile apps' },
  { id: 'stripe', name: 'Stripe', category: 'Payments', description: 'Payment processing for subscriptions and invoices', url: 'https://stripe.com/docs', color: '#635bff', icon: CreditCard, tier: 'optional', purpose: 'Secure payment infrastructure for online transactions' },
  { id: 'twilio', name: 'Twilio', category: 'Communication', description: 'SMS and voice communication for notifications', url: 'https://www.twilio.com/docs', color: '#f22f46', icon: Phone, tier: 'optional', purpose: 'Programmable SMS, voice, and messaging APIs' },
  { id: 'google-maps', name: 'Google Maps Platform', category: 'Location', description: 'Maps, geocoding, and distance calculations', url: 'https://developers.google.com/maps', color: '#4285f4', icon: MapPin, tier: 'enhanced', purpose: 'Location services for project site mapping' },
  { id: 'firebase', name: 'Firebase', category: 'Backend', description: 'Real-time database, auth, and cloud messaging', url: 'https://firebase.google.com/docs', color: '#ffca28', icon: Server, tier: 'optional', purpose: 'Google backend services for mobile and web apps' },
  { id: 'cloudinary', name: 'Cloudinary', category: 'Media', description: 'Image and video management, transformation, and delivery', url: 'https://cloudinary.com/documentation', color: '#3448c5', icon: Image, tier: 'optional', purpose: 'Media optimization for construction photos and videos' },
  { id: 'langchain', name: 'LangChain', category: 'AI', description: 'Framework for building LLM-powered applications', url: 'https://python.langchain.com/docs/', color: '#1c3c3c', icon: Sparkles, tier: 'enhanced', purpose: 'Chain AI models for complex reasoning and tool use' },
]

const CATEGORIES = [...new Set(ALL_MODULES.map(m => m.category))]

const CATEGORY_ICONS: Record<string, any> = {
  'Customer Communication': MessageCircle,
  'Marketing': Megaphone,
  'Sales': DollarSign,
  'Construction': Hammer,
  'Document Intelligence': FileText,
  'Vision AI': Eye,
  'Business Intelligence': BarChart3,
  'Automation': Zap,
  'Developer': Code2,
  'Finance': CreditCard,
}

const CATEGORY_COLORS: Record<string, string> = {
  'Customer Communication': '#2563eb',
  'Marketing': '#d97706',
  'Sales': '#059669',
  'Construction': '#7c3aed',
  'Document Intelligence': '#dc2626',
  'Vision AI': '#2563eb',
  'Business Intelligence': '#d4a843',
  'Automation': '#f59e0b',
  'Developer': '#6b7280',
  'Finance': '#059669',
}

// Missing icon fallbacks — some lucide icons don't exist
// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MarketplaceIntelligence() {
  const [tab, setTab] = useState<'marketplace' | 'pricing' | 'wizard'>('marketplace')
  const [modules, setModules] = useState<MarketplaceModule[]>(ALL_MODULES)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedModule, setSelectedModule] = useState<MarketplaceModule | null>(null)
  const [installing, setInstalling] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Pricing state
  const [selectedService, setSelectedService] = useState<ConstructionService | null>(null)
  const [sqm, setSqm] = useState<string>('')
  const [pricingCategory, setPricingCategory] = useState<string>('all')

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Module filtering ──
  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
      }
      return true
    })
  }, [modules, search, categoryFilter])

  // ── Install / Uninstall ──
  const toggleInstall = async (mod: MarketplaceModule) => {
    setInstalling(mod.id)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))

    setModules(prev => prev.map(m => {
      if (m.id !== mod.id) return m
      if (m.status === 'installed' || m.status === 'connected') {
        return { ...m, status: 'available' as ModuleStatus, healthScore: 100, lastSynced: null }
      }
      return { ...m, status: 'installed' as ModuleStatus, healthScore: 100, lastSynced: new Date().toISOString() }
    }))

    const modNow = modules.find(m => m.id === mod.id)
    const willInstall = modNow?.status !== 'installed' && modNow?.status !== 'connected'
    showToast(willInstall ? `${mod.name} installed` : `${mod.name} uninstalled`)
    setInstalling(null)
  }

  const connectModule = async (mod: MarketplaceModule) => {
    setInstalling(mod.id)
    await new Promise(r => setTimeout(r, 800))
    setModules(prev => prev.map(m =>
      m.id === mod.id ? { ...m, status: 'connected' as ModuleStatus, lastSynced: new Date().toISOString() } : m
    ))
    showToast(`${mod.name} connected`)
    setInstalling(null)
  }

  // ── Stats ──
  const installedCount = modules.filter(m => m.status === 'installed' || m.status === 'connected').length
  const totalModules = modules.length
  const featuredModules = modules.filter(m => m.isFeatured)
  const avgHealth = installedCount > 0
    ? Math.round(modules.filter(m => m.status === 'installed' || m.status === 'connected').reduce((s, m) => s + m.healthScore, 0) / installedCount)
    : 0

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-[70] px-5 py-3 rounded-lg shadow-lg text-white text-sm font-semibold ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>{toast.msg}</div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">🧩 Marketplace Intelligence</h1>
        <p className="text-gray-500 text-sm mt-1">Discover, install, and manage AI-powered modules for your business</p>
      </div>

      {/* ── Tab Navigation ── */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="marketplace" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Puzzle className="h-3.5 w-3.5 mr-1.5" /> Plugin Marketplace
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Calculator className="h-3.5 w-3.5 mr-1.5" /> Construction Pricing
          </TabsTrigger>
          <TabsTrigger value="wizard" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            <Rocket className="h-3.5 w-3.5 mr-1.5" /> Platinum Identity™ Wizard
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB 1: PLUGIN MARKETPLACE                  */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="marketplace" className="space-y-6 mt-6">
          {/* ── Overview Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Puzzle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
                    <p className="text-[11px] text-gray-400 font-medium">Available Modules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{installedCount}</p>
                    <p className="text-[11px] text-gray-400 font-medium">Installed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-[#d4a843]/10 flex items-center justify-center">
                    <Gauge className="h-5 w-5 text-[#b8941f]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{avgHealth}%</p>
                    <p className="text-[11px] text-gray-400 font-medium">Avg Health</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{featuredModules.length}</p>
                    <p className="text-[11px] text-gray-400 font-medium">Featured</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Search & Filters ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search modules..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-white border-gray-200"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition border ${
                  categoryFilter === 'all' ? 'bg-[#d4a843] text-white border-[#d4a843]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}>All ({totalModules})</button>
              {CATEGORIES.map(cat => {
                const count = modules.filter(m => m.category === cat).length
                return (
                  <button key={cat} onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition border whitespace-nowrap ${
                      categoryFilter === cat ? 'bg-[#d4a843] text-white border-[#d4a843]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}>{cat} ({count})</button>
                )
              })}
            </div>
          </div>

          {/* ── Category Grid ── */}
          {categoryFilter === 'all' && !search && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map(cat => {
                const CatIcon = CATEGORY_ICONS[cat] || Puzzle
                const color = CATEGORY_COLORS[cat] || '#6b7280'
                const count = modules.filter(m => m.category === cat).length
                return (
                  <button key={cat} onClick={() => setCategoryFilter(cat)}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#d4a843]/40 hover:shadow-md transition text-left group shadow-sm">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${color}12` }}>
                      <CatIcon className="h-5 w-5" style={{ color }} />
                    </div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#b8941f] transition">{cat}</p>
                    <p className="text-[10px] text-gray-400">{count} modules</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Module Cards ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map(mod => {
              const ModIcon = mod.icon || Puzzle
              const isInstalled = mod.status === 'installed' || mod.status === 'connected'
              return (
                <Card key={mod.id}
                  className={`bg-white border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer ${
                    isInstalled ? 'border-emerald-200' : ''
                  }`}
                  onClick={() => setSelectedModule(mod)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${mod.color}12` }}>
                          <ModIcon className="h-5 w-5" style={{ color: mod.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{mod.name}</p>
                          <p className="text-[10px] text-gray-400">{mod.provider} • v{mod.version}</p>
                        </div>
                      </div>
                      {mod.isFeatured && <Badge className="bg-[#d4a843]/10 text-[#b8941f] border-0 text-[9px]">Featured</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{mod.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#d4a843] text-[#d4a843]" />
                          <span className="text-[10px] text-gray-500 font-medium">{mod.rating}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{mod.installCount.toLocaleString()} installs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-700">
                          {mod.isFree ? 'Free' : `R${mod.price}/mo`}
                        </span>
                        {isInstalled && (
                          <div className={`h-2 w-2 rounded-full ${mod.status === 'connected' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredModules.length === 0 && (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No modules match your search.</p>
              </CardContent>
            </Card>
          )}

          {/* ── Module Detail Dialog ── */}
          <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
              {selectedModule && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selectedModule.color}12` }}>
                        {(() => { const I = selectedModule.icon || Puzzle; return <I className="h-4 w-4" style={{ color: selectedModule.color }} /> })()}
                      </div>
                      {selectedModule.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <p className="text-sm text-gray-600">{selectedModule.description}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400">Category</p>
                        <p className="text-xs font-bold text-gray-700">{selectedModule.category}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400">Version</p>
                        <p className="text-xs font-bold text-gray-700">v{selectedModule.version}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400">Price</p>
                        <p className="text-xs font-bold text-gray-700">{selectedModule.isFree ? 'Free' : `R${selectedModule.price}/mo`}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400">Status</p>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${
                            selectedModule.status === 'connected' ? 'bg-emerald-500' :
                            selectedModule.status === 'installed' ? 'bg-blue-500' :
                            selectedModule.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                          }`} />
                          <p className="text-xs font-bold text-gray-700 capitalize">{selectedModule.status}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">Available Actions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedModule.actions.map(a => (
                          <Badge key={a} variant="outline" className="text-[9px] border-gray-200 text-gray-500">{a.replace(/_/g, ' ')}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">Required Permissions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedModule.permissions.map(p => (
                          <Badge key={p} variant="outline" className="text-[9px] border-amber-200 text-amber-600">
                            <Lock className="h-2.5 w-2.5 mr-0.5" /> {p}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedModule.status === 'installed' && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-2">Health Score</p>
                        <div className="flex items-center gap-3">
                          <Progress value={selectedModule.healthScore} className="h-2 flex-1" />
                          <span className="text-xs font-bold text-gray-700">{selectedModule.healthScore}%</span>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-2">
                      {(selectedModule.status === 'available') && (
                        <Button onClick={() => { toggleInstall(selectedModule); setSelectedModule(null) }}
                          className="flex-1 bg-[#d4a843] text-white hover:bg-[#c9a433]"
                          disabled={installing === selectedModule.id}>
                          {installing === selectedModule.id ? (
                            <><RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> Installing...</>
                          ) : (
                            <><Download className="h-3.5 w-3.5 mr-1" /> Install Module</>
                          )}
                        </Button>
                      )}
                      {selectedModule.status === 'installed' && (
                        <>
                          <Button onClick={() => { connectModule(selectedModule); setSelectedModule(null) }}
                            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                            disabled={installing === selectedModule.id}>
                            <Wifi className="h-3.5 w-3.5 mr-1" /> Connect
                          </Button>
                          <Button variant="outline" onClick={() => { toggleInstall(selectedModule); setSelectedModule(null) }}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            disabled={installing === selectedModule.id}>
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Uninstall
                          </Button>
                        </>
                      )}
                      {selectedModule.status === 'connected' && (
                        <Button variant="outline" onClick={() => { toggleInstall(selectedModule); setSelectedModule(null) }}
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                          <WifiOff className="h-3.5 w-3.5 mr-1" /> Disconnect
                        </Button>
                      )}
                      {selectedModule.website && (
                        <a href={selectedModule.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="border-gray-200">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB 2: CONSTRUCTION SERVICES PRICING       */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="pricing" className="space-y-6 mt-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">🏗️ Construction Services Pricing</h2>
            <p className="text-gray-500 text-sm mt-1">Per-square-meter pricing for all services — KwaZulu-Natal rates</p>
          </div>

          {/* ── Pricing Overview ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-gray-400">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{CONSTRUCTION_SERVICES.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-gray-400">Lowest per m²</p>
                <p className="text-2xl font-bold text-emerald-600">R{Math.min(...CONSTRUCTION_SERVICES.map(s => s.pricePerSqm)).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-gray-400">Highest per m²</p>
                <p className="text-2xl font-bold text-amber-600">R{Math.max(...CONSTRUCTION_SERVICES.map(s => s.pricePerSqm)).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-gray-400">Average per m²</p>
                <p className="text-2xl font-bold text-blue-600">R{Math.round(CONSTRUCTION_SERVICES.reduce((s, sv) => s + sv.pricePerSqm, 0) / CONSTRUCTION_SERVICES.length).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* ── Service Categories ── */}
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setPricingCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition border ${
                pricingCategory === 'all' ? 'bg-[#d4a843] text-white border-[#d4a843]' : 'bg-white text-gray-500 border-gray-200'
              }`}>All Services</button>
            {[...new Set(CONSTRUCTION_SERVICES.map(s => s.category))].map(cat => (
              <button key={cat} onClick={() => setPricingCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition border ${
                  pricingCategory === cat ? 'bg-[#d4a843] text-white border-[#d4a843]' : 'bg-white text-gray-500 border-gray-200'
                }`}>{cat}</button>
            ))}
          </div>

          {/* ── Service Grid ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONSTRUCTION_SERVICES
              .filter(s => pricingCategory === 'all' || s.category === pricingCategory)
              .map(service => {
                const SvcIcon = service.icon || Wrench
                const estimatedCost = sqm ? Math.max(service.pricePerSqm * parseFloat(sqm || '0'), service.minPrice) : null
                return (
                  <Card key={service.id}
                    className="bg-white border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedService(service)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-[#d4a843]/10 flex items-center justify-center">
                            <SvcIcon className="h-4 w-4 text-[#b8941f]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{service.name}</p>
                            <Badge variant="outline" className="text-[9px] border-gray-200 text-gray-500 mt-0.5">{service.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{service.description}</p>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#d4a843]/5 border border-[#d4a843]/10">
                        <div>
                          <p className="text-[10px] text-gray-400">Price per {service.unit}</p>
                          <p className="text-lg font-extrabold text-[#b8941f]">R{service.pricePerSqm.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">Minimum</p>
                          <p className="text-sm font-bold text-gray-700">R{service.minPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {/* ── Service Detail Dialog ── */}
          <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
              {selectedService && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#d4a843]/10 flex items-center justify-center">
                        {(() => { const I = selectedService.icon || Wrench; return <I className="h-4 w-4 text-[#b8941f]" /> })()}
                      </div>
                      {selectedService.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <p className="text-sm text-gray-600">{selectedService.description}</p>

                    <div className="p-4 rounded-xl bg-[#d4a843]/5 border border-[#d4a843]/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[10px] text-gray-400">Price per {selectedService.unit}</p>
                          <p className="text-2xl font-extrabold text-[#b8941f]">R{selectedService.pricePerSqm.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">Minimum Job</p>
                          <p className="text-lg font-bold text-gray-700">R{selectedService.minPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <Label className="text-xs">Enter area to estimate ({selectedService.unit})</Label>
                      <div className="flex gap-2 mt-2">
                        <Input type="number" placeholder={`Area in ${selectedService.unit}`}
                          value={sqm} onChange={e => setSqm(e.target.value)}
                          className="bg-white border-gray-200" />
                      </div>
                      {sqm && parseFloat(sqm) > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-white border border-gray-100">
                          <p className="text-xs text-gray-400">Estimated Cost</p>
                          <p className="text-xl font-extrabold text-emerald-600">
                            R{Math.max(selectedService.pricePerSqm * parseFloat(sqm), selectedService.minPrice).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {selectedService.pricePerSqm.toLocaleString()} × {sqm} {selectedService.unit}
                            {selectedService.pricePerSqm * parseFloat(sqm) < selectedService.minPrice && ` (minimum: R${selectedService.minPrice.toLocaleString()})`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">What's Included</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {selectedService.includes.map(item => (
                          <div key={item} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-[10px] text-gray-400">Region: {selectedService.region}</p>
                      <p className="text-[10px] text-gray-400">Prices are estimates — final quote depends on site conditions, materials, and specifications.</p>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB 3: PLATINUM IDENTITY™ WIZARD           */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="wizard" className="space-y-6 mt-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">🚀 Platinum Identity™ Integration Wizard</h2>
            <p className="text-gray-500 text-sm mt-1">Connect your BGOS platform to external services for maximum capability</p>
          </div>

          {/* ── Recommended Stack ── */}
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="h-5 w-5 text-[#d4a843]" />
                <h3 className="font-bold text-base">Recommended Stack for Platinum Identity™</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">My #1 Recommendation for building BGOS as a real commercial platform:</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: 'Next.js', role: 'Customer platform, Dashboard, Registry UI', icon: Code2 },
                  { name: 'Supabase', role: 'Database, Auth, Storage, Real-time', icon: Database },
                  { name: 'Vercel', role: 'Hosting, Deployment, Scalability', icon: Rocket },
                  { name: 'OpenAI', role: 'Intelligence engines, AI features', icon: Brain },
                ].map(s => (
                  <div key={s.name} className="p-3 rounded-lg bg-white/10 border border-white/10">
                    <s.icon className="h-5 w-5 text-[#d4a843] mb-2" />
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{s.role}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">This stack supports custom software development — not just website building. Capable of all BGOS components including Platinum Logo recognition with OpenCV / Google ML Kit.</p>
            </CardContent>
          </Card>

          {/* ── Platform Cards ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATINUM_PLATFORMS.map(platform => {
              const PlatIcon = platform.icon || Globe
              return (
                <a key={platform.id} href={platform.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[#d4a843]/40 hover:shadow-md transition group shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${platform.color}12` }}>
                      <PlatIcon className="h-5 w-5" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#b8941f] transition">{platform.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] border-gray-200 text-gray-400">{platform.category}</Badge>
                        <Badge variant="outline" className={`text-[9px] ${
                          platform.tier === 'core' ? 'border-emerald-300 text-emerald-600' :
                          platform.tier === 'enhanced' ? 'border-amber-300 text-amber-600' :
                          'border-gray-200 text-gray-400'
                        }`}>{platform.tier}</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{platform.description}</p>
                  <p className="text-[10px] text-gray-400 italic mb-3">{platform.purpose}</p>
                  <span className="text-[10px] text-[#b8941f] flex items-center gap-1 font-medium">
                    Open Documentation <ArrowUpRight className="h-3 w-3" />
                  </span>
                </a>
              )
            })}
          </div>

          {/* ── Setup Priority ── */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">📋 Recommended Integration Order</h3>
              <div className="space-y-3">
                {[
                  { step: 1, name: 'Next.js', desc: 'Set up your customer-facing platform and admin dashboard', tier: 'core' },
                  { step: 2, name: 'Supabase', desc: 'Configure database, auth, and storage for your platform', tier: 'core' },
                  { step: 3, name: 'Vercel', desc: 'Deploy your platform with automatic scaling', tier: 'core' },
                  { step: 4, name: 'OpenAI', desc: 'Connect AI engines for content, estimation, and chat', tier: 'core' },
                  { step: 5, name: 'OpenCV / Google ML Kit', desc: 'Add Platinum Logo recognition and vision AI', tier: 'enhanced' },
                  { step: 6, name: 'Google Maps Platform', desc: 'Add location services for project site mapping', tier: 'enhanced' },
                  { step: 7, name: 'LangChain', desc: 'Build complex AI reasoning chains for advanced features', tier: 'enhanced' },
                  { step: 8, name: 'Stripe', desc: 'Add payment processing for invoices and subscriptions', tier: 'optional' },
                  { step: 9, name: 'Twilio', desc: 'Add SMS and voice communication for notifications', tier: 'optional' },
                  { step: 10, name: 'Cloudinary', desc: 'Optimize and manage construction photos and videos', tier: 'optional' },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="h-8 w-8 rounded-full bg-[#d4a843]/10 text-[#b8941f] text-sm font-bold flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{s.name}</p>
                        <Badge variant="outline" className={`text-[9px] ${
                          s.tier === 'core' ? 'border-emerald-300 text-emerald-600' :
                          s.tier === 'enhanced' ? 'border-amber-300 text-amber-600' :
                          'border-gray-200 text-gray-400'
                        }`}>{s.tier}</Badge>
                      </div>
                      <p className="text-[10px] text-gray-400">{s.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

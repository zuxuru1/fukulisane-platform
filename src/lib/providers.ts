export const OAUTH_PROVIDERS: Record<string, {
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
    description: 'Manage your Google Business listing, reviews, and posts',
  },
  'facebook': {
    name: 'Facebook Business', authType: 'oauth',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    setupUrl: 'https://business.facebook.com',
    description: 'Connect your Facebook Business Page for posting and analytics',
  },
  'instagram': {
    name: 'Instagram Business', authType: 'oauth',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
    setupUrl: 'https://business.instagram.com',
    description: 'Post content and manage your Instagram Business account',
  },
  'whatsapp-business': {
    name: 'WhatsApp Business', authType: 'api_key',
    setupUrl: 'https://business.whatsapp.com',
    description: 'Connect WhatsApp Business API for messaging automation',
  },
  'tiktok': {
    name: 'TikTok Business', authType: 'oauth',
    authUrl: 'https://business-api.tiktok.com/portal/auth',
    tokenUrl: 'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
    scopes: ['video.publish', 'video.list'],
    setupUrl: 'https://ads.tiktok.com',
    description: 'Publish content and run ads on TikTok',
  },
  'youtube': {
    name: 'YouTube', authType: 'oauth',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube'],
    setupUrl: 'https://studio.youtube.com',
    description: 'Upload videos and manage your YouTube channel',
  },
  'linkedin': {
    name: 'LinkedIn Business', authType: 'oauth',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['w_member_social', 'r_liteprofile', 'r_emailaddress'],
    setupUrl: 'https://www.linkedin.com/company',
    description: 'Post updates and manage your LinkedIn Company Page',
  },
  'pinterest': {
    name: 'Pinterest Business', authType: 'oauth',
    authUrl: 'https://www.pinterest.com/oauth/',
    tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
    scopes: ['pins:read', 'pins:write', 'boards:read', 'boards:write'],
    setupUrl: 'https://business.pinterest.com',
    description: 'Create pins and manage boards for your business',
  },
  'x': {
    name: 'X (Twitter)', authType: 'oauth',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    setupUrl: 'https://developer.x.com',
    description: 'Post tweets and manage your X (Twitter) presence',
  },
  'wordpress': {
    name: 'WordPress', authType: 'api_key',
    setupUrl: 'https://wordpress.com',
    description: 'Connect your WordPress site via REST API',
  },
  'stripe': {
    name: 'Stripe Payments', authType: 'api_key',
    setupUrl: 'https://dashboard.stripe.com',
    description: 'Accept online payments and manage invoices',
  },
  'smtp-email': {
    name: 'Email (SMTP)', authType: 'api_key',
    description: 'Configure SMTP for transactional email',
  },
  'sms-gateway': {
    name: 'SMS Gateway', authType: 'api_key',
    description: 'Connect an SMS provider for notifications',
  },
}

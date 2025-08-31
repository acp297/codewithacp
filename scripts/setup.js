#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setup() {
  console.log('🚀 CodeWithACP Platform Setup\n')
  
  console.log('This script will help you configure your environment variables for Supabase.\n')
  
  // Check if .env.local already exists
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ')
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.')
      rl.close()
      return
    }
  }
  
  console.log('\n📋 Supabase Configuration\n')
  
  const supabaseUrl = await question('Enter your Supabase Project URL (e.g., https://abc123.supabase.co): ')
  const supabaseAnonKey = await question('Enter your Supabase Anon/Public Key: ')
  const supabaseServiceKey = await question('Enter your Supabase Service Role Key: ')
  const databasePassword = await question('Enter your Supabase Database Password: ')
  
  // Extract project ref from URL
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
  
  // Generate a random NEXTAUTH_SECRET
  const nextAuthSecret = require('crypto').randomBytes(32).toString('hex')
  
  const envContent = `# Database (Supabase)
DATABASE_URL="postgresql://postgres:${databasePassword}@db.${projectRef}.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:${databasePassword}@db.${projectRef}.supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseAnonKey}"
SUPABASE_SERVICE_ROLE_KEY="${supabaseServiceKey}"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${nextAuthSecret}"

# Google OAuth (configure later)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth (configure later)
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# GitHub OAuth (configure later)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Stripe (configure later)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Google Pay (configure later)
GOOGLE_PAY_MERCHANT_ID="your-google-pay-merchant-id"

# UPI (configure later)
UPI_MERCHANT_ID="your-upi-merchant-id"
`
  
  fs.writeFileSync(envPath, envContent)
  
  console.log('\n✅ Environment variables configured successfully!')
  console.log('\n📝 Next steps:')
  console.log('1. Run: npx prisma db push')
  console.log('2. Run: npm run dev')
  console.log('3. Visit: http://localhost:3000')
  console.log('\n📚 For detailed setup instructions, see: scripts/setup-supabase.md')
  
  rl.close()
}

setup().catch(console.error)

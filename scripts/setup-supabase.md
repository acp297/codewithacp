# Supabase Setup Guide for CodeWithACP

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `codewithacp-platform`
   - Database Password: Create a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
   - **Anon/Public Key**: `[YOUR-ANON-KEY]`
   - **Service Role Key**: `[YOUR-SERVICE-ROLE-KEY]`

## Step 3: Get Database Connection String

1. Go to Settings > Database
2. Scroll down to "Connection string"
3. Select "URI" format
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

## Step 4: Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   # Database (Supabase)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"

   # OAuth Providers (configure these later)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"

   # Stripe (configure these later)
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
   STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
   ```

## Step 5: Push Database Schema

1. Run the following command to create all tables in Supabase:
   ```bash
   npx prisma db push
   ```

2. Verify the tables were created by going to your Supabase dashboard > Table Editor

## Step 6: Set Up Row Level Security (RLS)

1. Go to your Supabase dashboard > Authentication > Policies
2. Enable RLS on all tables
3. Create policies for each table (see below for examples)

### Example RLS Policies

#### Users Table
```sql
-- Allow users to read their own data
CREATE POLICY "Users can view own data" ON "User"
FOR SELECT USING (auth.uid()::text = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON "User"
FOR UPDATE USING (auth.uid()::text = id);
```

#### Courses Table
```sql
-- Allow public read access to published courses
CREATE POLICY "Public can view published courses" ON "Course"
FOR SELECT USING (isPublished = true);

-- Allow instructors to manage their courses
CREATE POLICY "Instructors can manage courses" ON "Course"
FOR ALL USING (instructor = auth.jwt() ->> 'email');
```

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Try to sign up/sign in (this will test the database connection)

## Step 8: Configure OAuth Providers (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs: `http://localhost:3000/api/auth/callback/facebook`

### GitHub OAuth
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## Step 9: Configure Stripe (Optional)

1. Create a [Stripe account](https://stripe.com/)
2. Get your API keys from the dashboard
3. Set up webhook endpoints for payment events
4. Configure payment methods (cards, Google Pay, etc.)

## Troubleshooting

### Common Issues

1. **Database connection error**: Check your DATABASE_URL and password
2. **RLS policy errors**: Make sure RLS is properly configured
3. **OAuth errors**: Verify redirect URIs match exactly
4. **Prisma errors**: Run `npx prisma generate` after schema changes

### Useful Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

## Next Steps

1. Add your first course through the admin interface
2. Configure payment processing
3. Set up email notifications
4. Deploy to production

For production deployment, remember to:
- Update NEXTAUTH_URL to your production domain
- Configure production OAuth redirect URIs
- Set up production Stripe keys
- Configure proper RLS policies for production

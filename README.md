# CodeWithACP - Learning Platform

A comprehensive online learning platform for publishing courses, articles, blogs, and tech videos with integrated payment processing.

## 🚀 Features

### Authentication
- **Social Login**: Google, Facebook, and GitHub OAuth integration
- **Secure Sessions**: JWT-based authentication with NextAuth.js
- **User Management**: Role-based access control (Student, Instructor, Admin)

### Course Management
- **Course Creation**: Create and manage courses with chapters
- **Video Integration**: Support for video tutorials and content
- **Progress Tracking**: Track user progress through courses
- **Reviews & Ratings**: Course rating and review system

### Content Types
- **Courses**: Structured learning paths with chapters
- **Articles**: In-depth technical articles and tutorials
- **Blogs**: Regular blog posts and updates
- **Videos**: Standalone video content

### Payment System
- **Multiple Payment Methods**:
  - Credit/Debit Cards (via Stripe)
  - Google Pay
  - UPI (Unified Payments Interface)
- **Subscription Plans**: Monthly/yearly subscription options
- **Secure Processing**: Stripe-powered payment processing
- **Webhook Integration**: Real-time payment status updates

### User Experience
- **Responsive Design**: Mobile-first, modern UI
- **Search & Filters**: Advanced course discovery
- **Progress Dashboard**: Track learning progress
- **Certificate System**: Completion certificates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: NextAuth.js with Supabase
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Stripe account
- OAuth credentials (Google, Facebook, GitHub)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd codewithacp-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env.local
```

Fill in your environment variables:

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

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Google Pay
GOOGLE_PAY_MERCHANT_ID="your-google-pay-merchant-id"

# UPI
UPI_MERCHANT_ID="your-upi-merchant-id"
```

### 4. Supabase Setup

Follow the detailed setup guide in `scripts/setup-supabase.md` or:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials from Settings > API
3. Update your `.env.local` with Supabase credentials
4. Push the database schema:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs: `http://localhost:3000/api/auth/callback/facebook`

#### GitHub OAuth
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Stripe Setup

1. Create a [Stripe account](https://stripe.com/)
2. Get your API keys from the dashboard
3. Set up webhook endpoints for payment events
4. Configure payment methods (cards, Google Pay, etc.)

## 📁 Project Structure

```
codewithacp-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── payment/          # Payment components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe utilities
│   └── utils.ts          # General utilities
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── public/               # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔒 Security Considerations

- All API routes are protected with authentication
- Payment processing uses Stripe's secure infrastructure
- Environment variables are properly configured
- Database queries use Prisma's built-in SQL injection protection
- OAuth flows follow security best practices

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses` - Create course (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Watching the repository
- Following the release notes
- Checking the changelog

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

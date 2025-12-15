# 🚀 Vercel Deployment Guide - Tag Bridge Home

This guide will help you deploy your Tag Bridge Home application to Vercel for free using Supabase as the database.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `tag-bridge-home`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project setup to complete (2-3 minutes)

### 1.2 Get Supabase Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 1.3 Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Open the `supabase-schema.sql` file from your project
3. Copy all the SQL content
4. Paste it in the SQL Editor
5. Click **Run** to create all tables
6. Verify tables are created in **Table Editor**

## 🔧 Step 2: Update Environment Variables

### 2.1 Update Local Environment
Update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Security (CHANGE THESE VALUES!)
JWT_SECRET=your-production-jwt-secret-change-this
ADMIN_SETUP_SECRET=your-admin-setup-secret-change-this
ADMIN_SETUP_ENABLED=true

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# WhatsApp & Bank Details
WHATSAPP_CONTACT_PLACEHOLDER=+251991856292
BANK_ACCOUNT_PLACEHOLDER="CBE Bank - Account: 1000200450705"
```

### 2.2 Test Local Build
```bash
# Install dependencies
npm install

# Test the build
npm run build

# Start production server locally
npm start
```

If the build succeeds, you're ready for deployment!

## 🚀 Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository (`tag-bridge-home`)
4. Click **"Import"**

### 3.2 Configure Environment Variables
In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production |
| `JWT_SECRET` | Strong random string (32+ chars) | Production |
| `ADMIN_SETUP_SECRET` | Strong random string (32+ chars) | Production |
| `ADMIN_SETUP_ENABLED` | `true` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |
| `WHATSAPP_CONTACT_PLACEHOLDER` | `+251991856292` | Production |
| `BANK_ACCOUNT_PLACEHOLDER` | `CBE Bank - Account: 1000200450705` | Production |

### 3.3 Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. Your app will be available at `https://your-app.vercel.app`

## ✅ Step 4: Post-Deployment Setup

### 4.1 Create Admin Account
1. Visit your deployed app: `https://your-app.vercel.app`
2. Go to `/admin-setup`
3. Create your admin account using the `ADMIN_SETUP_SECRET`
4. Login to admin dashboard at `/admin-working`

### 4.2 Test Core Features
- ✅ User registration and login
- ✅ Broker registration
- ✅ Property submission
- ✅ Admin approval system
- ✅ Property listings on homepage

## 🔒 Step 5: Security Checklist

### 5.1 Environment Variables
- [ ] Changed `JWT_SECRET` from default
- [ ] Changed `ADMIN_SETUP_SECRET` from default
- [ ] Set `ADMIN_SETUP_ENABLED=false` after creating admin (optional)

### 5.2 Supabase Security
- [ ] Row Level Security (RLS) is enabled
- [ ] Database password is strong
- [ ] API keys are properly configured

## 🛠️ Troubleshooting

### Build Errors
If you get build errors:

1. **Check dependencies**: Ensure all packages are installed
   ```bash
   npm install
   ```

2. **Check TypeScript errors**: Fix any type issues
   ```bash
   npm run lint
   ```

3. **Check environment variables**: Ensure all required vars are set

### Database Connection Issues
1. Verify Supabase credentials are correct
2. Check if database schema was applied
3. Ensure RLS policies allow access

### Runtime Errors
1. Check Vercel function logs in dashboard
2. Verify environment variables in Vercel settings
3. Test API endpoints individually

## 📚 Additional Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## 🎉 Success!

Your Tag Bridge Home application is now live on Vercel with:
- ✅ PostgreSQL database (Supabase)
- ✅ Serverless functions
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Free hosting

**Live URL**: `https://your-app.vercel.app`

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.
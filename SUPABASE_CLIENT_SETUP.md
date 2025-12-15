# 🚀 Supabase Client Setup Guide

## ✅ Frontend Client Created

Your Supabase client is now ready for use in your Next.js frontend!

### 📁 Files Created
- **`lib/supabase.ts`** - Frontend Supabase client
- **Updated `.env.local`** - Environment variables template
- **Updated `.env.example`** - Template for others

## 🔧 Setup Instructions

### 1. Get Your Supabase Credentials (2 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIs...`)

### 2. Update Environment Variables

Replace the placeholder values in `.env.local`:

```env
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

### 3. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL to create all tables

### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 💻 Using the Client in Your Frontend

### Import the Client

```typescript
// In any React component or page
import { supabase } from '@/lib/supabase'

// Or using default import
import supabase from '@/lib/supabase'
```

### Example Usage

```typescript
// In a React component
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'approved')
      
      if (data) setProperties(data)
    }

    fetchProperties()
  }, [])

  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  )
}
```

### Authentication Example

```typescript
// Login user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

## 🔧 Client Configuration

The client is configured with:
- ✅ **Persistent sessions** - User stays logged in
- ✅ **Auto refresh tokens** - Seamless authentication
- ✅ **URL session detection** - Handles auth redirects

## 🌐 Environment Support

- ✅ **Development** - Works on `localhost:3000`
- ✅ **Production** - Works on Vercel deployment
- ✅ **Type Safety** - Full TypeScript support

## 🚨 Important Notes

1. **Environment Variables**: Must start with `NEXT_PUBLIC_` for frontend access
2. **Restart Required**: Always restart dev server after changing `.env.local`
3. **Security**: Never commit actual credentials to Git
4. **Database**: Run `supabase-schema.sql` before using the client

## ✅ Verification

Test your setup:

```bash
# 1. Check environment variables are loaded
npm run dev
# Should start without Supabase URL errors

# 2. Test in browser console
# Go to localhost:3000 and open DevTools
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
# Should show your Supabase URL
```

## 🎉 Ready to Use!

Your Supabase client is now ready for:
- 🔐 User authentication
- 📊 Database queries
- 🔄 Real-time subscriptions
- 📁 File storage
- 🚀 Production deployment

**Next**: Start using the client in your React components!
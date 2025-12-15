# 🔧 Vercel Environment Variables - Ready to Copy

## 📋 Copy-Paste Ready Format for Vercel Dashboard

### Frontend Variables (Public)
```
NEXT_PUBLIC_SUPABASE_URL=https://dgmegapwcstoohffprcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RyKOScmM0O6WDjdTRrJuNg_MgIVldGH
```

### Backend Variables (Server-side)
```
SUPABASE_SERVICE_KEY=sb_secret_Ot6lg
JWT_SECRET=tag_bridge_home_production_jwt_secret_2024_secure_key_ethiopia
ADMIN_SETUP_SECRET=tag_bridge_admin_setup_production_secret_2024_ethiopia
```

### Additional App Configuration
```
ADMIN_SETUP_ENABLED=true
WHATSAPP_CONTACT_PLACEHOLDER=+251991856292
BANK_ACCOUNT_PLACEHOLDER=CBE Bank - Account: 1000200450705
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🎯 Individual Variables for Vercel Panel

Copy each line below and paste into Vercel's Environment Variables section:

### Variable 1:
**Name:** `NEXT_PUBLIC_SUPABASE_URL`  
**Value:** `https://dgmegapwcstoohffprcr.supabase.co`

### Variable 2:
**Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value:** `sb_publishable_RyKOScmM0O6WDjdTRrJuNg_MgIVldGH`

### Variable 3:
**Name:** `SUPABASE_SERVICE_KEY`  
**Value:** `sb_secret_Ot6lg`

### Variable 4:
**Name:** `JWT_SECRET`  
**Value:** `tag_bridge_home_production_jwt_secret_2024_secure_key_ethiopia`

### Variable 5:
**Name:** `ADMIN_SETUP_SECRET`  
**Value:** `tag_bridge_admin_setup_production_secret_2024_ethiopia`

### Variable 6:
**Name:** `ADMIN_SETUP_ENABLED`  
**Value:** `true`

### Variable 7:
**Name:** `WHATSAPP_CONTACT_PLACEHOLDER`  
**Value:** `+251991856292`

### Variable 8:
**Name:** `BANK_ACCOUNT_PLACEHOLDER`  
**Value:** `CBE Bank - Account: 1000200450705`

### Variable 9:
**Name:** `NEXT_PUBLIC_APP_URL`  
**Value:** `https://your-app.vercel.app`

---

## 📝 How to Add in Vercel Dashboard

1. **Go to your Vercel project dashboard**
2. **Click "Settings" tab**
3. **Click "Environment Variables" in the sidebar**
4. **For each variable above:**
   - Click "Add New"
   - Enter the **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the **Value** (e.g., `https://dgmegapwcstoohffprcr.supabase.co`)
   - Select environments: **Production**, **Preview**, **Development**
   - Click "Save"

## ⚠️ Important Notes

### Variable Naming Rules (✅ All Valid):
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Letters, underscores only
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Letters, underscores only
- ✅ `SUPABASE_SERVICE_KEY` - Letters, underscores only
- ✅ `JWT_SECRET` - Letters, underscores only
- ✅ `ADMIN_SETUP_SECRET` - Letters, underscores only

### Security Levels:
- **Public Variables** (`NEXT_PUBLIC_*`): Exposed to browser
- **Server Variables**: Only available on server-side
- **Service Key**: Most sensitive - server-side only

### Environment Selection:
- **Production**: Live deployment
- **Preview**: Branch deployments
- **Development**: Local development (optional)

---

## 🔄 After Adding Variables

1. **Redeploy your project** (Vercel will auto-redeploy)
2. **Wait for build completion** (2-3 minutes)
3. **Test your live URL**:
   - Homepage: `https://your-app.vercel.app/`
   - Supabase test: `https://your-app.vercel.app/todos`
   - Admin login: `https://your-app.vercel.app/login`

## ✅ Verification

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Todos page connects to Supabase
- ✅ No "Invalid API key" errors
- ✅ Admin login works
- ✅ All features function properly

---

## 🚀 Ready for Production!

All environment variables are properly formatted for Vercel. Copy and paste them into your Vercel dashboard to complete your deployment!
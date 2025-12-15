# 🧪 COMPLETE FUNCTIONALITY TEST CHECKLIST

## ✅ ADMIN FUNCTIONALITY

### 1. **Admin Login**
- [ ] Login with `tedros` / `494841`
- [ ] Redirects to `/admin-working`
- [ ] Dashboard loads without errors

### 2. **Admin Properties Management**
- [ ] View properties list
- [ ] Approve property (changes status)
- [ ] Reject property (changes status)
- [ ] Delete single property
- [ ] Bulk delete broker properties
- [ ] Bulk delete advertiser properties
- [ ] Delete ALL properties

### 3. **Admin User Management**
- [ ] View all users list
- [ ] Create new user (admin/broker/user/advertiser)
- [ ] Edit existing user (username/role/password)
- [ ] Delete user account

### 4. **Admin Broker Applications**
- [ ] View broker applications list
- [ ] Approve broker application
- [ ] Reject broker application
- [ ] Delete broker account (with properties)
- [ ] Bulk delete rejected brokers
- [ ] Bulk delete all brokers

### 5. **Admin Advertiser Applications**
- [ ] View advertiser applications list
- [ ] Approve advertiser application
- [ ] Reject advertiser application
- [ ] Delete advertiser account
- [ ] Bulk delete rejected advertisers
- [ ] Bulk delete all advertisers

### 6. **Admin Guest Submissions**
- [ ] View guest submissions list
- [ ] Approve guest submission (converts to property)
- [ ] Reject guest submission

### 7. **Admin Payment Management**
- [ ] View payment confirmations
- [ ] Approve payment (activates property)
- [ ] Reject payment

### 8. **Admin Banner Management**
- [ ] View banners list
- [ ] Create new banner
- [ ] Edit existing banner
- [ ] Toggle banner active/inactive
- [ ] Delete banner

## ✅ BROKER FUNCTIONALITY

### 1. **Broker Registration**
- [ ] Register new broker account
- [ ] Form validation works
- [ ] Success message displayed

### 2. **Broker Login**
- [ ] Login with broker credentials
- [ ] Redirects to `/broker` dashboard
- [ ] Dashboard loads correctly

### 3. **Broker Add Listing**
- [ ] Access add listing form
- [ ] Fill all required fields
- [ ] Upload images (if applicable)
- [ ] Submit property successfully
- [ ] Property appears in pending status

### 4. **Broker Dashboard**
- [ ] View own properties
- [ ] See property status (pending/approved/rejected)
- [ ] Edit property details
- [ ] Delete own property

## ✅ USER FUNCTIONALITY

### 1. **User Registration**
- [ ] Register new user account
- [ ] Form validation works
- [ ] Success message displayed

### 2. **User Login**
- [ ] Login with user credentials
- [ ] Redirects to `/dashboard`
- [ ] Dashboard loads correctly

### 3. **Property Browsing**
- [ ] View homepage properties
- [ ] Filter properties by type/location/price
- [ ] View property details page
- [ ] Contact property owner (WhatsApp/Phone)

### 4. **Guest Property Submission**
- [ ] Submit property without account
- [ ] Form validation works
- [ ] Success message displayed
- [ ] Submission appears in admin panel

## ✅ GENERAL FUNCTIONALITY

### 1. **Homepage**
- [ ] Loads without errors
- [ ] Properties display correctly
- [ ] Navigation works
- [ ] Language toggle works (EN/AM)
- [ ] No Supabase references visible

### 2. **Authentication**
- [ ] Login page works
- [ ] Register page works
- [ ] Logout functionality
- [ ] Role-based redirects

### 3. **Language Support**
- [ ] English interface complete
- [ ] Amharic interface complete
- [ ] Language toggle works everywhere
- [ ] Text displays correctly

### 4. **Mobile Responsiveness**
- [ ] Homepage mobile-friendly
- [ ] Admin dashboard mobile-friendly
- [ ] Forms work on mobile
- [ ] Navigation responsive

## 🚀 VERCEL DEPLOYMENT REQUIREMENTS

### 1. **Build Success**
- [ ] `npm run build` completes without errors
- [ ] No TypeScript compilation errors
- [ ] All imports resolve correctly

### 2. **Environment Variables**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `JWT_SECRET` set
- [ ] All variables configured in Vercel

### 3. **API Routes**
- [ ] All admin APIs respond correctly
- [ ] Authentication works on live site
- [ ] Database fallbacks work
- [ ] No 500 errors in production

### 4. **Static Assets**
- [ ] CSS loads correctly
- [ ] Images display properly
- [ ] Fonts load correctly
- [ ] No missing assets

## 📋 TESTING PRIORITY ORDER

1. **CRITICAL** - Admin login and basic functionality
2. **HIGH** - Property management (approve/reject/delete)
3. **HIGH** - User management (create/edit/delete)
4. **MEDIUM** - Broker/Advertiser application management
5. **MEDIUM** - Guest submissions and payments
6. **LOW** - Banner management and advanced features

## 🔧 COMMON ISSUES TO CHECK

- [ ] No "Internal server error" messages
- [ ] No database connection errors visible to users
- [ ] All buttons and forms work
- [ ] Proper success/error messages
- [ ] No console errors in browser
- [ ] Fast page load times

## ✅ DEPLOYMENT READINESS

When ALL items above are checked:
- [ ] Final commit with clear message
- [ ] Push to GitHub
- [ ] Verify Vercel auto-deployment
- [ ] Test live site functionality
- [ ] Confirm admin access works on live site
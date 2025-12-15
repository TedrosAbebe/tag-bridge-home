# 📢 Promotional Banner Guide

## How to Add New Promotions to Homepage

### 📍 Location
Edit the file: `app/components/PromotionalBanner.tsx`

### 🎯 Quick Steps
1. Open `app/components/PromotionalBanner.tsx`
2. Find the `banners` array (around line 15)
3. Add your new banner object to the array
4. Save the file - changes appear immediately!

### 📝 Banner Template
Copy this template and modify the values:

```javascript
{
  id: 'your-unique-id',  // ⚠️ MUST be unique (no spaces, use dashes)
  title: {
    en: '🎉 Your English Title!',
    am: '🎉 የአማርኛ ርዕስዎ!'
  },
  description: {
    en: 'Your English description text here.',
    am: 'የአማርኛ መግለጫ ጽሑፍዎ እዚህ።'
  },
  buttonText: {
    en: 'Button Text',
    am: 'የቁልፍ ጽሑፍ'
  },
  buttonLink: '/your-link',  // Where the button should go
  backgroundColor: 'from-blue-500 to-purple-600',  // Tailwind gradient
  textColor: 'text-white',  // Usually 'text-white'
  icon: '🎉',  // Any emoji
  type: 'promotion'  // 'promotion', 'announcement', or 'feature'
}
```

### 🎨 Background Color Options
Choose from these beautiful gradients:

```javascript
// Blue gradients
'from-blue-500 to-purple-600'
'from-blue-400 to-indigo-600'
'from-cyan-500 to-blue-600'

// Green gradients
'from-green-500 to-teal-600'
'from-emerald-500 to-green-600'
'from-lime-500 to-green-600'

// Purple/Pink gradients
'from-purple-500 to-pink-600'
'from-violet-500 to-purple-600'
'from-fuchsia-500 to-pink-600'

// Red/Orange gradients
'from-red-500 to-orange-600'
'from-orange-500 to-red-600'
'from-yellow-500 to-orange-600'

// Special gradients
'from-indigo-500 to-purple-600'
'from-pink-500 to-rose-600'
'from-teal-500 to-cyan-600'
```

### 📱 Example Promotions

#### 1. Special Discount Offer
```javascript
{
  id: 'summer-discount-2024',
  title: {
    en: '🔥 Summer Special - 50% Off!',
    am: '🔥 የበጋ ልዩ - 50% ቅናሽ!'
  },
  description: {
    en: 'Limited time offer! Get 50% off all premium listings this summer.',
    am: 'የተወሰነ ጊዜ ቅናሽ! በዚህ በጋ በሁሉም ፕሪሚየም ዝርዝሮች ላይ 50% ቅናሽ ያግኙ።'
  },
  buttonText: {
    en: 'Claim Discount',
    am: 'ቅናሽ ያግኙ'
  },
  buttonLink: '/special-offer',
  backgroundColor: 'from-red-500 to-orange-600',
  textColor: 'text-white',
  icon: '🔥',
  type: 'promotion'
}
```

#### 2. New Service Announcement
```javascript
{
  id: 'virtual-tours-2024',
  title: {
    en: '🏠 Virtual Tours Now Available!',
    am: '🏠 ምናባዊ ጉብኝቶች አሁን ይገኛሉ!'
  },
  description: {
    en: 'Experience properties from home with our new 360° virtual tour feature.',
    am: 'በአዲሱ 360° ምናባዊ ጉብኝት ባህሪያችን ንብረቶችን ከቤት ይለማመዱ።'
  },
  buttonText: {
    en: 'Try Virtual Tours',
    am: 'ምናባዊ ጉብኝቶችን ይሞክሩ'
  },
  buttonLink: '/virtual-tours',
  backgroundColor: 'from-indigo-500 to-purple-600',
  textColor: 'text-white',
  icon: '🏠',
  type: 'feature'
}
```

#### 3. Contact/Support Banner
```javascript
{
  id: 'customer-support-2024',
  title: {
    en: '💬 24/7 Customer Support!',
    am: '💬 24/7 የደንበኞች ድጋፍ!'
  },
  description: {
    en: 'Need help? Our support team is available around the clock to assist you.',
    am: 'እርዳታ ይፈልጋሉ? የእኛ የድጋፍ ቡድን እርስዎን ለመርዳት በሰዓት ዙሪያ ይገኛል።'
  },
  buttonText: {
    en: 'Get Support',
    am: 'ድጋፍ ያግኙ'
  },
  buttonLink: '/contact',
  backgroundColor: 'from-green-500 to-teal-600',
  textColor: 'text-white',
  icon: '💬',
  type: 'announcement'
}
```

### 🎯 Banner Types
- **`promotion`** - Special offers, discounts, deals
- **`announcement`** - News, updates, important information  
- **`feature`** - New features, services, capabilities

### ⚠️ Important Rules
1. **Unique ID**: Each banner must have a unique `id` (no spaces, use dashes)
2. **Both Languages**: Always provide both English (`en`) and Amharic (`am`) text
3. **Valid Links**: Make sure `buttonLink` points to existing pages
4. **Emoji Icons**: Use single emoji characters for the `icon` field
5. **Gradient Format**: Use Tailwind CSS gradient format for `backgroundColor`

### 🔄 Banner Behavior
- **Auto-rotation**: Banners change every 10 seconds
- **User Control**: Users can manually switch between banners using dots
- **Closeable**: Users can close banners with the X button
- **Persistent**: Closed banners stay closed (saved in browser)
- **Responsive**: Works on all device sizes

### 🚀 Quick Add Process
1. Copy an existing banner from the array
2. Change the `id` to something unique
3. Update the `title`, `description`, and `buttonText` in both languages
4. Set the `buttonLink` to your desired page
5. Choose a `backgroundColor` gradient
6. Pick an `icon` emoji
7. Set the `type` (promotion/announcement/feature)
8. Add a comma after the previous banner
9. Save the file

### 📊 Example: Adding a Holiday Promotion
```javascript
// Add this to the banners array:
,{
  id: 'holiday-special-2024',
  title: {
    en: '🎄 Holiday Special - Free Listings!',
    am: '🎄 የበዓል ልዩ - ነፃ ዝርዝሮች!'
  },
  description: {
    en: 'List your property for free during the holiday season. Limited time offer!',
    am: 'በበዓል ወቅት ንብረትዎን በነፃ ይዘርዝሩ። የተወሰነ ጊዜ ቅናሽ!'
  },
  buttonText: {
    en: 'List for Free',
    am: 'በነፃ ይዘርዝሩ'
  },
  buttonLink: '/submit-property',
  backgroundColor: 'from-red-500 to-green-600',
  textColor: 'text-white',
  icon: '🎄',
  type: 'promotion'
}
```

### 🎨 Pro Tips
- Use contrasting colors for better readability
- Keep titles short and catchy
- Make descriptions clear and compelling
- Use action words in button text
- Test on mobile devices
- Consider seasonal/timely promotions
- Remove old promotions by deleting them from the array

### 🔧 Troubleshooting
- **Banner not showing**: Check for syntax errors (missing commas, brackets)
- **Wrong language**: Verify you're using `en` and `am` keys correctly
- **Broken link**: Make sure the `buttonLink` page exists
- **Styling issues**: Verify the `backgroundColor` uses valid Tailwind classes

That's it! Your new promotional banners will appear immediately on the homepage. 🚀
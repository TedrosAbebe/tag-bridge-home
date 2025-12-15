const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(process.cwd(), 'broker.db');
const db = new Database(dbPath);

console.log('Setting up banner management system...');

try {
  // Create banners table
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_am TEXT NOT NULL,
      description_en TEXT NOT NULL,
      description_am TEXT NOT NULL,
      button_text_en TEXT NOT NULL,
      button_text_am TEXT NOT NULL,
      button_link TEXT NOT NULL,
      background_color TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-600',
      text_color TEXT NOT NULL DEFAULT 'text-white',
      icon TEXT NOT NULL DEFAULT '🎉',
      type TEXT NOT NULL DEFAULT 'promotion',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default banners
  const insertBanner = db.prepare(`
    INSERT OR REPLACE INTO banners (
      id, title_en, title_am, description_en, description_am,
      button_text_en, button_text_am, button_link, background_color,
      text_color, icon, type, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Default banners
  const defaultBanners = [
    {
      id: 'broker-registration',
      title_en: '🚀 Join as Professional Broker!',
      title_am: '🚀 እንደ ፕሮፌሽናል ደላላ ይቀላቀሉ!',
      description_en: 'Get premium features, direct client contact, and higher earnings. Register now!',
      description_am: 'ፕሪሚየም ባህሪያት፣ ቀጥተኛ የደንበኛ ግንኙነት እና ከፍተኛ ገቢ ያግኙ። አሁን ይመዝገቡ!',
      button_text_en: 'Register Now',
      button_text_am: 'አሁን ይመዝገቡ',
      button_link: '/register-broker',
      background_color: 'from-blue-500 to-purple-600',
      text_color: 'text-white',
      icon: '🏢',
      type: 'promotion',
      is_active: 1
    },
    {
      id: 'advertiser-special',
      title_en: '💎 Premium Advertising Available!',
      title_am: '💎 ፕሪሚየም ማስታወቂያ ይገኛል!',
      description_en: 'Boost your property visibility with featured listings and premium placement.',
      description_am: 'የተለየ ዝርዝር እና ፕሪሚየም አቀማመጥ ያለው የንብረት ታይነትዎን ያሳድጉ።',
      button_text_en: 'Learn More',
      button_text_am: 'የበለጠ ይወቁ',
      button_link: '/register-advertiser',
      background_color: 'from-purple-500 to-pink-600',
      text_color: 'text-white',
      icon: '⭐',
      type: 'feature',
      is_active: 1
    },
    {
      id: 'new-features',
      title_en: '🎉 New Features Launched!',
      title_am: '🎉 አዲስ ባህሪያት ተጀምረዋል!',
      description_en: 'Photo upload, advanced search filters, and WhatsApp integration now available.',
      description_am: 'የፎቶ መስቀያ፣ የላቀ የፍለጋ ማጣሪያዎች እና የWhatsApp ውህደት አሁን ይገኛል።',
      button_text_en: 'Explore',
      button_text_am: 'ያስሱ',
      button_link: '/submit-property',
      background_color: 'from-green-500 to-teal-600',
      text_color: 'text-white',
      icon: '🆕',
      type: 'announcement',
      is_active: 1
    },
    {
      id: 'winter-special-2024',
      title_en: '❄️ Winter Special - Free Premium!',
      title_am: '❄️ የክረምት ልዩ - ነፃ ፕሪሚየም!',
      description_en: 'Get 3 months of premium features absolutely free. Limited time winter offer!',
      description_am: 'የ3 ወር ፕሪሚየም ባህሪያትን ሙሉ በሙሉ በነፃ ያግኙ። የተወሰነ ጊዜ የክረምት ቅናሽ!',
      button_text_en: 'Claim Free Premium',
      button_text_am: 'ነፃ ፕሪሚየም ያግኙ',
      button_link: '/register-broker',
      background_color: 'from-cyan-500 to-blue-600',
      text_color: 'text-white',
      icon: '❄️',
      type: 'promotion',
      is_active: 1
    }
  ];

  // Insert default banners
  for (const banner of defaultBanners) {
    insertBanner.run(
      banner.id,
      banner.title_en,
      banner.title_am,
      banner.description_en,
      banner.description_am,
      banner.button_text_en,
      banner.button_text_am,
      banner.button_link,
      banner.background_color,
      banner.text_color,
      banner.icon,
      banner.type,
      banner.is_active
    );
  }

  console.log('✅ Banner management system setup complete!');
  console.log('✅ Default banners inserted');
  console.log('✅ Database table created: banners');

} catch (error) {
  console.error('❌ Error setting up banner management:', error);
} finally {
  db.close();
}
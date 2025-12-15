'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'am'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    favorites: 'Favorites',
    profile: 'Profile',
    contact: 'Contact',
    list_property: 'List Property',
    register_as_broker: 'Register as Broker',
    register_as_advertiser: 'Register as Advertiser',
    
    // Property types
    house_sale: 'House for Sale',
    house_rent: 'House for Rent',
    apartment: 'Apartment',
    land: 'Land',
    
    // Common
    price: 'Price',
    location: 'Location',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    contact_broker: 'Contact Broker',
    whatsapp: 'WhatsApp',
    phone: 'Phone Number',
    call: 'Call',
    login: 'Login',
    register: 'Register',
    
    // Cities
    addis_ababa: 'Addis Ababa',
    adama: 'Adama',
    hawassa: 'Hawassa',
    bahir_dar: 'Bahir Dar',
    mekelle: 'Mekelle',
    
    // Listing
    add_listing: 'Add Listing',
    upload_photos: 'Upload Photos',
    property_details: 'Property Details',
    submit: 'Submit',
    pending: 'Pending',
    approved: 'Approved',
    sold: 'Sold',
    
    // Admin Dashboard
    admin_dashboard: 'Admin Dashboard',
    user_management: 'User Management',
    manage_properties: 'Manage Properties',
    guest_submissions: 'Guest Submissions',
    broker_applications: 'Broker Applications',
    all_users: 'All Users',
    manage_users: 'Manage Users',
    
    // User Management
    create_user: 'Create User',
    create_new_user: 'Create New User Account',
    admin_users: 'Admin Users',
    broker_users: 'Broker Users',
    regular_users: 'Regular Users',
    username: 'Username',
    password: 'Password',
    role: 'Role',
    created: 'Created',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    update: 'Update',
    cancel: 'Cancel',
    
    // Roles
    admin: 'Admin',
    broker: 'Broker',
    user: 'User',
    regular_user: 'Regular User',
    system_administrator: 'System Administrator',
    property_broker: 'Property Broker',
    
    // Statistics
    total_properties: 'Total Properties',
    pending_properties: 'Pending Properties',
    total_users: 'Total Users',
    
    // Actions & Messages
    approve: 'Approve',
    reject: 'Reject',
    view: 'View',
    creating: 'Creating...',
    updating: 'Updating...',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    
    // Security
    protected_account: 'Protected Account',
    security_notice: 'Security Notice',
    cannot_delete_main_admin: 'Cannot delete the main admin account',
    admin_full_access: 'Admin accounts have full system access',
    use_strong_passwords: 'Use strong passwords for all accounts',
    
    // Property Management
    property_listings: 'Property Listings',
    broker_property_listings: 'Broker Property Listings',
    guest_property_submissions: 'Guest Property Submissions',
    broker_registration_applications: 'Broker Registration Applications',
    
    // Form Labels
    new_password: 'New Password',
    leave_empty_keep_current: 'Leave empty to keep current',
    enter_username: 'Enter username',
    enter_password: 'Enter password',
    select_role: 'Select role',
    
    // Status Messages
    no_users_found: 'No users found',
    no_admin_users: 'No admin users',
    no_broker_users: 'No broker users',
    no_regular_users: 'No regular users',
    create_first_user: 'Create your first user account above',
    users_will_appear_here: 'Users will appear here after registration',
    
    // Language Toggle
    language: 'Language',
    english: 'English',
    amharic: 'አማርኛ',
    
    // Homepage
    find_perfect_home: 'Find Your Perfect Home in Ethiopia',
    discover_properties: 'Discover thousands of properties across Ethiopia. Buy, sell, or rent with confidence.',
    search_properties: 'Search properties...',
    all_cities: 'All Cities',
    all_types: 'All Types',
    max_price_etb: 'Max Price (ETB)',
    featured_properties: 'Featured Properties',
    properties_found: 'properties found',
    loading_properties: 'Loading properties...',
    no_properties_found: 'No Properties Found',
    try_adjusting_search: 'Try adjusting your search criteria or check back later.',
    list_your_property: 'List Your Property',
    property_image: 'Property Image',
    view_details: 'View Details',
    why_choose_us: 'Why Choose Ethiopia Home Broker?',
    easy_search: 'Easy Search',
    easy_search_desc: 'Find properties by location, type, and price range with our advanced search filters.',
    direct_contact: 'Direct Contact',
    direct_contact_desc: 'Connect directly with property owners and brokers via WhatsApp and phone calls.',
    verified_listings: 'Verified Listings',
    verified_listings_desc: 'All properties are verified by our admin team to ensure quality and authenticity.',
    ready_find_dream_home: 'Ready to Find Your Dream Home?',
    join_satisfied_customers: 'Join thousands of satisfied customers who found their perfect property with us.',
    browse_as_member: 'Browse as Member',
    trusted_partner: 'Your trusted partner in finding the perfect home in Ethiopia.',
    quick_links: 'Quick Links',
    for_brokers: 'For Brokers',
    property_types: 'Property Types',
    houses_for_sale: 'Houses for Sale',
    apartments_for_rent: 'Apartments for Rent',
    commercial_properties: 'Commercial Properties',
    land_for_sale: 'Land for Sale',
    all_rights_reserved: 'All rights reserved.',
    
    // Property type formatting
    house_sale_formatted: 'House Sale',
    house_rent_formatted: 'House Rent',
    apartment_sale: 'Apartment Sale',
    apartment_rent: 'Apartment Rent',
    villa_sale: 'Villa Sale',
    villa_rent: 'Villa Rent',
    shop_sale: 'Shop Sale',
    shop_rent: 'Shop Rent',
    
    // Advertiser features
    professional_advertiser: 'Professional Advertiser',
    featured: 'FEATURED',
    premium: 'PREMIUM'
  },
  am: {
    // Navigation
    home: 'ቤት',
    search: 'ፈልግ',
    favorites: 'ተወዳጆች',
    profile: 'መገለጫ',
    contact: 'ያነጋግሩን',
    list_property: 'ንብረት ዝርዝር',
    register_as_broker: 'እንደ ደላላ ይመዝገቡ',
    register_as_advertiser: 'እንደ አስተዋዋቂ ይመዝገቡ',
    
    // Property types
    house_sale: 'ለሽያጭ ቤት',
    house_rent: 'ለኪራይ ቤት',
    apartment: 'አፓርትመንት',
    land: 'መሬት',
    
    // Common
    price: 'ዋጋ',
    location: 'አካባቢ',
    bedrooms: 'መኝታ ክፍሎች',
    bathrooms: 'መታጠቢያ ክፍሎች',
    contact_broker: 'ደላላ ያነጋግሩ',
    whatsapp: 'ዋትስአፕ',
    phone: 'ስልክ ቁጥር',
    call: 'ደውል',
    login: 'ግባ',
    register: 'ተመዝገብ',
    
    // Cities
    addis_ababa: 'አዲስ አበባ',
    adama: 'አዳማ',
    hawassa: 'ሐዋሳ',
    bahir_dar: 'ባሕር ዳር',
    mekelle: 'መቐለ',
    
    // Listing
    add_listing: 'ዝርዝር ጨምር',
    upload_photos: 'ፎቶዎች ስቀል',
    property_details: 'የንብረት ዝርዝሮች',
    submit: 'አስገባ',
    pending: 'በመጠባበቅ ላይ',
    approved: 'ጸድቋል',
    sold: 'ተሽጧል',
    
    // Admin Dashboard
    admin_dashboard: 'የአስተዳዳሪ ዳሽቦርድ',
    user_management: 'የተጠቃሚ አስተዳደር',
    manage_properties: 'ንብረቶችን አስተዳድር',
    guest_submissions: 'የእንግዳ ማቅረቢያዎች',
    broker_applications: 'የደላላ ማመልከቻዎች',
    all_users: 'ሁሉም ተጠቃሚዎች',
    manage_users: 'ተጠቃሚዎችን አስተዳድር',
    
    // User Management
    create_user: 'ተጠቃሚ ፍጠር',
    create_new_user: 'አዲስ የተጠቃሚ መለያ ፍጠር',
    admin_users: 'አስተዳዳሪ ተጠቃሚዎች',
    broker_users: 'ደላላ ተጠቃሚዎች',
    regular_users: 'መደበኛ ተጠቃሚዎች',
    username: 'የተጠቃሚ ስም',
    password: 'የይለፍ ቃል',
    role: 'ሚና',
    created: 'የተፈጠረበት',
    actions: 'ድርጊቶች',
    edit: 'አርም',
    delete: 'ሰርዝ',
    update: 'አዘምን',
    cancel: 'ሰርዝ',
    
    // Roles
    admin: 'አስተዳዳሪ',
    broker: 'ደላላ',
    user: 'ተጠቃሚ',
    regular_user: 'መደበኛ ተጠቃሚ',
    system_administrator: 'የስርዓት አስተዳዳሪ',
    property_broker: 'የንብረት ደላላ',
    
    // Statistics
    total_properties: 'ጠቅላላ ንብረቶች',
    pending_properties: 'በመጠባበቅ ላይ ያሉ ንብረቶች',
    total_users: 'ጠቅላላ ተጠቃሚዎች',
    
    // Actions & Messages
    approve: 'ጽድቅ',
    reject: 'ውድቅ አድርግ',
    view: 'ተመልከት',
    creating: 'በመፍጠር ላይ...',
    updating: 'በማዘመን ላይ...',
    loading: 'በመጫን ላይ...',
    success: 'ተሳክቷል',
    error: 'ስህተት',
    
    // Security
    protected_account: 'የተጠበቀ መለያ',
    security_notice: 'የደህንነት ማስታወቂያ',
    cannot_delete_main_admin: 'ዋናውን የአስተዳዳሪ መለያ መሰረዝ አይቻልም',
    admin_full_access: 'የአስተዳዳሪ መለያዎች ሙሉ የስርዓት መዳረሻ አላቸው',
    use_strong_passwords: 'ለሁሉም መለያዎች ጠንካራ የይለፍ ቃሎችን ይጠቀሙ',
    
    // Property Management
    property_listings: 'የንብረት ዝርዝሮች',
    broker_property_listings: 'የደላላ ንብረት ዝርዝሮች',
    guest_property_submissions: 'የእንግዳ ንብረት ማቅረቢያዎች',
    broker_registration_applications: 'የደላላ ምዝገባ ማመልከቻዎች',
    
    // Form Labels
    new_password: 'አዲስ የይለፍ ቃል',
    leave_empty_keep_current: 'ወቅታዊውን ለማቆየት ባዶ ይተዉ',
    enter_username: 'የተጠቃሚ ስም ያስገቡ',
    enter_password: 'የይለፍ ቃል ያስገቡ',
    select_role: 'ሚና ይምረጡ',
    
    // Status Messages
    no_users_found: 'ምንም ተጠቃሚዎች አልተገኙም',
    no_admin_users: 'ምንም አስተዳዳሪ ተጠቃሚዎች የሉም',
    no_broker_users: 'ምንም ደላላ ተጠቃሚዎች የሉም',
    no_regular_users: 'ምንም መደበኛ ተጠቃሚዎች የሉም',
    create_first_user: 'ከላይ የመጀመሪያ የተጠቃሚ መለያዎን ይፍጠሩ',
    users_will_appear_here: 'ተጠቃሚዎች ከተመዘገቡ በኋላ እዚህ ይታያሉ',
    
    // Language Toggle
    language: 'ቋንቋ',
    english: 'English',
    amharic: 'አማርኛ',
    
    // Homepage
    find_perfect_home: 'በኢትዮጵያ ውስጥ ፍጹም ቤትዎን ያግኙ',
    discover_properties: 'በኢትዮጵያ ውስጥ በሺዎች የሚቆጠሩ ንብረቶችን ያግኙ። በመተማመን ይግዙ፣ ይሽጡ ወይም ይከራዩ።',
    search_properties: 'ንብረቶችን ፈልግ...',
    all_cities: 'ሁሉም ከተሞች',
    all_types: 'ሁሉም አይነቶች',
    max_price_etb: 'ከፍተኛ ዋጋ (ብር)',
    featured_properties: 'ተመራጭ ንብረቶች',
    properties_found: 'ንብረቶች ተገኝተዋል',
    loading_properties: 'ንብረቶች በመጫን ላይ...',
    no_properties_found: 'ምንም ንብረቶች አልተገኙም',
    try_adjusting_search: 'የፍለጋ መስፈርቶችዎን ማስተካከል ይሞክሩ ወይም በኋላ ይመለሱ።',
    list_your_property: 'ንብረትዎን ዝርዝር ያድርጉ',
    property_image: 'የንብረት ምስል',
    view_details: 'ዝርዝሮችን ተመልከት',
    why_choose_us: 'ለምን የኢትዮጵያ ቤት ደላላን መምረጥ አለብዎት?',
    easy_search: 'ቀላል ፍለጋ',
    easy_search_desc: 'በላቀ የፍለጋ ማጣሪያዎቻችን በአካባቢ፣ በአይነት እና በዋጋ ክልል ንብረቶችን ያግኙ።',
    direct_contact: 'ቀጥተኛ ግንኙነት',
    direct_contact_desc: 'በዋትስአፕ እና በስልክ ጥሪዎች ከንብረት ባለቤቶች እና ደላላዎች ጋር በቀጥታ ይገናኙ።',
    verified_listings: 'የተረጋገጡ ዝርዝሮች',
    verified_listings_desc: 'ሁሉም ንብረቶች ጥራት እና ትክክለኛነትን ለማረጋገጥ በአስተዳዳሪ ቡድናችን ይረጋገጣሉ።',
    ready_find_dream_home: 'የህልም ቤትዎን ለማግኘት ዝግጁ ነዎት?',
    join_satisfied_customers: 'ፍጹም ንብረታቸውን ከእኛ ጋር ያገኙ በሺዎች የሚቆጠሩ ረክተኛ ደንበኞች ይቀላቀሉ።',
    browse_as_member: 'እንደ አባል ያስሱ',
    trusted_partner: 'በኢትዮጵያ ውስጥ ፍጹም ቤት ለማግኘት የታመነ አጋርዎ።',
    quick_links: 'ፈጣን አገናኞች',
    for_brokers: 'ለደላላዎች',
    property_types: 'የንብረት አይነቶች',
    houses_for_sale: 'ለሽያጭ ቤቶች',
    apartments_for_rent: 'ለኪራይ አፓርትመንቶች',
    commercial_properties: 'የንግድ ንብረቶች',
    land_for_sale: 'ለሽያጭ መሬት',
    all_rights_reserved: 'ሁሉም መብቶች የተጠበቁ ናቸው።',
    
    // Property type formatting
    house_sale_formatted: 'የቤት ሽያጭ',
    house_rent_formatted: 'የቤት ኪራይ',
    apartment_sale: 'የአፓርትመንት ሽያጭ',
    apartment_rent: 'የአፓርትመንት ኪራይ',
    villa_sale: 'የቪላ ሽያጭ',
    villa_rent: 'የቪላ ኪራይ',
    shop_sale: 'የሱቅ ሽያጭ',
    shop_rent: 'የሱቅ ኪራይ',
    
    // Advertiser features
    professional_advertiser: 'ፕሮፌሽናል አስተዋዋቂ',
    featured: 'ተመራጭ',
    premium: 'ፕሪሚየም'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  
  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am')) {
      setLanguage(savedLanguage)
    }
  }, [])
  
  // Save language preference when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('preferred-language', lang)
  }
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
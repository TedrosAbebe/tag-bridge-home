// Shared types for the Tag Bridge Home application

export interface User {
  id: string
  username: string
  role: 'admin' | 'broker' | 'user' | 'advertiser'
  created_at?: string
  brokerStatus?: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: {
    city: string
    area: string
  }
  type: string
  bedrooms?: number
  bathrooms?: number
  size: number
  features: string[]
  images: string[]
  status: string
  whatsappNumber: string
  phoneNumber: string
  advertiser?: {
    name: string
    business: string
    email: string
    website?: string
  }
  isPremium?: boolean
  isFeatured?: boolean
}

export interface Banner {
  id: string
  title: { en: string; am: string }
  description: { en: string; am: string }
  buttonText: { en: string; am: string }
  buttonLink: string
  backgroundColor: string
  textColor: string
  icon: string
  type: 'promotion' | 'announcement' | 'feature'
}

// Ethiopian cities for property listings
export const ETHIOPIAN_CITIES = [
  'Addis Ababa',
  'Dire Dawa',
  'Mekelle',
  'Gondar',
  'Awassa',
  'Bahir Dar',
  'Dessie',
  'Jimma',
  'Jijiga',
  'Shashamane',
  'Nekemte',
  'Bishoftu',
  'Asella',
  'Harar',
  'Dilla',
  'Arba Minch',
  'Hosaena',
  'Adama',
  'Debre Markos',
  'Debre Birhan'
]

// Property types for listings
export const PROPERTY_TYPES = [
  { value: 'apartment', label: { en: 'Apartment', am: 'አፓርትመንት' } },
  { value: 'house', label: { en: 'House', am: 'ቤት' } },
  { value: 'villa', label: { en: 'Villa', am: 'ቪላ' } },
  { value: 'condo', label: { en: 'Condominium', am: 'ኮንዶሚኒየም' } },
  { value: 'commercial', label: { en: 'Commercial', am: 'የንግድ' } },
  { value: 'land', label: { en: 'Land', am: 'መሬት' } },
  { value: 'office', label: { en: 'Office', am: 'ቢሮ' } },
  { value: 'warehouse', label: { en: 'Warehouse', am: 'መጋዘን' } }
]
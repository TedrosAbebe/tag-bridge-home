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
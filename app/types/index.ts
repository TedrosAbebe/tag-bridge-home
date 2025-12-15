export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: 'ETB' | 'USD'
  location: {
    city: string
    area: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  type: 'house_sale' | 'house_rent' | 'apartment_sale' | 'apartment_rent' | 'villa_sale' | 'villa_rent' | 'land' | 'shop_sale' | 'shop_rent' | 'office_sale' | 'office_rent' | 'condominium_sale' | 'condominium_rent' | 'studio_sale' | 'studio_rent' | 'commercial_building_sale' | 'commercial_building_rent' | 'warehouse_rent' | 'residential_land' | 'commercial_land' | 'agricultural_land' | 'industrial_land' | 'vacant_plot' | 'g1_house_sale' | 'g2_house_sale' | 'townhouse_sale' | 'duplex_sale' | 'serviced_apartment_sale' | 'mall_space_sale' | 'showroom_sale' | 'family_house_rent' | 'furnished_apartment' | 'unfurnished_apartment' | 'room_rent' | 'shared_apartment' | 'workshop_rent' | 'commercial_space_rent' | 'land_lease' | 'commercial_building_lease' | 'factory_lease' | 'warehouse_lease' | 'office_lease' | 'furnished_daily' | 'guest_house' | 'vacation_home' | 'hotel_apartment' | 'airbnb_style' | 'luxury_property' | 'new_development' | 'off_plan' | 'gated_community' | 'smart_home' | 'investment_property'
  bedrooms?: number
  bathrooms?: number
  size: number // in square meters
  images: string[]
  features: string[]
  status: 'pending' | 'approved' | 'sold' | 'rejected'
  ownerId: string
  brokerId?: string
  createdAt: Date
  updatedAt: Date
  whatsappNumber: string
  phoneNumber: string
}

export interface User {
  id: string
  // many components expect `username`; keep both `name` and `username` for backward compatibility
  name?: string
  username?: string
  phone?: string
  whatsappNumber?: string
  role: 'user' | 'broker' | 'admin' | 'advertiser'
  createdAt?: Date
}

export interface Favorite {
  id: string
  userId: string
  propertyId: string
  createdAt: Date
}

export interface SearchFilters {
  type?: Property['type']
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minSize?: number
  maxSize?: number
}

export const ETHIOPIAN_CITIES = [
  'Addis Ababa',
  'Adama',
  'Hawassa',
  'Bahir Dar',
  'Mekelle',
  'Gondar',
  'Jimma',
  'Dire Dawa',
  'Dessie',
  'Nekemte'
] as const

export const PROPERTY_TYPES = [
  'house_sale',
  'house_rent',
  'apartment_sale',
  'apartment_rent',
  'villa_sale',
  'villa_rent',
  'land',
  'shop_sale',
  'shop_rent',
  'office_sale',
  'office_rent',
  'condominium_sale',
  'condominium_rent',
  'studio_sale',
  'studio_rent',
  'commercial_building_sale',
  'commercial_building_rent',
  'warehouse_rent',
  'residential_land',
  'commercial_land',
  'agricultural_land',
  'industrial_land',
  'vacant_plot'
] as const
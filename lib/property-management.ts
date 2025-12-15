export interface PropertyData {
  id: string
  brokerId: string
  brokerName: string
  brokerPhone?: string
  brokerWhatsApp?: string
  title: string
  description: string
  price: number
  currency: 'ETB' | 'USD'
  location: {
    city: string
    area: string
    address?: string
  }
  type: 'house_sale' | 'house_rent' | 'apartment' | 'land' | 'commercial'
  bedrooms?: number
  bathrooms?: number
  size?: number
  features: string[]
  images: string[]
  status: 'pending' | 'approved' | 'rejected' | 'sold'
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

// Mock property database (in real system, this would be a proper database)
const propertyStore = new Map<string, PropertyData>()

// Initialize with some mock data
const mockProperties: PropertyData[] = [
  {
    id: 'prop-1',
    brokerId: 'broker-1',
    brokerName: 'Ahmed Hassan',
    brokerPhone: '+251911234567',
    brokerWhatsApp: '+251911234567',
    title: 'Beautiful 2BR Apartment in Bole',
    description: 'Modern apartment with great amenities in the heart of Bole',
    price: 150000,
    currency: 'ETB',
    location: {
      city: 'Addis Ababa',
      area: 'Bole',
      address: 'Bole Road, near Edna Mall'
    },
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: 120,
    features: ['Parking', 'Security', 'Generator'],
    images: ['/api/placeholder/400/300'],
    status: 'approved',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'prop-2',
    brokerId: 'broker-1',
    brokerName: 'Ahmed Hassan',
    brokerPhone: '+251911234567',
    brokerWhatsApp: '+251911234567',
    title: 'Modern Villa in CMC',
    description: 'Spacious villa with garden and modern facilities',
    price: 2500000,
    currency: 'ETB',
    location: {
      city: 'Addis Ababa',
      area: 'CMC',
      address: 'CMC Area, behind Commercial Bank'
    },
    type: 'house_sale',
    bedrooms: 4,
    bathrooms: 3,
    size: 300,
    features: ['Garden', 'Garage', 'Modern Kitchen'],
    images: ['/api/placeholder/400/300'],
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'prop-3',
    brokerId: 'broker-2',
    brokerName: 'Fatima Mohammed',
    brokerPhone: '+251922345678',
    brokerWhatsApp: '+251922345678',
    title: 'Luxury Villa in Kazanchis',
    description: 'High-end villa with premium finishes',
    price: 5000000,
    currency: 'ETB',
    location: {
      city: 'Addis Ababa',
      area: 'Kazanchis',
      address: 'Kazanchis Area, near UN Headquarters'
    },
    type: 'house_sale',
    bedrooms: 5,
    bathrooms: 4,
    size: 450,
    features: ['Swimming Pool', 'Garden', 'Security', 'Generator'],
    images: ['/api/placeholder/400/300'],
    status: 'approved',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  }
]

// Initialize store
mockProperties.forEach(prop => propertyStore.set(prop.id, prop))

export class PropertyManager {
  // UC-03: Create Property (Broker)
  static createProperty(propertyData: Omit<PropertyData, 'id' | 'createdAt' | 'updatedAt'>): PropertyData {
    const id = 'prop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)
    const now = new Date()
    
    const property: PropertyData = {
      ...propertyData,
      id,
      status: 'pending', // Always starts as pending
      createdAt: now,
      updatedAt: now
    }
    
    propertyStore.set(id, property)
    
    console.log(`🏠 Property created by broker ${propertyData.brokerId}: ${property.title}`)
    
    // Notify admin (in real system, this would be a proper notification)
    this.notifyAdmin('new_property', property)
    
    return property
  }
  
  // UC-04: Approve/Reject Property (Admin)
  static updatePropertyStatus(
    propertyId: string, 
    status: 'approved' | 'rejected' | 'sold',
    adminId: string,
    rejectionReason?: string
  ): PropertyData | null {
    const property = propertyStore.get(propertyId)
    
    if (!property) {
      console.log('❌ Property not found:', propertyId)
      return null
    }
    
    const oldStatus = property.status
    property.status = status
    property.updatedAt = new Date()
    
    if (status === 'rejected' && rejectionReason) {
      property.rejectionReason = rejectionReason
    }
    
    propertyStore.set(propertyId, property)
    
    console.log(`👑 Admin ${adminId} changed property ${propertyId} status: ${oldStatus} → ${status}`)
    
    // Notify broker
    this.notifyBroker(property.brokerId, 'status_update', property, status)
    
    return property
  }
  
  // UC-05: Search Properties (User)
  static searchProperties(criteria: {
    city?: string
    area?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    status?: string
  }): PropertyData[] {
    const allProperties = Array.from(propertyStore.values())
    
    return allProperties.filter(property => {
      // Only show approved properties for public search
      if (criteria.status !== 'all' && property.status !== 'approved') {
        return false
      }
      
      if (criteria.city && property.location.city !== criteria.city) return false
      if (criteria.area && property.location.area !== criteria.area) return false
      if (criteria.type && property.type !== criteria.type) return false
      if (criteria.minPrice && property.price < criteria.minPrice) return false
      if (criteria.maxPrice && property.price > criteria.maxPrice) return false
      if (criteria.bedrooms && property.bedrooms !== criteria.bedrooms) return false
      
      return true
    })
  }
  
  // Get properties by broker
  static getPropertiesByBroker(brokerId: string): PropertyData[] {
    return Array.from(propertyStore.values()).filter(prop => prop.brokerId === brokerId)
  }
  
  // Get all properties (admin view)
  static getAllProperties(): PropertyData[] {
    return Array.from(propertyStore.values())
  }
  
  // Get property by ID
  static getPropertyById(id: string): PropertyData | null {
    return propertyStore.get(id) || null
  }
  
  // Notification system (simplified)
  private static notifyAdmin(type: string, property: PropertyData) {
    console.log(`🔔 ADMIN NOTIFICATION: ${type}`)
    console.log(`   Property: ${property.title}`)
    console.log(`   Broker: ${property.brokerName}`)
    console.log(`   Status: ${property.status}`)
  }
  
  private static notifyBroker(brokerId: string, type: string, property: PropertyData, newStatus?: string) {
    console.log(`🔔 BROKER NOTIFICATION (${brokerId}): ${type}`)
    console.log(`   Property: ${property.title}`)
    if (newStatus) {
      console.log(`   New Status: ${newStatus}`)
    }
    if (property.rejectionReason) {
      console.log(`   Reason: ${property.rejectionReason}`)
    }
  }
}

// Export for API usage
export { propertyStore }
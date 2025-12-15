# Ethiopia Home Broker App - API Documentation

## Authentication

All admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+251911234567",
  "password": "securepassword",
  "role": "user", // optional: "user", "broker", "admin"
  "whatsappNumber": "+251911234567" // optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "phone": "+251911234567",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "phone": "+251911234567",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "phone": "+251911234567",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

## Property Endpoints

### GET /properties
Get all approved properties with optional search and filtering.

**Query Parameters:**
- `search` - Search in title, city, area
- `type` - Property type filter
- `city` - City filter
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `bedrooms` - Minimum bedrooms filter
- `bathrooms` - Minimum bathrooms filter

**Response:**
```json
{
  "properties": [
    {
      "id": "property-123",
      "title": "Modern House in Bole",
      "description": "Beautiful 3 bedroom house",
      "price": 8500000,
      "currency": "ETB",
      "city": "Addis Ababa",
      "area": "Bole",
      "type": "house_sale",
      "bedrooms": 3,
      "bathrooms": 2,
      "size": 180,
      "features": ["Garden", "Parking"],
      "status": "approved",
      "images": ["/uploads/image1.jpg"],
      "whatsapp_number": "+251911234567",
      "phone_number": "+251911234567",
      "owner_name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /properties
Create a new property listing (requires authentication).

**Request Body:**
```json
{
  "title": "Modern House in Bole",
  "description": "Beautiful 3 bedroom house",
  "price": 8500000,
  "currency": "ETB",
  "city": "Addis Ababa",
  "area": "Bole",
  "type": "house_sale",
  "bedrooms": 3,
  "bathrooms": 2,
  "size": 180,
  "features": ["Garden", "Parking"],
  "whatsappNumber": "+251911234567",
  "phoneNumber": "+251911234567",
  "images": ["/uploads/image1.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "property": {
    "id": "property-123",
    "status": "pending_payment"
  },
  "payment": {
    "id": "payment-123",
    "amount": 50,
    "paymentType": "sale_listing",
    "bankAccountPlaceholder": "BANK_ACCOUNT_PLACEHOLDER",
    "whatsappContactPlaceholder": "WHATSAPP_CONTACT_PLACEHOLDER"
  }
}
```

### GET /properties/[id]
Get specific property details.

**Response:**
```json
{
  "property": {
    "id": "property-123",
    "title": "Modern House in Bole",
    // ... full property details
  }
}
```

## Payment Endpoints

### GET /payments
Get user payments or payment by property ID (requires authentication).

**Query Parameters:**
- `propertyId` - Get payment for specific property

**Response:**
```json
{
  "payment": {
    "id": "payment-123",
    "amount": 50,
    "status": "pending",
    "property_id": "property-123"
  },
  "instructions": {
    "amount": 50,
    "currency": "ETB",
    "bankAccount": "BANK_ACCOUNT_PLACEHOLDER",
    "whatsappContact": "WHATSAPP_CONTACT_PLACEHOLDER",
    "instructions": {
      "en": ["Transfer 50 ETB to...", "Send confirmation..."],
      "am": ["50 ብር ያስተላልፉ...", "ማረጋገጫ ይላኩ..."]
    }
  }
}
```

## Favorites Endpoints

### GET /favorites
Get user's favorite properties (requires authentication).

**Response:**
```json
{
  "favorites": [
    {
      "id": "property-123",
      "title": "Modern House in Bole",
      // ... property details
      "favorited_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /favorites
Add or remove property from favorites (requires authentication).

**Request Body:**
```json
{
  "propertyId": "property-123",
  "action": "add" // or "remove"
}
```

## Admin Endpoints

All admin endpoints require admin role authentication.

### GET /admin/dashboard
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "overview": {
    "totalUsers": 150,
    "totalProperties": 75,
    "totalRevenue": 2500,
    "pendingPayments": 5,
    "pendingProperties": 3
  },
  "userStats": {
    "admin": 2,
    "broker": 8,
    "user": 140
  },
  "propertyStats": {
    "approved": { "count": 45, "avgPrice": 5500000 },
    "pending": { "count": 10, "avgPrice": 4200000 }
  },
  "paymentStats": {
    "confirmed": { "count": 50, "totalAmount": 2500 },
    "pending": { "count": 5, "totalAmount": 250 }
  },
  "recentActivity": {
    "newUsers": 12,
    "newProperties": 8,
    "newPayments": 6
  }
}
```

### GET /admin/users
Get all users with optional filtering.

**Query Parameters:**
- `role` - Filter by user role
- `search` - Search in name and phone

**Response:**
```json
{
  "users": [
    {
      "id": "user-123",
      "name": "John Doe",
      "phone": "+251911234567",
      "whatsapp_number": "+251911234567",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "admin": 2,
    "broker": 8,
    "user": 140
  }
}
```

### POST /admin/users
Create a new user (admin only).

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "+251922345678",
  "whatsappNumber": "+251922345678",
  "role": "broker",
  "password": "temporarypassword"
}
```

### PATCH /admin/users
Update user information (admin only).

**Request Body:**
```json
{
  "userId": "user-123",
  "name": "Updated Name",
  "phone": "+251911234567",
  "whatsappNumber": "+251911234567",
  "role": "broker"
}
```

### DELETE /admin/users
Delete a user (admin only).

**Query Parameters:**
- `userId` - ID of user to delete

### GET /admin/properties
Get all properties with admin view.

**Response:**
```json
{
  "properties": [
    {
      "id": "property-123",
      "title": "Modern House in Bole",
      "status": "pending_payment",
      "owner_name": "John Doe",
      // ... full property details including all statuses
    }
  ]
}
```

### PATCH /admin/properties
Update property status (admin/broker only).

**Request Body:**
```json
{
  "propertyId": "property-123",
  "status": "approved"
}
```

### GET /admin/payments
Get all pending payments for admin review.

**Response:**
```json
{
  "payments": [
    {
      "id": "payment-123",
      "amount": 50,
      "payment_type": "sale_listing",
      "status": "pending",
      "property_title": "Modern House in Bole",
      "user_name": "John Doe",
      "user_phone": "+251911234567",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /admin/payments
Approve or reject payment (admin only).

**Request Body:**
```json
{
  "paymentId": "payment-123",
  "action": "confirm", // or "reject"
  "notes": "Payment verified via bank statement"
}
```

### GET /admin/logs
Get admin activity logs.

**Query Parameters:**
- `adminId` - Filter by specific admin
- `limit` - Number of logs to return (default: 100)

**Response:**
```json
{
  "logs": [
    {
      "id": "log-123",
      "admin_name": "System Admin",
      "action": "payment_confirmed",
      "target_type": "payment",
      "target_id": "payment-123",
      "details": "Payment confirmed for property...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Security Notes

1. All passwords are hashed using bcrypt
2. JWT tokens expire after 7 days
3. Admin actions are logged for audit trail
4. Input validation is performed on all endpoints
5. SQL injection protection via prepared statements
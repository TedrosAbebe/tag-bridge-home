# Ethiopia Home Broker App

A modern, mobile-friendly property broker application designed specifically for Ethiopia. This app enables users to buy, sell, and rent properties with integrated WhatsApp communication and broker approval workflows.

## 🇪🇹 Features

### Core Functionality
- **User Registration & Login** - Phone number-based authentication
- **Property Listings** - Houses for sale/rent, apartments, and land
- **Broker Dashboard** - Approve/reject listings, manage property status
- **WhatsApp Integration** - Direct communication with brokers
- **Search & Filters** - Location, price range, bedrooms, bathrooms
- **Favorites System** - Save and manage favorite properties
- **Multi-language Support** - English and Amharic (አማርኛ)

### Ethiopian-Specific Features
- **Local Cities** - Addis Ababa, Adama, Hawassa, Bahir Dar, Mekelle, etc.
- **Ethiopian Color Theme** - Green, yellow, red color scheme
- **Low Digital Literacy Design** - Simple, intuitive interface
- **WhatsApp-First Communication** - Familiar messaging platform
- **ETB Currency Support** - Ethiopian Birr pricing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ethiopia-home-broker
```

2. Install dependencies (this will automatically run setup):
```bash
npm install
```

3. Configure your environment:
   - Edit `.env.local` file created during setup
   - Replace `WHATSAPP_CONTACT_PLACEHOLDER` with your WhatsApp business number
   - Replace `BANK_ACCOUNT_PLACEHOLDER` with your bank account details
   - Update `JWT_SECRET` with a secure random string
   - Set `ADMIN_PASSWORD` to your custom admin password (default: MySecurePassword2024!)

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Accounts

**Admin Account:**
- **Name**: Tedaye Erasu
- **Email**: tedayeerasu@gmail.com
- **Password**: Set via `ADMIN_PASSWORD` environment variable (default: MySecurePassword2024!)
- **Phone**: +251991856292
- **Role**: Admin

**Admin Login Process:**
1. Go to `/admin/login` (separate admin login page)
2. Enter email: tedayeerasu@gmail.com
3. Enter your password
4. Receive 6-digit OTP code via email
5. Enter OTP code to complete login
6. Automatic redirect to `/admin` dashboard
7. Full admin access with all management capabilities

**User/Broker Login Process:**
1. Go to `/login` (phone-based login for users and brokers)
2. Enter phone number + password
3. Brokers redirect to `/broker` dashboard
4. Regular users stay on home page `/`

### Manual Setup (if needed)
If automatic setup doesn't work, run:
```bash
npm run setup
```

## 🏗️ Project Structure

```
ethiopia-home-broker/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.tsx   # Main navigation component
│   │   └── PropertyCard.tsx # Property listing card
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── LanguageContext.tsx # Multi-language support
│   ├── types/              # TypeScript type definitions
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json
```

## 🎨 Design System

### Colors
- **Ethiopian Green**: `#009639` - Primary actions, success states
- **Ethiopian Yellow**: `#FFCD00` - Highlights, warnings
- **Ethiopian Red**: `#DA020E` - Errors, sold properties
- **Ethiopian Blue**: `#0F4C75` - Secondary actions, info

### Typography
- **English**: Inter font family
- **Amharic**: Noto Sans Ethiopic font family

## 📱 Mobile-First Design

The app is designed with mobile users in mind:
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Bottom navigation for mobile
- Optimized for low-bandwidth connections
- Simple, clear visual hierarchy

## 🌐 Multi-Language Support

The app supports both English and Amharic:
- Dynamic language switching
- Localized property types and locations
- Right-to-left text support for Amharic
- Cultural considerations in UI/UX

## 🔧 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Heroicons
- **State Management**: React Context
- **Authentication**: JWT with bcrypt password hashing
- **Admin System**: Comprehensive dashboard with logging

## 🚧 Development Roadmap

### Phase 1 (Current)
- [x] Basic UI components
- [x] Authentication system
- [x] Property listing display
- [x] Multi-language support
- [x] Responsive design

### Phase 2 (Next)
- [ ] Property detail pages
- [ ] Add listing functionality
- [ ] Broker dashboard
- [ ] Search and filtering
- [ ] Favorites system

### Phase 3 (Future)
- [ ] WhatsApp API integration
- [ ] Image upload system
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Payment integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Ethiopian flag colors and cultural considerations
- Noto Sans Ethiopic font for Amharic support
- Local real estate market research
- Community feedback and testing

---

**Built with ❤️ for Ethiopia** 🇪🇹

## 💳 Payment System

### Listing Fees
- **Rent Listings**: 25 ETB
- **Sale Listings**: 50 ETB

### Payment Workflow
1. User creates a property listing
2. System automatically sets status to 'Pending Payment'
3. User receives payment instructions with:
   - Bank account placeholder: `BANK_ACCOUNT_PLACEHOLDER`
   - WhatsApp contact placeholder: `WHATSAPP_CONTACT_PLACEHOLDER`
   - Unique payment ID for reference
4. User transfers money and sends confirmation via WhatsApp
5. Admin verifies payment and approves listing
6. Property status changes to 'Approved' and becomes visible

### Configuration Placeholders
Replace these placeholders in your production environment:
- `WHATSAPP_CONTACT_PLACEHOLDER` - Your WhatsApp business number
- `BANK_ACCOUNT_PLACEHOLDER` - Your bank account details

## 🗄️ Database Schema

The app uses SQLite with the following main tables:
- **users** - User accounts (buyers, sellers, brokers, admins)
- **properties** - Property listings with location and details
- **payments** - Payment records and status tracking
- **favorites** - User favorite properties
- **property_images** - Property photo management
- **whatsapp_confirmations** - WhatsApp payment confirmations

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Properties
- `GET /api/properties` - List approved properties (with search/filter)
- `POST /api/properties` - Create new property listing
- `GET /api/properties/[id]` - Get property details

### Payments
- `GET /api/payments` - Get user payments or payment by property
- `POST /api/admin/payments` - Admin approve/reject payments
- `GET /api/admin/payments` - Get pending payments (admin only)

### Admin
- `GET /api/admin/properties` - Get all properties (admin/broker only)
- `PATCH /api/admin/properties` - Update property status

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add/remove favorites

## 🛠️ Development Notes

### Database Initialization
The database is automatically initialized on first run with:
- Required tables and indexes
- Default system settings (listing fees, placeholders)
- Default admin account

### File Structure
```
lib/
├── database.ts     # SQLite database operations
├── auth.ts         # Authentication utilities
└── payment.ts      # Payment processing logic

app/api/            # Next.js API routes
├── auth/           # Authentication endpoints
├── properties/     # Property management
├── payments/       # Payment processing
├── admin/          # Admin-only endpoints
└── favorites/      # Favorites management
```

### Environment Variables
Create a `.env.local` file for production:
```
JWT_SECRET=your-secure-jwt-secret-key
WHATSAPP_API_TOKEN=your-whatsapp-business-api-token
BANK_ACCOUNT_INFO=your-bank-account-details
```

## 🛡️ Admin System Features

### Comprehensive Dashboard
- **Overview Statistics**: Total users, properties, revenue, pending items
- **User Management**: View, create, edit, delete users and manage roles
- **Property Management**: Approve/reject listings, change status, delete properties
- **Payment Processing**: Review and approve/reject payment confirmations
- **Activity Logging**: Complete audit trail of all admin actions
- **Search & Filtering**: Advanced filtering across all data types

### Admin Capabilities
- **User Administration**: Full CRUD operations on user accounts
- **Property Oversight**: Complete control over property listings and status
- **Payment Verification**: Manual review and approval of WhatsApp payment confirmations
- **Role Management**: Assign admin, broker, or user roles
- **Audit Trail**: All admin actions are logged with timestamps and IP addresses

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Different permission levels for admin, broker, user
- **Admin Logging**: Complete audit trail of administrative actions
- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Protection**: Prepared statements for database security

## 📊 Database Schema

### Core Tables
- **users**: User accounts with roles and authentication
- **properties**: Property listings with full details and status tracking
- **payments**: Payment records with status and admin notes
- **property_images**: Image management for properties
- **favorites**: User favorite properties
- **whatsapp_confirmations**: WhatsApp payment confirmation tracking
- **admin_logs**: Complete audit trail of admin actions
- **system_settings**: Configurable system parameters

### Relationships
- Users → Properties (one-to-many)
- Properties → Payments (one-to-one)
- Properties → Images (one-to-many)
- Users → Favorites → Properties (many-to-many)
- Payments → WhatsApp Confirmations (one-to-many)

## 🚀 Production Deployment

### Environment Variables
Create a production `.env.local` file:
```bash
# Security
JWT_SECRET=your-super-secure-random-string-here

# WhatsApp Business Integration
WHATSAPP_CONTACT_PLACEHOLDER=+251911XXXXXX

# Bank Account Details
BANK_ACCOUNT_PLACEHOLDER="Your Bank Name - Account: XXXXXXXXXX"

# Database
DATABASE_URL=./data/broker.db

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Change default admin password
- [ ] Update JWT_SECRET to a secure random string
- [ ] Replace all placeholder values
- [ ] Enable HTTPS in production
- [ ] Set up proper backup for SQLite database
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging

### Backup Strategy
```bash
# Backup SQLite database
cp data/broker.db data/backup-$(date +%Y%m%d).db

# Backup uploaded images
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz public/uploads/
```

## 📱 Mobile App Considerations

The current web app is mobile-responsive, but for native mobile apps:
- API endpoints are ready for mobile consumption
- JWT authentication works with mobile apps
- Image upload endpoints can be extended for mobile
- WhatsApp integration works seamlessly on mobile

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially admin functions)
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow Next.js best practices
- Maintain responsive design
- Add proper error handling
- Include admin logging for sensitive operations

## 📞 Support

For technical support or questions:
- Check the API documentation in `API_DOCUMENTATION.md`
- Review the database schema in `lib/database.ts`
- Examine admin logging in `lib/admin-logger.ts`

---

**Built with ❤️ for Ethiopia** 🇪🇹

*A complete property broker solution with enterprise-grade admin capabilities*
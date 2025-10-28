# 🛍️ Market Mosaic - Premium E-Commerce Platform

A modern, full-featured e-commerce application built with Next.js, TypeScript, Supabase, and Stripe.

## 🌟 Overview



## ✨ Key Features

### 🛒 For Customers

#### Shopping Experience
- **Browse Products** - Beautiful product catalog with categories
- **Advanced Search** - Smart search functionality with filters
- **Product Details** - Detailed product pages with images, descriptions, specifications
- **Ratings & Reviews** - Customer reviews and star ratings
- **AI Recommendations** - Personalized product recommendations based on browsing history
- **Wishlist** - Save favorite products for later
- **Shopping Cart** - Add multiple items and manage quantities
- **Secure Checkout** - Stripe payment integration for secure transactions

#### Account Management
- **User Accounts** - Create and manage user profiles
- **Order History** - View all past orders with details
- **Live Order Tracking** - Real-time package tracking with auto-updates
  - Automatic tracking updates every 5 minutes
  - Direct links to carrier websites (FedEx, UPS, DHL, USPS)
  - Visual timeline showing order progress
- **Returns & Refunds** - Request returns for delivered orders
- **Account Settings** - Profile management, shipping addresses
- **Push Notifications** - Get notified about order updates

#### Security & Authentication
- **Multi-Factor Authentication** - Secure 2FA support
- **OAuth Login** - Sign in with Google or GitHub
- **Session Management** - Secure session handling
- **Password Reset** - Forgot password functionality

### 👨‍💼 For Administrators

#### Dashboard
- **Analytics** - Sales metrics, revenue tracking, customer insights
- **Order Management** - View, process, and track all orders
- **Product Management** - Add, edit, manage product inventory
- **Stock Management** - Track and update product stock levels
- **Campaign Management** - Create and manage marketing campaigns
- **Customer Management** - View customer details and order history
- **Review Management** - Moderate product reviews
- **Reports** - Generate sales and inventory reports

#### Order Tracking
- **Update Tracking** - Add tracking numbers and carrier information
- **Automated Updates** - Automatic tracking sync with carriers
- **Order Timeline** - Visual order progress tracking
- **Customer Communication** - Email notifications to customers

### 🚚 Live Order Tracking System

#### Automated Tracking
- **Automatic Updates** - Fetches tracking from carriers automatically
- **Live Status** - Real-time package location and status
- **Multi-Carrier Support** - FedEx, UPS, DHL, USPS integration
- **Visual Timeline** - See order progress from shipping to delivery
- **Auto-Refresh** - Updates every 5 minutes for in-transit orders
- **Carrier Links** - Direct links to carrier tracking pages

#### Tracking Features
- ✅ Order Placed → Processing → Shipped → Out for Delivery → Delivered
- ✅ Real-time location updates
- ✅ Estimated delivery dates
- ✅ Carrier identification and badges
- ✅ Tracking history with timestamps
- ✅ Mobile-friendly tracking interface

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **React Google Maps** - Live location tracking
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)
- **Stripe** - Payment processing
- **Resend** - Email delivery
- **Push API** - Browser notifications

### Key Libraries
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **React Query** - Data fetching
- **i18next** - Internationalization

## 📱 Responsive Design

### Mobile-First Approach
- **Fully Responsive** - Works perfectly on all devices
- **Mobile Navigation** - Slide-out menu for mobile
- **Touch-Friendly** - Optimized for touch interactions
- **Fast Loading** - Optimized performance on mobile
- **PWA Ready** - Progressive Web App support

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Features

### User Features
- ✅ Product browsing and search
- ✅ Product categories and filtering
- ✅ Shopping cart and wishlist
- ✅ Secure checkout with Stripe
- ✅ User authentication (Email, Google, GitHub)
- ✅ User profiles and account settings
- ✅ Order history and tracking
- ✅ Returns and refunds
- ✅ Product reviews and ratings
- ✅ AI-powered product recommendations
- ✅ Live order tracking with auto-updates
- ✅ Multi-language support (English, Spanish, French)
- ✅ Push notifications
- ✅ 2FA security

### Admin Features
- ✅ Dashboard with analytics
- ✅ Product management (CRUD operations)
- ✅ Order management and processing
- ✅ Customer management
- ✅ Inventory and stock tracking
- ✅ Campaign management
- ✅ Review moderation
- ✅ Sales reports
- ✅ Automated order tracking
- ✅ Tracking number management

### Developer Features
- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Modular component architecture
- ✅ API routes for backend logic
- ✅ Environment variable management
- ✅ Database migrations
- ✅ Comprehensive error handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project
cd ecommerce-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your credentials to .env.local
# - Supabase URL and keys
# - Stripe keys
# - Carrier API credentials (for tracking)

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Environment Variables

See `.env.local` for required configuration:
- Supabase credentials
- Stripe API keys
- Google Maps API key
- Unsplash API key
- Carrier API credentials
- Email service configuration

## 📁 Project Structure

```
ecommerce-app/
├── app/                    # Next.js App Router pages
│   ├── account/           # User account pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── products/          # Product pages
│   └── search/            # Search page
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── ui/                # UI components (shadcn)
│   └── *.tsx              # Feature components
├── lib/                   # Utility functions
├── public/                # Static assets
├── scripts/               # Database scripts
└── supabase/              # Supabase config

```

## 🎯 Key Differentiators

### 1. **Live Automated Tracking**
- Automatic carrier API integration
- Real-time package updates
- No manual admin intervention needed
- Direct links to FedEx, UPS, DHL, USPS

### 2. **AI-Powered Recommendations**
- Personalized product suggestions
- Based on browsing and purchase history
- Machine learning-powered

### 3. **Multi-Carrier Shipping**
- Support for multiple carriers
- Automatic carrier detection from tracking numbers
- Real-time shipping cost calculation

### 4. **Comprehensive Admin Panel**
- Complete dashboard with analytics
- Inventory management
- Campaign management
- Customer insights

### 5. **Security First**
- 2FA authentication
- Row Level Security (RLS) in database
- Secure payment processing
- OAuth login options

## 🧪 Testing

### Test Orders
- Create test orders with Stripe test mode
- Test all payment flows
- Verify tracking updates

### Test Tracking
- Use mock tracking numbers for testing
- Real carrier APIs for production
- Automated testing with Jest

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **SEO Optimized**: Meta tags, structured data
- **Image Optimization**: Next.js Image component

## 🔒 Security

- **Authentication**: Supabase Auth
- **Payments**: PCI-compliant Stripe
- **Database**: Row Level Security (RLS)
- **HTTPS**: Required in production
- **Environment Variables**: Secure credential management
- **2FA**: Multi-factor authentication support

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
- Railway
- Render
- DigitalOcean
- AWS

## 📝 Documentation

- `HOW_TO_TRACK_ORDERS.md` - Order tracking guide
- `AUTOMATED_TRACKING_SETUP.md` - Setup automated tracking
- `CARRIER_API_SETUP.md` - Carrier API configuration
- `README.md` - This file

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the Market Mosaic team

## 🙏 Acknowledgments

- shadcn for beautiful UI components
- Supabase for backend infrastructure
- Stripe for payment processing
- All carrier APIs (FedEx, UPS, DHL, USPS)
- Next.js team for the amazing framework

---

**Market Mosaic** - Your trusted online marketplace 🛍️


# Wajba - AI-Powered Food Delivery Platform

**A comprehensive multi-role food delivery application for iOS with intelligent AI recommendations**

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-orange.svg)](https://openai.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [AI Integration](#ai-integration)
- [Project Structure](#project-structure)
- [API Services](#api-services)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Wajba** is an all-in-one iOS food delivery application built with React Native, connecting customers, restaurant partners, delivery riders, and administrators in a seamless ecosystem. The platform is enhanced with AI-powered recommendations using OpenAI's GPT-4o-mini model, providing personalized dish suggestions and business insights.

### Key Highlights

- 🤖 **AI-Powered Recommendations** - Smart dish suggestions based on user preferences, dietary needs, and context
- 👥 **Multi-Role Architecture** - Separate dashboards for Customers, Partners, Riders, and Admins
- ⚡ **Real-Time Updates** - Live order tracking and notifications via Supabase subscriptions
- 🌐 **Bilingual Support** - English and Arabic with RTL (Right-to-Left) support
- 📊 **Business Intelligence** - AI-driven insights for restaurant partners
- 🔒 **Secure & Scalable** - Cloud-based architecture with role-based access control

---

## ✨ Features

### 🛍️ Customer Features

- **Browse & Discover**
  - Browse 50+ restaurants with real-time availability
  - AI-powered chat for personalized dish recommendations
  - Filter by cuisine, price, dietary needs (vegetarian, halal, etc.)

- **Smart Ordering**
  - Add items to cart with customizable add-ons
  - Multiple payment options: Card, Cash on Delivery, BenefitPay (simulated)
  - Real-time order tracking from preparation to delivery

- **Order Management**
  - Complete order history with reorder capability
  - Live status updates via Supabase real-time channels
  - Push notifications for order milestones

### 🍽️ Restaurant Partner Features

- **Menu & Inventory Control**
  - Full CRUD operations for dishes and categories
  - Real-time menu updates reflected instantly to customers
  - Image upload and pricing management

- **Order Fulfillment**
  - Accept/reject incoming orders with validation
  - Update order status (Preparing → Ready → Picked up)
  - Real-time order notifications via Supabase subscriptions

- **Business Intelligence**
  - AI-powered insights: "Customers ordering Grilled Salmon also add Arabic Coffee 65% of the time—bundle them to increase revenue by 15%"
  - Sales analytics dashboard with revenue trends
  - Popular dish tracking and performance metrics

### 🚴 Rider Features

- **Delivery Management**
  - View available delivery orders in real-time
  - Accept delivery requests with GPS tracking integration
  - Update delivery status (Picked up → Delivered)
  - Earnings tracking per delivery
  - Availability status management (Online/Offline/Busy)

### 👨‍💼 Admin Features

- **Platform Control**
  - User management: View, filter, search, delete users
  - Restaurant management: Approve/suspend restaurants
  - Promotions management: Create platform-wide discounts
  - Analytics dashboard: Real-time revenue, orders, active users
  - Platform-wide monitoring with visual charts

### 🌐 General Platform Features

- Multi-role single app with role-based dashboards
- Secure authentication via Supabase Auth
- Cloud-based architecture (Supabase + OpenAI)
- Multi-language support: English/Arabic with RTL
- Real-time data synchronization across all users

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile framework for iOS/Android |
| **TypeScript** | Static typing for safer, maintainable code |
| **Expo** | Tooling for rapid development, testing, and packaging |
| **React Navigation** | Navigation library for multi-screen flows |
| **React Native Paper** | Material Design UI components |
| **i18next** | Localization engine for Arabic/English with RTL |
| **AsyncStorage** | Client-side storage for sessions and caching |

### Backend & Services

| Technology | Purpose |
|------------|---------|
| **Supabase** | Managed PostgreSQL with RLS, authentication, file storage, and real-time channels |
| **OpenAI API** | GPT-4o-mini for AI chat/recommendations and business insights |
| **PostgreSQL** | Relational database with rich metadata for AI inference |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Git/GitHub** | Version control and code hosting |
| **VS Code** | Code editing with TypeScript support |
| **Xcode** | iOS development and testing |
| **Expo Go** | Real-time testing on physical devices |
| **Postman** | API testing and debugging |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App (iOS)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Customer │  │ Partner  │  │  Rider   │  │  Admin   │   │
│  │Dashboard │  │Dashboard │  │Dashboard │  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                          │                                    │
│                    14+ Service Files                         │
│         (orders, restaurants, cart, payment, AI, etc.)       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │         Supabase Backend             │
        │  ┌────────────────────────────────┐  │
        │  │   PostgreSQL Database          │  │
        │  │   (10+ tables with metadata)   │  │
        │  └────────────────────────────────┘  │
        │  ┌────────────────────────────────┐  │
        │  │   Authentication (Auth)        │  │
        │  └────────────────────────────────┘  │
        │  ┌────────────────────────────────┐  │
        │  │   Real-time Subscriptions      │  │
        │  └────────────────────────────────┘  │
        │  ┌────────────────────────────────┐  │
        │  │   File Storage                 │  │
        │  └────────────────────────────────┘  │
        └──────────────┬───────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │         OpenAI API                   │
        │  ┌────────────────────────────────┐  │
        │  │   GPT-4o-mini Model            │  │
        │  │   - User recommendations       │  │
        │  │   - Partner business insights  │  │
        │  └────────────────────────────────┘  │
        └──────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → React Native UI
2. **Service Layer** → Business logic in TypeScript services
3. **Supabase Client** → API calls to backend
4. **Database Queries** → PostgreSQL with RLS (Row Level Security)
5. **Real-time Updates** → Supabase subscriptions push changes to clients
6. **AI Processing** → OpenAI API for recommendations and insights

---

## 🗄️ Database Schema

### Core Tables

#### **restaurants**
```sql
- id (UUID, PK)
- name, description, category
- cuisine_types (TEXT[]) -- e.g., ['Arabic', 'Desserts']
- price_range (VARCHAR) -- 'budget', 'mid-range', 'premium'
- ambiance (TEXT[]) -- e.g., ['romantic', 'cozy']
- dietary_options (TEXT[]) -- e.g., ['vegetarian', 'halal']
- suitable_for (TEXT[]) -- e.g., ['date-night', 'family']
- features (TEXT[]) -- e.g., ['outdoor-seating', 'wifi']
- rating, delivery_fee, min_order
- is_active, created_at, updated_at
```

#### **dishes**
```sql
- id (UUID, PK)
- restaurant_id (FK)
- name, description, price, category
- calories, preparation_time
- is_vegetarian, is_vegan, is_spicy, spice_level
- dietary_tags (TEXT[]) -- e.g., ['high-protein', 'low-calorie']
- meal_types (TEXT[]) -- e.g., ['breakfast', 'lunch', 'dinner']
- flavor_profile (TEXT[]) -- e.g., ['rich', 'creamy']
- cooking_method, health_score
- is_available, created_at, updated_at
```

#### **orders**
```sql
- id (UUID, PK)
- user_id, restaurant_id, rider_id (FKs)
- order_number, status
- subtotal, delivery_fee, discount_amount, total_amount
- payment_method, delivery_address_id
- special_instructions
- created_at, updated_at
```

#### **order_items**
```sql
- id (UUID, PK)
- order_id, dish_id (FKs)
- dish_name, quantity, unit_price, subtotal
- special_request
- created_at
```

#### **users**
```sql
- id (UUID, PK)
- email, full_name, phone
- role (customer, partner, rider, admin)
- is_active, created_at, updated_at
```

### Key Design Principles

✅ **Rich Metadata Over New Columns** - Array fields enable AI inference without schema changes  
✅ **Normalized Relationships** - Proper foreign keys and referential integrity  
✅ **Performance Indexes** - GIN indexes on array fields for fast queries  
✅ **Scalability** - Cloud-based with horizontal scaling capability  

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Xcode) or physical iOS device
- Supabase account
- OpenAI API key

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/mmahmood233/wajba.git
cd wajba
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

4. **Set up Supabase**

- Create a new Supabase project
- Run the database migrations (see `database/schema.sql`)
- Configure Row Level Security (RLS) policies
- Upload sample data (see `new data seeding/`)

5. **Start the development server**
```bash
npm start
```

6. **Run on iOS**
```bash
# Press 'i' in the terminal to open iOS simulator
# Or scan QR code with Expo Go app on physical device
```

---

## ⚙️ Configuration

### Supabase Setup

1. **Database Tables**
   - Run SQL scripts in `database/schema.sql`
   - Create tables: users, restaurants, dishes, orders, order_items, etc.

2. **Authentication**
   - Enable Email/Password authentication
   - Configure email templates
   - Set up OAuth providers (optional)

3. **Storage**
   - Create buckets for restaurant logos, dish images, etc.
   - Configure storage policies

4. **Real-time**
   - Enable real-time on `orders` table
   - Configure subscriptions for live updates

### OpenAI API

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env` file
3. Configure in `src/services/ai.service.ts`

---

## 🚀 Usage

### Running the App

```bash
# Start development server
npm start

```

### Testing Different Roles

The app has 4 user roles. Use these test accounts:

**Customer:**
- Email: `m7md@gmail.com`
- Password: `12345678*`

**Restaurant Partner:**
- Email: `kfc@wajba.bh`
- Password: `12345678`

**Rider:**
- Email: `ali@wajba.bh`
- Password: `12345678`

**Admin:**
- Email: `admin@wajba.bh`
- Password: `12345678`

---

## 🤖 AI Integration

### AI Recommendation System

The AI system uses OpenAI's GPT-4o-mini model with a comprehensive knowledge base to provide:

#### For Customers:
- Personalized dish recommendations based on:
  - Dietary preferences (vegetarian, vegan, halal, etc.)
  - Mood and context ("I want something spicy but healthy")
  - Time of day (breakfast, lunch, dinner)
  - Budget constraints
  - Previous order history

#### For Partners:
- Business insights and recommendations:
  - "Customers ordering Grilled Salmon also add Arabic Coffee 65% of the time—bundle them to increase revenue by 15%"
  - Popular dish trends
  - Optimal pricing strategies
  - Menu optimization suggestions

### How It Works

1. **Knowledge Base** (`src/services/ai-knowledge-base.ts`)
   - Comprehensive cuisine characteristics
   - Smart inference rules for database fields
   - Contextual awareness (time, social situations, mood)
   - Query interpretation patterns

2. **AI Service** (`src/services/ai.service.ts`)
   - Constructs dynamic system prompts with real-time data
   - Fetches restaurants and dishes from database
   - Applies universal relevance filtering
   - Returns structured recommendations with visual cards

3. **Filtering Logic**
   - Restaurant cards only shown when explicitly requested
   - Dish cards match AI text exactly (no extra items)
   - Budget detection and filtering
   - Dietary restriction enforcement

---

## 📁 Project Structure

```
wajba/
├── src/
│   ├── components/          # Reusable UI components
│   ├── navigation/          # Navigation configuration
│   ├── screens/            # Screen components
│   │   ├── user/           # Customer screens
│   │   ├── partner/        # Restaurant partner screens
│   │   ├── rider/          # Rider screens
│   │   └── admin/          # Admin screens
│   ├── services/           # Business logic & API calls
│   │   ├── ai.service.ts              # AI recommendations
│   │   ├── ai-knowledge-base.ts       # AI knowledge base
│   │   ├── orders.service.ts          # Order management
│   │   ├── restaurants.service.ts     # Restaurant data
│   │   ├── cart.service.ts            # Shopping cart
│   │   ├── payment.service.ts         # Payment processing
│   │   ├── partner-orders.service.ts  # Partner order mgmt
│   │   ├── admin-analytics.service.ts # Admin analytics
│   │   ├── partnerAI.service.ts       # Partner AI insights
│   │   └── ... (14+ service files)
│   ├── lib/                # Utilities and configurations
│   │   └── supabase.ts     # Supabase client
│   ├── types/              # TypeScript type definitions
│   └── constants/          # App constants
├── assets/                 # Images, fonts, icons
├── new data seeding/       # Database seed scripts
├── database/               # SQL schemas and migrations
├── .env                    # Environment variables
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

---

## 🔧 API Services

### Core Services

| Service | File | Purpose |
|---------|------|---------|
| **AI Service** | `ai.service.ts` | OpenAI integration, recommendations, filtering |
| **AI Knowledge Base** | `ai-knowledge-base.ts` | Comprehensive AI knowledge and inference rules |
| **Orders** | `orders.service.ts` | Order lifecycle management, real-time tracking |
| **Restaurants** | `restaurants.service.ts` | Restaurant discovery and data retrieval |
| **Cart** | `cart.service.ts` | Shopping cart with AsyncStorage |
| **Payment** | `payment.service.ts` | Payment method management |
| **Partner Orders** | `partner-orders.service.ts` | Restaurant order management |
| **Admin Analytics** | `admin-analytics.service.ts` | Platform analytics and statistics |
| **Partner AI** | `partnerAI.service.ts` | AI business intelligence for partners |
| **Delivery** | `delivery.service.ts` | Rider delivery management |
| **Auth** | `auth.service.ts` | Authentication and user management |
| **Reviews** | `reviews.service.ts` | Rating and review system |
| **Promotions** | `promotions.service.ts` | Discount and promotion management |
| **Notifications** | `notification.service.ts` | Push notification handling |

---

## 🎨 Design Methodology

### Development Approach
- **Agile Iterative Development** with continuous testing and refinement

### UML Diagrams Used

1. **Use Case Diagram**
   - 4 actors: Customer, Partner, Rider, Admin
   - Key use cases: Browse restaurants, AI recommendations, Place order, Manage menu, Track delivery, View analytics

2. **Entity-Relationship (ER) Diagram**
   - Database schema with 10+ tables
   - Rich metadata fields for AI inference
   - Normalized relationships

3. **Sequence Diagrams**
   - Order placement flow (Customer → Restaurant → Rider)
   - AI recommendation flow (User query → OpenAI → Filtered results)
   - Real-time order tracking (Supabase subscriptions)

4. **System Architecture Diagram**
   - Client-server architecture
   - React Native ↔ Supabase ↔ OpenAI API
   - Real-time data synchronization

### Design Principles
- Modular service architecture (14+ service files)
- Role-based access control (RBAC)
- Real-time synchronization via Supabase
- Type-safe development (TypeScript)
- Rich metadata for AI inference

---

## 🌍 Bahraini Perspectives & LESPI

### Legal Issues
- Compliance with **Bahrain Data Protection Law (2018)**
- Secure data encryption and access controls
- User consent for AI-generated content
- No unauthorized data sharing with third parties

### Ethical Issues
- Transparency in AI recommendations (no bias)
- Culturally appropriate content (halal, dietary respect)
- Fair treatment of all stakeholders
- Privacy-first design with user control

### Social Issues
- Builds trust in AI through transparency
- Respects Bahraini cultural and dietary preferences
- Strong onboarding for diverse user base
- Accommodates linguistic diversity (Arabic/English RTL)

### Professional Issues
- Follows ACM Code of Ethics and IEEE Code of Conduct
- Complete documentation and version control
- Communication processes for team collaboration
- Accountability and respect in all interactions

---

## 🔮 Future Work

### Features Not Implemented (With Rationale)

**1. Multi-Platform Support**
- **Missing:** Android app, Progressive Web App (PWA)
- **Why:** Limited development timeline (one semester) - prioritized iOS to deliver a fully functional single-platform solution
- **Future:** Android development, PWA for web browsers

**2. Live Payment Gateway**
- **Missing:** Full BenefitPay/Stripe integration
- **Why:** Requires merchant accounts and regulatory approval - simulated for demo
- **Future:** Complete BenefitPay integration for Bahrain market

**3. Advanced GPS Routing**
- **Missing:** Real-time GPS tracking with route optimization
- **Why:** Complex algorithms require more research - basic tracking sufficient for MVP
- **Future:** Advanced route optimization for riders

**4. IoT Integration**
- **Missing:** Smart delivery solutions, temperature monitoring
- **Why:** Hardware requirements beyond project scope
- **Future:** IoT tracking hardware for food quality assurance

### Planned Enhancements

- Advanced AI features (voice commands, image-based food search)
- Regional expansion to GCC countries
- Cloud kitchen partnerships
- Subscription and loyalty programs
- Blockchain for secure transactions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer:** Mohammed Mahmood  
**Institution:** Bahrain Polytechnic  
**Course:** Senior Project (Semester 7)  
**Year:** 2024-2025

---

## 📞 Contact

For questions or support, please contact:
- GitHub: [@mmahmood233](https://github.com/mmahmood233)

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o-mini API
- **Supabase** for backend infrastructure
- **React Native** community for excellent documentation
- **Bahrain Polytechnic** for project guidance and support

---

**Built with ❤️ in Bahrain**

⭐ Star this repo if you find it helpful!



# KILO Dashboard

A Next.js application for managing and visualizing ʻāina (land) data through sensor monitoring, community observations, and AI-powered insights.

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js 20+
- npm, yarn, or pnpm
- Git
- PostgreSQL database (local or hosted)

### 🏃‍♂️ Development

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Open http://localhost:3000
```

## 🏗️ Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with app router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS 4** - Modern CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & Database
- **PostgreSQL** - Primary database with migrations
- **Kysely** - Type-safe SQL query builder
- **Custom Authentication** - Session-based auth with cookies
- **Database Migrations** - Version-controlled schema management

### State Management & Data
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Performant form handling
- **Zod** - Runtime type validation
- **Axios** - HTTP client for API calls

### AI & Analytics
- **OpenAI API** - AI-powered insights and analysis
- **Recharts** - Data visualization and charting
- **Custom LLM Services** - Aina-specific AI interactions

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages and API
│   ├── api/               # Backend API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── data/         # Sensor data APIs
│   │   ├── kilo/         # Community observation APIs
│   │   └── llm/          # AI/LLM endpoints
│   ├── dashboard/        # Main dashboard pages
│   │   ├── sensors/      # Sensor monitoring
│   │   ├── kilo/         # Community observations
│   │   ├── profile/      # User profile management
│   │   └── chat/         # AI chat interface
│   └── register/         # User registration flow
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard UI components
│   ├── sensors/          # Sensor data visualization
│   ├── kilo/             # Community observation forms
│   ├── llm/              # AI chat components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
│   ├── auth/             # Authentication utilities
│   ├── legacy/           # Legacy API integrations
│   └── types.ts          # TypeScript definitions
└── providers/            # React context providers

db/
├── kysely/               # Database client configuration
├── migrations/           # SQL migration files
└── generated.d.ts        # Auto-generated types

data/
└── openapi-spec.yaml     # API specification for Custom GPT
```

## 🌱 Key Features

### Land Stewardship Dashboard
- **Sensor Monitoring**: Real-time environmental data tracking
- **Visual Analytics**: Charts and graphs for sensor data trends

### Community Observations (KILO)
- **Observation Logging**: Community-driven land observations
- **Temporal Tracking**: Timestamped observation history
- **User Authentication**: Secure access per ʻāina steward

### AI-Powered Insights (Future)
- **LLM Integration**: AI analysis of land data
- **Chat Interface**: Interactive AI conversations about ʻāina
- **Data Correlation**: AI-powered insights from sensor trends

### Authentication & Profiles
- **Custom Auth System**: Session-based authentication
- **Aina Association**: Users linked to specific land parcels
- **Profile Management**: User preferences and settings

## 🗄️ Database Architecture

The application uses PostgreSQL with a well-structured schema:

- **Users & Authentication**: `user`, `usersession`, `profile` tables
- **Land Management**: `aina` (land parcels), `mala` (sub-areas)
- **Sensor Data**: `sensor`, `metric`, `metric_type` tables
- **Community Data**: `kilo` (observations), `ag_test_files` (sample tests)

## 🔧 Development Tools

```bash
# Type-safe database operations
npm run kysely:generate

# Linting and code quality
npm run lint

# Production build
npm run build

# Production server
npm run start
```

## 🌐 API Integration

The dashboard integrates with external APIs:
- **Sensor Data APIs**: Real-time environmental monitoring
- **Local LLM Services**: AI-powered land analysis
- **Custom Backend**: Legacy system integration

## 🤝 Contributing

1. Check **[Contributing Guidelines](CONTRIBUTING.md)** for code standards
2. Create a feature branch from `dev`
3. Make your changes with proper TypeScript types
4. Test thoroughly including mobile responsiveness
5. Submit a pull request with clear description
6. Update **[Changelog](CHANGELOG.md)**

## 📚 Documentation
Refer to the `/docs` directory for more in-depth information regarding system architecture, database schema, and more.

## 🔐 Environment Setup

Ensure you have these environment variables:
```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```
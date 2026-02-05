# Clam Packed Delivery

## Overview

Clam Packed Delivery is a mobile-first logistics application serving the San Juan Islands. It provides two core services:

1. **Grocery Delivery** - Users order from partner stores (Trader Joe's, Safeway, Hela Provisions, etc.), and the service handles shopping, ferry transport, and island delivery
2. **Water Taxi** - Inter-island transportation booking with local captains, serving as an alternative when ferries are disrupted

The app targets island residents who want to save time by avoiding ferry trips for mainland shopping.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses Expo Router for file-based navigation with typed routes
- React Native Reanimated for smooth animations and gestures
- TanStack React Query for server state management

**Navigation Structure**:
- `/` - Home screen with island map and service selection
- `/delivery/*` - Multi-step delivery flow (island selection → calendar → store → order → confirmation)
- `/taxi/*` - Water taxi booking flow (route selection → available rides → booking → confirmation)

**UI Approach**:
- Custom component library in `/components/ui/` (Button, Card, Header, etc.)
- SVG-based interactive island map (`IslandMap.tsx`)
- Haptic feedback on native platforms
- Custom fonts: Lato (body), Caveat (display)

**State Management**:
- `AppContext` provides global state for service mode, selected island, order details, and ride details
- Local component state for form inputs and UI interactions

### Backend Architecture

**Framework**: Express.js with TypeScript
- Runs on port 5000
- CORS configured for Replit domains and localhost development
- Static file serving for production builds

**Database**: PostgreSQL with Drizzle ORM
- Schema defined in `/shared/schema.ts`
- Currently has a basic users table structure
- Migrations stored in `/migrations/`

**Current State**: Backend is minimal - most data is mocked in `/lib/mockData.ts`. The infrastructure is ready for real API endpoints.

### Build System

**Development**:
- `expo:dev` - Runs Expo development server with Replit proxy configuration
- `server:dev` - Runs Express server with tsx

**Production**:
- `expo:static:build` - Custom build script for static web export
- `server:build` - Bundles server with esbuild
- `server:prod` - Runs production server

## External Dependencies

### Third-Party Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| PostgreSQL | Database | `DATABASE_URL` environment variable |
| Expo | Mobile development platform | `app.json` configuration |

### Key NPM Packages

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `drizzle-orm` | Database ORM |
| `@tanstack/react-query` | Server state management |
| `react-native-reanimated` | Animations |
| `expo-haptics` | Native haptic feedback |
| `expo-document-picker` | PDF/file uploads for orders |

### Partner Store Integrations (Mock)

The app supports different order flows per store:
- **PDF Upload**: Trader Joe's (user uploads shopping list)
- **Pickup Code**: Safeway (user provides pickup confirmation)
- **Automatic**: Hela Provisions (integrated checkout)
- **Order Note**: CHEF'STORE
- **Call Order**: CHS Farm & Home
- **Drop Point**: Azure Standard
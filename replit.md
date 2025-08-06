# Luova B2B Marketplace

## Overview

Luova is a multilingual B2B marketplace platform designed for construction materials, furniture, and equipment trading. The application connects buyers and sellers in a professional marketplace environment with comprehensive product management, inquiry systems, and user role-based access control. Built with modern web technologies, it supports six languages (English, Russian, German, Arabic, Urdu, and Hindi) and features a responsive design optimized for both desktop and mobile experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing with role-based route protection
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management, React Context for global UI state
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Internationalization**: Custom context-based i18n system supporting 6 languages with RTL support

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database Layer**: Drizzle ORM with PostgreSQL using Neon serverless driver
- **Authentication**: Replit's OpenID Connect (OIDC) integration with Passport.js
- **Session Management**: Express sessions with PostgreSQL store for persistence
- **API Design**: RESTful endpoints with role-based access control and comprehensive error handling

### Database Design
- **User Management**: Role-based system (buyer/seller/admin) with profile management
- **Product Catalog**: Categories with multilingual support, product specifications, and inventory tracking
- **Business Logic**: Favorites system, inquiry management, and seller-buyer communication
- **Session Storage**: Dedicated sessions table for authentication persistence

### Authentication & Authorization
- **Provider**: Replit OIDC for seamless platform integration
- **Session Management**: Secure HTTP-only cookies with PostgreSQL session store
- **Role-Based Access**: Three-tier system (buyer, seller, admin) with route and API protection
- **User Onboarding**: Role selection flow for new users with profile completion

### Data Architecture
- **ORM**: Drizzle ORM providing type-safe database operations with automatic migration support
- **Schema**: Shared TypeScript schemas between client and server using Zod for validation
- **Relationships**: Properly normalized database with foreign key constraints and indexes
- **Internationalization**: JSONB fields for multilingual content storage

## External Dependencies

### Database & Storage
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### Authentication Services
- **Replit OIDC**: Identity provider integration for user authentication
- **Passport.js**: Authentication middleware with OpenID Connect strategy

### UI & Development
- **Shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Data fetching and caching library for API state management

### Build & Development Tools
- **Vite**: Build tool with hot module replacement and optimized production builds
- **TypeScript**: Type system for enhanced development experience and runtime safety
- **ESBuild**: Fast bundler for server-side code compilation

### Validation & Forms
- **Zod**: Schema validation library for type-safe data validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation
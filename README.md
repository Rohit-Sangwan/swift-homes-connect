
# Service Provider Marketplace

A marketplace platform connecting customers with local service providers.

## Project Overview

This application enables:
- Users to find and connect with service providers in their area
- Service providers to create profiles and get discovered
- Administrators to manage the platform and users

## Key Features

- **Location-based service provider discovery**
- **Service provider profiles and applications**
- **User authentication and accounts**
- **Admin dashboard for platform management**
- **Real-time location detection using Mapbox**

## Technology Stack

This project is built with:
- **React** - Frontend library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI components 
- **Supabase** - Backend as a Service (Auth, Database)
- **Mapbox** - Location and map services

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── profile/        # User profile components
│   └── ui/             # shadcn UI components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions and helpers
├── pages/              # Page components for routing
└── App.tsx             # Main application component
```

## Database Structure

The application uses Supabase as its backend with the following main tables:

- **service_providers** - Contains service provider profiles with the following fields:
  - id (uuid) - Primary key
  - user_id (uuid) - Foreign key to auth.users
  - name (text) - Provider's name
  - phone (text) - Contact number
  - address (text) - Physical address
  - city (text) - City location
  - service_category (text) - Type of service offered
  - experience (text) - Years of experience
  - price_range (text) - Service price range
  - about (text) - Provider description
  - profile_image_url (text, optional) - Profile image
  - id_proof_url (text, optional) - Verification document
  - status (text) - 'pending', 'approved', or 'rejected'
  - created_at (timestamp) - Record creation time
  - updated_at (timestamp) - Record update time

## Admin Panel

The admin panel provides comprehensive platform management capabilities:

1. **Service Provider Management**
   - Review and approve/reject provider applications
   - View all providers with filtering options

2. **User Management**
   - View and manage user accounts
   - Control user access and permissions

3. **Analytics & Insights**
   - View platform metrics and statistics
   - Monitor user activity and engagement

4. **Content Management**
   - Manage service categories
   - Configure featured providers

5. **System Settings**
   - Configure platform behavior
   - Manage API integrations and keys

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase credentials
4. Set up Mapbox API key
5. Run development server: `npm run dev`

## Environment Setup

For the application to work correctly, you need to configure:

1. Supabase URL and API key (automatically configured via Lovable)
2. Mapbox API key (for location services)
   - You can add this through the app interface in Settings

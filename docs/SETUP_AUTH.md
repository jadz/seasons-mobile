# Authentication Setup Guide

## Overview
This authentication system uses Supabase Auth with email magic links, following the established architecture standards with domain-driven design.

## Database Setup

1. **Apply the new migration:**
   ```bash
   npx supabase db reset
   ```
   This will create the `user_profiles` table and set up the necessary triggers.

## How It Works

### Architecture
- **Domain Models**: `domain/models/` - Core user and auth types
- **Services**: `services/auth/AuthService.ts` - Business logic for authentication
- **Repository**: `db/repositories/UserRepository.ts` - Data access for user profiles
- **Store**: `store/auth/` - Legend State for auth state management
- **Hooks**: `hooks/auth/` - React hooks for auth functionality
- **Components**: `components/auth/` - Sign-in and onboarding forms

### Flow
1. User enters email → Magic link sent
2. User clicks magic link → Authenticated
3. If new user → Onboarding (collect first name)
4. If existing user → Home screen

### Key Features
- ✅ Email magic link authentication
- ✅ Automatic user profile creation
- ✅ Onboarding flow for new users
- ✅ Offline-first architecture ready
- ✅ Row Level Security (RLS) enabled
- ✅ Clean separation of concerns
- ✅ TypeScript throughout

## Testing

1. **Start Supabase:**
   ```bash
   npx supabase start
   ```

2. **Start the app:**
   ```bash
   npm start
   ```

3. **Test the flow:**
   - Enter an email address
   - Check the Supabase Inbucket (http://127.0.0.1:54324) for the magic link
   - Click the magic link to authenticate
   - Complete onboarding if it's a new user

## Environment Configuration

For production, update the Supabase configuration in `utils/supabase.ts` with your production URL and anon key.

## Architecture Compliance

This implementation strictly follows the architecture standards:
- Domain-driven directory structure
- Repository pattern with clear interfaces
- Service layer for business logic
- Legend State for state management
- Custom hooks for component integration
- TypeScript throughout with proper typing
- Error handling and validation
- Clean separation of concerns

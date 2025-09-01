# Environment Setup Guide

The Supabase client now supports dynamic configuration based on the current environment context. Here's how to set up your environment variables for each context:

## Environment Detection

The system automatically detects the environment based on:

- **Test Environment**: `NODE_ENV === 'test'` or `JEST_WORKER_ID` is defined
- **Local Development**: `NODE_ENV === 'development'` or `EXPO_PUBLIC_ENV === 'local'`
- **Production**: Default fallback

## Required Environment Variables

### Local Development (.env.local)

Create a `.env.local` file in your project root with:

```bash
# Local Supabase instance (usually Docker or local server)
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_KEY=your_local_anon_key_here

# Set development environment flag
EXPO_PUBLIC_ENV=local
```

### Test Environment (.env.test)

Create a `.env.test` file in your project root with:

```bash
# Test Supabase instance (usually a dedicated test database)
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_KEY=your_test_anon_key_here

# Jest will automatically set NODE_ENV=test
```

### Production (.env or deployment config)

Set your production variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_production_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_production_anon_key
```

## Configuration Differences by Environment

### Test Environment
- **Auth Storage**: Disabled (no session persistence)
- **Auto Refresh**: Disabled
- **Session Persistence**: Disabled
- **URL Detection**: Disabled

### Local Development
- **Auth Storage**: AsyncStorage (full functionality)
- **Auto Refresh**: Enabled
- **Session Persistence**: Enabled
- **URL Detection**: Disabled

### Production
- **Auth Storage**: AsyncStorage (full functionality)
- **Auto Refresh**: Enabled
- **Session Persistence**: Enabled
- **URL Detection**: Disabled

## Testing the Setup

The updated `supabase.ts` file exports utility functions for testing:

```typescript
import { isTestEnvironment, isLocalDevelopment, getEnvironmentConfig } from './utils/supabase';

// Check current environment
console.log('Is Test Environment:', isTestEnvironment());
console.log('Is Local Development:', isLocalDevelopment());
console.log('Current Config:', getEnvironmentConfig());
```

## Error Handling

If environment variables are missing, the client will throw a descriptive error indicating which environment configuration is incomplete.

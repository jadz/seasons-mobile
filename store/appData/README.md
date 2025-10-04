# App Data Provider - Reference Data Prefetching Pattern

## Overview

The `AppDataProvider` orchestrates prefetching of system-wide reference data (areas of focus, exercises, training templates, etc.) that needs to be available throughout the app. This pattern provides:

- ✅ **Single source of truth** - Reference data loaded once and cached
- ✅ **No duplicate fetches** - Components access cached data via stores
- ✅ **Simple scalability** - Easy to add new reference data types
- ✅ **Consistent patterns** - Follows existing store architecture
- ✅ **Testability** - Each store can be tested independently

## Architecture

```
app/_layout.tsx
  └── AuthProvider
      └── AppDataProvider (prefetches all reference data)
          ├── seasonFocusStore.loadPillarsWithAreas()
          ├── exerciseStore.loadExercises()        // Add when ready
          └── templateStore.loadTemplates()        // Add when ready
```

## Current Implementation

### 1. Season Focus Store
**Location:** `store/seasonFocus/seasonFocusStore.ts`

```typescript
// Prefetched at app startup
seasonFocusStore.loadPillarsWithAreas()

// Accessed in components via hook
const { pillars, isLoading, error } = useSeasonFocus()
```

**Data loaded:** Pillars with their areas of focus (system-controlled reference data)

## Adding New Reference Data (e.g., Exercises)

### Step 1: Create the Store

Create `store/exercise/exerciseStore.ts` following the same pattern:

```typescript
import { observable } from '@legendapp/state';
import { ExerciseService } from '../../domain/services/ExerciseService';
import { Exercise } from '../../domain/models/exercise';

interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  setExercises: (exercises: Exercise[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  loadExercises: () => Promise<void>;
  getExercises: () => Exercise[];
}

const createInitialState = () => ({
  exercises: [],
  isLoading: false,
  isInitialized: false,
  error: null,
});

let exerciseService = new ExerciseService(exerciseRepository);

export const exerciseStore = observable<ExerciseState>({
  ...createInitialState(),

  setExercises: (exercises: Exercise[]) => {
    exerciseStore.exercises.set(exercises);
    exerciseStore.isInitialized.set(true);
  },

  setLoading: (loading: boolean) => {
    exerciseStore.isLoading.set(loading);
  },

  setError: (error: string | null) => {
    exerciseStore.error.set(error);
  },

  reset: () => {
    const initialState = createInitialState();
    exerciseStore.exercises.set(initialState.exercises);
    exerciseStore.isLoading.set(initialState.isLoading);
    exerciseStore.isInitialized.set(initialState.isInitialized);
    exerciseStore.error.set(initialState.error);
  },

  loadExercises: async () => {
    if (exerciseStore.isInitialized.get()) {
      console.log('[ExerciseStore] Data already loaded, skipping fetch');
      return;
    }

    try {
      exerciseStore.setLoading(true);
      exerciseStore.setError(null);
      
      console.log('[ExerciseStore] Fetching exercises...');
      const exercises = await exerciseService.getAllExercises();
      
      exerciseStore.setExercises(exercises);
      console.log(`[ExerciseStore] Loaded ${exercises.length} exercises`);
    } catch (error) {
      console.error('[ExerciseStore] Error loading exercises:', error);
      exerciseStore.setError('Failed to load exercises');
      exerciseStore.setExercises([]);
    } finally {
      exerciseStore.setLoading(false);
      exerciseStore.isInitialized.set(true);
    }
  },

  getExercises: () => {
    return exerciseStore.exercises.get();
  },
});
```

### Step 2: Add to AppDataProvider

Update `store/appData/AppDataProvider.tsx`:

```typescript
import { exerciseStore } from '../exercise/exerciseStore';

// In the useEffect:
await Promise.all([
  seasonFocusStore.loadPillarsWithAreas(),
  exerciseStore.loadExercises(),        // Add this
]);
```

### Step 3: Create the Hook

Create `hooks/exercise/useExercises.ts`:

```typescript
import { useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { exerciseStore } from '../../store/exercise/exerciseStore';

export const useExercises = () => {
  const exercises = useSelector(exerciseStore.exercises);
  const isLoading = useSelector(exerciseStore.isLoading);
  const error = useSelector(exerciseStore.error);
  const isInitialized = useSelector(exerciseStore.isInitialized);

  // Lazy load fallback
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      exerciseStore.loadExercises();
    }
  }, [isInitialized, isLoading]);

  return {
    exercises,
    isLoading,
    error,
  };
};
```

### Step 4: Use in Components

```typescript
import { useExercises } from '../../hooks/exercise/useExercises';

export default function ExerciseSelectionScreen() {
  const { exercises, isLoading, error } = useExercises();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => <ExerciseCard exercise={item} />}
    />
  );
}
```

## Adding Offline Support (Optional)

For larger datasets like exercises, you can add AsyncStorage caching:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'exercises_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

loadExercises: async () => {
  if (exerciseStore.isInitialized.get()) {
    return;
  }

  try {
    exerciseStore.setLoading(true);
    
    // Try cache first
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < CACHE_DURATION;
      
      if (isFresh) {
        console.log('[ExerciseStore] Using cached data');
        exerciseStore.setExercises(data);
        exerciseStore.setLoading(false);
        return;
      }
    }
    
    // Fetch fresh data
    const exercises = await exerciseService.getAllExercises();
    exerciseStore.setExercises(exercises);
    
    // Update cache
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
      data: exercises,
      timestamp: Date.now(),
    }));
    
  } catch (error) {
    console.error('[ExerciseStore] Error:', error);
    exerciseStore.setError('Failed to load exercises');
  } finally {
    exerciseStore.setLoading(false);
    exerciseStore.isInitialized.set(true);
  }
}
```

## Testing

Test stores independently with dependency injection:

```typescript
// __tests__/store/exercise/exerciseStore.test.ts
describe('ExerciseStore', () => {
  let mockExerciseService: jest.Mocked<ExerciseService>;

  beforeEach(() => {
    exerciseStore.reset();
    mockExerciseService = {
      getAllExercises: jest.fn(),
    };
    exerciseStore._setService(mockExerciseService);
  });

  it('should load exercises successfully', async () => {
    const mockExercises = [{ id: '1', name: 'Squat' }];
    mockExerciseService.getAllExercises.mockResolvedValue(mockExercises);

    await exerciseStore.loadExercises();

    expect(exerciseStore.exercises.get()).toEqual(mockExercises);
    expect(exerciseStore.isInitialized.get()).toBe(true);
  });
});
```

## Best Practices

1. **System-controlled data only** - Use this pattern for reference data that doesn't change frequently (exercises, areas of focus, etc.), not for user-specific data

2. **Lazy initialization** - Stores check `isInitialized` before fetching to prevent duplicate requests

3. **Error handling** - Each store maintains its own error state, allowing the app to continue even if one prefetch fails

4. **Testing** - All stores support dependency injection via `_setService()` for testability

5. **Performance** - For large datasets (>1000 items), consider:
   - Pagination in the UI
   - AsyncStorage caching
   - Selective loading (e.g., only load active exercises)

6. **Cache invalidation** - For data that changes occasionally, add a manual refresh method:
   ```typescript
   refresh: async () => {
     exerciseStore.isInitialized.set(false);
     await exerciseStore.loadExercises();
   }
   ```

## Summary

✅ **Store pattern** - Each reference data type gets its own observable store  
✅ **AppDataProvider** - Orchestrates prefetching at app startup  
✅ **Custom hooks** - Simple interface for components to access cached data  
✅ **Lazy loading** - Fallback for edge cases where prefetch didn't complete  
✅ **Testable** - Dependency injection for all services  
✅ **Scalable** - Easy to add new reference data types


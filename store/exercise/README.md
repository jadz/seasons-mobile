# Exercise Store

## Overview
Manages exercise reference data loaded from `data/exercises_v1.0.json`. This is read-only system data that provides the exercise library for the app.

## Architecture

Follows the same pattern as other reference data stores:

```
AppDataProvider → exerciseStore → ExerciseService → ExerciseRepository → JSON File
```

### Layers

1. **Domain Model** (`domain/models/exercise.ts`)
   - Defines the `Exercise` interface
   - Transforms snake_case JSON to camelCase domain model

2. **Repository** (`db/repositories/ExerciseRepository.ts`)
   - Implements `IExerciseRepository` interface
   - Loads and caches exercises from JSON file
   - Provides query methods (by ID, muscle group, equipment)

3. **Service** (`domain/services/ExerciseService.ts`)
   - Business logic layer
   - Provides search and filtering capabilities
   - Aggregation methods (get all muscle groups, equipment categories)

4. **Store** (`store/exercise/exerciseStore.ts`)
   - Legend-state observable store
   - Manages loading state and errors
   - Single prefetch at app startup via `AppDataProvider`

## Usage

### Loading (Automatic)
Exercises are automatically loaded when the app starts via `AppDataProvider`:

```typescript
// Already configured in AppDataProvider.tsx
await exerciseStore.loadExercises();
```

### Accessing Exercises in Components

```typescript
import { exerciseStore } from '@/store/exercise';
import { useObservable } from '@legendapp/state/react';

// Get all exercises
const exercises = useObservable(exerciseStore.exercises);

// Get specific exercise
const exercise = exerciseStore.getExerciseById('00251201');

// Check loading state
const isLoading = useObservable(exerciseStore.isLoading);
```

### Using the Service Directly (if needed)

```typescript
import { ExerciseService } from '@/domain/services/ExerciseService';
import { exerciseRepository } from '@/db/repositories/ExerciseRepository';

const exerciseService = new ExerciseService(exerciseRepository);

// Search by name
const results = await exerciseService.searchExercisesByName('bench press');

// Get by muscle group
const chestExercises = await exerciseService.getExercisesByMuscleGroup('chest');

// Get equipment categories
const equipment = await exerciseService.getAllEquipmentCategories();
```

## Data Structure

```typescript
interface Exercise {
  id: string;              // e.g., "00251201"
  name: string;            // e.g., "Bench Press (Barbell)"
  primaryMuscleGroup: string;  // e.g., "chest"
  otherMuscles: string[];      // e.g., ["triceps", "shoulders"]
  equipmentCategory: string;   // e.g., "barbell"
  videoUrl: string;            // e.g., "00251201-Barbell-Bench-Press_Chest.mp4"
  thumbnailImage: string;      // e.g., "00251201-Barbell-Bench-Press_Chest_thumbnail@3x.jpg"
  steps: string[];             // Array of instruction steps
}
```

## Performance

- ✅ JSON loaded **once** at app startup
- ✅ Cached in memory for fast access
- ✅ ~1000 exercises load in <100ms
- ✅ No database queries needed
- ✅ Parallel loading with other reference data

## Testing

The service is designed with dependency injection for easy testing:

```typescript
// Mock the repository
const mockRepository: IExerciseRepository = {
  getAllExercises: jest.fn().mockResolvedValue([...]),
  // ... other methods
};

const service = new ExerciseService(mockRepository);
```


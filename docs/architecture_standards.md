# Architecture Standards & Development Guidelines

This document outlines the architectural standards, patterns, and conventions used throughout the codebase. These standards ensure consistency, maintainability, and adherence to clean architecture principles.

---

## 1. Directory Structure & Organization

### Domain-Driven Directory Structure

All code organization follows domain-driven design principles with clear separation of concerns:

```
├── app/                          # Expo Router screens grouped by domain
│   ├── (season)/                 # Season creation and management
│   ├── (workout)/                # Workout execution screens
│   ├── (training_phase)/         # Training phase configuration
│   └── (tabs)/                   # Main navigation tabs
├── components/                   # UI components grouped by domain
│   ├── workout/                  # Workout-specific components
│   ├── season/                   # Season management components
│   ├── training/                 # Training configuration components
│   └── ui/                       # Generic/reusable UI components
├── domain/                       # Core domain models and business logic
│   ├── models/                   # Core domain entities
│   ├── views/                    # View/DTO types for data hydration
│   ├── mappers/                  # Data transformation utilities
│   └── services/                 # Business logic services
│       ├── auth/                 # Authentication domain services
│       ├── workout/              # Workout domain services
│       └── preferences/          # User preference services
├── db/                          # Data layer and persistence
│   ├── repositories/             # Repository pattern implementations
├── hooks/                       # Custom React hooks
│   └── workout/                  # Domain-specific hooks
└── store/                       # State management (legend-state)
    └── workout/                  # Domain-specific stores
```

### Component Organization Standards

#### Hierarchical Component Structure
Components are organized in a hierarchical manner reflecting their scope and reusability:

```
components/
├── ui/                          # Generic, reusable components
│   ├── IconSymbol.tsx           # Icon components
│   ├── ScreenHeader.tsx         # Layout components
│   └── ProgressDots.tsx         # UI patterns
├── {domain}/                    # Domain-specific components
│   ├── main/                    # Primary domain components
│   │   ├── {component-name}/    # Complex components get their own directory
│   │   │   ├── Component.tsx    # Main component file
│   │   │   ├── Component.styles.ts  # Separated styles
│   │   │   └── index.ts         # Clean exports
│   │   └── SimpleComponent.tsx  # Simple components in single files
│   └── {subdomain}/             # Domain subdivisions (e.g., advanced/, form/)
```

#### Component File Conventions
- **Main Component**: `ComponentName.tsx`
- **Styles**: `ComponentName.styles.ts` (separate file for complex components)
- **Index**: `index.ts` for clean imports
- **Tests**: `ComponentName.test.tsx` (co-located with component)

---

## 2. React Native & Expo Standards

### Component Patterns

#### Functional Components with Hooks
Always use functional components with React hooks:

```typescript
// ✅ Good
export const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  return (
    <Text style={[{ color }, styles.default, style]} {...rest} />
  );
};

// ❌ Avoid class components
class ThemedText extends React.Component { ... }
```

#### Props Interface Definition
Always define props interfaces with clear TypeScript types:

```typescript
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};
```

### Styling Standards

#### StyleSheet Usage
Use React Native's `StyleSheet.create()` for all component styles:

```typescript
// ✅ Preferred - Separate styles file
// components/ComponentName.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
  },
  // ... more styles
});

// ✅ Acceptable - Inline for simple components
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#fff',
  },
});
```

#### Theme Integration
Use custom hooks for theme-aware styling:

```typescript
const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
```

---

## 3. Domain Model Standards

### Core Domain Types

Define core domain entities as plain TypeScript interfaces in `domain/models/`:

```typescript
// domain/models/exercise.ts
export interface Exercise {
  id: string;
  name: string;
  mechanic?: string;
  equipment: string;
  primaryMuscle: string;
  secondaryMuscle?: string;
  type: ExerciseType;
  source: ExerciseSource;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Domain Model Principles
1. **Single Responsibility**: Each model represents one core business entity
2. **Immutable**: Models are data structures, not behavior containers
3. **Typed**: All properties have explicit TypeScript types
4. **Consistent**: Standard fields (`id`, `createdAt`, `updatedAt`) across entities
5. **Self-Contained**: Core models contain only their own data + foreign key IDs

### View Types for Data Hydration

Define view/DTO types in `domain/views/` for data presentation with relationships:

```typescript
// domain/views/phaseDayAssignmentViews.ts
export type PhaseDayAssignmentWithPhase = PhaseDayAssignment & { 
  phase: TrainingPhase 
};

export type PhaseDayAssignmentFull = PhaseDayAssignment & { 
  phase: TrainingPhase; 
  routine: Routine 
};
```

---

## 4. Repository Pattern Standards

### Repository Interface Definition

Each repository defines its own interfaces, with views being stored @domain/views. 

```typescript
// SetLogRepository.ts
export interface ISetLogRepository {
  // Basic CRUD operations
  create(setLogData: SetLogData): Promise<string>;
  findById(setLogId: string): Promise<SetLogView | null>;
  update(setLogId: string, updateData: Partial<SetLogData>): Promise<void>;
  delete(setLogId: string): Promise<void>;

  // Query operations for WorkoutSetService
  findByWorkoutSession(workoutSessionId: string): Promise<SetLogView[]>;
  findByExerciseInSession(workoutSessionId: string, exerciseId: string): Promise<SetLogView[]>;
  
  // Validation operations
  getLastCompletedSetInSession(workoutSessionId: string, exerciseId: string): Promise<SetLogView | null>;
}

export interface SetLogData {
  exerciseId: string;
  workoutSessionId: string;
  setNumber: number;
  actualReps: number;
  actualWeight: number;
  // ... other fields
}

// Stored in domain/views
export interface SetLogView {
  id: string;
  exerciseId: string;
  // ... set log data fields
  exercise?: {
    id: string;
    name: string;
    equipment: string;
  };
}
```

### Repository Method Naming Conventions

Repository methods follow consistent naming that aligns with return types:

| Method Pattern | Return Type | Description |
|----------------|-------------|-------------|
| `create` | `string` (ID) | Create new entity, return generated ID |
| `findById` | `EntityView \| null` | Single entity with optional joins |
| `findBy{Criteria}` | `EntityView[]` | Collection queries with filtering |
| `findSpecific{Context}` | `EntityView \| null` | Specific queries with multiple criteria |
| `update` | `void` | Update existing entity |
| `delete` | `void` | Delete entity |
| `get{Count/Aggregate}` | `number` or computed type | Aggregation queries |

### Repository Type Patterns

Each repository follows consistent type naming:

```typescript
// Repository interface
export interface IEntityRepository {
  // Methods...
}

// Data type for creation/updates (no ID, timestamps)
export interface EntityData {
  // Core fields only
}

// View type for queries (includes ID, timestamps, optional joins)
export interface EntityView {
  id: string;
  createdAt: Date;
  // ... other fields
  relatedEntity?: {
    // Joined data when needed
  };
}

// Update type for partial updates
export interface UpdateEntityData {
  // Partial<EntityData> with specific fields
}
```

### Repository Implementation Standards

1. **Co-located Interfaces**: Repository interfaces and data models are defined in the same file as the implementation
2. **Single Responsibility**: Each repository manages one aggregate root
3. **Data vs View Types**: Separate `Data` types for creation/updates and `View` types for queries with joins
4. **Domain Type Imports**: Import domain types from `domain/models/` when needed (e.g., `SetType`, `SetPerformance`)
5. **Singleton Export**: Export repository instances as singletons for dependency injection into services
6. **Private Mapping**: Use private mapping methods to transform database results to domain objects
7. **Interface-based Design**: Always define interfaces to enable mocking for service tests

---

## 5. Service Layer Standards

### Service Architecture

Services are located in `domain/services/` and contain business logic, coordinating between repositories within their domain. **All services must be designed for testability through dependency injection and should avoid static methods.**

```typescript
export class UserPreferencesService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly preferencesRepository: IUserPreferencesRepository
  ) {}

  /**
   * Get user preferences. Returns default preferences if none exist.
   */
  async getUserPreferences(): Promise<UserPreferences> {
    // Business logic implementation using injected dependencies
  }

  /**
   * Update user preferences. Creates new preferences if none exist.
   */
  async updateUserPreferences(updates: UserPreferencesUpdate): Promise<UserPreferences> {
    // Business logic with validation and coordination
  }
}

// ❌ Avoid static methods - they make testing difficult
export class BadUserPreferencesService {
  static async getUserPreferences(): Promise<UserPreferences> {
    // Hard to test - cannot mock dependencies
  }
}
```

#### Service Design Principles

1. **Dependency Injection**: Constructor injection for all dependencies to enable testing
1. **Avoid Static Methods**: Use instance methods to allow for proper mocking and testing
1. **Clear Contracts**: Explicit input/output types and comprehensive documentation
1. **Error Handling**: Meaningful error messages and proper error propagation
1. **Immutability**: Never mutate input parameters, return new objects
1. **Single Transaction**: Each service method represents one business operation
1. **Repository Coordination**: Services orchestrate multiple repository calls

### Testability Standards

Services must be designed with testability as a primary concern:

```typescript
// ✅ Good - Testable service with dependency injection
export class PhaseAssignmentService {
  constructor(
    private readonly phaseDayAssignmentRepository: IPhaseDayAssignmentRepository,
    private readonly trainingPhaseRepository: ITrainingPhaseRepository
  ) {}

  async rescheduleAssignment(
    assignmentId: string,
    newDate: Date
  ): Promise<PhaseDayAssignmentFull> {
    // 1. Load core entity
    const original = await this.phaseDayAssignmentRepository.findById(assignmentId);
    if (!original) {
      throw new Error(`Assignment ${assignmentId} not found`);
    }
    
    // 2. Immutable update
    const updated = { ...original, assignedDate: newDate, updatedAt: new Date() };
    
    // 3. Persist
    await this.phaseDayAssignmentRepository.update(assignmentId, updated);
    
    // 4. Return fresh view
    return await this.getAssignmentView(assignmentId);
  }

  async getAssignmentView(id: string): Promise<PhaseDayAssignmentFull | null> {
    return await this.phaseDayAssignmentRepository.findFullById(id);
  }
}

// ❌ Bad - Static methods make testing difficult
export class BadPhaseAssignmentService {
  static async rescheduleAssignment(assignmentId: string, newDate: Date): Promise<PhaseDayAssignmentFull> {
    // Cannot mock repositories, hard to test error conditions
    const repo = new PhaseDayAssignmentRepository(); // Hard dependency
    // ... implementation
  }
}
```

#### Testability Guidelines

1. **Constructor Injection**: All dependencies injected through constructor
2. **Interface Dependencies**: Depend on interfaces, not concrete implementations  
3. **No Static Methods**: Avoid static methods that prevent dependency injection
4. **No Hard Dependencies**: Never instantiate dependencies directly within methods
5. **Integration-Friendly**: Design services to work well with integration tests using real database instances
6. **Deterministic Methods**: Methods should be predictable and not rely on hidden state
7. **Selective Mocking**: Mock external APIs and complex dependencies, but prefer integration tests for database operations

### Command/Query Separation

#### Commands (Mutations)
Commands should modify state and be implemented as instance methods for testability:

```typescript
export class WorkoutSessionService {
  constructor(
    private readonly workoutSessionRepository: IWorkoutSessionRepository,
    private readonly setLogRepository: ISetLogRepository
  ) {}

  async completeWorkoutSession(sessionId: string): Promise<WorkoutSessionView> {
    // Testable command with injected dependencies
    const session = await this.workoutSessionRepository.findById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updatedSession = { 
      ...session, 
      completedAt: new Date(),
      status: 'completed' as const
    };

    await this.workoutSessionRepository.update(sessionId, updatedSession);
    return await this.workoutSessionRepository.findById(sessionId);
  }
}
```

#### Queries (Reads)
Queries should be side-effect free and easily testable:

```typescript
export class WorkoutSessionService {
  async getSessionWithSets(sessionId: string): Promise<WorkoutSessionWithSets | null> {
    // Pure query operation - easily testable
    return await this.workoutSessionRepository.findWithSets(sessionId);
  }
}
```

---

## 6. State Management Standards

### Legend State

Use legend-state for React state management with clear separation of concerns:

```typescript
interface WorkoutState {
  // State properties
  exercises: ExerciseForRoutine[];
  workoutSessionId: string | null;
  loadedSessionId: string | null;
  
  // Actions
  setExercises: (exercises: ExerciseForRoutine[]) => void;
  setWorkoutSessionId: (workoutSessionId: string) => void;
  updateSet: (exerciseId: string, setIndex: number, setData: Partial<SetForExercise>) => void;
  reset: () => void;
}
```

#### Store Design Principles

1. **Domain-Specific**: One store per major domain (workout, season, preferences)
2. **Minimal State**: Only UI-relevant state, no duplicate server data
3. **Immutable Updates**: All state updates create new objects
4. **Clear Actions**: Action methods with descriptive names and typed parameters
5. **Reset Capability**: Each store provides a reset method for cleanup

### Custom Hook Integration

Combine stores with custom hooks for component-friendly APIs:

```typescript
export const useWorkoutSession = (phaseDayAssignmentId?: string) => {
  const { setExercises, setWorkoutSessionId } = useWorkoutStore();
  
  // Hook logic combining store actions with effects
  
  return {
    workoutSessionId,
    isLoading,
    exercises,
    // Computed values and action methods
  };
};
```

---

## 7. Custom Hook Standards

### Hook Organization

Custom hooks are organized by domain and complexity:

```
hooks/
├── useThemeColor.ts              # Generic utility hooks
├── useSeasonActivation.ts        # Domain-specific hooks
└── workout/                      # Complex domain hooks
    ├── useWorkoutSession.ts      # Session management
    ├── useSetLogging.ts          # Set logging logic
    └── exercise-set/             # Sub-domain hooks
        ├── useSetGestureHandling.ts
        └── useSetAdvancedLogging.ts
```

### Hook Design Patterns

#### Single Responsibility Hooks
```typescript
export const useThemeColor = (
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) => {
  const theme = useColorScheme() ?? 'light';
  return props[theme] || Colors[theme][colorName];
};
```

#### Composite Hooks
```typescript
export const useWorkoutSession = (phaseDayAssignmentId?: string) => {
  // Combine multiple concerns into a cohesive API
  const [isLoading, setIsLoading] = useState(false);
  const { setExercises, workoutSessionId } = useWorkoutStore();
  const { startTimer } = useWorkoutTimer();
  
  // Return comprehensive interface
  return {
    workoutSessionId,
    isLoading,
    initialiseSession,
    loadExercises,
    resetSession
  };
};
```

### Hook Conventions

1. **Prefix**: All hooks start with `use`
2. **Return Object**: Complex hooks return objects with named properties
3. **Effect Cleanup**: Always clean up subscriptions and timers
4. **Error Handling**: Include error states in hook return values
5. **Loading States**: Provide loading indicators for async operations

---

## 8. TypeScript Standards

### Type Definition Patterns

#### Interface vs Type
- **Interfaces**: For object shapes, especially when extensibility is needed
- **Types**: For unions, primitives, and computed types

```typescript
// ✅ Interface for extensible object shapes
export interface Exercise {
  id: string;
  name: string;
}

// ✅ Type for unions and computed types
export type ExerciseType = 'weight_reps' | 'bodyweight_reps' | 'duration';
export type ExerciseWithSets = Exercise & { sets: SetForExercise[] };
```

#### Generic Type Constraints
```typescript
// Repository base with proper constraints
export interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
}
```

### Comprehensive Type Coverage

1. **No Any Types**: Avoid `any`, use `unknown` for truly unknown data
2. **Strict Null Checks**: Handle `null` and `undefined` explicitly
3. **Discriminated Unions**: Use for type-safe state management
4. **Utility Types**: Leverage `Partial`, `Pick`, `Omit` for type composition
5. **Generic Constraints**: Use constraints to ensure type safety

---

## 9. Error Handling Standards

### Repository Error Handling

```typescript
export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}
```

### Service Error Handling

```typescript
try {
  const preferences = await this.getUserPreferences();
  return preferences.advancedLoggingEnabled;
} catch (error) {
  console.error('Error checking advanced logging status:', error);
  return false; // Sensible default
}
```

### Component Error Handling

```typescript
const [error, setError] = useState<string | null>(null);

const handleAction = async () => {
  try {
    setError(null);
    await performAction();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error occurred');
  }
};
```

---

## 10. Performance Standards

### Component Optimization

1. **React.memo**: Use for components with expensive renders
2. **useCallback**: Memoize event handlers passed to child components
3. **useMemo**: Memoize expensive computations
4. **Lazy Loading**: Use React.lazy for route-level code splitting

### Database Query Optimization

1. **Selective Loading**: Load only required fields for list views
2. **Pagination**: Implement limit/offset for large datasets
3. **Eager Loading**: Use joins for known relationship requirements
4. **Caching**: Implement appropriate caching strategies

### State Management Optimization

1. **Selective Updates**: Update only changed state slices
2. **Computed Values**: Use selectors for derived state
3. **Minimal Re-renders**: Structure state to minimize component updates

---

## 11. Testing Standards

### Test Organization

```
__tests__/
├── db/                          # Database layer tests
│   ├── repositories/
│   └── services/
├── components/                  # Component tests
├── hooks/                       # Custom hook tests
└── utils/                       # Utility function tests
```

### Test Patterns

#### Repository Testing
```typescript
describe('SetLogRepository', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('should create a new set log', async () => {
    const setData = createTestSetData();
    const setId = await repository.create(setData);
    expect(setId).toBeDefined();
  });
});
```

#### Service Testing with Integration Tests
```typescript
describe('WorkoutSessionService', () => {
  let service: WorkoutSessionService;
  let workoutSessionRepository: WorkoutSessionRepository;
  let setLogRepository: SetLogRepository;

  beforeEach(async () => {
    // Setup test database (Docker container)
    await setupTestDatabase();
    
    // Use real repository instances with test database
    workoutSessionRepository = new WorkoutSessionRepository();
    setLogRepository = new SetLogRepository();
    
    // Inject real dependencies into service
    service = new WorkoutSessionService(
      workoutSessionRepository,
      setLogRepository
    );
  });

  afterEach(async () => {
    // Clean up test data
    await cleanupTestDatabase();
  });

  it('should complete workout session with real database', async () => {
    // Arrange - Create test data in database
    const sessionData = createTestWorkoutSessionData();
    const sessionId = await workoutSessionRepository.create(sessionData);

    // Act
    const result = await service.completeWorkoutSession(sessionId);

    // Assert - Verify against real database state
    expect(result.status).toBe('completed');
    expect(result.completedAt).toBeDefined();
    
    // Verify data persistence
    const persistedSession = await workoutSessionRepository.findById(sessionId);
    expect(persistedSession?.status).toBe('completed');
  });

  it('should throw error when session not found', async () => {
    // Act & Assert - Test with non-existent ID
    await expect(service.completeWorkoutSession('non-existent-id'))
      .rejects.toThrow('Session non-existent-id not found');
  });
});

// ✅ Unit tests with mocks for external dependencies
describe('WorkoutSessionService - External API Integration', () => {
  let service: WorkoutSessionService;
  let workoutSessionRepository: WorkoutSessionRepository;
  let mockExternalApiService: jest.Mocked<IExternalApiService>;

  beforeEach(async () => {
    await setupTestDatabase();
    
    // Real database dependencies
    workoutSessionRepository = new WorkoutSessionRepository();
    
    // Mock external services that shouldn't hit real APIs in tests
    mockExternalApiService = {
      syncWorkoutData: jest.fn(),
      sendCompletionNotification: jest.fn(),
    } as jest.Mocked<IExternalApiService>;

    service = new WorkoutSessionService(
      workoutSessionRepository,
      mockExternalApiService
    );
  });

  it('should sync with external API after completion', async () => {
    // Test combines real database operations with mocked external calls
    const sessionId = await workoutSessionRepository.create(createTestWorkoutSessionData());
    
    await service.completeWorkoutSession(sessionId);
    
    expect(mockExternalApiService.syncWorkoutData).toHaveBeenCalledWith(sessionId);
  });
});

// ❌ Bad - Testing static methods is difficult
describe('BadWorkoutSessionService', () => {
  it('cannot inject dependencies for testing', () => {
    // No way to inject test database or mock external services
    // Cannot isolate unit under test
    // Cannot control test environment
  });
});
```

#### Hook Testing
```typescript
describe('useWorkoutSession', () => {
  it('should initialize session when phaseDayAssignmentId is provided', async () => {
    const { result } = renderHook(() => useWorkoutSession('test-id'));
    
    await waitFor(() => {
      expect(result.current.workoutSessionId).toBeDefined();
    });
  });
});
```

---

## 12. Documentation Standards

### Code Documentation

1. **JSDoc Comments**: For all public methods and complex logic
2. **Interface Documentation**: Clear descriptions for all interfaces
3. **README Files**: For complex modules and setup instructions
4. **Architecture Docs**: High-level system documentation

### Inline Documentation

```typescript
/**
 * Service for managing user preferences including advanced logging toggle and unit preferences
 */
export class UserPreferencesService {
  /**
   * Get user preferences. Returns default preferences if none exist.
   */
  async getUserPreferences(): Promise<UserPreferences> {
    // Implementation
  }
}
```

---

## 13. File Naming Conventions

### File Naming Standards

1. **PascalCase**: React components (`ExerciseCard.tsx`) and services (`UserPreferenceService.ts`)
2. **camelCase**: Utility functions and service instances (`userPreferenceService.ts`)
3. **kebab-case**: Route files and configuration (`exercise-card.styles.ts`)
4. **Descriptive**: Names should clearly indicate file purpose
5. **Domain Organization**: Services are organized by domain in `domain/services/{domain}/`

### Import/Export Standards

```typescript
// ✅ Named exports for utilities and services (from domain/services/)
export const userPreferenceService = new UserPreferenceService();
export { UserPreferencesService };

// ✅ Default exports for React components
export default function ExerciseCard({ ... }) { ... }

// ✅ Clean re-exports from index files
export { ExerciseCard } from './ExerciseCard';
export { SetExerciseItem } from './SetExerciseItem';
```

---

This architecture standards document should be referenced for all development work and updated as patterns evolve. Following these standards ensures consistent, maintainable, and scalable code across the entire application. 
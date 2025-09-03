/**
 * Domain models index - exports all season-related domain entities
 */

// Core entities
export * from './pillar';
export * from './areaOfFocus';
export * from './metric';
export * from './season';

// Value objects
export * from './metricGoal';

// Entities
export * from './metricProgressLog';

// Composition entities
export * from './seasonComposition';

// Existing exports (maintain compatibility)
export * from './auth';
export * from './user';
export * from './userPreferences';


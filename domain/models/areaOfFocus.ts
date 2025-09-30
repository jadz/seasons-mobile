/**
 * Domain model for Areas of Focus
 * 
 * Areas of Focus represent specific goals or activities within a pillar.
 * These can be predefined (system-provided) or user-created.
 * 
 * Examples for Health & Fitness pillar:
 * - Strength (predefined)
 * - Speed (predefined)
 * - Body Composition (predefined)
 * - Custom user goal (user-created)
 */

export interface AreaOfFocus {
  id: string;
  name: string;
  description: string | null;
  pillarId: string;
  userId: string | null; // NULL for predefined areas, user_id for user-created
  isPredefined: boolean;
  isActive: boolean;
  colorHex: string; // Hex color code for UI display (e.g., #FF6B6B)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data required to create a new area of focus
 */
export interface AreaOfFocusData {
  name: string;
  description?: string | null;
  pillarId: string;
  userId?: string | null;
  isPredefined?: boolean;
  isActive?: boolean;
  colorHex?: string;
}

/**
 * Domain model for Pillars
 * 
 * Pillars are the core life areas (system-controlled):
 * - Health & Fitness
 * - Wealth
 * - Family
 * - Head Game (mental/spiritual)
 * - Career
 */

export interface Pillar {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

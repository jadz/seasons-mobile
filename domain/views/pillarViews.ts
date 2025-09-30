import { Pillar } from '../models/pillar';
import { AreaOfFocus } from '../models/areaOfFocus';

/**
 * View type for Pillar with associated areas of focus
 */
export type PillarWithAreas = Pillar & {
  areasOfFocus?: AreaOfFocus[];
};

/**
 * View type for Pillar with count of associated areas
 */
export type PillarWithAreaCount = Pillar & {
  areaCount: number;
};

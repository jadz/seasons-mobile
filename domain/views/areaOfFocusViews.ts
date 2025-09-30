import { AreaOfFocus } from '../models/areaOfFocus';
import { Pillar } from '../models/pillar';

/**
 * View type for AreaOfFocus with its associated pillar
 */
export type AreaOfFocusWithPillar = AreaOfFocus & {
  pillar: Pillar;
};

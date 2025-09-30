-- Add color field to areas_of_focus table
-- This allows each area of focus to have a custom color for UI display

ALTER TABLE areas_of_focus 
ADD COLUMN color_hex VARCHAR(7) DEFAULT '#FF6B6B' CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$');

COMMENT ON COLUMN areas_of_focus.color_hex IS 'Hex color code for UI display (e.g., #FF6B6B)';

-- Update existing predefined areas with default colors if needed
-- These can be customized per area of focus later
UPDATE areas_of_focus 
SET color_hex = '#FF6B6B' 
WHERE color_hex IS NULL OR color_hex = '#FF6B6B';

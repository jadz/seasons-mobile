# Screen 1: Season Basics Requirements

## Objective
Capture essential season information and help users select their focus areas for their personal development season.

## Screen Layout

### Header Section
- **Title**: "Season Basics" (large, centered)
- **Subtitle**: "Step 1 of 5" (small, muted, centered)
- **Progress**: WizardDots component showing step 1/5 active

### Season Information Section
**Season Name Input:**
- Required text field with clear focus styling
- Label: "Season Name"
- Placeholder: "My Winter Transformation" 
- Character limit: 50 characters with real-time counter
- Auto-focus on screen entry
- Validation: Cannot be empty or whitespace only

**Duration Input (Optional):**
- Number input field
- Label: "Duration (optional)"
- Placeholder: "12 weeks"
- Helper text: "Leave blank for open-ended season"
- Range: 1-52 weeks
- Keyboard: Numeric input type

### Pillar Selection Section
**Header**: "Choose Your Focus Areas"
**Subtitle**: "Select the life areas you want to improve this season"

**Health & Fitness Pillar:**
- Use PillarSelectionCard component
- Pre-selected and disabled (cannot be unchecked)
- Visual indicator showing it's included by default
- Helper text: "Health & Fitness is included in every season"

**Other Pillars (selectable):**
- **Wealth**: "Financial goals, income, investments, and financial planning"
- **Family**: "Relationships, family time, and personal connections"
- **Head Game**: "Mental health, mindset, learning, and personal development"  
- **Career**: "Professional development, work goals, and career advancement"
- Use PillarSelectionCard for each with smooth selection animations
- Allow multiple selections (1-5 total including Health)

### Navigation
**Continue Button:**
- Primary button, full width
- Text: "Continue"
- Disabled until validation passes
- Positioned at bottom with proper spacing

## Validation Rules
- Season name cannot be empty or only whitespace
- Must have at least 1 pillar selected (Health is always included)
- Duration must be positive integer between 1-52 if provided
- Check for existing active season before proceeding

## Error Messages
- "Season name is required" for empty name
- "You already have an active season. Complete or cancel it first." for duplicate active seasons
- "Duration must be between 1 and 52 weeks" for invalid duration

## Success Criteria
- User enters meaningful season name
- User selects 1-5 pillars total
- Form validates successfully
- User feels excited about selections
- 95% step completion rate target

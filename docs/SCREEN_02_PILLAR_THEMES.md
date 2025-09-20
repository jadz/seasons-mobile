# Screen 2: Pillar Themes Requirements

## Objective
Help users define specific themes/intentions for each selected pillar to create focus and direction for their season.

## Screen Layout

### Header Section
- **Title**: "Define Your Focus" (large, centered)
- **Subtitle**: "Step 2 of 5" (small, muted, centered)
- **Description**: "What do you want to achieve in each area this season?"
- **Progress**: WizardDots component showing step 2/5 active

### Theme Setting Section
Display one theme input section for each pillar selected in Step 1.

**For Each Selected Pillar:**
- **Pillar Title**: Display pillar name (e.g., "Health & Fitness", "Wealth")
- **Theme Input Field**:
  - Multi-line text input (2-3 lines visible)
  - Character limit: 200 characters
  - Real-time character counter (e.g., "45/200")
  - Placeholder examples by pillar:
    - **Health**: "Build strength and establish consistent workout routine"
    - **Wealth**: "Increase savings and start investing for the future"
    - **Family**: "Spend quality time and strengthen relationships"
    - **Head Game**: "Develop mindfulness practice and learn new skills"
    - **Career**: "Advance to senior role and expand professional network"

### Visual Design
- Stack pillar sections vertically with clear separation
- Use Card component for each pillar section
- Consistent spacing and typography
- Focus states for active input fields
- Error states for validation failures

### Navigation
**Back Button:**
- Secondary button, left side
- Text: "Back"
- Returns to Step 1 with data preserved

**Continue Button:**
- Primary button, right side
- Text: "Continue"
- Disabled until all themes are valid
- Full width on mobile, paired with Back on larger screens

## Validation Rules
- All selected pillars must have non-empty themes
- Themes must be at least 10 characters long
- Maximum 200 characters per theme
- No profanity or inappropriate content (basic filter)
- Trim whitespace before validation

## Error Messages
- "Please describe your focus for [Pillar Name]" for empty themes
- "Theme should be at least 10 characters" for too short themes
- "Theme cannot exceed 200 characters" for too long themes
- Highlight incomplete fields with gentle error styling (red border, error text)

## Success Criteria
- User thoughtfully defines themes for all pillars
- Themes are specific and actionable
- User feels clear about their intentions
- 90% step completion rate target
- Average theme length: 50-150 characters

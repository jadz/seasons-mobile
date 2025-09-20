# Screen 3: Areas of Focus Requirements

## Objective
Guide users to select specific, actionable areas within each pillar to create concrete focus points for their season.

## Screen Layout

### Header Section
- **Title**: "Choose Specific Areas" (large, centered)
- **Subtitle**: "Step 3 of 5" (small, muted, centered)
- **Description**: "Select the specific areas you'll focus on within each pillar"
- **Progress**: WizardDots component showing step 3/5 active

### Area Selection Section
Display one section for each pillar selected in Step 1.

**For Each Selected Pillar:**
- **Pillar Header**: Pillar name (e.g., "Health & Fitness")
- **Theme Display**: User's theme from Step 2 in italics below header
- **Area Selection List**: Use SelectionList component with multi-select capability
- **Recommendation**: "1-4 areas per pillar recommended" helper text

### Available Areas by Pillar

**Health & Fitness:**
- Increase Strength - "Build muscle strength and power through resistance training"
- Be Consistent - "Maintain regular workout schedule and healthy habits"
- Maintain Weight - "Keep body weight within healthy range"
- Improve Endurance - "Enhance cardiovascular fitness and stamina"
- Better Nutrition - "Improve diet quality and eating habits"
- Improve Sleep - "Enhance sleep quality and consistency"

**Wealth:**
- Increase Savings - "Build emergency fund and long-term savings"
- Investment Growth - "Grow investment portfolio and passive income"
- Debt Reduction - "Pay down existing debts and improve credit"
- Income Growth - "Increase earning potential and income streams"
- Financial Education - "Learn about personal finance and investing"

**Family:**
- Quality Time - "Spend meaningful time with family members"
- Communication - "Improve family communication and understanding"
- Shared Activities - "Create memorable experiences together"
- Support & Care - "Provide emotional and practical support"

**Head Game:**
- Continuous Learning - "Develop new skills and knowledge"
- Mindfulness Practice - "Develop meditation and mindfulness habits"
- Mental Health - "Improve emotional wellbeing and resilience"
- Skill Development - "Master specific personal or professional skills"

**Career:**
- Skill Development - "Enhance professional capabilities"
- Network Building - "Expand professional connections and relationships"
- Leadership Growth - "Develop leadership and management skills"
- Work-Life Balance - "Improve balance between work and personal life"

### Navigation
**Back/Continue buttons** with same pattern as Step 2

## Validation Rules
- At least 1 area must be selected across all pillars
- Maximum 4 areas per pillar (soft recommendation, warning not error)
- Areas must be available for the selected pillar

## Success Criteria
- 3-8 total areas selected (recommended range)
- 85% step completion rate target

# Screen 4: Metrics & Goals Requirements

## Objective
Help users set measurable targets for their areas of focus to track progress and maintain motivation. This step is optional but recommended.

## Screen Layout

### Header Section
- **Title**: "Set Your Targets" (large, centered)
- **Subtitle**: "Step 4 of 5" (small, muted, centered)
- **Description**: "Add measurable goals to track your progress (optional but recommended)"
- **Progress**: WizardDots component showing step 4/5 active

### Metrics Section
Display sections for each area selected in Step 3, grouped by pillar.

**For Each Selected Area:**
- **Area Header**: Area name (e.g., "Increase Strength")
- **Pillar Context**: Show pillar name in smaller text below
- **Available Metrics**: Use MetricGoalCard component for each metric
- **Expandable Cards**: Tap to expand and set goals

### MetricGoalCard Components
**Collapsed State:**
- Metric name and unit (e.g., "Bench Press (kg)")
- "Tap to set goal" or current goal summary
- Expand/collapse indicator

**Expanded State:**
- **Baseline Input**: "Current" value with unit selector
- **Target Input**: "Goal" value with unit selector  
- **Target Date**: Optional date picker
- **Notes Field**: Optional text area for additional context
- **Save/Cancel**: Buttons to confirm or discard changes

### Available Metrics by Area

**Strength Areas:**
- Bench Press (kg/lbs), Squat (kg/lbs), Deadlift (kg/lbs), Pull-ups (reps)

**Consistency Areas:**
- Workout Days per Week (days), Missed Workouts per Month (count)

**Weight Management:**
- Body Weight (kg/lbs), Body Fat Percentage (%)

**Endurance Areas:**
- 5K Run Time (minutes), 10K Run Time (minutes), Max Push-ups (reps)

**Savings Areas:**
- Emergency Fund (currency), Monthly Savings Rate (currency/%)

**Investment Areas:**
- Portfolio Value (currency), Monthly Investment (currency)

### Visual Design
- Group metrics by area with clear section headers
- Use accordion-style expansion for metric cards
- Show progress indicators for completed vs. total metrics
- Optional badge: "3 of 8 metrics set" type indicator

### Navigation
**Skip Button:**
- Secondary button or link
- Text: "Skip for now"
- Allows progression without setting any metrics

**Back/Continue buttons** with same pattern as previous steps

## Validation Rules
- Baseline and target values must be positive numbers
- Target should be different from baseline (improvement expected)
- Target date must be in the future if provided
- Units must match metric requirements
- No validation required - step is optional

## Error Messages
- "Target should be different from baseline" for identical values
- "Please enter a valid number" for non-numeric inputs
- "Target date should be in the future" for past dates

## Success Criteria
- 60% of users set at least 3 metrics
- 80% step completion rate target
- Users feel motivated by their targets

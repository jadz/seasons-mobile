# Screen 5: Review & Create Requirements

## Objective
Allow users to review their complete season setup and create their season with confidence before finalizing.

## Screen Layout

### Header Section
- **Title**: "Review Your Season" (large, centered)
- **Subtitle**: "Step 5 of 5" (small, muted, centered)
- **Description**: "Make sure everything looks good before creating your season"
- **Progress**: WizardDots component showing step 5/5 active

### Season Summary Card
**Main Season Info:**
- Season name (large, prominent)
- Duration display: "12 weeks" or "Open duration"
- Creation date: "Created [today's date]"
- Status badge: "Draft" with appropriate styling

### Pillars Overview Section
**Summary Stats:**
- "X focus areas selected"
- "X areas of focus chosen"  
- "X metrics with goals set"

**Pillar List:**
For each selected pillar:
- Pillar name with small bullet point
- Theme text in smaller, italic font
- Area count: "(3 areas)"
- Edit button/link to go back to specific step

### Areas & Metrics Summary
**Expandable Sections by Pillar:**
- Collapsible sections showing pillar → areas → metrics hierarchy
- Area names with metric counts
- Key metrics with baseline → target format
- "Tap to expand" interaction for detailed view

### Training Phases Placeholder
**Coming Soon Section:**
- Construction emoji (🚧) or similar icon
- "Training Phases - Coming Soon" header
- Brief description: "Structured progression through your season will be available in the next update"
- Use Card component with muted styling

### Action Buttons Section
**Edit Options:**
- Small "Edit" buttons next to each major section
- Links back to appropriate steps with data preserved

**Primary Actions:**
- **Create Season**: Primary button, full width
- **Save as Draft**: Secondary button or link
- Proper spacing and hierarchy

### Visual Design
- Use Card components for major sections
- Clear visual hierarchy with proper spacing
- Consistent typography and color usage
- Subtle dividers between sections
- Success-oriented color scheme (greens, positive tones)

## Validation Rules
- All previous steps must be completed successfully
- Season data must be valid and complete
- User must not have another active season
- Final validation before API call

## Error Handling
- "Please complete all required sections" if validation fails
- "You already have an active season" if conflict detected
- Network error handling with retry options
- Loading states during season creation

## Success Criteria
- User feels confident about their season setup
- All information clearly presented and accurate
- Season creation succeeds
- 95% step completion rate target
- User guided to next steps after creation

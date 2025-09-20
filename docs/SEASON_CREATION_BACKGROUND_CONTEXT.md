# Season Creation Onboarding - Background Context

## Product Overview

This is a personal development mobile app that helps users create and track "seasons" - focused periods of improvement across multiple life areas. Users structure their goals hierarchically: Season → Pillars → Areas of Focus → Metrics → Goals.

## Target Users

**Primary Users:**
- **Goal-oriented individuals** (25-45 years old) seeking structured personal development
- **Busy professionals** who want organized approach to life improvement
- **Fitness enthusiasts** expanding beyond just physical goals
- **Self-improvement seekers** who have tried other apps but want more comprehensive tracking

**User Characteristics:**
- Motivated but often overwhelmed by too many goals
- Value measurable progress and accountability
- Prefer mobile-first experiences
- Want flexibility but also guidance
- Typically juggle multiple life priorities (health, career, family, finances)

## Core Product Concepts

**Seasons:** Time-bounded periods (typically 12 weeks) focused on specific improvements across life areas.

**Life Pillars:** Five core areas of life focus:
- **Health & Fitness** (always included) - Physical health, fitness, nutrition
- **Wealth** - Financial goals, savings, investments
- **Family** - Relationships, quality time, connections  
- **Head Game** - Mental health, learning, personal development
- **Career** - Professional growth, skills, advancement

**Areas of Focus:** Specific improvement areas within each pillar (e.g., "Increase Strength" within Health & Fitness).

**Metrics & Goals:** Measurable targets with baseline and target values (e.g., "Bench Press: 60kg → 80kg").

## Business Rules & Constraints

**Technical Constraints:**
- Users can only have one active season at a time
- Health & Fitness pillar is mandatory in every season
- No duplicate areas or metrics within the same pillar/area
- Seasons start in DRAFT status until user activates them

**User Experience Principles:**
- Progressive disclosure - show complexity gradually
- Mobile-first design with thumb-friendly interactions
- Encouraging, motivational tone throughout
- Clear validation with helpful error messages
- Allow users to go back and edit previous steps

## Success Criteria

**Completion Targets:**
- 80% of users who start the flow complete it
- Average completion time: 8-12 minutes
- 70% of users activate their season within 7 days
- 60% of users set at least 3 measurable metrics

**Quality Indicators:**
- Post-completion satisfaction: 4.5+ stars
- Users who recommend to others: 80%
- Support tickets related to onboarding: <5%

## Technical Integration

The onboarding integrates with `SeasonCreationService` which provides:
- `createDraftSeason()` - Creates initial season with Health pillar
- `setPillarTheme()` - Sets focus themes for selected pillars
- `addAreaOfFocusToSeasonPillar()` - Adds selected areas to pillars
- `addMetricToSeasonArea()` - Adds metrics with optional goals
- `getSeasonCreationView()` - Retrieves complete season data for review

## Design System Components Available

- `PillarSelectionCard` - For pillar selection with descriptions
- `SelectionList` - Multi-select lists for areas of focus
- `MetricGoalCard` - Expandable cards for metric goal setting
- `WizardDots` - Progress indicator across steps
- `Button`, `TextInput`, `Card` - Standard UI components
- Consistent theme with primary/secondary colors and typography

## User Flow Overview

5-step wizard process:
1. **Season Basics** - Name, duration, pillar selection
2. **Pillar Themes** - Define focus themes for each selected pillar  
3. **Areas of Focus** - Select specific areas within each pillar
4. **Metrics & Goals** - Set measurable targets (optional)
5. **Review & Create** - Final review and season creation

Each step builds on the previous, with validation preventing progression until requirements are met. Users can navigate back to edit previous steps at any time.

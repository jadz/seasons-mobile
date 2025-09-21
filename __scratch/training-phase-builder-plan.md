# Training Phase Builder UI Plan

This document outlines the plan for creating the Training Phase Builder UI.

## 1. Goal

Create a new UI screen that allows users to define one or more training phases for their season. This is a UI-only task; no backend integration is required at this stage.

## 2. Component Breakdown

We will create the following new components:

### a. `DateRangePicker.tsx`

A custom calendar component for selecting date ranges.

**Location:** `components/ui/selection/DateRangePicker.tsx`

**Features:**
*   Displays a monthly calendar view.
*   Allows navigation between months.
*   Supports selecting a start date and an end date to define a range.
*   Visually highlights the selected range.
*   Can display pre-existing date ranges (for other phases) with different background colors to indicate they are unavailable.
*   Presented as a full screen modal
*   "Save" and "Clear" actions.

### b. `PhaseDefinitionCard.tsx`

A card component for defining a single training phase.

**Location:** `components/training-phase/TrainingPhaseDefinitionCard.tsx`

**Features:**
*   Input field for "Phase Name".
*   A pressable area to open the `DateRangePicker` modal.
*   Displays the selected date range.
*   A switch to include an optional 1-week deload period after the phase.
*   A summary section that dynamically updates to show:
    *   Start Date
    *   End Date (with and without deload)
    *   Duration in weeks.

### c. `season-step-6-training-phases.tsx`

The main screen that orchestrates the phase-building process.

**Location:** `app/onboarding/season-step-6-training-phases.tsx`

**Features:**
*   Displays a list of `PhaseDefinitionCard` components.
*   Manages the state for all created phases (list of phase objects).
*   An "Add another phase" button that adds a new, empty phase to the list.
*   A "Next" button to proceed in the onboarding flow (for now, it will be disabled or do nothing).
*   Will need to be added to the onboarding navigation flow.

## 3. Implementation Steps

1.  **File & Component Shell Creation:**
    *   Create empty files for `DateRangePicker.tsx`, `PhaseDefinitionCard.tsx`, and `season-step-6-training-phases.tsx`.
    *   Define basic props interfaces for each.

2.  **`DateRangePicker` Implementation:**
    *   Build the calendar grid UI.
    *   Implement month navigation logic.
    *   Add state management for selecting start and end dates.
    *   Implement the logic to highlight the selected range.
    *   Implement the "Save" and "Clear" functionality.
    *   Add props to accept an array of existing date ranges to display them as disabled/colored.

3.  **`PhaseDefinitionCard` Implementation:**
    *   Build the static layout of the card using UI components from the existing library.
    *   Add state to manage the phase name, date range, and deload toggle.
    *   Implement the logic to open the `DateRangePicker` modal.
    *   Handle the date range returned from the modal and update the state.
    *   Implement the logic to calculate and display the summary information.

4.  **`season-step-6-training-phases.tsx` Screen Implementation:**
    *   Set up state to manage an array of phase data objects.
    *   Implement the "Add another phase" button to append a new phase object to the state array.
    *   Render the list of phases using `.map()` over the state array, passing props to `PhaseDefinitionCard`.
    *   Pass the list of *other* phases' date ranges to each `PhaseDefinitionCard` and down to the `DateRangePicker` so users can't select overlapping dates.
    *   Add the screen to the onboarding navigation in `app/onboarding/_layout.tsx`.

## 4. State Management (UI-level)

*   **`season-step-6-training-phases.tsx`**: Will hold the primary state, an array of phase objects.
    *   `[{ id: 1, name: 'Base', startDate: '...', endDate: '...', hasDeload: false }, ...]`
*   **`PhaseDefinitionCard.tsx`**: Will receive a single phase object as a prop and a callback function to update it in the parent screen's state. It will manage its own internal state derived from props.
*   **`DateRangePicker.tsx`**: Will manage its internal state for date selection and month navigation. It will be a controlled component, receiving initial values and returning the final selection via a callback.

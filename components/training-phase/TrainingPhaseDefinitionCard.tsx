import React, { useState, useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text, TextInput } from '../ui';
import { DateRangePicker, DateRange } from '../ui/selection/DateRangePicker';
import { useAppTheme } from '../ui/foundation';

export interface TrainingPhase {
  id: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  hasDeload: boolean;
}

export interface TrainingPhaseDefinitionCardProps {
  phase: TrainingPhase;
  onPhaseUpdate: (updatedPhase: TrainingPhase) => void;
  existingRanges?: DateRange[];
  showDivider?: boolean;
}

export const TrainingPhaseDefinitionCard: React.FC<TrainingPhaseDefinitionCardProps> = ({
  phase,
  onPhaseUpdate,
  existingRanges = [],
  showDivider = true
}) => {
  const { theme } = useAppTheme();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleNameChange = useCallback((name: string) => {
    onPhaseUpdate({ ...phase, name });
  }, [phase, onPhaseUpdate]);

  const handleDateRangeSelect = useCallback((range: DateRange) => {
    onPhaseUpdate({
      ...phase,
      startDate: range.startDate,
      endDate: range.endDate
    });
  }, [phase, onPhaseUpdate]);

  const handleDeloadToggle = useCallback(() => {
    onPhaseUpdate({ ...phase, hasDeload: !phase.hasDeload });
  }, [phase, onPhaseUpdate]);

  // Calculate training duration and summary
  const trainingInfo = useMemo(() => {
    if (!phase.startDate || !phase.endDate) {
      return {
        duration: 0,
        endWithDeload: null,
        formattedDuration: ''
      };
    }

    // Calculate the number of days including both start and end dates
    const timeDiff = phase.endDate.getTime() - phase.startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
    const weeks = Math.ceil(daysDiff / 7); // Use ceil to round up partial weeks
    
    // Calculate end date with deload (add 1 week)
    const endWithDeload = phase.hasDeload 
      ? new Date(phase.endDate.getTime() + (7 * 24 * 60 * 60 * 1000))
      : null;

    const formattedDuration = phase.hasDeload 
      ? `${weeks} training weeks + 1 deload week`
      : `${weeks} training weeks`;

    return {
      duration: weeks,
      endWithDeload,
      formattedDuration
    };
  }, [phase.startDate, phase.endDate, phase.hasDeload]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }, []);

  const dateRangeText = useMemo(() => {
    if (!phase.startDate || !phase.endDate) {
      return "Select training dates";
    }
    const startStr = formatDate(phase.startDate);
    const endStr = formatDate(phase.endDate);
    return `${startStr} - ${endStr}`;
  }, [phase.startDate, phase.endDate, formatDate]);

  // Calculate smart default start date based on current date
  const getSmartDefaultStartDate = useCallback(() => {
    if (phase.startDate) return phase.startDate; // Use existing date if set
    
    const today = new Date();
    const currentDay = today.getDate();
    
    // If we're in the first 7 days of the month, default to previous month
    if (currentDay <= 7) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return prevMonth;
    } else {
      // Otherwise, default to current month
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return currentMonth;
    }
  }, [phase.startDate]);

  return (
    <>
      <Box marginBottom="xl">
        {/* Phase Name Input */}
        <Box marginBottom="xl">
          <TextInput
            label="Phase Name"
            placeholder="Phase name"
            value={phase.name}
            onChangeText={handleNameChange}
            variant="outlined"
          />
        </Box>

        {/* Date Range Selector */}
        <Box marginBottom="xl">
          <Text variant="label" color="text/primary" marginBottom="m">
            Set Training Dates
          </Text>
          <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
            <Box
              backgroundColor="bg/page"
              borderColor="border/subtle"
              borderWidth={1}
              borderRadius="md"
              paddingHorizontal="m"
              paddingVertical="m"
            >
              <Text variant="body" color="text/primary">
                {dateRangeText}
              </Text>
            </Box>
          </TouchableOpacity>
          
          {phase.startDate && phase.endDate && (
            <Box marginTop="m">
              <Text variant="caption" color="text/secondary">
                This phase will run for {trainingInfo.duration} training weeks, from{' '}
                {formatDate(phase.startDate)} to {formatDate(phase.endDate)}.
              </Text>
            </Box>
          )}
        </Box>

        {/* Deload Toggle */}
        <Box marginBottom="xl">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="m">
            <Text variant="label" color="text/primary">
              Include Deload Week?
            </Text>
            <TouchableOpacity onPress={handleDeloadToggle}>
              <Box
                width={52}
                height={32}
                borderRadius="round"
                backgroundColor={phase.hasDeload ? 'brand/primary' : 'border/subtle'}
                justifyContent="center"
                paddingHorizontal="xs"
              >
                <Box
                  width={24}
                  height={24}
                  borderRadius="round"
                  backgroundColor="bg/page"
                  style={{
                    transform: [{ translateX: phase.hasDeload ? 16 : 2 }]
                  }}
                />
              </Box>
            </TouchableOpacity>
          </Box>
          
          {phase.hasDeload && trainingInfo.endWithDeload && (
            <Box marginTop="m">
              <Text variant="caption" color="text/secondary">
                Deload week will be added from {formatDate(new Date(phase.endDate!.getTime() + 24 * 60 * 60 * 1000))} to{' '}
                {formatDate(trainingInfo.endWithDeload)}.
              </Text>
            </Box>
          )}
        </Box>

        {/* Summary Section */}
        {phase.startDate && phase.endDate && (
          <Box marginBottom="xl">
            <Text variant="label" color="text/primary" marginBottom="m">
              Summary
            </Text>
            
            <Box marginBottom="xs">
              <Text variant="caption" color="text/secondary">
                • Start: {formatDate(phase.startDate)}
              </Text>
            </Box>
            
            <Box marginBottom="xs">
              <Text variant="caption" color="text/secondary">
                • End{phase.hasDeload ? ' (with deload)' : ''}: {formatDate(trainingInfo.endWithDeload || phase.endDate)}
              </Text>
            </Box>
            
            <Box>
              <Text variant="caption" color="text/secondary">
                • Duration: {trainingInfo.formattedDuration}
              </Text>
            </Box>
          </Box>
        )}
        
        {/* Phase Divider */}
        {showDivider && (
          <Box 
            marginTop="xxl"
            marginBottom="xl"
            height={1}
            backgroundColor="border/strong"
            opacity={0.6}
          />
        )}
      </Box>

      {/* Date Picker Modal */}
      <DateRangePicker
        isVisible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSave={handleDateRangeSelect}
        initialStartDate={getSmartDefaultStartDate()}
        initialEndDate={phase.endDate}
        existingRanges={existingRanges}
        title={`${phase.name || 'Phase'} Training Dates`}
        numberOfMonths={6}
      />
    </>
  );
};


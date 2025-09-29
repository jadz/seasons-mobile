import React, { useState, useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text, TextInput, Card } from '../ui';
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
}

export const TrainingPhaseDefinitionCard: React.FC<TrainingPhaseDefinitionCardProps> = ({
  phase,
  onPhaseUpdate,
  existingRanges = []
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

    const timeDiff = phase.endDate.getTime() - phase.startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const weeks = Math.floor(daysDiff / 7);
    
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
      return "Aug 1 - Sep 30, 2025";
    }
    const startStr = formatDate(phase.startDate);
    const endStr = formatDate(phase.endDate);
    return `${startStr} - ${endStr}`;
  }, [phase.startDate, phase.endDate, formatDate]);

  return (
    <>
      <Card backgroundColor="bg/surface" padding="l" marginBottom="m">
        {/* Phase Name Input */}
        <Box marginBottom="l">
          <Text variant="bodyMedium" color="text/primary" marginBottom="s">
            Phase Name
          </Text>
          <TextInput
            placeholder="Phase name"
            value={phase.name}
            onChangeText={handleNameChange}
            style={{
              backgroundColor: theme.colors['bg/page'],
              borderColor: theme.colors['border/subtle'],
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: theme.colors['text/primary']
            }}
          />
        </Box>

        {/* Date Range Selector */}
        <Box marginBottom="l">
          <Text variant="bodyMedium" color="text/primary" marginBottom="s">
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
            <Text variant="caption" color="text/secondary" marginTop="xs">
              This phase will run for {trainingInfo.duration} training weeks, from{' '}
              {formatDate(phase.startDate)} to {formatDate(phase.endDate)}.
            </Text>
          )}
        </Box>

        {/* Deload Toggle */}
        <Box marginBottom="l">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="s">
            <Text variant="bodyMedium" color="text/primary">
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
                style={{
                  transition: 'backgroundColor 0.2s ease'
                }}
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
            <Text variant="caption" color="text/secondary">
              Deload week will be added from {formatDate(new Date(phase.endDate!.getTime() + 24 * 60 * 60 * 1000))} to{' '}
              {formatDate(trainingInfo.endWithDeload)}.
            </Text>
          )}
        </Box>

        {/* Summary Section */}
        {phase.startDate && phase.endDate && (
          <Box 
            backgroundColor="bg/raised" 
            borderRadius="md" 
            padding="m"
          >
            <Text variant="bodyMedium" color="text/primary" marginBottom="s">
              Summary
            </Text>
            
            <Box marginBottom="xs">
              <Text variant="caption" color="text/secondary">
                Start: {formatDate(phase.startDate)}
              </Text>
            </Box>
            
            <Box marginBottom="xs">
              <Text variant="caption" color="text/secondary">
                End{phase.hasDeload ? ' (with deload)' : ''}: {formatDate(trainingInfo.endWithDeload || phase.endDate)}
              </Text>
            </Box>
            
            <Box>
              <Text variant="caption" color="text/secondary">
                Duration: {trainingInfo.formattedDuration}
              </Text>
            </Box>
          </Box>
        )}
      </Card>

      {/* Date Picker Modal */}
      <DateRangePicker
        isVisible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSave={handleDateRangeSelect}
        initialStartDate={phase.startDate}
        initialEndDate={phase.endDate}
        existingRanges={existingRanges}
        title={`${phase.name || 'Phase'} Training Dates`}
      />
    </>
  );
};

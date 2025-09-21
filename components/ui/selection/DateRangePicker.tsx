import React, { useState, useMemo, useCallback, memo } from 'react';
import { View, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Box, Text, Button } from '../index';
import { useAppTheme } from '../foundation';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  color?: string;
}

export interface DateRangePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (range: DateRange) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  existingRanges?: DateRange[];
  title?: string;
  numberOfMonths?: number;
}

interface DayButtonProps {
  date: Date | null;
  isSelected: boolean;
  isDisabled: boolean;
  isInExistingRange: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isMiddle: boolean;
  onPress: (date: Date) => void;
  themeColors: any;
}

// Pre-computed style variants for maximum performance
const createStyleVariants = (themeColors: any) => ({
  base: {
    container: {
      flex: 1,
      height: 40,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: 'transparent',
    },
    containerDisabled: {
      flex: 1,
      height: 40,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: 'transparent',
      opacity: 0.3,
    },
    innerCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: 'transparent',
    }
  },
  selected: {
    start: {
      flex: 1,
      height: 40,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: themeColors['brand/primary'],
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    end: {
      flex: 1,
      height: 40,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: themeColors['brand/primary'],
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
    },
    middle: {
      flex: 1,
      height: 40,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: `${themeColors['brand/primary']}20`,
    },
    single: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: themeColors['brand/primary'],
    }
  },
  existing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: themeColors['state/warn'],
  },
  text: {
    normal: { fontWeight: '400' as const, fontSize: 14 },
    today: { fontWeight: '600' as const, fontSize: 14 }
  }
});

const DayButton = memo<DayButtonProps>(({ 
  date, 
  isSelected, 
  isDisabled, 
  isInExistingRange, 
  isToday, 
  isStart, 
  isEnd, 
  isMiddle, 
  onPress,
  themeColors 
}) => {
  if (!date) {
    return <View style={{ flex: 1, height: 40 }} />;
  }

  // Memoize style variants to prevent recreations
  const styles = useMemo(() => createStyleVariants(themeColors), [themeColors]);

  const handlePress = useCallback(() => {
    onPress(date);
  }, [date, onPress]);

  // Select optimal styles based on state
  let containerStyle, innerCircleStyle;
  
  if (isSelected) {
    if (isStart && !isEnd) {
      containerStyle = styles.selected.start;
      innerCircleStyle = styles.base.innerCircle;
    } else if (isEnd && !isStart) {
      containerStyle = styles.selected.end;
      innerCircleStyle = styles.base.innerCircle;
    } else if (isStart && isEnd) {
      containerStyle = isDisabled ? styles.base.containerDisabled : styles.base.container;
      innerCircleStyle = styles.selected.single;
    } else if (isMiddle) {
      containerStyle = styles.selected.middle;
      innerCircleStyle = styles.base.innerCircle;
    }
  } else if (isInExistingRange) {
    containerStyle = isDisabled ? styles.base.containerDisabled : styles.base.container;
    innerCircleStyle = styles.existing;
  } else {
    containerStyle = isDisabled ? styles.base.containerDisabled : styles.base.container;
    innerCircleStyle = styles.base.innerCircle;
  }

  // Determine text color efficiently
  const textColor = (isStart || isEnd) && isSelected ? 'brand/onPrimary' : 
    isInExistingRange ? 'text/inverse' :
    isToday ? 'brand/primary' : 'text/primary';

  const textStyle = isToday ? styles.text.today : styles.text.normal;
  
  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={handlePress}
      style={containerStyle}
    >
      <View style={innerCircleStyle}>
        <Text
          variant="body"
          color={textColor}
          style={textStyle}
        >
          {date.getDate()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-render prevention
  return (
    prevProps.date?.getTime() === nextProps.date?.getTime() &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.isInExistingRange === nextProps.isInExistingRange &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.isStart === nextProps.isStart &&
    prevProps.isEnd === nextProps.isEnd &&
    prevProps.isMiddle === nextProps.isMiddle &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.themeColors === nextProps.themeColors
  );
});

interface MonthComponentProps {
  monthData: { days: any[], monthName: string, monthDate: Date };
  monthIndex: number;
  numberOfMonths: number;
  renderDay: (dateMetadata: any, index: string | number) => React.ReactElement;
}

const MonthComponent = memo<MonthComponentProps>(({ monthData, monthIndex, numberOfMonths, renderDay }) => {
  return (
    <Box marginBottom={numberOfMonths > 1 ? "xl" : undefined}>
      {/* Month Header - only show if multiple months */}
      {numberOfMonths > 1 && (
        <Box paddingHorizontal="l" paddingVertical="m">
          <Text variant="h3" color="text/primary" textAlign="center">
            {monthData.monthName}
          </Text>
        </Box>
      )}

        {/* Calendar Grid with Headers */}
        <Box paddingHorizontal="l">
          {/* Weekday Headers - using same grid structure */}
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={{ flex: 1, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Text variant="caption" color="text/secondary">{day}</Text>
              </View>
            ))}
          </View>
          
          {/* Calendar Days - using same grid structure */}
          {Array.from({ length: Math.ceil(monthData.days.length / 7) }, (_, weekIndex) => {
            const weekDays = monthData.days.slice(weekIndex * 7, (weekIndex + 1) * 7);
            // Ensure each week has exactly 7 elements for proper alignment
            while (weekDays.length < 7) {
              weekDays.push(null);
            }
            return (
              <View key={weekIndex} style={{ flexDirection: 'row' }}>
                {weekDays.map((dateMetadata, dayIndex) => 
                  renderDay(dateMetadata, `${monthIndex}-${weekIndex}-${dayIndex}`)
                )}
              </View>
            );
          })}
        </Box>
    </Box>
  );
});

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isVisible,
  onClose,
  onSave,
  initialStartDate,
  initialEndDate,
  existingRanges = [],
  title = "Select Training Dates",
  numberOfMonths = 1
}) => {
  const { theme } = useAppTheme();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(initialStartDate || null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(initialEndDate || null);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

  // Pre-compute today's date string once (expensive operation)
  const todayString = useMemo(() => new Date().toDateString(), []);

  // Calendar generation logic with metadata pre-computation
  const calendarData = useMemo(() => {
    const months = [];
    
    for (let i = 0; i < numberOfMonths; i++) {
      const monthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      
      // Get first day of month and how many days
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      
      // Convert Sunday-based getDay() to Monday-based (0=Monday, 6=Sunday)
      let startingDayOfWeek = firstDay.getDay();
      startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
      
      // Generate calendar grid with pre-computed metadata
      const days = [];
      
      // Previous month's trailing days
      for (let j = 0; j < startingDayOfWeek; j++) {
        days.push(null);
      }
      
      // Current month's days with metadata
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        // Pre-compute expensive operations
        const dateMetadata = {
          date,
          dateTime: date.getTime(),
          dateString: date.toDateString(),
          isToday: date.toDateString() === todayString
        };
        days.push(dateMetadata);
      }
      
      months.push({
        days,
        monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        monthDate: monthDate
      });
    }
    
    return months;
  }, [currentMonth, numberOfMonths, todayString]);

  const handleDatePress = useCallback((date: Date) => {
    if (!selectedStartDate || isSelectingEndDate) {
      // Selecting start date or we're in end date selection mode
      if (!selectedStartDate) {
        setSelectedStartDate(date);
        setIsSelectingEndDate(true);
      } else {
        // Selecting end date
        if (date >= selectedStartDate) {
          setSelectedEndDate(date);
          setIsSelectingEndDate(false);
        } else {
          // If end date is before start date, make it the new start date
          setSelectedStartDate(date);
          setSelectedEndDate(null);
          setIsSelectingEndDate(true);
        }
      }
    } else {
      // We have a start date and we're not specifically selecting end date
      // This is a new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setIsSelectingEndDate(true);
    }
  }, [selectedStartDate, isSelectingEndDate]);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  }, []);

  const handleSave = useCallback(() => {
    if (selectedStartDate && selectedEndDate) {
      onSave({
        startDate: selectedStartDate,
        endDate: selectedEndDate
      });
      onClose();
    }
  }, [selectedStartDate, selectedEndDate, onSave, onClose]);

  const handleClear = useCallback(() => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setIsSelectingEndDate(false);
  }, []);

  // Calculate number of weeks in selected range
  const numberOfWeeks = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    
    const diffTime = selectedEndDate.getTime() - selectedStartDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return Math.ceil(diffDays / 7);
  }, [selectedStartDate, selectedEndDate]);

  // Pre-compute existing ranges for faster lookups
  const existingRangeTimestamps = useMemo(() => {
    return existingRanges.map(range => ({
      startTime: range.startDate.getTime(),
      endTime: range.endDate.getTime()
    }));
  }, [existingRanges]);

  // Optimized date calculations using pre-computed metadata
  const dateCalculations = useMemo(() => {
    const startTime = selectedStartDate?.getTime();
    const endTime = selectedEndDate?.getTime();
    
    return {
      isDateInRange: (dateTime: number) => {
        if (!selectedStartDate) return false;
        if (!selectedEndDate) return dateTime === startTime;
        return dateTime >= startTime! && dateTime <= endTime!;
      },
      isStartDate: (dateTime: number) => {
        return selectedStartDate && dateTime === startTime;
      },
      isEndDate: (dateTime: number) => {
        return selectedEndDate && dateTime === endTime;
      },
      isMiddleDate: (dateTime: number) => {
        if (!selectedStartDate || !selectedEndDate) return false;
        return dateTime > startTime! && dateTime < endTime!;
      },
      // Consolidated function (was duplicate of isDateInExistingRange)
      isDateInExistingRange: (dateTime: number) => {
        return existingRangeTimestamps.some(range => 
          dateTime >= range.startTime && dateTime <= range.endTime
        );
      }
    };
  }, [selectedStartDate, selectedEndDate, existingRangeTimestamps]);

  // Create stable onPress callbacks per date to prevent unnecessary re-renders
  const stableCallbacks = useMemo(() => {
    const callbacks = new Map<number, (date: Date) => void>();
    return {
      getCallback: (dateTime: number, date: Date) => {
        if (!callbacks.has(dateTime)) {
          callbacks.set(dateTime, (dateArg: Date) => handleDatePress(dateArg));
        }
        return callbacks.get(dateTime)!;
      }
    };
  }, [handleDatePress]);

  // Memoize theme colors to prevent style recreations
  const stableThemeColors = useMemo(() => theme.colors, [theme.colors]);

  const renderDay = useCallback((dateMetadata: any, index: string | number) => {
    if (!dateMetadata) {
      return <View key={index} style={{ flex: 1, height: 40 }} />;
    }

    // Use pre-computed metadata for optimal performance
    const { date, dateTime, isToday } = dateMetadata;
    
    // Use optimized calculations with pre-computed timestamps
    const isSelected = dateCalculations.isDateInRange(dateTime);
    const isInExistingRange = dateCalculations.isDateInExistingRange(dateTime);
    const isStart = dateCalculations.isStartDate(dateTime);
    const isEnd = dateCalculations.isEndDate(dateTime);
    const isMiddle = dateCalculations.isMiddleDate(dateTime);
    
    return (
      <DayButton
        key={index}
        date={date}
        isSelected={isSelected}
        isDisabled={isInExistingRange} // Consolidated: disabled = in existing range
        isInExistingRange={isInExistingRange}
        isToday={isToday} // Pre-computed, no expensive string comparison
        isStart={isStart}
        isEnd={isEnd}
        isMiddle={isMiddle}
        onPress={stableCallbacks.getCallback(dateTime, date)}
        themeColors={stableThemeColors}
      />
    );
  }, [dateCalculations, stableCallbacks, stableThemeColors]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Box flex={1} backgroundColor="bg/page">
        {/* Header */}
        <Box 
          flexDirection="row" 
          justifyContent="space-between" 
          alignItems="center"
          paddingHorizontal="l"
          paddingVertical="m"
          borderBottomWidth={1}
          borderBottomColor="border/subtle"
        >
          <TouchableOpacity onPress={onClose}>
            <Text variant="body" color="brand/primary">Cancel</Text>
          </TouchableOpacity>
          
          <Text variant="h3" color="text/primary">{title}</Text>
          
          <TouchableOpacity onPress={handleSave} disabled={!selectedStartDate || !selectedEndDate}>
            <Text 
              variant="body" 
              color={selectedStartDate && selectedEndDate ? 'brand/primary' : 'text/secondary'}
            >
              Save
            </Text>
          </TouchableOpacity>
        </Box>

        {/* Month Navigation - only show for single month */}
        {numberOfMonths === 1 && (
          <Box 
            flexDirection="row" 
            justifyContent="space-between" 
            alignItems="center"
            paddingHorizontal="l"
            paddingVertical="m"
          >
            <TouchableOpacity onPress={() => navigateMonth('prev')}>
              <Text variant="body" color="brand/primary">‹ Prev</Text>
            </TouchableOpacity>
            
            <Text variant="h3" color="text/primary">{calendarData[0].monthName}</Text>
            
            <TouchableOpacity onPress={() => navigateMonth('next')}>
              <Text variant="body" color="brand/primary">Next ›</Text>
            </TouchableOpacity>
          </Box>
        )}

        {/* Calendar Content */}
        {numberOfMonths === 1 ? (
          // Single month view
          <Box flex={1}>
            <MonthComponent 
              monthData={calendarData[0]} 
              monthIndex={0} 
              numberOfMonths={numberOfMonths}
              renderDay={renderDay}
            />
          </Box>
        ) : (
          // Multiple months with scroll view
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {calendarData.map((monthData, index) => (
              <MonthComponent 
                key={index}
                monthData={monthData} 
                monthIndex={index} 
                numberOfMonths={numberOfMonths}
                renderDay={renderDay}
              />
            ))}
          </ScrollView>
        )}

        {/* Footer Actions */}
        <Box 
          paddingHorizontal="l" 
          paddingVertical="m"
        >
          {/* Weeks Counter */}
          {numberOfWeeks > 0 && (
            <Box alignItems="center" marginBottom="m">
              <Text variant="caption" color="text/secondary">
                {numberOfWeeks} week{numberOfWeeks !== 1 ? 's' : ''} selected
              </Text>
            </Box>
          )}
          
          {/* Action Buttons */}
          <Box flexDirection="row" gap="m">
            <Button variant="secondary" onPress={handleClear} style={{ flex: 1 }}>
              Clear
            </Button>
            <Button 
              variant="primary" 
              onPress={handleSave}
              disabled={!selectedStartDate || !selectedEndDate}
              style={{ flex: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

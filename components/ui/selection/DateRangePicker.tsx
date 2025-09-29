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
    return <Box style={{ width: 40, height: 40 }} />;
  }

  const handlePress = useCallback(() => {
    onPress(date);
  }, [date, onPress]);

  // Determine background styling
  let containerStyle: any = {
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
    opacity: isDisabled ? 0.3 : 1,
  };

  let innerCircleStyle = {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
  };

  // Apply styling based on selection state
  if (isSelected) {
    if (isStart && !isEnd) {
      // Start date: rounded left, square right
      containerStyle.backgroundColor = themeColors['brand/primary'];
      containerStyle = {
        ...containerStyle,
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      };
      innerCircleStyle.backgroundColor = 'transparent';
    } else if (isEnd && !isStart) {
      // End date: square left, rounded right
      containerStyle.backgroundColor = themeColors['brand/primary'];
      containerStyle = {
        ...containerStyle,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
      };
      innerCircleStyle.backgroundColor = 'transparent';
    } else if (isStart && isEnd) {
      // Single date selected (start and end are the same)
      innerCircleStyle.backgroundColor = themeColors['brand/primary'];
    } else if (isMiddle) {
      // Middle dates get square background with lighter color
      containerStyle.backgroundColor = `${themeColors['brand/primary']}20`; // 20% opacity
      innerCircleStyle.backgroundColor = 'transparent';
    }
  } else if (isInExistingRange) {
    innerCircleStyle.backgroundColor = themeColors['state/warn'];
  }
  
  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={handlePress}
      style={containerStyle}
    >
      <View style={innerCircleStyle}>
        <Text
          variant="body"
          color={
            (isStart || isEnd) && isSelected ? 'brand/onPrimary' : 
            isInExistingRange ? 'text/inverse' :
            isToday ? 'brand/primary' : 'text/primary'
          }
          style={{
            fontWeight: isToday ? '600' : '400',
            fontSize: 14
          }}
        >
          {date.getDate()}
        </Text>
      </View>
    </TouchableOpacity>
  );
  });

interface MonthComponentProps {
  monthData: { days: (Date | null)[], monthName: string, monthDate: Date };
  monthIndex: number;
  numberOfMonths: number;
  renderDay: (date: Date | null, index: string | number) => React.ReactElement;
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

      {/* Weekday Headers */}
      <Box flexDirection="row" paddingHorizontal="l" marginBottom="m">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Box key={index} style={{ width: 40 }} alignItems="center">
            <Text variant="caption" color="text/secondary">{day}</Text>
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box paddingHorizontal="l">
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}>
          {monthData.days.map((date, index) => renderDay(date, `${monthIndex}-${index}`))}
        </View>
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

  // Calendar generation logic
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
      const startingDayOfWeek = firstDay.getDay();
      
      // Generate calendar grid
      const days = [];
      
      // Previous month's trailing days
      for (let j = 0; j < startingDayOfWeek; j++) {
        days.push(null);
      }
      
      // Current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      months.push({
        days,
        monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        monthDate: monthDate
      });
    }
    
    return months;
  }, [currentMonth, numberOfMonths]);

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

  // Memoize date calculations to avoid recalculating on every render
  const dateCalculations = useMemo(() => {
    const startTime = selectedStartDate?.getTime();
    const endTime = selectedEndDate?.getTime();
    
    return {
      isDateInRange: (date: Date) => {
        if (!selectedStartDate) return false;
        if (!selectedEndDate) return date.getTime() === startTime;
        return date >= selectedStartDate && date <= selectedEndDate;
      },
      isStartDate: (date: Date) => {
        return selectedStartDate && date.getTime() === startTime;
      },
      isEndDate: (date: Date) => {
        return selectedEndDate && date.getTime() === endTime;
      },
      isMiddleDate: (date: Date) => {
        if (!selectedStartDate || !selectedEndDate) return false;
        return date > selectedStartDate && date < selectedEndDate;
      }
    };
  }, [selectedStartDate, selectedEndDate]);

  const isDateInExistingRange = useCallback((date: Date) => {
    return existingRanges.some(range => 
      date >= range.startDate && date <= range.endDate
    );
  }, [existingRanges]);

  const isDateDisabled = useCallback((date: Date) => {
    // Check if date conflicts with existing ranges
    return existingRanges.some(range => 
      date >= range.startDate && date <= range.endDate
    );
  }, [existingRanges]);

  const renderDay = useCallback((date: Date | null, index: string | number) => {
    if (!date) {
      return <Box key={index} style={{ width: 40, height: 40 }} />;
    }

    const isSelected = dateCalculations.isDateInRange(date);
    const isDisabled = isDateDisabled(date);
    const isInExistingRange = isDateInExistingRange(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isStart = dateCalculations.isStartDate(date);
    const isEnd = dateCalculations.isEndDate(date);
    const isMiddle = dateCalculations.isMiddleDate(date);
    
    return (
      <DayButton
        key={index}
        date={date}
        isSelected={isSelected}
        isDisabled={isDisabled}
        isInExistingRange={isInExistingRange}
        isToday={isToday}
        isStart={isStart}
        isEnd={isEnd}
        isMiddle={isMiddle}
        onPress={handleDatePress}
        themeColors={theme.colors}
      />
    );
  }, [dateCalculations, isDateDisabled, isDateInExistingRange, handleDatePress, theme.colors]);

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
          flexDirection="row" 
          paddingHorizontal="l" 
          paddingVertical="m"
          gap="m"
        >
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
    </Modal>
  );
};

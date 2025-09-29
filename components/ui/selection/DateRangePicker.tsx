import React, { useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Modal, Pressable } from 'react-native';
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
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isVisible,
  onClose,
  onSave,
  initialStartDate,
  initialEndDate,
  existingRanges = [],
  title = "Select Training Dates"
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
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and how many days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Generate calendar grid
    const days = [];
    
    // Previous month's trailing days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return {
      days,
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  }, [currentMonth]);

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

  const isDateInRange = useCallback((date: Date) => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate) return date.getTime() === selectedStartDate.getTime();
    
    return date >= selectedStartDate && date <= selectedEndDate;
  }, [selectedStartDate, selectedEndDate]);

  const isStartDate = useCallback((date: Date) => {
    return selectedStartDate && date.getTime() === selectedStartDate.getTime();
  }, [selectedStartDate]);

  const isEndDate = useCallback((date: Date) => {
    return selectedEndDate && date.getTime() === selectedEndDate.getTime();
  }, [selectedEndDate]);

  const isMiddleDate = useCallback((date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date > selectedStartDate && date < selectedEndDate;
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

  const renderDay = useCallback((date: Date | null, index: number) => {
    if (!date) {
      return <Box key={index} style={{ width: 40, height: 40 }} />;
    }

    const isSelected = isDateInRange(date);
    const isDisabled = isDateDisabled(date);
    const isInExistingRange = isDateInExistingRange(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isStart = isStartDate(date);
    const isEnd = isEndDate(date);
    const isMiddle = isMiddleDate(date);
    
    // Determine background styling
    let containerStyle = {
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
        containerStyle.backgroundColor = theme.colors['brand/primary'];
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
        containerStyle.backgroundColor = theme.colors['brand/primary'];
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
        innerCircleStyle.backgroundColor = theme.colors['brand/primary'];
      } else if (isMiddle) {
        // Middle dates get square background with lighter color
        containerStyle.backgroundColor = `${theme.colors['brand/primary']}20`; // 20% opacity
        innerCircleStyle.backgroundColor = 'transparent';
      }
    } else if (isInExistingRange) {
      innerCircleStyle.backgroundColor = theme.colors['state/warn'];
    }
    
    return (
      <TouchableOpacity
        key={index}
        disabled={isDisabled}
        onPress={() => handleDatePress(date)}
        style={containerStyle}
      >
        <View style={innerCircleStyle}>
          <Text
            variant="body"
            color={
              (isStart || isEnd) && selectedEndDate ? 'brand/onPrimary' : 
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
  }, [isDateInRange, isDateDisabled, isDateInExistingRange, isStartDate, isEndDate, isMiddleDate, handleDatePress, theme.colors]);

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

        {/* Month Navigation */}
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
          
          <Text variant="h3" color="text/primary">{calendarData.monthName}</Text>
          
          <TouchableOpacity onPress={() => navigateMonth('next')}>
            <Text variant="body" color="brand/primary">Next ›</Text>
          </TouchableOpacity>
        </Box>

        {/* Weekday Headers */}
        <Box flexDirection="row" paddingHorizontal="l" marginBottom="m">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Box key={index} style={{ width: 40 }} alignItems="center">
              <Text variant="caption" color="text/secondary">{day}</Text>
            </Box>
          ))}
        </Box>

        {/* Calendar Grid */}
        <Box paddingHorizontal="l" flex={1}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}>
            {calendarData.days.map((date, index) => renderDay(date, index))}
          </View>
        </Box>

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

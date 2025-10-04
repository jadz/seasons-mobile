import React, { forwardRef, useMemo, useState, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Box, Text, Button } from '../ui';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../ui/foundation/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Props for the ExerciseFilterSheet component
 */
export interface ExerciseFilterSheetProps {
  /** Available muscle groups to choose from */
  availableMuscleGroups: string[];
  /** Available equipment types to choose from */
  availableEquipment: string[];
  /** Currently selected muscle groups */
  selectedMuscleGroups: string[];
  /** Currently selected equipment types */
  selectedEquipment: string[];
  /** Callback fired when user applies filters */
  onApply: (muscleGroups: string[], equipment: string[]) => void;
}

/**
 * A bottom sheet component for filtering exercises by muscle group and equipment type.
 * 
 * Features:
 * - Tabbed interface (Muscle Groups / Equipment Type)
 * - Multi-select with chip UI
 * - Apply/Cancel actions
 * - Temporary selections (apply on confirm)
 * - Auto-reset on cancel
 * 
 * @example
 * ```tsx
 * const sheetRef = useRef<BottomSheet>(null);
 * 
 * <ExerciseFilterSheet
 *   ref={sheetRef}
 *   availableMuscleGroups={['chest', 'back', 'legs']}
 *   availableEquipment={['barbell', 'dumbbell']}
 *   selectedMuscleGroups={['chest']}
 *   selectedEquipment={[]}
 *   onApply={(muscleGroups, equipment) => console.log('Filters applied')}
 * />
 * ```
 */
export const ExerciseFilterSheet = forwardRef<BottomSheet, ExerciseFilterSheetProps>(
  ({ availableMuscleGroups, availableEquipment, selectedMuscleGroups, selectedEquipment, onApply }, ref) => {
    const theme = useTheme<Theme>();
    const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.75], []);
    
    const [activeTab, setActiveTab] = useState<'muscleGroups' | 'equipment'>('muscleGroups');
    const [tempMuscleGroups, setTempMuscleGroups] = useState<string[]>(selectedMuscleGroups);
    const [tempEquipment, setTempEquipment] = useState<string[]>(selectedEquipment);

    // Reset temporary selections when sheet closes
    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        setTempMuscleGroups(selectedMuscleGroups);
        setTempEquipment(selectedEquipment);
      }
    }, [selectedMuscleGroups, selectedEquipment]);

    // Render backdrop with fade effect
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    // Toggle muscle group selection
    const toggleMuscleGroup = useCallback((muscleGroup: string) => {
      setTempMuscleGroups(prev =>
        prev.includes(muscleGroup)
          ? prev.filter(m => m !== muscleGroup)
          : [...prev, muscleGroup]
      );
    }, []);

    // Toggle equipment selection
    const toggleEquipment = useCallback((equipment: string) => {
      setTempEquipment(prev =>
        prev.includes(equipment)
          ? prev.filter(e => e !== equipment)
          : [...prev, equipment]
      );
    }, []);

    // Apply filters and close sheet
    const handleApply = useCallback(() => {
      onApply(tempMuscleGroups, tempEquipment);
      (ref as any)?.current?.close();
    }, [tempMuscleGroups, tempEquipment, onApply, ref]);

    // Cancel and reset selections
    const handleCancel = useCallback(() => {
      setTempMuscleGroups(selectedMuscleGroups);
      setTempEquipment(selectedEquipment);
      (ref as any)?.current?.close();
    }, [selectedMuscleGroups, selectedEquipment, ref]);

    // Format snake_case strings to Title Case
    const formatLabel = useCallback((str: string) => {
      return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }, []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: theme.colors['bg/page'],
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors['border/subtle'],
          width: 40,
          height: 4,
        }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <Box flex={1} paddingHorizontal="l">
            {/* Header */}
            <Box marginBottom="m">
              <Text variant="h2" color="text/primary" textAlign="center">
                Exercise filters
              </Text>
            </Box>

            {/* Tabs */}
            <Box flexDirection="row" marginBottom="m" borderBottomWidth={1} borderBottomColor="border/subtle">
              <TouchableOpacity
                onPress={() => setActiveTab('muscleGroups')}
                style={{ flex: 1, paddingVertical: 12 }}
              >
                <Box
                  alignItems="center"
                  borderBottomWidth={activeTab === 'muscleGroups' ? 2 : 0}
                  borderBottomColor="brand/primary"
                  paddingBottom="xs"
                >
                  <Text
                    variant="body"
                    color={activeTab === 'muscleGroups' ? 'text/primary' : 'text/secondary'}
                    style={{ fontWeight: activeTab === 'muscleGroups' ? '600' : '400' }}
                  >
                    Muscle Groups{tempMuscleGroups.length > 0 ? ` (${tempMuscleGroups.length})` : ''}
                  </Text>
                </Box>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('equipment')}
                style={{ flex: 1, paddingVertical: 12 }}
              >
                <Box
                  alignItems="center"
                  borderBottomWidth={activeTab === 'equipment' ? 2 : 0}
                  borderBottomColor="brand/primary"
                  paddingBottom="xs"
                >
                  <Text
                    variant="body"
                    color={activeTab === 'equipment' ? 'text/primary' : 'text/secondary'}
                    style={{ fontWeight: activeTab === 'equipment' ? '600' : '400' }}
                  >
                    Equipment{tempEquipment.length > 0 ? ` (${tempEquipment.length})` : ''}
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>

            {/* Filter Options */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <Box flexDirection="row" flexWrap="wrap" paddingBottom="xl">
                {activeTab === 'muscleGroups' &&
                  availableMuscleGroups.map((muscleGroup) => {
                    const isSelected = tempMuscleGroups.includes(muscleGroup);
                    return (
                      <TouchableOpacity
                        key={muscleGroup}
                        onPress={() => toggleMuscleGroup(muscleGroup)}
                        activeOpacity={0.7}
                      >
                        <Box
                          backgroundColor={isSelected ? 'brand/primary' : 'bg/surface'}
                          borderWidth={1}
                          borderColor={isSelected ? 'brand/primary' : 'border/subtle'}
                          borderRadius="md"
                          paddingHorizontal="lg"
                          paddingVertical="m"
                          marginRight="s"
                          marginBottom="s"
                        >
                          <Text
                            variant="body"
                            color={isSelected ? 'brand/onPrimary' : 'text/primary'}
                            style={{ fontWeight: isSelected ? '600' : '400' }}
                          >
                            {formatLabel(muscleGroup)}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    );
                  })}

                {activeTab === 'equipment' &&
                  availableEquipment.map((equipment) => {
                    const isSelected = tempEquipment.includes(equipment);
                    return (
                      <TouchableOpacity
                        key={equipment}
                        onPress={() => toggleEquipment(equipment)}
                        activeOpacity={0.7}
                      >
                        <Box
                          backgroundColor={isSelected ? 'brand/primary' : 'bg/surface'}
                          borderWidth={1}
                          borderColor={isSelected ? 'brand/primary' : 'border/subtle'}
                          borderRadius="md"
                          paddingHorizontal="lg"
                          paddingVertical="m"
                          marginRight="s"
                          marginBottom="s"
                        >
                          <Text
                            variant="body"
                            color={isSelected ? 'brand/onPrimary' : 'text/primary'}
                            style={{ fontWeight: isSelected ? '600' : '400' }}
                          >
                            {formatLabel(equipment)}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    );
                  })}
              </Box>
            </ScrollView>

            {/* Action Buttons */}
            <Box
              flexDirection="row"
              gap="m"
              paddingVertical="m"
              borderTopWidth={1}
              borderTopColor="border/subtle"
            >
              <Box flex={1}>
                <Button variant="ghost" fullWidth onPress={handleCancel}>
                  Cancel
                </Button>
              </Box>
              <Box flex={1}>
                <Button variant="primary" fullWidth onPress={handleApply}>
                  Apply
                </Button>
              </Box>
            </Box>
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

ExerciseFilterSheet.displayName = 'ExerciseFilterSheet';


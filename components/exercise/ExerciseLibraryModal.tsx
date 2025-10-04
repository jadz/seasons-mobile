import React, { forwardRef, useMemo, useState, useCallback, useRef, useEffect, useImperativeHandle } from 'react';
import { Modal, FlatList, TouchableOpacity, SafeAreaView, TextInput as RNTextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box, Text, Button, TextInput } from '../ui';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../ui/foundation/theme';
import { Exercise } from '../../domain/models/exercise';
import { ExerciseFilterSheet } from './ExerciseFilterSheet';
import { exerciseStore } from '../../store/exercise';
import { createDomainLogger } from '../../utils/logger';
import BottomSheet from '@gorhom/bottom-sheet';

const logger = createDomainLogger('EXERCISE_LIBRARY_MODAL');

/**
 * Props for the ExerciseLibraryModal component
 */
export interface ExerciseLibraryModalProps {
  /** Maximum number of exercises that can be selected. Defaults to 10. */
  maxSelection?: number;
  /** Array of exercise IDs that should be preselected when modal opens */
  preselectedExerciseIds?: string[];
  /** Callback fired when user confirms their selection */
  onApply: (exercises: Exercise[]) => void;
  /** Optional callback fired when user cancels */
  onCancel?: () => void;
  /** Optional title for the modal header. Defaults to "Select Exercises" */
  title?: string;
  /** Optional placeholder for search input. Defaults to "Search exercise" */
  searchPlaceholder?: string;
}

/**
 * Ref interface for controlling the modal from parent component
 */
export interface ExerciseLibraryModalRef {
  open: () => void;
  close: () => void;
}

/**
 * A powerful, performant exercise selection modal with search, filtering, and multi-selection capabilities.
 * 
 * Features:
 * - Search exercises by name
 * - Filter by muscle group and equipment type
 * - Multi-select with configurable limits
 * - Virtualized list for optimal performance
 * - Auto-focus search on open
 * - Preselect exercises
 * 
 * @example
 * ```tsx
 * const modalRef = useRef<ExerciseLibraryModalRef>(null);
 * 
 * <ExerciseLibraryModal
 *   ref={modalRef}
 *   maxSelection={3}
 *   preselectedExerciseIds={['id1', 'id2']}
 *   onApply={(exercises) => console.log('Selected:', exercises)}
 * />
 * ```
 */
export const ExerciseLibraryModal = forwardRef<ExerciseLibraryModalRef, ExerciseLibraryModalProps>(
  ({ 
    maxSelection = 10, 
    preselectedExerciseIds = [], 
    onApply, 
    onCancel,
    title = 'Select Exercises',
    searchPlaceholder = 'Search exercise'
  }, ref) => {
    const theme = useTheme<Theme>();
    
    // Modal visibility state
    const [isVisible, setIsVisible] = useState(false);
    const searchInputRef = useRef<RNTextInput>(null);
    const filterSheetRef = useRef<BottomSheet>(null);
    const listRef = useRef<FlatList>(null);
    
    // Exercise data from store
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Expose open/close methods to parent
    useImperativeHandle(ref, () => ({
      open: () => setIsVisible(true),
      close: () => setIsVisible(false),
    }));
    
    // Subscribe to store changes and load initial data
    useEffect(() => {
      const componentMountTime = performance.now();
      logger.info('ExerciseLibraryModal component mounted');
      
      // Initial load
      const loadStartTime = performance.now();
      const exercises = exerciseStore.exercises.get();
      const loading = exerciseStore.isLoading.get();
      const loadEndTime = performance.now();
      
      logger.info(`Initial data load: ${exercises.length} exercises in ${(loadEndTime - loadStartTime).toFixed(2)}ms`);
      
      setAllExercises(exercises);
      setIsLoading(loading);
      
      const setStateEndTime = performance.now();
      logger.info(`Component ready in ${(setStateEndTime - componentMountTime).toFixed(2)}ms total`);
      
      // Subscribe to store changes
      const unsubscribeExercises = exerciseStore.exercises.onChange(() => {
        const changeStart = performance.now();
        const updatedExercises = exerciseStore.exercises.get();
        setAllExercises(updatedExercises);
        const changeEnd = performance.now();
        logger.debug(`Exercise data changed: ${updatedExercises.length} exercises, updated in ${(changeEnd - changeStart).toFixed(2)}ms`);
      });
      
      const unsubscribeLoading = exerciseStore.isLoading.onChange(() => {
        setIsLoading(exerciseStore.isLoading.get());
      });
      
      return () => {
        unsubscribeExercises();
        unsubscribeLoading();
      };
    }, []);
    
    // Local state for search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>(preselectedExerciseIds);
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [showSelectedExercises, setShowSelectedExercises] = useState(false);

    // Reset selections when modal opens/closes
    useEffect(() => {
      if (isVisible) {
        setSelectedExerciseIds(preselectedExerciseIds);
        logger.info('ExerciseLibraryModal opened');
        // Auto-focus search input after modal animation
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 300);
      } else {
        // Reset when modal closes
        setSearchQuery('');
        setSelectedMuscleGroups([]);
        setSelectedEquipment([]);
        setShowSelectedExercises(false);
        logger.info('ExerciseLibraryModal closed');
      }
    }, [isVisible, preselectedExerciseIds]);

    // Get unique muscle groups and equipment from all exercises
    const availableMuscleGroups = useMemo(() => {
      const groups = new Set(allExercises.map(ex => ex.primaryMuscleGroup));
      return Array.from(groups).sort();
    }, [allExercises]);

    const availableEquipment = useMemo(() => {
      const equipment = new Set(allExercises.map(ex => ex.equipmentCategory));
      return Array.from(equipment).sort();
    }, [allExercises]);

    // Filter exercises based on search query and selected filters
    // Selected exercises are pinned to the top for better visibility
    const filteredExercises = useMemo(() => {
      const filterStart = performance.now();
      let filtered = allExercises;

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(ex => ex.name.toLowerCase().includes(query));
      }

      // Apply muscle group filter
      if (selectedMuscleGroups.length > 0) {
        filtered = filtered.filter(ex =>
          selectedMuscleGroups.includes(ex.primaryMuscleGroup)
        );
      }

      // Apply equipment filter
      if (selectedEquipment.length > 0) {
        filtered = filtered.filter(ex =>
          selectedEquipment.includes(ex.equipmentCategory)
        );
      }

      // Separate selected and unselected exercises
      const selected = filtered.filter(ex => selectedExerciseIds.includes(ex.id));
      const unselected = filtered.filter(ex => !selectedExerciseIds.includes(ex.id));

      const filterEnd = performance.now();
      logger.debug(`Filtered ${allExercises.length} → ${filtered.length} exercises (${selected.length} selected) in ${(filterEnd - filterStart).toFixed(2)}ms`);
      
      // Return selected exercises first, then unselected
      return [...selected, ...unselected];
    }, [allExercises, searchQuery, selectedMuscleGroups, selectedEquipment, selectedExerciseIds]);

    // Toggle exercise selection
    const toggleExerciseSelection = useCallback((exerciseId: string) => {
      setSelectedExerciseIds(prev => {
        if (prev.includes(exerciseId)) {
          return prev.filter(id => id !== exerciseId);
        } else {
          // Check max selection limit
          if (prev.length >= maxSelection) {
            return prev;
          }
          return [...prev, exerciseId];
        }
      });
    }, [maxSelection]);

    // Handle confirm button press
    const handleApply = useCallback(() => {
      const selectedExercises = allExercises.filter(ex =>
        selectedExerciseIds.includes(ex.id)
      );
      onApply(selectedExercises);
      setIsVisible(false);
    }, [allExercises, selectedExerciseIds, onApply]);

    // Handle cancel button press
    const handleCancel = useCallback(() => {
      // If user has selections, confirm before closing
      if (selectedExerciseIds.length > 0) {
        Alert.alert(
          'Discard selections?',
          `You have ${selectedExerciseIds.length} exercise${selectedExerciseIds.length > 1 ? 's' : ''} selected. Are you sure you want to cancel?`,
          [
            {
              text: 'Keep selecting',
              style: 'cancel',
            },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => {
                onCancel?.();
                setIsVisible(false);
              },
            },
          ]
        );
      } else {
        onCancel?.();
        setIsVisible(false);
      }
    }, [selectedExerciseIds, onCancel]);

    // Open filter sheet
    const handleFilterPress = useCallback(() => {
      filterSheetRef.current?.snapToIndex(0);
    }, []);

    // Apply filters from filter sheet
    const handleFilterApply = useCallback((muscleGroups: string[], equipment: string[]) => {
      setSelectedMuscleGroups(muscleGroups);
      setSelectedEquipment(equipment);
    }, []);

    // Toggle showing selected exercises
    const handleSelectionIndicatorPress = useCallback(() => {
      setShowSelectedExercises(prev => !prev);
    }, []);

    // Format snake_case strings to Title Case
    const formatLabel = useCallback((str: string) => {
      return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }, []);

    // Render exercise item in list
    const renderExerciseItem = useCallback(({ item: exercise }: { item: Exercise }) => {
      const isSelected = selectedExerciseIds.includes(exercise.id);
      const isDisabled = !isSelected && selectedExerciseIds.length >= maxSelection;
      
      return (
        <TouchableOpacity
          onPress={() => toggleExerciseSelection(exercise.id)}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Box
            backgroundColor="bg/page"
            borderWidth={1}
            borderColor={isSelected ? 'brand/primary' : 'border/subtle'}
            borderRadius="md"
            marginHorizontal="l"
            marginBottom="s"
            paddingVertical="m"
            paddingHorizontal="m"
            opacity={isDisabled ? 0.4 : 1}
          >
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Box flex={1}>
                <Text variant="body" color="text/primary" marginBottom="xs">
                  {exercise.name}
                </Text>
                <Text variant="small" color="text/secondary">
                  {formatLabel(exercise.primaryMuscleGroup)} • {formatLabel(exercise.equipmentCategory)}
                </Text>
              </Box>
              {isSelected && (
                <Box 
                  backgroundColor="brand/primary" 
                  borderRadius="round" 
                  width={24} 
                  height={24}
                  justifyContent="center"
                  alignItems="center"
                  marginLeft="s"
                >
                  <Ionicons name="checkmark" size={16} color={theme.colors['brand/onPrimary']} />
                </Box>
              )}
            </Box>
          </Box>
        </TouchableOpacity>
      );
    }, [selectedExerciseIds, maxSelection, theme, toggleExerciseSelection, formatLabel]);

    const keyExtractor = useCallback((item: Exercise) => item.id, []);

    const ListEmptyComponent = useCallback(() => (
      <Box paddingVertical="xl" alignItems="center" paddingHorizontal="l">
        <Text variant="body" color="text/secondary" textAlign="center">
          {isLoading ? 'Loading exercises...' : 'No exercises found.\nTry adjusting your filters.'}
        </Text>
      </Box>
    ), [isLoading]);

    const ListFooterComponent = useCallback(() => (
      <Box paddingBottom="l" />
    ), []);

    // Get filter summary text for active filters display
    const filterSummaryText = useMemo(() => {
      const filters: string[] = [];
      
      if (selectedMuscleGroups.length > 0) {
        if (selectedMuscleGroups.length <= 2) {
          filters.push(...selectedMuscleGroups.map(formatLabel));
        } else {
          filters.push(`${selectedMuscleGroups.slice(0, 2).map(formatLabel).join(', ')}, ${formatLabel(selectedMuscleGroups[2])}`);
        }
      }
      
      if (selectedEquipment.length > 0) {
        if (selectedEquipment.length <= 2) {
          filters.push(...selectedEquipment.map(formatLabel));
        } else {
          filters.push(`${selectedEquipment.slice(0, 2).map(formatLabel).join(', ')}`);
        }
      }
      
      return filters.join(' • ');
    }, [selectedMuscleGroups, selectedEquipment, formatLabel]);

    const totalFilterCount = selectedMuscleGroups.length + selectedEquipment.length;

    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel} // Handles both swipe-down and hardware back button
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors['bg/page'] }}>
          {/* Fixed Header */}
          <Box paddingHorizontal="l" paddingTop="m" backgroundColor="bg/page">
            {/* Header Actions */}
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="m">
              <TouchableOpacity onPress={handleCancel} activeOpacity={0.7} style={{ minWidth: 60 }}>
                <Text variant="body" color="text/secondary">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <Text variant="body" color="text/primary" style={{ fontWeight: '600' }}>
                {title}
              </Text>
              
              <TouchableOpacity 
                onPress={handleApply} 
                activeOpacity={0.7} 
                disabled={selectedExerciseIds.length === 0}
                style={{ minWidth: 60, alignItems: 'flex-end' }}
              >
                <Text 
                  variant="body" 
                  color={selectedExerciseIds.length === 0 ? 'text/secondary' : 'brand/primary'}
                  style={{ fontWeight: '600' }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </Box>

            {/* Search Input */}
            <Box marginBottom="m">
              <TextInput
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                selectTextOnFocus
                variant="filled"
                leftIcon={
                  <Ionicons 
                    name="search" 
                    size={20} 
                    color={theme.colors['text/secondary']} 
                  />
                }
              />
            </Box>

            {/* Filter Button or Active Filters Display */}
            {totalFilterCount === 0 ? (
              <Box marginBottom="m">
                <Button variant="secondary" fullWidth onPress={handleFilterPress}>
                  Filter Exercises
                </Button>
              </Box>
            ) : (
              <Box marginBottom="m">
                <TouchableOpacity onPress={handleFilterPress} activeOpacity={0.7}>
                  <Box
                    backgroundColor="bg/surface"
                    borderWidth={1}
                    borderColor="brand/primary"
                    borderRadius="md"
                    paddingHorizontal="m"
                    paddingVertical="m"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flex={1} marginRight="s">
                      <Text
                        variant="body"
                        color="text/primary"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {filterSummaryText}
                      </Text>
                    </Box>
                    <Box
                      backgroundColor="brand/primary"
                      borderRadius="round"
                      width={24}
                      height={24}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text variant="small" color="brand/onPrimary" style={{ fontWeight: '600' }}>
                        {totalFilterCount}
                      </Text>
                    </Box>
                  </Box>
                </TouchableOpacity>
              </Box>
            )}

            {/* Selection Indicator - Expandable to view selected exercises */}
            {selectedExerciseIds.length > 0 && (
              <Box marginBottom="m">
                <TouchableOpacity onPress={handleSelectionIndicatorPress} activeOpacity={0.7}>
                  <Box 
                    backgroundColor="brand/primary" 
                    borderRadius="md" 
                    paddingHorizontal="m" 
                    paddingVertical="s"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap="xs"
                  >
                    <Text variant="small" color="brand/onPrimary" textAlign="center" style={{ fontWeight: '600' }}>
                      {selectedExerciseIds.length} of {maxSelection} selected
                    </Text>
                    <Ionicons 
                      name={showSelectedExercises ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={theme.colors['brand/onPrimary']} 
                    />
                  </Box>
                </TouchableOpacity>
                
                {/* Expanded Selected Exercises List */}
                {showSelectedExercises && (
                  <Box 
                    backgroundColor="bg/surface"
                    borderRadius="md"
                    marginTop="s"
                    paddingVertical="s"
                  >
                    {allExercises
                      .filter(ex => selectedExerciseIds.includes(ex.id))
                      .map((exercise) => (
                        <TouchableOpacity
                          key={exercise.id}
                          onPress={() => toggleExerciseSelection(exercise.id)}
                          activeOpacity={0.7}
                        >
                          <Box
                            paddingHorizontal="m"
                            paddingVertical="s"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box flex={1}>
                              <Text variant="body" color="text/primary" numberOfLines={1}>
                                {exercise.name}
                              </Text>
                            </Box>
                            <TouchableOpacity 
                              onPress={() => toggleExerciseSelection(exercise.id)}
                              activeOpacity={0.7}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Ionicons name="close-circle" size={20} color={theme.colors['text/secondary']} />
                            </TouchableOpacity>
                          </Box>
                        </TouchableOpacity>
                      ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Exercise List */}
          <FlatList
            ref={listRef}
            data={filteredExercises}
            renderItem={renderExerciseItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={() => <Box paddingTop="s" />}
            ListFooterComponent={ListFooterComponent}
            ListEmptyComponent={ListEmptyComponent}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
            windowSize={10}
          />
          
          {/* Filter Bottom Sheet - Always rendered for immediate access */}
          <ExerciseFilterSheet
            ref={filterSheetRef}
            availableMuscleGroups={availableMuscleGroups}
            availableEquipment={availableEquipment}
            selectedMuscleGroups={selectedMuscleGroups}
            selectedEquipment={selectedEquipment}
            onApply={handleFilterApply}
          />
        </SafeAreaView>
      </Modal>
    );
  }
);

ExerciseLibraryModal.displayName = 'ExerciseLibraryModal';


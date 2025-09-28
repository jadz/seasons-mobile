import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard, InputAccessoryView, Platform, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text, Button, WizardBar, TextInput, UnitInput, Header, Card } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../components/ui/foundation';

interface MetricData {
  id: string;
  title: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  placeholder: string;
  targetPlaceholder: string;
}

export default function SeasonSetOtherMetricsScreen() {
  // Mock selected metrics - in real app this would come from previous screen
  const selectedMetrics = ['weight', 'body-fat', 'measurements'];
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const layout = useWindowDimensions();
  
  // Tab state for TabView
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'weight', title: 'Weight' },
    { key: 'body-fat', title: 'Body Fat' },
    { key: 'measurements', title: 'Measurements' },
  ]);
  
  const metricConfigs = {
    weight: {
      title: 'Body Weight',
      unit: 'kg',
      placeholder: '70',
      targetPlaceholder: '75',
      currentLabel: 'Current weight',
      targetLabel: 'I want to',
      options: [
        { id: 'maintain', label: 'Maintain my weight', range: '±2kg' },
        { id: 'gain', label: 'Gain weight', range: '+3-8kg' },
        { id: 'lose', label: 'Lose weight', range: '-3-10kg' },
      ]
    },
    'body-fat': {
      title: 'Body Fat Percentage',
      unit: '%',
      placeholder: '15',
      targetPlaceholder: '12',
      currentLabel: 'Current body fat',
      targetLabel: 'I want to',
      options: [
        { id: 'maintain', label: 'Keep it stable', range: '±1%' },
        { id: 'reduce', label: 'Reduce body fat', range: '-2-8%' },
        { id: 'monitor', label: 'Track without goals', range: 'Track only' },
      ]
    },
    measurements: {
      title: 'Key Measurements',
      unit: 'cm',
      placeholder: '90',
      targetPlaceholder: '85',
      currentLabel: 'Current waist',
      targetLabel: 'Target waist',
    },
    photos: {
      title: 'Progress Photos',
      unit: '',
      placeholder: '',
      targetPlaceholder: '',
      currentLabel: 'Photo frequency',
      targetLabel: 'Reminder frequency',
    },
    energy: {
      title: 'Energy Levels',
      unit: '/10',
      placeholder: '6',
      targetPlaceholder: '8',
      currentLabel: 'Current energy',
      targetLabel: 'Target energy',
    },
  };

  const [metricsData, setMetricsData] = useState<MetricData[]>(
    selectedMetrics.map(metricId => {
      const config = metricConfigs[metricId as keyof typeof metricConfigs];
      return {
        id: metricId,
        title: config.title,
        currentValue: '',
        targetValue: '',
        unit: config.unit,
        placeholder: config.placeholder,
        targetPlaceholder: config.targetPlaceholder,
      };
    })
  );

  // Measurements state for the measurements metric
  const [measurementData, setMeasurementData] = useState({
    neck: { current: '', target: '' },
    chest: { current: '', target: '' },
    waist: { current: '', target: '' },
    leftBicep: { current: '', target: '' },
    rightBicep: { current: '', target: '' },
    leftThigh: { current: '', target: '' },
    rightThigh: { current: '', target: '' },
  });

  const updateMetricData = useCallback((metricId: string, field: 'currentValue' | 'targetValue', value: string) => {
    setMetricsData(prev => prev.map(metric => 
      metric.id === metricId ? { ...metric, [field]: value } : metric
    ));
  }, []);

  const handleNext = useCallback(() => {
    // Complete onboarding or navigate to final review
    console.log('Metrics data:', metricsData);
    // router.push('/onboarding/complete');
  }, [metricsData]);

  const handleSkipAll = useCallback(() => {
    // Skip setting baseline numbers and complete onboarding
    console.log('Skipping all metric baselines');
    handleNext();
  }, [handleNext]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  // Check if user has filled at least some values
  const hasAnyValues = metricsData.some(metric => 
    metric.currentValue.trim() !== '' || metric.targetValue.trim() !== ''
  );

  const getMetricConfig = (metricId: string) => {
    return metricConfigs[metricId as keyof typeof metricConfigs];
  };

  // Special handling for photos metric
  const renderPhotosMetric = (metric: MetricData, isLast: boolean = false) => (
    <Box key={metric.id}>
      <Text variant="h3" color="text/primary" marginBottom="m">
        {metric.title}
      </Text>
      
      <Box marginBottom="xl">
        <Text variant="label" color="text/secondary" marginBottom="m">
          How often would you like photo reminders?
        </Text>
        <Box flexDirection="row" flexWrap="wrap">
          {['Weekly', 'Bi-weekly', 'Monthly'].map((frequency) => (
            <Box
              key={frequency}
              backgroundColor={metric.currentValue === frequency ? 'brand/primary' : 'transparent'}
              borderWidth={1}
              borderColor={metric.currentValue === frequency ? 'brand/primary' : 'border/subtle'}
              borderRadius="md"
              paddingHorizontal="l"
              paddingVertical="m"
              marginRight="s"
              marginBottom="s"
              onTouchEnd={() => updateMetricData(metric.id, 'currentValue', frequency)}
            >
              <Text 
                variant="body" 
                color={metric.currentValue === frequency ? 'brand/onPrimary' : 'text/primary'}
              >
                {frequency}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Clear Section Separator */}
      {!isLast && (
        <Box 
          height={8} 
          backgroundColor="bg/surface"
          marginHorizontal="l"
          marginBottom="xl"
          opacity={0.6}
        />
      )}
    </Box>
  );

  // Helper function to update measurements
  const updateMeasurement = useCallback((measurementId: string, field: 'current' | 'target', value: string) => {
    setMeasurementData(prev => ({
      ...prev,
      [measurementId]: {
        ...prev[measurementId as keyof typeof prev],
        [field]: value
      }
    }));
  }, []);

  // Special handling for measurements metric
  const renderMeasurementsMetric = useCallback((metric: MetricData) => {
    const measurementGroups = [
      {
        title: 'Upper Body',
        measurements: [
          { id: 'neck', label: 'Neck', placeholder: '38' },
          { id: 'chest', label: 'Chest', placeholder: '100' },
          { id: 'waist', label: 'Waist', placeholder: '85' },
        ]
      },
      {
        title: 'Arms',
        measurements: [
          { id: 'leftBicep', label: 'Left Bicep', placeholder: '35' },
          { id: 'rightBicep', label: 'Right Bicep', placeholder: '35' },
        ]
      },
      {
        title: 'Legs',
        measurements: [
          { id: 'leftThigh', label: 'Left Thigh', placeholder: '60' },
          { id: 'rightThigh', label: 'Right Thigh', placeholder: '60' },
        ]
      }
    ];

    return (
      <Box>
        {/* Clean Header */}
        <Box marginBottom="l">
          <Text variant="h3" color="text/primary" marginBottom="xs">
            {metric.title}
          </Text>
          <Text variant="caption" color="text/secondary">
            Track any measurements you want - all optional
          </Text>
        </Box>
        
        {/* Measurement Groups */}
        {measurementGroups.map((group, groupIndex) => (
          <Box key={group.title} marginBottom="xl">
            {/* Group Title */}
            <Text variant="h4" color="text/primary" marginBottom="m">
              {group.title}
            </Text>
            
            {/* Measurements Grid - Flowing Layout */}
            <Box flexDirection="row" flexWrap="wrap" gap="m">
              {group.measurements.map((measurement) => {
                const data = measurementData[measurement.id as keyof typeof measurementData];
                const hasCurrentValue = data.current.trim() !== '';
                
                return (
                  <Box key={measurement.id} style={{ minWidth: '45%', maxWidth: '48%' }}>
                    <Text variant="bodyMedium" color="text/primary" marginBottom="s">
                      {measurement.label}
                    </Text>
                    
                    {/* Current Input */}
                    <Box marginBottom="s">
                      <Text variant="caption" color="text/secondary" marginBottom="xs">
                        Current
                      </Text>
                      <UnitInput
                        placeholder={measurement.placeholder}
                        value={data.current}
                        onChangeText={(value) => updateMeasurement(measurement.id, 'current', value)}
                        unit="cm"
                      />
                    </Box>

                    {/* Target Input - show if current has value */}
                    {hasCurrentValue && (
                      <Box>
                        <Text variant="caption" color="text/secondary" marginBottom="xs">
                          Target
                        </Text>
                        <UnitInput
                          placeholder={measurement.placeholder}
                          value={data.target}
                          onChangeText={(value) => updateMeasurement(measurement.id, 'target', value)}
                          unit="cm"
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}

      </Box>
    );
  }, [measurementData, updateMeasurement]);

  // Goal-based metric rendering for weight and body fat - CLEAN VERSION
  const renderGoalBasedMetric = useCallback((metric: MetricData) => {
    const config = getMetricConfig(metric.id);
    
    return (
      <Box>
        {/* Clean Header */}
        <Box marginBottom="l">
          <Text variant="h3" color="text/primary" marginBottom="xs">
            {metric.title}
          </Text>
        </Box>
        
        {/* Current Value - Clean Input */}
        <Box marginBottom="l">
          <Text variant="label" color="text/secondary" marginBottom="xs">
            {config.currentLabel}
          </Text>
          <UnitInput
            placeholder={metric.placeholder}
            value={metric.currentValue}
            onChangeText={(value) => updateMetricData(metric.id, 'currentValue', value)}
            unit={metric.unit}
            width={110}
          />
        </Box>

        {/* Goal Selection - Form Elements */}
        <Box marginBottom="xl">
          <Text variant="label" color="text/secondary" marginBottom="m">
            {config.targetLabel}
          </Text>
          <Box>
            {(config as any).options?.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => updateMetricData(metric.id, 'targetValue', option.id)}
                activeOpacity={0.7}
              >
                <Box
                  backgroundColor={metric.targetValue === option.id ? 'brand/primary' : 'transparent'}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor={metric.targetValue === option.id ? 'brand/primary' : 'border/subtle'}
                  paddingHorizontal="l"
                  paddingVertical="m"
                  marginBottom="s"
                >
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text 
                        variant="body" 
                        color={metric.targetValue === option.id ? 'brand/onPrimary' : 'text/primary'}
                    >
                      {option.label}
                    </Text>
                    <Box
                      backgroundColor={metric.targetValue === option.id ? 'brand/onPrimary' : 'brand/primary'}
                      borderRadius="sm"
                      paddingHorizontal="s"
                      paddingVertical="xs"
                    >
                      <Text 
                        variant="caption" 
                        color={metric.targetValue === option.id ? 'brand/primary' : 'brand/onPrimary'}
                      >
                        {option.range}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
        </Box>

      </Box>
    );
  }, [updateMetricData]);

  // Standard metric rendering for energy levels
  const renderStandardMetric = (metric: MetricData) => {
    const config = getMetricConfig(metric.id);
    
    return (
      <Box key={metric.id}>
        {/* Header with icon */}
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Box 
            borderRadius="m" 
            padding="s" 
            marginRight="m"
            backgroundColor="brand/primary"
            style={{ 
              width: 40, 
              height: 40, 
              justifyContent: 'center', 
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 20 }}>⚡</Text>
          </Box>
          <Box flex={1}>
            <Text variant="h3" color="text/primary">
              {metric.title}
            </Text>
          </Box>
        </Box>
        
        {/* Current → Target Layout */}
        <Box flexDirection="row" alignItems="flex-start" gap="l" marginBottom="xl">
          {/* Current Value */}
          <Box flex={1}>
            <Text variant="label" color="text/secondary" marginBottom="xs">
              {config.currentLabel}
            </Text>
            <UnitInput
              placeholder={metric.placeholder}
              value={metric.currentValue}
              onChangeText={(value) => updateMetricData(metric.id, 'currentValue', value)}
              unit={metric.unit}
              width={100}
            />
          </Box>

          {/* Arrow indicator */}
          <Box alignItems="center" paddingTop="l">
            <Text variant="body" color="text/secondary">
              →
            </Text>
          </Box>

          {/* Target Value */}
          <Box flex={1}>
            <Text variant="label" color="text/secondary" marginBottom="xs">
              {config.targetLabel}
            </Text>
            <UnitInput
              placeholder={metric.targetPlaceholder}
              value={metric.targetValue}
              onChangeText={(value) => updateMetricData(metric.id, 'targetValue', value)}
              unit={metric.unit}
              width={100}
            />
          </Box>
        </Box>

      </Box>
    );
  };

  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    const metric = metricsData.find(m => m.id === route.key);
    if (!metric) return null;

    let content;
    if (route.key === 'measurements') {
      content = renderMeasurementsMetric(metric);
    } else {
      content = renderGoalBasedMetric(metric);
    }

    return (
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 24, paddingBottom: 150 }} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      >
        {content}
        
        {/* Help Text */}
        <Box marginTop="xl" marginBottom="l" alignItems="center">
          <Text variant="caption" color="text/secondary" textAlign="center">
            Don't have all the numbers? No worries - you can add them later
          </Text>
        </Box>

        {/* Action Buttons */}
        <Box>
          <Button 
            variant="primary" 
            fullWidth
            onPress={handleNext}
            style={{ marginBottom: 12 }}
          >
            {hasAnyValues ? "Create my season!" : "Create season without baselines"}
          </Button>
          
          <Button 
            variant="ghost" 
            fullWidth
            onPress={handleSkipAll}
          >
            <Text color="text/secondary">
              Skip all - I'll set these up later
            </Text>
          </Button>
        </Box>
      </ScrollView>
    );
  }, [metricsData, hasAnyValues, handleNext, handleSkipAll, renderGoalBasedMetric, renderMeasurementsMetric]);

  return (
    <View style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="bg/page">
        <Box style={{ paddingTop: insets.top }} backgroundColor="bg/page" />
        {/* Header Gradient Overlay - Balanced Visibility */}
        <LinearGradient
          colors={[
            'rgba(214, 123, 123, 0.35)', // More noticeable coral at top
            'rgba(214, 123, 123, 0.22)', // Medium-strong coral
            'rgba(214, 123, 123, 0.12)', // Medium coral
            'rgba(214, 123, 123, 0.05)', // Light coral
            'rgba(235, 238, 237, 0)', // Fully transparent background
          ]}
          locations={[0, 0.3, 0.6, 0.8, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 190 + insets.top, // Cover header area properly
            zIndex: 0,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        <Header
          title="Let's build your season"
          showBackButton={true}
          onBackPress={handleBackPress}
          variant="transparent"
          backgroundColor="bg/page"
        />
        
        <Box paddingHorizontal="l">
          <WizardBar totalSteps={4} currentStep={4} />
        </Box>
        
        {/* Header Section */}
        <Box paddingHorizontal="l" paddingVertical="xl">
          <Text variant="h1" color="text/primary" marginBottom="m">
            Tell us where you are, and where you want to be
          </Text>
          <Text variant="body" color="text/secondary">
            Set your baseline numbers to track progress
          </Text>
        </Box>
        
        {/* TabView */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ 
                backgroundColor: theme.colors['brand/primary'],
                height: 3,
              }}
              style={{ 
                backgroundColor: theme.colors['bg/page'],
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors['border/subtle'],
              }}
              activeColor={theme.colors['brand/primary']}
              inactiveColor={theme.colors['text/secondary']}
            />
          )}
        />
      </Box>
    </View>
  );
}

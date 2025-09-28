import React, { useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Keyboard, InputAccessoryView, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text, Button, WizardBar, TextInput, UnitInput, Header } from '../../components/ui';
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
        { id: 'maintain', label: 'Maintain current level', range: '±1%' },
        { id: 'reduce', label: 'Reduce body fat', range: '-2-8%' },
        { id: 'monitor', label: 'Just monitor it', range: 'Track only' },
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

  const updateMetricData = (metricId: string, field: 'currentValue' | 'targetValue', value: string) => {
    setMetricsData(prev => prev.map(metric => 
      metric.id === metricId ? { ...metric, [field]: value } : metric
    ));
  };

  const handleNext = () => {
    // Complete onboarding or navigate to final review
    console.log('Metrics data:', metricsData);
    // router.push('/onboarding/complete');
  };

  const handleSkipAll = () => {
    // Skip setting baseline numbers and complete onboarding
    console.log('Skipping all metric baselines');
    handleNext();
  };

  const handleBackPress = () => {
    router.back();
  };

  // Check if user has filled at least some values
  const hasAnyValues = metricsData.some(metric => 
    metric.currentValue.trim() !== '' || metric.targetValue.trim() !== ''
  );

  const getMetricConfig = (metricId: string) => {
    return metricConfigs[metricId as keyof typeof metricConfigs];
  };

  // Special handling for photos metric
  const renderPhotosMetric = (metric: MetricData) => (
    <Box key={metric.id} marginBottom="l">
      <Box
        backgroundColor="bg/surface"
        borderRadius="l"
        padding="l"
      >
        <Text variant="h3" color="text/primary" marginBottom="m">
          {metric.title}
        </Text>
        
        <Box marginBottom="m">
          <Text variant="label" color="text/secondary" marginBottom="xs">
            How often would you like photo reminders?
          </Text>
          <Box flexDirection="row" flexWrap="wrap">
            {['Weekly', 'Bi-weekly', 'Monthly'].map((frequency) => (
              <Box
                key={frequency}
                backgroundColor={metric.currentValue === frequency ? 'primary' : 'surface'}
                borderRadius="m"
                paddingHorizontal="m"
                paddingVertical="s"
                marginRight="s"
                marginBottom="s"
                onTouchEnd={() => updateMetricData(metric.id, 'currentValue', frequency)}
              >
                <Text 
                  variant="body" 
                  color={metric.currentValue === frequency ? 'text/primary' : 'text/secondary'}
                >
                  {frequency}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Special handling for measurements metric
  const renderMeasurementsMetric = (metric: MetricData) => {
    const config = getMetricConfig(metric.id);
    return (
      <Box key={metric.id} marginBottom="l">
        <Box
          backgroundColor="bg/surface"
          borderRadius="xl"
          padding="l"
        >
          <Text variant="h3" color="text/primary" marginBottom="xs">
            {metric.title}
          </Text>
          <Text variant="caption" color="text/secondary" marginBottom="m">
            We'll start with waist measurement - you can add more later
          </Text>
          
          {/* Current Measurement */}
          <Box marginBottom="m">
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

          {/* Target Measurement */}
          <Box>
            <Text variant="label" color="text/primary" marginBottom="xs">
              {config.targetLabel}
            </Text>
            <UnitInput
              placeholder={metric.targetPlaceholder}
              value={metric.targetValue}
              onChangeText={(value) => updateMetricData(metric.id, 'targetValue', value)}
              unit={metric.unit}
              width={110}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  // Goal-based metric rendering for weight and body fat - CLEAN VERSION
  const renderGoalBasedMetric = (metric: MetricData) => {
    const config = getMetricConfig(metric.id);
    
    // Use primary theme color for all metrics
    const color = theme.colors['brand/primary'];
    
    return (
      <Box key={metric.id} marginBottom="l">
        <Box
          backgroundColor="bg/surface"
          borderRadius="l"
          padding="l"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Clean Header */}
          <Box marginBottom="m">
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
          <Box>
            <Text variant="label" color="text/secondary" marginBottom="xs">
              {config.targetLabel}
            </Text>
            <Box>
              {(config as any).options?.map((option: any) => (
                <Box
                  key={option.id}
                  backgroundColor={metric.targetValue === option.id ? 'brand/primary' : 'transparent'}
                  borderRadius="sm"
                  borderWidth={1}
                  borderColor={metric.targetValue === option.id ? 'brand/primary' : 'border/subtle'}
                  paddingHorizontal="l"
                  paddingVertical="m"
                  marginBottom="s"
                  onTouchEnd={() => updateMetricData(metric.id, 'targetValue', option.id)}
                >
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text 
                      variant="body" 
                      color={metric.targetValue === option.id ? 'brand/onPrimary' : 'text/primary'}
                      style={{ fontWeight: '500' }}
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
                        style={{ 
                          fontSize: 11,
                          fontWeight: '600',
                        }}
                      >
                        {option.range}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  // Standard metric rendering for energy levels
  const renderStandardMetric = (metric: MetricData) => {
    const config = getMetricConfig(metric.id);
    const visuals = { icon: '⚡', color: '#FFA726', bgColor: '#FFF3E0' };
    
    return (
      <Box key={metric.id} marginBottom="l">
        <Box
          backgroundColor="bg/surface"
          borderRadius="l"
          padding="l"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Header with icon */}
          <Box flexDirection="row" alignItems="center" marginBottom="m">
            <Box 
              borderRadius="m" 
              padding="s" 
              marginRight="m"
              style={{ 
                width: 40, 
                height: 40, 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: visuals.bgColor
              }}
            >
              <Text style={{ fontSize: 20 }}>{visuals.icon}</Text>
            </Box>
            <Box flex={1}>
              <Text variant="h3" color="text/primary">
                {metric.title}
              </Text>
            </Box>
          </Box>
          
          {/* Current Value */}
          <Box marginBottom="m">
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

          {/* Arrow indicator */}
          <Box alignItems="center" marginBottom="m">
            <Box
              style={{
                backgroundColor: visuals.bgColor,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontSize: 16, color: visuals.color }}>↗️</Text>
            </Box>
          </Box>

          {/* Target Value */}
          <Box>
            <Text variant="label" color="text/primary" marginBottom="xs">
              {config.targetLabel}
            </Text>
            <UnitInput
              placeholder={metric.targetPlaceholder}
              value={metric.targetValue}
              onChangeText={(value) => updateMetricData(metric.id, 'targetValue', value)}
              unit={metric.unit}
              width={110}
            />
          </Box>
        </Box>
      </Box>
    );
  };

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
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingHorizontal="l">
            {/* Header Section */}
            <Box paddingVertical="xl">
              <Text variant="h2" color="text/primary" marginBottom="m">
                Tell us where you are, and where you want to be
              </Text>
              <Text variant="body" color="text/primary" style={{ opacity: 0.9 }}>
                Set your baseline numbers to track progress
              </Text>
            </Box>
          {/* Dynamic Metric Forms */}
          <Box marginBottom="xl">
            {metricsData.map((metric) => {
              if (metric.id === 'photos') {
                return renderPhotosMetric(metric);
              } else if (metric.id === 'measurements') {
                return renderMeasurementsMetric(metric);
              } else if (metric.id === 'weight' || metric.id === 'body-fat') {
                return renderGoalBasedMetric(metric);
              } else {
                return renderStandardMetric(metric);
              }
            })}
          </Box>
          
          {/* Help Text */}
          <Box marginBottom="m" alignItems="center">
            <Text variant="caption" color="text/secondary" textAlign="center">
              Don't have all the numbers? No worries - you can add them later
            </Text>
          </Box>

          {/* Action Buttons */}
          <Box marginBottom="m">
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
        </Box>
      </ScrollView>
      </Box>
    </View>
  );
}

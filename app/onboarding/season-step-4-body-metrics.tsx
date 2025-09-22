import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, Header } from '../../components/ui';
import { SimpleSelectionButton } from '../../components/ui/selection/SimpleSelectionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MetricOption {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export default function SeasonBodyMetricsScreen() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [skipTracking, setSkipTracking] = useState(false);
  const insets = useSafeAreaInsets();

  const metricOptions: MetricOption[] = [
    {
      id: 'weight',
      title: 'Body Weight',
      description: 'Track overall weight changes',
    },
    {
      id: 'body-fat',
      title: 'Body Fat %',
      description: 'Monitor body composition',
    },
    {
      id: 'measurements',
      title: 'Body Measurements',
      description: 'Chest, waist, arms, etc.',
    },
    {
      id: 'energy',
      title: 'Energy Levels',
      description: 'How you feel day-to-day',
    },
  ];

  const handleMetricSelection = (metricId: string) => {
    if (skipTracking) {
      return; // Don't allow metric selection if skipping
    }
    
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        return prev.filter(id => id !== metricId);
      } else {
        return [...prev, metricId];
      }
    });
  };

  const handleSkipToggle = () => {
    if (!skipTracking) {
      // Clear metric selections when skipping
      setSelectedMetrics([]);
      setSkipTracking(true);
    } else {
      setSkipTracking(false);
    }
  };

  const handleNext = () => {
    // Navigate based on user selection
    console.log('Selected metrics:', selectedMetrics);
    console.log('Skip tracking:', skipTracking);
    
    if (selectedMetrics.length > 0) {
      // User selected metrics, go to set baselines screen
      router.push('/onboarding/season-step-5-set-other-metrics');
    } else {
      // User skipped tracking, complete onboarding
      // router.push('/onboarding/complete');
      console.log('Completing onboarding - no additional metrics');
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const hasSelection = selectedMetrics.length > 0 || skipTracking;

  return (
    <Box flex={1} style={{ backgroundColor: '#D67B7B' }}>
      {/* Safe Area Top */}
      <Box style={{ paddingTop: insets.top, backgroundColor:"#D67B7B" }} />
      {/* Standardized Header */}
      <Header
        title="Let's build your season"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
        backgroundColor="background"
      />
      {/* Progress Indicator */}
      <Box paddingHorizontal="l">
        <WizardBar totalSteps={4} currentStep={2} />
      </Box>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l">
          {/* Header Section */}
          <Box paddingVertical="xl">
            <Text variant="h2" color="white" marginBottom="m">
              Want to keep an eye on anything else?
            </Text>
            <Text variant="body" color="white" style={{ opacity: 0.9 }}>
              Optional ways to track your progress beyond strength
            </Text>
          </Box>
          
          {/* Metrics Selection */}
          <Box marginBottom="xl">
            <Text variant="h2" color="white" marginBottom="m">
              I'd like to track:
            </Text>
            <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" marginBottom="l">
              {metricOptions.map((metric, index) => (
                <Box 
                  key={metric.id} 
                  marginBottom="s" 
                  style={{ 
                    width: '48%', 
                    marginRight: index % 2 === 0 ? '4%' : 0 
                  }}
                >
                  <Box
                    backgroundColor={selectedMetrics.includes(metric.id) ? 'white' : 'transparent'}
                    borderRadius="m"
                    borderWidth={1}
                    borderColor="white"
                    padding="m"
                    style={{ opacity: skipTracking ? 0.4 : 1 }}
                    onTouchEnd={() => handleMetricSelection(metric.id)}
                  >
                    <Text 
                      variant="body" 
                      color={selectedMetrics.includes(metric.id) ? 'text' : 'white'}
                      marginBottom="xs"
                      style={{ fontWeight: '600' }}
                    >
                      {metric.title}
                    </Text>
                    <Text 
                      variant="caption" 
                      color={selectedMetrics.includes(metric.id) ? 'textMuted' : 'white'}
                      style={{ opacity: selectedMetrics.includes(metric.id) ? 1 : 0.8 }}
                    >
                      {metric.description}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Divider */}
          <Box alignItems="center" marginBottom="xl">
            <Box flexDirection="row" alignItems="center" width="100%">
              <Box flex={1} height={1} backgroundColor="white" style={{ opacity: 0.3 }} />
              <Text variant="body" color="white" marginHorizontal="m" style={{ opacity: 0.8 }}>
                or
              </Text>
              <Box flex={1} height={1} backgroundColor="white" style={{ opacity: 0.3 }} />
            </Box>
          </Box>

          {/* Skip Option */}
          <Box marginBottom="xl">
            <Text variant="h3" color="white" marginBottom="m">
              Keep it focused:
            </Text>
            <SimpleSelectionButton 
              title="Just focus on strength for now"
              isSelected={skipTracking}
              onPress={handleSkipToggle}
            />
            <Text variant="caption" color="white" marginTop="s" style={{ opacity: 0.8 }}>
              You can always add body tracking later
            </Text>
          </Box>
          
          {/* Help Text */}
          {!hasSelection && (
            <Box marginBottom="m" alignItems="center">
              <Text variant="caption" color="white" textAlign="center" style={{ opacity: 0.8 }}>
                Choose what you'd like to track, or skip to keep things simple
              </Text>
            </Box>
          )}

          {/* Next Button */}
          <Box marginBottom="xl">
            <Button 
              variant="primary" 
              fullWidth
              onPress={handleNext}
              disabled={!hasSelection}
            >
              {hasSelection 
                ? (skipTracking ? "Create my strength season" : "Create my season")
                : "Make a choice above"
              }
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}

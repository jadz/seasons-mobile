import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, ScrollView, TouchableWithoutFeedback, Keyboard, InputAccessoryView, Platform } from 'react-native';
import { Box, Text, Button, WizardBar, Header } from '../../components/ui';
import { SimpleSelectionButton } from '../../components/ui/selection/SimpleSelectionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
      description: 'Monitor weight changes',
    },
    {
      id: 'body-fat',
      title: 'Body Fat %',
      description: 'Keep an eye on body fat',
    },
    {
      id: 'measurements',
      title: 'Body Measurements',
      description: 'Monitor measurements',
    },
    {
      id: 'energy',
      title: 'Energy & Mood',
      description: 'Track energy and mood',
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
      router.push('/onboarding/season-step-5-set-other-metrics');
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const hasSelection = selectedMetrics.length > 0 || skipTracking;

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
        />
        
        <Box paddingHorizontal="l">
          <WizardBar totalSteps={4} currentStep={3} />
        </Box>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l">
          {/* Header Section */}
          <Box paddingVertical="xl">
            <Text variant="h1" color="text/primary" marginBottom="m">
              Want to keep an eye on anything else?
            </Text>
            <Text variant="body" color="text/secondary">
              Things to monitor while focusing on strength
            </Text>
          </Box>
          
          {/* Metrics Selection */}
          <Box marginBottom="xs">
            <Text variant="h2" color="text/primary" marginBottom="m">
              I'd like to keep an eye on:
            </Text>
            <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" marginBottom="l">
              {metricOptions.map((metric) => (
                <SimpleSelectionButton 
                  key={metric.id}
                  title={metric.title}
                  isSelected={selectedMetrics.includes(metric.id)}
                  onPress={() => handleMetricSelection(metric.id)}
                  isDisabled={skipTracking}
                />
              ))}
            </Box>
          </Box>

          {/* Divider */}
          <Box alignItems="center" marginBottom="m">
            <Box flexDirection="row" alignItems="center" width="100%">
              <Box flex={1} height={1} backgroundColor="border/subtle" />
              <Text variant="body" color="text/secondary" marginHorizontal="m">
                or
              </Text>
              <Box flex={1} height={1} backgroundColor="border/subtle" />
            </Box>
          </Box>

          {/* Skip Option */}
          <Box marginBottom="l">
            <Text variant="h2" color="text/primary" marginBottom="m">
              Keep it focused:
            </Text>
            <SimpleSelectionButton 
              title="Just focus on strength for now"
              isSelected={skipTracking}
              onPress={handleSkipToggle}
            />
            <Text variant="caption" color="text/secondary" marginTop="s">
              You can always add other things to monitor later
            </Text>
          </Box>

          {/* Next Button */}
          <Box marginBottom="m">
            <Button 
              variant="primary" 
              fullWidth
              onPress={handleNext}
              disabled={!hasSelection}
            >
              {hasSelection 
                ? (skipTracking ? "Create my strength focus season" : "Set my monitoring baselines")
                : "Choose what to monitor above"
              }
            </Button>
          </Box>
        </Box>
      </ScrollView>
      </Box>
    </View>
  );
}

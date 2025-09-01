import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingForm } from '../components/auth';

export default function OnboardingScreen() {
  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <OnboardingForm onComplete={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

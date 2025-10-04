import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type Exercise = {
  exerciseId: string;
  name: string;
  primary_muscle_group: string;
  other_muscles: string[];
  equipment_category: string;
  video_url: string;
  thumbnail_image: string;
  steps: string[];
};

export default function JSONPerformanceTest() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<string>('N/A');
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchMuscle, setSearchMuscle] = useState('');
  const [searchEquipment, setSearchEquipment] = useState('');
  
  const [idSearchTime, setIdSearchTime] = useState<number>(0);
  const [nameSearchTime, setNameSearchTime] = useState<number>(0);
  const [muscleSearchTime, setMuscleSearchTime] = useState<number>(0);
  const [equipmentSearchTime, setEquipmentSearchTime] = useState<number>(0);
  
  const [idResult, setIdResult] = useState<Exercise | null>(null);
  const [nameResults, setNameResults] = useState<Exercise[]>([]);
  const [muscleResults, setMuscleResults] = useState<Exercise[]>([]);
  const [equipmentResults, setEquipmentResults] = useState<Exercise[]>([]);

  const loadJSONData = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    
    try {
      const data = require('../assets/exercises_with_reasonable_steps.json');
      setExercises(data);
      const endTime = performance.now();
      setLoadTime(endTime - startTime);
      
      const jsonSize = JSON.stringify(data).length;
      const mbSize = (jsonSize / (1024 * 1024)).toFixed(2);
      setMemoryUsage(`~${mbSize} MB`);
    } catch (error) {
      console.error('Error loading JSON:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchById = () => {
    const start = performance.now();
    const result = exercises.find(ex => ex.exerciseId === searchId);
    const end = performance.now();
    const time = end - start;
    setIdSearchTime(time);
    setIdResult(result || null);
    console.log(`[JSON] ID Search: ${time.toFixed(3)}ms, Found: ${result ? 'Yes' : 'No'}`);
  };

  const searchByName = () => {
    const start = performance.now();
    const results = exercises.filter(ex => 
      ex.name.toLowerCase().includes(searchName.toLowerCase())
    );
    const end = performance.now();
    const time = end - start;
    setNameSearchTime(time);
    setNameResults(results.slice(0, 10));
    console.log(`[JSON] Name Search: ${time.toFixed(3)}ms, Results: ${results.length}`);
  };

  const searchByMuscle = () => {
    const start = performance.now();
    const results = exercises.filter(ex => 
      ex.primary_muscle_group === searchMuscle.toLowerCase() ||
      ex.other_muscles.some(m => m === searchMuscle.toLowerCase())
    );
    const end = performance.now();
    const time = end - start;
    setMuscleSearchTime(time);
    setMuscleResults(results.slice(0, 10));
    console.log(`[JSON] Muscle Search: ${time.toFixed(3)}ms, Results: ${results.length}`);
  };

  const searchByEquipment = () => {
    const start = performance.now();
    const results = exercises.filter(ex => 
      ex.equipment_category === searchEquipment.toLowerCase()
    );
    const end = performance.now();
    const time = end - start;
    setEquipmentSearchTime(time);
    setEquipmentResults(results.slice(0, 10));
    console.log(`[JSON] Equipment Search: ${time.toFixed(3)}ms, Results: ${results.length}`);
  };

  const runAllSearches = () => {
    searchById();
    searchByName();
    searchByMuscle();
    searchByEquipment();
  };

  useEffect(() => {
    loadJSONData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/test-sqlite-performance')}
            style={styles.switchButton}
          >
            <Text style={styles.switchButtonText}>→ SQLite</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>JSON Performance Test</Text>
        <Text style={styles.subtitle}>{exercises.length.toLocaleString()} exercises loaded</Text>
      </View>
      
      <ScrollView style={styles.content}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Load Metrics</Text>
          <View style={styles.row}>
            <Text>Load Time:</Text>
            <Text>{loadTime.toFixed(2)} ms</Text>
          </View>
          <View style={styles.row}>
            <Text>Memory Usage:</Text>
            <Text>{memoryUsage}</Text>
          </View>
          <View style={styles.row}>
            <Text>Total Exercises:</Text>
            <Text>{exercises.length.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Tests</Text>
          
          <Text style={styles.label}>Search by ID</Text>
          <TextInput
            style={styles.input}
            value={searchId}
            onChangeText={setSearchId}
            placeholder="00251201"
          />
          
          <Text style={styles.label}>Search by Name</Text>
          <TextInput
            style={styles.input}
            value={searchName}
            onChangeText={setSearchName}
            placeholder="bench"
          />
          
          <Text style={styles.label}>Search by Muscle Group</Text>
          <TextInput
            style={styles.input}
            value={searchMuscle}
            onChangeText={setSearchMuscle}
            placeholder="chest"
          />
          
          <Text style={styles.label}>Search by Equipment</Text>
          <TextInput
            style={styles.input}
            value={searchEquipment}
            onChangeText={setSearchEquipment}
            placeholder="barbell"
          />

          <TouchableOpacity 
            onPress={runAllSearches}
            disabled={exercises.length === 0}
            style={[styles.button, styles.primaryButton]}
          >
            <Text>Run All Searches</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Results & Timings</Text>
          
          <View style={styles.resultSection}>
            <View style={styles.row}>
              <Text style={styles.resultTitle}>ID Search</Text>
              <Text>{idSearchTime.toFixed(3)} ms</Text>
            </View>
            {idResult && (
              <View style={styles.resultCard}>
                <Text style={styles.smallText}>{idResult.exerciseId}</Text>
                <Text>{idResult.name}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.resultSection}>
            <View style={styles.row}>
              <Text style={styles.resultTitle}>Name Search ({nameResults.length} results)</Text>
              <Text>{nameSearchTime.toFixed(3)} ms</Text>
            </View>
            {nameResults.slice(0, 3).map(ex => (
              <View key={ex.exerciseId} style={styles.resultCard}>
                <Text style={styles.smallText}>{ex.exerciseId}</Text>
                <Text>{ex.name}</Text>
              </View>
            ))}
            {nameResults.length > 3 && (
              <Text style={styles.smallText}>+ {nameResults.length - 3} more...</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.resultSection}>
            <View style={styles.row}>
              <Text style={styles.resultTitle}>Muscle Search ({muscleResults.length} results)</Text>
              <Text>{muscleSearchTime.toFixed(3)} ms</Text>
            </View>
            {muscleResults.slice(0, 3).map(ex => (
              <View key={ex.exerciseId} style={styles.resultCard}>
                <Text style={styles.smallText}>{ex.exerciseId}</Text>
                <Text>{ex.name}</Text>
                <Text style={styles.smallText}>Primary: {ex.primary_muscle_group}</Text>
              </View>
            ))}
            {muscleResults.length > 3 && (
              <Text style={styles.smallText}>+ {muscleResults.length - 3} more...</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.resultSection}>
            <View style={styles.row}>
              <Text style={styles.resultTitle}>Equipment Search ({equipmentResults.length} results)</Text>
              <Text>{equipmentSearchTime.toFixed(3)} ms</Text>
            </View>
            {equipmentResults.slice(0, 3).map(ex => (
              <View key={ex.exerciseId} style={styles.resultCard}>
                <Text style={styles.smallText}>{ex.exerciseId}</Text>
                <Text>{ex.name}</Text>
                <Text style={styles.smallText}>Equipment: {ex.equipment_category}</Text>
              </View>
            ))}
            {equipmentResults.length > 3 && (
              <Text style={styles.smallText}>+ {equipmentResults.length - 3} more...</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          <View style={styles.row}>
            <Text>Initial Load:</Text>
            <Text>{loadTime.toFixed(2)} ms</Text>
          </View>
          <View style={styles.row}>
            <Text>Avg Search Time:</Text>
            <Text>
              {((idSearchTime + nameSearchTime + muscleSearchTime + equipmentSearchTime) / 4).toFixed(3)} ms
            </Text>
          </View>
          <View style={styles.row}>
            <Text>Memory Footprint:</Text>
            <Text>{memoryUsage}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  switchButton: {
    padding: 8,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  switchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 4,
  },
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
  },
  primaryButton: {
    marginTop: 16,
  },
  resultSection: {
    marginVertical: 8,
  },
  resultTitle: {
    fontWeight: '600',
  },
  resultCard: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 8,
  },
  smallText: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
});

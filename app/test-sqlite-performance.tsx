import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';

type Exercise = {
  exerciseId: string;
  name: string;
  primary_muscle_group: string;
  other_muscles: string;
  equipment_category: string;
  video_url: string;
  thumbnail_image: string;
  steps: string;
};

export default function SQLitePerformanceTest() {
  const router = useRouter();
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [insertTime, setInsertTime] = useState<number>(0);
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const [dbSize, setDbSize] = useState<string>('N/A');
  
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
  const [isLoading, setIsLoading] = useState(false);

  const initializeDatabase = async () => {
    setIsLoading(true);
    const startTotal = performance.now();
    
    try {
      const database = await SQLite.openDatabaseAsync('exercises.db');
      setDb(database);
      
      // Check if table exists and has data
      const checkResult = await database.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='exercises'"
      );
      
      if (checkResult.length > 0) {
        const countResult = await database.getFirstAsync<{ count: number }>(
          'SELECT COUNT(*) as count FROM exercises'
        );
        
        if (countResult && countResult.count > 0) {
          setExerciseCount(countResult.count);
          const endTotal = performance.now();
          setLoadTime(endTotal - startTotal);
          setInsertTime(0);
          setDbSize('Persisted');
          setIsInitialized(true);
          setIsLoading(false);
          console.log('[SQLite] Using existing database with', countResult.count, 'exercises');
          return;
        }
      }
      
      // Create fresh database
      console.log('[SQLite] Creating new database...');
      await database.execAsync(`
        DROP TABLE IF EXISTS exercises;
        
        CREATE TABLE IF NOT EXISTS exercises (
          exerciseId TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          primary_muscle_group TEXT NOT NULL,
          other_muscles TEXT,
          equipment_category TEXT NOT NULL,
          video_url TEXT,
          thumbnail_image TEXT,
          steps TEXT
        );
      `);
      
      // Create indexes
      await database.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_name ON exercises(name);
        CREATE INDEX IF NOT EXISTS idx_primary_muscle ON exercises(primary_muscle_group);
        CREATE INDEX IF NOT EXISTS idx_equipment ON exercises(equipment_category);
      `);
      
      const startInsert = performance.now();
      const exercisesData = require('../assets/exercises_with_reasonable_steps.json');
      console.log('[SQLite] Inserting', exercisesData.length, 'exercises...');
      
      // Insert data in transaction
      await database.withTransactionAsync(async () => {
        for (const exercise of exercisesData) {
          await database.runAsync(
            'INSERT OR REPLACE INTO exercises (exerciseId, name, primary_muscle_group, other_muscles, equipment_category, video_url, thumbnail_image, steps) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              exercise.exerciseId,
              exercise.name,
              exercise.primary_muscle_group,
              JSON.stringify(exercise.other_muscles),
              exercise.equipment_category,
              exercise.video_url,
              exercise.thumbnail_image,
              JSON.stringify(exercise.steps)
            ]
          );
        }
      });
      
      const endInsert = performance.now();
      const endTotal = performance.now();
      
      const countResult = await database.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM exercises'
      );
      
      setExerciseCount(countResult?.count || 0);
      setLoadTime(endTotal - startTotal);
      setInsertTime(endInsert - startInsert);
      setDbSize('~' + ((endInsert - startInsert) / 100).toFixed(2) + ' MB');
      setIsInitialized(true);
      console.log('[SQLite] Database initialized:', countResult?.count, 'exercises in', (endTotal - startTotal).toFixed(2), 'ms');
    } catch (error) {
      console.error('Database initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchById = async () => {
    if (!db) return;
    const start = performance.now();
    try {
      const result = await db.getFirstAsync<Exercise>(
        'SELECT * FROM exercises WHERE exerciseId = ?',
        [searchId]
      );
      const end = performance.now();
      const time = end - start;
      setIdSearchTime(time);
      setIdResult(result || null);
      console.log(`[SQLite] ID Search: ${time.toFixed(3)}ms, Found: ${result ? 'Yes' : 'No'}`);
    } catch (error) {
      console.error('Search by ID error:', error);
    }
  };

  const searchByName = async () => {
    if (!db) return;
    const start = performance.now();
    try {
      const results = await db.getAllAsync<Exercise>(
        'SELECT * FROM exercises WHERE name LIKE ? LIMIT 10',
        [`%${searchName}%`]
      );
      const end = performance.now();
      const time = end - start;
      setNameSearchTime(time);
      setNameResults(results);
      console.log(`[SQLite] Name Search: ${time.toFixed(3)}ms, Results: ${results.length}`);
    } catch (error) {
      console.error('Search by name error:', error);
    }
  };

  const searchByMuscle = async () => {
    if (!db) return;
    const start = performance.now();
    try {
      const results = await db.getAllAsync<Exercise>(
        'SELECT * FROM exercises WHERE primary_muscle_group = ? OR other_muscles LIKE ? LIMIT 10',
        [searchMuscle.toLowerCase(), `%"${searchMuscle.toLowerCase()}"%`]
      );
      const end = performance.now();
      const time = end - start;
      setMuscleSearchTime(time);
      setMuscleResults(results);
      console.log(`[SQLite] Muscle Search: ${time.toFixed(3)}ms, Results: ${results.length}`);
    } catch (error) {
      console.error('Search by muscle error:', error);
    }
  };

  const searchByEquipment = async () => {
    if (!db) return;
    const start = performance.now();
    try {
      const results = await db.getAllAsync<Exercise>(
        'SELECT * FROM exercises WHERE equipment_category = ? LIMIT 10',
        [searchEquipment.toLowerCase()]
      );
      const end = performance.now();
      const time = end - start;
      setEquipmentSearchTime(time);
      setEquipmentResults(results);
      console.log(`[SQLite] Equipment Search: ${time.toFixed(3)}ms, Results: ${results.length}`);
    } catch (error) {
      console.error('Search by equipment error:', error);
    }
  };

  const runAllSearches = async () => {
    await searchById();
    await searchByName();
    await searchByMuscle();
    await searchByEquipment();
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/test-json-performance')}
            style={styles.switchButton}
          >
            <Text style={styles.switchButtonText}>→ JSON</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>SQLite Performance Test</Text>
        <Text style={styles.subtitle}>{exerciseCount.toLocaleString()} exercises in DB</Text>
      </View>
      
      <ScrollView style={styles.content}>

        {isLoading && (
          <View style={styles.section}>
            <Text style={{textAlign: 'center'}}>Initializing database...</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Load Metrics</Text>
          <View style={styles.row}>
            <Text>Total Init Time:</Text>
            <Text>{loadTime.toFixed(2)} ms</Text>
          </View>
          {insertTime > 0 && (
            <View style={styles.row}>
              <Text>Insert Time:</Text>
              <Text>{insertTime.toFixed(2)} ms</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text>DB Size:</Text>
            <Text>{dbSize}</Text>
          </View>
          <View style={styles.row}>
            <Text>Total Exercises:</Text>
            <Text>{exerciseCount.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text>Status:</Text>
            <Text>{isInitialized ? "Ready" : "Loading"}</Text>
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
            disabled={!isInitialized}
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
            <Text>DB Init Time:</Text>
            <Text>{loadTime.toFixed(2)} ms</Text>
          </View>
          {insertTime > 0 && (
            <View style={styles.row}>
              <Text>Data Insert Time:</Text>
              <Text>{insertTime.toFixed(2)} ms</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text>Avg Search Time:</Text>
            <Text>
              {((idSearchTime + nameSearchTime + muscleSearchTime + equipmentSearchTime) / 4).toFixed(3)} ms
            </Text>
          </View>
          <View style={styles.row}>
            <Text>Database Size:</Text>
            <Text>{dbSize}</Text>
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

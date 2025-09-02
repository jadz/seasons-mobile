import 'react-native-get-random-values';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { ThemeProvider } from './components/ui';

// Must be exported or Fast Refresh won't update the context
export default function App() {
  const ctx = require.context('./app');
  return (
    <ThemeProvider initialThemeMode="system">
      <ExpoRoot context={ctx} />
    </ThemeProvider>
  );
}

registerRootComponent(App);

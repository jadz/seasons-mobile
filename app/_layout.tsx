import { Slot } from 'expo-router';
import { AuthProvider } from '../store/auth/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

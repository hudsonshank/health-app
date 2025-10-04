import { Stack } from 'expo-router';
import AuthGate from '../navigation/AuthGate';
export default function Layout(){
  return (
    <AuthGate>
      <Stack />
    </AuthGate>
  );
}

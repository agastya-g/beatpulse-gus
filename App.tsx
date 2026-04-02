import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { WebPhoneFrame } from './src/components/WebPhoneFrame';
import { PulseProvider } from './src/context/PulseContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const navigator = (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );

  return (
    <PulseProvider>
      {Platform.OS === 'web' ? <WebPhoneFrame>{navigator}</WebPhoneFrame> : navigator}
    </PulseProvider>
  );
}

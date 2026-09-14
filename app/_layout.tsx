import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { MenuProvider } from '@/contexts/MenuContext';
import { MesaProvider } from '@/contexts/MesaContext';
import { ReservaProvider } from '@/contexts/ReservaContext';

export default function RootLayout() {
  useFrameworkReady();
  
  return (
    <>
      <MesaProvider>
        <MenuProvider>
          <ReservaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ReservaProvider>
        </MenuProvider>
      </MesaProvider>
      <StatusBar style="auto" />
    </>
  );
}
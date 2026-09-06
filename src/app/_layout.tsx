import { queryClient } from '@/api/queryClients';
import { setToastRef, Toast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/authStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/poppins/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../../assets/fonts/poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/poppins/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated, fontsLoaded, fontError]);

  if (!isHydrated || (!fontsLoaded && !fontError)) return null;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="facility/[id]" options={{headerShown: false, title: 'Facility'}} />
          <Stack.Screen name="booking/[id]" options={{headerShown: false, title: 'Booking'}} />
          <Stack.Screen name="booking/new" options={{headerShown: false, title: 'Book a slot'}} />
        </Stack>
        <Toast ref={setToastRef} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

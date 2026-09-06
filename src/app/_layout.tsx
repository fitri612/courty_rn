import { queryClient } from "@/api/queryClients";
import { setToastRef, Toast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/authStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const hydrate = useAuthStore((s) => s.hydrate);
	const isHydrated = useAuthStore((s) => s.isHydrated);

	useEffect(() => {
		hydrate();
	}, [hydrate]);

	useEffect(() => {
		if (isHydrated) SplashScreen.hideAsync();
	}, [isHydrated]);

	if (!isHydrated) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<QueryClientProvider client={queryClient}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="facility/[id]" options={{ headerShown: true, title: 'Facility' }} />
					<Stack.Screen name="booking/[id]" options={{ headerShown: true, title: 'Booking' }} />
					<Stack.Screen name="booking/new" options={{ headerShown: true, title: 'Book a slot' }} />
				</Stack>
				<Toast ref={setToastRef} />
			</QueryClientProvider>
		</GestureHandlerRootView>
	);
}

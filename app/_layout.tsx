import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AppProvider } from "@/lib/AppContext";
import { useFonts, Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { Caveat_400Regular, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, headerBackTitle: "Back" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="delivery/[island]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="delivery/calendar" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="delivery/stores" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="delivery/order/[store]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="delivery/confirmation" options={{ animation: 'fade' }} />
      <Stack.Screen name="taxi/routes" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="taxi/rides" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="taxi/booking" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="taxi/confirmation" options={{ animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Caveat_400Regular,
    Caveat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <AppProvider>
              <StatusBar style="light" />
              <RootLayoutNav />
            </AppProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

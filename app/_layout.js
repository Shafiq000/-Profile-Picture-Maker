import { StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Layout = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='home/index' options={{ headerShown: false }} />
          {/* <Stack.Screen name='home/index.web' options={{ headerShown: false }} /> */}
          <Stack.Screen name='home/setting' options={{ headerShown: false }} />
          <Stack.Screen name="home/ImageEditScreen"options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default Layout;

const styles = StyleSheet.create({});

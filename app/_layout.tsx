import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MessageCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ThemeContext, type ThemeMode } from '../src/theme';

export default function RootLayout() {
  const systemScheme = useColorScheme() ?? 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    AsyncStorage.getItem('nyc-theme-mode').then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') setModeState(v);
    });
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem('nyc-theme-mode', m);
  }, []);

  const resolvedScheme = mode === 'system' ? systemScheme : mode;
  const isDark = resolvedScheme === 'dark';
  const C = Colors[isDark ? 'dark' : 'light'];

  const showFab = pathname !== '/chat';

  return (
    <ThemeContext.Provider value={{ C, mode, setMode, isDark }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="events" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      {showFab && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/chat')}
          activeOpacity={0.85}
        >
          <MessageCircle size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8590C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8590C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 999,
  },
});

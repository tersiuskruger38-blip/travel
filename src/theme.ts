import React, { createContext, useContext } from 'react';

export const Colors = {
  light: {
    bg: '#FAFAF8',
    bgCard: '#FFFFFF',
    bgElevated: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textTertiary: '#999999',
    border: '#EBEBEB',
    borderLight: '#F3F3F3',
    accent: '#E8590C',
    accentLight: '#FFF4ED',
    green: '#2B8A3E',
    greenLight: '#EDFAF0',
    red: '#E03131',
    redLight: '#FFF0F0',
  },
  dark: {
    bg: '#111111',
    bgCard: '#1A1A1A',
    bgElevated: '#222222',
    text: '#F0F0F0',
    textSecondary: '#999999',
    textTertiary: '#666666',
    border: '#2A2A2A',
    borderLight: '#222222',
    accent: '#E8590C',
    accentLight: '#2A1A0F',
    green: '#2B8A3E',
    greenLight: '#0F2A14',
    red: '#E03131',
    redLight: '#2A0F0F',
  },
};

export type Theme = typeof Colors.light;

export const CategoryColors: Record<string, string> = {
  food: '#E8590C',
  sightseeing: '#2B8A3E',
  entertainment: '#7048E8',
  nightlife: '#862E9C',
  shopping: '#D6336C',
  sports: '#1971C2',
  photo: '#E67700',
};

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  C: Theme;
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  C: Colors.light,
  mode: 'system',
  setMode: () => {},
  isDark: false,
});

export function useThemeCtx() {
  return useContext(ThemeContext);
}

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme} from './theme';
import { metrics } from './metrics';
import { MD3Theme } from 'react-native-paper';

type AppThemeContextType = {
  isDark: boolean;
  colors: MD3Theme['colors'];
  roundness: number;
  fonts: MD3Theme['fonts'];
  metrics: typeof metrics;
  paperTheme: MD3Theme;
};

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const paperTheme = isDark ? DarkTheme : LightTheme;

  const value = useMemo(() => ({
    isDark,
    colors: paperTheme.colors,
    roundness: paperTheme.roundness,
    fonts: paperTheme.fonts,
    metrics,
    paperTheme,
  }), [isDark]);

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) throw new Error('useAppTheme must be used inside AppThemeProvider');
  return context;
};

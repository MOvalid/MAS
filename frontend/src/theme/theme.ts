import { MD3LightTheme as DefaultTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import {
    DefaultTheme as NavigationLightTheme,
    DarkTheme as NavigationDarkTheme,
    Theme as NavigationTheme,
} from '@react-navigation/native';

export type CombinedColors = MD3Theme['colors'] & NavigationTheme['colors'];

export interface CombinedTheme {
    dark: boolean;
    roundness: number;
    version: number;
    isV3: boolean;
    colors: CombinedColors;
}

export const LightTheme: MD3Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000B2F',
        onPrimary: '#FFFFFF',
        primaryContainer: '#162245',
        onPrimaryContainer: '#7E8AB3',

        secondary: '#5D5E5F',
        onSecondary: '#FFFFFF',
        secondaryContainer: '#DADADA',
        onSecondaryContainer: '#5E5F60',

        tertiary: '#4F5D6C',
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#677686',
        onTertiaryContainer: '#FDFCFF',

        error: '#B41C1B',
        onError: '#FFFFFF',
        errorContainer: '#D83831',
        onErrorContainer: '#FFFBFF',

        background: '#FBF8FC',
        onBackground: '#1B1B1E',

        surface: '#FCF8F8',
        onSurface: '#1C1B1B',

        surfaceVariant: '#E2E1EB',
        onSurfaceVariant: '#45464E',

        outline: '#76767F',
        outlineVariant: '#C6C6CF',

        shadow: '#000000',
        scrim: '#000000',

        inverseSurface: '#313030',
        inverseOnSurface: '#F4F0EF',
        inversePrimary: '#BAC5F1',

        // surfaceTint: '#525D83',
        warning: '#f57c00',
        success: '#388e3c',
    },
    roundness: 8,
    fonts: {
        default: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            letterSpacing: 0,
        },
        displayLarge: {
            fontFamily: 'ITC Benguiat',
            fontWeight: '700',
            fontSize: 57,
            lineHeight: 64,
            letterSpacing: 0,
        },
        displayMedium: {
            fontFamily: 'ITC Benguiat',
            fontWeight: '700',
            fontSize: 45,
            lineHeight: 52,
            letterSpacing: 0,
        },
        displaySmall: {
            fontFamily: 'ITC Benguiat',
            fontWeight: '700',
            fontSize: 36,
            lineHeight: 44,
            letterSpacing: 0,
        },
        headlineLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '700',
            fontSize: 32,
            lineHeight: 40,
            letterSpacing: 0,
        },
        headlineMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '700',
            fontSize: 28,
            lineHeight: 36,
            letterSpacing: 0,
        },
        headlineSmall: {
            fontFamily: 'Work Sans',
            fontWeight: '700',
            fontSize: 24,
            lineHeight: 32,
            letterSpacing: 0,
        },
        titleLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '600',
            fontSize: 22,
            lineHeight: 28,
            letterSpacing: 0,
        },
        titleMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '600',
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0.15,
        },
        titleSmall: {
            fontFamily: 'Work Sans',
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.1,
        },
        labelLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '500',
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.1,
        },
        labelMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '500',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.5,
        },
        labelSmall: {
            fontFamily: 'Work Sans',
            fontWeight: '500',
            fontSize: 11,
            lineHeight: 16,
            letterSpacing: 0.5,
        },
        bodyLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0.5,
        },
        bodyMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.25,
        },
        bodySmall: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.4,
        },
    },
};

export const DarkTheme: MD3Theme = {
    ...MD3DarkTheme,
    dark: true,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#BAC5F1',
        onPrimary: '#232F52',
        primaryContainer: '#162245',
        onPrimaryContainer: '#7E8AB3',

        secondary: '#F7F6F6',
        onSecondary: '#2F3131',
        secondaryContainer: '#DADADA',
        onSecondaryContainer: '#5E5F60',

        tertiary: '#B9C8D9',
        onTertiary: '#23323F',
        tertiaryContainer: '#8392A2',
        onTertiaryContainer: '#192835',

        error: '#FFB4AB',
        onError: '#690005',
        errorContainer: '#FF5449',
        onErrorContainer: '#5C0004',

        background: '#131316',
        onBackground: '#E4E2E5',

        surface: '#141313',
        onSurface: '#E5E2E1',

        surfaceVariant: '#45464E',
        onSurfaceVariant: '#C6C6CF',

        outline: '#909099',
        outlineVariant: '#45464E',

        shadow: '#000000',
        scrim: '#000000',

        inverseSurface: '#E5E2E1',
        inverseOnSurface: '#313030',
        inversePrimary: '#525D83',

        // surfaceTint: '#BAC5F1',
        warning: '#ffb74d',
        success: '#81c784',
    },
    roundness: 8,
    fonts: {
        default: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            letterSpacing: 0,
        },
        displayLarge: {
            fontFamily: 'ITC Benguiat',
            fontWeight: '700',
            fontSize: 57,
            lineHeight: 64,
            letterSpacing: 0,
        },
        displayMedium: {
            fontFamily: 'ITC Benguiat',
            fontWeight: '700',
            fontSize: 45,
            lineHeight: 52,
            letterSpacing: 0,
        },
        displaySmall: {
            fontFamily: 'ITC Benguiat',
            fontWeight: '700',
            fontSize: 36,
            lineHeight: 44,
            letterSpacing: 0,
        },
        headlineLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '700',
            fontSize: 36,
            lineHeight: 44,
            letterSpacing: 0,
        },
        headlineMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '700',
            fontSize: 28,
            lineHeight: 36,
            letterSpacing: 0,
        },
        headlineSmall: {
            fontFamily: 'Work Sans',
            fontWeight: '700',
            fontSize: 24,
            lineHeight: 32,
            letterSpacing: 0,
        },
        titleLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '600',
            fontSize: 22,
            lineHeight: 28,
            letterSpacing: 0,
        },
        titleMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '600',
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0.15,
        },
        titleSmall: {
            fontFamily: 'Work Sans',
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.1,
        },
        labelLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '500',
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.1,
        },
        labelMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '500',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.5,
        },
        labelSmall: {
            fontFamily: 'Work Sans',
            fontWeight: '500',
            fontSize: 11,
            lineHeight: 16,
            letterSpacing: 0.5,
        },
        bodyLarge: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0.5,
        },
        bodyMedium: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.25,
        },
        bodySmall: {
            fontFamily: 'Work Sans',
            fontWeight: '400',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.4,
        },
    },
};

export const CombinedLightTheme = {
    dark: false,
    roundness: LightTheme.roundness,
    version: 3,
    isV3: true,
    colors: {
        ...NavigationLightTheme.colors,
        ...LightTheme.colors,
    },
};

export const CombinedDarkTheme: CombinedTheme = {
    dark: true,
    roundness: DarkTheme.roundness,
    version: 3,
    isV3: true,
    colors: {
        ...NavigationDarkTheme.colors,
        ...DarkTheme.colors,
    },
};

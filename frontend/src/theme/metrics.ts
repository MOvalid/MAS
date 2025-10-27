// src/theme/metrics.ts
export const metrics = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  text: {
    small: 12,
    normal: 16,
    large: 20,
    title: 24,
  },
} as const;

export type Spacing = keyof typeof metrics.spacing; // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Radius = keyof typeof metrics.radius;
export type TextSize = keyof typeof metrics.text;

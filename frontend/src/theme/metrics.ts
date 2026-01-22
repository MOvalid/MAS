export const metrics = {
    spacing: {
        xxs: 2,
        xs: 4,
        sm: 8,
        smd: 12,
        md: 16,
        lmd: 20,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 4,
        md: 8,
        lg: 16,
        xl: 32,
    },
    text: {
        small: 12,
        normal: 16,
        large: 20,
        title: 24,
    },
    element: {
        height: 56,
    },
    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    table: {
        rowHeight: 48,
        cellPaddingX: 8,
        cellPaddingY: 4,
    },
} as const;

export type Spacing = keyof typeof metrics.spacing;
export type Radius = keyof typeof metrics.radius;
export type TextSize = keyof typeof metrics.text;
export type FontWeight = keyof typeof metrics.fontWeight;

export type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';
export type FontStyle = 'normal' | 'italic';
export type AppFontWeight = 'normal' | 'bold';

export interface MetricsTable {
    rowHeight: number;
    cellPaddingX: number;
    cellPaddingY: number;
}

export interface Metrics {
    spacing: Record<Spacing, number>;
    radius: Record<Radius, number>;
    text: Record<TextSize, number>;
    element: {
        height: number;
    };
    fontWeight: Record<FontWeight, string>;
    table: MetricsTable;
}

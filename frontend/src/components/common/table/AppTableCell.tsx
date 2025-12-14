import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from '../AppText';
import { useAppTheme } from '../../../context/AppThemeContext';
import { metrics } from '../../../theme/metrics';

interface AppTableCellProps {
    content?: React.ReactNode;
    variant?: 'header' | 'cell';
    flex?: number;
    align?: 'left' | 'center' | 'right';
    style?: ViewStyle;
}

export const AppTableCell: React.FC<AppTableCellProps> = ({
    content,
    variant = 'cell',
    flex = 1,
    align = 'left',
    style,
}) => {
    const { colors } = useAppTheme();
    const isHeader = variant === 'header';

    return (
        <View style={[styles.base, { flex, alignItems: alignMap[align] }, style]}>
            {typeof content === 'string' || typeof content === 'number' ? (
                <AppText
                    variant={isHeader ? 'titleMedium' : 'bodyLarge'}
                    style={[
                        isHeader ? styles.headerText : styles.cellText,
                        {
                            color: isHeader ? colors.onSecondaryContainer : colors.onSurface,
                            textAlign: align,
                        },
                    ]}
                >
                    {content}
                </AppText>
            ) : (
                content
            )}
        </View>
    );
};

const alignMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
} as const;

const styles = StyleSheet.create({
    base: {
        flex: 1,
        minHeight: metrics.table.rowHeight,
        justifyContent: 'center',
        paddingHorizontal: metrics.table.cellPaddingX,
        paddingVertical: metrics.table.cellPaddingY,
    },
    headerText: {
        fontWeight: metrics.fontWeight.semibold,
    },
    cellText: {
        textAlignVertical: 'center',
    },
});

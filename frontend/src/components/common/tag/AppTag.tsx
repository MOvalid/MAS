import { useAppTheme } from '@/theme/AppThemeContext';
import { metrics } from '@/theme/metrics';
import React from 'react';
import { TouchableOpacity, TextStyle, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from '../AppText';

interface AppTagProps {
    label: string;
    onRemove?: () => void;
}

export const AppTag: React.FC<AppTagProps> = ({ label, onRemove }) => {
    const { colors } = useAppTheme();

    return (
        <TouchableOpacity
            onPress={onRemove}
            style={[styles.tag, { backgroundColor: colors.secondaryContainer }]}
        >
            <AppText style={[styles.tagText, { color: colors.onSecondaryContainer }]}>
                {label} {onRemove ? '✕' : ''}
            </AppText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: metrics.spacing.md,
        paddingVertical: metrics.spacing.xs,
        borderRadius: metrics.radius.xl,
        marginBottom: metrics.spacing.xs,
    } as ViewStyle,
    tagText: {
        fontSize: 14,
    } as TextStyle,
});

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import AppIconButton from '../AppIconButton';
import { metrics } from '../../../theme/metrics';
import { IconValue } from '../icons';
import { useAppTheme } from '../../../context/AppThemeContext';

export interface Action {
    icon: IconValue;
    tooltip?: string;
    onPress: () => void;
    iconColor?: string;
    disabled?: boolean;
}

interface AppTableRowActionsProps {
    actions: Action[];
    style?: ViewStyle;
}

export const AppTableRowActions: React.FC<AppTableRowActionsProps> = ({ actions, style }) => {
    const { colors } = useAppTheme();

    return (
        <Pressable onPress={() => {}} style={[styles.actionsContainer, style]}>
            {actions.map((action, index) => {
                const { icon, onPress, iconColor, disabled = false } = action;

                const finalIconColor = disabled
                    ? colors.outlineVariant || '#bdbdbd'
                    : iconColor || colors.primary;

                return (
                    <AppIconButton
                        key={index}
                        icon={icon}
                        onPress={disabled ? () => {} : onPress}
                        iconColor={finalIconColor}
                        disabled={disabled}
                    />
                );
            })}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: metrics.spacing.sm,
        paddingHorizontal: metrics.table.cellPaddingX,
        flex: 1,
    },
});

export default AppTableRowActions;

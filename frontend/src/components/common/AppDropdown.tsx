import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    DimensionValue,
    TextStyle,
    TouchableOpacity,
    LayoutChangeEvent,
} from 'react-native';
import { Menu, Icon, Text, Portal } from 'react-native-paper';
import { AppText } from './AppText';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics } from '../../theme/metrics';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

export interface DropdownOption {
    label: string;
    value: string;
}

interface AppDropdownProps {
    label?: string;
    options: DropdownOption[];
    value?: string;
    onChange: (value: string) => void;
    style?: ViewStyle;
    width?: number | string;
    height?: number | string;
    fullWidth?: boolean;
    disabled?: boolean;
    errorMessage?: string;
}

export const AppDropdown: React.FC<AppDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    style,
    width = 180,
    height = 48,
    fullWidth = false,
    disabled = false,
    errorMessage,
}) => {
    const { colors } = useAppTheme();
    const [visible, setVisible] = useState(false);
    const anchorRef = useRef<View>(null);
    const [anchorWidth, setAnchorWidth] = useState<number | undefined>(undefined);

    const getDisplayLabel = (): string => {
        const selected = options.find((o) => o.value === value);
        return selected ? selected.label : 'Wybierz opcję';
    };

    const inputContainerStyle = (colors: MD3Colors): ViewStyle => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: metrics.radius.xl,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.outlineVariant ?? colors.outline,
        backgroundColor: colors.secondaryContainer,
        paddingHorizontal: metrics.spacing.md,
        paddingVertical: metrics.spacing.md,
        height: height as DimensionValue,
    });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setAnchorWidth(width);
    };

    const containerWidth = (fullWidth ? '100%' : width) as DimensionValue;

    const handleMenuItemOnPress = (option: DropdownOption) => {
        if (disabled) return;
        onChange(option.value);
        setVisible(false);
    };

    const menuItemStyle = {
        backgroundColor: colors.secondaryContainer,
        paddingHorizontal: metrics.spacing.md,
    };

    const optionsViewStyle = {
        backgroundColor: colors.secondaryContainer,
        overflow: 'hidden' as const,
    };

    const menuItemTitleStyle = { color: colors.onSurface };

    const errorMessageStyle = {
        color: colors.error,
        fontSize: metrics.text.small,
        marginLeft: metrics.spacing.md,
    };

    const errorContainerStyle = {
        position: 'absolute' as const,
        bottom: -metrics.spacing.lg,
        left: 0,
        right: 0,
        height: metrics.spacing.lg,
        justifyContent: 'center' as const,
    };

    const getTouchableStyle = (
        colors: MD3Colors,
        containerWidth: DimensionValue,
        disabled: boolean
    ): ViewStyle => ({
        ...inputContainerStyle(colors),
        width: containerWidth,
        opacity: disabled ? 0.5 : 1,
    });

    const getMenuStyle = (colors: MD3Colors, anchorWidth?: number): ViewStyle => ({
        ...styles.menu,
        width: anchorWidth ?? undefined,
        backgroundColor: colors.secondaryContainer,
    });

    return (
        <View style={[styles.container, { width: containerWidth }, style]}>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <TouchableOpacity
                        ref={anchorRef}
                        onPress={() => !disabled && setVisible(true)}
                        onLayout={handleLayout}
                        style={getTouchableStyle(colors, containerWidth, disabled)}
                        activeOpacity={0.8}
                        disabled={disabled}
                    >
                        <AppText fontSize={metrics.text.normal} style={styles.labelText}>
                            {label ? `${label}: ` : ''}
                        </AppText>
                        <AppText
                            fontSize={metrics.text.normal}
                            style={styles.valueText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {getDisplayLabel()}
                        </AppText>
                        <Icon
                            source={visible ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                }
                anchorPosition="bottom"
                style={getMenuStyle(colors, anchorWidth)}
            >
                <View style={optionsViewStyle}>
                    {options.map((option) => (
                        <Menu.Item
                            key={option.value}
                            onPress={() => handleMenuItemOnPress(option)}
                            title={option.label}
                            titleStyle={menuItemTitleStyle}
                            style={menuItemStyle}
                        />
                    ))}
                </View>
            </Menu>

            <View style={errorContainerStyle}>
                {errorMessage ? <Text style={errorMessageStyle}>{errorMessage}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginVertical: metrics.spacing.md,
    },
    labelText: {
        marginRight: metrics.spacing.xs,
        textAlignVertical: 'center',
    } as TextStyle,
    valueText: {
        flex: 1,
        flexShrink: 1,
        overflow: 'hidden',
    } as TextStyle,
    menu: {
        elevation: 3,
    },
});

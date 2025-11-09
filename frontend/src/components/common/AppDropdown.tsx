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
import { Menu, Icon } from 'react-native-paper';
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
        paddingVertical: metrics.spacing.smd,
        height: height as DimensionValue,
    });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setAnchorWidth(width);
    };

    const containerWidth = (fullWidth ? '100%' : width) as DimensionValue;

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
                        style={[
                            inputContainerStyle(colors),
                            { width: containerWidth },
                            disabled && { opacity: 0.5 },
                        ]}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.labelText}>{label ? `${label}: ` : ''}</AppText>
                        <AppText style={styles.valueText} numberOfLines={1} ellipsizeMode="tail">
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
                style={[
                    styles.menu,
                    anchorWidth ? { width: anchorWidth } : null,
                    { backgroundColor: colors.secondaryContainer },
                ]}
            >
                <View style={{ backgroundColor: colors.secondaryContainer, overflow: 'hidden' }}>
                    {options.map((option) => (
                        <Menu.Item
                            key={option.value}
                            onPress={() => !disabled && onChange(option.value)}
                            title={option.label}
                            titleStyle={{ color: colors.onSurface }}
                            style={{
                                backgroundColor: colors.secondaryContainer,
                                paddingHorizontal: metrics.spacing.md,
                            }}
                        />
                    ))}
                </View>
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginVertical: metrics.spacing.smd,
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

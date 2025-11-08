import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Menu } from 'react-native-paper';
import { AppButton } from './AppButton';
import { metrics } from '../../theme/metrics';

export interface DropdownOption {
    label: string;
    value: string;
}

interface AppDropdownProps {
    label: string;
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    style?: ViewStyle;
    width?: number | string;
}

export const AppDropdown: React.FC<AppDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    style,
    width = 180,
}) => {
    const [visible, setVisible] = useState(false);

    const getDisplayLabel = (): string => {
        const selected = options.find((o) => o.value === value);
        return selected ? selected.label : 'Wszystkie';
    };

    return (
        <View style={[styles.container, { width: width as DimensionValue }, style]}>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <AppButton
                        mode="outlined"
                        onPress={() => setVisible(true)}
                        style={styles.button}
                    >
                        {label}: {getDisplayLabel()}
                    </AppButton>
                }
            >
                {options.map((option) => (
                    <Menu.Item
                        key={option.value}
                        onPress={() => {
                            onChange(option.value);
                            setVisible(false);
                        }}
                        title={option.label}
                    />
                ))}
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    button: {
        marginHorizontal: metrics.spacing.xs,
    },
});

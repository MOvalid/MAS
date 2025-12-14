import React from 'react';
import { StyleSheet } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type AppDrawerButtonProps = {
    label: string;
    icon: MaterialCommunityIconName;
    active?: boolean;
    onPress?: () => void;
};

export const AppDrawerButton: React.FC<AppDrawerButtonProps> = ({
    label,
    icon,
    active = false,
    onPress,
}) => {
    const theme = useTheme();

    return (
        <Drawer.Item
            label={label}
            icon={({ color, size }) => (
                <MaterialCommunityIcons name={icon} color={color} size={size} />
            )}
            active={active}
            onPress={onPress}
            style={[
                styles.item,
                active && {
                    backgroundColor: theme.colors.background,
                },
            ]}
            theme={theme}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        marginVertical: 2,
        borderRadius: 8,
    },
});

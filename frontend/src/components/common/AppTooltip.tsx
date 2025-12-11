import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { metrics } from '../../theme/metrics';
import { useAppTheme } from '../../theme/AppThemeContext';

interface AppTooltipProps {
    content: string; // tekst w tooltipie
    children: ReactNode; // element nad którym tooltip
}

export const AppTooltip: React.FC<AppTooltipProps> = ({ content, children }) => {
    const [visible, setVisible] = useState(false);
    const { colors } = useAppTheme();

    return (
        <View>
            <Pressable onPress={() => setVisible(true)}>{children}</Pressable>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={[styles.tooltip, { backgroundColor: colors.surface }]}>
                        <Text style={{ color: colors.onSurface }}>{content}</Text>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tooltip: {
        padding: metrics.spacing.sm,
        borderRadius: metrics.radius.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: metrics.radius.sm,
        elevation: 5,
    },
});

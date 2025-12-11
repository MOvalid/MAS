import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Pressable } from 'react-native';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics } from '../../theme/metrics';

interface AppModalProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({ visible, onClose, children }) => {
    const { colors } = useAppTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.modalContent, { backgroundColor: colors.surface }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: metrics.radius.lg,
        padding: metrics.spacing.xl,
        minWidth: 300,
        maxWidth: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: metrics.radius.sm,
        elevation: 5,
    },
});

import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Pressable, View } from 'react-native';
import { useAppTheme } from '../../context/AppThemeContext';
import { metrics } from '../../theme/metrics';
import { AppIconButton, IconName } from '@/components/common';

interface AppModalProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({ visible, onClose, children }) => {
    const { colors } = useAppTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            presentationStyle="formSheet"
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.modalContent, { backgroundColor: colors.surface }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.closeButtonContainer}>
                        <AppIconButton
                            icon={IconName.close}
                            onPress={onClose}
                            style={styles.closeButton}
                        />
                    </View>

                    <View style={styles.contentWrapper}>{children}</View>
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
    contentWrapper: {
        margin: metrics.spacing.md,
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
        position: 'relative',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: metrics.spacing.sm,
        right: metrics.spacing.sm,
    },
    closeButton: {
        minWidth: 40,
        minHeight: 40,
        borderRadius: metrics.radius.lg,
        padding: 0,
    },
});

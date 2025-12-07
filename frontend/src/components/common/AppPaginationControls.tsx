// src/components/common/AppAppPaginationControls.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton, AppText } from '@/components/common';
import { metrics } from '@/theme/metrics';

interface AppPaginationControlsProps {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}

export const AppPaginationControls: React.FC<AppPaginationControlsProps> = ({
    page,
    totalPages,
    onPrevious,
    onNext,
}) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: metrics.spacing.lg,
            alignItems: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <AppButton mode="outlined" disabled={page === 1} onPress={onPrevious}>
                Previous
            </AppButton>

            <AppText>
                {page} / {Math.max(1, totalPages)}
            </AppText>

            <AppButton mode="outlined" disabled={page >= totalPages} onPress={onNext}>
                Next
            </AppButton>
        </View>
    );
};

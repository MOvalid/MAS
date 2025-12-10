import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { AppText } from './AppText';
import { metrics } from '../../theme/metrics';
import { DatePickerModal } from 'react-native-paper-dates';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTheme } from 'react-native-paper';
import { formatPolishDate } from '@/utils/formatters';

interface AppDateRangeFilterProps {
    label?: string;
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;

    startError?: string;
    endError?: string;
    onErrorChange?: (error: string | null) => void;

    style?: ViewStyle;
    width?: string | number;
}

export const AppDateRangeFilter: React.FC<AppDateRangeFilterProps> = ({
    label = 'Okres',
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    startError,
    endError,
    onErrorChange,
    style,
    width = '30%',
}) => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    const validate = (start: string, end: string) => {
        if (start && end && new Date(start) > new Date(end)) {
            onErrorChange?.('Data końcowa nie może być wcześniejsza niż początkowa');
        } else {
            onErrorChange?.(null);
        }
    };
    const { colors } = useTheme();

    const onDismiss = () => setVisible(false);

    const onConfirm = (params: { startDate?: Date; endDate?: Date }) => {
        setVisible(false);

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const start = params.startDate ? formatDate(params.startDate) : '';
        const end = params.endDate ? formatDate(params.endDate) : '';

        onStartDateChange(start);
        onEndDateChange(end);

        validate(start, end);
    };

    const errorMessage = startError || endError || '';

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: metrics.spacing.sm,
        },
        inputContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        labelOverlay: {
            color: theme.colors.onSurfaceVariant,
            marginBottom: metrics.spacing.lg,
        },
        errorContainer: {
            marginTop: 4,
        },
    });

    return (
        <View style={[styles.container, { width: width as DimensionValue }, style]}>
            <View style={styles.inputContainer}>
                <AppText style={styles.labelOverlay} variant="bodyLarge">
                    {label}
                </AppText>

                <AppText
                    onPress={() => setVisible(true)}
                    variant="bodyMedium"
                    fontSize={metrics.text.normal}
                    style={[dateTextStyle(colors), errorMessage && errorTextStyle(colors)]}
                >
                    {startDate && endDate
                        ? `${formatPolishDate(startDate, false)} – ${formatPolishDate(endDate, false)}`
                        : 'Wybierz datę'}
                </AppText>

                <DatePickerModal
                    locale="pl"
                    mode="range"
                    visible={visible}
                    onDismiss={onDismiss}
                    startDate={startDate ? new Date(startDate) : undefined}
                    endDate={endDate ? new Date(endDate) : undefined}
                    onConfirm={onConfirm}
                    saveLabel="Zapisz"
                    label="Wybierz zakres dat"
                    startLabel="Początek"
                    endLabel="Koniec"
                />

                {/* Error */}
                {errorMessage ? (
                    <AppText style={errorTextStyle(colors)}>{errorMessage}</AppText>
                ) : null}
            </View>
        </View>
    );
};

const dateTextStyle = (colors: MD3Colors) => {
    return {
        padding: metrics.spacing.smd,
        paddingLeft: metrics.spacing.lmd,
        backgroundColor: colors.secondaryContainer,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: metrics.radius.xl,
        height: 48,
    };
};

const errorTextStyle = (colors: MD3Colors) => {
    return {
        marginLeft: metrics.spacing.md,
        color: colors.error,
        fontSize: metrics.text.small,
    };
};

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle, DimensionValue } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { AppText } from './AppText';
import { useAppTheme } from '../../context/AppThemeContext';
import { metrics } from '../../theme/metrics';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { formatPolishDate } from '@/utils/formatters';

interface AppDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: ViewStyle;
    width?: DimensionValue;
    errorMessage?: string;
}

export const AppDatePicker = ({
    value,
    onChange,
    placeholder = 'Wybierz datę',
    style,
    width = '100%',
    errorMessage,
}: AppDatePickerProps): React.JSX.Element => {
    const { colors } = useAppTheme();
    const styles = getStyles(colors);
    const [visible, setVisible] = useState(false);

    const currentDate = value ? new Date(value) : undefined;

    const handleDismiss = () => setVisible(false);

    const handleConfirm = ({ date }: { date?: Date }) => {
        setVisible(false);
        if (date) {
            const targetDate = new Date(date);
            targetDate.setDate(targetDate.getDate() + 1);
            targetDate.setUTCHours(0, 0, 0, 0); 
            onChange(targetDate.toISOString()); 
        }
    };

    return (
        <View style={[styles.nativeContainer, style, { width }]}>
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.nativeTouchable}>
                <AppText
                    style={[
                        {
                            color: value ? colors.onSecondaryContainer : colors.primary,
                        },
                    ]}
                >
                    {value ? formatPolishDate(value, false) : placeholder}
                </AppText>
            </TouchableOpacity>

            <DatePickerModal
                mode="single"
                visible={visible}
                onDismiss={handleDismiss}
                date={currentDate}
                onConfirm={handleConfirm}
                locale="pl"
            />

            <View style={styles.errorContainer}>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </View>
        </View>
    );
};

const getStyles = (colors: MD3Colors) => {
    return StyleSheet.create({
        nativeContainer: {
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: metrics.radius.xl,
            paddingHorizontal: metrics.spacing.smd,
            height: metrics.element.height,
            borderColor: colors.outline,
        },
        nativeTouchable: { flex: 1, justifyContent: 'center' },
        errorContainer: {
            position: 'absolute',
            bottom: -metrics.spacing.lg,
            left: 0,
            right: 0,
            height: metrics.spacing.lg,
            justifyContent: 'center',
        },
        errorText: {
            marginLeft: metrics.spacing.md,
            color: colors.error,
            fontSize: metrics.text.small,
        },
    });
};

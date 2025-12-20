import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { AppText } from './AppText';
import { useAppTheme } from '../../context/AppThemeContext';
import { metrics } from '../../theme/metrics';

interface AppDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: ViewStyle;
    width?: string | number;
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
    const [visible, setVisible] = useState(false);

    const currentDate = value ? new Date(value) : undefined;

    const handleDismiss = () => setVisible(false);

    const handleConfirm = ({ date }: { date?: Date }) => {
        setVisible(false);
        if (date) onChange(date.toISOString().split('T')[0]);
    };

    const errorStyle = {
        color: colors.error,
        marginTop: metrics.spacing.xs,
        marginLeft: metrics.spacing.md,
        fontSize: metrics.text.small,
    };
    return (
        <View style={[styles.nativeContainer, style]}>
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.nativeTouchable}>
                <AppText
                    variant="displayLarge"
                    style={[
                        {
                            color: value ? colors.onSecondaryContainer : colors.primary,
                        },
                    ]}
                >
                    {value || placeholder}
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

            {errorMessage && <Text style={errorStyle}>{errorMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    nativeContainer: {
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: metrics.radius.xl,
        paddingHorizontal: metrics.spacing.smd,
        height: metrics.element.height,
    },
    nativeTouchable: { flex: 1, justifyContent: 'center' },
    webContainer: {
        height: metrics.element.height,
        justifyContent: 'center',
        borderRadius: metrics.radius.xl,
    },
    webInput: {
        width: '100%',
        height: '100%',
        borderRadius: metrics.radius.md,
        paddingHorizontal: metrics.spacing.md,
        borderWidth: 0,
    },
});

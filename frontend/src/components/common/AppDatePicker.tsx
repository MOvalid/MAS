import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ViewStyle,
    DimensionValue,
} from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { AppText } from './AppText';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics } from '../../theme/metrics';
import { MD3Colors, MD3Typescale } from 'react-native-paper/lib/typescript/types';

interface AppDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: ViewStyle;
    width?: string | number;
}

export const AppDatePicker = ({
    value,
    onChange,
    placeholder = 'Wybierz datę',
    style,
    width = '100%',
}: AppDatePickerProps): React.JSX.Element => {
    const { colors, fonts } = useAppTheme();
    const [visible, setVisible] = useState(false);

    const dateParts = value ? value.split('-').map(Number) : [];
    const currentDate =
        dateParts.length === 3 ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2]) : undefined;

    if (Platform.OS === 'web') {
        return (
            <View style={[styles.webContainer, webContainerStyle(colors, width), style]}>
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={webInputStyle(colors, fonts)}
                />
            </View>
        );
    }

    const handleDismiss = () => setVisible(false);

    const handleConfirm = ({ date }: { date: Date | undefined }) => {
        setVisible(false);
        if (date) {
            const formatted = date.toISOString().split('T')[0];
            onChange(formatted);
        }
    };

    return (
        <View style={[styles.nativeContainer, nativeContainerStyle(colors, width), style]}>
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.nativeTouchable}>
                <AppText variant="bodyLarge" style={nativeTextStyle(colors, value)}>
                    {value || placeholder}
                </AppText>
            </TouchableOpacity>

            <DatePickerModal
                locale="pl"
                mode="single"
                visible={visible}
                onDismiss={handleDismiss}
                date={currentDate}
                onConfirm={handleConfirm}
            />
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
    nativeTouchable: {
        flex: 1,
        justifyContent: 'center',
    },
    webContainer: {
        height: metrics.element.height,
        borderWidth: 1,
        borderRadius: metrics.radius.xl,
        overflow: 'hidden',
        justifyContent: 'center',
    },
});

const nativeContainerStyle = (colors: MD3Colors, width: string | number) => ({
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.outlineVariant ?? colors.outline,
    width: width as DimensionValue,
});

const nativeTextStyle = (colors: MD3Colors, value?: string) => ({
    color: value ? colors.onSecondaryContainer : colors.primary,
});

const webContainerStyle = (colors: MD3Colors, width: string | number) => ({
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.outlineVariant ?? colors.outline,
    width: width as DimensionValue,
});

const webInputStyle = (colors: MD3Colors, fonts: MD3Typescale): React.CSSProperties => ({
    width: '80%',
    height: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: metrics.radius.md,
    paddingLeft: metrics.spacing.md,
    outline: 'none',
    cursor: 'pointer',
    color: colors.onSecondaryContainer,
    fontFamily: fonts.bodyLarge.fontFamily,
    fontSize: fonts.bodyLarge.fontSize,
});

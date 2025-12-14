// AppTextInput.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, ViewStyle, DimensionValue, StyleSheet, Text } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing } from '../../theme/metrics';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

export type AppTextInputProps = TextInputProps & {
    margin?: Spacing;
    mode?: 'flat' | 'outlined';
    fullWidth?: boolean;
    width?: number | string;
    height?: number;
    value?: string | number;
    onChangeValue?: (value: string) => void;
    errorMessage?: string;
};

export const AppTextInput: React.FC<AppTextInputProps> = ({
    margin = 'lmd',
    mode = 'outlined',
    fullWidth = false,
    width,
    height,
    style,
    value,
    onChangeText,
    onChangeValue,
    errorMessage,
    ...props
}) => {
    const { colors, metrics } = useAppTheme();
    const [internalValue, setInternalValue] = useState(
        value !== undefined && value !== null ? String(value) : ''
    );

    useEffect(() => {
        setInternalValue(value !== undefined && value !== null ? String(value) : '');
    }, [value]);

    const isMultiline = !!(height && height > 48);

    const containerStyle: ViewStyle = {
        width: (fullWidth ? '100%' : width) as DimensionValue,
        alignSelf: fullWidth ? 'stretch' : 'center',
        marginTop: metrics.spacing[margin],
        marginBottom: metrics.spacing[margin],
        borderRadius: metrics.radius.xl,
        backgroundColor: colors.secondaryContainer,
    };

    const inputStyle: ViewStyle = {
        height: height ?? 48,
        paddingVertical: isMultiline ? metrics.spacing.sm : 0,
        paddingHorizontal: metrics.spacing.md,
        borderWidth: errorMessage ? 1 : 0,
        borderColor: errorMessage ? colors.error : 'transparent',
        borderRadius: metrics.radius.xl,
    };

    const handleChangeText = (text: string) => {
        setInternalValue(text);
        onChangeText?.(text);
        onChangeValue?.(text);
    };

    const styles = useMemo(
        () => getStyles(colors, metrics, margin, errorMessage, fullWidth, width, height),
        [colors, metrics, margin, errorMessage, fullWidth, width, height]
    );

    return (
        <View style={containerStyle}>
            <TextInput
                mode={mode}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor={colors.primary}
                placeholderTextColor={colors.primary}
                theme={{
                    roundness: metrics.radius.xl,
                    colors: {
                        background: colors.secondaryContainer,
                        surface: colors.secondaryContainer,
                        outline: 'transparent',
                        primary: 'transparent',
                    },
                }}
                style={[inputStyle, style]}
                value={internalValue}
                onChangeText={handleChangeText}
                {...props}
                right={
                    <TextInput.Icon
                        icon="close"
                        size={20}
                        color={internalValue ? colors.onSurfaceVariant : 'transparent'}
                        onPress={internalValue ? () => handleChangeText('') : undefined}
                    />
                }
            />
            <View style={styles.errorContainer}>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </View>
        </View>
    );
};

const getStyles = (
    colors: MD3Colors,
    metrics: typeof import('../../theme/metrics').metrics,
    margin: Spacing,
    errorMessage?: string,
    fullWidth?: boolean,
    width?: number | string,
    height?: number
) => {
    const isMultiline = !!(height && height > 48);

    return StyleSheet.create({
        containerStyle: {
            width: (fullWidth ? '100%' : (width ?? '100%')) as DimensionValue,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
            marginTop: metrics.spacing[margin],
            marginBottom: metrics.spacing[margin],
            borderRadius: metrics.radius.xl,
            backgroundColor: colors.secondaryContainer,
            flexShrink: 1, // ważne w układzie flex
        },
        input: {
            flex: 1,
            width: '100%',
            height: height ?? 48,
            paddingVertical: isMultiline ? metrics.spacing.sm : 0,
            paddingHorizontal: metrics.spacing.md,
            borderWidth: errorMessage ? 1 : 0,
            borderColor: errorMessage ? colors.error : 'transparent',
            borderRadius: metrics.radius.xl,
        },
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

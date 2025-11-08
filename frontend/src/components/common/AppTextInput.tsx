import React from 'react';
import { View, ViewStyle, DimensionValue } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing } from '../../theme/metrics';

type AppTextInputProps = TextInputProps & {
    margin?: Spacing;
    mode?: 'flat' | 'outlined';
    fullWidth?: boolean;
    width?: number | string;
    height?: number;
};

export const AppTextInput: React.FC<AppTextInputProps> = ({
    margin = 'smd',
    mode = 'outlined',
    fullWidth = false,
    width,
    height,
    style,
    ...props
}) => {
    const { colors, metrics } = useAppTheme();

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
    };

    return (
        <View style={containerStyle}>
            <TextInput
                mode={mode}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor={colors.background}
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
                {...props}
            />
        </View>
    );
};

// import React from 'react';
// import { TextInput, TextInputProps } from 'react-native-paper';
// import { useAppTheme } from '../../theme/AppThemeContext';
// import { Spacing } from '../../theme/metrics';
// import { ViewStyle, TextStyle, StyleSheet, useWindowDimensions } from 'react-native';

// type AppTextInputProps = TextInputProps & {
//   margin?: Spacing;
//   padding?: Spacing;
//   mode?: 'flat' | 'outlined';
//   fullWidth?: boolean;
//   width?: number;
//   height?: number;
//   minWidth?: number;
//   minHeight?: number;
// };

// export const AppTextInput: React.FC<AppTextInputProps> = ({
//   margin = 'smd',
//   padding = 'smd',
//   mode = 'outlined',
//   fullWidth = false,
//   width,
//   height,
//   minWidth,
//   minHeight,
//   style,
//   ...props
// }) => {
//   const { colors, metrics } = useAppTheme();

//   const computedStyle: ViewStyle = {
//     width: fullWidth ? "100%" : width,
//     minWidth: minWidth,
//     height: height,
//     minHeight: minHeight,
//     alignSelf: fullWidth ? 'stretch' : 'center',
//     marginTop: metrics.spacing[margin],
//     marginBottom: metrics.spacing[margin],
//     borderRadius: metrics.radius.xl,
//     backgroundColor: colors.secondaryContainer,
//   };

//   return (
//     <TextInput
//       mode={mode}
//       underlineColor="transparent"
//       activeUnderlineColor="transparent"
//       outlineColor={colors.background}
//       textColor={colors.background}
//       placeholderTextColor={colors.primary}
//       theme={{
//         roundness: metrics.radius.xl,
//         colors: {
//           background: colors.secondaryContainer,
//           surface: colors.secondaryContainer,
//           outline: 'transparent',
//           primary: 'transparent',
//         },
//       }}
//       style={[styles.inputBase, computedStyle, style]}
//       contentStyle={contentStyles.content(height)}
//       {...props}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   inputBase: {
//     alignSelf: 'center',
//   },
// });

// const contentStyles = {
//   content: (height?: number): TextStyle => ({
//     height: height ?? 40,
//   }),
// };

import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing } from '../../theme/metrics';
import { DimensionValue } from 'react-native/types_generated/index';

type AppTextInputProps = TextInputProps & {
  margin?: Spacing;
  padding?: Spacing;
  mode?: 'flat' | 'outlined';
  fullWidth?: boolean;
  width?: number | string;
  height?: number;
};

export const AppTextInput: React.FC<AppTextInputProps> = ({
  margin = 'smd',
  padding = 'smd',
  mode = 'outlined',
  fullWidth = false,
  width,
  height,
  style,
  ...props
}) => {
  const { colors, metrics } = useAppTheme();

  const containerStyle: ViewStyle = {
    width: fullWidth ? '100%' as DimensionValue : width,
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

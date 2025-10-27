import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/theme';
import { AppThemeProvider } from './src/theme/AppThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/components/HomeScreen';
import AuthScreen from './src/components/AuthScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppThemeProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Auth"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppThemeProvider>
    </PaperProvider>
  );
}

import * as React from 'react';
import * as Font from 'expo-font';
import { PaperProvider } from 'react-native-paper';
import { LightTheme, DarkTheme, CombinedDarkTheme, CombinedLightTheme } from './src/theme/theme';
import { AppThemeProvider } from './src/theme/AppThemeContext';
import { 
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import HomeScreen from './src/components/HomeScreen';
import AuthScreen from './src/components/AuthScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? LightTheme : LightTheme;
  const navigationTheme = colorScheme === 'dark' ? CombinedLightTheme : CombinedLightTheme;
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'ITC Benguiat': require('./assets/fonts/ITCBenguiat.ttf'),
        'Work Sans': require('./assets/fonts/WorkSans.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <AppThemeProvider>
        <NavigationContainer theme={navigationTheme as any}>
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

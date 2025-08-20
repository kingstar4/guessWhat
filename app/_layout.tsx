import SettingsButton from '@/components/ui/SettingsButton';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryProvider } from '../providers/QueryProvider';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider';

function RootLayoutContent() {
  const { colorScheme } = useTheme();
  
  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="teamMode" options={{headerTitle: 'Team Mode'}} />
        <Stack.Screen name="category/index" options={{ headerTitle: 'Categories'}} />
        <Stack.Screen name="timer" options={{  headerShown: false}}/>
        <Stack.Screen name="countdown" options={{  headerShown: false}}/>
        <Stack.Screen name="gameRoom" options={{  headerShown: false}}/>
        <Stack.Screen name="result/index" options={{  headerShown: false}}/>
        <Stack.Screen name="settings/index" options={{ headerTitle: 'Settings' }} />
        <Stack.Screen name="settings/howToPlay" options={{ headerTitle: 'How to Play' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <SettingsButton/>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </QueryProvider>
  );
}
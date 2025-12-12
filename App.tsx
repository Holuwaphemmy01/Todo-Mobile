import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AppNavigator from './src/navigation'
import { TaskProvider } from './src/store/tasks'
import { ThemeProvider, useTheme } from './src/theme'

function Root() {
  const { theme } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <AppNavigator />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Root />
        </GestureHandlerRootView>
      </TaskProvider>
    </ThemeProvider>
  )
}

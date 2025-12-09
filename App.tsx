import React from 'react'
import { SafeAreaView } from 'react-native'
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
        <Root />
      </TaskProvider>
    </ThemeProvider>
  )
}

import React from 'react'
import { SafeAreaView } from 'react-native'
import AppNavigator from './src/navigation'
import { TaskProvider } from './src/store/tasks'

export default function App() {
  return (
    <TaskProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </TaskProvider>
  )
}

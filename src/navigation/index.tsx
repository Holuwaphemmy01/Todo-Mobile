import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TaskListScreen from '../screens/TaskListScreen'
import AddTaskScreen from '../screens/AddTaskScreen'

export type RootStackParamList = {
  TaskList: undefined
  AddTask: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
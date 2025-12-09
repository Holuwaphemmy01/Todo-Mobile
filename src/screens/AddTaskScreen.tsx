import React, { useState } from 'react'
import { Alert, SafeAreaView, Text, TextInput, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTasks } from '../store/tasks'
import { RootStackParamList } from '../navigation'

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddTask'>

export default function AddTaskScreen() {
  const nav = useNavigation<Nav>()
  const { addTask } = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const onSave = async () => {
    const t = title.trim()
    if (!t) {
      Alert.alert('Title required')
      return
    }
    await addTask(t, description)
    nav.goBack()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 14, color: '#444' }}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Enter title" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 }} />
        <Text style={{ fontSize: 14, color: '#444', marginTop: 16 }}>Description</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="Optional" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 }} />
        <Pressable onPress={onSave} style={{ marginTop: 24, backgroundColor: '#4caf50', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignSelf: 'flex-start' }}>
          <Text style={{ color: 'white' }}>Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
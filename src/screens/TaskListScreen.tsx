import React, { useState } from 'react'
import { Alert, FlatList, Pressable, SafeAreaView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTasks } from '../store/tasks'
import TaskItem from '../components/TaskItem'
import { RootStackParamList } from '../navigation'
import { recordAndTranscribe } from '../utils/voice'
import { extractTasks } from '../utils/split'

type Nav = NativeStackNavigationProp<RootStackParamList, 'TaskList'>

export default function TaskListScreen() {
  const nav = useNavigation<Nav>()
  const { tasks, toggleTask, deleteTask, addTask, loading } = useTasks()
  const [listening, setListening] = useState(false)

  const onAddVoice = async () => {
    if (listening) return
    setListening(true)
    const res = await recordAndTranscribe(6)
    setListening(false)
    if (!res.text) {
      if (res.error === 'key') Alert.alert('Missing API key')
      return
    }
    const items = extractTasks(res.text)
    for (const t of items) await addTask(t)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Loading</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18 }}>No tasks</Text>
            <Pressable onPress={() => nav.navigate('AddTask')} style={{ marginTop: 12, backgroundColor: '#2196f3', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
              <Text style={{ color: 'white' }}>Add Task</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
            renderItem={({ item }) => (
              <TaskItem task={item} onToggle={() => toggleTask(item.id)} onDelete={() => deleteTask(item.id)} />
            )}
          />
        )}
        <Pressable
          onPress={onAddVoice}
          style={{ position: 'absolute', right: 24, bottom: 24, backgroundColor: listening ? '#ff9800' : '#6200ee', borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14 }}
        >
          <Text style={{ color: 'white' }}>{listening ? 'Listening…' : 'Voice Add'}</Text>
        </Pressable>
        <Pressable onPress={() => nav.navigate('AddTask')} style={{ position: 'absolute', left: 24, bottom: 24, backgroundColor: '#2196f3', borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14 }}>
          <Text style={{ color: 'white' }}>Add Task</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
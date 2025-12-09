import React, { useMemo, useState } from 'react'
import { Alert, Pressable, SafeAreaView, SectionList, Text, TextInput, View, LayoutAnimation, Platform, UIManager, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTasks } from '../store/tasks'
import TaskItem from '../components/TaskItem'
import Snack from '../components/Snack'
import { Swipeable } from 'react-native-gesture-handler'
import { RootStackParamList } from '../navigation'
import { recordAndTranscribe } from '../utils/voice'
import { extractTasks } from '../utils/split'
import { useTheme } from '../theme'
import * as Haptics from 'expo-haptics'
import { MaterialIcons } from '@expo/vector-icons'

type Nav = NativeStackNavigationProp<RootStackParamList, 'TaskList'>

export default function TaskListScreen() {
  const nav = useNavigation<Nav>()
  const { tasks, toggleTask, deleteTask, addTask, loading, restoreTask } = useTasks()
  const { theme, toggle, setAccent } = useTheme()
  const [listening, setListening] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [quick, setQuick] = useState('')
  const [snack, setSnack] = useState<{ visible: boolean; task?: any }>(() => ({ visible: false }))

  if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental?.(true)

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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (Platform.OS === 'android') ToastAndroid.show(`Added ${items.length} task(s)`, ToastAndroid.SHORT)
  }

  const summary = useMemo(() => {
    const total = tasks.length
    const completedCount = tasks.filter(t => t.completed).length
    const overdueCount = tasks.filter(t => !t.completed && typeof t.dueDate === 'number' && t.dueDate! < Date.now()).length
    return { total, completedCount, overdueCount }
  }, [tasks])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = (t: { title: string; description?: string }) =>
      !q || t.title.toLowerCase().includes(q) || (t.description?.toLowerCase() || '').includes(q)
    const base = tasks.filter(t => match(t)).filter(t => (filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed))
    const upcoming = base.filter(t => !t.completed && typeof t.dueDate === 'number').sort((a, b) => (a.dueDate! - b.dueDate!))
    const noDue = base.filter(t => !t.completed && !t.dueDate).sort((a, b) => b.createdAt - a.createdAt)
    const completed = base.filter(t => t.completed).sort((a, b) => (a.dueDate && b.dueDate ? a.dueDate - b.dueDate : b.createdAt - a.createdAt))
    const sections: Array<{ title: string; data: typeof tasks }> = []
    if (upcoming.length) sections.push({ title: 'Upcoming', data: upcoming })
    if (noDue.length) sections.push({ title: 'No Due Date', data: noDue })
    if (completed.length) sections.push({ title: 'Completed', data: completed })
    return sections
  }, [tasks, query, filter])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.colors.text }}>Loading</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: theme.colors.text }}>No tasks</Text>
            <Pressable onPress={() => nav.navigate('AddTask')} style={{ marginTop: 12, backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
              <Text style={{ color: 'white' }}>Add Task</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 12, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search tasks"
                placeholderTextColor={theme.colors.muted}
                style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.inputBorder, backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginRight: 12 }}
              />
              <Pressable onPress={toggle} style={{ backgroundColor: theme.colors.card, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: theme.colors.divider }}>
                <Text style={{ color: theme.colors.text }}>{theme.name === 'dark' ? 'Dark' : 'Light'}</Text>
              </Pressable>
            </View>
            <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
              <Text style={{ color: theme.colors.text }}>{summary.total} tasks • {summary.completedCount} completed • {summary.overdueCount} overdue</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8, paddingHorizontal: 12 }}>
              {(['all', 'active', 'completed'] as const).map(f => (
                <Pressable key={f} onPress={() => setFilter(f)} style={{ marginRight: 8, backgroundColor: filter === f ? theme.colors.primary : theme.colors.card, borderWidth: 1, borderColor: theme.colors.divider, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: filter === f ? 'white' : theme.colors.text }}>{f[0].toUpperCase() + f.slice(1)}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginTop: 8 }}>
              {['#2196f3', '#4caf50', '#ff5722', '#9c27b0', '#607d8b'].map(c => (
                <Pressable key={c} onPress={() => setAccent(c)} style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8, backgroundColor: c, borderWidth: 2, borderColor: theme.colors.card }} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginTop: 8 }}>
              <TextInput
                value={quick}
                onChangeText={setQuick}
                placeholder="Quick add"
                placeholderTextColor={theme.colors.muted}
                style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.inputBorder, backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}
              />
              <Pressable
                onPress={async () => {
                  const t = quick.trim()
                  if (!t) return
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                  await addTask(t)
                  setQuick('')
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                  if (Platform.OS === 'android') ToastAndroid.show('Task added', ToastAndroid.SHORT)
                }}
                style={{ backgroundColor: theme.colors.secondary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' }}
              >
                <MaterialIcons name="add" size={18} color={'white'} style={{ marginRight: 6 }} />
                <Text style={{ color: 'white' }}>Add</Text>
              </Pressable>
            </View>
            <SectionList
              sections={filtered}
              keyExtractor={item => item.id}
              stickySectionHeadersEnabled
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.colors.divider }} />}
              renderSectionHeader={({ section }) => (
                <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: theme.colors.card }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{section.title}</Text>
                </View>
              )}
              renderItem={({ item }) => (
                Platform.OS === 'web' ? (
                  <TaskItem
                    task={item}
                    onToggle={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                      toggleTask(item.id)
                      Haptics.selectionAsync()
                    }}
                    onDelete={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                      deleteTask(item.id)
                      setSnack({ visible: true, task: item })
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    }}
                  />
                ) : (
                  <Swipeable
                    renderLeftActions={() => (
                      <View style={{ justifyContent: 'center', backgroundColor: theme.colors.secondary, width: 100 }}>
                        <Text style={{ color: 'white', paddingLeft: 16 }}>Complete</Text>
                      </View>
                    )}
                    renderRightActions={() => (
                      <View style={{ justifyContent: 'center', backgroundColor: theme.colors.danger, width: 100 }}>
                        <Text style={{ color: 'white', paddingLeft: 16 }}>Delete</Text>
                      </View>
                    )}
                    onSwipeableOpen={dir => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                      if (dir === 'left') {
                        toggleTask(item.id)
                        Haptics.selectionAsync()
                      } else {
                        deleteTask(item.id)
                        setSnack({ visible: true, task: item })
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                      }
                    }}
                  >
                    <TaskItem
                      task={item}
                      onToggle={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                        toggleTask(item.id)
                        Haptics.selectionAsync()
                      }}
                      onDelete={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                        deleteTask(item.id)
                        setSnack({ visible: true, task: item })
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                      }}
                    />
                  </Swipeable>
                )
              )}
            />
            <Snack
              visible={snack.visible}
              message={'Task deleted'}
              actionText={'Undo'}
              onAction={() => {
                if (!snack.task) return
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                restoreTask(snack.task)
                setSnack({ visible: false, task: undefined })
              }}
              onClose={() => setSnack({ visible: false, task: undefined })}
            />
          </View>
        )}
        <Pressable
          onPress={onAddVoice}
          style={{ position: 'absolute', right: 24, bottom: 24, backgroundColor: listening ? '#ff9800' : theme.colors.primary, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14 }}
        >
          <Text style={{ color: 'white' }}>{listening ? 'Listening…' : 'Voice Add'}</Text>
        </Pressable>
        <Pressable onPress={() => nav.navigate('AddTask')} style={{ position: 'absolute', left: 24, bottom: 24, backgroundColor: theme.colors.primary, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14 }}>
          <Text style={{ color: 'white' }}>Add Task</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
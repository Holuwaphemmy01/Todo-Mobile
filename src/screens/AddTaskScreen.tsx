import React, { useState } from 'react'
import { Alert, SafeAreaView, Text, TextInput, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTasks } from '../store/tasks'
import { RootStackParamList } from '../navigation'
import { useTheme } from '../theme'
import { Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddTask'>

export default function AddTaskScreen() {
  const nav = useNavigation<Nav>()
  const { addTask } = useTasks()
  const { theme } = useTheme()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueText, setDueText] = useState('')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  const onSave = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      Alert.alert('Title required')
      return
    }
    const dueTimestamp = Platform.OS === 'web' ? parseDate(dueText) : dueDate?.getTime() ?? null
    if (dueTimestamp && dueTimestamp < startOfToday().getTime()) {
      Alert.alert('Due date cannot be in the past')
      return
    }
    await addTask(trimmedTitle, description, dueTimestamp ?? undefined)
    nav.goBack()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 14, color: theme.colors.text }}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Enter title" placeholderTextColor={theme.colors.muted} style={{ borderWidth: 1, borderColor: theme.colors.inputBorder, backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 }} />
        <Text style={{ fontSize: 14, color: theme.colors.text, marginTop: 16 }}>Description</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="Optional" placeholderTextColor={theme.colors.muted} style={{ borderWidth: 1, borderColor: theme.colors.inputBorder, backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 }} />
        {Platform.OS === 'web' ? (
          <>
            <Text style={{ fontSize: 14, color: theme.colors.text, marginTop: 16 }}>Due date (YYYY-MM-DD)</Text>
            <TextInput value={dueText} onChangeText={setDueText} placeholder="2025-12-31" placeholderTextColor={theme.colors.muted} keyboardType="numbers-and-punctuation" style={{ borderWidth: 1, borderColor: theme.colors.inputBorder, backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 }} />
          </>
        ) : (
          <>
            <Text style={{ fontSize: 14, color: theme.colors.text, marginTop: 16 }}>Due date</Text>
            <Pressable onPress={() => setShowPicker(true)} style={{ marginTop: 6, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.inputBorder, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, alignSelf: 'flex-start' }}>
              <Text style={{ color: theme.colors.text }}>{dueDate ? dueDate.toLocaleDateString() : 'Select date'}</Text>
            </Pressable>
            {showPicker ? (
              <DateTimePicker
                value={dueDate ?? new Date()}
                mode="date"
                display="default"
                minimumDate={startOfToday()}
                onChange={(_event, date) => {
                  setShowPicker(false)
                  if (date) {
                    const min = startOfToday()
                    setDueDate(date.getTime() < min.getTime() ? min : date)
                  }
                }}
              />
            ) : null}
          </>
        )}
        <Pressable onPress={onSave} style={{ marginTop: 24, backgroundColor: theme.colors.secondary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignSelf: 'flex-start' }}>
          <Text style={{ color: 'white' }}>Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

function parseDate(dateText: string): number | null {
  const trimmedText = dateText.trim()
  if (!trimmedText) return null
  const matchDate = /^\d{4}-\d{2}-\d{2}$/.test(trimmedText) ? new Date(trimmedText + 'T00:00:00') : null
  const timestamp = matchDate && !isNaN(matchDate.getTime()) ? matchDate.getTime() : NaN
  if (isNaN(timestamp)) return null
  const min = startOfToday().getTime()
  return timestamp < min ? null : timestamp
}

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}
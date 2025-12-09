import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Task } from '../store/tasks'
import { useTheme } from '../theme'
import { MaterialIcons } from '@expo/vector-icons'

type Props = {
  task: Task
  onToggle: () => void
  onDelete: () => void
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const { theme } = useTheme()
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable onPress={onToggle} style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 16, color: task.completed ? theme.colors.muted : theme.colors.text, textDecorationLine: task.completed ? 'line-through' : 'none' }}>{task.title}</Text>
        {task.description ? (
          <Text style={{ fontSize: 12, color: theme.colors.muted }}>{task.description}</Text>
        ) : null}
        {typeof task.dueDate === 'number' ? (
          <Text style={{ fontSize: 11, color: !task.completed && task.dueDate < Date.now() ? '#e53935' : theme.colors.muted }}>
            Due: {new Date(task.dueDate).toLocaleDateString()}{!task.completed && task.dueDate < Date.now() ? ' • Overdue' : ''}
          </Text>
        ) : null}
      </Pressable>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={onToggle} style={{ backgroundColor: task.completed ? theme.colors.secondary : theme.colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginRight: 12, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name={task.completed ? 'undo' : 'check-circle'} size={18} color={'white'} style={{ marginRight: 6 }} />
          <Text style={{ color: 'white' }}>{task.completed ? 'Undo' : 'Done'}</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={{ backgroundColor: theme.colors.danger, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="delete" size={18} color={'white'} style={{ marginRight: 6 }} />
          <Text style={{ color: 'white' }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  )
}
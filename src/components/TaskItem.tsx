import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Task } from '../store/tasks'

type Props = {
  task: Task
  onToggle: () => void
  onDelete: () => void
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable onPress={onToggle} style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 16, color: task.completed ? '#999' : '#111', textDecorationLine: task.completed ? 'line-through' : 'none' }}>{task.title}</Text>
        {task.description ? (
          <Text style={{ fontSize: 12, color: '#666' }}>{task.description}</Text>
        ) : null}
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable onPress={onToggle} style={{ backgroundColor: task.completed ? '#4caf50' : '#2196f3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 }}>
          <Text style={{ color: 'white' }}>{task.completed ? 'Undo' : 'Done'}</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={{ backgroundColor: '#e53935', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 }}>
          <Text style={{ color: 'white' }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  )
}
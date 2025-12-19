import React, { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTheme } from '../theme'

type Props = {
  visible: boolean
  message: string
  actionText?: string
  onAction?: () => void
  onClose?: () => void
  duration?: number
}

export default function Snack({ visible, message, actionText, onAction, onClose, duration = 3000 }: Props) {
  const { theme } = useTheme()
  useEffect(() => {
    if (!visible) return
    const timeoutId = setTimeout(() => onClose?.(), duration)
    return () => clearTimeout(timeoutId)
  }, [visible, duration, onClose])
  if (!visible) return null
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, bottom: 80, backgroundColor: theme.colors.card, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: theme.colors.divider, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: theme.colors.text }}>{message}</Text>
      {actionText && onAction ? (
        <Pressable onPress={onAction} style={{ marginLeft: 12 }}>
          <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{actionText}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
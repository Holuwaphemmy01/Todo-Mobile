import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Appearance } from 'react-native'
import { loadTheme, saveTheme } from '../utils/storage'

type ThemeName = 'light' | 'dark'

type Theme = {
  name: ThemeName
  colors: {
    bg: string
    text: string
    muted: string
    primary: string
    secondary: string
    danger: string
    divider: string
    card: string
    inputBg: string
    inputBorder: string
  }
}

const light: Theme = {
  name: 'light',
  colors: {
    bg: '#ffffff',
    text: '#111111',
    muted: '#666666',
    primary: '#2196f3',
    secondary: '#4caf50',
    danger: '#e53935',
    divider: '#eeeeee',
    card: '#f9f9f9',
    inputBg: '#ffffff',
    inputBorder: '#dddddd',
  },
}

const dark: Theme = {
  name: 'dark',
  colors: {
    bg: '#121212',
    text: '#eaeaea',
    muted: '#b0b0b0',
    primary: '#90caf9',
    secondary: '#81c784',
    danger: '#ef5350',
    divider: '#2a2a2a',
    card: '#1a1a1a',
    inputBg: '#1a1a1a',
    inputBorder: '#2a2a2a',
  },
}

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
  const [name, setName] = useState<ThemeName>(system)

  useEffect(() => {
    loadTheme().then(stored => {
      if (stored) setName(stored)
    })
  }, [])

  useEffect(() => {
    saveTheme(name)
  }, [name])

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme: name === 'dark' ? dark : light,
      toggle: () => setName(prev => (prev === 'dark' ? 'light' : 'dark')),
    }
  }, [name])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('ThemeContext')
  return ctx
}
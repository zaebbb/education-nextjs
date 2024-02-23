"use client"

import React from 'react'

export type ThemeMode = 'dark' | 'light' | '' | 'system'

export interface ModeTheme {
  icon: string
  label: string
  value: ThemeMode
}

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = React.createContext<
  ThemeContextType | undefined
>(undefined)

export function ThemeProvider (
  {children}: {children: React.ReactNode}
) {
  const [mode, setMode] = React.useState<ThemeMode>('')

  const handleThemeChange = () => {
    if (
      localStorage.theme === 'dark' ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode('dark')
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      setMode('light')
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  React.useEffect(() => {
    handleThemeChange()
  }, [mode])

  React.useEffect(() => {
    console.log('MODE' , mode)
  }, [mode])

  return (
    <ThemeContext.Provider value={{mode, setMode}}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

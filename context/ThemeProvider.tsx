"use client"

import React from 'react'

type ThemeMode = 'dark' | 'light' | ''

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
    if (mode === 'light') {
      setMode('dark')
      document.documentElement.classList.add('dark')
    }

    if (mode === 'dark') {
      setMode('light')
      document.documentElement.classList.add('light')
    }
  }

  React.useEffect(() => {
    handleThemeChange()
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

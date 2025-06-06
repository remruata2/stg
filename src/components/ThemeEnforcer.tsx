'use client'

import { useEffect } from 'react'

export default function ThemeEnforcer() {
  useEffect(() => {
    // Always use light mode and ignore browser preference
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }, [])

  // This component doesn't render anything
  return null
}

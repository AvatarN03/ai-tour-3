import React from 'react'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'

export const Accessibility = () => {
  return (
    <div className="flex items-center h-auto w-fit  p-1 rounded-full shadow-md justify-between gap-1 bg-gray-100 dark:bg-gray-800 border-2 border-purple-600">
        <ThemeToggle /> 
        <hr className="w-5 h-full bg-gray-600 dark:bg-gray-300 rotate-90"/>
        <LanguageSelector />
    </div>
  )
}

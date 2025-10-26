"use client"
import { MoonStarIcon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

const ThemeToggle = () => {

    const { theme, setTheme } = useTheme()
    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label={theme ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <MoonStarIcon className="w-5 h-5" />
            )}
        </button>
    )
}

export default ThemeToggle
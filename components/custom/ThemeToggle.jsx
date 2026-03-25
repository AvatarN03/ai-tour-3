"use client"
import React from 'react'

import { MoonStarIcon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const ThemeToggle = () => {

    const { theme, setTheme } = useTheme()
    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1 cursor-pointer    text-gray-600 dark:text-gray-300   "
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
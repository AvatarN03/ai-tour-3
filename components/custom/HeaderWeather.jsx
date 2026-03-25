"use client";

import { useWeather } from "@/context/useWeather";

const HeaderWeather = () => {
    const { weather, isLoading, getCurrentLocation } = useWeather();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 bg-accent dark:bg-gray-700 border border-border rounded-md px-3 py-1.5 text-sm opacity-60">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                <span className="text-muted-foreground text-xs">Loading...</span>
            </div>
        );
    }

    if (!weather) {
        return (
            <button
                onClick={getCurrentLocation}
                className="flex items-center gap-1.5 bg-accent dark:bg-gray-700 hover:bg-muted border border-border rounded-md px-3 py-1.5 text-sm transition-colors"
            >
                <span className="text-base leading-none">📍</span>
                <span className="text-muted-foreground text-xs">Get weather</span>
            </button>
        );
    }

    return (
        <button
            onClick={getCurrentLocation}
            className="flex items-center gap-1.5 bg-blue-200 dark:bg-gray-700 hover:bg-muted border border-border rounded-md px-3 py-1.5 transition-colors"
            title={`${weather.current.condition} in ${weather.name}`}
        >
            <span className="text-base leading-none">{weather.current.icon}</span>
            <span className="text-sm font-medium text-foreground">
                {Math.round(weather.current.temperature)}°C
            </span>
            <span className="text-xs text-blue-800 dark:text-blue-300 hidden sm:inline">
                {weather.name}
            </span>
        </button>
    );
};

export default HeaderWeather;
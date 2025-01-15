"use client";
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    const iconSize = 30;
    return (
        <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={toggleTheme} 
        >
            <div className="text-muted-foreground ">
                {theme === 'light' ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
            </div>
        </div>
    );
};

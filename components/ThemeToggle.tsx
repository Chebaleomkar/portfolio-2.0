"use client";
import { Switch } from './ui/switch';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="flex items-center space-x-4">
            {/* Icon for Light/Dark Mode */}
            <div className="text-muted-foreground">
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </div>

            {/* Theme Switch */}
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className={`${theme === 'dark' ? 'bg-primary' : 'bg-muted'
                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
            >
                <span
                    className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
            </Switch>
        </div>
    );
};

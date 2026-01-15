import React, { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme;
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            setTheme('system');
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (targetTheme: Theme) => {
            root.classList.remove('light', 'dark');

            if (targetTheme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add(targetTheme);
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    return (
        <div className="flex items-center p-1 bg-gray-100 dark:bg-neutral-800 rounded-full border border-gray-200 dark:border-white/5">
            <button
                onClick={() => setTheme('system')}
                className={`
                    p-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                    ${theme === 'system'
                        ? 'bg-white dark:bg-neutral-600 text-happiness-1 dark:text-white shadow-sm'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }
                `}
                title="Sistema"
            >
                <Monitor className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('light')}
                className={`
                    p-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                    ${theme === 'light'
                        ? 'bg-white dark:bg-neutral-600 text-yellow-500 shadow-sm'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }
                `}
                title="Claro"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`
                    p-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                    ${theme === 'dark'
                        ? 'bg-white dark:bg-neutral-600 text-purple-400 shadow-sm'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }
                `}
                title="Escuro"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    );
};

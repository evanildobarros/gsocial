/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                    container: 'rgb(var(--color-primary-container) / <alpha-value>)',
                    on: {
                        DEFAULT: 'rgb(var(--color-on-primary) / <alpha-value>)',
                    }
                },
                secondary: {
                    DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
                    container: 'rgb(var(--color-secondary-container) / <alpha-value>)',
                    on: {
                        DEFAULT: 'rgb(var(--color-on-secondary) / <alpha-value>)',
                    }
                },
                tertiary: {
                    DEFAULT: 'rgb(var(--color-tertiary) / <alpha-value>)',
                    container: 'rgb(var(--color-tertiary-container) / <alpha-value>)',
                },
                error: 'rgb(var(--color-error) / <alpha-value>)',
                background: 'rgb(var(--color-background) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                outline: 'rgb(var(--color-outline) / <alpha-value>)',
                'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
                happiness: {
                    1: 'rgb(var(--happiness-1) / <alpha-value>)',
                    2: 'rgb(var(--happiness-2) / <alpha-value>)',
                    3: 'rgb(var(--happiness-3) / <alpha-value>)',
                    4: 'rgb(var(--happiness-4) / <alpha-value>)',
                    5: 'rgb(var(--happiness-5) / <alpha-value>)',
                    'bg-tint': 'rgb(var(--happiness-bg-tint) / <alpha-value>)',
                },
            },
            fontFamily: {
                sans: ['Noto Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}

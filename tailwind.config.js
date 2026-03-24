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
                sans: ['Google Sans', 'Roboto', 'Arial', 'Helvetica', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'fluid-xs': 'clamp(0.75rem, 0.5vw + 0.65rem, 0.875rem)',
                'fluid-sm': 'clamp(0.875rem, 0.5vw + 0.75rem, 1rem)',
                'fluid-base': 'clamp(1rem, 0.5vw + 0.875rem, 1.125rem)',
                'fluid-lg': 'clamp(1.125rem, 0.5vw + 1rem, 1.25rem)',
                'fluid-xl': 'clamp(1.25rem, 0.5vw + 1.125rem, 1.5rem)',
                'fluid-2xl': 'clamp(1.5rem, 1vw + 1.25rem, 2rem)',
                'fluid-3xl': 'clamp(2rem, 1vw + 1.75rem, 3rem)',
                'fluid-4xl': 'clamp(2.5rem, 2vw + 2rem, 4rem)',
                'fluid-5xl': 'clamp(3rem, 3vw + 2.5rem, 5rem)',
                'fluid-6xl': 'clamp(4rem, 4vw + 3rem, 7rem)',
                'fluid-7xl': 'clamp(5rem, 5vw + 4rem, 9rem)',
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}

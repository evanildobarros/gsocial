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
            },
            fontFamily: {
                sans: ['Ubuntu', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}

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
                happiness: {
                    1: 'rgb(var(--brand-primary) / <alpha-value>)',
                    2: 'rgb(var(--brand-secondary) / <alpha-value>)',
                    3: 'rgb(var(--brand-tertiary) / <alpha-value>)',
                    4: 'rgb(var(--brand-accent-1) / <alpha-value>)',
                    5: 'rgb(var(--brand-accent-2) / <alpha-value>)',
                    'bg-tint': 'var(--brand-bg-tint)',
                }
            },
            fontFamily: {
                sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}

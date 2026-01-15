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
                    1: '#154DBF',
                    2: '#4B93F2',
                    3: '#9FC3F2',
                    4: '#F2DA65',
                    5: '#F2BE5E',
                }
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}

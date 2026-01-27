import React, { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import './index.css';
import App from './App';
import { materialTheme } from './src/theme/materialTheme';

const Main = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [primaryColor, setPrimaryColor] = React.useState(() => {
    const saved = localStorage.getItem('gsocial-theme') || 'azure';
    const colors: Record<string, string> = { azure: '#4973F2', emerald: '#29A683', burgundy: '#BF2633' };
    return colors[saved] || '#4973F2';
  });

  const theme = useMemo(() => materialTheme(mode, primaryColor), [mode, primaryColor]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setMode(isDark ? 'dark' : 'light');
        }
        if (mutation.attributeName === 'data-theme') {
          const themeName = document.documentElement.getAttribute('data-theme') || 'azure';
          const colors: Record<string, string> = { azure: '#4973F2', emerald: '#29A683', burgundy: '#BF2633' };
          setPrimaryColor(colors[themeName] || '#4973F2');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
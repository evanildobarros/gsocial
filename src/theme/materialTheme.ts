import { createTheme } from '@mui/material/styles';

/**
 * Paleta de Cores Material Design 3 (M3)
 * Cores baseadas no Azul Marítimo do ESGporto (#154DBF)
 */
const m3Palette = {
    light: {
        primary: '#154DBF',
        onPrimary: '#FFFFFF',
        primaryContainer: '#D9E2FF',
        onPrimaryContainer: '#001945',
        secondary: '#585E71',
        onSecondary: '#FFFFFF',
        secondaryContainer: '#DDE1F9',
        onSecondaryContainer: '#151B2C',
        tertiary: '#735761',
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#FFD9E2',
        onTertiaryContainer: '#2A151E',
        error: '#BA1A1A',
        onError: '#FFFFFF',
        errorContainer: '#FFDAD6',
        onErrorContainer: '#410002',
        background: '#FEFBFF',
        onBackground: '#1B1B1F',
        surface: '#FEFBFF',
        onSurface: '#1B1B1F',
        surfaceVariant: '#E1E2EC',
        onSurfaceVariant: '#44464F',
        outline: '#757780',
    },
    dark: {
        primary: '#B0C6FF',
        onPrimary: '#002D6F',
        primaryContainer: '#00429A',
        onPrimaryContainer: '#D9E2FF',
        secondary: '#C1C6DD',
        onSecondary: '#2B3042',
        secondaryContainer: '#414659',
        onSecondaryContainer: '#DDE1F9',
        tertiary: '#E2BDC9',
        onTertiary: '#422933',
        tertiaryContainer: '#5A3F49',
        onTertiaryContainer: '#FFD9E2',
        error: '#FFB4AB',
        onError: '#690005',
        errorContainer: '#93000A',
        onErrorContainer: '#FFDAD6',
        background: '#1B1B1F',
        onBackground: '#E3E2E6',
        surface: '#1B1B1F',
        onSurface: '#E3E2E6',
        surfaceVariant: '#44464F',
        onSurfaceVariant: '#C5C6D0',
        outline: '#8F9099',
    },
};

export const materialTheme = (mode: 'light' | 'dark', primaryColor: string = '#154DBF') => {
    return createTheme({
        palette: {
            mode,
            primary: {
                main: primaryColor,
            },
            secondary: {
                main: mode === 'light' ? '#585E71' : '#C1C6DD',
            },
            background: {
                default: mode === 'light' ? '#FEFBFF' : '#1B1B1F',
                paper: mode === 'light' ? '#FEFBFF' : '#1B1B1F',
            },
        },
        shape: {
            borderRadius: 12,
        },
        typography: {
            fontFamily: '"Ubuntu", "Roboto", "Inter", "Arial", sans-serif',
            h1: { fontSize: '2.5rem', fontWeight: 400 },
            button: { textTransform: 'none', fontWeight: 500 },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 100, // Comprimido (Padrão M3)
                        padding: '10px 24px',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 24,
                        boxShadow: 'none',
                        border: `1px solid ${mode === 'light' ? '#E1E2EC' : '#44464F'}`,
                    },
                },
            },
        },
    });
};


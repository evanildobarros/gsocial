import { createTheme } from '@mui/material/styles';

// Tema ESGporto baseado no Material Design 3
// Cores principais extraídas do design atual do app
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2148C0',
            light: '#4B93F2',
            dark: '#154DBF',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#F2BE5E',
            light: '#F2DA65',
            dark: '#D4A54E',
            contrastText: '#1C1C1C',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1C1C1C',
            secondary: '#6B7280',
        },
        error: {
            main: '#EF4444',
        },
        warning: {
            main: '#F59E0B',
        },
        success: {
            main: '#10B981',
        },
        info: {
            main: '#3B82F6',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 900,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 900,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 800,
        },
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 700,
        },
        button: {
            fontWeight: 700,
            textTransform: 'none' as const,
        },
        overline: {
            fontWeight: 800,
            letterSpacing: '0.15em',
        },
    },
    shape: {
        borderRadius: 2, // Mínimo possível (quase quadrado)
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(33, 72, 192, 0.15)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #2148C0 0%, #4B93F2 100%)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    borderRadius: 2,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 2,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1C1C1C',
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '8px 12px',
                },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiPaper-root': {
                        borderRadius: 2,
                    },
                },
            },
        },
    },
});

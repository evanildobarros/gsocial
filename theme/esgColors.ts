// /home/evanildobarros/Projetos/gsocial/theme/esgColors.ts

/**
 * Tokens de Cores ESG baseados em Vale/Padrões de Mercado.
 * Estes tokens devem ser usados consistentemente em todos os componentes.
 */

export const ESG_COLORS = {
  // Ambiental (E) - Verde
  environmental: {
    base: '#059669', // --esg-green
    light: '#d1fae5', // --esg-green-light
  },
  // Social (S) - Azul/Primário
  social: {
    base: 'rgb(var(--color-primary))', // --color-primary (Happiness-1)
    light: 'rgba(var(--color-primary), 0.1)',
  },
  // Governança (G) - Cinza Escuro/Secundário
  governance: {
    base: '#585E71', // --color-secondary (Aproximação)
    light: '#DDE1F9', // --color-secondary-container
  },
  // Status Mapping (para KPICard)
  status: {
    success: '#059669', // ESG Green
    attention: '#ea580c', // ESG Orange
    critical: 'rgb(var(--color-error))', // Global Error Red
  }
};

// Definição de tipos de status para uso no componente
export type ESGStatus = 'success' | 'attention' | 'critical' | 'neutral';
export type ColorTone = 'primary' | 'emerald' | 'secondary';
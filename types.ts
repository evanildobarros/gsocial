export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  NEW_PROJECT = 'NEW_PROJECT'
}

export interface Project {
  id: number;
  name: string;
  pilar: 'Ambiental' | 'Social' | 'Governança';
  tema: string;
  status: 'Planejado' | 'Em andamento' | 'Concluído';
  community: string;
  budget?: string;
}

export interface AIAnalysisResult {
  impactos: string;
  riscos: string;
  ods_relacionados: string[];
  alinhamento_score: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isLoading?: boolean;
}

export interface VeoGenerationState {
  status: 'idle' | 'checking_key' | 'generating' | 'polling' | 'completed' | 'error';
  progressMessage?: string;
  videoUrl?: string;
  error?: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

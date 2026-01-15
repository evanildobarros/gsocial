export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  NEW_PROJECT = 'NEW_PROJECT',
  USERS = 'USERS',
  CREATE_USER = 'CREATE_USER',
  PROFILE = 'PROFILE',
  // Novos Modos Ambientais
  ENV_DECARBONIZATION = 'ENV_DECARBONIZATION',
  ENV_EFFICIENCY = 'ENV_EFFICIENCY',
  ENV_POLLUTION = 'ENV_POLLUTION',
  ENV_COMPLIANCE = 'ENV_COMPLIANCE',

  // Novos Modos Sociais
  SOCIAL_SROI = 'SOCIAL_SROI',
  SOCIAL_TERRITORY = 'SOCIAL_TERRITORY',
  SOCIAL_GIS = 'SOCIAL_GIS',
  SOCIAL_DIVERSITY = 'SOCIAL_DIVERSITY',
  SOCIAL_HUMAN_RIGHTS = 'SOCIAL_HUMAN_RIGHTS',

  // Novos Modos de Governança
  GOV_RISK_MATRIX = 'GOV_RISK_MATRIX',
  GOV_REPORTING = 'GOV_REPORTING',
  GOV_SUPPLY_CHAIN = 'GOV_SUPPLY_CHAIN',

  // Modos Estratégicos
  STRATEGIC_PREDICTIVE = 'STRATEGIC_PREDICTIVE'
}

export type UserRole =
  | 'master'
  | 'admin'
  | 'user'
  | 'admin_porto'
  | 'gestor_arrendatario'
  | 'gestor_social'
  | 'auditor_externo'
  | 'publico_comunidade';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  cover_url?: string;
  created_at: string;
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

export type ESGPillar = 'Environmental' | 'Social' | 'Governance' | 'Operational';

export type LayerType = 'POLYGON' | 'MARKER' | 'POLYLINE';

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  color: string;
  data: any; // Coordinates or Marker Position
  details?: Record<string, any>; // Metadados adicionais do arquivo importado
  pillar: ESGPillar; // Pilar ESG ao qual a camada pertence
  group?: string; // Grupo ou categoria da camada (ex: Recursos Hídricos)
}

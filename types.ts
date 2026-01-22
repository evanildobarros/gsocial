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
  ENV_LAIA = 'ENV_LAIA', // EMAP-PC-56
  ENV_WASTE_SHIP = 'ENV_WASTE_SHIP', // EMAP-PC-112
  ENV_METEO = 'ENV_METEO',

  // Novos Modos Sociais
  SOCIAL_SROI = 'SOCIAL_SROI',
  SOCIAL_TERRITORY = 'SOCIAL_TERRITORY',
  SOCIAL_GIS = 'SOCIAL_GIS',
  SOCIAL_DIVERSITY = 'SOCIAL_DIVERSITY',
  SOCIAL_HUMAN_RIGHTS = 'SOCIAL_HUMAN_RIGHTS',
  SOCIAL_ASSESSMENT = 'SOCIAL_ASSESSMENT',

  // Novos Modos de Governança
  GOV_RISK_MATRIX = 'GOV_RISK_MATRIX',
  GOV_REPORTING = 'GOV_REPORTING',
  GOV_SUPPLY_CHAIN = 'GOV_SUPPLY_CHAIN',
  GOV_INNOVATION_FUNNEL = 'GOV_INNOVATION_FUNNEL', // Roda da Inovação

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

// --- EMAP Specific Interfaces ---

export interface LAIARecord {
  id: string;
  activity_source: string; // EMAP-PC-56
  environmental_aspect: string;
  environmental_impact: string;
  severity: number;
  probability: number;
  risk_score: number;
  control_measure_id: string;
  status: 'Identified' | 'Controlled' | 'Review Required';
}

export interface ShipWasteRecord {
  id: string;
  vessel_name: string;
  waste_type_marpol: 'Annex I' | 'Annex II' | 'Annex IV' | 'Annex V' | 'Annex VI';
  volume_m3: number;
  service_provider_id: string;
  crr_mtr_number?: string;
  document_url?: string; // EMAP-PC-112 (Mandatory for completion)
  status: 'Requested' | 'In Progress' | 'Completed';
  request_date: string;
}

export interface InnovationIdea {
  id: string;
  title: string;
  author_id: string;
  stage: 'Ideation (CRIARE)' | 'Screening' | 'Project Execution' | 'Value Realization';
  description: string;
  alignment_score: number;
  impact_area: 'Environmental' | 'Social' | 'Operational' | 'Governance';
}

export interface SROIImpactRecord {
  id: string;
  project_name: string;
  investment: number;
  beneficiaries_count: number;
  outcome_type: string;
  attribution_percentage: number;
  sroi_ratio: number;
  created_at: string;
  created_by: string;
}

export interface CommunityAssessment {
  id: string;
  community_name: string;
  settlement_type: string;
  estimated_families: number;
  water_access: string;
  sanitation_status: string;
  negative_impacts: string[];
  priority_needs: string[];
  relationship_level: number;
  assessment_date: string;
  coordinates: number[]; // [lng, lat]
  geometry?: { type: string; data: any };
  created_at?: string;
  created_by?: string;
}


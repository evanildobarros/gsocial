import React, { useState, useEffect } from 'react';
import {
    Tooltip,
    Badge,
    Collapse,
    Menu,
    MenuItem,
    ListItemIcon,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Avatar,
    IconButton,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Assignment as ProjectsIcon,
    People as UsersIcon,
    Bolt as ZapIcon,
    WaterDrop as DropletsIcon,
    Shield as ShieldIcon,
    VerifiedUser as ComplianceIcon,
    Analytics as AnalyticsIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
    AccountCircle as AccountCircleIcon,
    Anchor as AnchorIcon,
    ExpandLess,
    ExpandMore,
    ShowChart as SroiIcon,
    Map as TerritoryIcon,
    Group as DiversityIcon,
    Security as HumanRightsIcon,
    ReportProblem as RiskIcon,
    Assessment as ReportingIcon,
    LocalShipping as SupplyChainIcon,
    Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { AppMode, UserProfile, Layer } from './types';
import { supabase } from './utils/supabase';
import { parseKmlToLayers } from './utils/geoUtils';
import { showSuccess, showError } from './utils/notifications';
import { Dashboard } from './components/Dashboard';
import { ProjectList } from './components/ProjectList';
import { NewProject } from './components/NewProject';
import { UserManagement } from './components/UserManagement';
import { UserProfilePage } from './components/UserProfile';
import { Login } from './components/Login';
import { CreateUser } from './components/CreateUser';
import { Decarbonization } from './components/environmental/Decarbonization';
import { Efficiency } from './components/environmental/Efficiency';
import { PollutionControl } from './components/environmental/PollutionControl';
import { Compliance } from './components/environmental/Compliance';
import { ToastContainer } from './components/Toast';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { SROICalculator } from './components/social/SROICalculator';
import { CommunityRelations } from './components/social/CommunityRelations';
import { DiversityDashboard } from './components/social/DiversityDashboard';
import { HumanRights } from './components/social/HumanRights';
import { RiskHeatmap } from './components/governance/RiskHeatmap';
import { ReportingHub } from './components/governance/ReportingHub';
import { SupplyChainAudit } from './components/governance/SupplyChainAudit';
import { PredictiveAnalysis } from './components/strategic/PredictiveAnalysis';
import { GeoSpatialModule } from './components/territory/GeoSpatialModule';
import { LAIA } from './components/environmental/LAIA';
import { ShipWaste } from './components/environmental/ShipWaste';
import { InnovationFunnel } from './components/governance/InnovationFunnel';
import { MeteoPredictiveModule } from './components/environmental/MeteoPredictiveModule';
import CommunityAssessmentForm from './components/territory/CommunityAssessmentForm';
import { ESGDiagnosticForm } from './components/governance/ESGDiagnosticForm';
import { ESGDiagnosticsCenter } from './components/ESGDiagnosticsCenter';
import { EnvironmentalDiagnosticForm } from './components/environmental/EnvironmentalDiagnosticForm';
import { GovernanceDiagnosticForm } from './components/governance/GovernanceDiagnosticForm';
import { Breadcrumb } from './components/Breadcrumb';
import SocialProjectForm from './components/social/SocialProjectForm';

// Componente NavItem refatorado com Tailwind
interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, collapsed }) => (
    <Tooltip title={collapsed ? label : ''} placement="right" arrow>
        <div className="mb-1 px-2">
            <button
                onClick={onClick}
                className={`
                    w-full flex items-center py-3.5 px-4 rounded-sm transition-all duration-200 ease-in-out
                    ${collapsed ? 'justify-center' : 'justify-start'}
                    ${active
                        ? 'bg-happiness-1/10 text-happiness-1 dark:text-white dark:bg-happiness-1 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }
                `}
            >
                <div className={`flex items-center justify-center ${collapsed ? '' : 'min-w-[40px]'}`}>
                    {React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: 20 } })}
                </div>
                {!collapsed && (
                    <span className={`text-sm font-medium whitespace-nowrap ${active ? 'font-bold' : ''}`}>
                        {label}
                    </span>
                )}
            </button>
        </div>
    </Tooltip>
);

const SectionHeader: React.FC<{
    label: string;
    collapsed: boolean;
    open?: boolean;
    onToggle?: () => void
}> = ({ label, collapsed, open, onToggle }) => (
    <div
        onClick={!collapsed ? onToggle : undefined}
        className={`px-6 py-3 mt-6 flex items-center justify-between group transition-colors ${!collapsed && onToggle ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5' : ''} ${collapsed ? 'text-center' : 'text-left'}`}
    >
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 group-hover:text-happiness-1 transition-colors">
            {collapsed ? '•••' : label}
        </div>
        {!collapsed && onToggle && (
            <div className="text-gray-400 group-hover:text-happiness-1 transition-colors">
                {open ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
            </div>
        )}
    </div>
);

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [kmlLayers, setKmlLayers] = useState<Layer[]>([]);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('gsocial-theme') || 'azure');

    // Configurações de cores sincronizadas com index.css
    const themePresets = {
        azure: { primary: '#4973F2', secondary: '#5C82F2', accent: '#D9D8D2' },
        emerald: { primary: '#29A683', secondary: '#1B2B40', accent: '#A67968' },
        burgundy: { primary: '#BF2633', secondary: '#590A18', accent: '#F2766B' }
    };

    const muiTheme = React.useMemo(() => {
        const preset = themePresets[currentTheme as keyof typeof themePresets] || themePresets.azure;
        return createTheme({
            palette: {
                mode: 'light',
                primary: {
                    main: preset.primary,
                    light: preset.secondary,
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: preset.accent,
                    contrastText: '#ffffff',
                },
            },
            shape: { borderRadius: 1 },
            typography: {
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                button: { fontWeight: 700, textTransform: 'none' },
            },
            components: {
                MuiButton: { styleOverrides: { root: { borderRadius: 1, padding: '10px 24px' } } },
                MuiMenuItem: { styleOverrides: { root: { fontWeight: 600 } } }
            }
        });
    }, [currentTheme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('gsocial-theme', currentTheme);
    }, [currentTheme]);

    const [diagnosticTab, setDiagnosticTab] = useState(0);
    const [envOpen, setEnvOpen] = useState(false);
    const [socialOpen, setSocialOpen] = useState(false);
    const [govOpen, setGovOpen] = useState(false);
    const [overviewOpen, setOverviewOpen] = useState(true);
    const [strategicOpen, setStrategicOpen] = useState(false);

    // KML auto-loading removed per user request

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data && !error) {
                setUserProfile(data as UserProfile);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAuthenticated(true);
                fetchUserProfile(session.user.id);
            }
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setIsAuthenticated(true);
                if (!userProfile || userProfile.id !== session.user.id) {
                    fetchUserProfile(session.user.id);
                }
            } else {
                setIsAuthenticated(false);
                setUserProfile(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Estados do Menu de Perfil (Header)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUserProfile(null);
    };

    const getInitials = (name?: string) => {
        if (!name) return 'GS';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-zinc-950">
                <span className="text-gray-400 dark:text-gray-500 font-bold animate-pulse">Carregando ESGporto...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    const renderContent = () => {
        switch (mode) {
            case AppMode.DASHBOARD: return <Dashboard />;
            case AppMode.PROJECTS: return (
                <ProjectList
                    onAddNew={() => { setSelectedProject(null); setMode(AppMode.NEW_SOCIAL_PROJECT); }}
                    onEdit={(p) => {
                        // Mapeia os dados do banco para o formato do formulário SocialProject
                        setSelectedProject({
                            id: p.id,
                            title: p.name,
                            description: p.description || p.tema,
                            status: p.status === 'Concluído' ? 'completed' : p.status === 'Planejado' ? 'planning' : 'active',
                            budget: parseFloat(p.budget || '0'),
                            startDate: p.start_date || '',
                            endDate: p.end_date || '',
                            beneficiariesTarget: p.beneficiaries_target || 0,
                            neighborhoods: p.neighborhoods || (p.community ? [p.community] : []),
                            materialityTopics: p.materiality_topics || (p.tema ? [p.tema] : []),
                            sdgTargets: p.sdg_targets || [],
                            estimatedImpactValue: parseFloat(p.estimated_impact_value as any || '0'),
                            projectedSroi: parseFloat(p.projected_sroi as any || '0')
                        });
                        setMode(AppMode.NEW_SOCIAL_PROJECT);
                    }}
                />
            );
            case AppMode.NEW_PROJECT: return <NewProject onBack={() => setMode(AppMode.PROJECTS)} />;
            case AppMode.USERS: return <UserManagement onAddUser={() => setMode(AppMode.CREATE_USER)} />;
            case AppMode.CREATE_USER: return <CreateUser onBack={() => setMode(AppMode.USERS)} />;
            case AppMode.PROFILE: return <UserProfilePage />;
            case AppMode.ENV_DECARBONIZATION: return <Decarbonization />;
            case AppMode.ENV_EFFICIENCY: return <Efficiency />;
            case AppMode.ENV_POLLUTION: return <PollutionControl />;
            case AppMode.ENV_COMPLIANCE: return <Compliance />;
            case AppMode.SOCIAL_SROI: return <SROICalculator />;
            case AppMode.SOCIAL_TERRITORY: return <CommunityRelations />;
            case AppMode.SOCIAL_DIVERSITY: return <DiversityDashboard />;
            case AppMode.SOCIAL_HUMAN_RIGHTS: return <HumanRights />;
            case AppMode.GOV_RISK_MATRIX: return <RiskHeatmap />;
            case AppMode.GOV_REPORTING: return <ReportingHub />;
            case AppMode.GOV_SUPPLY_CHAIN: return <SupplyChainAudit />;
            case AppMode.GOV_INNOVATION_FUNNEL: return <InnovationFunnel />;
            case AppMode.STRATEGIC_PREDICTIVE: return <PredictiveAnalysis />;
            case AppMode.SOCIAL_GIS: return <GeoSpatialModule additionalLayers={kmlLayers} />;
            case AppMode.ENV_LAIA: return <LAIA />;
            case AppMode.ENV_WASTE_SHIP: return <ShipWaste />;
            case AppMode.ENV_METEO: return <MeteoPredictiveModule />;
            case AppMode.SOCIAL_ASSESSMENT: return <CommunityAssessmentForm />;
            case AppMode.GOV_DIAGNOSTIC: return <ESGDiagnosticForm initialTab={diagnosticTab} />;
            case AppMode.ESG_CENTER: return <ESGDiagnosticsCenter onSelectMode={(m, t) => { setDiagnosticTab(t || 0); setMode(m); }} />;
            case AppMode.ENV_DIAGNOSTIC: return <EnvironmentalDiagnosticForm />;
            case AppMode.GOV_ESG_DIAGNOSTIC: return <GovernanceDiagnosticForm />;
            case AppMode.NEW_SOCIAL_PROJECT: return (
                <SocialProjectForm
                    key={selectedProject?.id || 'new'}
                    initialData={selectedProject}
                    onSubmit={async (project) => {
                        try {
                            const projectData = {
                                name: project.title,
                                pilar: 'Social',
                                materiality_topics: (project as any).materialityTopics,
                                tema: (project as any).materialityTopics[0] || 'Geral', // Legado
                                status: project.status === 'completed' ? 'Concluído' : project.status === 'planning' ? 'Planejado' : 'Em andamento',
                                community: project.neighborhoods[0] || 'Vila Bacanga',
                                budget: project.budget.toString(),
                                description: project.description,
                                start_date: project.startDate || null,
                                end_date: project.endDate || null,
                                beneficiaries_target: project.beneficiariesTarget,
                                neighborhoods: project.neighborhoods,
                                sdg_targets: project.sdgTargets,
                                projected_sroi: project.projectedSroi,
                                estimated_impact_value: project.estimatedImpactValue
                            };

                            if (selectedProject?.id) {
                                const { error } = await supabase
                                    .from('projects')
                                    .update(projectData)
                                    .eq('id', selectedProject.id);
                                if (error) throw error;
                                showSuccess('Projeto atualizado com sucesso!');
                            } else {
                                const { error } = await supabase
                                    .from('projects')
                                    .insert(projectData);
                                if (error) throw error;
                                showSuccess('Projeto criado com sucesso!');
                            }
                            setMode(AppMode.PROJECTS);
                        } catch (error: any) {
                            console.error('Erro detalhado ao salvar:', error);
                            showError(`Falha ao salvar: ${error.message || 'Erro desconhecido'}`);
                        }
                    }}
                    onCancel={() => setMode(AppMode.PROJECTS)}
                />
            );
            default: return <Dashboard />;
        }
    };

    const getPageTitle = () => {
        switch (mode) {
            case AppMode.DASHBOARD: return 'Dashboard de Diagnóstico';
            case AppMode.PROJECTS: return 'Gestão de Portfólio';
            case AppMode.NEW_PROJECT: return 'Nova Iniciativa';
            case AppMode.USERS: return 'Gestão de Membros';
            case AppMode.PROFILE: return 'Seu Perfil';
            case AppMode.ENV_DECARBONIZATION: return 'Módulo Clima & Carbono';
            case AppMode.ENV_EFFICIENCY: return 'Eficiência Hídrica/Energética';
            case AppMode.ENV_POLLUTION: return 'Monitoramento de Poluição & PAM';
            case AppMode.ENV_COMPLIANCE: return 'Conformidade Ambiental';
            case AppMode.ENV_LAIA: return 'Levantamento LAIA (PC-56)';
            case AppMode.ENV_WASTE_SHIP: return 'Resíduos de Navios (PC-112)';
            case AppMode.ENV_METEO: return 'Inteligência Climática & Preditiva';
            case AppMode.SOCIAL_SROI: return 'Impacto & SROI';
            case AppMode.SOCIAL_TERRITORY: return 'Relacionamento & Território';
            case AppMode.SOCIAL_DIVERSITY: return 'Diversidade & Inclusão';
            case AppMode.SOCIAL_HUMAN_RIGHTS: return 'Direitos Humanos & Supply Chain';
            case AppMode.GOV_RISK_MATRIX: return 'Matriz de Riscos GRC';
            case AppMode.GOV_REPORTING: return 'Relatórios & Transparência';
            case AppMode.GOV_SUPPLY_CHAIN: return 'Auditoria de Fornecedores';
            case AppMode.GOV_INNOVATION_FUNNEL: return 'Funil de Inovação (CRIARE)';
            case AppMode.STRATEGIC_PREDICTIVE: return 'Inteligência Preditiva';
            case AppMode.SOCIAL_GIS: return 'Mapeamento Territorial Geoespacial';
            case AppMode.SOCIAL_ASSESSMENT: return 'Diagnóstico Socioeconômico';
            case AppMode.GOV_DIAGNOSTIC: return 'Autoavaliação de Maturidade ESG porto (ABNT PR 2030)';
            case AppMode.ESG_CENTER: return 'Central de Diagnósticos ESG';
            case AppMode.ENV_DIAGNOSTIC: return 'Diagnóstico Ambiental (ABNT PR 2030)';
            case AppMode.GOV_ESG_DIAGNOSTIC: return 'Diagnóstico de Governança (ABNT PR 2030)';
            case AppMode.NEW_SOCIAL_PROJECT: return 'Novo Projeto Social Estratégico';
            default: return 'ESGporto';
        }
    };

    const getBreadcrumbs = () => {
        const home = { label: 'Home', onClick: () => setMode(AppMode.DASHBOARD) };

        switch (mode) {
            case AppMode.DASHBOARD:
                return [home];

            // Diagnósticos
            case AppMode.ESG_CENTER:
                return [home, { label: 'Diagnósticos', onClick: () => setMode(AppMode.ESG_CENTER) }, { label: 'Central' }];
            case AppMode.SOCIAL_ASSESSMENT:
                return [home, { label: 'Diagnósticos', onClick: () => setMode(AppMode.ESG_CENTER) }, { label: 'Social' }];
            case AppMode.ENV_DIAGNOSTIC:
                return [home, { label: 'Diagnósticos', onClick: () => setMode(AppMode.ESG_CENTER) }, { label: 'Ambiental' }];
            case AppMode.GOV_ESG_DIAGNOSTIC:
                return [home, { label: 'Diagnósticos', onClick: () => setMode(AppMode.ESG_CENTER) }, { label: 'Governança' }];
            case AppMode.GOV_DIAGNOSTIC:
                return [home, { label: 'Diagnósticos', onClick: () => setMode(AppMode.ESG_CENTER) }, { label: 'Consolidado ABNT' }];
            case AppMode.SOCIAL_GIS:
                return [home, { label: 'Diagnósticos', onClick: () => setMode(AppMode.ESG_CENTER) }, { label: 'Mapa ESG (GIS)' }];

            // Ambiental
            case AppMode.ENV_DECARBONIZATION:
                return [home, { label: 'Gestão Ambiental' }, { label: 'Clima & Carbono' }];
            case AppMode.ENV_EFFICIENCY:
                return [home, { label: 'Gestão Ambiental' }, { label: 'Recursos' }];
            case AppMode.ENV_POLLUTION:
                return [home, { label: 'Gestão Ambiental' }, { label: 'Poluição & PAM' }];
            case AppMode.ENV_COMPLIANCE:
                return [home, { label: 'Gestão Ambiental' }, { label: 'Conformidade' }];
            case AppMode.ENV_LAIA:
                return [home, { label: 'Gestão Ambiental' }, { label: 'LAIA (PC-56)' }];
            case AppMode.ENV_WASTE_SHIP:
                return [home, { label: 'Gestão Ambiental' }, { label: 'Resíduos (PC-112)' }];
            case AppMode.ENV_METEO:
                return [home, { label: 'Gestão Ambiental' }, { label: 'Inteligência Climática' }];

            // Social
            case AppMode.PROJECTS:
                return [home, { label: 'Social & Resp.' }, { label: 'Projetos' }];
            case AppMode.NEW_SOCIAL_PROJECT:
                return [home, { label: 'Social & Resp.' }, { label: 'Projetos', onClick: () => setMode(AppMode.PROJECTS) }, { label: 'Novo Projeto' }];
            case AppMode.SOCIAL_SROI:
                return [home, { label: 'Social & Resp.' }, { label: 'Impacto & SROI' }];
            case AppMode.SOCIAL_DIVERSITY:
                return [home, { label: 'Social & Resp.' }, { label: 'Diversidade' }];
            case AppMode.SOCIAL_HUMAN_RIGHTS:
                return [home, { label: 'Social & Resp.' }, { label: 'Direitos Humanos' }];
            case AppMode.SOCIAL_TERRITORY:
                return [home, { label: 'Social & Resp.' }, { label: 'Relacionamento' }];

            // Governança
            case AppMode.GOV_RISK_MATRIX:
                return [home, { label: 'Governança' }, { label: 'Matriz de Riscos' }];
            case AppMode.GOV_REPORTING:
                return [home, { label: 'Governança' }, { label: 'Relatórios' }];
            case AppMode.GOV_SUPPLY_CHAIN:
                return [home, { label: 'Governança' }, { label: 'Cadeia de Valor' }];
            case AppMode.GOV_INNOVATION_FUNNEL:
                return [home, { label: 'Governança' }, { label: 'Inovação' }];

            // Estratégico
            case AppMode.STRATEGIC_PREDICTIVE:
                return [home, { label: 'Estratégico' }, { label: 'Preditivo' }];

            // Usuários
            case AppMode.USERS:
                return [home, { label: 'Administração' }, { label: 'Usuários' }];
            case AppMode.CREATE_USER:
                return [home, { label: 'Administração' }, { label: 'Usuários', onClick: () => setMode(AppMode.USERS) }, { label: 'Novo Usuário' }];
            case AppMode.PROFILE:
                return [home, { label: 'Conta' }, { label: 'Perfil' }];
            case AppMode.NEW_PROJECT:
                return [home, { label: 'Novos Projetos' }, { label: 'Cadastro' }];

            default:
                return [home, { label: getPageTitle() }];
        }
    };

    const navItems = [
        { icon: <DashboardIcon />, label: "Home", mode: AppMode.DASHBOARD },
    ];

    const envItems = [
        { icon: <ZapIcon />, label: "Clima & Carbono", mode: AppMode.ENV_DECARBONIZATION },
        { icon: <DropletsIcon />, label: "Recursos (Energia/H2O)", mode: AppMode.ENV_EFFICIENCY },
        { icon: <ShieldIcon />, label: "Poluição & PAM", mode: AppMode.ENV_POLLUTION },
        { icon: <ComplianceIcon />, label: "Conformidade & Licenças", mode: AppMode.ENV_COMPLIANCE },
        { icon: <ComplianceIcon />, label: "Digital LAIA (PC-56)", mode: AppMode.ENV_LAIA },
        { icon: <AnchorIcon />, label: "Resíduos (PC-112)", mode: AppMode.ENV_WASTE_SHIP },
        { icon: <AnalyticsIcon />, label: "Inteligência Climática", mode: AppMode.ENV_METEO },
    ];

    const socialItems = [
        { icon: <ProjectsIcon />, label: "Projetos & Ações", mode: AppMode.PROJECTS },
        { icon: <SroiIcon />, label: "Impacto & SROI", mode: AppMode.SOCIAL_SROI },
        { icon: <DiversityIcon />, label: "Diversidade & Inclusão", mode: AppMode.SOCIAL_DIVERSITY },
        { icon: <HumanRightsIcon />, label: "Direitos Humanos", mode: AppMode.SOCIAL_HUMAN_RIGHTS },
    ];

    const govItems = [
        { icon: <RiskIcon />, label: "Matriz de Riscos", mode: AppMode.GOV_RISK_MATRIX },
        { icon: <ReportingIcon />, label: "Relatórios & Padrões", mode: AppMode.GOV_REPORTING },
        { icon: <SupplyChainIcon />, label: "Cadeia de Valor", mode: AppMode.GOV_SUPPLY_CHAIN },
        { icon: <LightbulbIcon />, label: "Roda da Inovação", mode: AppMode.GOV_INNOVATION_FUNNEL },
    ];

    const diagItems = [
        { icon: <ReportingIcon />, label: "Central de Diagnósticos", mode: AppMode.ESG_CENTER },
        { icon: <TerritoryIcon />, label: "Mapa ESG (GIS)", mode: AppMode.SOCIAL_GIS },
    ];

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 font-sans transition-colors duration-300 relative">
                <div className="absolute inset-0 bg-happiness-bg-tint pointer-events-none" />
                <ToastContainer />

                {/* Sidebar */}
                <aside
                    className={`
                    fixed left-0 top-0 h-full bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-gray-200 dark:border-white/5
                    ${sidebarOpen ? 'w-80' : 'w-24'}
                `}
                >
                    {/* Header */}
                    <div className={`
                    h-24 flex items-center px-8 transition-all duration-300
                    ${sidebarOpen ? 'justify-between' : 'justify-center'}
                `}>
                        {sidebarOpen ? (
                            <>
                                <div className="flex flex-col items-start gap-2">
                                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" />
                                    <div className="animate-in fade-in duration-300">
                                        <h1 className="text-lg font-black tracking-tighter leading-none text-gray-900 dark:text-white">ESGporto</h1>
                                        <p className="text-[9px] font-black text-gray-400 dark:text-happiness-3 uppercase tracking-widest mt-1">Dash Intelligence</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-1.5 text-gray-400 hover:text-happiness-1 hover:bg-happiness-1/5 rounded-sm transition-all"
                                >
                                    <MenuIcon sx={{ fontSize: 20 }} />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <img src="/logo_itaqui.png" alt="Logo" className="w-10 h-10 object-contain" />
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 text-gray-400 hover:text-happiness-1 hover:bg-happiness-1/5 rounded-sm transition-all"
                                >
                                    <MenuIcon sx={{ fontSize: 24 }} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Scroll Area */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">

                        <SectionHeader
                            label="Visão Geral"
                            collapsed={!sidebarOpen}
                            open={overviewOpen}
                            onToggle={() => setOverviewOpen(!overviewOpen)}
                        />
                        <Collapse in={overviewOpen || !sidebarOpen} timeout="auto" unmountOnExit>
                            <NavItem
                                icon={<DashboardIcon />}
                                label="Dashboard Home"
                                active={mode === AppMode.DASHBOARD}
                                onClick={() => setMode(AppMode.DASHBOARD)}
                                collapsed={!sidebarOpen}
                            />
                            {diagItems.map(item => (
                                <NavItem
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    active={mode === item.mode || mode === AppMode.SOCIAL_ASSESSMENT || mode === AppMode.GOV_DIAGNOSTIC}
                                    onClick={() => setMode(item.mode)}
                                    collapsed={!sidebarOpen}
                                />
                            ))}
                        </Collapse>

                        <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />

                        <SectionHeader
                            label="Pilar Ambiental (E)"
                            collapsed={!sidebarOpen}
                            open={envOpen}
                            onToggle={() => setEnvOpen(!envOpen)}
                        />
                        <Collapse in={envOpen || !sidebarOpen} timeout="auto" unmountOnExit>
                            {envItems.map(item => (
                                <NavItem
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    active={mode === item.mode}
                                    onClick={() => setMode(item.mode)}
                                    collapsed={!sidebarOpen}
                                />
                            ))}
                        </Collapse>

                        <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />

                        <SectionHeader
                            label="Pilar Social (S)"
                            collapsed={!sidebarOpen}
                            open={socialOpen}
                            onToggle={() => setSocialOpen(!socialOpen)}
                        />
                        <Collapse in={socialOpen || !sidebarOpen} timeout="auto" unmountOnExit>
                            {socialItems.map(item => (
                                <NavItem
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    active={mode === item.mode || (item.mode === AppMode.PROJECTS && mode === AppMode.NEW_SOCIAL_PROJECT)}
                                    onClick={() => setMode(item.mode)}
                                    collapsed={!sidebarOpen}
                                />
                            ))}
                        </Collapse>

                        <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />

                        <SectionHeader
                            label="Pilar Governança (G)"
                            collapsed={!sidebarOpen}
                            open={govOpen}
                            onToggle={() => setGovOpen(!govOpen)}
                        />
                        <Collapse in={govOpen || !sidebarOpen} timeout="auto" unmountOnExit>
                            {govItems.map(item => (
                                <NavItem
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    active={mode === item.mode}
                                    onClick={() => setMode(item.mode)}
                                    collapsed={!sidebarOpen}
                                />
                            ))}
                        </Collapse>

                        <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />

                        <SectionHeader
                            label="Inteligência & IA"
                            collapsed={!sidebarOpen}
                            open={strategicOpen}
                            onToggle={() => setStrategicOpen(!strategicOpen)}
                        />
                        <Collapse in={strategicOpen || !sidebarOpen} timeout="auto" unmountOnExit>
                            <NavItem
                                icon={<AnalyticsIcon />}
                                label="Análise Preditiva"
                                active={mode === AppMode.STRATEGIC_PREDICTIVE}
                                onClick={() => setMode(AppMode.STRATEGIC_PREDICTIVE)}
                                collapsed={!sidebarOpen}
                            />
                            <NavItem icon={<NotificationsIcon />} label="Alertas & Notificações" active={false} onClick={() => { }} collapsed={!sidebarOpen} />
                        </Collapse>

                        <div className="my-4 border-t border-gray-100 dark:border-white/5 mx-4" />

                        {/* Settings Submenu logic can be simplified or implemented similarly if needed */}
                        <Tooltip title={!sidebarOpen ? 'Configurações' : ''} placement="right" arrow>
                            <div className="mb-1 px-2">
                                <button
                                    onClick={() => setSettingsOpen(!settingsOpen)}
                                    className={`
                                    w-full flex items-center py-3 px-3 rounded-sm transition-all duration-200 ease-in-out
                                    ${!sidebarOpen ? 'justify-center' : 'justify-start'}
                                    ${mode === AppMode.USERS
                                            ? 'bg-happiness-1/10 text-happiness-1 dark:bg-happiness-1 dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                        }
                                `}
                                >
                                    <div className={`flex items-center justify-center ${!sidebarOpen ? '' : 'min-w-[40px]'}`}>
                                        <SettingsIcon sx={{ fontSize: 20 }} />
                                    </div>
                                    {sidebarOpen && (
                                        <>
                                            <span className="text-sm font-medium flex-1 text-left">Configurações</span>
                                            {settingsOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                        </>
                                    )}
                                </button>
                            </div>
                        </Tooltip>

                        <Collapse in={settingsOpen && sidebarOpen} timeout="auto" unmountOnExit>
                            <div className="pl-4 pr-2">
                                <button
                                    onClick={() => setMode(AppMode.USERS)}
                                    className={`
                                    w-full flex items-center py-2 px-3 rounded-sm transition-all duration-200 mt-1 ml-4 border-l-2
                                    ${mode === AppMode.USERS
                                            ? 'border-happiness-1 bg-happiness-1/5 text-happiness-1 dark:text-white dark:bg-happiness-1/10'
                                            : 'border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30'
                                        }
                                `}
                                >
                                    <UsersIcon sx={{ fontSize: 16, marginRight: '12px' }} />
                                    <span className="text-xs font-bold">Usuários</span>
                                </button>
                            </div>
                        </Collapse>
                    </div>


                </aside>

                {/* Main Content Area */}
                <main
                    className={`
                    flex-1 flex flex-col h-screen overflow-y-auto transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'ml-80' : 'ml-24'}
                `}
                >
                    {/* Topbar/Header */}
                    <header className="h-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-white/5 px-12 flex items-center justify-between transition-colors duration-300">
                        <div className="flex items-center gap-6">
                            {/* Toggle Removed from Header */}
                            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
                            <h2 className="hidden sm:block text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                                {getPageTitle()}
                            </h2>
                        </div>

                        <div className="flex items-center gap-8">
                            {/* Search Bar - Hidden on mobile */}
                            <div className="hidden lg:flex items-center bg-gray-50 dark:bg-white/5 rounded-sm px-6 py-3 w-96 border border-gray-100 dark:border-white/10 focus-within:border-happiness-1/30 focus-within:ring-4 focus-within:ring-happiness-1/5 transition-all">
                                <SearchIcon className="text-gray-400 w-5 h-5 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Busca Inteligente..."
                                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 dark:text-gray-200 w-full placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>

                            <div className="hidden sm:block">
                                <ThemeSwitcher />
                            </div>

                            <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>

                            <Tooltip title="Notificações">
                                <button className="relative p-2 text-gray-400 hover:text-happiness-1 transition-colors">
                                    <Badge badgeContent={3} color="error" variant="dot">
                                        <NotificationsIcon />
                                    </Badge>
                                </button>
                            </Tooltip>

                            <Tooltip title="Seu Perfil">
                                <IconButton
                                    onClick={handleProfileClick}
                                    sx={{
                                        p: 0,
                                        border: '2px solid white',
                                        boxShadow: '0 4px 12px rgba(var(--brand-primary), 0.2)',
                                        borderRadius: 1,
                                        '&:hover': { scale: '1.05' },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Avatar
                                        alt={userProfile?.full_name || 'Usuário'}
                                        src={userProfile?.avatar_url || ''}
                                        variant="square"
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: 'primary.main',
                                            fontWeight: 900,
                                            fontSize: '0.75rem',
                                            borderRadius: 1
                                        }}
                                    >
                                        {getInitials(userProfile?.full_name)}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>

                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                                onClick={handleCloseMenu}
                                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))',
                                        mt: 1.5,
                                        borderRadius: 1,
                                        minWidth: 200,
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translate(-50%, -50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                            >
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-2">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{userProfile?.role || 'Usuário'}</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{userProfile?.full_name}</p>
                                </div>
                                <MenuItem onClick={() => setMode(AppMode.PROFILE)} className="text-sm font-bold gap-3 py-3">
                                    <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                                    Seu Perfil
                                </MenuItem>
                                <MenuItem onClick={() => setMode(AppMode.DASHBOARD)} className="text-sm font-bold gap-3 py-3">
                                    <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                                    Configurações
                                </MenuItem>

                                {/* Gestor de Temas */}
                                <div className="px-4 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/10 dark:bg-white/5">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ZapIcon sx={{ fontSize: 14 }} />
                                        Ambiente de Cores
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                        {[
                                            { id: 'azure', label: 'Marítimo', colors: ['#4973F2', '#1B2B40'] },
                                            { id: 'emerald', label: 'Eco', colors: ['#29A683', '#1B2B40'] },
                                            { id: 'burgundy', label: 'Executivo', colors: ['#BF2633', '#590A18'] }
                                        ].map((themeOpt) => (
                                            <button
                                                key={themeOpt.id}
                                                onClick={() => setCurrentTheme(themeOpt.id)}
                                                className={`
                                                relative flex-1 group transition-all duration-300
                                                ${currentTheme === themeOpt.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}
                                            `}
                                            >
                                                <div
                                                    className={`
                                                    h-12 w-full rounded-sm mb-1.5 transition-all
                                                    ${currentTheme === themeOpt.id ? 'ring-2 ring-happiness-1 ring-offset-2 dark:ring-offset-zinc-900 border-none' : 'border border-gray-200 dark:border-white/10'}
                                                `}
                                                    style={{ background: `linear-gradient(135deg, ${themeOpt.colors[0]} 50%, ${themeOpt.colors[1]} 50%)` }}
                                                />
                                                <span className={`text-[9px] font-black uppercase tracking-widest block text-center ${currentTheme === themeOpt.id ? 'text-happiness-1' : 'text-gray-400'}`}>
                                                    {themeOpt.label}
                                                </span>
                                                {currentTheme === themeOpt.id && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-happiness-1 text-white rounded-full flex items-center justify-center shadow-sm">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-white/5 pt-2">
                                    <MenuItem onClick={handleLogout} className="text-sm font-bold gap-3 py-3 text-red-500">
                                        <ListItemIcon><LogoutIcon fontSize="small" className="text-red-500" /></ListItemIcon>
                                        Sair do Sistema
                                    </MenuItem>
                                </div>
                            </Menu>
                        </div>
                    </header>

                    {/* Content Render */}
                    <div className="flex-1 p-6 md:p-10 w-full animate-in fade-in duration-500">
                        {mode !== AppMode.DASHBOARD && <Breadcrumb items={getBreadcrumbs()} />}
                        {renderContent()}
                    </div>
                </main>
            </div>
        </ThemeProvider>
    );
}
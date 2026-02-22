import React, { useState, useEffect } from 'react';

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
    Forest as ForestIcon,
    Groups as GroupsIcon,
    Gavel as GavelIcon,
    Psychology as IntelligenceIcon,
} from '@mui/icons-material';
import { AppMode, UserProfile, Layer } from './types';
import { supabase } from '@/utils/supabase';
import { parseKmlToLayers } from './utils/geoUtils';
import { showSuccess, showError } from './utils/notifications';
import { Dashboard } from './components/Dashboard';
import { ProjectList } from './components/ProjectList';
import { NewProject } from './components/NewProject';
import { UserManagement } from './components/UserManagement';
import { UserProfilePage } from './components/UserProfile';
import { Login } from './components/Login';
import { CreateUser } from './components/CreateUser';
import { LandingPage } from './components/LandingPage';
import { KimiLandingPage } from './components/KimiLandingPage';
import { ItaquiESGLandingPage } from './components/ItaquiESGLandingPage';

// Páginas Públicas
import { PublicEnvironment } from './components/public/PublicEnvironment';
import { PublicSocial } from './components/public/PublicSocial';
import { PublicReports } from './components/public/PublicReports';
import { PublicIndicators } from './components/public/PublicIndicators';

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
import { NotificationCenter } from './components/strategic/NotificationCenter';

// Componente NavItem refatorado com Tailwind
interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, collapsed }) => (
    <div className="mb-1 px-2 group relative">
        <button
            onClick={onClick}
            title={collapsed ? label : ''}
            className={`
                w-full flex items-center py-[0.875rem] px-4 rounded-[0.125rem] transition-all duration-200 ease-in-out
                ${collapsed ? 'justify-center' : 'justify-start'}
                ${active
                    ? 'bg-happiness-1/10 text-happiness-1 dark:text-white dark:bg-happiness-1 shadow-sm'
                    : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }
            `}
        >
            <div className={`flex items-center justify-center ${collapsed ? '' : 'min-w-[40px]'}`}>
                {React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: 22 } })}
            </div>
            {!collapsed && (
                <span className={`text-sm font-bold whitespace-nowrap ${active ? 'font-black' : ''}`}>
                    {label}
                </span>
            )}
        </button>
    </div>
);

const SectionHeader: React.FC<{
    label: string;
    icon?: React.ReactNode;
    collapsed: boolean;
    open?: boolean;
    onToggle?: () => void
}> = ({ label, icon, collapsed, open, onToggle }) => (
    <div
        onClick={!collapsed ? onToggle : undefined}
        className={`px-4 py-[0.875rem] mt-6 flex items-center justify-between group transition-colors ${!collapsed && onToggle ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-[0.125rem] mx-2' : ''} ${collapsed ? 'text-center' : 'text-left'}`}
    >
        <div className="flex items-center w-full">
             {icon && !collapsed && (
                <div className="flex items-center justify-center min-w-[40px] text-black dark:text-white group-hover:text-happiness-1 transition-colors">
                    {React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: 22 } })}
                </div>
             )}
            {!collapsed && (
                <span className="text-sm font-bold text-black dark:text-white group-hover:text-happiness-1 transition-colors antialiased whitespace-nowrap ml-0 tracking-tight">
                    {label}
                </span>
            )}
            {collapsed && <span className="text-[11px] font-black uppercase tracking-[0.25em] text-black dark:text-white">•••</span>}
        </div>
        {!collapsed && onToggle && (
            <div className="text-black dark:text-white group-hover:text-happiness-1 transition-colors ml-2">
                {open ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
            </div>
        )}
    </div>
);

const getInitials = (name?: string) => {
    if (!name) return 'GS';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) setSidebarOpen(false);
            else setSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [kmlLayers, setKmlLayers] = useState<Layer[]>([]);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('gsocial-theme') || 'azure');

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

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (data && !error) setUserProfile(data as UserProfile);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session }, error }) => {
            if (error) {
                console.warn('Sessão inválida:', error.message);
                await supabase.auth.signOut({ scope: 'local' });
                setIsAuthenticated(false);
                setUserProfile(null);
            } else if (session) {
                setIsAuthenticated(true);
                fetchUserProfile(session.user.id);
            }
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setIsAuthenticated(false);
                setUserProfile(null);
            } else if (session) {
                setIsAuthenticated(true);
                if (!userProfile || userProfile.id !== session.user.id) fetchUserProfile(session.user.id);
            } else {
                setIsAuthenticated(false);
                setUserProfile(null);
            }
            setIsLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUserProfile(null);
    };

    // Component Content Selector
    const getComponent = () => {
        switch (mode) {
            case AppMode.DASHBOARD: return <Dashboard />;
            case AppMode.PUBLIC_ENVIRONMENT: return <PublicEnvironment onBack={() => setMode(AppMode.DASHBOARD)} onNavigate={(m) => setMode(m)} />;
            case AppMode.PUBLIC_SOCIAL: return <PublicSocial onBack={() => setMode(AppMode.DASHBOARD)} onNavigate={(m) => setMode(m)} />;
            case AppMode.PUBLIC_REPORTS: return <PublicReports onBack={() => setMode(AppMode.DASHBOARD)} onNavigate={(m) => setMode(m)} />;
            case AppMode.PUBLIC_INDICATORS: return <PublicIndicators onBack={() => setMode(AppMode.DASHBOARD)} onNavigate={(m) => setMode(m)} />;
            case AppMode.PROJECTS: return (
                <ProjectList
                    onAddNew={() => { setSelectedProject(null); setMode(AppMode.NEW_SOCIAL_PROJECT); }}
                    onEdit={(p) => {
                        setSelectedProject({
                            id: p.id, title: p.name, description: p.description || p.tema,
                            status: p.status === 'Concluído' ? 'completed' : p.status === 'Pausado' ? 'paused' : p.status === 'Planejado' ? 'planning' : 'active',
                            budget: parseFloat(p.budget || '0'), startDate: p.start_date || '', endDate: p.end_date || '',
                            beneficiariesTarget: p.beneficiaries_target || 0, neighborhoods: p.neighborhoods || (p.community ? [p.community] : []),
                            materialityTopics: p.materiality_topics || (p.tema ? [p.tema] : []), sdgTargets: p.sdg_targets || [],
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
            case AppMode.STRATEGIC_NOTIFICATIONS: return <NotificationCenter />;
            case AppMode.NEW_SOCIAL_PROJECT: return (
                <SocialProjectForm
                    key={selectedProject?.id || 'new'} initialData={selectedProject}
                    onSubmit={async (project) => {
                        try {
                            const projectData = {
                                name: project.title, pilar: 'Social', materiality_topics: (project as any).materialityTopics,
                                tema: (project as any).materialityTopics[0] || 'Geral',
                                status: project.status === 'completed' ? 'Concluído' : project.status === 'paused' ? 'Pausado' : project.status === 'planning' ? 'Planejado' : 'Em andamento',
                                community: project.neighborhoods[0] || 'Vila Bacanga', budget: project.budget.toString(),
                                description: project.description, start_date: project.startDate || null, end_date: project.endDate || null,
                                beneficiaries_target: project.beneficiariesTarget, neighborhoods: project.neighborhoods,
                                sdg_targets: project.sdgTargets, projected_sroi: project.projectedSroi, estimated_impact_value: project.estimatedImpactValue
                            };
                            if (selectedProject?.id) {
                                const { error } = await supabase.from('projects').update(projectData).eq('id', selectedProject.id);
                                if (error) throw error;
                                showSuccess('Projeto atualizado!');
                            } else {
                                const { error } = await supabase.from('projects').insert(projectData);
                                if (error) throw error;
                                showSuccess('Projeto criado!');
                            }
                            setMode(AppMode.PROJECTS);
                        } catch (error: any) { showError(`Falha ao salvar: ${error.message}`); }
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
            case AppMode.USERS: return 'Gestão de Membros';
            case AppMode.PROFILE: return 'Seu Perfil';
            case AppMode.ESG_CENTER: return 'Central de Diagnósticos ESG';
            case AppMode.STRATEGIC_NOTIFICATIONS: return 'Central de Alertas & Notificações';
            default: return 'ESGporto';
        }
    };

    const getBreadcrumbs = () => {
        const home = { label: 'Home', onClick: () => setMode(AppMode.DASHBOARD) };
        return [home, { label: getPageTitle() }];
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-zinc-950">
                <span className="text-black dark:text-gray-50 font-bold animate-pulse">Carregando ESGporto...</span>
            </div>
        );
    }

    const isPublicMode = [
        AppMode.PUBLIC_ENVIRONMENT, AppMode.PUBLIC_SOCIAL,
        AppMode.PUBLIC_REPORTS, AppMode.PUBLIC_INDICATORS
    ].includes(mode);

    if (!isAuthenticated && !isPublicMode) {
        if (showLogin) return <Login onLogin={() => setIsAuthenticated(true)} onBack={() => setShowLogin(false)} />;
        return <ItaquiESGLandingPage onLoginClick={() => setShowLogin(true)} onNavigate={(m) => setMode(m)} />;
    }

    if (isPublicMode) return getComponent();

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 font-sans transition-colors duration-300 relative">
            <div className="absolute inset-0 bg-happiness-bg-tint/30 pointer-events-none" />
            <ToastContainer />
            {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}
            <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-[#1C1C1C] text-black dark:text-white transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-gray-200 dark:border-white/5 ${sidebarOpen ? 'w-80 translate-x-0' : 'w-24 -translate-x-full lg:translate-x-0'}`}>
                <div className={`h-24 flex items-center px-8 transition-all duration-300 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                    {sidebarOpen ? (
                        <><div className="flex flex-col items-start gap-2"><img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" /><div className="animate-in fade-in duration-300"><h1 className="text-lg font-black tracking-tighter leading-none text-black dark:text-white">ESGporto</h1><p className="text-[11px] font-black text-black dark:text-white uppercase tracking-widest mt-1">Dash Intelligence</p></div></div><button onClick={() => setSidebarOpen(false)} className="p-1.5 text-black hover:text-happiness-1 hover:bg-happiness-1/5 rounded-sm transition-all"><MenuIcon sx={{ fontSize: 20 }} /></button></>
                    ) : (
                        <div className="flex flex-col items-center gap-4"><img src="/logo_itaqui.png" alt="Logo" className="w-10 h-10 object-contain" /><button onClick={() => setSidebarOpen(true)} className="p-2 text-black hover:text-happiness-1 hover:bg-happiness-1/5 rounded-sm transition-all"><MenuIcon sx={{ fontSize: 24 }} /></button></div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
                    <SectionHeader label="Visão Geral" icon={<DashboardIcon />} collapsed={!sidebarOpen} open={overviewOpen} onToggle={() => setOverviewOpen(!overviewOpen)} />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${overviewOpen || !sidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <NavItem icon={<DashboardIcon />} label="Dashboard Home" active={mode === AppMode.DASHBOARD} onClick={() => setMode(AppMode.DASHBOARD)} collapsed={!sidebarOpen} />
                    </div>
                </div>
            </aside>
            <main className={`flex-1 flex flex-col h-screen overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-24'} ml-0`}>
                <header className="h-20 md:h-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-white/5 px-4 md:px-12 flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-4 md:gap-6"><button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-black dark:text-white"><MenuIcon /></button><div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div><h2 className="hidden sm:block text-sm font-black text-black dark:text-gray-100 uppercase tracking-[0.2em] antialiased">{getPageTitle()}</h2></div>
                    <div className="flex items-center gap-8"><div className="hidden sm:block"><ThemeSwitcher /></div><div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div><div className="relative group"><button onClick={() => setMode(AppMode.STRATEGIC_NOTIFICATIONS)} className={`relative p-2 transition-colors ${mode === AppMode.STRATEGIC_NOTIFICATIONS ? 'text-happiness-1' : 'text-black hover:text-happiness-1'}`}><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span><NotificationsIcon /></button></div></div>
                </header>
                <div className="flex-1 p-6 md:p-10 w-full animate-in fade-in duration-500">
                    {mode !== AppMode.DASHBOARD && !isPublicMode && <Breadcrumb items={getBreadcrumbs()} />}
                    {getComponent()}
                </div>
            </main>
        </div>
    );
}

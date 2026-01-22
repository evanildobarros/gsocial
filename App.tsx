import React, { useState, useEffect } from 'react';
import {
    Tooltip,
    Badge,
    Collapse,
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
                    w-full flex items-center py-3 px-3 rounded-sm transition-all duration-200 ease-in-out
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

const SectionLabel: React.FC<{ label: string; collapsed: boolean }> = ({ label, collapsed }) => (
    <div className={`px-5 py-2 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ${collapsed ? 'text-center' : 'text-left'}`}>
        {collapsed ? '•••' : label}
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
            case AppMode.PROJECTS: return <ProjectList />;
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
            default: return 'ESGporto';
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
        { icon: <ReportingIcon />, label: "Diagnóstico (ESG)", mode: AppMode.SOCIAL_ASSESSMENT },
        { icon: <TerritoryIcon />, label: "Mapa ESG (GIS)", mode: AppMode.SOCIAL_GIS },
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

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
            <ToastContainer />

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-full bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-gray-200 dark:border-white/5
                    ${sidebarOpen ? 'w-72' : 'w-24'}
                `}
            >
                {/* Header */}
                <div className={`
                    h-20 flex items-center px-6 transition-all duration-300
                    ${sidebarOpen ? 'justify-between' : 'justify-center'}
                `}>
                    {sidebarOpen ? (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-happiness-1 rounded-sm flex items-center justify-center transform hover:rotate-6 transition-transform shadow-lg shadow-happiness-1/20 shrink-0">
                                    <AnchorIcon className="text-white" sx={{ fontSize: 24 }} />
                                </div>
                                <div className="animate-in fade-in duration-300">
                                    <h1 className="text-lg font-black tracking-tighter leading-none text-gray-900 dark:text-white">ESGporto</h1>
                                    <p className="text-[9px] font-black text-gray-400 dark:text-happiness-3 uppercase tracking-widest mt-0.5">Dash Intelligence</p>
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
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-400 hover:text-happiness-1 hover:bg-happiness-1/5 rounded-sm transition-all"
                        >
                            <MenuIcon sx={{ fontSize: 24 }} />
                        </button>
                    )}
                </div>

                {/* Navigation Scroll Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
                    <SectionLabel label="Menu Principal" collapsed={!sidebarOpen} />
                    {navItems.map(item => (
                        <NavItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            active={mode === item.mode}
                            onClick={() => setMode(item.mode)}
                            collapsed={!sidebarOpen}
                        />
                    ))}

                    <div className="my-4 border-t border-gray-100 dark:border-white/5 mx-4" />

                    <SectionLabel label="Gestão Ambiental" collapsed={!sidebarOpen} />
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

                    <div className="my-4 border-t border-gray-100 dark:border-white/5 mx-4" />

                    <SectionLabel label="Social & Resp." collapsed={!sidebarOpen} />
                    {socialItems.map(item => (
                        <NavItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            active={mode === item.mode || (item.mode === AppMode.PROJECTS && mode === AppMode.NEW_PROJECT)}
                            onClick={() => setMode(item.mode)}
                            collapsed={!sidebarOpen}
                        />
                    ))}

                    <div className="my-4 border-t border-gray-100 dark:border-white/5 mx-4" />

                    <SectionLabel label="Governança (GRC)" collapsed={!sidebarOpen} />
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

                    <div className="my-4 border-t border-gray-100 dark:border-white/5 mx-4" />

                    <SectionLabel label="Estratégico" collapsed={!sidebarOpen} />
                    <NavItem
                        icon={<AnalyticsIcon />}
                        label="Análise Preditiva"
                        active={mode === AppMode.STRATEGIC_PREDICTIVE}
                        onClick={() => setMode(AppMode.STRATEGIC_PREDICTIVE)}
                        collapsed={!sidebarOpen}
                    />
                    <NavItem icon={<NotificationsIcon />} label="Notificações" active={false} onClick={() => { }} collapsed={!sidebarOpen} />

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

                {/* User Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <div
                        onClick={() => setMode(AppMode.PROFILE)}
                        className={`
                            bg-gray-50 dark:bg-white/5 rounded-sm p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5
                             ${!sidebarOpen && 'justify-center'}
                        `}
                    >
                        <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-happiness-1 to-happiness-2 flex items-center justify-center text-white font-black text-xs shrink-0 ring-2 ring-gray-100 dark:ring-white/10">
                            {userProfile?.avatar_url ? (
                                <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                getInitials(userProfile?.full_name)
                            )}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userProfile?.full_name || 'Usuário'}</p>
                                <p className="text-[10px] font-medium text-gray-500 truncate">{userProfile?.email || '...'}</p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-colors"
                            >
                                <LogoutIcon sx={{ fontSize: 18 }} />
                            </button>
                        )}
                    </div>
                    {!sidebarOpen && (
                        <div className="mt-2 flex justify-center">
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-colors"
                            >
                                <LogoutIcon sx={{ fontSize: 20 }} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`
                    flex-1 flex flex-col h-screen overflow-y-auto transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'ml-72' : 'ml-24'}
                `}
            >
                {/* Topbar/Header */}
                <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-white/5 px-8 flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-6">
                        {/* Toggle Removed from Header */}
                        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
                        <h2 className="hidden sm:block text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                            {getPageTitle()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden lg:flex items-center bg-gray-50 dark:bg-white/5 rounded-sm px-4 py-2.5 w-80 border border-gray-100 dark:border-white/10 focus-within:border-happiness-1/30 focus-within:ring-4 focus-within:ring-happiness-1/5 transition-all">
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
                            <button
                                onClick={() => setMode(AppMode.PROFILE)}
                                className="w-9 h-9 rounded-sm bg-happiness-1 flex items-center justify-center text-white text-[10px] font-black hover:scale-105 transition-transform shadow-md shadow-happiness-1/20"
                            >
                                {userProfile?.avatar_url ? (
                                    <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    getInitials(userProfile?.full_name)
                                )}
                            </button>
                        </Tooltip>
                    </div>
                </header>

                {/* Content Render */}
                <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AppMode, UserProfile, Layer } from './types';
import { supabase } from '@/utils/supabase';
import { showSuccess } from './utils/notifications';
import { ToastContainer } from './components/Toast';
import { Breadcrumb } from './components/Breadcrumb';
import { AccessibilityMenu } from './components/strategic/AccessibilityMenu';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Autenticação e Landing
import { Login } from './components/Login';
import { ItaquiESGLandingPage } from './components/ItaquiESGLandingPage';

// Componentes Carregados Dinamicamente (Lazy Loading)
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectList = lazy(() => import('./components/ProjectList').then(m => ({ default: m.ProjectList })));
const NewProject = lazy(() => import('./components/NewProject').then(m => ({ default: m.NewProject })));
const UserManagement = lazy(() => import('./components/UserManagement').then(m => ({ default: m.UserManagement })));
const UserProfilePage = lazy(() => import('./components/UserProfile').then(m => ({ default: m.UserProfilePage })));
const CreateUser = lazy(() => import('./components/CreateUser').then(m => ({ default: m.CreateUser })));

const PublicEnvironment = lazy(() => import('./components/public/PublicEnvironment').then(m => ({ default: m.PublicEnvironment })));
const PublicSocial = lazy(() => import('./components/public/PublicSocial').then(m => ({ default: m.PublicSocial })));
const PublicReports = lazy(() => import('./components/public/PublicReports').then(m => ({ default: m.PublicReports })));
const PublicIndicators = lazy(() => import('./components/public/PublicIndicators').then(m => ({ default: m.PublicIndicators })));
const PublicGovernance = lazy(() => import('./components/public/PublicGovernance').then(m => ({ default: m.PublicGovernance })));
const PublicCompliance = lazy(() => import('./components/public/PublicCompliance').then(m => ({ default: m.PublicCompliance })));
const PublicCareers = lazy(() => import('./components/public/PublicCareers').then(m => ({ default: m.PublicCareers })));

const Decarbonization = lazy(() => import('./components/environmental/Decarbonization').then(m => ({ default: m.Decarbonization })));
const Efficiency = lazy(() => import('./components/environmental/Efficiency').then(m => ({ default: m.Efficiency })));
const PollutionControl = lazy(() => import('./components/environmental/PollutionControl').then(m => ({ default: m.PollutionControl })));
const Compliance = lazy(() => import('./components/environmental/Compliance').then(m => ({ default: m.Compliance })));
const LAIA = lazy(() => import('./components/environmental/LAIA').then(m => ({ default: m.LAIA })));
const ShipWaste = lazy(() => import('./components/environmental/ShipWaste').then(m => ({ default: m.ShipWaste })));
const MeteoPredictiveModule = lazy(() => import('./components/environmental/MeteoPredictiveModule').then(m => ({ default: m.MeteoPredictiveModule })));
const EnvironmentalDiagnosticForm = lazy(() => import('./components/environmental/EnvironmentalDiagnosticForm').then(m => ({ default: m.EnvironmentalDiagnosticForm })));

const SROICalculator = lazy(() => import('./components/social/SROICalculator').then(m => ({ default: m.SROICalculator })));
const CommunityRelations = lazy(() => import('./components/social/CommunityRelations').then(m => ({ default: m.CommunityRelations })));
const DiversityDashboard = lazy(() => import('./components/social/DiversityDashboard').then(m => ({ default: m.DiversityDashboard })));
const HumanRights = lazy(() => import('./components/social/HumanRights').then(m => ({ default: m.HumanRights })));

const RiskHeatmap = lazy(() => import('./components/governance/RiskHeatmap').then(m => ({ default: m.RiskHeatmap })));
const ReportingHub = lazy(() => import('./components/governance/ReportingHub').then(m => ({ default: m.ReportingHub })));
const SupplyChainAudit = lazy(() => import('./components/governance/SupplyChainAudit').then(m => ({ default: m.SupplyChainAudit })));
const InnovationFunnel = lazy(() => import('./components/governance/InnovationFunnel').then(m => ({ default: m.InnovationFunnel })));
const GovernanceDiagnosticForm = lazy(() => import('./components/governance/GovernanceDiagnosticForm').then(m => ({ default: m.GovernanceDiagnosticForm })));
const ESGDiagnosticForm = lazy(() => import('./components/governance/ESGDiagnosticForm').then(m => ({ default: m.ESGDiagnosticForm })));
const ESGDiagnosticsCenter = lazy(() => import('./components/ESGDiagnosticsCenter').then(m => ({ default: m.ESGDiagnosticsCenter })));

const PredictiveAnalysis = lazy(() => import('./components/strategic/PredictiveAnalysis').then(m => ({ default: m.PredictiveAnalysis })));
const NotificationCenter = lazy(() => import('./components/strategic/NotificationCenter').then(m => ({ default: m.NotificationCenter })));

const GeoSpatialModule = lazy(() => import('./components/territory/GeoSpatialModule').then(m => ({ default: m.GeoSpatialModule })));
const CommunityAssessmentForm = lazy(() => import('./components/territory/CommunityAssessmentForm'));
const SocialProjectForm = lazy(() => import('./components/social/SocialProjectForm'));

// NavItem, SectionHeader, and getInitials have been moved to components/layout

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [kmlLayers, setKmlLayers] = useState<Layer[]>([]);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('gsocial-theme') || 'azure');

    // Submenu states are now managed internally inside the Sidebar component

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) setSidebarOpen(false);
            else setSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('gsocial-theme', currentTheme);
    }, [currentTheme]);

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (data && !error) setUserProfile(data as UserProfile);
        } catch (error) { console.error('Error fetching profile:', error); }
    };

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session }, error }) => {
            if (error) {
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

    // Profile menu states and click-outside are now managed internally inside the Header component

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
            case AppMode.PUBLIC_GOVERNANCE: return <PublicGovernance onBack={() => setMode(AppMode.DASHBOARD)} onNavigate={(m) => setMode(m)} />;
            case AppMode.PUBLIC_COMPLIANCE: return <PublicCompliance onBack={() => setMode(AppMode.DASHBOARD)} onNavigate={(m) => setMode(m)} />;
            case AppMode.PUBLIC_CAREERS: return <PublicCareers onBack={() => setMode(AppMode.DASHBOARD)} onNavigate={(m) => setMode(m)} />;
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
            case AppMode.ESG_CENTER: return <ESGDiagnosticsCenter onSelectMode={(m, t) => setMode(m)} />;
            case AppMode.ENV_DIAGNOSTIC: return <EnvironmentalDiagnosticForm />;
            case AppMode.GOV_ESG_DIAGNOSTIC: return <GovernanceDiagnosticForm />;
            case AppMode.STRATEGIC_NOTIFICATIONS: return <NotificationCenter />;
            case AppMode.NEW_SOCIAL_PROJECT: return (
                <SocialProjectForm
                    key={selectedProject?.id || 'new'} initialData={selectedProject}
                    onSubmit={async (project) => {
                        const projectData = {
                            name: project.title, pilar: 'Social', materiality_topics: (project as any).materialityTopics,
                            tema: (project as any).materialityTopics[0] || 'Geral',
                            status: project.status === 'completed' ? 'Concluído' : project.status === 'paused' ? 'Pausado' : project.status === 'planning' ? 'Planejado' : 'Em andamento',
                            community: project.neighborhoods[0] || 'Vila Bacanga', budget: project.budget.toString(),
                            description: project.description, start_date: project.startDate || null, end_date: project.endDate || null,
                            beneficiaries_target: project.beneficiariesTarget, neighborhoods: project.neighborhoods,
                            sdg_targets: project.sdgTargets, projected_sroi: project.projectedSroi, estimated_impact_value: project.estimatedImpactValue
                        };
                        if (selectedProject?.id) { await supabase.from('projects').update(projectData).eq('id', selectedProject.id); showSuccess('Projeto atualizado!'); }
                        else { await supabase.from('projects').insert(projectData); showSuccess('Projeto criado!'); }
                        setMode(AppMode.PROJECTS);
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

    if (isLoading) return <div className="flex justify-center items-center h-screen bg-white text-black"><span className="font-bold animate-pulse tracking-widest text-xs">Carregando...</span></div>;

    const isPublicMode = [AppMode.PUBLIC_ENVIRONMENT, AppMode.PUBLIC_SOCIAL, AppMode.PUBLIC_REPORTS, AppMode.PUBLIC_INDICATORS, AppMode.PUBLIC_GOVERNANCE, AppMode.PUBLIC_COMPLIANCE, AppMode.PUBLIC_CAREERS].includes(mode);

    if (!isAuthenticated && !isPublicMode) {
        if (showLogin) return <Login onLogin={() => setIsAuthenticated(true)} onBack={() => setShowLogin(false)} />;
        return <ItaquiESGLandingPage onLoginClick={() => setShowLogin(true)} onNavigate={(m) => setMode(m)} />;
    }

    if (isPublicMode) return getComponent();

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 font-sans transition-colors relative text-black">
            <div className="absolute inset-0 bg-happiness-bg-tint/30 pointer-events-none" />
            <ToastContainer />
            {isPublicMode && <AccessibilityMenu />}
            {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                mode={mode}
                setMode={setMode}
            />

            <main className={`flex-1 flex flex-col h-dvh overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-24'} ml-0`}>
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    mode={mode}
                    setMode={setMode}
                    pageTitle={getPageTitle()}
                    userProfile={userProfile}
                    currentTheme={currentTheme}
                    setCurrentTheme={setCurrentTheme}
                    handleLogout={handleLogout}
                />
                <div className="flex-1 p-6 md:p-10 w-full animate-in fade-in duration-500">
                    {mode !== AppMode.DASHBOARD && !isPublicMode && <Breadcrumb items={getBreadcrumbs()} />}
                    <Suspense fallback={<div className="flex justify-center items-center h-full"><span className="font-bold animate-pulse text-xs tracking-widest text-black">Carregando Tela...</span></div>}>
                        {getComponent()}
                    </Suspense>
                </div>
            </main>
        </div>
    );
}

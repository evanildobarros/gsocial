import React, { useState } from 'react';
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
    Menu as MenuIcon,
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
    Forest as ForestIcon,
    Groups as GroupsIcon,
    Gavel as GavelIcon,
    Psychology as IntelligenceIcon,
} from '@mui/icons-material';
import { AppMode } from '../../types';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    mode: AppMode;
    setMode: (mode: AppMode) => void;
}

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
                w-full flex items-center py-[0.875rem] px-4 rounded-lg transition-all duration-200 ease-in-out cursor-pointer
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
        className={`px-4 py-[0.875rem] mt-6 flex items-center justify-between group transition-colors ${!collapsed && onToggle ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg mx-2' : ''} ${collapsed ? 'text-center' : 'text-left'}`}
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
            {collapsed && <span className="text-[11px] font-black tracking-[0.25em] text-black dark:text-white">•••</span>}
        </div>
        {!collapsed && onToggle && (
            <div className="text-black dark:text-white group-hover:text-happiness-1 transition-colors ml-2">
                {open ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
            </div>
        )}
    </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
    mode,
    setMode,
}) => {
    // Submenu States migrated from App.tsx
    const [overviewOpen, setOverviewOpen] = useState(true);
    const [envOpen, setEnvOpen] = useState(false);
    const [socialOpen, setSocialOpen] = useState(false);
    const [govOpen, setGovOpen] = useState(false);
    const [strategicOpen, setStrategicOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const envItems = [
        { icon: <ZapIcon />, label: "Clima & Carbono", mode: AppMode.ENV_DECARBONIZATION },
        { icon: <DropletsIcon />, label: "Recursos (Energia/H2O)", mode: AppMode.ENV_EFFICIENCY },
        { icon: <ShieldIcon />, label: "Poluição & PAM", mode: AppMode.ENV_POLLUTION },
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
    ];
    
    const diagItems = [
        { icon: <ReportingIcon />, label: "Central de Diagnósticos", mode: AppMode.ESG_CENTER },
        { icon: <TerritoryIcon />, label: "Mapa ESG (GIS)", mode: AppMode.SOCIAL_GIS },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-[#1C1C1C] text-black dark:text-white transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-gray-200 dark:border-white/5 ${sidebarOpen ? 'w-80 translate-x-0' : 'w-24 -translate-x-full lg:translate-x-0'}`}>
            <div className={`h-24 flex items-center px-8 transition-all duration-300 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                {sidebarOpen ? (
                    <>
                        <div className="flex flex-col items-start gap-1">
                            <img src="/logo_itaqui.png" alt="Logo" className="h-8 w-auto" />
                            <h1 className="text-base font-black tracking-tighter text-black dark:text-white mt-1">ESGporto</h1>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-black dark:text-white hover:text-happiness-1 hover:bg-happiness-1/5 rounded-sm transition-all cursor-pointer">
                            <MenuIcon sx={{ fontSize: 20 }} />
                        </button>
                    </>
                ) : (
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-black dark:text-white hover:text-happiness-1 hover:bg-happiness-1/5 rounded-sm transition-all cursor-pointer">
                        <MenuIcon sx={{ fontSize: 24 }} />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
                <SectionHeader label="Visão Geral" icon={<DashboardIcon />} collapsed={!sidebarOpen} open={overviewOpen} onToggle={() => setOverviewOpen(!overviewOpen)} />
                <div className={`overflow-hidden transition-all duration-300 ${overviewOpen || !sidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <NavItem icon={<DashboardIcon />} label="Dashboard Home" active={mode === AppMode.DASHBOARD} onClick={() => setMode(AppMode.DASHBOARD)} collapsed={!sidebarOpen} />
                    {diagItems.map(item => (
                        <NavItem key={item.label} icon={item.icon} label={item.label} active={mode === item.mode} onClick={() => setMode(item.mode)} collapsed={!sidebarOpen} />
                    ))}
                </div>
                
                <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />
                
                <SectionHeader label="Pilar Ambiental (E)" icon={<ForestIcon />} collapsed={!sidebarOpen} open={envOpen} onToggle={() => setEnvOpen(!envOpen)} />
                <div className={`overflow-hidden transition-all duration-300 ${envOpen || !sidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {envItems.map(item => (
                        <NavItem key={item.label} icon={item.icon} label={item.label} active={mode === item.mode} onClick={() => setMode(item.mode)} collapsed={!sidebarOpen} />
                    ))}
                </div>
                
                <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />
                
                <SectionHeader label="Pilar Social (S)" icon={<GroupsIcon />} collapsed={!sidebarOpen} open={socialOpen} onToggle={() => setSocialOpen(!socialOpen)} />
                <div className={`overflow-hidden transition-all duration-300 ${socialOpen || !sidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {socialItems.map(item => (
                        <NavItem key={item.label} icon={item.icon} label={item.label} active={mode === item.mode || (item.mode === AppMode.PROJECTS && mode === AppMode.NEW_SOCIAL_PROJECT)} onClick={() => setMode(item.mode)} collapsed={!sidebarOpen} />
                    ))}
                </div>
                
                <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />
                
                <SectionHeader label="Pilar Governança (G)" icon={<GavelIcon />} collapsed={!sidebarOpen} open={govOpen} onToggle={() => setGovOpen(!govOpen)} />
                <div className={`overflow-hidden transition-all duration-300 ${govOpen || !sidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {govItems.map(item => (
                        <NavItem key={item.label} icon={item.icon} label={item.label} active={mode === item.mode} onClick={() => setMode(item.mode)} collapsed={!sidebarOpen} />
                    ))}
                </div>
                
                <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-4" />
                
                <SectionHeader label="Inteligência & IA" icon={<IntelligenceIcon />} collapsed={!sidebarOpen} open={strategicOpen} onToggle={() => setStrategicOpen(!strategicOpen)} />
                <div className={`overflow-hidden transition-all duration-300 ${strategicOpen || !sidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <NavItem icon={<AnalyticsIcon />} label="Análise Preditiva" active={mode === AppMode.STRATEGIC_PREDICTIVE} onClick={() => setMode(AppMode.STRATEGIC_PREDICTIVE)} collapsed={!sidebarOpen} />
                    <NavItem icon={<NotificationsIcon />} label="Alertas & Notificações" active={mode === AppMode.STRATEGIC_NOTIFICATIONS} onClick={() => setMode(AppMode.STRATEGIC_NOTIFICATIONS)} collapsed={!sidebarOpen} />
                </div>
                
                <div className="my-4 border-t border-gray-100 dark:border-white/5 mx-4" />
                
                <div className="mb-1 px-2 group relative">
                    <button onClick={() => setSettingsOpen(!settingsOpen)} className={`w-full flex items-center py-[0.875rem] px-4 rounded-lg transition-all cursor-pointer ${!sidebarOpen ? 'justify-center' : 'justify-start'} ${mode === AppMode.USERS ? 'bg-happiness-1/10 text-happiness-1 dark:bg-happiness-1 dark:text-white' : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <div className={`flex items-center justify-center ${!sidebarOpen ? '' : 'min-w-[40px]'}`}>
                            <SettingsIcon sx={{ fontSize: 22 }} />
                        </div>
                        {sidebarOpen && (
                            <>
                                <span className="text-sm font-bold flex-1 text-left">Configurações</span>
                                {settingsOpen ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
                            </>
                        )}
                    </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${settingsOpen && sidebarOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 pr-2">
                        <button onClick={() => setMode(AppMode.USERS)} className={`w-full flex items-center py-2.5 px-4 rounded-lg transition-all mt-1 ml-4 border-l-2 cursor-pointer ${mode === AppMode.USERS ? 'border-happiness-1 bg-happiness-1/5 text-happiness-1 dark:text-white dark:bg-happiness-1/10' : 'border-gray-200 dark:border-white/10 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                            <UsersIcon sx={{ fontSize: 18, marginRight: '12px' }} />
                            <span className="text-sm font-bold tracking-tight">Usuários</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

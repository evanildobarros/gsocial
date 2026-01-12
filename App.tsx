import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, Plus, Anchor, UserCircle, LogOut, Settings, Bell, Search, Menu } from 'lucide-react';
import { AppMode } from './types';
import { Dashboard } from './components/Dashboard';
import { ProjectList } from './components/ProjectList';
import { NewProject } from './components/NewProject';
import { Login } from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (mode) {
        case AppMode.DASHBOARD: return <Dashboard />;
        case AppMode.PROJECTS: return <ProjectList />;
        case AppMode.NEW_PROJECT: return <NewProject onBack={() => setMode(AppMode.PROJECTS)} />;
        default: return <Dashboard />;
    }
  };

  const NavItem = ({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
        }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} />
        <span className={!sidebarOpen ? 'hidden lg:block' : ''}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out z-20 ${sidebarOpen ? 'w-72' : 'w-20'} shadow-2xl`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-blue-800/50">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10">
                    <Anchor className="text-white w-6 h-6" />
                </div>
                {sidebarOpen && (
                    <div className="flex flex-col animate-in fade-in duration-300">
                        <span className="font-bold text-lg leading-none tracking-tight">gSocial</span>
                        <span className="text-xs text-orange-400 font-bold uppercase tracking-widest">ESG Edition</span>
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="mb-6 px-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                {sidebarOpen ? 'Menu Principal' : 'Menu'}
            </div>
            
            <NavItem 
                active={mode === AppMode.DASHBOARD} 
                icon={LayoutDashboard} 
                label="Visão Geral" 
                onClick={() => setMode(AppMode.DASHBOARD)} 
            />
            <NavItem 
                active={mode === AppMode.PROJECTS || mode === AppMode.NEW_PROJECT} 
                icon={ClipboardList} 
                label="Projetos & Ações" 
                onClick={() => setMode(AppMode.PROJECTS)} 
            />
            
            <div className="pt-6 mt-6 border-t border-blue-800/50">
                <div className="mb-4 px-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                    {sidebarOpen ? 'Configurações' : 'Cfg'}
                </div>
                <NavItem active={false} icon={Settings} label="Administração" onClick={() => {}} />
            </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-800/50 bg-blue-950/30">
            <button 
                onClick={() => setIsAuthenticated(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span>Sair do Sistema</span>}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex justify-between items-center px-8 z-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
                    {mode === AppMode.DASHBOARD && 'Painel de Diagnóstico'}
                    {mode === AppMode.PROJECTS && 'Gestão de Portfólio'}
                    {mode === AppMode.NEW_PROJECT && 'Novo Projeto'}
                </h2>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar..." 
                        className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                    />
                </div>

                <div className="h-8 w-px bg-gray-200"></div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        GS
                    </div>
                    <div className="hidden md:block text-sm">
                        <p className="font-bold text-gray-800">Gestor ESG</p>
                        <p className="text-gray-500 text-xs">Porto do Itaqui</p>
                    </div>
                </div>
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
            <div className="max-w-7xl mx-auto pb-10">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
}
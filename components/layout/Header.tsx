import React, { useState, useEffect, useRef } from 'react';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    Bolt as ZapIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { AppMode, UserProfile } from '../../types';
import { ThemeSwitcher } from '../ThemeSwitcher';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    pageTitle: string;
    userProfile: UserProfile | null;
    currentTheme: string;
    setCurrentTheme: (theme: string) => void;
    handleLogout: () => void;
}

const getInitials = (name?: string) => {
    if (!name) return 'GS';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
};

export const Header: React.FC<HeaderProps> = ({
    setSidebarOpen,
    mode,
    setMode,
    pageTitle,
    userProfile,
    currentTheme,
    setCurrentTheme,
    handleLogout,
}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-20 md:h-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-white/5 px-4 md:px-12 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-4 md:gap-6">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-black dark:text-white cursor-pointer">
                    <MenuIcon />
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
                <h2 className="hidden sm:block text-sm font-black text-black dark:text-white tracking-[0.2em]">{pageTitle}</h2>
            </div>
            
            <div className="flex items-center gap-8">
                <div className="hidden sm:block">
                    <ThemeSwitcher />
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>
                
                <div className="relative group">
                    <button 
                        onClick={() => setMode(AppMode.STRATEGIC_NOTIFICATIONS)} 
                        className={`relative p-2 transition-colors cursor-pointer ${mode === AppMode.STRATEGIC_NOTIFICATIONS ? 'text-happiness-1' : 'text-black dark:text-white hover:text-happiness-1'}`}
                    >
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                        <NotificationsIcon />
                    </button>
                </div>
                
                <div className="relative" ref={profileMenuRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-0 border-2 border-white dark:border-zinc-900 shadow-lg rounded-full hover:scale-105 transition-transform overflow-hidden cursor-pointer">
                        <div className="w-10 h-10 bg-happiness-1 flex items-center justify-center text-white font-black text-xs">
                            {userProfile?.avatar_url ? (
                                <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                getInitials(userProfile?.full_name)
                            )}
                        </div>
                    </button>
                    
                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-4 w-72 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200 text-left">
                            <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white dark:bg-[#1E1E1E] transform rotate-45 border-l border-t border-gray-100 dark:border-white/5"></div>
                            
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                <p className="text-[11px] font-black text-black dark:text-white tracking-widest mb-1">{userProfile?.role || 'Usuário'}</p>
                                <p className="text-base font-bold text-black dark:text-white leading-tight truncate">{userProfile?.full_name}</p>
                                <p className="text-xs text-black dark:text-white truncate mt-0.5">{userProfile?.email}</p>
                            </div>
                            
                            <div className="p-2">
                                <button 
                                    onClick={() => { setMode(AppMode.PROFILE); setIsProfileOpen(false); }} 
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                                >
                                    <AccountCircleIcon fontSize="small" className="text-black dark:text-white" />
                                    Seu Perfil
                                </button>
                                <button 
                                    onClick={() => { setMode(AppMode.DASHBOARD); setIsProfileOpen(false); }} 
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                                >
                                    <SettingsIcon fontSize="small" className="text-black dark:text-white" />
                                    Configurações
                                </button>
                            </div>
                            
                            <div className="px-4 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
                                <p className="text-[11px] font-black text-black dark:text-white tracking-widest mb-3 flex items-center gap-2">
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
                                            className={`relative flex-1 group transition-all duration-300 cursor-pointer ${currentTheme === themeOpt.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
                                            title={themeOpt.label}
                                        >
                                            <div 
                                                className={`h-8 w-full rounded-md mb-1.5 transition-all ${currentTheme === themeOpt.id ? 'ring-2 ring-happiness-1 ring-offset-2 dark:ring-offset-zinc-900' : 'border border-gray-200 dark:border-white/10'}`} 
                                                style={{ background: `linear-gradient(135deg, ${themeOpt.colors[0]} 50%, ${themeOpt.colors[1]} 50%)` }} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-2 border-t border-gray-100 dark:border-white/5">
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                                >
                                    <LogoutIcon fontSize="small" />
                                    Sair do Sistema
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

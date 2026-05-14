import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ShieldCheck, Anchor, ChevronDown } from 'lucide-react';
import { AppMode } from '../types';

// Modular Sections
import { HeroSection } from './esg/HeroSection';
import { BentoCommitments } from './esg/BentoCommitments';
import { IndicatorsSection } from './esg/IndicatorsSection';
import { TransparencySection } from './esg/TransparencySection';
import { NewsSection } from './esg/NewsSection';
import { Footer } from './esg/Footer';
import { AccessibilityMenu } from './strategic/AccessibilityMenu';
import { CitizenPortalCard } from './esg/CitizenPortalCard';

interface ItaquiESGLandingPageProps {
    onLoginClick?: () => void;
    onNavigate?: (mode: AppMode) => void;
}

export const ItaquiESGLandingPage: React.FC<ItaquiESGLandingPageProps> = ({ onLoginClick, onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileEsgOpen, setMobileEsgOpen] = useState(false);
    const [mobileTranspOpen, setMobileTranspOpen] = useState(false);
    
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        const handleScroll = () => {
            setScrolled(container.scrollTop > 50);
            
            // Scroll Spy Logic
            const hero = container.scrollTop < 500;
            const commitments = container.scrollTop >= 500 && container.scrollTop < 1200;
            const transparency = container.scrollTop >= 1200 && container.scrollTop < 1800;
            const news = container.scrollTop >= 1800;

            if (hero) setActiveSection('hero');
            else if (commitments) setActiveSection('commitments');
            else if (transparency) setActiveSection('transparency');
            else if (news) setActiveSection('news');
        };
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (contrast) document.documentElement.classList.add('high-contrast');
        else document.documentElement.classList.remove('high-contrast');
    }, [contrast]);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);

    return (
        <div ref={containerRef} className="h-screen overflow-y-auto bg-black dark:bg-black font-sans text-black dark:text-white selection:bg-green-100 scroll-smooth">
            <AccessibilityMenu />

            {/* Header / Navbar */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-black dark:bg-black shadow-lg py-3' : 'bg-transparent py-5 top-0'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img 
                                src="/logo_itaqui.png" 
                                alt="Porto do Itaqui" 
                                className={`h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-300 ${!(scrolled || mobileMenuOpen) && !contrast ? 'brightness-0 invert' : ''}`} 
                            />
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                            
                            {/* Pilares ESG Dropdown */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 text-sm font-semibold transition-colors ${scrolled || mobileMenuOpen ? 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400' : 'text-white/80 hover:text-white'}`}>
                                    Pilares ESG <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                </button>
                                <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 flex flex-col gap-1">
                                        <button onClick={() => onNavigate?.(AppMode.PUBLIC_ENVIRONMENT)} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-xl transition-colors">🌱 Meio Ambiente</button>
                                        <button onClick={() => onNavigate?.(AppMode.PUBLIC_SOCIAL)} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-xl transition-colors">🤝 Responsabilidade Social</button>
                                        <button onClick={() => onNavigate?.(AppMode.PUBLIC_GOVERNANCE)} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-xl transition-colors">🏛️ Governança Corporativa</button>
                                    </div>
                                </div>
                            </div>

                            {/* Transparência Dropdown */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 text-sm font-semibold transition-colors ${activeSection === 'transparency' ? 'text-green-500' : (scrolled || mobileMenuOpen ? 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400' : 'text-white/80 hover:text-white')}`}>
                                    Transparência <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                </button>
                                <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 flex flex-col gap-1">
                                        <button onClick={() => onNavigate?.(AppMode.PUBLIC_REPORTS)} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-xl transition-colors">📊 Relatórios ESG</button>
                                        <button onClick={() => onNavigate?.(AppMode.PUBLIC_INDICATORS)} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-xl transition-colors">📈 Painel de Indicadores</button>
                                        <button onClick={() => onNavigate?.(AppMode.PUBLIC_COMPLIANCE)} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-xl transition-colors">⚖️ Compliance & Ética</button>
                                    </div>
                                </div>
                            </div>

                            {/* Carreiras */}
                            <button
                                onClick={() => onNavigate?.(AppMode.PUBLIC_CAREERS)}
                                className={`text-sm font-semibold transition-colors ${scrolled || mobileMenuOpen ? 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400' : 'text-white/80 hover:text-white'}`}
                            >
                                Carreiras
                            </button>

                            <button
                                onClick={onLoginClick}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${scrolled || mobileMenuOpen 
                                    ? 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg shadow-green-600/20' 
                                    : 'bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black hover:shadow-lg'
                                }`}
                            >
                                Acesso Restrito
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button 
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || mobileMenuOpen ? 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white hover:bg-white/10'}`} 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[80vh] animate-in slide-in-from-top-2 duration-300">
                        <div className="px-6 pt-4 pb-8 flex flex-col gap-2">
                            
                            {/* Mobile Pilares ESG */}
                            <div className="flex flex-col">
                                <button onClick={() => setMobileEsgOpen(!mobileEsgOpen)} className="flex items-center justify-between w-full px-4 py-4 text-lg font-bold text-black dark:text-white hover:bg-green-50 dark:hover:bg-white/5 rounded-xl transition-all">
                                    Pilares ESG <ChevronDown size={20} className={`transition-transform duration-300 ${mobileEsgOpen ? 'rotate-180 text-green-600' : ''}`} />
                                </button>
                                {mobileEsgOpen && (
                                    <div className="flex flex-col gap-1 pl-6 pr-4 py-2 bg-gray-50 dark:bg-zinc-900/50 rounded-xl mb-2">
                                        <button onClick={() => { setMobileMenuOpen(false); onNavigate?.(AppMode.PUBLIC_ENVIRONMENT); }} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-green-600">🌱 Meio Ambiente</button>
                                        <button onClick={() => { setMobileMenuOpen(false); onNavigate?.(AppMode.PUBLIC_SOCIAL); }} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-green-600">🤝 Responsabilidade Social</button>
                                        <button onClick={() => { setMobileMenuOpen(false); onNavigate?.(AppMode.PUBLIC_GOVERNANCE); }} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-green-600">🏛️ Governança Corporativa</button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Transparência */}
                            <div className="flex flex-col">
                                <button onClick={() => setMobileTranspOpen(!mobileTranspOpen)} className="flex items-center justify-between w-full px-4 py-4 text-lg font-bold text-black dark:text-white hover:bg-green-50 dark:hover:bg-white/5 rounded-xl transition-all">
                                    Transparência <ChevronDown size={20} className={`transition-transform duration-300 ${mobileTranspOpen ? 'rotate-180 text-green-600' : ''}`} />
                                </button>
                                {mobileTranspOpen && (
                                    <div className="flex flex-col gap-1 pl-6 pr-4 py-2 bg-gray-50 dark:bg-zinc-900/50 rounded-xl mb-2">
                                        <button onClick={() => { setMobileMenuOpen(false); onNavigate?.(AppMode.PUBLIC_REPORTS); }} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-green-600">📊 Relatórios ESG</button>
                                        <button onClick={() => { setMobileMenuOpen(false); onNavigate?.(AppMode.PUBLIC_INDICATORS); }} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-green-600">📈 Painel de Indicadores</button>
                                        <button onClick={() => { setMobileMenuOpen(false); onNavigate?.(AppMode.PUBLIC_COMPLIANCE); }} className="text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-green-600">⚖️ Compliance & Ética</button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Carreiras */}
                            <button
                                onClick={() => { setMobileMenuOpen(false); onNavigate?.(AppMode.PUBLIC_CAREERS); }}
                                className="block w-full text-left px-4 py-4 text-lg font-bold text-black dark:text-white hover:bg-green-50 dark:hover:bg-white/5 rounded-xl transition-all"
                            >
                                Carreiras
                            </button>

                            <div className="pt-4 px-2 mt-4 border-t border-gray-100 dark:border-white/10">
                                <button
                                    onClick={() => { setMobileMenuOpen(false); onLoginClick?.(); }}
                                    className="w-full px-6 py-4 bg-green-600 text-white text-lg font-bold uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-lg active:scale-95"
                                >
                                    Acesso Restrito
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Sections */}
            <main>
                <HeroSection onScrollClick={() => {
                    const el = document.getElementById('indicators');
                    el?.scrollIntoView({ behavior: 'smooth' });
                }} />
                
                {/* Quick Access: Portal do Cidadão */}
                <section className="py-12 bg-gray-50 dark:bg-zinc-950 flex justify-center px-6 lg:px-8">
                    <CitizenPortalCard onNavigate={onNavigate} />
                </section>

                <BentoCommitments />
                <IndicatorsSection id="indicators" />
                <TransparencySection />
                <NewsSection />
            </main>

            <Footer onNavigate={onNavigate} />
        </div>
    );
};

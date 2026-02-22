import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ShieldCheck, Anchor } from 'lucide-react';
import { AppMode } from '../types';

// Modular Sections
import { HeroSection } from './esg/HeroSection';
import { BentoCommitments } from './esg/BentoCommitments';
import { TransparencySection } from './esg/TransparencySection';
import { NewsSection } from './esg/NewsSection';

interface ItaquiESGLandingPageProps {
    onLoginClick?: () => void;
    onNavigate?: (mode: AppMode) => void;
}

export const ItaquiESGLandingPage: React.FC<ItaquiESGLandingPageProps> = ({ onLoginClick, onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleScroll = () => setScrolled(container.scrollTop > 50);
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
        <div ref={containerRef} className="h-screen overflow-y-auto bg-white dark:bg-black font-sans text-black dark:text-white selection:bg-green-100 scroll-smooth">
            
            {/* Accessibility Bar */}
            <div className={`fixed top-0 w-full z-[60] py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 flex justify-end gap-6 transition-all ${scrolled ? 'translate-y-[-100%]' : 'translate-y-0'}`}>
                <div className="flex items-center gap-4 border-r border-white/20 pr-6">
                    <button onClick={() => setFontSize(prev => Math.min(prev + 10, 150))} className="hover:text-green-400 transition-colors px-2 py-1">Aumentar Fonte</button>
                    <button onClick={() => setFontSize(prev => Math.max(prev - 10, 80))} className="hover:text-green-400 transition-colors px-2 py-1">Diminuir Fonte</button>
                </div>
                <button onClick={() => setContrast(!contrast)} className="flex items-center gap-2 hover:text-green-400 transition-colors px-2 py-1">
                    <div className={`w-3 h-3 rounded-full border border-white ${contrast ? 'bg-white' : 'bg-black'}`}></div>
                    Contraste
                </button>
            </div>

            {/* Header / Navbar */}
            <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent py-8 top-10'}`}>
                <div className="container mx-auto px-6 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer">
                        <img 
                            src="/logo_itaqui.png" 
                            alt="Porto do Itaqui" 
                            className={`h-10 md:h-12 w-auto object-contain transition-all ${!scrolled && !contrast ? 'brightness-0 invert' : ''}`} 
                        />
                    </div>

                    <nav className="hidden lg:flex items-center gap-10">
                        {['Compromissos', 'Transparência', 'Notícias'].map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    const id = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                    document.getElementById(id === 'compromissos' ? 'sobre' : id === 'transparencia' ? 'relatorios' : 'noticias')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`text-[11px] font-black uppercase tracking-widest transition-colors hover:text-green-600 ${scrolled ? 'text-black' : 'text-white/80'}`}
                            >
                                {item}
                            </button>
                        ))}
                        <button
                            onClick={onLoginClick}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-green-600/20"
                        >
                            Acesso Restrito
                        </button>
                    </nav>

                    <button 
                        className="lg:hidden p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-[100] bg-white dark:bg-black animate-in fade-in duration-300">
                        <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                            <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto dark:invert" />
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-black dark:text-white">
                                <X size={32} />
                            </button>
                        </div>
                        <div className="p-8 flex flex-col gap-8">
                            {['Compromissos', 'Transparência', 'Notícias'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        const id = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                        document.getElementById(id === 'compromissos' ? 'sobre' : id === 'transparencia' ? 'relatorios' : 'noticias')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-3xl font-black uppercase tracking-tighter text-left hover:text-green-600 transition-colors"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="h-px bg-gray-100 dark:bg-white/10 w-full" />
                            <button
                                onClick={() => { setMobileMenuOpen(false); onLoginClick?.(); }}
                                className="w-full bg-green-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest"
                            >
                                Acesso Restrito
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Sections */}
            <main>
                <HeroSection />
                <BentoCommitments />
                <TransparencySection />
                <NewsSection />
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-zinc-950 py-24 border-t border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-1 space-y-6">
                            <div className="flex items-center gap-2 text-black dark:text-white font-black text-xl italic tracking-tighter">
                                <Anchor className="text-green-600" /> Porto do Itaqui
                            </div>
                            <p className="text-sm font-medium text-black/40 leading-relaxed">
                                Empresa Maranhense de Administração Portuária (EMAP).<br />
                                Referência em Logística e Sustentabilidade.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-8">Páginas ESG</h4>
                            <ul className="space-y-4 text-sm font-bold text-left">
                                <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_ENVIRONMENT)} className="hover:text-green-600 transition-colors">Meio Ambiente</button></li>
                                <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_SOCIAL)} className="hover:text-green-600 transition-colors">Responsabilidade Social</button></li>
                                <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_REPORTS)} className="hover:text-green-600 transition-colors">Relatórios</button></li>
                                <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_INDICATORS)} className="hover:text-green-600 transition-colors">Indicadores</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-8">Links Rápidos</h4>
                            <ul className="space-y-4 text-sm font-bold">
                                <li><a href="#" className="hover:text-green-600 transition-colors">Governança</a></li>
                                <li><a href="#" className="hover:text-green-600 transition-colors">Compliance</a></li>
                                <li><a href="#" className="hover:text-green-600 transition-colors">Trabalhe Conosco</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-8">Conexão</h4>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all"><Globe size={18} /></div>
                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all"><ShieldCheck size={18} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-black/30">
                        <div>&copy; 2026 EMAP - Todos os direitos reservados.</div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-black">Privacidade</a>
                            <a href="#" className="hover:text-black">Termos de Uso</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

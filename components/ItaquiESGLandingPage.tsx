import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ShieldCheck, Anchor } from 'lucide-react';
import { AppMode } from '../types';

// Modular Sections
import { HeroSection } from './esg/HeroSection';
import { BentoCommitments } from './esg/BentoCommitments';
import { TransparencySection } from './esg/TransparencySection';
import { NewsSection } from './esg/NewsSection';
import { Footer } from './esg/Footer';
import { AccessibilityMenu } from './strategic/AccessibilityMenu';

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
            <AccessibilityMenu />
            {/* Accessibility Bar (Old removed, using floating Menu) */}

            {/* Header / Navbar */}
            <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent py-8 top-0'}`}>
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
                    <div className="lg:hidden fixed inset-0 z-[200] bg-white dark:bg-zinc-950 animate-in slide-in-from-top duration-500">
                        <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/5 bg-white dark:bg-zinc-950">
                            <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto dark:invert" />
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-black dark:text-white">
                                <X size={32} />
                            </button>
                        </div>
                        <div className="p-8 flex flex-col gap-10 bg-white dark:bg-zinc-950 h-full">
                            {['Compromissos', 'Transparência', 'Notícias'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        const id = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                        document.getElementById(id === 'compromissos' ? 'sobre' : id === 'transparencia' ? 'relatorios' : 'noticias')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-4xl font-black uppercase tracking-tighter text-left text-black dark:text-white hover:text-green-600 transition-all active:scale-95"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="h-px bg-gray-100 dark:bg-white/10 w-full" />
                            <button
                                onClick={() => { setMobileMenuOpen(false); onLoginClick?.(); }}
                                className="w-full bg-green-600 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-600/20 active:scale-95 transition-transform"
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

            <Footer onNavigate={onNavigate} />
        </div>
    );
};

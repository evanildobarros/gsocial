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
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5 top-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img 
                                src="/logo_itaqui.png" 
                                alt="Porto do Itaqui" 
                                className={`h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-300 ${!scrolled && !contrast ? 'brightness-0 invert' : ''}`} 
                            />
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                            {['Compromissos', 'Transparência', 'Notícias'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        const id = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                        document.getElementById(id === 'compromissos' ? 'sobre' : id === 'transparencia' ? 'relatorios' : 'noticias')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`text-sm font-semibold transition-colors ${scrolled ? 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400' : 'text-white/80 hover:text-white'}`}
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                onClick={onLoginClick}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${scrolled 
                                    ? 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg shadow-green-600/20' 
                                    : 'bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black hover:shadow-lg'
                                }`}
                            >
                                Acesso Restrito
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button 
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white hover:bg-white/10'}`} 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-[9999] bg-white dark:bg-zinc-950 overflow-y-auto flex flex-col">
                        <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/10 bg-white dark:bg-zinc-950 sticky top-0 z-10">
                            <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto dark:brightness-0 dark:invert" />
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-black dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <X size={32} />
                            </button>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-8 bg-white dark:bg-zinc-950 flex-1">
                            {['Compromissos', 'Transparência', 'Notícias'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        const id = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                        document.getElementById(id === 'compromissos' ? 'sobre' : id === 'transparencia' ? 'relatorios' : 'noticias')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-4xl font-black uppercase tracking-tighter text-left text-black dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-all active:scale-95"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="h-px bg-gray-100 dark:bg-white/10 w-full my-4" />
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

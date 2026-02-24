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
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-white dark:bg-black shadow-lg py-3' : 'bg-transparent py-5 top-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            {['Compromissos', 'Transparência', 'Notícias'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        const id = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                        document.getElementById(id === 'compromissos' ? 'sobre' : id === 'transparencia' ? 'relatorios' : 'noticias')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`text-sm font-semibold transition-colors ${scrolled || mobileMenuOpen ? 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400' : 'text-white/80 hover:text-white'}`}
                                >
                                    {item}
                                </button>
                            ))}
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
                    <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
                        <div className="px-6 pt-4 pb-8 flex flex-col gap-4">
                            {['Compromissos', 'Transparência', 'Notícias'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        const id = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                        document.getElementById(id === 'compromissos' ? 'sobre' : id === 'transparencia' ? 'relatorios' : 'noticias')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="block w-full text-left px-4 py-3 text-lg font-bold text-black dark:text-white hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="pt-4 px-2 mt-2 border-t border-gray-100 dark:border-white/10">
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
                <HeroSection />
                <BentoCommitments />
                <TransparencySection />
                <NewsSection />
            </main>

            <Footer onNavigate={onNavigate} />
        </div>
    );
};

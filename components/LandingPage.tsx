import React, { useState, useEffect } from 'react';
import { LayoutContainer } from './layout/LayoutContainer';
import {
    Anchor, BarChart3, Leaf, Users, TrendingUp, Zap, Droplets, Globe2, ChevronRight, CheckCircle2, Target, Building2, Ship, Truck
} from 'lucide-react';

interface LandingPageProps { onLogin: () => void; }

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-black dark:text-white selection:bg-cyan-500 selection:text-white">
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
                <LayoutContainer className="flex justify-between items-center">
                    <img src="/logo_itaqui.png" alt="ESGporto" className="h-10 w-auto brightness-0 invert dark:invert-0 lg:brightness-100" />
                    <button onClick={onLogin} className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg">
                        Acessar Diagnóstico
                    </button>
                </LayoutContainer>
            </nav>

            <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-zinc-900"></div>
                <LayoutContainer className="relative z-10 pt-20">
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight text-left">
                        A bússola definitiva para a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Gestão ESG Portuária</span>.
                    </h1>
                </LayoutContainer>
            </section>

            <section className="py-24">
                <LayoutContainer className="text-left">
                    <h2 className="text-5xl font-black text-black dark:text-white mb-12">Painel de Indicadores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stat Cards */}
                    </div>
                </LayoutContainer>
            </section>
        </div>
    );
};

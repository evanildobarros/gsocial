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

            {/* Painel de Indicadores */}
            <section id="indicators" className="py-32 bg-gray-50 dark:bg-zinc-900 transition-colors duration-500">
                <LayoutContainer className="text-left">
                    <div className="mb-16 text-left">
                        <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter mb-6">Painel de Indicadores</h2>
                        <p className="text-black/60 dark:text-white/60 text-lg font-medium max-w-2xl italic">Monitoramento em tempo real do desempenho de nossas metas ESG.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold mb-2">Descarbonização</h3>
                            <p className="text-sm text-black/60 dark:text-white/60 mb-6">Redução de emissões</p>
                            <div className="text-4xl font-black text-green-600">85%</div>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold mb-2">Energia Renovável</h3>
                            <p className="text-sm text-black/60 dark:text-white/60 mb-6">Uso matriz limpa</p>
                            <div className="text-4xl font-black text-green-600">98%</div>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold mb-2">Educação Local</h3>
                            <p className="text-sm text-black/60 dark:text-white/60 mb-6">Pessoas formadas</p>
                            <div className="text-4xl font-black text-green-600">12k</div>
                        </div>
                    </div>
                </LayoutContainer>
            </section>
        </div>
    );
};

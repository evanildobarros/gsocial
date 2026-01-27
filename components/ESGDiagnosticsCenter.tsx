import React from 'react';
import {
    Users,
    Leaf,
    Shield,
    ChevronRight,
    ArrowRight,
    ClipboardCheck
} from 'lucide-react';
import { AppMode } from '../types';

interface ESGDiagnosticsCenterProps {
    onSelectMode: (mode: AppMode, extra?: any) => void;
}

export const ESGDiagnosticsCenter: React.FC<ESGDiagnosticsCenterProps> = ({ onSelectMode }) => {

    const modules = [
        {
            title: "Diagnóstico Social",
            subtitle: "Inventário & Território",
            desc: "Levantamento socioeconômico das comunidades do entorno e materialidade social.",
            icon: <Users className="w-8 h-8" />,
            mode: AppMode.SOCIAL_ASSESSMENT,
            colorClass: "text-blue-600",
            bgClass: "bg-blue-50 dark:bg-blue-900/10",
            borderClass: "border-blue-600"
        },
        {
            title: "Diagnóstico Ambiental",
            subtitle: "ABNT PR 2030 (E)",
            desc: "Avaliação de maturidade em GEE, Resíduos e Eficiência Baseada na Norma 2030.",
            icon: <Leaf className="w-8 h-8" />,
            mode: AppMode.ENV_DIAGNOSTIC,
            colorClass: "text-green-600",
            bgClass: "bg-green-50 dark:bg-green-900/10",
            borderClass: "border-green-600"
        },
        {
            title: "Diagnóstico Governança",
            subtitle: "ABNT PR 2030 (G)",
            desc: "Estrutura de compliance, transparência e gestão de riscos corporativos.",
            icon: <Shield className="w-8 h-8" />,
            mode: AppMode.GOV_ESG_DIAGNOSTIC,
            colorClass: "text-purple-600",
            bgClass: "bg-purple-50 dark:bg-purple-900/10",
            borderClass: "border-purple-600"
        }
    ];

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <ClipboardCheck size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Central de Diagnósticos ESG
                    </h1>
                    <p className="text-sm font-medium text-gray-500 italic">
                        Selecione o módulo de levantamento de dados ou autoavaliação para iniciar.
                    </p>
                </div>
            </header>

            {/* Grid of Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {modules.map((m, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelectMode(m.mode)}
                        className={`
                            group relative rounded-[32px] p-8 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#1C1C1C] 
                            text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                            overflow-hidden h-full flex flex-col
                        `}
                    >
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${m.bgClass.replace('/10', '')}`} />

                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${m.bgClass} ${m.colorClass}`}>
                            {m.icon}
                        </div>

                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                            {m.subtitle}
                        </span>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                            {m.title}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-grow">
                            {m.desc}
                        </p>

                        <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between w-full group-hover:border-transparent transition-colors">
                            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                                Entrar no Módulo <ArrowRight size={14} />
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.bgClass} ${m.colorClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Info Banner */}
            <div className="bg-[#121212] rounded-[40px] p-12 relative overflow-hidden text-white shadow-2xl">
                <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-white/5 rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h3 className="text-3xl font-black mb-2 tracking-tight">Consolidação 2026</h3>
                        <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
                            Os resultados alimentam automaticamente o Dashboard Estratégico.
                        </p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
                        Relatório Consolidado
                    </button>
                </div>
            </div>
        </div>
    );
};

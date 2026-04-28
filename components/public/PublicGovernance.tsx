import React from 'react';
import { ArrowLeft, Landmark, Scale, FileText, ChevronDown, CheckCircle2, Shield, Users, Target } from 'lucide-react';
import { Footer } from '../esg/Footer';
import { AppMode } from '../../types';

interface PublicPageProps {
    onBack: () => void;
    onNavigate?: (mode: AppMode) => void;
}

export const PublicGovernance: React.FC<PublicPageProps> = ({ onBack, onNavigate }) => {
    return (
        <div className="h-screen overflow-y-auto bg-white text-black font-sans selection:bg-blue-100 scroll-smooth">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Pilar Governança</span>
                </div>
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all shadow-lg"
                >
                    <ArrowLeft size={14} /> Voltar ao Portal
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 bg-zinc-950 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-grid-slate-200/[0.04] bg-[size:20px_20px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-700 text-xs font-bold tracking-widest uppercase shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Governança Corporativa
                        </div>
                        
                        <h1 className="text-5xl sm:text-7xl font-black text-black leading-[1.1] tracking-tight">
                            Transparência <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">&</span> Integridade
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
                            A base da nossa atuação está na ética, na responsabilidade e no compromisso inegociável com a transparência em todos os nossos processos e decisões.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <Scale className="text-blue-500 mb-4" size={40} />
                                <h3 className="text-4xl font-black text-black mb-2">100%</h3>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Adesão ao Código de Ética</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <Landmark className="text-blue-200 mb-4" size={32} />
                                <h3 className="text-3xl font-black mb-2">Zero</h3>
                                <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Tolerância à Corrupção</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <FileText className="text-blue-500 mb-4" size={32} />
                                <h3 className="text-3xl font-black text-black mb-2">Top 10</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Índice IG-Sest</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conteúdo Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">Estrutura de Gestão</h2>
                        <div className="w-24 h-1.5 bg-blue-600 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                            <Shield className="text-blue-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Conselho de Administração</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Atuação estratégica com conselheiros independentes, garantindo pluralidade de visões e defesa dos interesses dos stakeholders.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                            <Target className="text-blue-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Comitês de Assessoramento</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Órgãos técnicos especializados (Auditoria, Riscos, Pessoas) que avaliam e mitigam riscos corporativos de forma preventiva.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                            <Users className="text-blue-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Gestão de Stakeholders</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Canal aberto e diálogo contínuo com a comunidade portuária, poder público, colaboradores e sociedade civil.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer onNavigate={onNavigate} />
        </div>
    );
};

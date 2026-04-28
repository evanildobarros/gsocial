import React from 'react';
import { ArrowLeft, ShieldAlert, Lock, Fingerprint, ChevronDown, CheckCircle2, FileWarning, Search, Key } from 'lucide-react';
import { Footer } from '../esg/Footer';
import { AppMode } from '../../types';

interface PublicPageProps {
    onBack: () => void;
    onNavigate?: (mode: AppMode) => void;
}

export const PublicCompliance: React.FC<PublicPageProps> = ({ onBack, onNavigate }) => {
    return (
        <div className="h-screen overflow-y-auto bg-white text-black font-sans selection:bg-rose-100 scroll-smooth">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Pilar Governança</span>
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
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-rose-500 opacity-20 blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/50 border border-rose-200/50 text-rose-700 text-xs font-bold tracking-widest uppercase shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            Conformidade & Ética
                        </div>
                        
                        <h1 className="text-5xl sm:text-7xl font-black text-black leading-[1.1] tracking-tight">
                            Compliance <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">Corporativo</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
                            Nosso programa garante que atuemos dentro das leis, normas e da ética corporativa, protegendo os dados e a integridade do Porto.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 bg-gradient-to-br from-rose-600 to-orange-600 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <Lock className="text-rose-200 mb-4" size={40} />
                                <h3 className="text-4xl font-black mb-2">Seguro</h3>
                                <p className="text-sm font-bold text-rose-100 uppercase tracking-wider">Canal de Denúncias Anônimo</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-rose-900/5 border border-gray-100 flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <ShieldAlert className="text-rose-500 mb-4" size={32} />
                                <h3 className="text-3xl font-black text-black mb-2">100%</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Normas Auditadas</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-rose-900/5 border border-gray-100 flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <Fingerprint className="text-rose-500 mb-4" size={32} />
                                <h3 className="text-3xl font-black text-black mb-2">LGPD</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dados Protegidos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conteúdo Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">Pilares de Compliance</h2>
                        <div className="w-24 h-1.5 bg-rose-600 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors">
                            <FileWarning className="text-rose-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Código de Conduta</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Orienta as ações e o comportamento esperado de todos os colaboradores, fornecedores e parceiros da organização.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors">
                            <Search className="text-rose-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Auditoria Independente</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Processos contínuos de verificação e controle interno para garantir a mitigação de riscos operacionais e financeiros.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors">
                            <Key className="text-rose-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Proteção de Dados (LGPD)</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Tratamento rigoroso, sigiloso e rastreável de informações, assegurando a privacidade dos dados institucionais e de terceiros.
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

import React from 'react';
import { ArrowLeft, Users, Briefcase, Heart, ChevronDown, CheckCircle2, Star, Sparkles, Smile } from 'lucide-react';
import { Footer } from '../esg/Footer';
import { AppMode } from '../../types';

interface PublicPageProps {
    onBack: () => void;
    onNavigate?: (mode: AppMode) => void;
}

export const PublicCareers: React.FC<PublicPageProps> = ({ onBack, onNavigate }) => {
    return (
        <div className="h-screen overflow-y-auto bg-white text-black font-sans selection:bg-purple-100 scroll-smooth">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">Pilar Social</span>
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
                <img 
                    src="/images/careers-bg.png" 
                    alt="Careers Background" 
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
                />
                <div className="absolute inset-0 z-0 bg-grid-slate-200/[0.04] bg-[size:20px_20px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/50 border border-purple-200/50 text-purple-700 text-xs font-bold tracking-widest uppercase shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                            Carreiras
                        </div>
                        
                        <h1 className="text-5xl sm:text-7xl font-black text-black leading-[1.1] tracking-tight">
                            Construa o Futuro com <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Propósito</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
                            Trabalhe no maior porto público da região, contribuindo para o desenvolvimento socioambiental do estado.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="bg-black text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                                Ver Vagas Abertas
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <Heart className="text-purple-200 mb-4" size={40} />
                                <h3 className="text-4xl font-black mb-2">Pluralidade</h3>
                                <p className="text-sm font-bold text-purple-100 uppercase tracking-wider">Compromisso com Diversidade</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-900/5 border border-gray-100 flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <Briefcase className="text-purple-500 mb-4" size={32} />
                                <h3 className="text-3xl font-black text-black mb-2">35h</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Carga Semanal</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-900/5 border border-gray-100 flex flex-col justify-center transform transition-all hover:-translate-y-2">
                                <Star className="text-purple-500 mb-4" size={32} />
                                <h3 className="text-3xl font-black text-black mb-2">GPTW</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Certificação Ativa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conteúdo Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">Por que a EMAP?</h2>
                        <div className="w-24 h-1.5 bg-purple-600 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                            <Sparkles className="text-purple-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Benefícios Reais</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Plano de saúde integral, vale-alimentação, auxílio-creche, seguro de vida e previdência privada para garantir a qualidade de vida.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                            <Users className="text-purple-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Cultura Inclusiva</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Respeito à diversidade e promoção da equidade em nossos processos de recrutamento e desenvolvimento de lideranças.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                            <Smile className="text-purple-600 mb-6" size={32} />
                            <h3 className="text-xl font-bold text-black mb-4">Desenvolvimento</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Programas contínuos de capacitação, trilhas de aprendizagem e auxílio-educação para impulsionar a sua carreira e formação contínua.
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

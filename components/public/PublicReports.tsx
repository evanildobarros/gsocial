import React from 'react';
import { ArrowLeft, FileText, Download, ShieldCheck, Search, ChevronRight } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicReports: React.FC<PublicPageProps> = ({ onBack }) => {
    const reports = [
        { title: "Relatório Integrado de Sustentabilidade", year: "2024", size: "4.4 MB", type: "GRI/ABNT", category: "Full Report" },
        { title: "Demonstrações Financeiras Auditadas", year: "2024", size: "4.5 MB", type: "Financeiro", category: "Audit" },
        { title: "Inventário de Emissões GEE (Base 2022)", year: "2023", size: "8.0 MB", type: "VVB", category: "Climate" },
        { title: "Plano de Adaptação Climática (TCFD)", year: "2025", size: "6.5 MB", type: "Estratégico", category: "Climate" },
        { title: "Código de Conduta e Integridade", year: "2024", size: "2.0 MB", type: "Compliance", category: "Ethics" },
        { title: "Censo Socioeconômico Territorial", year: "2024", size: "12.2 MB", type: "Social", category: "Itaqui-Bacanga" },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-white text-black font-sans selection:bg-blue-100 scroll-smooth">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Portal de Transparência</span>
                </div>
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all shadow-lg"
                >
                    <ArrowLeft size={14} /> Voltar ao Portal
                </button>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 md:pt-40 pb-20 px-6 bg-black text-white overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-port.jpg"
                        alt="Background Corporativo"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black"></div>
                </div>
                <div className="container mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center text-center lg:text-left">
                        <div className="flex-1 space-y-6 md:space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0">
                                <ShieldCheck size={14} /> Governança & Reporte
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.0] text-white">
                                ÉTICA E <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">TRANSPARÊNCIA.</span>
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-white/60 max-w-xl leading-relaxed mx-auto lg:mx-0">
                                Biblioteca centralizada de documentos oficiais, auditorias independentes e políticas corporativas.
                            </p>
                        </div>
                        <div className="flex-1 w-full max-w-md">
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[50px] shadow-2xl border border-white/10 flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-blue-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-blue-600/30">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">Selo Big Four Audit</h3>
                                    <p className="text-sm font-medium text-white/60 mt-2">Nossos relatórios passam por verificação independente global.</p>
                                </div>
                                <span className="px-6 py-2 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/60">Ciclo 2025/2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Search & Filter */}
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <h2 className="text-3xl font-black tracking-tight text-black text-left">Biblioteca de Documentos</h2>
                        <div className="w-full md:w-96 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar relatório ou política..." 
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report, idx) => (
                            <ReportItem key={idx} {...report} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const ReportItem = ({ title, year, size, type, category }: any) => (
    <div className="p-8 rounded-[40px] border border-gray-100 bg-white hover:border-blue-600 hover:shadow-2xl transition-all group cursor-pointer flex flex-col justify-between h-full text-left">
        <div>
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText size={24} />
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-black/30 block tracking-widest">{year}</span>
                    <span className="text-[10px] font-black uppercase text-blue-600 block">{category}</span>
                </div>
            </div>
            <h4 className="text-xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{title}</h4>
        </div>
        <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-left">
            <span className="text-[10px] font-black uppercase text-black/40">{type} • {size}</span>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                Download <Download size={14} />
            </div>
        </div>
    </div>
);

import React from 'react';
import { ArrowLeft, FileText, Download, ShieldCheck } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicReports: React.FC<PublicPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" />
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                            <FileText size={16} /> Relatórios
                        </span>
                    </div>
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-wide"
                    >
                        <ArrowLeft size={14} /> Voltar
                    </button>
                </div>
            </header>

            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-12">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">Framework: SASB, GRI & IIRC</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Central de Transparência e Governança.</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                         {/* Document Hub */}
                        <div className="p-8 rounded-[40px] bg-gray-50 border border-gray-100 space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-widest text-black/40">Hub de Documentos</h3>
                            <div className="space-y-3">
                                {['Relatório Integrado 2025', 'Inventário GEE (Verificado)', 'Auditoria de Direitos Humanos'].map(doc => (
                                    <div key={doc} className="p-4 bg-white rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-blue-600 transition-colors cursor-pointer shadow-sm">
                                        <span className="text-sm font-bold text-black">{doc}</span>
                                        <Download className="w-4 h-4 text-black/30 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Compliance Seal */}
                        <div className="bg-blue-600 rounded-[40px] p-8 text-white flex flex-col items-center justify-center text-center space-y-6 shadow-xl shadow-blue-900/20">
                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                                <ShieldCheck size={48} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black uppercase tracking-tight leading-tight">Auditoria Independente</h4>
                                <p className="text-sm font-medium opacity-70 mt-2">Selo Big Four Audit</p>
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase mt-4">Ciclo 2025/2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

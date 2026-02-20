import React from 'react';
import { ArrowLeft, FileText, Download } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicReports: React.FC<PublicPageProps> = ({ onBack }) => {
    const reports = [
        { title: "Relatório de Sustentabilidade 2024", year: "2024", size: "4.4 MB", type: "GRI" },
        { title: "Demonstrações Financeiras", year: "2024", size: "4.5 MB", type: "Financeiro" },
        { title: "Inventário de Emissões GEE (Base 2022)", year: "2023", size: "8.0 MB", type: "Ambiental" },
        { title: "Código de Conduta e Ética", year: "2024", size: "2.0 MB", type: "Governança" },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" />
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                            <FileText size={16} /> Central de Relatórios
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
                <div className="container mx-auto max-w-4xl text-center md:text-left">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Transparência Total.</h1>
                        <p className="text-lg font-medium text-black/60 italic">
                            Acesse nossos documentos oficiais, prestações de contas e certificações.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {reports.map((report, idx) => (
                            <div key={idx} className="group p-6 rounded-[32px] border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer flex items-center justify-between text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-black uppercase tracking-wider text-black/60">{report.year}</span>
                                            <span className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-black uppercase tracking-wider text-blue-600">{report.type}</span>
                                        </div>
                                        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{report.title}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-black/40 hidden md:block">{report.size}</span>
                                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all text-black">
                                        <Download size={18} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

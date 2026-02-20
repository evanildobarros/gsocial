import React from 'react';
import { ArrowLeft, FileText, Download, ShieldCheck } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicReports: React.FC<PublicPageProps> = ({ onBack }) => {
    const reports = [
        { title: "Relatório de Sustentabilidade 2024", year: "2024", size: "4.4 MB", type: "GRI / ABNT", category: "Sustentabilidade" },
        { title: "Demonstrações Financeiras 2024", year: "2024", size: "4.5 MB", type: "Financeiro", category: "Governança" },
        { title: "Inventário de Emissões GEE (Base 2022)", year: "2023", size: "8.0 MB", type: "Ambiental", category: "Ambiental" },
        { title: "Código de Conduta e Ética 2024", year: "2024", size: "2.0 MB", type: "Compliance", category: "Governança" },
        { title: "Plano de Adaptação Climática (TCFD)", year: "2025", size: "3.2 MB", type: "Estratégico", category: "Ambiental" },
        { title: "Censo Socioeconômico Itaqui-Bacanga", year: "2024", size: "5.7 MB", type: "Social", category: "Social" },
    ];

    return (
        <div className=\"min-h-screen bg-white text-black font-sans\">
            {/* Header */}
            <header className=\"fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4\">
                <div className=\"container mx-auto px-6 flex items-center justify-between\">
                    <div className=\"flex items-center gap-3\">
                        <img src=\"/logo_itaqui.png\" alt=\"Porto do Itaqui\" className=\"h-10 w-auto object-contain\" />
                        <div className=\"h-6 w-px bg-gray-200\"></div>
                        <span className=\"text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2\">
                            <FileText size={16} /> Relatórios
                        </span>
                    </div>
                    <button 
                        onClick={onBack}
                        className=\"flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-wide\"
                    >\n                        <ArrowLeft size={14} /> Voltar
                    </button>
                </div>
            </header>

            <section className=\"pt-32 pb-20 px-6\">
                <div className=\"container mx-auto max-w-5xl\">
                    <div className=\"grid lg:grid-cols-2 gap-16 mb-20 items-center\">
                        <div>
                            <span className=\"text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block\">Transparência</span>
                            <h1 className=\"text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight\">Central de Governança e Reportes.</h1>
                            <p className=\"text-lg font-medium text-black/60 italic leading-relaxed\">\n                                Acesse nossa biblioteca completa de documentos oficiais, inventários e auditorias independentes.\n                            </p>
                        </div>
                        <div className=\"bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-900/30 flex flex-col items-center justify-center text-center\">\n                             <ShieldCheck size={64} className=\"mb-6\" />\n                             <h3 className=\"text-2xl font-black uppercase tracking-tight\">Selo Big Four Audit</h3>\n                             <p className=\"text-sm font-medium opacity-80 mt-2\">Nossos relatórios são auditados por consultorias globais independentes.</p>\n                             <span className=\"mt-8 px-6 py-2 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest\">Certificado 2025/2026</span>\n                        </div>
                    </div>

                    <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                        {reports.map((report, idx) => (
                            <div key={idx} className=\"group p-6 rounded-[32px] border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer flex items-center justify-between text-left\">
                                <div className=\"flex items-center gap-4\">
                                    <div className=\"w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center\">\n                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className=\"flex items-center gap-2 mb-1\">\n                                            <span className=\"px-2 py-0.5 rounded bg-gray-100 text-[9px] font-black uppercase text-black/60\">{report.year}</span>\n                                            <span className=\"px-2 py-0.5 rounded bg-blue-50 text-[9px] font-black uppercase text-blue-600\">{report.category}</span>\n                                        </div>
                                        <h3 className=\"text-base font-bold group-hover:text-blue-600 transition-colors\">{report.title}</h3>
                                        <span className=\"text-[10px] font-bold text-black/40\">{report.type} • {report.size}</span>
                                    </div>
                                </div>
                                <div className=\"w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all text-black\">\n                                    <Download size={18} />\n                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

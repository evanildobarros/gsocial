import React from 'react';
import {
    FileText,
    Download,
    CheckCircle,
    ExternalLink,
    Globe,
    History,
    FileBarChart,
    Verified,
    Shield,
    Settings,
    RefreshCw
} from 'lucide-react';

export const ReportingHub: React.FC = () => {

    const reportTemplates = [
        { id: 'gri', name: 'GRI Standards 2021', type: 'Framework Geral', status: 'Ready', mapping: 92 },
        { id: 'sasb', name: 'SASB Marine Transportation', type: 'Setorial', status: 'Partial', mapping: 65 },
        { id: 'tcfd', name: 'TCFD Climate Disclosure', type: 'Climático', status: 'Draft', mapping: 40 },
    ];

    const transparencyItems = [
        { id: 'env', name: 'Emissões & Energia', update: 'Atualizado há 2h', status: 'Live' },
        { id: 'social', name: 'Projetos Sociais', update: 'Atualizado há 1d', status: 'Live' },
        { id: 'gov', name: 'Estrutura de Governança', update: 'Atualizado há 5d', status: 'Review' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-1">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-2xl flex items-center justify-center">
                            <FileText size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Hub de Transparência</h1>
                            <p className="text-sm font-bold text-gray-500">Central de Relatórios ESG & Divulgação Pública</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-full font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors">
                        <Settings size={16} />
                        Configurar Mapeamento
                    </button>
                    <div className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/10 text-cyan-700 dark:text-cyan-400 font-black text-xs uppercase rounded-full flex items-center gap-1.5 border border-cyan-100 dark:border-cyan-900/20">
                        <RefreshCw size={14} className="animate-spin-slow" />
                        Sincronização Ativa
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Generation Column */}
                <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 h-full relative overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                                <FileBarChart className="text-blue-600 w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">Gerador de Relatórios</h2>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Frameworks Internacionais de Reporte</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {reportTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-4 rounded-[20px] bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-blue-600">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-800 dark:text-gray-200">{template.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{template.type}</span>
                                                <div className="w-px h-3 bg-gray-300 dark:bg-white/20" />
                                                <span className="text-[10px] font-black text-green-600">{template.mapping}% Mapeado</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${template.status === 'Ready' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                template.status === 'Partial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                                            }`}>
                                            {template.status === 'Ready' ? 'Pronto' : template.status === 'Partial' ? 'Parcial' : 'Rascunho'}
                                        </span>
                                        <button
                                            disabled={template.status !== 'Ready'}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 flex items-start gap-3 text-sm text-blue-900 dark:text-blue-100">
                            <Shield className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="font-medium leading-relaxed text-xs">
                                <strong className="font-black">Automação Ativa:</strong> O sistema realiza o de-para (cross-mapping) automático dos KPIs operacionais Itaqui para os padrões GRI 305, 405 e 306.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Public Portal Column */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-sm">
                        <Globe className="absolute -top-6 -right-6 text-gray-100 dark:text-white/5 w-64 h-64 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/10">
                                <Globe className="text-cyan-600 w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">Portal do Cidadão</h2>
                        </div>

                        <div className="text-center mb-8 relative z-10">
                            <div className="relative inline-flex mb-4">
                                <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 border-4 border-green-50/50 dark:border-green-900/10 flex items-center justify-center">
                                    <Verified className="text-green-600 w-10 h-10" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white dark:border-[#1C1C1C]" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Canal Operante</h3>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">SISTEMA DE DIVULGAÇÃO EM TEMPO REAL</p>
                        </div>

                        <div className="space-y-6 relative z-10 mb-8">
                            {transparencyItems.map((item) => (
                                <div key={item.id}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-black text-gray-700 dark:text-gray-300">{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-400">{item.update}</span>
                                            <div className={`w-2 h-2 rounded-full ${item.status === 'Live' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                        </div>
                                    </div>
                                    <div className="h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden w-full">
                                        <div
                                            className={`h-full w-full rounded-full ${item.status === 'Live' ? 'bg-green-500' : 'bg-amber-500'}`}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm py-3 rounded-full shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 relative z-10">
                            Acessar Visão Pública
                            <ExternalLink size={16} />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-1">Auditoria GRI Iniciada</h3>
                            <p className="text-xs opacity-80 mb-6 leading-relaxed">
                                O ciclo de reporte 2025-2026 está em fase de revisão de evidências pela governança.
                            </p>

                            <div className="h-2 bg-white/20 rounded-full mb-3 overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '75%' }} />
                            </div>
                            <span className="text-xs font-black">75% Concluído</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

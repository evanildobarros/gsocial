import React from 'react';
import { FileText, Download, CheckCircle, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@mui/material';

export const ReportingHub: React.FC = () => {
    const reportTemplates = [
        { id: 'gri', name: 'GRI Standards 2021', type: 'Framework', status: 'Ready', mapping: '92% mapped' },
        { id: 'sasb', name: 'SASB Marine Transportation', type: 'Sector Standard', status: 'Partial', mapping: '65% mapped' },
        { id: 'tcfd', name: 'TCFD Climate Disclosure', type: 'Climate', status: 'Draft', mapping: '40% mapped' },
    ];

    const transparencyItems = [
        { id: 'env', name: 'Emissões & Energia', update: 'Updated 2h ago', status: 'Live' },
        { id: 'social', name: 'Projetos Sociais', update: 'Updated 1d ago', status: 'Live' },
        { id: 'gov', name: 'Estrutura de Governança', update: 'Updated 5d ago', status: 'Reviewing' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Hub de Relatórios e Transparência</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestão centralizada de frameworks internacionais (GRI/SASB) e Painel Público.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Generator Section */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-happiness-1" />
                        Gerador de Relatórios (Automated)
                    </h3>

                    <div className="bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                        {reportTemplates.map((template, idx) => (
                            <div key={template.id} className={`p-4 flex items-center justify-between ${idx !== reportTemplates.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{template.name}</h4>
                                        <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 font-medium">{template.type}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Data Source: <span className="text-green-600 dark:text-green-400 font-bold">{template.mapping}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${template.status === 'Ready' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            template.status === 'Partial' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
                                        }`}>
                                        {template.status}
                                    </span>
                                    <button
                                        disabled={template.status !== 'Ready'}
                                        className={`p-2 rounded-sm transition-colors ${template.status === 'Ready' ? 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300' : 'opacity-30 cursor-not-allowed text-gray-400'}`}
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-sm border border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300">
                        <strong>Automação Ativa:</strong> O sistema mapeia automaticamente KPIs operacionais para os padrões GRI 305-1, 405-1 e 306-3.
                    </div>
                </div>

                {/* Transparency Panel Status */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Painel Público de Transparência
                    </h3>

                    <div className="bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Globe className="w-24 h-24" />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center border-4 border-green-50 dark:border-green-900/10">
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900 dark:text-white">Portal Online</h4>
                                <p className="text-sm text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Sistema Operante
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            {transparencyItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                                    <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-gray-400">{item.update}</span>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Live' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <Button size="small" endIcon={<ExternalLink className="w-3 h-3" />} sx={{ textTransform: 'none' }}>
                                Visualizar como Público
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

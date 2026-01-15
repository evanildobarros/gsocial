import React from 'react';
import { ShieldCheck, FileText, Calendar, AlertCircle, CheckCircle2, Search, Download, Paperclip } from 'lucide-react';

export const Compliance: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Conformidade & Licenciamento</h2>
                    <p className="text-gray-500 font-medium">Controle de condicionantes ambientais e repositório de evidências.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-[#2148C0]" />
                    <span className="text-xs font-black text-[#2148C0] uppercase tracking-widest">ISO 14001 Compliant</span>
                </div>
            </div>

            {/* Traffic Light Conditions */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Semáforo de Condicionantes</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white">
                                <th className="px-8 py-6">Licença / Condicionante</th>
                                <th className="px-8 py-6">Prazo Final</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Evidência</th>
                                <th className="px-8 py-6 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { license: "LO 1450/2023 - IBAMA", condition: "Monitoramento de Biota Marinha (Trimestral)", date: "22/03/2026", status: "Conforme", color: "green" },
                                { license: "LI 088/2024 - SEMA", condition: "Plano de Controle de Erosão - Câmaras Individuais", date: "15/02/2026", status: "Atenção", color: "yellow" },
                                { license: "LO 1200/2022 - IBAMA", condition: "Relatório de Gerenciamento de Resíduos Sólidos", date: "30/01/2026", status: "Crítico", color: "red" }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6 max-w-sm">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-[#2148C0] uppercase tracking-widest mb-1">{row.license}</span>
                                            <span className="font-bold text-gray-900 leading-tight">{row.condition}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-300" />
                                            {row.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${row.color === 'green' ? 'bg-green-100 text-green-600' :
                                                row.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {row.color === 'green' ? (
                                            <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase">
                                                <CheckCircle2 className="w-4 h-4" /> Validado
                                            </div>
                                        ) : (
                                            <button className="flex items-center gap-2 text-[#2148C0] text-[10px] font-black uppercase hover:underline">
                                                <Paperclip className="w-4 h-4" /> Anexar
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Evidence Repository */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-black">Repositório de Evidências</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: "Relatorio_Biota_Q4_2025.pdf", size: "12.4 MB", type: "Monitoramento" },
                            { name: "MTR_7458_Terminal_TEGRAM.pdf", size: "1.2 MB", type: "Resíduos" }
                        ].map((file, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{file.name}</p>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{file.type} • {file.size}</p>
                                    </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5 flex flex-col items-center justify-center text-center space-y-4">
                    <ShieldCheck className="w-16 h-16 text-[#2148C0]" />
                    <h4 className="text-xl font-black text-gray-900">Trilha de Auditoria</h4>
                    <p className="text-sm text-gray-500 font-medium max-w-xs">
                        Todas as alterações e uploads são registrados com carimbo de tempo (blockchain-ready) para suporte em auditorias ambientais.
                    </p>
                    <button className="pt-4 text-[10px] font-black text-[#2148C0] uppercase tracking-[0.2em] border-b-2 border-[#2148C0]/20 hover:border-[#2148C0] transition-all">
                        Visualizar Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

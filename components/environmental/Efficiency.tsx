import React from 'react';
import { Droplets, Lightbulb, Target, LayoutGrid, ArrowUpRight, Gauge } from 'lucide-react';

export const Efficiency: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Eficiência Energética & Hídrica</h2>
                <p className="text-gray-500 font-medium">Gestão inteligente de recursos naturais e metas de redução.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Grid */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2148C0]">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eficiência Predial</p>
                            <h4 className="text-2xl font-black text-gray-900">12.4 <span className="text-xs text-gray-400">kWh/m²</span></h4>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600">
                            <Droplets className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reúso de Água</p>
                            <h4 className="text-2xl font-black text-gray-900">35 <span className="text-xs text-gray-400">%</span></h4>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                        <h4 className="font-black text-xl mb-2">Meta Anual</h4>
                        <p className="text-gray-400 text-xs font-medium mb-6">Redução de 15% no consumo geral até Dezembro.</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-black text-happiness-1">75%</span>
                            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-happiness-1 w-[75%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Metering Table */}
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-2xl">
                                <LayoutGrid className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Medição Granular (Real-Time)</h3>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-[#2148C0] text-[10px] font-black rounded-full uppercase tracking-widest">Complexo</span>
                            <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest">Terminais</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-6">Unidade/Área</th>
                                    <th className="px-8 py-6">Consumo (Mês)</th>
                                    <th className="px-8 py-6">Eficiência</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[
                                    { area: "Terminal de Grãos", icon: Droplets, val: "2.400 m³", eff: "A", status: "Ideal" },
                                    { area: "Armazém 04", icon: Lightbulb, val: "15.200 kWh", eff: "B", status: "Atenção" },
                                    { area: "Prédio Administrativo", icon: Lightbulb, val: "5.100 kWh", eff: "A", status: "Ideal" },
                                    { area: "Pátio de Estocagem", icon: Droplets, val: "850 m³", eff: "C", status: "Monitoramento" }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#2148C0] group-hover:text-white transition-all">
                                                    <row.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-gray-900">{row.area}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-medium text-gray-600">{row.val}</td>
                                        <td className="px-8 py-6">
                                            <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black ${row.eff === 'A' ? 'bg-green-100 text-green-600' :
                                                row.eff === 'B' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {row.eff}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Ideal' ? 'bg-green-500' :
                                                    row.status === 'Atenção' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}></div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{row.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-[#2148C0] transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

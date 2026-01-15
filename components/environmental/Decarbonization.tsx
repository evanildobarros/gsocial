import React, { useState } from 'react';
import { Leaf, Zap, BarChart3, Calculator, TrendingDown, Info, AlertTriangle } from 'lucide-react';

export const Decarbonization: React.FC = () => {
    const [fuel, setFuel] = useState<number>(0);
    const [energy, setEnergy] = useState<number>(0);
    const [cargo, setCargo] = useState<number>(0);

    // Fatores de emissão simplificados (exemplo GHG Protocol)
    // Diesel: ~2.68 kg CO2e / litro
    // Energia (Brasil): ~0.08 kg CO2e / kWh (matriz limpa)
    const totalCO2 = (fuel * 2.68) + (energy * 0.08);
    const intensity = cargo > 0 ? (totalCO2 / cargo).toFixed(4) : "0.0000";

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Descarbonização & Clima</h2>
                    <p className="text-gray-500 font-medium">Monitoramento de emissões e análise de intensidade de carbono.</p>
                </div>
                <div className="px-4 py-2 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-black text-green-700 uppercase tracking-widest">Nível 5 ABNT PR 2030</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calculadora Multi-Tenant */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Calculator className="w-6 h-6 text-[#2148C0]" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Calculadora CO2e</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Consumo Diesel (Litros)</label>
                            <input
                                type="number"
                                value={fuel}
                                onChange={(e) => setFuel(Number(e.target.value))}
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#2148C0] focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Energia Elétrica (kWh)</label>
                            <input
                                type="number"
                                value={energy}
                                onChange={(e) => setEnergy(Number(e.target.value))}
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#2148C0] focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Carga Movimentada (Ton)</label>
                            <input
                                type="number"
                                value={cargo}
                                onChange={(e) => setCargo(Number(e.target.value))}
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#2148C0] focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-400">Total Est. (kgCO2e)</span>
                            <span className="text-lg font-black text-gray-900">{totalCO2.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="p-4 bg-blue-600 rounded-2xl text-white">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Intensidade de Carbono</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black">{intensity}</span>
                                <span className="text-xs font-bold opacity-70">kgCO2e / Ton</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulador de Eletrificação */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8">
                            <Zap className="w-32 h-32 text-yellow-400/10 -rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-yellow-50 rounded-2xl">
                                    <Zap className="w-6 h-6 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">Simulador de Eletrificação de Frota</h3>
                            </div>

                            <p className="text-gray-500 font-medium max-w-md mb-8">
                                Projete a redução de impacto ambiental ao converter equipamentos (guindastes, RTGs, Empilhadeiras) para matriz elétrica.
                            </p>

                            <div className="grid grid-cols-2 gap-4 h-48 items-end mb-8">
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-100 rounded-xl h-full relative group">
                                        <div className="absolute bottom-0 w-full bg-gray-300 rounded-xl h-[80%] transition-all duration-1000"></div>
                                    </div>
                                    <p className="text-center text-[10px] font-black text-gray-400 uppercase">Atual (Diesel)</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-100 rounded-xl h-full relative group">
                                        <div className="absolute bottom-0 w-full bg-green-500 rounded-xl h-[30%] transition-all duration-1000"></div>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] px-2 py-1 rounded font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            -62% Emissões
                                        </div>
                                    </div>
                                    <p className="text-center text-[10px] font-black text-green-600 uppercase">Projetado (Elétrico)</p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all">
                                Gerar Relatório de Viabilidade
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Climate Monitor Widget */}
                        <div className="bg-[#2148C0] p-8 rounded-[2.5rem] text-white space-y-4">
                            <div className="flex justify-between items-start">
                                <BarChart3 className="w-8 h-8 opacity-50" />
                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">ALERTA</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-black">Risco Climático</h4>
                                <p className="text-blue-100/60 text-sm font-medium">Ventos acima de 60km/h previstos para às 14:00.</p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Emergência</span>
                                <span className="text-xs font-bold">Nível 2 (Atenção)</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-center items-center text-center space-y-4">
                            <TrendingDown className="w-12 h-12 text-green-500" />
                            <div>
                                <h4 className="font-black text-gray-900">Tendência de Queda</h4>
                                <p className="text-xs text-gray-500 font-medium">Suas emissões caíram 12% este mês em comparação à média anual.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

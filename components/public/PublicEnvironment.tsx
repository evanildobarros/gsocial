import React from 'react';
import { ArrowLeft, Leaf, Wind, Map, ShieldCheck, Waves } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicEnvironment: React.FC<PublicPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" />
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                            <Leaf size={16} /> Meio Ambiente
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
                <div className="container mx-auto">
                    <div className="mb-12">
                        <span className="text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-2 block">Framework: TCFD & ABNT PR 2030</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Resiliência Climática e Biodiversidade.</h1>
                        <p className="text-lg font-medium text-black/60 italic max-w-2xl">
                            Estratégias de adaptação e preservação dos ecossistemas costeiros da Baía de São Marcos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {/* Live Map Placeholder */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-[40px] p-8 border border-gray-100 min-h-[400px] flex flex-col justify-between group overflow-hidden relative">
                             <div className="absolute inset-0 bg-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                             <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-blue-600">
                                    <Map size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Adaptação Costeira (TCFD)</span>
                                </div>
                                <h3 className="text-2xl font-black mb-4">Mapa de Vulnerabilidade</h3>
                                <p className="text-sm font-medium text-black/60 max-w-xs leading-relaxed">
                                    Monitoramento em tempo real da elevação do nível do mar e riscos de eventos extremos.
                                </p>
                             </div>
                             <div className="mt-auto flex gap-4">
                                <span className="px-4 py-2 rounded-full bg-white border border-gray-200 text-[10px] font-black uppercase shadow-sm">Zona Portuária</span>
                                <span className="px-4 py-2 rounded-full bg-white border border-gray-200 text-[10px] font-black uppercase shadow-sm">Manguezais</span>
                             </div>
                        </div>

                        {/* Emissions Chart Placeholder */}
                        <div className="bg-green-600 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-xl shadow-green-900/20">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Wind size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest opacity-70">Descarbonização</span>
                                </div>
                                <h3 className="text-3xl font-black mb-2 tracking-tight">Rastreio GEE</h3>
                                <p className="text-sm font-medium opacity-80 leading-relaxed">
                                    Inventário completo de Escopo 1, 2 e 3 auditado externamente.
                                </p>
                            </div>
                            <div className="h-32 flex items-end gap-2">
                                <div className="w-full h-[30%] bg-white/20 rounded-t-lg" />
                                <div className="w-full h-[60%] bg-white/40 rounded-t-lg" />
                                <div className="w-full h-[100%] bg-white rounded-t-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Badge Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-3xl border border-gray-100 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Waves size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight">Água de Lastro Controlada</h4>
                                <p className="text-sm font-medium text-black/60">Controle rigoroso de espécies exóticas e salinidade.</p>
                            </div>
                        </div>
                        <div className="p-8 rounded-3xl border border-gray-100 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight">Economia Circular Integrada</h4>
                                <p className="text-sm font-medium text-black/60">Aterro Zero e rastreabilidade total de resíduos (MTR/CDF).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

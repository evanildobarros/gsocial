import React, { useState } from 'react';
import { Wind, Volume2, Trash2, AlertOctagon, MapPin, CheckCircle2, Factory, Loader2 } from 'lucide-react';

export const PollutionControl: React.FC = () => {
    const [isEmergencyActive, setIsEmergencyActive] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const handleEmergencyButton = () => {
        setIsReporting(true);
        setTimeout(() => {
            setIsReporting(false);
            setIsEmergencyActive(true);
            // Aqui dispararia push notifications e logs no Supabase no cenário real
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Prevenção & Controle de Poluição</h2>
                <p className="text-gray-500 font-medium">Monitoramento de qualidade do ar, ruído e rastreabilidade de resíduos.</p>
            </div>

            {/* Emergency & Air Quality Heatmap Context */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Emergency Trigger Area */}
                <div className="lg:col-span-1 bg-white p-8 rounded-sm border-2 border-red-50 shadow-2xl shadow-red-900/5 flex flex-col justify-between min-h-[400px]">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-50 rounded-sm">
                                <AlertOctagon className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 leading-tight">Botão de Emergência Ambiental (PAM)</h3>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                            Use em caso de derramamento de óleo, vazamento químico ou incidentes graves. Aciona a Coordenação de Resposta (COREM) instantaneamente.
                        </p>
                    </div>

                    <div className="relative flex items-center justify-center py-12">
                        {isEmergencyActive ? (
                            <div className="text-center space-y-4 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900">COREM Notificada</h4>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Equipe em deslocamento</p>
                                <button
                                    onClick={() => setIsEmergencyActive(false)}
                                    className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 mt-4"
                                >
                                    Encerrar Alerta
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleEmergencyButton}
                                disabled={isReporting}
                                className="relative group w-48 h-48"
                            >
                                <div className="absolute inset-0 bg-red-600 rounded-full group-hover:scale-110 transition-transform shadow-2xl shadow-red-600/40"></div>
                                <div className="absolute inset-4 border-4 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                                    {isReporting ? (
                                        <Loader2 className="w-10 h-10 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-xs font-black uppercase tracking-[0.2em] mb-1">Pressionar</span>
                                            <span className="text-3xl font-black">SOS</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-sm flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coordenadas atuais fixadas pelo GPS</span>
                    </div>
                </div>

                {/* Real-Time Air/Waste Dashboard */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Air Quality */}
                        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-xl shadow-blue-900/5 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-blue-50 rounded-sm">
                                    <Wind className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase">Qualidade: Boa</span>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-lg font-black text-gray-900 leading-none">Qualidade do Ar</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Material Particulado PM2.5</span>
                                        <span className="font-black text-gray-900">12 µg/m³</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="w-[15%] h-full bg-green-500"></div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <span className="text-gray-500 font-medium">Nível de Ruído</span>
                                        <span className="font-black text-gray-900">65 dB(A)</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="w-[65%] h-full bg-yellow-500"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium italic">*Sensores integrados via IoT Industrial (CONAMA 491/18).</p>
                        </div>

                        {/* Waste Management */}
                        <div className="bg-gray-900 p-8 rounded-sm text-white space-y-6 overflow-hidden relative">
                            <Trash2 className="absolute top-0 right-0 w-32 h-32 text-white/5 -rotate-12 translate-x-8 -translate-y-4" />
                            <div className="relative z-10 space-y-6">
                                <div className="p-3 bg-white/10 rounded-sm w-fit">
                                    <Factory className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black leading-none">Resíduos & Circular</h4>
                                    <p className="text-gray-400 text-sm font-medium mt-2">MTRs pendentes de validação este mês.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Reciclado</p>
                                        <p className="text-xl font-black">42.8t</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Aterro</p>
                                        <p className="text-xl font-black">8.2t</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white text-gray-900 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">
                                    Upload de Manifesto (MTR)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Kanban Flow Simple */}
                    <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-xl shadow-blue-900/5">
                        <h4 className="text-xl font-black text-gray-900 mb-8">Fluxo de Destinação de Resíduos</h4>
                        <div className="grid grid-cols-4 gap-4">
                            {['Geração', 'Armazenamento', 'Coleta', 'Destinação'].map((stage, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className={`h-2 rounded-full ${i <= 1 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${i <= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {stage}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

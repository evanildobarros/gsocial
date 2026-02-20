import React from 'react';
import { ArrowLeft, Users, ShieldAlert, Coins, MapPin } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicSocial: React.FC<PublicPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" />
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-sm font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                            <Users size={16} /> Social
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
                        <span className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-2 block">Framework: GRI 400 & ABNT PR 2030</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Relação Porto-Cidade e Direitos Humanos.</h1>
                        <p className="text-lg font-medium text-black/60 italic max-w-2xl">
                            Mensurando o impacto social real e garantindo a ética em toda a cadeia produtiva.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* SROI Widget */}
                        <div className="p-8 rounded-[40px] bg-orange-500 text-white shadow-xl shadow-orange-900/20 flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Coins size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest opacity-70 text-white">S-ROI Analytics</span>
                                </div>
                                <h3 className="text-3xl font-black mb-4 tracking-tight leading-none">Retorno Social (S-ROI)</h3>
                                <p className="text-sm font-medium opacity-80 leading-relaxed mb-6">
                                    Cálculo do valor social gerado para cada real investido em projetos comunitários.
                                </p>
                            </div>
                            <div className="text-5xl font-black tracking-tighter group-hover:scale-110 transition-transform origin-left">3.4x</div>
                        </div>

                        {/* Community Impact Map */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-[40px] p-8 border border-gray-100 min-h-[300px] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-orange-600">
                                    <MapPin size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Território e Materialidade</span>
                                </div>
                                <h3 className="text-2xl font-black mb-4">Mapa de Impacto Comunitário</h3>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {['Quilombolas', 'Pescadores Artesanais', 'Segurança Alimentar', 'Educação'].map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-[10px] font-black uppercase text-black/60">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Status de Conformidade</p>
                                    <p className="text-sm font-bold text-black italic">Due Diligence Ativa: 0 Violações de Direitos Humanos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

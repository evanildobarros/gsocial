import React from 'react';
import { ArrowLeft, Users, Heart, MapPin, GraduationCap } from 'lucide-react';

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
                            <Users size={16} /> Responsabilidade Social
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

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 text-center md:text-left">
                <div className="container mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                        Relação <br/>
                        <span className="text-orange-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Porto-Cidade</span>.
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-black/70 max-w-2xl leading-relaxed mb-12">
                        O desenvolvimento do Porto do Itaqui só faz sentido se crescermos juntos com a nossa comunidade. Conheça nossos projetos de impacto no Itaqui-Bacanga.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard 
                            icon={<Users className="w-6 h-6 text-orange-500" />} 
                            value="155k"
                            label="Pessoas Impactadas"
                            desc="População residente na área de influência direta (Itaqui-Bacanga)."
                        />
                        <StatCard 
                            icon={<GraduationCap className="w-6 h-6 text-blue-600" />} 
                            value="45"
                            label="Projetos Ativos"
                            desc="Iniciativas de educação, qualificação profissional e cultura."
                        />
                        <StatCard 
                            icon={<Heart className="w-6 h-6 text-red-500" />} 
                            value="R$ 54mi"
                            label="Investimento Social"
                            desc="Recursos aplicados em infraestrutura e bem-estar comunitário."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ icon, value, label, desc }: any) => (
    <div className="p-8 rounded-[32px] border border-gray-100 bg-white shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-transform text-left">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
            {icon}
        </div>
        <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
        <div className="text-sm font-black uppercase tracking-wide mb-3">{label}</div>
        <p className="text-xs font-medium text-black/60 leading-relaxed">{desc}</p>
    </div>
);

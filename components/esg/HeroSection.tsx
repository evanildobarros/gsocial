import React from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollClick }) => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-zinc-950 text-white isolate">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-[-10]">
        <img
          src="/images/hero-bg-tech.png"
          alt="Plano de fundo tecnológico"
          loading="lazy"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full pt-48 pb-12 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="max-w-5xl animate-fade-in-up flex flex-col items-center lg:items-start gap-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight antialiased text-white">
            Transforme a Sustentabilidade em Vantagem Competitiva.
          </h1>

          <p className="max-w-2xl text-lg font-medium leading-relaxed text-white/80 mb-6">
            Implementamos a metodologia ESGporto para empresas que buscam conformidade rigorosa e reconhecimento global.
          </p>
          
          <button onClick={onScrollClick} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all">
            Quero meu Diagnóstico Gratuito
          </button>
        </div>

        {/* Stats Grid - Inspired by UI Reference */}
        <div className="mt-20 w-full grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl border-t border-white/10 pt-12">
          {[
            { value: "189k", label: "tCO2eq monitoradas" },
            { value: "155k", label: "Pessoas impactadas" },
            { value: "99.9%", label: "Uptime da plataforma" },
            { value: "3%", label: "Taxa operacional" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start">
              <p className="text-3xl lg:text-4xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] lg:text-xs font-medium text-white/60 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center w-full animate-bounce">
          <ArrowDown className="h-6 w-6 text-white/50" />
        </div>
      </div>
    </section>
  );
};

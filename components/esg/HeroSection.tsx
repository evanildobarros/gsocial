import React from 'react';
import { ArrowDown, Leaf, Users } from 'lucide-react';

interface HeroSectionProps {
  onScrollClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollClick }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black text-white isolate">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-[-10]">
        <img
          src="/images/hero-bg-tech.png"
          alt="Plano de fundo tecnológico e minimalista"
          loading="lazy"
          className="w-full h-full object-cover scale-105 animate-[ken-burns_20s_ease-in-out_infinite] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 py-32 md:py-48 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="max-w-4xl animate-fade-in-up">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-md">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-green-400">
              Relatório ESG 2024
            </span>
          </div>

          <h1 className="text-fluid-4xl sm:text-fluid-5xl lg:text-fluid-7xl font-black leading-[0.95] tracking-tighter mb-8 antialiased text-white">
            Transforme a Sustentabilidade <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300">do seu Negócio</span> <br />
            em Vantagem Competitiva.
          </h1>

          <p className="max-w-2xl text-lg md:text-2xl font-medium leading-relaxed text-white mb-8 mx-auto lg:mx-0">
            Implementamos a metodologia ESGporto para empresas portuárias e logísticas que precisam de conformidade rigorosa e reconhecimento global, sem interromper a operação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
            <button onClick={onScrollClick} className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50">
              Quero meu Diagnóstico ESG Gratuito
            </button>
            <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20">
              Relatório 2024 (PDF)
            </button>
          </div>
        </div>

        {/* Stats Section - Mobile Optimization */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 max-w-3xl animate-fade-in-up animation-delay-300">
          <div className="group rounded-[32px] md:rounded-[48px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 transition-all hover:border-green-500/40 hover:bg-white/10 shadow-2xl">
            <div className="mb-6 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform mx-auto lg:mx-0">
              <Leaf size={28} />
            </div>
            <p className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-2">
              189k
            </p>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">
              tCO<sub>2</sub>eq monitoradas
            </p>
          </div>

          <div className="group rounded-[32px] md:rounded-[48px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 transition-all hover:border-orange-500/40 hover:bg-white/10 shadow-2xl">
            <div className="mb-6 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform mx-auto lg:mx-0">
              <Users size={28} />
            </div>
            <p className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-2">
              155k
            </p>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">
              Pessoas impactadas
            </p>
          </div>
        </div>

        {/* Mobile-centric scroll indicator */}
        <div className="mt-20 flex justify-center w-full animate-fade-in-up animation-delay-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-[1px] h-12 bg-gradient-to-b from-green-500 to-transparent"></div>
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30">
              Descubra
            </span>
            <ArrowDown className="h-4 w-4 text-green-500 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

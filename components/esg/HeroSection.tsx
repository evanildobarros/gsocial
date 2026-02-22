import React from 'react';
import { ArrowDown, Leaf, Users } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-port.jpg"
          alt="Vista aérea do Porto do Itaqui ao entardecer"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-green-400">
              Relatório ESG 2024
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter mb-8 antialiased">
            Liderança <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300">Sustentável</span> <br className="hidden sm:block" />
            para o Maranhão.
          </h1>

          <p className="max-w-2xl text-base md:text-xl font-medium leading-relaxed text-white/70 mb-12">
            O Porto do Itaqui integra operações logísticas de classe mundial com
            compromissos ambientais, sociais e de governança que transformam o
            futuro do estado.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl animate-fade-in-up animation-delay-300">
          <div className="group rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl p-10 transition-all hover:border-green-500/40 hover:bg-white/10 shadow-2xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
              <Leaf size={24} />
            </div>
            <p className="text-5xl font-black tracking-tighter text-white mb-1">
              189k
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              tCO<sub>2</sub>eq monitoradas
            </p>
          </div>

          <div className="group rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl p-10 transition-all hover:border-orange-500/40 hover:bg-white/10 shadow-2xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <p className="text-5xl font-black tracking-tighter text-white mb-1">
              155k
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              Pessoas impactadas
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex justify-center lg:justify-start animate-fade-in-up animation-delay-500">
          <a
            href="#sobre"
            className="flex flex-col items-center gap-2 text-white/40 transition-colors hover:text-white group"
          >
            <span className="text-[10px] font-black tracking-widest uppercase">
              Descubra
            </span>
            <ArrowDown className="h-5 w-5 animate-bounce group-hover:text-green-400" />
          </a>
        </div>
      </div>
    </section>
  );
};

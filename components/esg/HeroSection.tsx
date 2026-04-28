import React from 'react';

interface HeroSectionProps {
  onScrollClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollClick }) => {
  return (
    <section className="relative w-full flex items-center bg-[#0a192f] text-white isolate overflow-hidden min-h-[80vh]">
      {/* Blueprint Background */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('/public/img1.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f]/95 via-[#0a192f]/60 to-transparent z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full pt-32 pb-20 flex flex-col justify-center h-full">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-5xl lg:text-7xl font-black leading-[1] tracking-tight mb-6">
            Construindo o futuro do Porto, um dia de cada vez.
          </h1>
          <p className="text-lg lg:text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
            A plataforma gsocial é o rastreador focado em sustentabilidade para o Porto do Itaqui, ajudando a construir conformidade ESG através de progresso visual e zero distrações.
          </p>
          <button 
            onClick={onScrollClick} 
            className="px-8 py-4 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-full transition-all flex items-center gap-2"
          >
            Começar agora
          </button>
        </div>
      </div>
    </section>
  );
};

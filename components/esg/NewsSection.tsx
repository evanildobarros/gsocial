import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export const NewsSection = () => {
  const news = [
    {
      date: "19 Fev 2026",
      title: "Porto do Itaqui atinge meta de 100% de iluminação LED em áreas operacionais.",
      image: "/img1.png",
      tag: "Ambiental"
    },
    {
      date: "15 Fev 2026",
      title: "Programa Porto do Futuro abre inscrições para novas bolsas de pesquisa.",
      image: "/img2.png",
      tag: "Social"
    },
    {
      date: "10 Fev 2026",
      title: "Relatório de Emissões 2025 confirma redução de 24% no Escopo 1.",
      image: "/img3.png",
      tag: "Dados"
    }
  ];

  return (
    <section className="py-20 md:py-32 px-6 bg-white dark:bg-black transition-colors duration-500">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
          <div className="max-w-xl">
             <span className="inline-block text-emerald-600 font-black tracking-widest uppercase text-[10px] mb-4 pl-3 border-l-4 border-emerald-500">
               Linha do Tempo
             </span>
             <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white tracking-tighter mb-4 leading-tight">
               Mural ESGporto.
             </h2>
             <p className="text-black/60 dark:text-white/60 text-lg font-medium italic">
               Acompanhe as últimas ações de impacto e atualizações técnicas do complexo portuário.
             </p>
          </div>
          <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black dark:border-white/20 pb-2 hover:border-emerald-500 transition-all group">
            Todas as Notícias <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {news.map((item, i) => (
            <div key={i} className="group bg-white dark:bg-white/5 rounded-[40px] md:rounded-[48px] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all cursor-pointer">
              <div className="h-56 md:h-64 bg-slate-100 dark:bg-zinc-800 relative overflow-hidden">
                 <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 <div className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {item.tag}
                 </div>
              </div>
              <div className="p-8 md:p-10 space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-black/40 dark:text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <Calendar size={14} />
                  {item.date}
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-black dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors italic">
                  {item.title}
                </h4>
                <div className="pt-4 md:pt-6 flex justify-end">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight size={20} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

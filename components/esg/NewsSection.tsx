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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {news.map((item, i) => (
            <article key={i} className="flex flex-col items-start justify-between group cursor-pointer">
              <div className="relative w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime="2026-02-22" className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                    {item.date}
                  </time>
                  <span className="relative z-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[9px]">
                    {item.tag}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-4 text-2xl font-black leading-tight text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    <span className="absolute inset-0" />
                    {item.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                    Monitoramento contínuo e reporte de impacto para o ecossistema portuário do Maranhão, seguindo padrões internacionais de sustentabilidade.
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4 border-t border-gray-100 dark:border-white/5 pt-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-black text-xs text-emerald-600">
                    EM
                  </div>
                  <div className="text-sm leading-6">
                    <p className="font-black text-gray-900 dark:text-white">
                      <span className="absolute inset-0" />
                      Comunicação EMAP
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">Autoridade Portuária</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';

export const BentoCommitments = () => {
  const commitments = [
    {
      title: "Clima",
      goal: "-50% Emissões",
      desc: "Redução absoluta de gases de efeito estufa nos Escopos 1 e 2.",
      progress: 68,
      color: "bg-green-500",
      size: "md:col-span-2 md:row-span-1"
    },
    {
      title: "Social",
      goal: "+20k Qualificados",
      desc: "Pessoas treinadas pelo programa Porto do Futuro.",
      progress: 45,
      color: "bg-orange-500",
      size: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Energia",
      goal: "100% Renovável",
      desc: "Uso total de matriz energética limpa.",
      progress: 92,
      color: "bg-yellow-500",
      size: "md:col-span-1 md:row-span-2"
    },
    {
      title: "Educação",
      goal: "Fim dos Desertos",
      desc: "Erradicação de áreas sem acesso escolar no Itaqui-Bacanga.",
      progress: 30,
      color: "bg-blue-500",
      size: "md:col-span-2 md:row-span-1"
    },
    {
      title: "Governança",
      goal: "Auditoria 100%",
      desc: "Todas as operações com selo independente de compliance.",
      progress: 100,
      color: "bg-indigo-500",
      size: "md:col-span-1 md:row-span-1"
    }
  ];

  return (
    <section id="sobre" className="py-16 md:py-32 px-6 bg-white dark:bg-black transition-colors duration-500">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-12 md:mb-20 text-center md:text-left">
          <span className="inline-block text-green-600 font-black tracking-widest uppercase text-[10px] mb-4 pl-3 border-l-4 border-green-500">
            Nossa Visão 2030
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter mb-6 leading-tight">
            Compromissos reais para <br/>
            um porto de impacto.
          </h2>
          <p className="text-black/60 dark:text-white/60 text-lg font-medium leading-relaxed italic">
            Nossas metas são quantitativas, transparentes e auditadas periodicamente para garantir o desenvolvimento territorial sustentável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">
          {commitments.map((c, i) => (
            <div 
              key={i} 
              className={`p-10 rounded-[48px] border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200 dark:hover:border-white/10 transition-all group ${c.size}`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mb-3 block">
                  {c.title}
                </span>
                <h4 className="text-3xl font-black text-black dark:text-white mb-2 tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {c.goal}
                </h4>
                <p className="text-xs font-bold text-black/60 dark:text-white/60 leading-relaxed max-w-[200px]">
                  {c.desc}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase text-black/20 dark:text-white/20">Progresso</span>
                   <span className="text-sm font-black text-black dark:text-white">{c.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                   <div 
                    className={`h-full ${c.color} shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-1000`} 
                    style={{ width: `${c.progress}%` }} 
                   />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

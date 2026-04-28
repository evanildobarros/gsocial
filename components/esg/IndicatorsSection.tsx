import React from 'react';

interface IndicatorsSectionProps {
  id?: string;
}

export const IndicatorsSection: React.FC<IndicatorsSectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-32 bg-gray-50 dark:bg-zinc-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter mb-6">
            Painel de Indicadores
          </h2>
          <p className="text-black/60 dark:text-white/60 text-lg font-medium max-w-2xl italic">
            Monitoramento em tempo real do desempenho de nossas metas ESG.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
                <h3 className="text-xl font-bold mb-2">Descarbonização</h3>
                <p className="text-sm text-black/60 dark:text-white/60 mb-6">Redução de emissões</p>
                <div className="text-4xl font-black text-green-600">85%</div>
            </div>
            <div className="p-8 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
                <h3 className="text-xl font-bold mb-2">Energia Renovável</h3>
                <p className="text-sm text-black/60 dark:text-white/60 mb-6">Uso matriz limpa</p>
                <div className="text-4xl font-black text-green-600">98%</div>
            </div>
            <div className="p-8 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
                <h3 className="text-xl font-bold mb-2">Educação Local</h3>
                <p className="text-sm text-black/60 dark:text-white/60 mb-6">Pessoas formadas</p>
                <div className="text-4xl font-black text-green-600">12k</div>
            </div>
        </div>
      </div>
    </section>
  );
};

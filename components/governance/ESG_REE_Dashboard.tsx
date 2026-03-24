import React from 'react';
import { LayoutDashboard, Target, TrendingUp, ShieldAlert } from 'lucide-react';

export const ESG_REE_Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/10">
      <h2 className="text-2xl font-black text-black dark:text-white mb-6 flex items-center gap-3">
        <TrendingUp className="text-happiness-1" /> Hub de Inteligência ETRs (Maranhão 2045)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPIs Cards */}
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg border border-gray-100 dark:border-white/5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Volume Exportação</p>
          <p className="text-3xl font-black text-black dark:text-white mt-2">N/A</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg border border-gray-100 dark:border-white/5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Valor Agregado (USD/t)</p>
          <p className="text-3xl font-black text-black dark:text-white mt-2">N/A</p>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg border border-gray-100 dark:border-white/5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">SROI Estimado</p>
          <p className="text-3xl font-black text-black dark:text-white mt-2">N/A</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg border border-gray-100 dark:border-white/5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gestão de Rejeitos</p>
          <p className="text-3xl font-black text-black dark:text-white mt-2">Monitorado</p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-white/10 pt-8">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">Eixos Geológicos com Potencial</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Baixo Itapecuru</li>
          <li>Noroeste</li>
          <li>Leste/Sudeste</li>
          <li>Sudoeste/Centro-Sul</li>
        </ul>
      </div>
    </div>
  );
};

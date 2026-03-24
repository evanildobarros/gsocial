import React from 'react';
import { FileText, Download, ShieldCheck, ArrowRight } from 'lucide-react';

export const TransparencySection = () => {
  const reports = [
    { title: "Relatório Integrado de Sustentabilidade", year: "2024", size: "4.4 MB", type: "GRI / ABNT" },
    { title: "Demonstrações Financeiras Auditadas", year: "2024", size: "4.5 MB", type: "Audit" },
    { title: "Inventário de Emissões GEE (Base 2022)", year: "2023", size: "8.0 MB", type: "Clima" },
    { title: "Código de Conduta e Ética", year: "2024", size: "2.0 MB", type: "Compliance" }
  ];

  return (
    <section id="relatórios" className="py-32 px-6 bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div>
              <span className="inline-block px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                Governança & Transparência
              </span>
              <h2 className="text-fluid-3xl md:text-fluid-5xl font-black text-black dark:text-white tracking-tighter leading-tight mb-6">
                Relatórios que <br/>
                contam nossa história.
              </h2>
              <p className="text-lg font-medium text-black/60 dark:text-white/60 leading-relaxed italic">
                Operamos sob os mais altos padrões internacionais de auditoria independente e reporte (GRI, SASB e TCFD).
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
               <div className="p-8 rounded-[40px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col items-center text-center group transition-all hover:scale-105">
                  <ShieldCheck size={64} className="text-blue-600 mb-6" />
                  <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">Selo Audit</h4>
                  <p className="text-xs font-bold text-black/40 dark:text-white/40 mt-2 uppercase tracking-widest">Ciclo 2025/2026</p>
               </div>
               <button className="flex-1 min-w-[200px] p-8 rounded-[40px] bg-black text-white flex flex-col justify-between hover:bg-zinc-800 transition-colors group">
                  <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform text-green-400" />
                  <div className="text-left">
                    <p className="text-sm font-black uppercase tracking-widest mb-1 text-green-400">Canal Público</p>
                    <h4 className="text-xl font-bold italic">Denúncias & Ética</h4>
                  </div>
               </button>
            </div>
          </div>

          <div className="space-y-4">
            {reports.map((r, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-[40px] bg-white dark:bg-white/5 border border-transparent hover:border-blue-200 dark:hover:border-blue-900/30 hover:shadow-2xl transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <FileText size={28} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-black/40 dark:text-white/40 tracking-[0.2em]">{r.year} • {r.type}</span>
                    <h4 className="text-xl font-bold text-black dark:text-white tracking-tight">{r.title}</h4>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                  <Download size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

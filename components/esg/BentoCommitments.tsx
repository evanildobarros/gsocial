import React from 'react';
import { CitizenPortalCard } from './CitizenPortalCard';

export const BentoCommitments: React.FC = () => {
  return (
    <section className="bg-white dark:bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 bg-[#29A683]"></div>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-[#29A683]">Nossa Visão 2030</span>
          </div>
          <h2 className="text-5xl font-black text-black dark:text-white">Compromissos</h2>
          
          <div className="mt-12 flex justify-center">
            <CitizenPortalCard />
          </div>
        </div>
      </div>
    </section>
  );
};

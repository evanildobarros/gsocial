import React from 'react';
import { Globe, ShieldCheck, Anchor } from 'lucide-react';
import { AppMode } from '../../types';

interface FooterProps {
    onNavigate?: (mode: AppMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-slate-50 dark:bg-zinc-950 py-24 border-t border-gray-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-1 space-y-6 text-left">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <img src="/logo_itaqui.svg" alt="Porto do Itaqui" className="h-10 w-auto object-contain dark:brightness-0 dark:invert" />
                        </div>
                        <p className="text-sm font-medium text-black/40 dark:text-white/40 leading-relaxed">
                            Empresa Maranhense de Administração Portuária (EMAP).<br />
                            Referência em Logística e Sustentabilidade.
                        </p>
                    </div>

                    <div className="text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/20 mb-8">Páginas ESG</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_ENVIRONMENT)} className="hover:text-green-600 transition-colors text-left">Meio Ambiente</button></li>
                            <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_SOCIAL)} className="hover:text-green-600 transition-colors text-left">Responsabilidade Social</button></li>
                            <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_REPORTS)} className="hover:text-green-600 transition-colors text-left">Relatórios</button></li>
                            <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_INDICATORS)} className="hover:text-green-600 transition-colors text-left">Indicadores</button></li>
                        </ul>
                    </div>

                    <div className="text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/20 mb-8">Links Rápidos</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_GOVERNANCE)} className="hover:text-green-600 transition-colors text-left">Governança</button></li>
                            <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_COMPLIANCE)} className="hover:text-green-600 transition-colors text-left">Compliance</button></li>
                            <li><button onClick={() => onNavigate?.(AppMode.PUBLIC_CAREERS)} className="hover:text-green-600 transition-colors text-left">Trabalhe Conosco</button></li>
                        </ul>
                    </div>

                    <div className="text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/20 mb-8">Conexão</h4>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Globe size={18} /></div>
                            <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><ShieldCheck size={18} /></div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/20">
                    <div>&copy; 2026 EMAP - Todos os direitos reservados.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-black dark:hover:text-white">Privacidade</a>
                        <a href="#" className="hover:text-black dark:hover:text-white">Termos de Uso</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

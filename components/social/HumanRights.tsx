import React from 'react';
import { Search, ShieldCheck, AlertOctagon, FileText } from 'lucide-react';
import { Button, TextField } from '@mui/material';

export const HumanRights: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Direitos Humanos & Supply Chain</h1>
                    <p className="text-sm text-gray-500 mt-1">Due Diligence de Fornecedores e Monitoramento de Trabalho Escravo</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1C1C1C] p-8 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm max-w-2xl mx-auto text-center">
                <ShieldCheck className="w-16 h-16 text-happiness-1 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verificação de Fornecedor</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Consulte a conformidade de novos fornecedores contra a "Lista Suja" do Trabalho Escravo e outras violações de direitos humanos.
                </p>

                <div className="flex gap-4 max-w-md mx-auto">
                    <TextField
                        fullWidth
                        placeholder="Digite o CNPJ do fornecedor..."
                        variant="outlined"
                        size="small"
                        InputProps={{ sx: { borderRadius: '2px' } }}
                    />
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<Search />}
                        sx={{ borderRadius: '2px', fontWeight: 'bold' }}
                    >
                        Verificar
                    </Button>
                </div>

                <div className="mt-8 flex justify-center gap-8 border-t border-gray-100 dark:border-white/5 pt-8">
                    <div className="text-center">
                        <div className="text-3xl font-black text-gray-900 dark:text-white">1,240</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Fornecedores Ativos</div>
                    </div>
                    <div className="w-px bg-gray-100 dark:bg-white/5" />
                    <div className="text-center">
                        <div className="text-3xl font-black text-red-500">3</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Bloqueados (Risco Alto)</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Recent Alerts */}
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-sm border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertOctagon className="w-4 h-4 text-red-600" />
                        <h3 className="font-bold text-red-800 dark:text-red-400 text-sm">Alerta Recente</h3>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">
                        O fornecedor <strong>Logística Express Ltda (33.221...)</strong> foi identificado na atualização da Lista Suja do MTE de Ontem. Contrato suspenso preventivamente.
                    </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-sm border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <h3 className="font-bold text-blue-800 dark:text-blue-400 text-sm">Relatórios</h3>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        O Relatório de Due Diligence Anual de 2025 já está disponível para download. <span className="underline cursor-pointer font-bold">Baixar PDF</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

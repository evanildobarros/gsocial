import React from 'react';
import { Card, Typography, LinearProgress, Box } from '@mui/material';
import { ShieldCheck, Scale, FileText, UserCheck, Eye } from 'lucide-react';

interface GovernanceSummaryCardProps {
    answers: Record<string, number>;
}

export const GovernanceSummaryCard: React.FC<GovernanceSummaryCardProps> = ({ answers }) => {
    const getStatusLabel = (val: number) => {
        if (val >= 5) return { label: 'Excelente', color: 'text-indigo-500', bg: 'bg-indigo-50/50' };
        if (val >= 3) return { label: 'Conforme', color: 'text-blue-500', bg: 'bg-blue-50/50' };
        return { label: 'Frágil', color: 'text-red-500', bg: 'bg-red-50/50' };
    };

    const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / (Object.keys(answers).length || 1);
    const globalStatus = getStatusLabel(Math.round(avgScore));

    const indices = [
        {
            id: 'g_compliance',
            label: 'Integridade',
            icon: <ShieldCheck size={14} className="text-indigo-500" />,
            value: answers['g_compliance'] || 1
        },
        {
            id: 'g_risks',
            label: 'Gestão de Riscos',
            icon: <Scale size={14} className="text-blue-500" />,
            value: answers['g_risks'] || 1
        },
        {
            id: 'g_transparency',
            label: 'Transparência',
            icon: <Eye size={14} className="text-gray-500" />,
            value: answers['g_transparency'] || 1
        },
        {
            id: 'g_board',
            label: 'Governança (Conselho)',
            icon: <UserCheck size={14} className="text-purple-500" />,
            value: answers['g_board'] || 1
        },
        {
            id: 'g_ethics',
            label: 'Ética e Conduta',
            icon: <FileText size={14} className="text-indigo-600" />,
            value: answers['g_ethics'] || 1
        }
    ];

    return (
        <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 bg-white dark:bg-[#1C1C1C]">
            <Typography
                className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-12 flex items-center gap-2"
                sx={{ mb: 6 }}
            >
                <ShieldCheck size={14} className="text-indigo-500" />
                Resumo Governança ABNT
            </Typography>

            <div className="space-y-6">
                {indices.map((idx) => {
                    const status = getStatusLabel(idx.value);
                    return (
                        <div key={idx.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px]">
                                <div className="flex items-center gap-2">
                                    {idx.icon}
                                    <span className="font-bold text-gray-500 uppercase tracking-widest">{idx.label}</span>
                                </div>
                                <span className={`font-black uppercase ${status.color}`}>{status.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Box className="flex-1">
                                    <LinearProgress
                                        variant="determinate"
                                        value={(idx.value / 5) * 100}
                                        className="h-1 rounded-full"
                                        sx={{
                                            backgroundColor: 'rgba(0,0,0,0.05)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: idx.value >= 5 ? '#6366F1' : (idx.value >= 3 ? '#3b82f6' : '#ef4444')
                                            }
                                        }}
                                    />
                                </Box>
                                <span className="text-[10px] font-black text-gray-400">L{idx.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`mt-8 p-4 rounded-sm border border-gray-100 dark:border-white/5 ${globalStatus.bg}`}>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Maturidade Geral (G)</p>
                <div className="flex items-center justify-between">
                    <span className={`text-sm font-black uppercase ${globalStatus.color}`}>Nível {Math.round(avgScore)} - {globalStatus.label}</span>
                    <span className="text-[10px] font-black text-gray-500">{avgScore.toFixed(1)} / 5.0</span>
                </div>
            </div>
        </Card>
    );
};

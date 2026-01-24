import React from 'react';
import { Card, Typography, LinearProgress, Box } from '@mui/material';
import { Leaf as LeafIcon, Droplets, Trash2, ShieldAlert, Trees } from 'lucide-react';

interface EnvironmentalSummaryCardProps {
    answers: Record<string, number>;
}

export const EnvironmentalSummaryCard: React.FC<EnvironmentalSummaryCardProps> = ({ answers }) => {
    const getStatusLabel = (val: number) => {
        if (val >= 5) return { label: 'Excelente', color: 'text-green-500', bg: 'bg-green-50/50' };
        if (val >= 3) return { label: 'Em Evolução', color: 'text-blue-500', bg: 'bg-blue-50/50' };
        return { label: 'Crítico', color: 'text-red-500', bg: 'bg-red-50/50' };
    };

    const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / (Object.keys(answers).length || 1);
    const globalStatus = getStatusLabel(Math.round(avgScore));

    const indices = [
        {
            id: 'e_ghg',
            label: 'Descarbonização',
            icon: <LeafIcon size={14} className="text-emerald-500" />,
            value: answers['e_ghg'] || 1
        },
        {
            id: 'e_waste',
            label: 'Circularidade',
            icon: <Trash2 size={14} className="text-orange-500" />,
            value: answers['e_waste'] || 1
        },
        {
            id: 'e_spill',
            label: 'Resiliência Ambiental',
            icon: <ShieldAlert size={14} className="text-red-500" />,
            value: answers['e_spill'] || 1
        },
        {
            id: 'e_water',
            label: 'Proteção Hídrica',
            icon: <Droplets size={14} className="text-blue-500" />,
            value: answers['e_water'] || 1
        },
        {
            id: 'e_biodiversity',
            label: 'Biodiversidade',
            icon: <Trees size={14} className="text-green-600" />,
            value: answers['e_biodiversity'] || 1
        }
    ];

    return (
        <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 bg-white dark:bg-[#1C1C1C]">
            <Typography
                className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-12 flex items-center gap-2"
                sx={{ mb: 6 }}
            >
                <LeafIcon size={14} className="text-emerald-500" />
                Resumo Ambiental ABNT
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
                                                backgroundColor: idx.value >= 5 ? '#10B981' : (idx.value >= 3 ? '#3b82f6' : '#ef4444')
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
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Maturidade Geral (E)</p>
                <div className="flex items-center justify-between">
                    <span className={`text-sm font-black uppercase ${globalStatus.color}`}>Nível {Math.round(avgScore)} - {globalStatus.label}</span>
                    <span className="text-[10px] font-black text-gray-500">{avgScore.toFixed(1)} / 5.0</span>
                </div>
            </div>
        </Card>
    );
};

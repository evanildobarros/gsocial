import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
} from '@mui/material';
import {
    Users,
    Leaf,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    ClipboardCheck
} from 'lucide-react';
import { AppMode } from '../types';

interface ESGDiagnosticsCenterProps {
    onSelectMode: (mode: AppMode, extra?: any) => void;
}

export const ESGDiagnosticsCenter: React.FC<ESGDiagnosticsCenterProps> = ({ onSelectMode }) => {
    const modules = [
        {
            title: "Diagnóstico Social",
            subtitle: "Inventário & Território",
            desc: "Levantamento socioeconômico das comunidades do entorno e materialidade social.",
            icon: <Users className="w-8 h-8 text-blue-500" />,
            mode: AppMode.SOCIAL_ASSESSMENT,
            color: "border-blue-500",
            bg: "bg-blue-50/50"
        },
        {
            title: "Diagnóstico Ambiental",
            subtitle: "ABNT PR 2030 (E)",
            desc: "Avaliação de maturidade em GEE, Resíduos e Eficiência Baseada na Norma 2030.",
            icon: <Leaf className="w-8 h-8 text-emerald-500" />,
            mode: AppMode.ENV_DIAGNOSTIC,
            color: "border-emerald-500",
            bg: "bg-emerald-50/50"
        },
        {
            title: "Diagnóstico Governança",
            subtitle: "ABNT PR 2030 (G)",
            desc: "Estrutura de compliance, transparência e gestão de riscos corporativos.",
            icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
            mode: AppMode.GOV_ESG_DIAGNOSTIC,
            color: "border-indigo-500",
            bg: "bg-indigo-50/50"
        }
    ];

    return (
        <Box className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <Typography variant="h4" className="font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                    <ClipboardCheck className="w-10 h-10 text-happiness-1" />
                    Central de Diagnósticos ESG
                </Typography>
                <Typography className="text-gray-500 font-medium italic">
                    Selecione o módulo de levantamento de dados ou autoavaliação para iniciar.
                </Typography>
            </header>

            {/* Grid of Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((m, idx) => (
                    <Card
                        key={idx}
                        className={`h-full rounded-sm border-t-4 ${m.color} border-x-0 border-b-0 shadow-sm hover:shadow-xl transition-all group cursor-pointer dark:bg-[#1C1C1C] flex flex-col`}
                        onClick={() => onSelectMode(m.mode)}
                    >
                        <CardContent className="p-8 flex flex-col flex-1">
                            <div className={`w-16 h-16 ${m.bg} rounded-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {m.icon}
                            </div>

                            <Typography className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                {m.subtitle}
                            </Typography>
                            <Typography variant="h5" className="font-black text-gray-900 dark:text-white tracking-tight mb-4">
                                {m.title}
                            </Typography>
                            <Typography className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                                {m.desc}
                            </Typography>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                                <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-1 group-hover:text-happiness-1 transition-colors">
                                    Entrar no Módulo <ArrowUpRight className="w-3 h-3" />
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform group-hover:text-happiness-1" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info Box */}
            <Box className="bg-gray-900 dark:bg-white p-8 rounded-sm text-white dark:text-black flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                <div>
                    <Typography variant="h6" className="font-black tracking-tight mb-1">Consolidação de Dados 2026</Typography>
                    <Typography className="text-xs opacity-70 font-medium uppercase tracking-widest">Os resultados alimentam automaticamente o Dashboard Estratégico.</Typography>
                </div>
                <Button
                    className="bg-happiness-1 text-white font-black text-xs px-8 py-3 rounded-sm uppercase tracking-widest shadow-lg shadow-happiness-1/20 transition-all hover:scale-105"
                >
                    Visualizar Report Consolidado
                </Button>
            </Box>
        </Box>
    );
};

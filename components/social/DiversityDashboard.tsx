import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    Scale,
    TrendingUp,
    AlertTriangle,
    Filter,
    Download,
    Shield,
    Briefcase,
    Accessibility,
    BarChart3,
    Loader2
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

// --- Types ---
type JobLevel = 'Board' | 'Executive' | 'Management' | 'Specialist' | 'Operational';
type Gender = 'Man' | 'Woman' | 'Non-binary' | 'Prefer not to say';
type Race = 'Branco' | 'Preto' | 'Pardo' | 'Amarelo' | 'Indígena';

interface Employee {
    id: string;
    department: string;
    level: JobLevel;
    gender: Gender;
    race: Race;
    is_pcd: boolean;
    salary_band?: number;
}

const FunnelRow = ({ label, employees, active }: { label: string, employees: Employee[], active?: boolean }) => {
    const total = employees.length || 1;
    const wPct = (employees.filter(e => e.gender === 'Woman').length / total) * 100;
    const bPct = (employees.filter(e => ['Preto', 'Pardo'].includes(e.race)).length / total) * 100;

    return (
        <div className={`
            p-6 rounded-[20px] bg-gray-50 dark:bg-zinc-900/30 border transition-all duration-300
            ${active
                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-500'
                : 'border-transparent hover:border-blue-200 dark:hover:border-blue-900/30'
            }
        `}>
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
                <span className="text-xs font-black text-gray-900 dark:text-gray-100">N = {employees.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Feminino</span>
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400">{wPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${wPct}%` }} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Preto/Pardo</span>
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400">{bPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${bPct}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const WageGapMonitor = ({ label, gap }: { label: string, gap: number }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-gray-700 dark:text-gray-300">{label}</span>
            <span className={`text-xs font-black ${gap > 5 ? 'text-red-500' : 'text-green-500'}`}>{gap.toFixed(1)}%</span>
        </div>
        <div className="h-1 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-500 ${gap > 5 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(gap * 5, 100)}%` }}
            />
        </div>
    </div>
);

export const DiversityDashboard: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState<string>('All');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.from('employee_diversity').select('*');
            if (error) throw error;
            if (data) setEmployees(data as Employee[]);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return employees.filter(e => {
            if (selectedDept !== 'All' && e.department !== selectedDept) return false;
            if (selectedLevel !== 'All' && e.level !== selectedLevel) return false;
            return true;
        });
    }, [employees, selectedDept, selectedLevel]);

    const departments = useMemo(() => {
        return Array.from(new Set(employees.map(e => e.department)));
    }, [employees]);

    const pcdPercentage = (employees.filter(e => e.is_pcd).length / (employees.length || 1)) * 100;

    const calculateWageGap = (levelName: JobLevel) => {
        const inLevel = filteredData.filter(e => e.level === levelName);
        const men = inLevel.filter(e => e.gender === 'Man');
        const women = inLevel.filter(e => e.gender === 'Woman');
        if (men.length === 0 || women.length === 0) return 0;
        const avgM = men.reduce((a, b) => a + (b.salary_band || 0), 0) / men.length;
        const avgW = women.reduce((a, b) => a + (b.salary_band || 0), 0) / women.length;
        return ((avgM - avgW) / avgM) * 100;
    };

    const wageGaps = {
        'Executive': calculateWageGap('Executive'),
        'Management': calculateWageGap('Management'),
        'Specialist': calculateWageGap('Specialist'),
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center py-20 gap-4 text-center">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Sincronizando Dados DE&I...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-1">
                        <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/10 text-purple-600 rounded-2xl flex items-center justify-center">
                            <Accessibility size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Diversidade e Inclusão</h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[10px] font-black uppercase text-gray-600 dark:text-gray-300">GRI 405</span>
                                <span className="text-xs font-bold text-gray-500">Conformidade EMAP 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-3 py-1.5 border border-purple-200 dark:border-purple-900/30 text-purple-700 dark:text-purple-300 font-black text-xs uppercase rounded-xl flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/10">
                    <Shield size={14} />
                    K-Anonymity ATIVA
                </div>
            </div>

            {/* Toolbar */}
            <div className="p-4 rounded-[24px] bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-white/5 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 mr-4 text-gray-500">
                    <Filter className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Filtros de Visão</span>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="All">Todos Departamentos</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="All">Todos Níveis</option>
                        {['Board', 'Executive', 'Management', 'Specialist', 'Operational'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 ml-auto">
                    <Download size={14} />
                    Exportar DE&I
                </button>
            </div>

            {/* Critical Alert */}
            {Object.values(wageGaps).some(g => g > 5) && (
                <div className="p-6 rounded-[24px] bg-red-50 dark:bg-red-900/10 border-l-[6px] border-red-500 flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wide">Disparidade Salarial Crítica Detectada</h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                            Identificamos lacunas superiores a 5% em cargos estratégicos. Recomenda-se revisão imediata conforme Volume III ESG.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* REPRESENTATION FUNNEL */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all h-full">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-lg font-black flex items-center gap-2">
                                    <Scale className="text-blue-500 w-5 h-5" /> Funil de Ocupação
                                </h2>
                                <p className="text-xs font-bold text-gray-500 mt-1">Representatividade por estrato hierárquico</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FunnelRow label="Conselho & Executivo" employees={filteredData.filter(e => ['Executive', 'Board'].includes(e.level))} />
                            <FunnelRow label="Gerência & Gestão" employees={filteredData.filter(e => e.level === 'Management')} active />
                            <FunnelRow label="Corpo Operacional" employees={filteredData.filter(e => e.level === 'Operational')} />
                        </div>
                    </div>
                </div>

                {/* KEY PERFORMANCE INDICATORS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-purple-50/30 dark:bg-purple-900/5 rounded-[32px] p-8 border border-purple-100 dark:border-purple-900/20 text-center relative overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Conformidade PCD</span>

                        <div className="relative py-8 flex justify-center">
                            {/* Custom Circular Progress */}
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-gray-200 dark:text-white/5"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * (pcdPercentage * 20)) / 100} // Scaling for visual (assuming 5% is target)
                                        className={pcdPercentage >= 5 ? 'text-green-500' : 'text-red-500'}
                                    />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                    <span className="text-3xl font-black block">{pcdPercentage.toFixed(1)}%</span>
                                    <span className={`text-[9px] font-black uppercase ${pcdPercentage >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                                        {pcdPercentage >= 5 ? 'Em Conformidade' : 'Abaixo da Cota'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-400 italic">Meta Lei 8.213: 5.0%</p>
                    </div>

                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                        <h2 className="text-sm font-black flex items-center gap-2 mb-6">
                            <BarChart3 className="text-blue-500 w-5 h-5" /> Monitor de Equidade
                        </h2>
                        <div className="space-y-6">
                            <WageGapMonitor label="Executivo" gap={wageGaps.Executive} />
                            <WageGapMonitor label="Gestão" gap={wageGaps.Management} />
                            <WageGapMonitor label="Especialista" gap={wageGaps.Specialist} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiversityDashboard;

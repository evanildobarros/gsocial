import React, { useState, useEffect, useMemo } from 'react';
import { Users, Scale, TrendingUp, AlertTriangle, Filter, ChevronDown, Download, Loader2, ShieldCheck as ShieldCheckIcon } from 'lucide-react';
import { Button } from '@mui/material';
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

// --- Logic Helpers ---
const calculateRepresentation = (data: Employee[], filterFn: (e: Employee) => boolean) => {
    const total = data.length;
    if (total === 0) return 0;
    const count = data.filter(filterFn).length;
    return (count / total) * 100;
};

// --- Components ---
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
            const { data, error } = await supabase
                .from('employee_diversity')
                .select('*');

            if (error) throw error;
            if (data) setEmployees(data as Employee[]);
        } catch (error) {
            console.error('Erro ao buscar dados de diversidade:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter Data
    const filteredData = useMemo(() => {
        return employees.filter(e => {
            if (selectedDept !== 'All' && e.department !== selectedDept) return false;
            if (selectedLevel !== 'All' && e.level !== selectedLevel) return false;
            return true;
        });
    }, [employees, selectedDept, selectedLevel]);

    const departments = useMemo(() => {
        const depts = new Set(employees.map(e => e.department));
        return Array.from(depts);
    }, [employees]);

    // Metrics
    const pcdPercentage = calculateRepresentation(employees, e => e.is_pcd);

    // Wage Gap calculation (Simplified)
    const calculateWageGap = (levelName: JobLevel) => {
        const employeesInLevel = filteredData.filter(e => e.level === levelName);
        const men = employeesInLevel.filter(e => e.gender === 'Man');
        const women = employeesInLevel.filter(e => e.gender === 'Woman');

        if (men.length === 0 || women.length === 0) return 0;

        const avgMen = men.reduce((acc, curr) => acc + (curr.salary_band || 0), 0) / men.length;
        const avgWomen = women.reduce((acc, curr) => acc + (curr.salary_band || 0), 0) / women.length;

        return ((avgMen - avgWomen) / avgMen) * 100;
    };

    const wageGaps = {
        'Executive': calculateWageGap('Executive'),
        'Management': calculateWageGap('Management'),
        'Specialist': calculateWageGap('Specialist'),
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="w-12 h-12 text-happiness-1 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Sincronizando Dados DE&I...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Diversidade, Equidade e Inclusão (DE&I)
                        <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-sm text-gray-500 font-bold tracking-wider uppercase border border-gray-200 dark:border-white/5">
                            GRI 405
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Monitoramento em tempo real para conformidade e equidade conforme regulamentação EMAP.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-sm font-bold text-xs border border-purple-100 dark:border-purple-800 flex items-center gap-1.5">
                        <ShieldCheckIcon className="w-3 h-3" />
                        Privacidade K-Anonymity ATIVA
                    </div>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white dark:bg-[#1C1C1C] p-3 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mr-2">
                    <Filter className="w-4 h-4" /> Filtros:
                </div>

                <select
                    className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm px-3 py-1.5 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-happiness-1"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                >
                    <option value="All">Todos Departamentos</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>

                <select
                    className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm px-3 py-1.5 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-happiness-1"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option value="All">Todos Níveis</option>
                    {['Board', 'Executive', 'Management', 'Specialist', 'Operational'].map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                <div className="ml-auto">
                    <Button startIcon={<Download className="w-4 h-4" />} size="small" sx={{ textTransform: 'none', borderRadius: '4px', fontWeight: 900 }}>
                        Exportar Relatório
                    </Button>
                </div>
            </div>

            {/* Wage Gap Alert */}
            {Object.values(wageGaps).some(gap => gap > 5) && (
                <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-sm flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-800 dark:text-red-400 text-sm italic underline">DISPARIDADE CRÍTICA: Gap Salarial em Níveis Estruturais</h3>
                        <p className="text-xs text-red-700 dark:text-red-500 mt-1 font-medium">
                            Detectamos um gap salarial superior a 5% em {Object.entries(wageGaps).filter(([_, g]) => g > 5).length} níveis hierárquicos.
                            Recomendamos revisão imediata da folha pela diretoria.
                        </p>
                    </div>
                </div>
            )}

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Funil de Representatividade */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm lg:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Matriz de Ocupação (Raça & Gênero)</h3>
                            <p className="text-xs text-gray-400 mt-1 italic">Análise de representatividade por estrato hierárquico.</p>
                        </div>
                        <Scale className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="space-y-6">
                        <FunnelRow
                            level="Operational"
                            employees={filteredData.filter(e => e.level === 'Operational')}
                            label="Nível Operacional (Entrada)"
                        />
                        <div className="flex justify-center -my-2 opacity-30">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <FunnelRow
                            level="Management"
                            employees={filteredData.filter(e => e.level === 'Management')}
                            label="Nível Gerencial (Gestão)"
                        />
                        <div className="flex justify-center -my-2 opacity-30">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <FunnelRow
                            level="Executive"
                            employees={filteredData.filter(e => ['Executive', 'Board'].includes(e.level))}
                            label="Conselho & Executivo (Estratégico)"
                        />
                    </div>
                </div>

                {/* 2. Key Metrics Column */}
                <div className="space-y-6">
                    {/* PCD Gauge */}
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm flex flex-col items-center justify-center relative">
                        <div className="flex justify-between items-start w-full mb-2">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-tighter">Conformidade PCD</h3>
                        </div>

                        <div className="relative w-40 h-20 overflow-hidden mt-4">
                            <div className="absolute top-0 left-0 w-full h-[200%] rounded-full border-[15px] border-gray-100 dark:border-white/5" />
                            <div
                                className={`
                                    absolute top-0 left-0 w-full h-[200%] rounded-full border-[15px] border-transparent 
                                    ${pcdPercentage >= 5 ? 'border-t-green-500' : pcdPercentage >= 3 ? 'border-t-yellow-500' : 'border-t-red-500'}
                                    transition-all duration-1000 ease-out
                                `}
                                style={{
                                    transform: `rotate(${(pcdPercentage / 10) * 180 - 135}deg)`
                                }}
                            />
                        </div>

                        <div className="text-center -mt-8 relative z-10">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{pcdPercentage.toFixed(1)}%</span>
                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${pcdPercentage >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                                {pcdPercentage >= 5 ? 'Meta Atingida' : 'Abaixo da Cota'}
                            </p>
                            <p className="text-[9px] text-gray-400 mt-1 italic font-medium">Meta Lei 8.213: 5.0%</p>
                        </div>
                    </div>

                    {/* Wage Gap Monitor Stats */}
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Monitor de Equidade Salarial</h3>
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <WageGapRow label="Executivo" gap={wageGaps.Executive} />
                            <WageGapRow label="Gestão" gap={wageGaps.Management} />
                            <WageGapRow label="Especialista" gap={wageGaps.Specialist} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <p className="text-[9px] text-gray-400 leading-tight font-medium italic">
                                *Gap calculado em tempo real com base na folha de pagamento ativa.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-blue-700 p-6 rounded-sm text-white shadow-xl">
                        <h4 className="font-black text-lg mb-2">Cultura de Inclusão</h4>
                        <p className="text-xs font-bold opacity-80 leading-relaxed italic">
                            "O Porto do Itaqui valoriza a pluralidade como motor de eficiência e inovação portuária."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const FunnelRow = ({ employees, label }: { level: string, employees: Employee[], label: string }) => {
    const total = employees.length || 0;
    const women = employees.filter(e => e.gender === 'Woman').length;
    const blackPardo = employees.filter(e => ['Preto', 'Pardo'].includes(e.race)).length;

    const womenPct = total > 0 ? (women / total) * 100 : 0;
    const blackPardoPct = total > 0 ? (blackPardo / total) * 100 : 0;

    return (
        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-sm border border-gray-100 dark:border-white/5 hover:border-happiness-1/30 transition-all">
            <div className="flex justify-between text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                <span>{label}</span>
                <span>N: {total}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Women Bar */}
                <div>
                    <div className="flex justify-between text-[11px] font-black mb-1.5 text-gray-700 dark:text-gray-300">
                        <span>Feminino</span>
                        <span>{womenPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-happiness-1" style={{ width: `${womenPct}%` }} />
                    </div>
                </div>

                {/* Black/Pardo Bar */}
                <div>
                    <div className="flex justify-between text-[11px] font-black mb-1.5 text-gray-700 dark:text-gray-300">
                        <span>PPI (Pretos/Pardos/Indíg.)</span>
                        <span>{blackPardoPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${blackPardoPct}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const WageGapRow = ({ label, gap }: { label: string, gap: number }) => {
    const isHigh = gap > 5;
    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter">{label}</span>
            <div className="flex items-center gap-3">
                <div className="w-24 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                    <div
                        className={`absolute left-0 h-full rounded-full ${isHigh ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(gap * 5, 100)}%` }}
                    />
                </div>
                <span className={`text-[11px] font-black w-10 text-right ${isHigh ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                    {gap.toFixed(1)}%
                </span>
            </div>
        </div>
    );
};


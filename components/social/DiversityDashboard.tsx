import React, { useState, useMemo } from 'react';
import { Users, Scale, TrendingUp, AlertTriangle, Filter, ChevronDown, Download } from 'lucide-react';
import { Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

// --- Types & Mock Data ---

type JobLevel = 'Board' | 'Executive' | 'Management' | 'Specialist' | 'Operational';
type Gender = 'Man' | 'Woman' | 'Non-binary' | 'Prefer not to say';
type Race = 'Branco' | 'Preto' | 'Pardo' | 'Amarelo' | 'Indígena';

interface Employee {
    id: string;
    department: string;
    job_level: JobLevel;
    gender_identity: Gender;
    race_ethnicity: Race;
    is_pcd: boolean;
    salary_band?: number; // Confidential
}

// Mock Data Generator
const generateMockData = (): Employee[] => {
    const data: Employee[] = [];
    const departments = ['Operations', 'HR', 'Finance', 'Engineering', 'Legal'];
    const levels: JobLevel[] = ['Operational', 'Specialist', 'Management', 'Executive', 'Board'];

    // Weighted distribution to simulate real-world bias (glass ceiling)
    for (let i = 0; i < 200; i++) {
        const levelWeight = Math.random();
        let level: JobLevel = 'Operational';
        if (levelWeight > 0.95) level = 'Board';
        else if (levelWeight > 0.90) level = 'Executive';
        else if (levelWeight > 0.75) level = 'Management';
        else if (levelWeight > 0.50) level = 'Specialist';

        // Gender bias simulation
        let gender: Gender = Math.random() > 0.6 ? 'Woman' : 'Man';
        if (level === 'Board' || level === 'Executive') {
            // Lower probability of women in top leadership for demo purposes
            gender = Math.random() > 0.8 ? 'Woman' : 'Man';
        }

        // Race bias simulation
        let race: Race = 'Branco';
        const raceRoll = Math.random();
        if (raceRoll > 0.6) race = 'Pardo';
        else if (raceRoll > 0.45) race = 'Preto';
        else if (raceRoll > 0.40) race = 'Amarelo';
        else if (raceRoll > 0.38) race = 'Indígena';

        // Executive whitening simulation
        if ((level === 'Board' || level === 'Executive') && Math.random() > 0.3) {
            race = 'Branco';
        }

        data.push({
            id: `EMP-${i}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            job_level: level,
            gender_identity: gender,
            race_ethnicity: race,
            is_pcd: Math.random() > 0.95, // ~5% PCD
            salary_band: 2000 * (levels.indexOf(level) + 1) + (gender === 'Man' ? 500 : 0) // Wage gap simulation
        });
    }
    return data;
};

const mockData = generateMockData();

// --- Logic Helpers ---

const calculateRepresentation = (data: Employee[], filterFn: (e: Employee) => boolean) => {
    const total = data.length;
    if (total === 0) return 0;
    const count = data.filter(filterFn).length;
    return (count / total) * 100;
};

// --- Components ---

export const DiversityDashboard: React.FC = () => {
    const [selectedDept, setSelectedDept] = useState<string>('All');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');

    // Filter Data
    const filteredData = useMemo(() => {
        return mockData.filter(e => {
            if (selectedDept !== 'All' && e.department !== selectedDept) return false;
            if (selectedLevel !== 'All' && e.job_level !== selectedLevel) return false;
            return true;
        });
    }, [selectedDept, selectedLevel]);

    // Metrics
    const womenLeadership = calculateRepresentation(
        mockData.filter(e => ['Board', 'Executive', 'Management'].includes(e.job_level)),
        e => e.gender_identity === 'Woman'
    );

    const pcdPercentage = calculateRepresentation(mockData, e => e.is_pcd);

    // Wage Gap by Level (Simplified)
    const calculateWageGap = (level: JobLevel) => {
        const employeesInLevel = filteredData.filter(e => e.job_level === level);
        const men = employeesInLevel.filter(e => e.gender_identity === 'Man');
        const women = employeesInLevel.filter(e => e.gender_identity === 'Woman');

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
                    <p className="text-sm text-gray-500 mt-1">Monitoramento em tempo real para conformidade e equidade.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-sm font-bold text-xs border border-purple-100 dark:border-purple-800 flex items-center gap-1.5">
                        <ShieldCheckIcon className="w-3 h-3" />
                        K-Anonymity Active
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
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Engineering">Engineering</option>
                </select>

                <select
                    className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm px-3 py-1.5 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-happiness-1"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option value="All">Todos Níveis</option>
                    <option value="Board">Board</option>
                    <option value="Executive">Executive</option>
                    <option value="Management">Management</option>
                    <option value="Operational">Operational</option>
                </select>

                <div className="ml-auto">
                    <Button startIcon={<Download className="w-4 h-4" />} size="small" sx={{ textTransform: 'none', borderRadius: '4px' }}>
                        Exportar Relatório
                    </Button>
                </div>
            </div>

            {/* Wage Gap Alert */}
            {Object.values(wageGaps).some(gap => gap > 5) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 p-4 rounded-r-sm flex items-start gap-4 animate-pulse">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                    <div>
                        <h3 className="font-bold text-yellow-800 dark:text-yellow-400 text-sm">Alerta Crítico: Desigualdade Salarial Detectada</h3>
                        <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                            Foi detectado um gap salarial superior a 5% em {Object.entries(wageGaps).filter(([_, g]) => g > 5).length} níveis hierárquicos.
                            Isso viola a política interna e a Lei de Igualdade Salarial.
                        </p>
                    </div>
                </div>
            )}

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Funil de Representatividade (Representation Funnel) */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm lg:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Funil de Representatividade (Raça & Gênero)</h3>
                            <p className="text-xs text-gray-400 mt-1">Comparativo Entrada vs. Liderança para detectar "glass ceilings".</p>
                        </div>
                        <Scale className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="space-y-6">
                        {/* Comparison Rows */}
                        <FunnelRow
                            level="Operational"
                            data={filteredData.filter(e => e.job_level === 'Operational')}
                            label="Nível Operacional (Entrada)"
                        />
                        <div className="flex justify-center -my-2 opacity-30">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <FunnelRow
                            level="Management"
                            data={filteredData.filter(e => e.job_level === 'Management')}
                            label="Nível Gerencial (Meio)"
                        />
                        <div className="flex justify-center -my-2 opacity-30">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <FunnelRow
                            level="Executive"
                            data={filteredData.filter(e => ['Executive', 'Board'].includes(e.job_level))}
                            label="Alta Liderança (Topo)"
                        />
                    </div>
                </div>

                {/* 2. Key Metrics Column */}
                <div className="space-y-6">
                    {/* PCD Gauge */}
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm flex flex-col items-center justify-center relative">
                        <div className="flex justify-between items-start w-full mb-2">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Cota Legal PCD</h3>
                        </div>

                        <div className="relative w-40 h-20 overflow-hidden mt-4">
                            <div className="absolute top-0 left-0 w-full h-[200%] rounded-full border-[20px] border-gray-100 dark:border-white/5" />
                            <div
                                className={`
                                    absolute top-0 left-0 w-full h-[200%] rounded-full border-[20px] border-transparent 
                                    ${pcdPercentage >= 5 ? 'border-t-green-500' : pcdPercentage >= 3 ? 'border-t-yellow-500' : 'border-t-red-500'}
                                    transition-all duration-1000 ease-out
                                `}
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                                    transform: `rotate(${Math.min(180, (pcdPercentage / 10) * 180) - 135}deg)` // Simplified mock rotation logic not exact but visual
                                }}
                            />
                            {/* CSS-only semi-circle gauge hack adjustment */}
                            <div className="absolute top-0 left-0 w-full h-[200%] rounded-full border-[20px] border-t-green-500 border-r-transparent border-b-transparent border-l-transparent"
                                style={{ transform: `rotate(${(pcdPercentage / 8) * 180 - 45}deg)` }} />
                        </div>

                        <div className="text-center -mt-8 relative z-10">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{pcdPercentage.toFixed(1)}%</span>
                            <p className={`text-xs font-bold ${pcdPercentage >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                                {pcdPercentage >= 5 ? 'Compliance' : 'Abaixo da Meta'}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">Target Legal: 5.0%</p>
                        </div>
                    </div>

                    {/* Wage Gap Monitor Stats */}
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Wage Gap Monitor</h3>
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <WageGapRow label="Executive" gap={wageGaps.Executive} />
                            <WageGapRow label="Management" gap={wageGaps.Management} />
                            <WageGapRow label="Specialist" gap={wageGaps.Specialist} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <p className="text-[10px] text-gray-400 leading-tight">
                                *Gap ajustado não contabiliza tempo de casa. Dados anonimizados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const ShieldCheckIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);

const FunnelRow = ({ level, data, label }: { level: string, data: Employee[], label: string }) => {
    const total = data.length || 1;
    const women = data.filter(e => e.gender_identity === 'Woman').length;
    const blackPardo = data.filter(e => ['Preto', 'Pardo'].includes(e.race_ethnicity)).length;

    const womenPct = (women / total) * 100;
    const blackPardoPct = (blackPardo / total) * 100;

    return (
        <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-sm border border-gray-200 dark:border-white/5">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                <span>{label}</span>
                <span>Total: {total}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Women Bar */}
                <div>
                    <div className="flex justify-between text-[10px] mb-1">
                        <span>Mulheres</span>
                        <span className="font-bold">{womenPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-happiness-1" style={{ width: `${womenPct}%` }} />
                    </div>
                </div>

                {/* Black/Pardo Bar */}
                <div>
                    <div className="flex justify-between text-[10px] mb-1">
                        <span>Negros (Pretos+Pardos)</span>
                        <span className="font-bold">{blackPardoPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
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
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</span>
            <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        className={`absolute left-0 h-full rounded-full ${isHigh ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(gap * 5, 100)}%` }} // Visual scale
                    />
                </div>
                <span className={`text-xs font-black w-8 text-right ${isHigh ? 'text-red-500' : 'text-green-500'}`}>
                    {gap.toFixed(1)}%
                </span>
            </div>
        </div>
    );
};

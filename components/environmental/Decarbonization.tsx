import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    Cloud,
    Download,
    Plus,
    TrendingDown,
    TrendingUp,
    Zap,
    DollarSign,
    Info,
    CheckCircle2,
    Save,
    Loader2,
    X
} from 'lucide-react';

interface EmissionRecord {
    id: string;
    period_month: number;
    period_year: number;
    fuel_consumption_liters: number;
    energy_consumption_kwh: number;
    cargo_handled_tons: number;
    total_co2e_kg: number;
    carbon_intensity: number;
    created_at: string;
}

export const Decarbonization: React.FC = () => {
    const [records, setRecords] = useState<EmissionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        fuel: 0,
        energy: 0,
        cargo: 0
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('emission_records')
                .select('*')
                .order('period_year', { ascending: false })
                .order('period_month', { ascending: false });

            if (error) throw error;
            if (data) setRecords(data as EmissionRecord[]);
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            toast.error('Erro ao carregar dados históricos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (formData.cargo <= 0) {
            toast.warning('A carga movimentada deve ser maior que zero.');
            return;
        }
        try {
            setIsSaving(true);
            const { error } = await supabase
                .from('emission_records')
                .upsert({
                    period_month: formData.month,
                    period_year: formData.year,
                    fuel_consumption_liters: formData.fuel,
                    energy_consumption_kwh: formData.energy,
                    cargo_handled_tons: formData.cargo
                }, { onConflict: 'period_month,period_year' });

            if (error) throw error;
            toast.success('Lançamento realizado com sucesso!');
            setIsModalOpen(false);
            fetchRecords();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao persistir dados.');
        } finally {
            setIsSaving(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFillColor(33, 72, 192);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('ESGporto - Climate Report', 14, 25);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);

        const tableData = records.map(rec => [
            `${rec.period_month}/${rec.period_year}`,
            rec.fuel_consumption_liters.toLocaleString('pt-BR'),
            rec.energy_consumption_kwh.toLocaleString('pt-BR'),
            rec.cargo_handled_tons.toLocaleString('pt-BR'),
            rec.carbon_intensity.toFixed(4)
        ]);

        (doc as any).autoTable({
            startY: 50,
            head: [['Período', 'Diesel (L)', 'Energia (kWh)', 'Carga (Ton)', 'Intensidade']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [33, 72, 192] }
        });

        doc.save(`Relatorio_Emissoes_${new Date().getTime()}.pdf`);
        toast.success('Relatório gerado!');
    };

    const latestRecord = records[0];
    const previousRecord = records[1];
    const intensityTrend = useMemo(() => {
        if (!latestRecord || !previousRecord) return 0;
        return ((latestRecord.carbon_intensity - previousRecord.carbon_intensity) / previousRecord.carbon_intensity) * 100;
    }, [latestRecord, previousRecord]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center py-20 gap-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">
                    Sincronizando Inventário de Carbono...
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Cloud className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            Clima & Descarbonização
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium italic ml-16 max-w-2xl">
                        Monitoramento de emissões de Escopo 1 e 2 (Protocolo GHG). Acompanhe a intensidade de carbono por tonelada movimentada.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={generatePDF}
                        className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-white/10 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Download className="w-4 h-4" /> Relatório PDF
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Lançar Dados
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left side: Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="relative p-8 rounded-[32px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 shadow-sm group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-4 -right-4 text-gray-100 dark:text-white/5 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <TrendingDown size={140} strokeWidth={1} />
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Intensidade de Carbono
                        </span>

                        <div className="flex items-baseline gap-2 mt-4 mb-2 relative z-10">
                            <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {latestRecord?.carbon_intensity.toFixed(4) || "0.0000"}
                            </span>
                            <span className="text-xs font-bold text-gray-500">kgCO2e / Ton</span>
                        </div>

                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${intensityTrend <= 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                            }`}>
                            {intensityTrend <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                            {Math.abs(intensityTrend).toFixed(1)}% vs. anterior
                        </div>
                    </div>

                    <div className="p-8 rounded-[32px] border border-gray-200 dark:border-white/5 bg-white dark:bg-zinc-900">
                        <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white mb-6">
                            Quebra de Emissões (kgCO2e)
                        </h3>
                        <div className="space-y-6">
                            <EmissionStat
                                label="Diesel (Escopo 1)"
                                value={(latestRecord?.fuel_consumption_liters || 0) * 2.68}
                                color="bg-primary"
                                textColor="text-primary"
                                icon={<DollarSign className="w-4 h-4" />}
                            />
                            <EmissionStat
                                label="Energia (Escopo 2)"
                                value={(latestRecord?.energy_consumption_kwh || 0) * 0.08}
                                color="bg-amber-500"
                                textColor="text-amber-500"
                                icon={<Zap className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                </div>

                {/* Right side: Charts & Projects */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="p-8 rounded-[32px] border border-gray-200 dark:border-white/5 bg-white dark:bg-zinc-900 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Desempenho Climático Histórico</h3>
                            <div className="px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-500/20 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Net Zero 2050</span>
                            </div>
                        </div>

                        <div className="flex-1 flex items-end gap-2 px-2 h-[260px] min-h-[260px] relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                                <div className="w-full h-px bg-black dark:bg-white"></div>
                                <div className="w-full h-px bg-black dark:bg-white"></div>
                                <div className="w-full h-px bg-black dark:bg-white"></div>
                                <div className="w-full h-px bg-black dark:bg-white"></div>
                                <div className="w-full h-px bg-black dark:bg-white"></div>
                            </div>

                            {records.slice(0, 10).reverse().map((rec) => {
                                const maxVal = Math.max(...records.map(r => r.carbon_intensity));
                                const height = rec.carbon_intensity > 0 ? (rec.carbon_intensity / maxVal) * 100 : 0;
                                return (
                                    <div key={rec.id} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                                        <div className="relative w-full flex items-end justify-center h-full">
                                            <div
                                                className="w-full bg-emerald-500/10 dark:bg-emerald-500/20 rounded-t-lg transition-all duration-300 group-hover:bg-emerald-500/30 cursor-pointer relative"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                                    {rec.carbon_intensity.toFixed(4)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                                            {rec.period_month}/{rec.period_year.toString().slice(-2)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-emerald-600 to-emerald-500 overflow-hidden text-white shadow-xl shadow-emerald-500/20">
                        <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12">
                            <Zap size={240} />
                        </div>
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-2xl font-black mb-2">Transição Energética</h3>
                            <p className="text-emerald-50 font-medium leading-relaxed mb-6 opacity-90">
                                A eletrificação de guindastes RTG pode reduzir as emissões em até 1.200 toneladas de CO2e/ano.
                            </p>
                            <button className="px-6 py-3 rounded-full bg-white text-emerald-700 font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-lg">
                                Ver Viabilidade Econômica
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Lançamento */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Lançamento de Inventário</h3>
                            <button onClick={() => !isSaving && setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Insira os dados de consumo para o cálculo automático das emissões de CO2 equivalente.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mês</label>
                                    <input
                                        type="number"
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ano</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Diesel (Litros)</label>
                                    <input
                                        type="number"
                                        value={formData.fuel}
                                        onChange={(e) => setFormData({ ...formData, fuel: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Energia (kWh)</label>
                                    <input
                                        type="number"
                                        value={formData.energy}
                                        onChange={(e) => setFormData({ ...formData, energy: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Carga (Toneladas)</label>
                                    <input
                                        type="number"
                                        value={formData.cargo}
                                        onChange={(e) => setFormData({ ...formData, cargo: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? 'Salvando...' : 'Salvar Dados'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EmissionStat = ({ label, value, color, textColor, icon }: { label: string, value: number, color: string, textColor: string, icon: React.ReactNode }) => {
    const percentage = Math.min(100, (value / 5000) * 100);
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <div className={`${textColor}`}>{icon}</div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{label}</span>
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-white">{value.toLocaleString('pt-BR')} kg</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

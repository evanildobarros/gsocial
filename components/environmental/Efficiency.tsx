import React, { useState, useEffect } from 'react';
import { Droplets, Target, Zap, History, Download, Save, Loader2, X, Percent } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface EfficiencyRecord {
    id: string;
    period_month: number;
    period_year: number;
    water_consumption_m3: number;
    energy_consumption_kwh: number;
    operation_hours: number;
    renewable_energy_percentage: number;
    water_intensity: number;
    energy_intensity: number;
    created_at: string;
}

export const Efficiency: React.FC = () => {
    const [records, setRecords] = useState<EfficiencyRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        water: 0,
        energy: 0,
        hours: 1,
        renewable: 0
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('resource_efficiency_records')
                .select('*')
                .order('period_year', { ascending: false })
                .order('period_month', { ascending: false });

            if (error) throw error;
            if (data) setRecords(data as EfficiencyRecord[]);
        } catch (error) {
            console.error('Erro ao buscar eficiência:', error);
            toast.error('Erro ao carregar dados de recursos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (formData.hours <= 0) {
            toast.warning('Horas de operação devem ser maiores que zero.');
            return;
        }

        try {
            setIsSaving(true);
            const { error } = await supabase
                .from('resource_efficiency_records')
                .upsert({
                    period_month: formData.month,
                    period_year: formData.year,
                    water_consumption_m3: formData.water,
                    energy_consumption_kwh: formData.energy,
                    operation_hours: formData.hours,
                    renewable_energy_percentage: formData.renewable
                }, { onConflict: 'period_month,period_year' });

            if (error) throw error;

            toast.success('Dados de eficiência salvos!');
            setIsModalOpen(false);
            fetchRecords();
        } catch (error: any) {
            console.error('Erro ao salvar eficiência:', error);
            toast.error(error.message || 'Erro ao persistir dados.');
        } finally {
            setIsSaving(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(28, 28, 28); // Dark #1C1C1C
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('ESGporto - Resource Efficiency', 14, 25);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);

        // Body
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text('Relatório de Consumo de Recursos Naturais', 14, 55);

        const tableData = records.map(rec => [
            `${rec.period_month}/${rec.period_year}`,
            rec.water_consumption_m3.toLocaleString('pt-BR'),
            rec.energy_consumption_kwh.toLocaleString('pt-BR'),
            rec.operation_hours,
            `${rec.renewable_energy_percentage}%`,
            rec.water_intensity.toFixed(2)
        ]);

        (doc as any).autoTable({
            startY: 70,
            head: [['Período', 'Água (m³)', 'Energia (kWh)', 'Horas', 'Renovável', 'Intensidade Híd.']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [28, 28, 28] }
        });

        doc.save(`Eficiencia_ESGporto_${new Date().getTime()}.pdf`);
        toast.success('Relatório de eficiência gerado!');
    };

    const latest = records[0];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Sincronizando Medição de Recursos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">Eficiência de Recursos</h2>
                    <p className="text-gray-500 font-medium italic">Gestão hídrica e energética para operações portuárias sustentáveis.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={generatePDF}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 font-black text-[11px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> EXPORTAR
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-[#1C1C1C] hover:bg-[#333] text-white font-black text-[11px] transition-colors flex items-center gap-2"
                    >
                        <History className="w-4 h-4" /> LANÇAR MEDIÇÃO
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Real KPIs */}
                <EfficiencyCard
                    label="Intensidade Hídrica"
                    value={latest?.water_intensity.toFixed(2) || "0.00"}
                    unit="m³/h"
                    icon={Droplets}
                    color="text-cyan-500"
                    bg="bg-cyan-50 dark:bg-cyan-900/10"
                />
                <EfficiencyCard
                    label="Intensidade Energética"
                    value={latest?.energy_intensity.toFixed(2) || "0.00"}
                    unit="kWh/h"
                    icon={Zap}
                    color="text-yellow-500"
                    bg="bg-yellow-50 dark:bg-yellow-900/10"
                />
                <EfficiencyCard
                    label="Energia Renovável"
                    value={latest?.renewable_energy_percentage.toString() || "0"}
                    unit="%"
                    icon={Percent}
                    color="text-green-500"
                    bg="bg-green-50 dark:bg-green-900/10"
                />

                <div className="bg-[#1C1C1C] p-8 rounded-lg text-white relative overflow-hidden group">
                    <Target className="absolute -right-4 -top-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform" />
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Meta de Redução</h4>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-black tracking-tighter">15%</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400">vs 2025</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-happiness-1 w-[68%]" />
                    </div>
                    <p className="text-[10px] mt-2 font-bold text-gray-400">68% do objetivo atingido</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* History Table */}
                <div className="lg:col-span-3 bg-white dark:bg-[#1C1C1C] rounded-lg border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-black uppercase tracking-tighter dark:text-gray-300">Histórico de Consumo</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5">
                                    <th className="px-8 py-4">Período</th>
                                    <th className="px-8 py-4">Água (m³)</th>
                                    <th className="px-8 py-4">Energia (kWh)</th>
                                    <th className="px-8 py-4">Horas Oper.</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {records.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-4 font-black italic text-sm text-gray-900 dark:text-white">
                                            {rec.period_month}/{rec.period_year}
                                        </td>
                                        <td className="px-8 py-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                                            {rec.water_consumption_m3.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-8 py-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                                            {rec.energy_consumption_kwh.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-8 py-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                                            {rec.operation_hours}h
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase text-green-600">Auditado</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Medição */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Lançar Medição</h3>
                            <button onClick={() => !isSaving && setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mês</label>
                                    <input
                                        type="number"
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ano</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Água (m³)</label>
                                <input
                                    type="number"
                                    value={formData.water}
                                    onChange={(e) => setFormData({ ...formData, water: Number(e.target.value) })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Energia (kWh)</label>
                                <input
                                    type="number"
                                    value={formData.energy}
                                    onChange={(e) => setFormData({ ...formData, energy: Number(e.target.value) })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Horas Oper.</label>
                                <input
                                    type="number"
                                    value={formData.hours}
                                    onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                                    <span>Energia Renovável</span>
                                    <span className="text-green-600">{formData.renewable}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.renewable}
                                    onChange={(e) => setFormData({ ...formData, renewable: Number(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full mt-2 py-3 bg-[#1C1C1C] hover:bg-black text-white rounded-lg font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'SALVANDO...' : 'REGISTRAR'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EfficiencyCard = ({ label, value, unit, icon: Icon, color, bg }: any) => (
    <div className={`${bg} p-8 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all group`}>
        <div className={`w-10 h-10 rounded-lg ${bg} border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
            <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</h4>
            <span className="text-[10px] font-bold text-gray-400">{unit}</span>
        </div>
    </div>
);


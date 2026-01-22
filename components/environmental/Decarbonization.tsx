import React, { useState, useEffect, useMemo } from 'react';
import { Leaf, Zap, BarChart3, Calculator, TrendingDown, Info, AlertTriangle, Loader2, Save, History, TrendingUp, Download } from 'lucide-react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

    // Form State
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
            console.error('Erro ao buscar registros de emissões:', error);
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

            toast.success('Registro de emissões salvo com sucesso!');
            setIsModalOpen(false);
            fetchRecords();
        } catch (error: any) {
            console.error('Erro ao salvar emissões:', error);
            toast.error(error.message || 'Erro ao persistir dados.');
        } finally {
            setIsSaving(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(33, 72, 192); // #2148C0
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('ESGporto - Climate Report', 14, 25);

        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);

        // Body Header
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text('Inventário de Emissões de Carbono', 14, 55);

        // Summary Stats
        if (records.length > 0) {
            const latest = records[0];
            doc.setFontSize(12);
            doc.text(`Último Período: ${latest.period_month}/${latest.period_year}`, 14, 65);
            doc.text(`Intensidade de Carbono: ${latest.carbon_intensity.toFixed(4)} kgCO2e/Ton`, 14, 72);
            doc.text(`Total de Emissões: ${latest.total_co2e_kg.toLocaleString('pt-BR')} kgCO2e`, 14, 79);
        }

        // Table
        const tableData = records.map(rec => [
            `${rec.period_month}/${rec.period_year}`,
            rec.fuel_consumption_liters.toLocaleString('pt-BR'),
            rec.energy_consumption_kwh.toLocaleString('pt-BR'),
            rec.cargo_handled_tons.toLocaleString('pt-BR'),
            rec.carbon_intensity.toFixed(4)
        ]);

        (doc as any).autoTable({
            startY: 90,
            head: [['Período', 'Diesel (L)', 'Energia (kWh)', 'Carga (Ton)', 'Intensidade']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillStyle: [33, 72, 192], textColor: [255, 255, 255] },
            styles: { fontSize: 9 }
        });

        doc.save(`Relatorio_Descarbonizacao_ESGporto_${new Date().getTime()}.pdf`);
        toast.success('Relatório gerado com sucesso!');
    };

    const latestRecord = records[0];
    const previousRecord = records[1];

    const intensityTrend = useMemo(() => {
        if (!latestRecord || !previousRecord) return 0;
        return ((latestRecord.carbon_intensity - previousRecord.carbon_intensity) / previousRecord.carbon_intensity) * 100;
    }, [latestRecord, previousRecord]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Sincronizando Inventário de Carbono...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">Clima & Descarbonização</h2>
                    <p className="text-gray-500 font-medium italic">Monitoramento de emissões de Escopo 1 e 2 (Protocolo GHG).</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outlined"
                        startIcon={<Download className="w-4 h-4" />}
                        onClick={generatePDF}
                        sx={{ borderRadius: '2px', fontWeight: 900, fontSize: '11px', borderColor: '#CCC', color: '#666' }}
                    >
                        EXPORTAR PDF
                    </Button>
                    <div className="px-4 py-2 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-sm flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Compromisso Net Zero 2050</span>
                    </div>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<History className="w-4 h-4" />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{ borderRadius: '2px', fontWeight: 900, fontSize: '11px', boxShadow: 'none' }}
                    >
                        LANÇAR DADOS
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* KPI Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1C1C1C] text-white p-8 rounded-sm shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <TrendingDown className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Intensidade de Carbono Atual</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-black tracking-tighter">
                                    {latestRecord?.carbon_intensity.toFixed(4) || "0.0000"}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500">kgCO2e / Ton</span>
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs font-black px-2 py-0.5 rounded-full w-fit ${intensityTrend <= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {intensityTrend <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                {Math.abs(intensityTrend).toFixed(1)}% vs. Mês Anterior
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                        <h4 className="font-black text-gray-700 dark:text-gray-300 text-xs uppercase tracking-widest mb-4">Quebra de Emissões (kgCO2e)</h4>
                        <div className="space-y-4">
                            <EmissionStat
                                label="Diesel (Escopo 1)"
                                value={(latestRecord?.fuel_consumption_liters || 0) * 2.68}
                                color="bg-blue-500"
                                percentage={65}
                            />
                            <EmissionStat
                                label="Energia (Escopo 2)"
                                value={(latestRecord?.energy_consumption_kwh || 0) * 0.08}
                                color="bg-yellow-500"
                                percentage={35}
                            />
                        </div>
                    </div>
                </div>

                {/* Historico & Simulador */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-[#1C1C1C] p-8 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Histórico de Performance Climática</h3>
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="h-48 flex items-end gap-3 px-2">
                            {records.slice(0, 8).reverse().map((rec, idx) => (
                                <div key={rec.id} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    <div
                                        className="w-full bg-gray-100 dark:bg-white/5 rounded-t-sm transition-all duration-500 group-hover:bg-green-500/30 cursor-pointer"
                                        style={{ height: `${(rec.carbon_intensity / records[0].carbon_intensity) * 100}%` }}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-black">
                                            {rec.carbon_intensity.toFixed(4)}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">{rec.period_month}/{rec.period_year.toString().slice(-2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-emerald-800 p-8 rounded-sm text-white shadow-xl relative overflow-hidden">
                        <Zap className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 rotate-12" />
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-xl font-black mb-2 italic">Transição Energética</h3>
                            <p className="text-sm font-medium opacity-80 mb-6">
                                Estimamos que a eletrificação de 4 guindastes RTG no Porto do Itaqui reduziria as emissões locais em até <strong>1,200 toneladas de CO2e por ano</strong>.
                            </p>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: 'white', color: 'emerald.800', fontWeight: 900, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }, borderRadius: '2px' }}
                            >
                                VER PROJETO DE VIABILIDADE
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Lançamento */}
            <Dialog open={isModalOpen} onClose={() => !isSaving && setIsModalOpen(false)} PaperProps={{ sx: { borderRadius: '2px' } }}>
                <DialogTitle sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
                    Lançamento de Inventário CO2
                </DialogTitle>
                <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                            label="Mês"
                            type="number"
                            size="small"
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                        />
                        <TextField
                            label="Ano"
                            type="number"
                            size="small"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                        />
                    </Box>
                    <TextField
                        label="Consumo Diesel (Litros)"
                        type="number"
                        fullWidth
                        size="small"
                        required
                        value={formData.fuel}
                        onChange={(e) => setFormData({ ...formData, fuel: Number(e.target.value) })}
                    />
                    <TextField
                        label="Energia Elétrica (kWh)"
                        type="number"
                        fullWidth
                        size="small"
                        required
                        value={formData.energy}
                        onChange={(e) => setFormData({ ...formData, energy: Number(e.target.value) })}
                    />
                    <TextField
                        label="Carga Movimentada (Ton)"
                        type="number"
                        fullWidth
                        size="small"
                        required
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: Number(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsModalOpen(false)} sx={{ fontWeight: 900, color: 'gray' }}>CANCELAR</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="success"
                        disabled={isSaving}
                        startIcon={isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        sx={{ fontWeight: 900, borderRadius: '2px', px: 4 }}
                    >
                        {isSaving ? 'SALVANDO...' : 'SALVAR INVENTÁRIO'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const EmissionStat = ({ label, value, color, percentage }: { label: string, value: number, color: string, percentage: number }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-black text-gray-500 uppercase">{label}</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">{value.toLocaleString('pt-BR')} kg</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
        </div>
    </div>
);


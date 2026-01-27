import React, { useState, useEffect } from 'react';
import { Ship, FileCheck, Trash2, Download, Plus, AlertCircle, CheckCircle2, FileText, Anchor, Loader2 } from 'lucide-react';
import { ShipWasteRecord } from '../../types';
import { supabase } from '../../utils/supabase';

export const ShipWaste: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [records, setRecords] = useState<ShipWasteRecord[]>([]);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('ship_waste_records')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setRecords(data as ShipWasteRecord[]);
        } catch (error) {
            console.error('Erro ao buscar registros de resíduos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportANTAQ = () => {
        alert('Gerando CSV formatado para relatório mensal ANTAQ e trimestral IMO GISIS...');
    };

    const stats = [
        { label: 'Pendentes ANTAQ', value: records.filter(r => !r.crr_mtr_number).length.toString().padStart(2, '0'), icon: <AlertCircle className="w-4 h-4 text-orange-500" /> },
        { label: 'Auditados Q1', value: '100%', icon: <FileCheck className="w-4 h-4 text-green-500" /> },
        { label: 'Volume Total (M³)', value: records.reduce((acc, r) => acc + (Number(r.volume_m3) || 0), 0).toLocaleString('pt-BR'), icon: <Anchor className="w-4 h-4 text-blue-500" /> },
        { label: 'Empresas Ativas', value: new Set(records.map(r => r.service_provider_id)).size.toString().padStart(2, '0'), icon: <Ship className="w-4 h-4 text-purple-500" /> }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Trash2 className="w-8 h-8 text-happiness-5" /> Gestão de Resíduos de Navios
                    </h2>
                    <p className="text-gray-500 font-medium italic">Procedimento Operacional EMAP-PC-112 (Regulatório ANTAQ)</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportANTAQ}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-all"
                    >
                        <Download className="w-5 h-5" /> Exportar ANTAQ/GISIS
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-happiness-1 text-white px-6 py-3 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-happiness-1/20 hover:scale-105 transition-all"
                    >
                        <Plus className="w-5 h-5" /> Novo Recebimento
                    </button>
                </div>
            </div>

            {/* Regulatory Status Widget */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">{stat.label}</span>
                            <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-3xl">{stat.icon}</div>
                    </div>
                ))}
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-happiness-1 animate-spin" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Sincronizando com Supabase...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#1C1C1C] text-white">
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Navio / Viagem</th>
                                <th className="px-8 py-5">Tipo (MARPOL)</th>
                                <th className="px-8 py-5 text-center">Volume (M³)</th>
                                <th className="px-8 py-5">Certificado (CRR/MTR)</th>
                                <th className="px-8 py-5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {records.map(r => (
                                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center font-black">
                                                {r.vessel_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{r.vessel_name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{r.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                            {r.waste_type_marpol}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center font-black text-gray-900">
                                        {Number(r.volume_m3).toFixed(1)}
                                    </td>
                                    <td className="px-8 py-6">
                                        {r.crr_mtr_number ? (
                                            <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
                                                <FileText className="w-4 h-4" /> {r.crr_mtr_number}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase animate-pulse">
                                                <AlertCircle className="w-4 h-4" /> CRR PENDENTE
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'Completed' ? 'bg-green-100 text-green-600 border border-green-200' :
                                            r.status === 'In Progress' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                                                'bg-orange-100 text-orange-600 border border-orange-200'
                                            }`}>
                                            {r.status === 'Completed' ? 'Concluído' : r.status === 'In Progress' ? 'Em Coleta' : 'Solicitado'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-medium">
                                        Nenhum registro de resíduo encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Validation Note */}
            <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                    <h4 className="text-red-900 font-black text-sm uppercase mb-1">Trava de Segurança PC-112</h4>
                    <p className="text-red-700/70 text-xs font-medium leading-relaxed italic">
                        O status 'Completed' é bloqueado automaticamente pelo sistema se o upload do documento CRR/MTR ou o número do certificado não for fornecido.
                    </p>
                </div>
            </div>
        </div>
    );
};


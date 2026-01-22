import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, Plus, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { LAIARecord } from '../../types';
import { supabase } from '../../utils/supabase';

export const LAIA: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [records, setRecords] = useState<LAIARecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('laia_records')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setRecords(data as LAIARecord[]);
        } catch (error) {
            console.error('Erro ao buscar registros LAIA:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRiskLevel = (score: number) => {
        if (score >= 15) return { label: 'CRÍTICO', color: 'text-red-600 bg-red-100' };
        if (score >= 10) return { label: 'ALTO', color: 'text-orange-600 bg-orange-100' };
        return { label: 'MODERADO', color: 'text-yellow-600 bg-yellow-100' };
    };

    const filteredRecords = records.filter(r =>
        r.activity_source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.environmental_aspect.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.environmental_impact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Digital LAIA (Levantamento PC-56)</h2>
                    <p className="text-gray-500 font-medium italic">Aspectos e Impactos Ambientais do Porto do Itaqui</p>
                </div>
                <button className="bg-happiness-1 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-happiness-1/20 hover:scale-105 transition-all">
                    <Plus className="w-5 h-5" /> Novo Registro
                </button>
            </div>

            {/* Workflow Logic Breadcrumb */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span className="text-happiness-1">1. Atividade</span>
                <ArrowRight className="w-3 h-3" />
                <span>2. Aspecto</span>
                <ArrowRight className="w-3 h-3" />
                <span>3. Impacto</span>
                <ArrowRight className="w-3 h-3" />
                <span>4. Controle Operacional</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                    <Search className="w-5 h-5 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Buscar por atividade ou impacto..."
                        className="flex-1 bg-transparent outline-none text-sm font-semibold text-gray-700"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-black uppercase text-gray-400">Total Monitorado</span>
                    <p className="text-2xl font-black text-gray-900">{records.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-happiness-1 animate-spin" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Lendo Matriz LAIA...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                                <th className="px-6 py-4">Fonte / Atividade</th>
                                <th className="px-6 py-4">Aspecto & Impacto</th>
                                <th className="px-6 py-4 text-center">Risco (SxP)</th>
                                <th className="px-6 py-4">Controle Vinculado</th>
                                <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRecords.map(record => {
                                const risk = getRiskLevel(record.risk_score);
                                return (
                                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-6">
                                            <p className="font-bold text-gray-900 text-sm">{record.activity_source}</p>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{record.id}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                                    <Filter className="w-3 h-3 text-blue-500" /> {record.environmental_aspect}
                                                </p>
                                                <p className="text-xs text-gray-500 italic">{record.environmental_impact}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${risk.color}`}>
                                                {risk.label} ({record.risk_score})
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 font-mono text-[10px] text-gray-400 font-bold">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-3 h-3 text-green-500" />
                                                {record.control_measure_id || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-happiness-1">
                                                <Search className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredRecords.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                                        Nenhum aspecto ambiental encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};


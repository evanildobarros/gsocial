import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, Truck, XCircle, AlertCircle } from 'lucide-react';

// Mock Data
const suppliers = [
    { id: 'SUP-001', name: 'Logística Maranhense Ltda', category: 'Transport', riskScore: 12, status: 'Approved' },
    { id: 'SUP-002', name: 'Limpeza e Conservação Clean', category: 'Services', riskScore: 85, status: 'Blocked' },
    { id: 'SUP-003', name: 'TechSolutions IT', category: 'Technology', riskScore: 45, status: 'Review' },
    { id: 'SUP-004', name: 'ConstruNorte Engenharia', category: 'Construction', riskScore: 25, status: 'Approved' },
    { id: 'SUP-005', name: 'Consultoria Ambiental Green', category: 'Consulting', riskScore: 92, status: 'Blocked' },
];

export const SupplyChainAudit: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const getRiskLevel = (score: number) => {
        if (score >= 80) return { label: 'CRITICAL', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' };
        if (score >= 40) return { label: 'MEDIUM', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' };
        return { label: 'LOW', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' };
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Auditoria da Cadeia de Valor
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitoramento de fornecedores e Due Diligence ESG automatizada.
                    </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-3xl font-bold text-sm border border-orange-200 dark:border-orange-800 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    2 Fornecedores Bloqueados
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-[#1C1C1C] p-4 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, CNPJ ou ID..."
                        className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-white dark:bg-[#1C1C1C] p-4 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase">Total Monitorado</span>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">1,248</p>
                    </div>
                    <Truck className="w-8 h-8 text-gray-200 dark:text-white/10" />
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Fornecedor</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">ESG Risk Score</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredSuppliers.map((supplier) => {
                            const risk = getRiskLevel(supplier.riskScore);
                            return (
                                <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {supplier.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="line-clamp-1">{supplier.name}</p>
                                                <span className="text-[10px] text-gray-400">{supplier.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{supplier.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${risk.color.split(' ')[2].replace('text', 'bg')}`} // Hacky way to get bg color from text class but let's be explicit
                                                    style={{ width: `${supplier.riskScore}%`, backgroundColor: supplier.riskScore >= 80 ? '#ef4444' : supplier.riskScore >= 40 ? '#eab308' : '#22c55e' }}
                                                />
                                            </div>
                                            <span className={`text-xs font-bold ${risk.color.split(' ')[0]}`}>{supplier.riskScore}/100</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {supplier.status === 'Blocked' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                                                <XCircle className="w-3 h-3" /> Blocked
                                            </span>
                                        ) : supplier.status === 'Review' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50">
                                                <AlertCircle className="w-3 h-3" /> Review
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                                                <ShieldCheck className="w-3 h-3" /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs font-bold text-gray-400 hover:text-happiness-1 transition-colors">
                                            Detalhes
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        Nenhum fornecedor encontrado par a busca.
                    </div>
                )}
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 text-xs uppercase mb-2">Lógica de Bloqueio Automático</h4>
                <p className="text-xs text-gray-500">
                    Fornecedores com <strong>Risk Score &gt; 80</strong> são automaticamente bloqueados de novos contratos no ERP financeiro.
                    A reintegração exige uma auditoria física e aprovação do Compliance Officer.
                </p>
            </div>
        </div>
    );
};

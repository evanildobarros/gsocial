import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertOctagon, FileText, Loader2, CheckCircle2, XCircle, Plus, UserPlus, X } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-toastify';

interface Supplier {
    id: string;
    cnpj: string;
    company_name: string;
    status: 'Active' | 'Blocked' | 'In Review';
    risk: 'Low' | 'Medium' | 'High';
    last_audit_date: string;
    violation_details?: string;
}

export const HumanRights: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState<Supplier | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [stats, setStats] = useState({ total: 0, blocked: 0 });
    const [recentAlerts, setRecentAlerts] = useState<Supplier[]>([]);

    // Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        cnpj: '',
        company_name: '',
        status: 'Active' as const,
        risk: 'Low' as const,
        violation_details: ''
    });

    useEffect(() => {
        fetchComplianceStats();
    }, []);

    const fetchComplianceStats = async () => {
        const { count: total } = await supabase.from('supplier_compliance').select('*', { count: 'exact', head: true });
        const { count: blocked } = await supabase.from('supplier_compliance').select('*', { count: 'exact', head: true }).eq('status', 'Blocked');
        const { data: alerts } = await supabase.from('supplier_compliance').select('*').eq('status', 'Blocked').order('updated_at', { ascending: false }).limit(2);

        setStats({ total: total || 0, blocked: blocked || 0 });
        if (alerts) setRecentAlerts(alerts as Supplier[]);
    };

    const handleSearch = async () => {
        if (!searchTerm) return;
        try {
            setIsSearching(true);
            const { data, error } = await supabase
                .from('supplier_compliance')
                .select('*')
                .ilike('cnpj', `%${searchTerm}%`)
                .maybeSingle();

            if (data) setSearchResult(data as Supplier);
            else {
                setSearchResult(null);
                toast.info('Nenhum fornecedor encontrado com este CNPJ.');
            }
        } catch (error) {
            console.error('Erro na consulta de compliance:', error);
            toast.error('Erro na consulta de dados.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddSupplier = async () => {
        if (!formData.cnpj || !formData.company_name) {
            toast.warning('CNPJ e Razão Social são obrigatórios.');
            return;
        }

        try {
            setIsSubmitting(true);
            const { error } = await supabase
                .from('supplier_compliance')
                .insert({
                    cnpj: formData.cnpj,
                    company_name: formData.company_name,
                    status: formData.status,
                    risk: formData.risk,
                    violation_details: formData.violation_details,
                    last_audit_date: new Date().toISOString().split('T')[0]
                });

            if (error) throw error;

            toast.success('Fornecedor registrado com sucesso!');
            setIsAddModalOpen(false);
            setFormData({ cnpj: '', company_name: '', status: 'Active', risk: 'Low', violation_details: '' });
            fetchComplianceStats();
        } catch (error: any) {
            console.error('Erro ao registrar fornecedor:', error);
            toast.error(error.message || 'Erro ao salvar fornecedor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight italic">Compliance & Direitos Humanos</h1>
                    <p className="text-sm text-gray-500 mt-1">Due Diligence em Supply Chain e Verificação de Trabalho Escravo.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#1C1C1C] hover:bg-black text-white font-black text-[11px] transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" /> NOVO FORNECEDOR
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Panel */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1C] p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm text-center">
                    <ShieldCheck className="w-12 h-12 text-happiness-1 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Portal de Verificação</h2>
                    <p className="text-xs text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                        Consulte o CNPJ contra a base unificada de Direitos Humanos, Lista Suja (MTE) e sanções internacionais.
                    </p>

                    <div className="flex gap-2 max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Digite o CNPJ..."
                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-black text-sm transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            VERIFICAR
                        </button>
                    </div>

                    {/* Result Card */}
                    {searchResult && (
                        <div className="mt-8 p-4 border dark:border-white/10 rounded-3xl bg-gray-50 dark:bg-white/5 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-start">
                                <div className="text-left">
                                    <h4 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">{searchResult.company_name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold tracking-widest">{searchResult.cnpj}</p>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${searchResult.status === 'Active' ? 'bg-green-100 text-green-700' :
                                    searchResult.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {searchResult.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    {searchResult.status === 'Active' ? 'CONFORME' : 'BLOQUEADO'}
                                </div>
                            </div>
                            {searchResult.violation_details && (
                                <div className="mt-3 text-left p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900/10">
                                    <p className="text-[10px] text-red-700 dark:text-red-400 font-bold italic leading-relaxed">"{searchResult.violation_details}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Counter Stats */}
                <div className="bg-[#1C1C1C] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-white/5">
                    <div className="space-y-8">
                        <div>
                            <div className="text-4xl font-black tracking-tighter">{stats.total}</div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Parceiros Monitorados</div>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div>
                            <div className="text-4xl font-black text-red-500 tracking-tighter">{stats.blocked}</div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Restrições Ativas</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Cadastro */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Cadastrar em Supply Chain</h3>
                            <button onClick={() => !isSubmitting && setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">CNPJ *</label>
                                <input
                                    type="text"
                                    value={formData.cnpj}
                                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                    placeholder="00.000.000/0000-00"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Razão Social *</label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Status Inicial</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Active">Ativo (Conforme)</option>
                                        <option value="In Review">Em Análise</option>
                                        <option value="Blocked">Bloqueado</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nível de Risco</label>
                                    <select
                                        value={formData.risk}
                                        onChange={(e) => setFormData({ ...formData, risk: e.target.value as any })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Low">Baixo</option>
                                        <option value="Medium">Médio</option>
                                        <option value="High">Alto</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Detalhes de Violação (Se houver)</label>
                                <textarea
                                    value={formData.violation_details}
                                    onChange={(e) => setFormData({ ...formData, violation_details: e.target.value })}
                                    placeholder="Ex: Identificado na Lista Suja..."
                                    rows={3}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg font-bold text-sm transition-colors"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleAddSupplier}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    {isSubmitting ? 'SALVANDO...' : 'REGISTRAR'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Recent Alerts List */}
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertOctagon className="w-5 h-5 text-red-600" />
                        <h3 className="font-black text-red-800 dark:text-red-400 text-sm uppercase tracking-tighter">Alertas de Risco Crítico</h3>
                    </div>
                    <div className="space-y-3">
                        {recentAlerts.map(alert => (
                            <div key={alert.id} className="text-xs text-red-700 dark:text-red-300 border-b border-red-200 dark:border-red-900/20 pb-2">
                                Fornecedor <strong>{alert.company_name}</strong> bloqueado preventivamente por violação administrativa.
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-black text-blue-800 dark:text-blue-400 text-sm uppercase tracking-tighter">Governança Supply Chain</h3>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                        Sistema automatizado de varredura (VRA) analisa diariamente 100+ bases governamentais.
                        Relatórios de conformidade para o TAC de Aratu disponíveis na diretoria.
                    </p>
                    <button className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Acessar Arquivo Digital</button>
                </div>
            </div>
        </div>
    );
};

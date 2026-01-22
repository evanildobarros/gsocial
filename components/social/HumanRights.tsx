import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertOctagon, FileText, Loader2, CheckCircle2, XCircle, Plus, UserPlus } from 'lucide-react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
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
                <Button
                    variant="contained"
                    startIcon={<UserPlus className="w-4 h-4" />}
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ borderRadius: '2px', fontWeight: 900, fontSize: '11px', px: 3, bgcolor: '#1C1C1C', '&:hover': { bgcolor: '#000' } }}
                >
                    NOVO FORNECEDOR
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Panel */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1C] p-8 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm text-center">
                    <ShieldCheck className="w-12 h-12 text-happiness-1 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Portal de Verificação</h2>
                    <p className="text-xs text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                        Consulte o CNPJ contra a base unificada de Direitos Humanos, Lista Suja (MTE) e sanções internacionais.
                    </p>

                    <div className="flex gap-2 max-w-md mx-auto">
                        <TextField
                            fullWidth
                            placeholder="Digite o CNPJ..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            InputProps={{ sx: { borderRadius: '2px', fontSize: '13px' } }}
                        />
                        <Button
                            variant="contained"
                            disableElevation
                            disabled={isSearching}
                            onClick={handleSearch}
                            startIcon={isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                            sx={{ borderRadius: '2px', fontWeight: 900, px: 4 }}
                        >
                            VERIFICAR
                        </Button>
                    </div>

                    {/* Result Card */}
                    {searchResult && (
                        <div className="mt-8 p-4 border dark:border-white/10 rounded-sm bg-gray-50 dark:bg-white/5 animate-in zoom-in-95 duration-200">
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
                <div className="bg-[#1C1C1C] text-white p-8 rounded-sm shadow-xl flex flex-col justify-between border border-white/5">
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
            <Dialog
                open={isAddModalOpen}
                onClose={() => !isSubmitting && setIsAddModalOpen(false)}
                PaperProps={{ sx: { borderRadius: '2px' } }}
            >
                <DialogTitle sx={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.05em', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    CADASTRAR EM SUPPLY CHAIN
                </DialogTitle>
                <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="CNPJ"
                        fullWidth
                        size="small"
                        required
                        value={formData.cnpj}
                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        placeholder="00.000.000/0000-00"
                    />
                    <TextField
                        label="Razão Social"
                        fullWidth
                        size="small"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status Inicial</InputLabel>
                            <Select
                                value={formData.status}
                                label="Status Inicial"
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <MenuItem value="Active">Ativo (Conforme)</MenuItem>
                                <MenuItem value="In Review">Em Análise</MenuItem>
                                <MenuItem value="Blocked">Bloqueado</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel>Nível de Risco</InputLabel>
                            <Select
                                value={formData.risk}
                                label="Nível de Risco"
                                onChange={(e) => setFormData({ ...formData, risk: e.target.value as any })}
                            >
                                <MenuItem value="Low">Baixo</MenuItem>
                                <MenuItem value="Medium">Médio</MenuItem>
                                <MenuItem value="High">Alto</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField
                        label="Detalhes de Violação (Se houver)"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.violation_details}
                        onChange={(e) => setFormData({ ...formData, violation_details: e.target.value })}
                        placeholder="Ex: Identificado na Lista Suja..."
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <Button onClick={() => setIsAddModalOpen(false)} sx={{ fontWeight: 900, color: 'gray' }}>CANCELAR</Button>
                    <Button
                        onClick={handleAddSupplier}
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
                        sx={{ fontWeight: 900, borderRadius: '2px', px: 4 }}
                    >
                        {isSubmitting ? 'SALVANDO...' : 'REGISTRAR'}
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Recent Alerts List */}
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-sm border border-red-100 dark:border-red-900/30">
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

                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-sm border border-blue-100 dark:border-blue-900/30">
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



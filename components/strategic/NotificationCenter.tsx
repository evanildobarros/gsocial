import React, { useState } from 'react';
import { 
    Bell, 
    AlertTriangle, 
    Droplets, 
    MapPin, 
    Users, 
    CheckCircle2, 
    Clock, 
    Search, 
    Filter,
    ArrowUpRight,
    ShieldAlert,
    Info,
    MoreHorizontal,
    Trash2,
    Check
} from 'lucide-react';

interface Notification {
    id: string;
    type: 'environmental' | 'social' | 'governance' | 'system';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    location?: string;
    timestamp: string;
    status: 'unread' | 'read' | 'resolved';
}

export const NotificationCenter: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'environmental' | 'social'>('all');
    
    // Mock data based on real map alerts
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 'AL-902',
            type: 'environmental',
            priority: 'critical',
            title: 'Resíduo Fora da Zona COFAM',
            description: 'Detectado descarte não autorizado nas coordenadas -2.585, -44.372. Protocolo de contingência nível 2 ativado pela equipe de monitoramento via satélite.',
            location: 'Zona Sul do Porto',
            timestamp: 'Há 12 min',
            status: 'unread'
        },
        {
            id: 'SO-871',
            type: 'social',
            priority: 'high',
            title: 'Risco de Licença Social: Vila Maranhão',
            description: 'Índice de vulnerabilidade atingiu nível crítico (Score 8). Falta de acesso hídrico somado ao aumento de ruído noturno gerou 3 novos tickets de ouvidoria nas últimas 24h.',
            location: 'Vila Maranhão',
            timestamp: 'Há 2 horas',
            status: 'unread'
        },
        {
            id: 'SO-855',
            type: 'social',
            priority: 'medium',
            title: 'Ação Social Pendente de S-ROI',
            description: 'O projeto "Capacitação Mulheres do Itaqui" atingiu 100 beneficiárias, mas o relatório de Retorno Social sobre Investimento ainda não foi anexado.',
            location: 'Itaqui-Bacanga',
            timestamp: 'Há 5 horas',
            status: 'read'
        },
        {
            id: 'GO-112',
            type: 'governance',
            priority: 'medium',
            title: 'Audit de Due Diligence Expirando',
            description: 'A auditoria do fornecedor "Logística Alpha" vence em 15 dias. Nível de criticidade estratégica ALTA exige renovação imediata da documentação anticorrupção.',
            timestamp: 'Ontem às 16:40',
            status: 'read'
        },
        {
            id: 'SY-001',
            type: 'system',
            priority: 'low',
            title: 'Sincronização Supabase OK',
            description: 'Backup diário do banco de dados e camadas geoespaciais concluído com sucesso às 03:00 AM.',
            timestamp: 'Hoje às 03:00',
            status: 'resolved'
        }
    ]);

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-50 text-red-600 border-red-200';
            case 'high': return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'medium': return 'bg-blue-50 text-blue-600 border-blue-200';
            default: return 'bg-green-50 text-green-600 border-green-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'environmental': return <Droplets size={18} className="text-green-600" />;
            case 'social': return <Users size={18} className="text-orange-600" />;
            case 'governance': return <ShieldAlert size={18} className="text-blue-600" />;
            default: return <Info size={18} className="text-purple-600" />;
        }
    };

    const filtered = notifications.filter(n => {
        if (filter === 'all') return true;
        return n.type === filter;
    });

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl">
                        <Bell className="text-white dark:text-black w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-black dark:text-white tracking-tighter">Central de Alertas & Notificações</h1>
                        <p className="text-sm font-bold text-black dark:text-gray-300 italic">Inteligência Preditiva e Monitoramento Operacional em Tempo Real.</p>
                    </div>
                </div>

                <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                    {(['all', 'environmental', 'social'] as const).map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === opt ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            {opt === 'all' ? 'Ver Tudo' : opt === 'environmental' ? 'Ambiental' : 'Social'}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    {filtered.map((n) => (
                        <div 
                            key={n.id}
                            className={`group relative bg-white dark:bg-[#1C1C1C] rounded-[24px] border-2 transition-all hover:shadow-xl ${n.status === 'unread' ? 'border-black dark:border-white shadow-lg' : 'border-gray-50 dark:border-white/5'}`}
                        >
                            <div className="p-6 md:p-8 flex gap-6">
                                {/* Side Indicator */}
                                <div className={`w-1 rounded-full ${n.priority === 'critical' ? 'bg-red-500' : n.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`} />

                                <div className="flex-1 space-y-4">
                                    {/* Top Metadata */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                                                {getTypeIcon(n.type)}
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-black text-black dark:text-white uppercase tracking-widest block leading-none">{n.type}</span>
                                                <span className="text-[11px] font-bold text-black dark:text-gray-400 mt-1 flex items-center gap-1">
                                                    <Clock size={10} /> {n.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-tighter border ${getPriorityStyles(n.priority)}`}>
                                            {n.priority}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-black dark:text-white tracking-tight leading-tight group-hover:text-happiness-1 transition-colors">
                                            {n.title}
                                        </h3>
                                        <p className="text-sm font-medium text-black dark:text-gray-200 leading-relaxed">
                                            {n.description}
                                        </p>
                                    </div>

                                    {/* Bottom Metadata & Actions */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-50 dark:border-white/5">
                                        {n.location && (
                                            <div className="flex items-center gap-2 text-[11px] font-black text-black dark:text-white uppercase tracking-widest">
                                                <MapPin size={14} className="text-red-500" />
                                                {n.location}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 ml-auto">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                                                Ação Reativa <ArrowUpRight size={14} />
                                            </button>
                                            <button className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Unread Badge */}
                            {n.status === 'unread' && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-lg animate-bounce">
                                    <Check size={14} strokeWidth={4} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-black dark:bg-white rounded-[32px] p-8 text-white dark:text-black shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <ShieldAlert size={120} />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-70">Painel de Resiliência</h2>
                        
                        <div className="space-y-8 relative z-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-4xl font-black tracking-tighter">02</span>
                                    <p className="text-[11px] font-bold uppercase opacity-70 mt-1">Alertas Críticos</p>
                                </div>
                                <div className="w-12 h-1 bg-red-500 rounded-full mb-2 animate-pulse" />
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-4xl font-black tracking-tighter">18</span>
                                    <p className="text-[11px] font-bold uppercase opacity-70 mt-1">Incidentes Resolvidos</p>
                                </div>
                                <div className="w-12 h-1 bg-green-500 rounded-full mb-2" />
                            </div>

                            <button className="w-full py-4 bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 border border-white/20 dark:border-black/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                                Exportar Log Mensal
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-100 dark:border-white/5 space-y-6 shadow-sm">
                        <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Thermometer size={16} className="text-happiness-1" />
                            Urgência do Sistema
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-black dark:text-gray-400 uppercase">
                                    <span>Ambiental</span>
                                    <span>70%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[70%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-black dark:text-gray-400 uppercase">
                                    <span>Social (LSO)</span>
                                    <span>92%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[92%] animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

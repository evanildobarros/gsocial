import React from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Chip } from '@mui/material';

export const CommunityRelations: React.FC = () => {
    const tickets = [
        { id: 'T-001', category: 'Poeira', local: 'Vila Maranhão', status: 'Em Análise', severity: 'critical', date: 'Há 2 horas' },
        { id: 'T-002', category: 'Ruído', local: 'Anjo da Guarda', status: 'Recebido', severity: 'medium', date: 'Há 5 horas' },
        { id: 'T-003', category: 'Solicitação de Apoio', local: 'Alto da Esperança', status: 'Ação Tomada', severity: 'low', date: 'Ontem' },
        { id: 'T-004', category: 'Tráfego Caminhões', local: 'BR-135', status: 'Feedback Enviado', severity: 'high', date: 'Há 2 dias' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Recebido': return 'default';
            case 'Em Análise': return 'warning';
            case 'Ação Tomada': return 'info';
            case 'Feedback Enviado': return 'success';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Gestão de Relacionamento & Território</h1>
                    <p className="text-sm text-gray-500 mt-1">Canal de Escuta Ativa e Mapeamento de Stakeholders</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ticket System (Ouvidoria 2.0) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-happiness-1" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ouvidoria 2.0 (Tickets)</h2>
                        </div>
                        <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-sm border border-red-200">
                            1 Crítico Pendente
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-10 h-10 rounded-sm flex items-center justify-center shrink-0
                                        ${ticket.severity === 'critical' ? 'bg-red-100 text-red-600' :
                                            ticket.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                                                ticket.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'}
                                    `}>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                            {ticket.category}
                                            <span className="text-[10px] text-gray-400 font-normal">#{ticket.id}</span>
                                        </h3>
                                        <p className="text-xs text-gray-500">{ticket.local} • {ticket.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Chip
                                        label={ticket.status}
                                        size="small"
                                        color={getStatusColor(ticket.status) as any}
                                        sx={{ borderRadius: 1, fontWeight: 700, fontSize: '10px', height: 24 }}
                                    />
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-happiness-1 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 text-center text-xs font-bold text-gray-500 cursor-pointer hover:text-happiness-1 uppercase tracking-wider">
                        Ver todos os tickets
                    </div>
                </div>

                {/* Stakeholder Matrix Placeholder */}
                <div className="bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                        <Users className="w-5 h-5 text-purple-500" />
                        <h2 className="text-lg font-bold">Matriz de Stakeholders</h2>
                    </div>

                    <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-sm border border-dashed border-gray-200 dark:border-white/10 relative p-4">
                        {/* Axes */}
                        <div className="absolute left-4 bottom-4 w-[calc(100%-32px)] h-px bg-gray-300 dark:bg-white/20" /> {/* X Axis */}
                        <div className="absolute left-4 bottom-4 h-[calc(100%-32px)] w-px bg-gray-300 dark:bg-white/20" /> {/* Y Axis */}

                        <span className="absolute bottom-1 right-4 text-[9px] font-bold text-gray-400 uppercase">Interesse</span>
                        <span className="absolute top-4 left-6 text-[9px] font-bold text-gray-400 uppercase">Poder</span>

                        {/* Bubbles */}
                        <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[8px] font-bold text-blue-700 dark:text-blue-300 text-center leading-tight hover:scale-110 transition-transform cursor-pointer">
                            Assoc.<br />Moradores
                        </div>
                        <div className="absolute top-1/3 left-1/3 w-12 h-12 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-[8px] font-bold text-green-700 dark:text-green-300 text-center hover:scale-110 transition-transform cursor-pointer">
                            ONG<br />Local
                        </div>
                        <div className="absolute top-10 right-10 w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[8px] font-bold text-red-700 dark:text-red-300 text-center hover:scale-110 transition-transform cursor-pointer">
                            Gov.<br />Estadual
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

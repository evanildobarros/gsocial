import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Shield,
  Globe,
  AlertTriangle,
  Leaf,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Map as MapIcon,
  Droplets,
  Activity,
  Loader2
} from 'lucide-react';
import { supabase } from '../utils/supabase';

const KPICard = ({ title, value, subtext, icon: Icon, trend, trendValue, color, isWarning }: any) => (
  <div className={`bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border ${isWarning ? 'border-red-200 dark:border-red-900/50 ring-2 ring-red-50 dark:ring-red-900/10' : 'border-gray-200 dark:border-white/5'} shadow-sm relative overflow-hidden group`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-sm ${color} bg-opacity-10 text-opacity-100`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs">
      {trend === 'up' && <span className="text-green-600 dark:text-green-400 font-bold flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" />{trendValue}</span>}
      {trend === 'down' && <span className="text-red-500 font-bold flex items-center"><ArrowDownRight className="w-3 h-3 mr-1" />{trendValue}</span>}
      <span className="text-gray-400 dark:text-gray-600">{subtext}</span>
    </div>
    {isWarning && (
      <div className="absolute top-0 right-0 p-1">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>
    )}
  </div>
);

const ModuleSummary = ({ title, icon: Icon, items, colorClass }: any) => (
  <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm h-full">
    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
      <Icon className={`w-5 h-5 ${colorClass}`} />
      <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-sm -mx-2 transition-colors">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
            <span className="text-[10px] text-gray-400">{item.sub}</span>
          </div>
          {item.status === 'success' && <span className="text-xs font-black text-green-500">{item.value}</span>}
          {item.status === 'warning' && <span className="text-xs font-black text-yellow-500">{item.value}</span>}
          {item.status === 'danger' && <span className="text-xs font-black text-red-500">{item.value}</span>}
          {item.status === 'neutral' && <span className="text-xs font-black text-gray-500 dark:text-gray-400">{item.value}</span>}
        </div>
      ))}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    wasteActive: 0,
    criticalRisks: 0,
    avgSroi: 0,
    totalInnovation: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [waste, laia, sroi, innovation] = await Promise.all([
          supabase.from('ship_waste_records').select('id', { count: 'exact' }).neq('status', 'Completed'),
          supabase.from('laia_records').select('id', { count: 'exact' }).gte('risk_score', 15),
          supabase.from('sroi_impact_records').select('sroi_ratio'),
          supabase.from('innovation_ideas').select('id', { count: 'exact' })
        ]);

        const avgSroi = sroi.data?.length
          ? sroi.data.reduce((acc, curr) => acc + Number(curr.sroi_ratio), 0) / sroi.data.length
          : 0;

        setStats({
          wasteActive: waste.count || 0,
          criticalRisks: laia.count || 0,
          avgSroi: avgSroi,
          totalInnovation: innovation.count || 0,
          loading: false
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-12 h-12 text-happiness-1 animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Consolidando Matriz ESG...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Plataforma Integrada ESG</h2>
            <span className="bg-gray-900 text-white dark:bg-white dark:text-black text-[10px] uppercase font-black px-2 py-0.5 rounded-sm tracking-widest">Porto do Itaqui</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Visão consolidada: TCFD, GRI Standards e PR 2030 (ABNT).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-sm border border-green-200 dark:border-green-900/30 flex items-center gap-2 text-green-700 dark:text-green-400">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Maturidade 5.0 LIVE</span>
          </div>
          <button className="bg-happiness-1 text-white p-2 rounded-sm shadow-lg shadow-happiness-1/20 hover:bg-happiness-1/90 transition-all flex items-center gap-2 text-xs font-bold px-4">
            <FileText className="w-4 h-4" />
            Gerar Report
          </button>
        </div>
      </div>

      {/* High Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Emissões Escopo 3"
          value="12,450 tCO2e"
          subtext="vs meta anual (85%)"
          icon={Leaf}
          trend="up"
          trendValue="2.4%"
          color="text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
        />
        <KPICard
          title="Índice SROI (Média)"
          value={`R$ ${stats.avgSroi.toFixed(2)}`}
          subtext="Retorno Social por R$1"
          icon={Users}
          trend={stats.avgSroi > 0 ? "up" : "neutral"}
          trendValue={stats.avgSroi > 0 ? "ATIVO" : ""}
          color="text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <KPICard
          title="Riscos Críticos (LAIA)"
          value={stats.criticalRisks.toString().padStart(2, '0')}
          subtext="Requerem mitigação imediata"
          icon={Shield}
          trend={stats.criticalRisks > 0 ? "up" : "neutral"}
          trendValue={stats.criticalRisks > 0 ? "!" : ""}
          color="text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
          isWarning={stats.criticalRisks > 0}
        />
        <KPICard
          title="Resíduos em Fluxo"
          value={stats.wasteActive.toString().padStart(2, '0')}
          subtext="Navios em operação"
          icon={AlertTriangle}
          trend="neutral"
          trendValue=""
          color="text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
        />
      </div>

      {/* Integrated Modules View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <ModuleSummary
          title="Módulo Ambiental (EcoPorto)"
          icon={Leaf}
          colorClass="text-green-500"
          items={[
            { label: 'Eficiência Energética', sub: 'Terminals A/B', value: '94%', status: 'success' },
            { label: 'Monitoramento de Ruído', sub: 'Sensor Vila Maranhão', value: 'ALERT', status: 'warning' },
            { label: 'Matriz LAIA (Digital)', sub: 'PC-56 Compliance', value: 'LIVE', status: 'success' },
            { label: 'Qualidade da Água', sub: 'Ponto de Controle 04', value: 'Normal', status: 'neutral' },
          ]}
        />

        <ModuleSummary
          title="Módulo Social (Território)"
          icon={Users}
          colorClass="text-blue-500"
          items={[
            { label: 'SROI Global', sub: 'Base em Projetos', value: `R$ ${stats.avgSroi.toFixed(2)}`, status: 'success' },
            { label: 'Wage Gap (Liderança)', sub: 'Gender Pay Gap', value: '5.2%', status: 'danger' },
            { label: 'Beneficiários Diretos', sub: 'Total Base', value: '450', status: 'neutral' },
            { label: 'Iniciativas de Inovação', sub: 'Funil CRIARE', value: stats.totalInnovation, status: 'success' },
          ]}
        />

        <ModuleSummary
          title="Módulo Governança (GRC)"
          icon={Shield}
          colorClass="text-purple-500"
          items={[
            { label: 'Status Regulatório ANTAQ', sub: 'Pendências PC-112', value: `${stats.wasteActive} ATIVAS`, status: stats.wasteActive > 0 ? 'warning' : 'success' },
            { label: 'Report GRI/SASB', sub: 'Data Completeness', value: '92%', status: 'success' },
            { label: 'Matriz de Riscos', sub: 'Amplificados p/ Clima', value: stats.criticalRisks > 3 ? 'High' : 'Moderate', status: stats.criticalRisks > 3 ? 'danger' : 'warning' },
            { label: 'Transparência', sub: 'Portal Público', value: 'Live', status: 'success' },
          ]}
        />
      </div>

      {/* Operational View */}
      <div className="bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 text-center">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sincronização Ativa com Supabase Cloud Cluster</p>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  People as UsersIcon,
  Shield as ShieldIcon,
  Public as GlobeIcon,
  Warning as AlertIcon,
  Nature as LeafIcon,
  Description as FileTextIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Map as MapIcon,
  WaterDrop as DropletsIcon,
  Insights as ActivityIcon,
  Refresh as RefreshIcon,
  Sync as SyncIcon
} from '@mui/icons-material';
import { supabase } from '../utils/supabase';

const KPICard = ({ title, value, subtext, icon: Icon, trend, trendValue, color, isWarning }: any) => {
  const colorMap: any = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };

  const trendColor = trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
    trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500';

  return (
    <div className={`
      relative h-full p-5 rounded-3xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-zinc-900 overflow-hidden
      ${isWarning ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-white/5'}
    `}>
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>
          <h4 className="text-3xl font-black mt-1 text-gray-900 dark:text-white tracking-tight">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl flex items-center justify-center h-12 w-12 ${colorMap[color] || 'bg-gray-100 text-gray-700'}`}>
          <Icon />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {trend !== 'neutral' && (
          <span className={`text-xs font-bold flex items-center ${trendColor}`}>
            {trend === 'up' ? <ArrowUpIcon style={{ fontSize: 14, marginRight: 4 }} /> : <ArrowDownIcon style={{ fontSize: 14, marginRight: 4 }} />}
            {trendValue}
          </span>
        )}
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{subtext}</span>
      </div>

      {isWarning && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      )}
    </div>
  );
};

const ModuleSummary = ({ title, icon: Icon, items, color }: any) => {
  const iconColors: any = {
    success: 'text-emerald-600 dark:text-emerald-400',
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-slate-600 dark:text-slate-400',
  };

  return (
    <div className="h-full rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-zinc-900 p-6 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
        <Icon className={iconColors[color]} />
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</p>
              <p className="text-xs font-medium text-gray-400">{item.sub}</p>
            </div>
            <span className={`
              px-2 py-1 rounded-3xl text-[10px] font-black uppercase
              ${item.status === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : ''}
              ${item.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : ''}
              ${item.status === 'danger' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' : ''}
              ${item.status === 'neutral' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : ''}
            `}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
          Consolidando Matriz ESG...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header / Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              Plataforma Integrada ESG
            </h2>
            <span className="px-2 py-1 rounded bg-primary text-white text-[10px] font-black uppercase tracking-wider">
              Porto do Itaqui
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Visão consolidada: TCFD, GRI Standards e PR 2030 (ABNT).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Maturidade 5.0 Live
            </span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors shadow-lg shadow-primary/20">
            <FileTextIcon style={{ fontSize: 18 }} />
            Gerar Report
          </button>
        </div>
      </div>

      {/* High Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Emissões Escopo 3"
          value="12,450 tCO2e"
          subtext="vs meta anual (85%)"
          icon={LeafIcon}
          trend="up"
          trendValue="2.4%"
          color="success"
        />
        <KPICard
          title="Índice SROI (Média)"
          value={`R$ ${stats.avgSroi.toFixed(2)}`}
          subtext="Retorno Social por R$1"
          icon={UsersIcon}
          trend={stats.avgSroi > 0 ? "up" : "neutral"}
          trendValue={stats.avgSroi > 0 ? "ATIVO" : ""}
          color="primary"
        />
        <KPICard
          title="Riscos Críticos (LAIA)"
          value={stats.criticalRisks.toString().padStart(2, '0')}
          subtext="Requerem mitigação imediata"
          icon={ShieldIcon}
          trend={stats.criticalRisks > 0 ? "up" : "neutral"}
          trendValue={stats.criticalRisks > 0 ? "!" : ""}
          color="error"
          isWarning={stats.criticalRisks > 0}
        />
        <KPICard
          title="Resíduos em Fluxo"
          value={stats.wasteActive.toString().padStart(2, '0')}
          subtext="Navios em operação"
          icon={AlertIcon}
          trend="neutral"
          trendValue=""
          color="warning"
        />
      </div>

      {/* Integrated Modules View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ModuleSummary
          title="Módulo Ambiental (EcoPorto)"
          icon={LeafIcon}
          color="success"
          items={[
            { label: 'Eficiência Energética', sub: 'Terminals A/B', value: '94%', status: 'success' },
            { label: 'Monitoramento de Ruído', sub: 'Sensor Vila Maranhão', value: 'ALERT', status: 'warning' },
            { label: 'Matriz LAIA (Digital)', sub: 'PC-56 Compliance', value: 'LIVE', status: 'success' },
            { label: 'Qualidade da Água', sub: 'Ponto de Controle 04', value: 'Normal', status: 'neutral' },
          ]}
        />
        <ModuleSummary
          title="Módulo Social (Território)"
          icon={UsersIcon}
          color="primary"
          items={[
            { label: 'SROI Global', sub: 'Base em Projetos', value: `R$ ${stats.avgSroi.toFixed(2)}`, status: 'success' },
            { label: 'Wage Gap (Liderança)', sub: 'Gender Pay Gap', value: '5.2%', status: 'danger' },
            { label: 'Beneficiários Diretos', sub: 'Total Base', value: '450', status: 'neutral' },
            { label: 'Iniciativas de Inovação', sub: 'Funil CRIARE', value: stats.totalInnovation.toString(), status: 'success' },
          ]}
        />
        <ModuleSummary
          title="Módulo Governança (GRC)"
          icon={ShieldIcon}
          color="secondary"
          items={[
            { label: 'Status Regulatório ANTAQ', sub: 'Pendências PC-112', value: `${stats.wasteActive} ATIVAS`, status: stats.wasteActive > 0 ? 'warning' : 'success' },
            { label: 'Report GRI/SASB', sub: 'Data Completeness', value: '92%', status: 'success' },
            { label: 'Matriz de Riscos', sub: 'Amplificados p/ Clima', value: stats.criticalRisks > 3 ? 'High' : 'Moderate', status: stats.criticalRisks > 3 ? 'danger' : 'warning' },
            { label: 'Transparência', sub: 'Portal Público', value: 'Live', status: 'success' },
          ]}
        />
      </div>

      {/* Operational View */}
      <div className="p-8 text-center rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-center gap-2">
          <SyncIcon style={{ fontSize: 16 }} className="animate-spin-slow" />
          Sincronização Ativa com Supabase Cloud Cluster
        </span>
      </div>
    </div>
  );
};
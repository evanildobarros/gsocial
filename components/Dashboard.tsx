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
  Sync as SyncIcon,
  ShowChart as SroiIcon,
} from '@mui/icons-material';
import { supabase } from '../utils/supabase';

const KPICard = ({ title, value, subtext, icon: Icon, trend, trendValue, color, isWarning }: any) => {
  const gradients: any = {
    success: 'from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5 border-emerald-500/20',
    primary: 'from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5 border-blue-500/20',
    error: 'from-red-500/10 to-red-500/5 dark:from-red-500/20 dark:to-red-500/5 border-red-500/20',
    warning: 'from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/5 border-amber-500/20',
  };

  const iconColors: any = {
    success: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    primary: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
    error: 'bg-red-500 text-white shadow-lg shadow-red-500/30',
    warning: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
  };

  return (
    <div className={`
      relative h-full p-8 rounded-[32px] border bg-gradient-to-br transition-all duration-300 ease-out
      hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:scale-[1.02] group overflow-hidden
      ${gradients[color] || 'from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950 border-gray-100 dark:border-white/10'}
      ${isWarning ? 'border-red-500/50' : ''}
    `}>
      {/* Decorative Blur */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 rounded-full bg-current ${color === 'success' ? 'text-emerald-500' : color === 'primary' ? 'text-blue-500' : color === 'error' ? 'text-red-500' : 'text-amber-500'}`} />

      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-[clamp(1.5rem,3vw,2.5rem)] font-black text-black dark:text-white tracking-tighter leading-none">{value}</h4>
          </div>
        </div>
        <div className={`flex items-center justify-center h-14 w-14 rounded-2xl transition-transform group-hover:scale-110 duration-500 ${iconColors[color]}`}>
          <Icon style={{ fontSize: 28 }} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {trend !== 'neutral' && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
            {trend === 'up' ? <ArrowUpIcon style={{ fontSize: 12 }} /> : <ArrowDownIcon style={{ fontSize: 12 }} />}
            {trendValue}
          </div>
        )}
        <span className="text-xs font-bold text-black/60 dark:text-white/60">{subtext}</span>
      </div>

      {isWarning && (
        <div className="absolute top-4 right-4 flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        </div>
      )}
    </div>
  );
};

const ModuleSummary = ({ title, icon: Icon, items, color }: any) => {
  const accentColors: any = {
    success: 'text-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10',
    primary: 'text-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10',
    secondary: 'text-zinc-500 bg-zinc-500/10 shadow-lg shadow-zinc-500/10',
  };

  return (
    <div className="h-full rounded-[32px] border border-gray-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 backdrop-blur-sm p-8 hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 ease-out hover:shadow-2xl hover:scale-[1.02]">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-2xl ${accentColors[color]}`}>
          <Icon />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white opacity-60 leading-tight">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex justify-between items-center p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10 group/item"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-black text-black dark:text-white group-hover/item:text-happiness-1 transition-colors leading-none">{item.label}</p>
              <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">{item.sub}</p>
            </div>
            <div className={`
              px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm
              ${item.status === 'success' ? 'bg-emerald-500 text-white' : ''}
              ${item.status === 'warning' ? 'bg-amber-500 text-white' : ''}
              ${item.status === 'danger' ? 'bg-red-500 text-white' : ''}
              ${item.status === 'neutral' ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800' : ''}
            `}>
              {item.value}
            </div>
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
        <span className="text-[10px] font-black uppercase tracking-widest text-black animate-pulse">
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
            <h2 className="text-3xl font-black text-black dark:text-white tracking-tight leading-none">
              Plataforma Integrada ESG
            </h2>
            <span className="px-2 py-1 rounded bg-primary text-white text-[10px] font-black uppercase tracking-wider">
              Porto do Itaqui
            </span>
          </div>
          <p className="text-sm font-medium text-black dark:text-black">
            Visão consolidada: TCFD, GRI Standards e PR 2030 (ABNT).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Maturidade Nível 5 (ABNT PR 2030)
            </span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors shadow-lg shadow-primary/20">
            <FileTextIcon style={{ fontSize: 18 }} />
            Gerar Report
          </button>
        </div>
      </div>

      {/* High Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Status ESG Geral"
          value="CONFORME"
          subtext="E: OK, S: Atenção, G: OK"
          icon={ShieldIcon}
          trend="up"
          trendValue="Estável"
          color="success"
          isWarning={false}
        />
        <KPICard
          title="Índice SROI (Média)"
          value={`R$ ${stats.avgSroi.toFixed(2)}`}
          subtext="Retorno Social por R$1"
          icon={SroiIcon}
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
            { label: 'Eficiência Energética', sub: 'Ref: 100% LED 2025', value: 'ATIVO', status: 'success' },
            { label: 'Monitoramento de Ruído', sub: 'Sensor Vila Maranhão', value: 'Normal', status: 'success' },
            { label: 'Matriz LAIA (Digital)', sub: 'PC-56 Compliance', value: 'LIVE', status: 'success' },
            { label: 'Descarbonização', sub: 'Plano VF03 Ativo', value: 'Meta 2030', status: 'neutral' },
          ]}
        />
        <ModuleSummary
          title="Módulo Social (Território)"
          icon={UsersIcon}
          color="primary"
          items={[
            { label: 'SROI Global', sub: 'Base em Projetos', value: `R$ ${stats.avgSroi.toFixed(2)}`, status: 'success' },
            { label: 'População Itaqui-Bacanga', sub: 'Censo 2022/Ref 2024', value: '155.289', status: 'neutral' },
            { label: 'Desertific. Educacional', sub: '44% dos Bairros', value: 'CRÍTICO', status: 'danger' },
            { label: 'Engajamento ACIB', sub: 'Gestão de Crise', value: 'MÉDIO', status: 'warning' },
          ]}
        />
        <ModuleSummary
          title="Módulo Governança (GRC)"
          icon={ShieldIcon}
          color="secondary"
          items={[
            { label: 'Código de Compliance', sub: 'Edição 2024 Ativa', value: 'OK', status: 'success' },
            { label: 'Maturidade ABNT', sub: 'PR 2030 (Estágio 5)', value: 'LIDERANÇA', status: 'success' },
            { label: 'Remuneração ESG', sub: 'Bônus vs Metas', value: 'VINCULADO', status: 'success' },
            { label: 'Audit. Transparência', sub: 'ODS Internalizados', value: 'Live', status: 'success' },
          ]}
        />
      </div>

      {/* Operational View */}
      <div className="p-8 text-center rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5">
        <span className="text-[10px] font-black uppercase tracking-widest text-black flex items-center justify-center gap-2">
          <SyncIcon style={{ fontSize: 16 }} className="animate-spin-slow" />
          Sincronização Ativa com Supabase Cloud Cluster
        </span>
      </div>
    </div>
  );
};
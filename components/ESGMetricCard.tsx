import React from 'react';
import { ArrowUpward as ArrowUpIcon, ArrowDownward as ArrowDownwardIcon, Shield as ShieldIcon, People as UsersIcon, ShowChart as SroiIcon, Gavel as GavelIcon, Nature as LeafIcon } from '@mui/icons-material';
import { ESGStatus, ESG_COLORS } from '../theme/esgColors';

// Enum para definir o tipo de formatação de valor que o card deve ter
export enum MetricType {
  NUMERIC = 'numeric',
  STATUS_AGGREGATE = 'status-aggregate',
  TREND = 'trend',
}

interface ESGMetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  metricType: MetricType;
  status?: ESGStatus; // Usado principalmente para status-aggregate ou para destacar crises
  colorTone?: 'primary' | 'emerald' | 'secondary'; // Define a cor de destaque do card
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode; // Ícone principal do card
}

const getToneClasses = (tone: string) => {
    switch (tone) {
        case 'primary': return {
            bg: 'bg-happiness-1/10 dark:bg-happiness-1/20',
            text: 'text-happiness-1 dark:text-white'
        };
        case 'emerald': return {
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            text: 'text-emerald-700 dark:text-emerald-300'
        };
        case 'secondary': return {
            bg: 'bg-gray-100 dark:bg-slate-800',
            text: 'text-slate-600 dark:text-slate-300'
        };
        default: return { bg: 'bg-gray-100 dark:bg-zinc-800', text: 'text-black dark:text-white' };
    }
};

const ESGMetricCard: React.FC<ESGMetricCardProps> = ({
  title, value, subtext, metricType = MetricType.NUMERIC, status = 'success', colorTone = 'primary', onClick, trend = 'neutral', trendValue, icon
}) => {
  const { bg, text } = getToneClasses(colorTone);

  // 1. Lógica de Renderização para Status Aggregate (E/S/G)
  if (metricType === MetricType.STATUS_AGGREGATE) {
    const PillarIndicator: React.FC<{ label: string, icon: React.ReactNode, status: ESGStatus }> = ({ label, icon, status }) => {
        const statusColor = ESG_COLORS.status[status] || ESG_COLORS.status.neutral;
        const statusText = status === 'success' ? 'OK' : status === 'attention' ? 'ATENÇÃO' : status === 'critical' ? 'CRÍTICO' : 'NEUTRO';
        
        return (
            <div className="flex items-center gap-2">
                <div style={{ color: statusColor }}>{icon}</div>
                <span className="text-sm font-bold text-black dark:text-white">{label}:</span>
                <span className={`text-xs font-black uppercase tracking-wider`} style={{ color: statusColor }}>{statusText}</span>
            </div>
        );
    };

    return (
      <div 
        className={`
          relative h-full p-5 rounded-3xl border transition-all duration-200 hover:shadow-lg bg-white dark:bg-surface-1 overflow-hidden border-gray-200 dark:border-white/5
          ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
        `}
        onClick={onClick}
      >
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">{title}</p>
            {/* O valor principal aqui pode ser um resumo, ex: 'Em Conformidade' */}
            <h4 className="text-3xl font-black mt-1 text-black dark:text-white tracking-tight">{value}</h4>
          </div>
          <div className={`p-3 rounded-xl flex items-center justify-center h-12 w-12 ${bg} ${text}`}>
            {icon}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-3">
            {/* Placeholder para os 3 pilares dentro do cartão de aggregate */}
            <PillarIndicator label="E" icon={<LeafIcon />} status={'success'} />
            <PillarIndicator label="S" icon={<UsersIcon />} status={'attention'} />
            <PillarIndicator label="G" icon={<GavelIcon />} status={'success'} />
        </div>
      </div>
    );
  }
  
  // 2. Lógica de Renderização para Numérico (SROI, GEE, Resíduos)
  const trendColor = trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
    trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white';

  return (
    <div 
        className={`
            relative h-full p-5 rounded-3xl border transition-all duration-200 hover:shadow-lg bg-white dark:bg-surface-1 overflow-hidden
            ${onClick ? 'cursor-pointer hover:-translate-y-1' : 'border-gray-200 dark:border-white/5'}
            ${status === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-white/5'}
        `}
        onClick={onClick}
    >
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">{title}</p>
          <h4 className="text-3xl font-black mt-1 text-black dark:text-white tracking-tight">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl flex items-center justify-center h-12 w-12 ${bg} ${text}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {trend !== 'neutral' && (
          <span className={`text-xs font-bold flex items-center ${trendColor}`}>
            {trend === 'up' ? <ArrowUpIcon style={{ fontSize: 14, marginRight: 4 }} /> : <ArrowDownwardIcon style={{ fontSize: 14, marginRight: 4 }} />}
            {trendValue}
          </span>
        )}
        <span className="text-xs font-medium text-black dark:text-white">{subtext}</span>
      </div>

      {status === 'critical' && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      )}
    </div>
  );
};

export default ESGMetricCard;

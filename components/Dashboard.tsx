import React from 'react';
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
  Activity
} from 'lucide-react';

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
            <span className="text-[10px] font-black uppercase tracking-widest">Nível de Maturidade 5</span>
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
          title="Índice SROI Social"
          value="R$ 4.25"
          subtext="Retorno p/ cada R$1 investido"
          icon={Users}
          trend="up"
          trendValue="R$ 0.15"
          color="text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <KPICard
          title="Riscos Críticos"
          value="03"
          subtext="Requerem mitigação imediata"
          icon={Shield}
          trend="down"
          trendValue="-1"
          color="text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
          isWarning={true}
        />
        <KPICard
          title="Fornecedores Bloqueados"
          value="02"
          subtext="Due Diligence Automático"
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
            { label: 'Gestão de Resíduos (MTR)', sub: 'Circularidade', value: '100%', status: 'success' },
            { label: 'Qualidade da Água', sub: 'Ponto de Controle 04', value: 'Normal', status: 'neutral' },
          ]}
        />

        <ModuleSummary
          title="Módulo Social (Território)"
          icon={Users}
          colorClass="text-blue-500"
          items={[
            { label: 'Tickets Ouvidoria', sub: 'Abertos > 48h', value: '0', status: 'success' },
            { label: 'Wage Gap (Liderança)', sub: 'Gender Pay Gap', value: '5.2%', status: 'danger' },
            { label: 'Beneficiários Diretos', sub: 'Jovem Aprendiz', value: '450', status: 'neutral' },
            { label: 'Diversidade (Cotas)', sub: 'PCD Compliance', value: '5.2%', status: 'success' },
          ]}
        />

        <ModuleSummary
          title="Módulo Governança (GRC)"
          icon={Shield}
          colorClass="text-purple-500"
          items={[
            { label: 'Report GRI/SASB', sub: 'Data Completeness', value: '92%', status: 'success' },
            { label: 'Lista Suja (Trabalho)', sub: 'Varredura Semanal', value: 'Clean', status: 'success' },
            { label: 'Matriz de Riscos', sub: 'Amplificados p/ Clima', value: 'High', status: 'warning' },
            { label: 'Transparência', sub: 'Portal Público', value: 'Live', status: 'success' },
          ]}
        />
      </div>

      {/* Geo-Spatial & Operational View */}
      <div className="bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-gray-400" />
              Monitoramento Territorial (Itaqui-Bacanga)
            </h3>
            <p className="text-xs text-gray-500 mt-1">Integração de sensores IoT Ambientais e Projetos Sociais.</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Ar Puro</span>
            <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Alerta PM2.5</span>
            <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Projeto Social</span>
          </div>
        </div>

        <div className="relative aspect-[21/9] bg-gray-100 dark:bg-black/20 rounded-sm overflow-hidden border border-gray-200 dark:border-white/5">
          {/* Abstract Map Representation */}
          <svg viewBox="0 0 1000 400" className="w-full h-full opacity-30 dark:opacity-10">
            <path d="M0,350 Q250,300 400,350 T800,300 T1000,350 V400 H0 Z" fill="#3B82F6" /> {/* Water */}
            <path d="M0,350 Q250,300 400,350 T800,300 T1000,350 V0 H0 Z" fill="currentColor" className="text-gray-300 dark:text-gray-600" /> {/* Land */}
          </svg>

          {/* Sensor Data Points */}
          <div className="absolute top-1/3 left-1/4 group cursor-pointer">
            <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white dark:border-[#1C1C1C] shadow-lg animate-pulse"></div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-black p-2 rounded shadow-xl border border-gray-100 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 w-48">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">Sensor: Vila Maranhão</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>PM2.5: High</span>
                <span className="text-yellow-500 font-bold">45µg/m³</span>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-1/3 group cursor-pointer">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-[#1C1C1C] shadow-lg"></div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-black p-2 rounded shadow-xl border border-gray-100 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 w-48">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">Projeto: Pesca Sustentável</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Beneficiários</span>
                <span className="text-blue-500 font-bold">128 Famílias</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-1/4 left-1/2 group cursor-pointer">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#1C1C1C] shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
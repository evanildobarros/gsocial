import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Cloud,
    Wind,
    Thermometer,
    Droplets,
    AlertTriangle,
    Calendar,
    TrendingUp,
    Compass,
    RefreshCw,
    Upload,
    Zap,
    ChevronRight,
    BarChart3
} from 'lucide-react';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// --- Types ---
interface MeteoData {
    timestamp: string;
    windDirection: number;
    rainMm: number;
    windSpeed: number;
    temp: number;
    humidity: number;
    riskStatus: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const MeteoPredictiveModule: React.FC = () => {
    const [data, setData] = useState<MeteoData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(/[;,]/);
            const getIdx = (name: string) => headers.findIndex(h => h.includes(name));
            const idx = {
                time: getIdx('Data e Hora'),
                dir: getIdx('Direção Escalar'),
                rain: getIdx('Precipitação'),
                speed: getIdx('Velocidade Escalar'),
                temp: getIdx('Temperatura'),
                hum: getIdx('Umidade')
            };

            const parsed: MeteoData[] = lines.slice(1).map((line, i) => {
                const cols = line.split(/[;,]/);
                const speed = parseFloat(cols[idx.speed]) || 0;
                const direction = parseFloat(cols[idx.dir]) || 0;
                const rain = parseFloat(cols[idx.rain]) || 0;

                let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
                if (direction >= 45 && direction <= 135 && speed > 6) risk = 'HIGH';
                else if (speed > 8 || rain > 10) risk = 'MEDIUM';

                return {
                    timestamp: cols[idx.time]?.split(' ')[1]?.substring(0, 5) || `${i}:00`,
                    windDirection: direction,
                    windSpeed: speed,
                    rainMm: rain,
                    temp: parseFloat(cols[idx.temp]) || 24,
                    humidity: parseFloat(cols[idx.hum]) || 70,
                    riskStatus: risk
                };
            }).filter(d => d.timestamp);

            setData(parsed.slice(0, 24));
            setIsLoading(false);
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        if (data.length === 0) {
            setIsLoading(true);
            setTimeout(() => {
                const mockData: MeteoData[] = Array.from({ length: 24 }).map((_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    const speed = Math.random() * 12;
                    const direction = Math.random() * 360;
                    const rain = Math.random() > 0.8 ? Math.random() * 25 : 0;
                    let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
                    if (direction >= 45 && direction <= 135 && speed > 6) risk = 'HIGH';
                    else if (speed > 8 || rain > 10) risk = 'MEDIUM';

                    return {
                        timestamp: `${hour}:00`,
                        windDirection: direction,
                        windSpeed: speed,
                        rainMm: rain,
                        temp: 24 + Math.random() * 8,
                        humidity: 60 + Math.random() * 30,
                        riskStatus: risk
                    };
                });
                setData(mockData);
                setIsLoading(false);
            }, 1000);
        }
    }, [data.length]);

    const windRoseData = useMemo(() => {
        const bins = [
            { name: 'N', angle: 0 }, { name: 'NE', angle: 45 }, { name: 'E', angle: 90 },
            { name: 'SE', angle: 135 }, { name: 'S', angle: 180 }, { name: 'SW', angle: 225 },
            { name: 'W', angle: 270 }, { name: 'NW', angle: 315 }
        ];
        return bins.map(bin => {
            const count = data.filter(d => Math.abs(d.windDirection - bin.angle) < 22.5 || (bin.name === 'N' && d.windDirection > 337.5)).length;
            return { subject: bin.name, A: count, fullMark: data.length / 2 };
        });
    }, [data]);

    const operationalWindows = useMemo(() => {
        return data.map(d => {
            const score = (10 - d.windSpeed) - (d.rainMm * 2);
            return {
                time: d.timestamp,
                status: score < 0 ? 'CLOSED' : (score < 4 ? 'WARNING' : 'OPEN'),
                score
            };
        });
    }, [data]);

    const extremeAlerts = data.filter(d => d.rainMm > 20);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center py-20 gap-4 text-center">
                <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Sincronizando Berço 100...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-1">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Compass className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Inteligência Climática</h1>
                            <p className="text-sm font-medium text-gray-500 italic">Predição Operacional • Berço 100</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-full font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                        <Upload size={16} />
                        Importar Histórico
                    </button>
                    <div className="px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 font-black text-xs uppercase rounded-full flex items-center gap-1.5 border border-green-100 dark:border-green-900/20">
                        <RefreshCw size={14} className="animate-pulse" />
                        Estação Ativa
                    </div>
                </div>
            </div>

            {/* Extreme Alerts Banner */}
            {extremeAlerts.length > 0 && (
                <div className="bg-red-500 text-white p-6 rounded-[32px] shadow-xl shadow-red-500/30 animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-red-500 rounded-full flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-wide">Evento Extremo Detectado</h3>
                            <p className="font-medium text-sm text-white/90">Chuva superior a 20mm/h identificada. Ativar protocolos de contingência de drenagem.</p>
                        </div>
                    </div>
                    <button className="bg-white text-red-600 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                        Ver Protocolos
                    </button>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1C1C1C] rounded-[24px] p-6 border border-gray-200 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform duration-200">
                    <div className="flex justify-between items-start mb-2">
                        <Wind className="text-blue-500" />
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">VENTO ESCALAR</span>
                    <div className="mt-1 text-3xl font-black text-gray-900 dark:text-white">
                        {data[23]?.windSpeed.toFixed(1)} <span className="text-sm font-normal text-gray-400">m/s</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1C1C1C] rounded-[24px] p-6 border border-gray-200 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform duration-200">
                    <div className="flex justify-between items-start mb-2">
                        <Cloud className="text-cyan-500" />
                        <span className="text-[10px] font-black text-red-500 uppercase">ALERTA</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">PRECIPITAÇÃO ACUM.</span>
                    <div className="mt-1 text-3xl font-black text-gray-900 dark:text-white">
                        {data.reduce((acc, c) => acc + c.rainMm, 0).toFixed(1)} <span className="text-sm font-normal text-gray-400">mm</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1C1C1C] rounded-[24px] p-6 border border-gray-200 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform duration-200">
                    <div className="flex justify-between items-start mb-2">
                        <Thermometer className="text-amber-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">ESTÁVEL</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">TEMPERATURA</span>
                    <div className="mt-1 text-3xl font-black text-gray-900 dark:text-white">
                        {data[23]?.temp.toFixed(1)} <span className="text-sm font-normal text-gray-400">°C</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1C1C1C] rounded-[24px] p-6 border border-gray-200 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform duration-200">
                    <div className="flex justify-between items-start mb-2">
                        <Droplets className="text-purple-500" />
                        <span className="text-[10px] font-black text-green-500 uppercase">-5%</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">UMIDADE</span>
                    <div className="mt-1 text-3xl font-black text-gray-900 dark:text-white">
                        {data[23]?.humidity.toFixed(0)} <span className="text-sm font-normal text-gray-400">%</span>
                    </div>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
                <div className="space-y-6">
                    <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[32px] p-6 border border-gray-200 dark:border-white/5 shadow-lg">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-6">ROSA DOS VENTOS</h3>
                        <div className="h-[280px] w-full flex justify-center">
                            <ResponsiveContainer>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={windRoseData}>
                                    <PolarGrid stroke="rgba(128,128,128,0.2)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                                    <Radar name="Vento" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-6 border border-gray-200 dark:border-white/5">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4">ANÁLISE DE RISCO AMBIENTAL</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-black text-gray-500 uppercase">DISPERSÃO DE PARTICULADOS</span>
                                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-black uppercase rounded-lg">ALTO RISCO</span>
                                </div>
                                <p className="text-sm text-gray-500 italic mb-4">
                                    Ventos de Sudeste ({'>'}6m/s) sopram em direção à zona urbana.
                                </p>
                                <button disabled className="w-full bg-gray-100 dark:bg-white/10 text-gray-400 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed">
                                    <Zap size={16} />
                                    Gatilhos Automáticos Ativados
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[32px] p-6 border border-gray-200 dark:border-white/5 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">JANELAS OPERACIONAIS (PRÓXIMAS 24H)</h3>
                            <Zap className="text-amber-500 w-5 h-5" />
                        </div>

                        <div className="grid grid-cols-12 gap-1 mb-4">
                            {operationalWindows.map((win, idx) => (
                                <div key={idx} className="group relative" title={`Score Operacional: ${win.score.toFixed(1)}`}>
                                    <div
                                        className={`
                                            h-12 rounded-xl flex items-center justify-center border border-transparent transition-all group-hover:scale-105 group-hover:z-10 group-hover:border-current cursor-help
                                            ${win.status === 'OPEN'
                                                ? 'bg-green-500/10 text-green-600'
                                                : win.status === 'WARNING'
                                                    ? 'bg-amber-500/10 text-amber-600'
                                                    : 'bg-red-500/10 text-red-600'
                                            }
                                        `}
                                    >
                                        <span className="text-[10px] font-black">{win.time.split(':')[0]}</span>
                                    </div>

                                    {/* Custom Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                        Score: {win.score.toFixed(1)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between px-2">
                            <span className="text-[10px] font-bold text-gray-400">00:00</span>
                            <span className="text-[10px] font-black text-blue-600">AGORA</span>
                            <span className="text-[10px] font-bold text-gray-400">23:00</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-6 border border-gray-200 dark:border-white/5">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-6">VELOCIDADE DO VENTO VS. PRECIPITAÇÃO</h3>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                    <XAxis dataKey="timestamp" tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ fontWeight: 900, marginBottom: 8, color: '#111' }}
                                    />
                                    <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 20, fontSize: 10, fontWeight: 900 }} />
                                    <Line type="monotone" dataKey="windSpeed" stroke="#3B82F6" strokeWidth={4} dot={false} animationDuration={2000} name="Vento (m/s)" />
                                    <Line type="monotone" dataKey="rainMm" stroke="#EF4444" strokeWidth={4} dot={false} animationDuration={2000} name="Precipitação (mm)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

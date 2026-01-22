import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    CloudRain, Wind, Thermometer, Droplets, AlertTriangle,
    Calendar, TrendingUp, Compass, Loader2, FileUp, Zap, ChevronRight
} from 'lucide-react';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, BarChart, Bar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Button, Card, CardContent, Typography, Box, Chip } from '@mui/material';

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

// --- Component ---
export const MeteoPredictiveModule: React.FC = () => {
    const [data, setData] = useState<MeteoData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('2025-01-17');
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

            // Map headers to indices
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

            // Limited to 24 points for visualization
            setData(parsed.slice(0, 24));
            setIsLoading(false);
        };
        reader.readAsText(file);
    };

    // Simulate Data Generation (based on CSV 2025 specs)
    useEffect(() => {
        // Only generate mock data if no data has been loaded yet (e.g., from CSV)
        if (data.length === 0) {
            setIsLoading(true);
            setTimeout(() => {
                const mockData: MeteoData[] = Array.from({ length: 24 }).map((_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    const speed = Math.random() * 12;
                    const direction = Math.random() * 360;
                    const rain = Math.random() > 0.8 ? Math.random() * 25 : 0;

                    // Risk Logic: IF wind_direction BETWEEN 45 AND 135 AND wind_speed > 6 -> HIGH
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
    }, [selectedDate, data.length]); // Added data.length to dependency array to prevent re-mocking if data is loaded

    // Wind Rose Logic (Binned Data)
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

    // Operational Window Heatmap Logic
    // Score = (10 - wind_speed) - (rain_mm * 2)
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
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="w-12 h-12 text-happiness-1 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Ingerindo Dados Meteo (Berço 100)...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">Inteligência Climática</h2>
                    <p className="text-gray-500 font-medium italic">Análise preditiva Berço 100 baseada em dados históricos 2025.</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".csv"
                        className="hidden"
                    />
                    <Button
                        variant="outlined"
                        startIcon={<FileUp className="w-4 h-4" />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ borderRadius: '2px', fontWeight: 900, borderColor: '#CCC', color: '#666', fontSize: '11px' }}
                    >
                        IMPORTAR CSV HISTÓRICO
                    </Button>
                    <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-sm flex items-center gap-2">
                        <Compass className="w-4 h-4 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Estação Meteo Ativa</span>
                    </div>
                </div>
            </div>

            {/* Top Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ConditionWidget icon={<Wind />} label="Velocidade Escalar" value={`${data[23]?.windSpeed.toFixed(1)} m/s`} trend="+12%" />
                <ConditionWidget icon={<CloudRain />} label="Precipitação (Acum.)" value={`${data.reduce((acc, c) => acc + c.rainMm, 0).toFixed(1)} mm`} trend="Alerta" isAlert={data.some(d => d.rainMm > 20)} />
                <ConditionWidget icon={<Thermometer />} label="Temperatura" value={`${data[23]?.temp.toFixed(1)}°C`} trend="Estável" />
                <ConditionWidget icon={<Droplets />} label="Umidade Relativa" value={`${data[23]?.humidity.toFixed(0)}%`} trend="-5%" />
            </div>

            {/* Alerts Section */}
            {extremeAlerts.length > 0 && (
                <div className="bg-red-500 text-white p-4 rounded-sm flex items-center justify-between shadow-lg animate-pulse">
                    <div className="flex items-center gap-4">
                        <AlertTriangle className="w-6 h-6" />
                        <div>
                            <p className="font-black text-xs uppercase tracking-widest">Alerta de Evento Extremo Detectado</p>
                            <p className="text-sm font-medium">Precipitação superior a 20mm/hora identificada às {extremeAlerts[0].timestamp}. Ativar planos de drenagem.</p>
                        </div>
                    </div>
                    <Button variant="contained" sx={{ bgcolor: 'white', color: 'red', fontWeight: 900, fontSize: '10px' }}>PROTOCOLOS</Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Wind Rose & Risk */}
                <div className="lg:col-span-1 space-y-6">
                    <Card sx={{ borderRadius: '2px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent>
                            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary' }}>Rosa dos Ventos (Frequência)</Typography>
                            <div className="h-[250px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={windRoseData}>
                                        <PolarGrid stroke="#eee" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900 }} />
                                        <Radar name="Vento" dataKey="A" stroke="#2148C0" fill="#2148C0" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: '2px', bgcolor: '#1C1C1C', color: 'white', border: 'none', boxShadow: '2xl' }}>
                        <CardContent>
                            <Typography variant="overline" sx={{ fontWeight: 900, color: 'gray.400' }}>Risco de Dispersão de Particulados</Typography>
                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Janela Crítica (Sore/Direção)</span>
                                    <Chip
                                        label={data.some(d => d.riskStatus === 'HIGH') ? "ALTO RISCO" : "BAIXO"}
                                        color={data.some(d => d.riskStatus === 'HIGH') ? "error" : "success"}
                                        size="small"
                                        sx={{ fontWeight: 900, borderRadius: '2px' }}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase leading-relaxed">
                                    Ventos de SE ({'>'}6m/s) sopram em direção à zona urbana.
                                    Sistema de canhões de névoa deve ser operado em modo automatizado.
                                </p>
                                <Button fullWidth variant="contained" sx={{ bgcolor: '#333', color: 'white', fontWeight: 900, py: 1.5, fontSize: '11px' }}>
                                    CONFIGURAR GATILHOS
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Operational Window & Trends */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Operational Heatmap */}
                    <Card sx={{ borderRadius: '2px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <div className="flex justify-between items-center mb-6">
                                <Typography variant="overline" sx={{ fontWeight: 900 }}>Janelas Operacionais (Escalabilidade)</Typography>
                                <Zap className="w-4 h-4 text-yellow-500" />
                            </div>
                            <div className="grid grid-cols-12 gap-1">
                                {operationalWindows.map((win, idx) => (
                                    <div
                                        key={idx}
                                        className={`
                                            h-10 rounded-sm flex flex-col items-center justify-center group relative
                                            ${win.status === 'OPEN' ? 'bg-green-500/20 text-green-700' : win.status === 'WARNING' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-red-500/20 text-red-700'}
                                        `}
                                    >
                                        <span className="text-[8px] font-black">{win.time.split(':')[0]}</span>
                                        <div className="absolute bottom-full mb-2 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                            Score: {win.score.toFixed(1)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[9px] font-bold text-gray-400">00:00</span>
                                <span className="text-[9px] font-bold text-gray-400">Tempo Real</span>
                                <span className="text-[9px] font-bold text-gray-400">23:00</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Wind Speed Line Chart */}
                    <Card sx={{ borderRadius: '2px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="overline" sx={{ fontWeight: 900, mb: 4, display: 'block' }}>Velocidade do Vento vs. Precipitação</Typography>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="timestamp" tick={{ fontSize: 10, fontWeight: 700 }} />
                                        <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1C1C1C', border: 'none', borderRadius: '4px', color: 'white' }}
                                            itemStyle={{ fontSize: '11px', fontWeight: 900 }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                                        <Line type="monotone" dataKey="windSpeed" stroke="#2148C0" strokeWidth={3} dot={false} name="Velocidade (m/s)" />
                                        <Line type="monotone" dataKey="rainMm" stroke="#F43F5E" strokeWidth={3} dot={false} name="Chuva (mm)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---
const ConditionWidget = ({ icon, label, value, trend, isAlert = false }: { icon: any, label: string, value: string, trend: string, isAlert?: boolean }) => (
    <div className={`p-5 rounded-sm border ${isAlert ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-white dark:bg-[#1C1C1C] border-gray-200 dark:border-white/5'} shadow-sm transition-all hover:translate-y-[-2px]`}>
        <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-sm ${isAlert ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</span>
        </div>
        <div className="flex justify-between items-end">
            <span className={`text-2xl font-black tracking-tighter ${isAlert ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>{value}</span>
            <div className={`flex items-center gap-1 text-[9px] font-black ${trend.includes('+') ? 'text-green-500' : trend === 'Alerta' ? 'text-red-500' : 'text-gray-400'}`}>
                {trend}
                {trend.includes('%') && <TrendingUp size={10} />}
            </div>
        </div>
    </div>
);

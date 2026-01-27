import React from 'react';
import { notificationService, Notification } from '../utils/notifications';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    React.useEffect(() => {
        return notificationService.subscribe((n) => setNotifications([...n]));
    }, []);

    if (notifications.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStyles = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/30';
            case 'error': return 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800/30';
            default: return 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30';
        }
    };

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`
                        pointer-events-auto
                        flex items-start gap-4 p-4 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border
                        animate-in slide-in-from-right duration-500
                        ${getStyles(n.type)}
                    `}
                >
                    <div className="shrink-0 mt-0.5">
                        {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-black text-gray-900 dark:text-white leading-tight`}>
                            {n.message}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                            Notificação do Sistema
                        </p>
                    </div>

                    <button
                        onClick={() => notificationService.remove(n.id)}
                        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Time-to-live progress bar visual */}
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400/30 w-full animate-progress origin-left"></div>
                    </div>
                    <style>{`
                        @keyframes progress {
                            from { transform: scaleX(1); }
                            to { transform: scaleX(0); }
                        }
                        .animate-progress {
                            animation: progress 5s linear forwards;
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};


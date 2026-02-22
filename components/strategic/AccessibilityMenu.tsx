import React, { useState, useEffect } from 'react';
import { 
    Accessibility, 
    X, 
    Type, 
    Contrast, 
    MoveHorizontal, 
    AlignJustify, 
    Ghost, 
    RotateCcw
} from 'lucide-react';

export const AccessibilityMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // States
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);
    const [spacing, setSpacing] = useState(0);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [dyslexic, setDyslexic] = useState(false);
    const [animations, setAnimations] = useState(true);

    useEffect(() => {
        const root = document.documentElement;
        root.style.fontSize = `${fontSize}%`;
        root.style.letterSpacing = `${spacing}px`;
        root.style.lineHeight = `${lineHeight}`;
        
        if (contrast) root.classList.add('high-contrast');
        else root.classList.remove('high-contrast');

        if (dyslexic) root.classList.add('dyslexia-font');
        else root.classList.remove('dyslexia-font');

        if (!animations) root.classList.add('stop-animations');
        else root.classList.remove('stop-animations');

    }, [fontSize, contrast, spacing, lineHeight, dyslexic, animations]);

    const reset = () => {
        setFontSize(100);
        setContrast(false);
        setSpacing(0);
        setLineHeight(1.5);
        setDyslexic(false);
        setAnimations(true);
    };

    return (
        <div className="fixed right-6 bottom-6 z-[999]">
            {/* Trigger FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-black text-white rotate-90' : 'bg-blue-600 text-white hover:scale-110'}`}
            >
                {isOpen ? <X size={24} /> : <Accessibility size={28} />}
            </button>

            {/* Menu Panel */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[320px] bg-white dark:bg-[#1C1C1C] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Acessibilidade</h3>
                        <button onClick={reset} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors" title="Resetar">
                            <RotateCcw size={14} className="text-black dark:text-white" />
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-2 gap-4">
                        <OptionButton 
                            active={contrast} 
                            onClick={() => setContrast(!contrast)} 
                            icon={<Contrast size={20} />} 
                            label="Contraste" 
                        />
                        <OptionButton 
                            active={fontSize > 100} 
                            onClick={() => setFontSize(prev => prev >= 140 ? 100 : prev + 10)} 
                            icon={<Type size={20} />} 
                            label="Texto +" 
                        />
                        <OptionButton 
                            active={spacing > 0} 
                            onClick={() => setSpacing(prev => prev >= 4 ? 0 : prev + 1)} 
                            icon={<MoveHorizontal size={20} />} 
                            label="Espaço" 
                        />
                        <OptionButton 
                            active={lineHeight > 1.5} 
                            onClick={() => setLineHeight(prev => prev >= 2 ? 1.5 : prev + 0.25)} 
                            icon={<AlignJustify size={20} />} 
                            label="Linha" 
                        />
                        <OptionButton 
                            active={dyslexic} 
                            onClick={() => setDyslexic(!dyslexic)} 
                            icon={<span className="font-black text-sm">Df</span>} 
                            label="Dislexia" 
                        />
                        <OptionButton 
                            active={!animations} 
                            onClick={() => setAnimations(!animations)} 
                            icon={<Ghost size={20} />} 
                            label="Parar Anim." 
                        />
                    </div>

                    <div className="p-4 text-center bg-gray-50 dark:bg-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-black/40">gSocial Inclusivo</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const OptionButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-black dark:text-white hover:border-blue-200'}`}
    >
        <div className={active ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
            {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
        {active && <div className="w-1 h-1 bg-white rounded-full mt-1 animate-pulse" />}
    </button>
);

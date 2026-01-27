import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex items-center gap-2 mb-6 text-sm">
            <button
                onClick={() => items[0]?.onClick?.()}
                className="p-1.5 rounded-3xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
                <Home className="w-4 h-4 text-gray-400" />
            </button>

            {items.map((item, idx) => (
                <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                    {idx === items.length - 1 ? (
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                            {item.label}
                        </span>
                    ) : (
                        <button
                            onClick={item.onClick}
                            className="text-happiness-1 hover:text-happiness-2 font-medium transition-colors hover:underline"
                        >
                            {item.label}
                        </button>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;

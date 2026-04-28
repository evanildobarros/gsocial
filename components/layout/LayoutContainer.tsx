import React from 'react';

export const LayoutContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`max-w-7xl mx-auto w-full ${className}`}>
        {children}
    </div>
);

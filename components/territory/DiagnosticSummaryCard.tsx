import React, { useState, useEffect } from 'react';
import { Card, Typography, FormControl, Select, MenuItem, InputLabel, Box, CircularProgress } from '@mui/material';
import { Group as PeopleIcon } from '@mui/icons-material';
import { supabase } from '../../utils/supabase';
import { CommunityAssessment } from '../../types';

interface DiagnosticSummaryCardProps {
    onCommunitySelect?: (community: CommunityAssessment | null) => void;
}

export const DiagnosticSummaryCard: React.FC<DiagnosticSummaryCardProps> = ({ onCommunitySelect }) => {
    const [communities, setCommunities] = useState<CommunityAssessment[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const { data, error } = await supabase
                    .from('community_assessments')
                    .select('*')
                    .order('community_name', { ascending: true });

                if (error) throw error;
                if (data) setCommunities(data as CommunityAssessment[]);
            } catch (err) {
                console.error('Error fetching communities for summary:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunities();
    }, []);

    const selectedCommunity = communities.find(c => c.id === selectedId) || null;

    const handleSelectChange = (id: string) => {
        setSelectedId(id);
        const community = communities.find(c => c.id === id) || null;
        if (onCommunitySelect) onCommunitySelect(community);
    };

    if (loading) return <Box className="flex justify-center p-4"><CircularProgress size={20} /></Box>;

    return (
        <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 bg-white dark:bg-[#1C1C1C]">
            <Typography className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <PeopleIcon sx={{ fontSize: 14 }} className="text-orange-500" />
                Resumo do Diagnóstico
            </Typography>

            <FormControl fullWidth size="small" className="mb-4">
                <InputLabel className="text-xs font-bold">Selecionar Comunidade</InputLabel>
                <Select
                    value={selectedId}
                    label="Selecionar Comunidade"
                    onChange={(e) => handleSelectChange(e.target.value as string)}
                    sx={{ borderRadius: 0 }}
                >
                    <MenuItem value=""><em>Nenhuma</em></MenuItem>
                    {communities.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.community_name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Comunidade</span>
                    <span className="font-black text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{selectedCommunity?.community_name || '-'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Famílias</span>
                    <span className="font-black text-orange-500">{selectedCommunity?.estimated_families || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Perfil</span>
                    <span className="font-black text-gray-800 dark:text-gray-200">{selectedCommunity?.settlement_type || '-'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Relacionamento</span>
                    <span className="font-black text-amber-500">{selectedCommunity ? `${selectedCommunity.relationship_level}/5` : '-'}</span>
                </div>
            </div>
        </Card>
    );
};

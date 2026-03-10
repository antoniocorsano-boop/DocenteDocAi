import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import { Uda, AiSettings, KnowledgeBaseEntry } from '../types';
import InfoCard from './ui/InfoCard';
import { validateUdaVerticalCurriculum } from '../services/aiService';
interface UdaDetailModalProps {
    uda: Uda;
    onClose: () => void;
    onEdit: () => void;
    aiSettings: AiSettings;
    knowledgeBase: KnowledgeBaseEntry[];
}

const UdaDetailModal: React.FC<UdaDetailModalProps> = ({ uda, onClose, onEdit, aiSettings, knowledgeBase }) => {
  const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<string | null>(null);

    useEffect(() => {
        console.log(`Audit: Opened UDA detail modal for ${uda.id}: ${uda.title}`);
    }, [uda.id, uda.title]);

    const handleValidate = async () => {
        console.log(`Audit: Started AI validation for UDA ${uda.id}`);
        setIsValidating(true);
        setValidationResult(null);
        try {
            const result = await validateUdaVerticalCurriculum(aiSettings, uda, knowledgeBase);
            setValidationResult(result);
            console.log(`Audit: Completed AI validation for UDA ${uda.id}`);
        } catch (error) {
            console.error("Validation error:", error);
            alert("Errore durante la validazione AI.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleClose = () => {
        console.log(`Audit: Closed UDA detail modal for ${uda.id}`);
        onClose();
    };

    const handleEdit = () => {
        console.log(`Audit: Clicked edit button for UDA ${uda.id}`);
        onEdit();
    };

    return (
        <Dialog open onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{uda.title}</DialogTitle>
            <DialogContent sx={{ bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                {/* Metadata Chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip icon={<Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 16 }}>school</Box>} label={`Classe ${uda.classe}`} color="primary" variant="outlined" />
                    <Chip icon={<Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 16 }}>menu_book</Box>} label={uda.materia} color="secondary" variant="outlined" />
                    <Chip icon={<Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 16 }}>event</Box>} label={`${new Date(uda.startDate!).toLocaleDateString()} - ${new Date(uda.endDate!).toLocaleDateString()}`} variant="outlined" />
                </Box>

                {/* AI Validation Section */}
                <Box sx={{ bgcolor: 'primary.light', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'primary.contrastText' }}>
                            Validazione Curricolo Verticale
                        </Typography>
                        <Button variant="contained" onClick={handleValidate} disabled={isValidating} size="small">
                            {isValidating ? 'Validazione...' : 'Valida con AI'}
                        </Button>
                    </Box>
                    {validationResult && (
                        <Box sx={{ bgcolor: 'background.paper', borderRadius: 'var(--md-sys-shape-corner-large)', p: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.625 }}>{validationResult}</Typography>
                        </Box>
                    )}
                </Box>

                {/* Description */}
                <InfoCard title="Introduzione">
                    <Typography variant="body1" sx={{ lineHeight: 1.625 }}>{uda.introduction}</Typography>
                </InfoCard>

                {/* Phases Timeline */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'var(--md-sys-typescale-weight-bold)', letterSpacing: '0.05em' }}>Fasi di Lavoro</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {uda.phases.map((phase) => (
                            <Box key={phase.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 2, bgcolor: 'background.paper', borderRadius: 'var(--md-sys-shape-corner-medium)', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>{phase.title}</Typography>
                                    <Chip label={`${phase.duration}h`} size="small" color="secondary" />
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>{phase.description}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{phase.activities}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Additional Info Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <InfoCard title="Prodotto Finale" icon="inventory_2">
                        <Typography variant="body2">{uda.finalProduct}</Typography>
                    </InfoCard>
                    <InfoCard title="Valutazione" icon="fact_check">
                        <Typography variant="body2">{uda.evaluation}</Typography>
                    </InfoCard>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button variant="text" onClick={handleClose}>Chiudi</Button>
                <Button variant="contained" onClick={handleEdit} startIcon={<EditIcon />}>
                    Modifica nel Planner
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UdaDetailModal;


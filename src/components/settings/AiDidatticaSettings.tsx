// Settings - AI & Didattica Section
import React from 'react';
import { SettingsGroup } from './SettingsGroup';
import { InfoCard } from '../ui';
import { Typography, Button, Tabs, Tab, FormControl, InputLabel, NativeSelect, TextField as MuiTextField } from '@mui/material';
import ChipInputList from '../ChipInputList';
import { TimetableSettings } from '../../types';
import { AI_PROFILES, SCHOOL_LEVELS } from '../../constants';

interface AiDidatticaSettingsProps {
    localSettings: TimetableSettings;
    currentAiProfile: string;
    selLevel: string;
    selSpec: string;
    selYears: string[];
    selSections: string[];
    newSubjectName: string;
    onSettingChange: (key: string, value: unknown) => void;
    onAiProfileChange: (profile: keyof typeof AI_PROFILES) => void;
    onAddNextYear: () => void;
    onGenerateClasses: () => void;
    onAddSubject: () => void;
    setSelLevel: (level: string) => void;
    setSelSpec: (spec: string) => void;
    setSelYears: (years: string[] | ((prev: string[]) => string[])) => void;
    setSelSections: (sections: string[] | ((prev: string[]) => string[])) => void;
    setNewSubjectName: (name: string) => void;
    toggleAssociation: (classId: string, subjectId: string) => void;
    updateAssignmentHours: (classId: string, subjectId: string, hours: number) => void;
    handleBulkAssign: (subjectId: string) => void;
}

export const AiDidatticaSettings: React.FC<AiDidatticaSettingsProps> = ({
    localSettings,
    currentAiProfile,
    selLevel,
    selSpec,
    selYears,
    selSections,
    newSubjectName,
    onSettingChange,
    onAiProfileChange,
    onAddNextYear,
    onGenerateClasses,
    onAddSubject,
    setSelLevel,
    setSelSpec,
    setSelYears,
    setSelSections,
    setNewSubjectName,
    toggleAssociation,
    updateAssignmentHours,
    handleBulkAssign
}) => {
    return (
        <SettingsGroup
            id="ai_didattica"
            title="AI & Didattica"
            subtitle="Cervello AI e cattedra"
            icon="psychology"
            variant="outlined"
            defaultOpen={false}
        >
            {/* SEZIONE 1: MODELLO AI */}
            <div style={{marginBottom: 'var(--md-sys-spacing-4)',
                padding: 'var(--md-sys-spacing-4)',
                backgroundColor: 'var(--md-sys-color-surface-container)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-4)',
                    marginBottom: 'var(--md-sys-spacing-4)'}}>
                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                        color: 'var(--md-sys-color-secondary)'}}>smart_toy</span>
                    <Typography
                        variant="caption"
                        style={{color: 'var(--md-sys-color-secondary)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'}}
                    >
                        Modello Intelligenza
                    </Typography>
                </div>

                <Tabs
                    value={currentAiProfile}
                    onChange={(_, id) => onAiProfileChange(id as keyof typeof AI_PROFILES)}
                    aria-label="Profilo AI"
                    sx={{ bgcolor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-full)', border: '1px solid var(--md-sys-color-outline-variant)', minHeight: 'auto', p: 0.5 }}
                >
                    {(Object.keys(AI_PROFILES) as Array<keyof typeof AI_PROFILES>).map(key => (
                        <Tab
                            key={key}
                            value={key}
                            label={AI_PROFILES[key].label}
                            sx={{ borderRadius: 'var(--md-sys-shape-corner-full)', minHeight: 'auto', py: 1, px: 2, textTransform: 'uppercase', fontSize: 'var(--md-sys-typescale-label-small-font-size)' }}
                        />
                    ))}
                </Tabs>

                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--md-sys-spacing-3)',
                    padding: 'var(--md-sys-spacing-6)',
                    backgroundColor: currentAiProfile === 'esperto'
                        ? 'var(--md-sys-color-secondary-container)'
                        : 'var(--md-sys-color-primaryContainer)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    border: `var(--md-sys-border-width-thin) solid ${currentAiProfile === 'esperto'
                        ? 'var(--md-sys-color-secondary)'
                        : 'var(--md-sys-color-primary)'}`
                }}>
                    <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                        color: currentAiProfile === 'esperto'
                            ? 'var(--md-sys-color-on-secondary-container)'
                            : 'var(--md-sys-color-on-primary-container)',
                        marginTop: 'var(--md-sys-spacing-4)'}}>info</span>
                    <Typography
                        variant="body2"
                        style={{color: currentAiProfile === 'esperto'
                                ? 'var(--md-sys-color-on-secondary-container)'
                                : 'var(--md-sys-color-on-primary-container)',
                            lineHeight: 1.5,
                            margin: 0}}
                    >
                        {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                    </Typography>
                </div>
            </div>

            <div style={{display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-4)'}}>
                {/* SEZIONE 2: ANNO SCOLASTICO */}
                <div style={{padding: 'var(--md-sys-spacing-4)',
                    backgroundColor: 'var(--md-sys-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                    <div style={{display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--md-sys-spacing-4)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: 'var(--md-sys-color-primary)'}}>calendar_month</span>
                            <Typography
                                variant="overline"
                                style={{color: 'var(--md-sys-color-on-surface)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)',
                                    letterSpacing: '0.025em',
                                    textTransform: 'uppercase'}}
                            >
                                Anno Scolastico
                            </Typography>
                        </div>
                        <Button
                            onClick={onAddNextYear}
                            variant="outlined"
                        >
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                marginRight: 'var(--md-sys-spacing-4)'}}>add_circle</span>
                            Aggiungi
                        </Button>
                    </div>

                    <div style={{display: 'grid',
                        gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="anno-scolastico">Anno Corrente</InputLabel>
                            <NativeSelect inputProps={{ id: 'anno-scolastico' }} value={localSettings.annoScolasticoCorrente} onChange={e => onSettingChange('annoScolasticoCorrente', e.target.value)}>
                                {localSettings.anniScolastici.map(year => <option key={year} value={year}>{year}</option>)}
                            </NativeSelect>
                        </FormControl>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <ChipInputList
                                label="Storico Anni"
                                items={localSettings.anniScolastici}
                                onAdd={(item: string) => onSettingChange('anniScolastici', [...localSettings.anniScolastici, item])}
                                onRemove={(idx: number) => onSettingChange('anniScolastici', localSettings.anniScolastici.filter((_, i: number) => i !== idx))}
                                placeholder="Es: 2025/2026"
                                icon="history" />
                        </div>
                    </div>
                </div>

                {/* SEZIONE 3: GESTIONE CATTEDRA */}
                <div style={{padding: 'var(--md-sys-spacing-4)',
                    backgroundColor: 'var(--md-sys-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                    <div style={{display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--md-sys-spacing-4)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: 'var(--md-sys-color-secondary)'}}>school</span>
                            <Typography
                                variant="overline"
                                style={{color: 'var(--md-sys-color-on-surface)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)',
                                    letterSpacing: '0.025em',
                                    textTransform: 'uppercase'}}
                            >
                                Gestione Cattedra
                            </Typography>
                        </div>
                        <Button
                            onClick={() => {
                                if (confirm("Sei sicuro di voler svuotare tutta la cattedra?")) {
                                    onSettingChange('teachingAssignments', []);
                                }
                            }}
                            variant="outlined"
                        >
                            Svuota Tutto
                        </Button>
                    </div>

                    {/* FORMAZIONE CLASSI STRUTTURATA */}
                    <div style={{marginTop: 'var(--md-sys-spacing-4)',
                        padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-4)',
                            marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: 'var(--md-sys-color-primary)'}}>account_tree</span>
                            <Typography
                                variant="caption"
                                style={{color: 'var(--md-sys-color-primary)',
                                    fontWeight: 'var(--md-sys-typescale-weight-black)',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'}}
                            >
                                Formazione Classi Strutturata
                            </Typography>
                        </div>

                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--md-sys-spacing-4)',
                            marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel htmlFor="ordinamento-scolastico">Ordinamento Scolastico</InputLabel>
                                <NativeSelect inputProps={{ id: 'ordinamento-scolastico' }} value={selLevel} onChange={e => setSelLevel(e.target.value)}>
                                    {SCHOOL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </NativeSelect>
                            </FormControl>
                            <MuiTextField
                                label="Indirizzo / Specializzazione"
                                value={selSpec}
                                onChange={e => setSelSpec(e.target.value)}
                                placeholder="Es: Scientifico, CAT, Musicale..."
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }} />
                        </div>

                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--md-sys-spacing-4)',
                            marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <Typography
                                    variant="body2"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                >
                                    Livelli / Anni
                                </Typography>
                                <div style={{display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    {['1', '2', '3', '4', '5'].map(y => (
                                        <Button
                                            key={y}
                                            variant={selYears.includes(y) ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => setSelYears((prev: string[]) => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
                                            style={{
                                                minWidth: 'var(--md-sys-spacing-4)'
                                            }}
                                        >
                                            {y}° Anno
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--md-sys-spacing-4)'}}>
                                <Typography
                                    variant="body2"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                >
                                    Sezioni
                                </Typography>
                                <div style={{display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--md-sys-spacing-4)'}}>
                                    {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                                        <Button
                                            key={s}
                                            variant={selSections.includes(s) ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => setSelSections((prev: string[]) => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                                            style={{
                                                minWidth: 'var(--md-sys-spacing-4)'
                                            }}
                                        >
                                            {s}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={onGenerateClasses}
                            variant="contained"
                            disabled={selYears.length === 0 || selSections.length === 0}
                        >
                            <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)',
                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>auto_awesome</span>
                            Genera Combinazioni Classi
                        </Button>
                    </div>

                    {/* INPUT RAPIDI PER AGGIUNGERE MATERIE */}
                    <div style={{marginTop: 'var(--md-sys-spacing-4)',
                        padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <div style={{display: 'flex',
                            gap: 'var(--md-sys-spacing-4)',
                            alignItems: 'center'}}>
                            <div style={{
                                flex: 1
                            }}>
                                <input
                                    type="text"
                                    placeholder="Aggiungi Materia Singola (es: Italiano)"
                                    value={newSubjectName}
                                    onChange={e => setNewSubjectName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && onAddSubject()}
                                    style={{width: 'var(--md-sys-percent-100)'}}
                                />
                            </div>
                            <Button
                                onClick={onAddSubject}
                                variant="contained"
                            >
                                <span style={{
                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)'
                                }}>add</span>
                            </Button>
                        </div>
                    </div>

                    {/* MATRICE INTERATTIVA */}
                    <div style={{marginTop: 'var(--md-sys-spacing-4)',
                        padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                        overflowX: 'auto'}}>
                        <table style={{width: 'var(--md-sys-percent-100)'}}>
                            <thead>
                                <tr style={{backgroundColor: 'var(--md-sys-color-surface-container-high)'}}>
                                    <th style={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                        textAlign: 'left',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                        color: 'var(--md-sys-color-on-surface)',
                                        borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>Materia / Classe</th>
                                    {localSettings.classi.map(cls => (
                                        <th key={cls} style={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                            textAlign: 'center',
                                            fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                            color: 'var(--md-sys-color-on-surface)',
                                            borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                            borderLeft: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                            position: 'relative'}}>
                                            <div style={{display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 'var(--md-sys-spacing-4)'}}>
                                                <span>{cls}</span>
                                                <button
                                                    onClick={() => onSettingChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                    style={{background: 'none',
                                                        border: 'none',
                                                        color: 'var(--md-sys-color-error)',
                                                        cursor: 'pointer',
                                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                        padding: 'var(--md-sys-spacing-4)',
                                                        borderRadius: 'var(--md-sys-shape-corner-small)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: 'var(--md-sys-spacing-4)',
                                                        height: 'var(--md-sys-spacing-4)'}}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {localSettings.disciplines.map(subj => (
                                    <tr key={subj} style={{borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                        <td style={{padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                            borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                                            <div style={{display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 'var(--md-sys-spacing-4)'}}>
                                                <div style={{display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--md-sys-spacing-4)',
                                                    flex: 1}}>
                                                    <span style={{fontWeight: 'var(--md-sys-typescale-weight-medium)',
                                                        color: 'var(--md-sys-color-on-surface)'}}>{subj}</span>
                                                    <Button
                                                        onClick={() => handleBulkAssign(subj)}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        Associa a tutte
                                                    </Button>
                                                </div>
                                                <button
                                                    onClick={() => onSettingChange('disciplines', localSettings.disciplines.filter(s => s !== subj))}
                                                    style={{background: 'none',
                                                        border: 'none',
                                                        color: 'var(--md-sys-color-error)',
                                                        cursor: 'pointer',
                                                        padding: 'var(--md-sys-spacing-4)',
                                                        borderRadius: 'var(--md-sys-shape-corner-small)'}}
                                                >
                                                    <span style={{
                                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)'
                                                    }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                        {localSettings.classi.map(cls => {
                                            const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                            return (
                                                <td key={`${subj}-${cls}`} style={{padding: 'var(--md-sys-spacing-4)',
                                                    textAlign: 'center',
                                                    borderLeft: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                                    cursor: 'pointer'}}>
                                                    <div
                                                        onClick={() => toggleAssociation(cls, subj)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: 'var(--md-sys-spacing-3)',
                                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                            backgroundColor: assignment ? 'var(--md-sys-color-primaryContainer)' : 'var(--md-sys-color-surface-container)',
                                                            border: `var(--md-sys-border-width-thin) solid ${assignment ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                                            minHeight: 'var(--md-sys-spacing-4)'
                                                        }}
                                                    >
                                                        {assignment ? (
                                                            <>
                                                                <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-primary)',
                                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                    marginRight: 'var(--md-sys-spacing-4)'}}>check_circle</span>
                                                                <div style={{display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 'var(--md-sys-spacing-4)'}} onClick={e => e.stopPropagation()}>
                                                                    <input
                                                                        type="number"
                                                                        value={assignment.hoursPerWeek}
                                                                        onChange={e => updateAssignmentHours(assignment.classId, subj, parseInt(e.target.value) || 1)}
                                                                        style={{width: 'var(--md-sys-spacing-4)',
                                                                            padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)',
                                                                            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                                                                            borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                            backgroundColor: 'var(--md-sys-color-surface)',
                                                                            color: 'var(--md-sys-color-on-surface)',
                                                                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                            textAlign: 'center'}} />
                                                                    <span style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                                        color: 'var(--md-sys-color-on-surface-variant)'}}>h</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-outline-variant)',
                                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>add</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {localSettings.disciplines.length === 0 && (
                                    <tr>
                                        <td colSpan={localSettings.classi.length + 1} style={{padding: 'var(--md-sys-spacing-4)',
                                            textAlign: 'center',
                                            color: 'var(--md-sys-color-on-surface-variant)',
                                            fontStyle: 'italic'}}>
                                            Aggiungi una materia per iniziare la configurazione...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <InfoCard
                        title="Come funziona"
                        description="Questa matrice è il tuo centro di controllo. Clicca su una cella per associare una materia a una classe. Modifica il numero per impostare le ore settimanali."
                        icon="info"
                        variant="contained" />
                </div>
            </div>
        </SettingsGroup>
    );
};

export default AiDidatticaSettings;

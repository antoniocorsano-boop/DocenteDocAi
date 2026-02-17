// Settings - AI & Didattica Section
import React from 'react';
import { SettingsGroup } from './SettingsGroup';
import { M3Typography, TabGroup, M3Button, InfoCard, SelectField, TextField } from '../ui';
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
            variant="secondary"
            defaultOpen={false}
        >
            {/* SEZIONE 1: MODELLO AI */}
            <div style={{marginBottom: 'var(--app-spacing-container)',
                padding: 'var(--app-spacing-container)',
                backgroundColor: 'var(--app-color-surface-container)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-container)',
                    marginBottom: 'var(--app-spacing-container)'}}>
                    <span style={{fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--app-text-body)',
                        color: 'var(--app-color-secondary)'}}>smart_toy</span>
                    <M3Typography
                        variant="label-small"
                        style={{color: 'var(--app-color-secondary)',
                            fontWeight: 900,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'}}
                    >
                        Modello Intelligenza
                    </M3Typography>
                </div>

                <TabGroup
                    tabs={(Object.keys(AI_PROFILES) as Array<keyof typeof AI_PROFILES>).map(key => ({ 
                        id: key, 
                        label: AI_PROFILES[key].label, 
                        icon: AI_PROFILES[key].icon 
                    }))}
                    activeTab={currentAiProfile}
                    onTabChange={(id) => onAiProfileChange(id as keyof typeof AI_PROFILES)}
                    variant="primary" />

                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--app-spacing-element)',
                    padding: 'var(--app-spacing-section)',
                    backgroundColor: currentAiProfile === 'esperto'
                        ? 'var(--app-color-secondary-container)'
                        : 'var(--md-sys-color-primaryContainer)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    border: `var(--app-border-thin) solid ${currentAiProfile === 'esperto'
                        ? 'var(--app-color-secondary)'
                        : 'var(--app-color-primary)'}`
                }}>
                    <span style={{fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--app-text-body)',
                        color: currentAiProfile === 'esperto'
                            ? 'var(--app-color-on-secondary-container)'
                            : 'var(--app-color-on-primary-container)',
                        marginTop: 'var(--app-spacing-container)'}}>info</span>
                    <M3Typography
                        variant="body-medium"
                        style={{color: currentAiProfile === 'esperto'
                                ? 'var(--app-color-on-secondary-container)'
                                : 'var(--app-color-on-primary-container)',
                            lineHeight: 1.5,
                            margin: 0}}
                    >
                        {AI_PROFILES[currentAiProfile as keyof typeof AI_PROFILES]?.description}
                    </M3Typography>
                </div>
            </div>

            <div style={{display: 'flex',
                flexDirection: 'column',
                gap: 'var(--app-spacing-container)'}}>
                {/* SEZIONE 2: ANNO SCOLASTICO */}
                <div style={{padding: 'var(--app-spacing-container)',
                    backgroundColor: 'var(--app-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                    <div style={{display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--app-spacing-container)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-container)'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                color: 'var(--app-color-primary)'}}>calendar_month</span>
                            <M3Typography
                                variant="label-large"
                                style={{color: 'var(--app-color-on-surface)',
                                    fontWeight: 900,
                                    letterSpacing: '0.025em',
                                    textTransform: 'uppercase'}}
                            >
                                Anno Scolastico
                            </M3Typography>
                        </div>
                        <M3Button
                            onClick={onAddNextYear}
                            variant="tonal"
                        >
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                marginRight: 'var(--app-spacing-container)'}}>add_circle</span>
                            Aggiungi
                        </M3Button>
                    </div>

                    <div style={{display: 'grid',
                        gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                        gap: 'var(--app-spacing-container)'}}>
                        <SelectField
                            label="Anno Corrente"
                            value={localSettings.annoScolasticoCorrente}
                            onChange={e => onSettingChange('annoScolasticoCorrente', e.target.value)}
                        >
                            {localSettings.anniScolastici.map(year => <option key={year} value={year}>{year}</option>)}
                        </SelectField>

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
                <div style={{padding: 'var(--app-spacing-container)',
                    backgroundColor: 'var(--app-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                    <div style={{display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--app-spacing-container)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-container)'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                color: 'var(--app-color-secondary)'}}>school</span>
                            <M3Typography
                                variant="label-large"
                                style={{color: 'var(--app-color-on-surface)',
                                    fontWeight: 900,
                                    letterSpacing: '0.025em',
                                    textTransform: 'uppercase'}}
                            >
                                Gestione Cattedra
                            </M3Typography>
                        </div>
                        <M3Button
                            onClick={() => {
                                if (confirm("Sei sicuro di voler svuotare tutta la cattedra?")) {
                                    onSettingChange('teachingAssignments', []);
                                }
                            }}
                            variant="outlined"
                        >
                            Svuota Tutto
                        </M3Button>
                    </div>

                    {/* FORMAZIONE CLASSI STRUTTURATA */}
                    <div style={{marginTop: 'var(--app-spacing-container)',
                        padding: 'var(--app-spacing-container)',
                        backgroundColor: 'var(--app-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-container)',
                            marginBottom: 'var(--app-spacing-container)'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                color: 'var(--app-color-primary)'}}>account_tree</span>
                            <M3Typography
                                variant="label-small"
                                style={{color: 'var(--app-color-primary)',
                                    fontWeight: 900,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'}}
                            >
                                Formazione Classi Strutturata
                            </M3Typography>
                        </div>

                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--app-spacing-container)',
                            marginBottom: 'var(--app-spacing-container)'}}>
                            <SelectField
                                label="Ordinamento Scolastico"
                                value={selLevel}
                                onChange={e => setSelLevel(e.target.value)}
                            >
                                {SCHOOL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </SelectField>
                            <TextField
                                label="Indirizzo / Specializzazione"
                                value={selSpec}
                                onChange={e => setSelSpec(e.target.value)}
                                placeholder="Es: Scientifico, CAT, Musicale..." />
                        </div>

                        <div style={{display: 'grid',
                            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                            gap: 'var(--app-spacing-container)',
                            marginBottom: 'var(--app-spacing-container)'}}>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--app-spacing-container)'}}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 500}}
                                >
                                    Livelli / Anni
                                </M3Typography>
                                <div style={{display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--app-spacing-container)'}}>
                                    {['1', '2', '3', '4', '5'].map(y => (
                                        <M3Button
                                            key={y}
                                            variant={selYears.includes(y) ? 'filled' : 'outlined'}
                                            size="small"
                                            onClick={() => setSelYears((prev: string[]) => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
                                            style={{
                                                minWidth: 'var(--app-spacing-container)'
                                            }}
                                        >
                                            {y}° Anno
                                        </M3Button>
                                    ))}
                                </div>
                            </div>
                            <div style={{display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--app-spacing-container)'}}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 500}}
                                >
                                    Sezioni
                                </M3Typography>
                                <div style={{display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--app-spacing-container)'}}>
                                    {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                                        <M3Button
                                            key={s}
                                            variant={selSections.includes(s) ? 'filled' : 'outlined'}
                                            size="small"
                                            onClick={() => setSelSections((prev: string[]) => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                                            style={{
                                                minWidth: 'var(--app-spacing-container)'
                                            }}
                                        >
                                            {s}
                                        </M3Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <M3Button
                            onClick={onGenerateClasses}
                            variant="filled"
                            disabled={selYears.length === 0 || selSections.length === 0}
                        >
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                marginRight: 'var(--app-spacing-container)',
                                fontSize: 'var(--app-text-body)'}}>auto_awesome</span>
                            Genera Combinazioni Classi
                        </M3Button>
                    </div>

                    {/* INPUT RAPIDI PER AGGIUNGERE MATERIE */}
                    <div style={{marginTop: 'var(--app-spacing-container)',
                        padding: 'var(--app-spacing-container)',
                        backgroundColor: 'var(--app-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <div style={{display: 'flex',
                            gap: 'var(--app-spacing-container)',
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
                                    style={{width: 'var(--app-layout-full)'}}
                                />
                            </div>
                            <M3Button
                                onClick={onAddSubject}
                                variant="filled"
                            >
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)'
                                }}>add</span>
                            </M3Button>
                        </div>
                    </div>

                    {/* MATRICE INTERATTIVA */}
                    <div style={{marginTop: 'var(--app-spacing-container)',
                        padding: 'var(--app-spacing-container)',
                        backgroundColor: 'var(--app-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                        overflowX: 'auto'}}>
                        <table style={{width: 'var(--app-layout-full)'}}>
                            <thead>
                                <tr style={{backgroundColor: 'var(--md-sys-color-surface-container-high)'}}>
                                    <th style={{padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        color: 'var(--app-color-on-surface)',
                                        borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                        fontSize: 'var(--app-text-body)'}}>Materia / Classe</th>
                                    {localSettings.classi.map(cls => (
                                        <th key={cls} style={{padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            color: 'var(--app-color-on-surface)',
                                            borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                            borderLeft: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                            fontSize: 'var(--app-text-body)',
                                            position: 'relative'}}>
                                            <div style={{display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 'var(--app-spacing-container)'}}>
                                                <span>{cls}</span>
                                                <button
                                                    onClick={() => onSettingChange('classi', localSettings.classi.filter(c => c !== cls))}
                                                    style={{background: 'none',
                                                        border: 'none',
                                                        color: 'var(--md-sys-color-error)',
                                                        cursor: 'pointer',
                                                        fontSize: 'var(--app-text-body)',
                                                        padding: 'var(--app-spacing-container)',
                                                        borderRadius: 'var(--md-sys-shape-corner-small)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: 'var(--app-spacing-container)',
                                                        height: 'var(--app-spacing-container)'}}
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
                                    <tr key={subj} style={{borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                        <td style={{padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                            borderRight: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                                            <div style={{display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 'var(--app-spacing-container)'}}>
                                                <div style={{display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--app-spacing-container)',
                                                    flex: 1}}>
                                                    <span style={{fontWeight: 500,
                                                        color: 'var(--app-color-on-surface)'}}>{subj}</span>
                                                    <M3Button
                                                        onClick={() => handleBulkAssign(subj)}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        Associa a tutte
                                                    </M3Button>
                                                </div>
                                                <button
                                                    onClick={() => onSettingChange('disciplines', localSettings.disciplines.filter(s => s !== subj))}
                                                    style={{background: 'none',
                                                        border: 'none',
                                                        color: 'var(--md-sys-color-error)',
                                                        cursor: 'pointer',
                                                        padding: 'var(--app-spacing-container)',
                                                        borderRadius: 'var(--md-sys-shape-corner-small)'}}
                                                >
                                                    <span style={{
                                                        fontFamily: 'Material Symbols Outlined',
                                                        fontSize: 'var(--app-text-body)'
                                                    }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                        {localSettings.classi.map(cls => {
                                            const assignment = localSettings.teachingAssignments.find(a => a.classId === cls && a.subjectId === subj);
                                            return (
                                                <td key={`${subj}-${cls}`} style={{padding: 'var(--app-spacing-container)',
                                                    textAlign: 'center',
                                                    borderLeft: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                                    cursor: 'pointer'}}>
                                                    <div
                                                        onClick={() => toggleAssociation(cls, subj)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: 'var(--app-spacing-element)',
                                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                            backgroundColor: assignment ? 'var(--md-sys-color-primaryContainer)' : 'var(--md-sys-color-surfaceContainer)',
                                                            border: `var(--app-border-thin) solid ${assignment ? 'var(--app-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick) var(--app-easing-standard)',
                                                            minHeight: 'var(--app-spacing-container)'
                                                        }}
                                                    >
                                                        {assignment ? (
                                                            <>
                                                                <span style={{fontFamily: 'Material Symbols Outlined',
                                                                    color: 'var(--app-color-primary)',
                                                                    fontSize: 'var(--app-text-body)',
                                                                    marginRight: 'var(--app-spacing-container)'}}>check_circle</span>
                                                                <div style={{display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 'var(--app-spacing-container)'}} onClick={e => e.stopPropagation()}>
                                                                    <input
                                                                        type="number"
                                                                        value={assignment.hoursPerWeek}
                                                                        onChange={e => updateAssignmentHours(assignment.classId, subj, parseInt(e.target.value) || 1)}
                                                                        style={{width: 'var(--app-spacing-container)',
                                                                            padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)',
                                                                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline)',
                                                                            borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                            backgroundColor: 'var(--app-color-surface)',
                                                                            color: 'var(--app-color-on-surface)',
                                                                            fontSize: 'var(--app-text-body)',
                                                                            textAlign: 'center'}} />
                                                                    <span style={{fontSize: 'var(--app-text-body)',
                                                                        color: 'var(--md-sys-color-on-surface-variant)'}}>h</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span style={{fontFamily: 'Material Symbols Outlined',
                                                                color: 'var(--md-sys-color-outline-variant)',
                                                                fontSize: 'var(--app-text-body)'}}>add</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {localSettings.disciplines.length === 0 && (
                                    <tr>
                                        <td colSpan={localSettings.classi.length + 1} style={{padding: 'var(--app-spacing-container)',
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
                        variant="primary" />
                </div>
            </div>
        </SettingsGroup>
    );
};

export default AiDidatticaSettings;

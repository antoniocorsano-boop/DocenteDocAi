// Settings - Interface & Visual Experience Section
import React from 'react';
import { SettingsGroup } from './SettingsGroup';
import { M3Typography, TabGroup, M3Button, TextField } from '../ui';
import ThemeBubble from '../ThemeBubble';
import { ThemeSettingsPanel } from './ThemeSettingsPanel';
import { TimetableSettings, AppThemeState } from '../../types';
import { THEME_CUSTOMIZATIONS } from '../../constants';

interface InterfaceSettingsProps {
    localSettings: TimetableSettings;
    themeState: AppThemeState;
    themePrompt: string;
    isGeneratingTheme: boolean;
    onSettingChange: (key: string, value: unknown) => void;
    onThemeChange: (key: string, value: unknown) => void;
    onSaveTheme: (theme: AppThemeState) => void;
    onGenerateTheme: () => void;
    onExportTheme: () => void;
    onImportTheme: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onForceRefresh: () => void;
    setThemePrompt: (prompt: string) => void;
}

export const InterfaceSettings: React.FC<InterfaceSettingsProps> = ({
    localSettings,
    themeState,
    themePrompt,
    isGeneratingTheme,
    onSettingChange,
    onThemeChange,
    onSaveTheme,
    onGenerateTheme,
    onExportTheme,
    onImportTheme,
    onForceRefresh,
    setThemePrompt
}) => {
    return (
        <SettingsGroup
            id="interface_experience"
            title="Interfaccia & Esperienza Visiva"
            subtitle="Personalizza l'aspetto e il comportamento dell'app"
            icon="palette"
            variant="filled"
            defaultOpen={true}
        >
            <div
                role="region"
                aria-label="Interfaccia & Esperienza Visiva"
                tabIndex={0}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-4)',
                    padding: 'var(--md-sys-spacing-4)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    background: 'var(--md-sys-color-surface-container-low)',
                    boxShadow: 'var(--md-sys-elevation-level1)'
                }}
            >
                <M3Typography variant="label-large" style={{
                    color: 'var(--md-sys-color-on-surface)',
                    fontWeight: 'var(--md-sys-typescale-weight-black)',
                    marginBottom: 'var(--md-sys-spacing-3)'
                }}>
                    Interfaccia & Esperienza Visiva
                </M3Typography>
                <M3Typography variant="body-small" style={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    marginBottom: 'var(--md-sys-spacing-4)',
                    opacity: 'var(--md-sys-state-opacity-caption)'
                }}>
                    Personalizza l'aspetto e il comportamento dell'app
                </M3Typography>

                {/* SEZIONE 1: MODALITÀ INTERFACCIA */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-3)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-3)'
                    }}>
                        <span style={{
                            fontSize: 'var(--md-sys-typescale-title-large-font-size)',
                            color: 'var(--md-sys-color-primary)'
                        }}>dashboard_customize</span>
                        <M3Typography variant="label-small" style={{color: 'var(--md-sys-color-primary)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>Modalità Interfaccia</M3Typography>
                    </div>
                    <TabGroup
                        tabs={[
                            { id: 'classic', label: 'Classica', icon: 'grid_view' },
                            { id: 'flow', label: 'Dinamica (Flow)', icon: 'account_tree' }
                        ]}
                        activeTab={localSettings.uiMode || 'classic'}
                        onTabChange={(id) => onSettingChange('uiMode', id)}
                        variant="filled" />
                    <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                        margin: 0}}>
                        {localSettings.uiMode === 'flow'
                            ? 'Modalità Flow: Interfaccia dinamica basata su flussi di lavoro e suggerimenti contestuali.'
                            : 'Modalità Classica: Layout standard con navigazione a griglia e accesso diretto ai moduli.'}
                    </M3Typography>
                </div>

                {/* SEZIONE 2: ECOISTEMA VISIVO */}
                <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-4)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: 'var(--md-sys-color-primary)'}}>auto_awesome</span>
                        <M3Typography variant="label-small" style={{color: 'var(--md-sys-color-primary)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>Ecosistema Visivo</M3Typography>
                    </div>
                    <div style={{display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-large), var(--md-sys-grid-fr-1)))',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        {[
                            { id: 'aura', label: 'Aura', icon: 'blur_on', desc: 'Glassmorphism' },
                            { id: 'expressive', label: 'Google', icon: 'android', desc: 'Expressive' },
                            { id: 'cupertino', label: 'Cupertino', icon: 'phone_iphone', desc: 'Apple Style' },
                            { id: 'windows', label: 'Windows', icon: 'desktop_windows', desc: 'Fluent Design' },
                            { id: 'flat', label: 'Flat', icon: 'layers', desc: 'Material 3' },
                            { id: 'minimal', label: 'Minimal', icon: 'check_box_outline_blank', desc: 'Essenziale' }
                        ].map(style => (
                            <button
                                key={style.id}
                                onClick={() => onThemeChange('visualStyle', style.id)}
                                style={{display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-4)',
                                    padding: 'var(--md-sys-spacing-4)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    border: themeState.visualStyle === style.id
                                        ? 'var(--md-sys-border-width-thick) solid var(--md-sys-color-primary)'
                                        : 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                    backgroundColor: themeState.visualStyle === style.id
                                        ? 'var(--md-sys-color-primary-container)'
                                        : 'var(--md-sys-color-surface-container-high)',
                                    cursor: 'pointer',
                                    transition: `all var(--md-sys-motion-duration-short1) var(--md-sys-motion-easing-standard)`,
                                    textAlign: 'center'}}
                            >
                                <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    color: themeState.visualStyle === style.id
                                        ? 'var(--md-sys-color-on-primary-container)'
                                        : 'var(--md-sys-color-on-surface-variant)'}}>{style.icon}</span>
                                <M3Typography variant="label-medium" style={{color: themeState.visualStyle === style.id
                                        ? 'var(--md-sys-color-on-primary-container)'
                                        : 'var(--md-sys-color-on-surface)',
                                    fontWeight: themeState.visualStyle === style.id ? 600 : 500,
                                    margin: 0}}>{style.label}</M3Typography>
                                <M3Typography variant="body-small" style={{color: themeState.visualStyle === style.id
                                        ? 'var(--md-sys-color-on-primary-container)'
                                        : 'var(--md-sys-color-on-surface-variant)',
                                    margin: 0,
                                    opacity: 'var(--md-sys-state-opacity-caption)'}}>{style.desc}</M3Typography>
                            </button>
                        ))}
                    </div>
                </div>

                {/* SEZIONE 3: TEMA E COLORI */}
                <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-4)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: 'var(--md-sys-color-primary)'}}>palette</span>
                        <M3Typography variant="label-small" style={{color: 'var(--md-sys-color-primary)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>Tema & Colori</M3Typography>
                    </div>

                    <div style={{marginBottom: 'var(--md-sys-spacing-4)'}}>
                        <TabGroup
                            tabs={[{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]}
                            activeTab={themeState.mode}
                            onTabChange={(id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode })}
                            variant="filled" />
                    </div>

                    <div style={{display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-medium), var(--md-sys-grid-fr-1)))',
                        gap: 'var(--md-sys-spacing-4)',
                        marginBottom: 'var(--md-sys-spacing-4)'}}>
                        {THEME_CUSTOMIZATIONS.map(theme => (
                            <ThemeBubble
                                key={theme.name}
                                name={theme.name}
                                colors={{
                                    primary: theme.colors.primary ?? 'var(--md-sys-color-primary)',
                                    secondary: theme.colors.secondary ?? 'var(--md-sys-color-secondary)',
                                    tertiary: theme.colors.tertiary ?? 'var(--md-sys-color-tertiary)'
                                }}
                                isSelected={themeState.customizationName === theme.name}
                                onClick={() => onSaveTheme({ ...themeState, customizationName: theme.name, customColors: theme.colors })} />
                        ))}
                    </div>

                    <div style={{borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                        paddingTop: 'var(--md-sys-spacing-4)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-4)',
                            marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                color: 'var(--md-sys-color-primary)'}}>magic_button</span>
                            <M3Typography variant="label-small" style={{color: 'var(--md-sys-color-primary)',
                                fontWeight: 'var(--md-sys-typescale-weight-black)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em'}}>Generatore AI</M3Typography>
                        </div>
                        <div style={{display: 'flex',
                            gap: 'var(--md-sys-spacing-4)',
                            alignItems: 'flex-end'}}>
                            <div style={{ flex: 1 }}>
                                <TextField
                                    label="Descrivi il tuo stile"
                                    value={themePrompt}
                                    onChange={e => setThemePrompt(e.target.value)}
                                    placeholder="Es. 'Colori tramonto'..."
                                    leadingIcon="palette" />
                            </div>
                            <M3Button
                                onClick={onGenerateTheme}
                                disabled={isGeneratingTheme || !themePrompt.trim()}
                                variant="filled"
                                style={{minWidth: '0',
                                    width: 'var(--md-sys-spacing-4)',
                                    height: 'var(--md-sys-spacing-4)',
                                    padding: '0',
                                    boxShadow: 'var(--md-sys-elevation-level2)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)'}}
                            >
                                <span style={{
                                }}>{isGeneratingTheme ? 'sync' : 'auto_awesome'}</span>
                            </M3Button>
                        </div>
                    </div>
                </div>

                {/* SEZIONE 4: PARAMETRI AVANZATI */}
                <div style={{marginTop: 'var(--md-sys-spacing-4)',
                    padding: 'var(--md-sys-spacing-4)',
                    backgroundColor: 'var(--md-sys-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)',
                        marginBottom: 'var(--md-sys-spacing-4)',
                        paddingBottom: 'var(--md-sys-spacing-4)',
                        borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: 'var(--md-sys-color-primary)'}}>tune</span>
                        <M3Typography
                            variant="label-small"
                            style={{color: 'var(--md-sys-color-primary)',
                                fontWeight: 'var(--md-sys-typescale-weight-black)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'}}
                        >
                            Parametri Strutturali
                        </M3Typography>
                    </div>
                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                >
                                    Intensità Blur Vetro
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                >
                                    {themeState.glassBlur || 30}px
                                </M3Typography>
                            </div>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={themeState.glassBlur || 30}
                                onChange={e => onThemeChange('glassBlur', parseInt(e.target.value))}
                                style={{width: 'var(--md-sys-percent-100)'}} />
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                >
                                    Scala Font
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                >
                                    {themeState.fontScale || 1}x
                                </M3Typography>
                            </div>
                            <input
                                type="range" min="0.8" max="1.4" step="0.1"
                                value={themeState.fontScale || 1}
                                onChange={e => onThemeChange('fontScale', parseFloat(e.target.value))}
                                style={{width: 'var(--md-sys-percent-100)'}} />
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                >
                                    Livello Contrasto
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                >
                                    {themeState.contrastLevel || 0}
                                </M3Typography>
                            </div>
                            <input
                                type="range" min="-50" max="50" step="5"
                                value={themeState.contrastLevel || 0}
                                onChange={e => onThemeChange('contrastLevel', parseInt(e.target.value))}
                                style={{width: 'var(--md-sys-percent-100)'}} />
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--md-sys-spacing-4)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-medium)'}}
                                >
                                    Arrotondamento Bordi
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)'}}
                                >
                                    x{themeState.radiusMultiplier || 1}
                                </M3Typography>
                            </div>
                            <div style={{display: 'flex',
                                gap: 'var(--md-sys-spacing-4)',
                                flexWrap: 'wrap'}}>
                                {[0.5, 1, 1.5, 2].map(m => (
                                    <M3Button
                                        key={m}
                                        variant={themeState.radiusMultiplier === m ? 'filled' : 'outlined'}
                                        size="small"
                                        onClick={() => onThemeChange('radiusMultiplier', m)}
                                        style={{
                                            minWidth: 'var(--md-sys-spacing-4)'
                                        }}
                                    >
                                        {m === 1 ? 'Standard' : `${m}x`}
                                    </M3Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEZIONE 5: EXPORT/IMPORT TEMA */}
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
                            color: 'var(--md-sys-color-primary)'}}>import_export</span>
                        <M3Typography
                            variant="label-small"
                            style={{color: 'var(--md-sys-color-primary)',
                                fontWeight: 'var(--md-sys-typescale-weight-black)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'}}
                        >
                            Backup Tema
                        </M3Typography>
                    </div>
                    <M3Typography
                        variant="body-medium"
                        style={{color: 'var(--md-sys-color-on-surface-variant)',
                            marginBottom: 'var(--md-sys-spacing-4)',
                            lineHeight: 1.5}}
                    >
                        Salva o carica configurazioni di tema personalizzate per riutilizzarle in futuro.
                    </M3Typography>
                    <div style={{display: 'flex',
                        gap: 'var(--md-sys-spacing-4)',
                        alignItems: 'center'}}>
                        <M3Button
                            onClick={onExportTheme}
                            variant="outlined"
                        >
                            <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)',
                                fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>download</span>
                            ESPORTA TEMA
                        </M3Button>
                        <div style={{
                            position: 'relative'
                        }}>
                            <input
                                type="file"
                                accept=".json"
                                onChange={onImportTheme}
                                style={{
                                    position: 'absolute',
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    overflow: 'hidden'
                                }}
                                id="theme-import" />
                            <label htmlFor="theme-import" style={{
                                cursor: 'pointer'
                            }}>
                                <M3Button
                                    variant="outlined"
                                >
                                    <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)',
                                        fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}>upload</span>
                                    IMPORTA TEMA
                                </M3Button>
                            </label>
                        </div>
                    </div>
                </div>

                {/* SEZIONE 6: MANUTENZIONE BRAND */}
                <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-4)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: 'var(--md-sys-color-primary)'}}>refresh</span>
                        <M3Typography variant="label-small" style={{color: 'var(--md-sys-color-primary)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>Manutenzione Brand</M3Typography>
                    </div>
                    <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                        margin: 0}}>Se visualizzi ancora il vecchio logo o nomi non corretti, forza il ricaricamento della cache.</M3Typography>
                    <M3Button
                        onClick={onForceRefresh}
                        variant="tonal"
                    >
                        <span className="material-symbols-outlined" style={{marginRight: 'var(--md-sys-spacing-4)'}}>cached</span>
                        AGGIORNA BRAND E CACHE
                    </M3Button>
                </div>

                {/* SEZIONE 7: M3 THEME SETTINGS PANEL */}
                <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-4)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)'}}>
                        <span className="material-symbols-outlined" style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: 'var(--md-sys-color-primary)'}}>tune</span>
                        <M3Typography variant="label-small" style={{color: 'var(--md-sys-color-primary)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>M3 Theme Panel</M3Typography>
                    </div>
                    <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                        margin: 0}}>Personalizza i token M3 per colori, tipografia, spacing e motion con anteprima live.</M3Typography>
                    <ThemeSettingsPanel />
                </div>
            </div>
        </SettingsGroup>
    );
};

export default InterfaceSettings;

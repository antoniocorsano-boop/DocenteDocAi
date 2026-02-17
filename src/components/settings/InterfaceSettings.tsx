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
            variant="primary"
            defaultOpen={true}
        >
            <div
                role="region"
                aria-label="Interfaccia & Esperienza Visiva"
                tabIndex={0}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-container)',
                    padding: 'var(--app-spacing-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    background: 'var(--md-sys-color-surface-container-low)',
                    boxShadow: 'var(--md-sys-elevation-level1)'
                }}
            >
                <M3Typography variant="label-large" style={{
                    color: 'var(--app-color-on-surface)',
                    fontWeight: 900,
                    marginBottom: 'var(--app-spacing-element)'
                }}>
                    Interfaccia & Esperienza Visiva
                </M3Typography>
                <M3Typography variant="body-small" style={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    marginBottom: 'var(--app-spacing-container)',
                    opacity: 0.8
                }}>
                    Personalizza l'aspetto e il comportamento dell'app
                </M3Typography>

                {/* SEZIONE 1: MODALITÀ INTERFACCIA */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-element)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-element)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-title)',
                            color: 'var(--app-color-primary)'
                        }}>dashboard_customize</span>
                        <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                            fontWeight: 900,
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
                        variant="primary" />
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
                    gap: 'var(--app-spacing-container)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-container)'}}>
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            color: 'var(--app-color-primary)'}}>auto_awesome</span>
                        <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>Ecosistema Visivo</M3Typography>
                    </div>
                    <div style={{display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-large), var(--md-sys-grid-fr-1)))',
                        gap: 'var(--app-spacing-container)'}}>
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
                                    gap: 'var(--app-spacing-container)',
                                    padding: 'var(--app-spacing-container)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    border: themeState.visualStyle === style.id
                                        ? 'var(--app-border-thick) solid var(--app-color-primary)'
                                        : 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                    backgroundColor: themeState.visualStyle === style.id
                                        ? 'var(--app-color-primary-container)'
                                        : 'var(--md-sys-color-surface-container-high)',
                                    cursor: 'pointer',
                                    transition: `all var(--md-sys-motion-duration-short1) var(--app-easing-standard)`,
                                    textAlign: 'center'}}
                            >
                                <span style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-body)',
                                    color: themeState.visualStyle === style.id
                                        ? 'var(--app-color-on-primary-container)'
                                        : 'var(--md-sys-color-on-surface-variant)'}}>{style.icon}</span>
                                <M3Typography variant="label-medium" style={{color: themeState.visualStyle === style.id
                                        ? 'var(--app-color-on-primary-container)'
                                        : 'var(--app-color-on-surface)',
                                    fontWeight: themeState.visualStyle === style.id ? 600 : 500,
                                    margin: 0}}>{style.label}</M3Typography>
                                <M3Typography variant="body-small" style={{color: themeState.visualStyle === style.id
                                        ? 'var(--app-color-on-primary-container)'
                                        : 'var(--md-sys-color-on-surface-variant)',
                                    margin: 0,
                                    opacity: 0.8}}>{style.desc}</M3Typography>
                            </button>
                        ))}
                    </div>
                </div>

                {/* SEZIONE 3: TEMA E COLORI */}
                <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-container)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-container)'}}>
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            color: 'var(--app-color-primary)'}}>palette</span>
                        <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>Tema & Colori</M3Typography>
                    </div>

                    <div style={{marginBottom: 'var(--app-spacing-container)'}}>
                        <TabGroup
                            tabs={[{ id: 'light', label: 'Chiaro', icon: 'light_mode' }, { id: 'dark', label: 'Scuro', icon: 'dark_mode' }, { id: 'system', label: 'Sistema', icon: 'brightness_auto' }]}
                            activeTab={themeState.mode}
                            onTabChange={(id) => onSaveTheme({ ...themeState, mode: id as typeof themeState.mode })}
                            variant="primary" />
                    </div>

                    <div style={{display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-sizing-grid-medium), var(--md-sys-grid-fr-1)))',
                        gap: 'var(--app-spacing-container)',
                        marginBottom: 'var(--app-spacing-container)'}}>
                        {THEME_CUSTOMIZATIONS.map(theme => (
                            <ThemeBubble
                                key={theme.name}
                                name={theme.name}
                                colors={{
                                    primary: theme.colors.primary ?? 'var(--app-color-primary)',
                                    secondary: theme.colors.secondary ?? 'var(--app-color-secondary)',
                                    tertiary: theme.colors.tertiary ?? 'var(--sys-tertiary)'
                                }}
                                isSelected={themeState.customizationName === theme.name}
                                onClick={() => onSaveTheme({ ...themeState, customizationName: theme.name, customColors: theme.colors })} />
                        ))}
                    </div>

                    <div style={{borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                        paddingTop: 'var(--app-spacing-container)'}}>
                        <div style={{display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-container)',
                            marginBottom: 'var(--app-spacing-container)'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                color: 'var(--app-color-primary)'}}>magic_button</span>
                            <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em'}}>Generatore AI</M3Typography>
                        </div>
                        <div style={{display: 'flex',
                            gap: 'var(--app-spacing-container)',
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
                                    width: 'var(--app-spacing-container)',
                                    height: 'var(--app-spacing-container)',
                                    padding: '0',
                                    boxShadow: 'var(--md-sys-elevation-level2)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)'}}
                            >
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined'
                                }}>{isGeneratingTheme ? 'sync' : 'auto_awesome'}</span>
                            </M3Button>
                        </div>
                    </div>
                </div>

                {/* SEZIONE 4: PARAMETRI AVANZATI */}
                <div style={{marginTop: 'var(--app-spacing-container)',
                    padding: 'var(--app-spacing-container)',
                    backgroundColor: 'var(--app-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-container)',
                        marginBottom: 'var(--app-spacing-container)',
                        paddingBottom: 'var(--app-spacing-container)',
                        borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'}}>
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            color: 'var(--app-color-primary)'}}>tune</span>
                        <M3Typography
                            variant="label-small"
                            style={{color: 'var(--app-color-primary)',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'}}
                        >
                            Parametri Strutturali
                        </M3Typography>
                    </div>
                    <div style={{display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--app-spacing-container)'}}>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 500}}
                                >
                                    Intensità Blur Vetro
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 600}}
                                >
                                    {themeState.glassBlur || 30}px
                                </M3Typography>
                            </div>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={themeState.glassBlur || 30}
                                onChange={e => onThemeChange('glassBlur', parseInt(e.target.value))}
                                style={{width: 'var(--app-layout-full)'}} />
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 500}}
                                >
                                    Scala Font
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 600}}
                                >
                                    {themeState.fontScale || 1}x
                                </M3Typography>
                            </div>
                            <input
                                type="range" min="0.8" max="1.4" step="0.1"
                                value={themeState.fontScale || 1}
                                onChange={e => onThemeChange('fontScale', parseFloat(e.target.value))}
                                style={{width: 'var(--app-layout-full)'}} />
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 500}}
                                >
                                    Livello Contrasto
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 600}}
                                >
                                    {themeState.contrastLevel || 0}
                                </M3Typography>
                            </div>
                            <input
                                type="range" min="-50" max="50" step="5"
                                value={themeState.contrastLevel || 0}
                                onChange={e => onThemeChange('contrastLevel', parseInt(e.target.value))}
                                style={{width: 'var(--app-layout-full)'}} />
                        </div>
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--app-spacing-container)'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <M3Typography
                                    variant="body-medium"
                                    style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 500}}
                                >
                                    Arrotondamento Bordi
                                </M3Typography>
                                <M3Typography
                                    variant="body-small"
                                    style={{color: 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 600}}
                                >
                                    x{themeState.radiusMultiplier || 1}
                                </M3Typography>
                            </div>
                            <div style={{display: 'flex',
                                gap: 'var(--app-spacing-container)',
                                flexWrap: 'wrap'}}>
                                {[0.5, 1, 1.5, 2].map(m => (
                                    <M3Button
                                        key={m}
                                        variant={themeState.radiusMultiplier === m ? 'filled' : 'outlined'}
                                        size="small"
                                        onClick={() => onThemeChange('radiusMultiplier', m)}
                                        style={{
                                            minWidth: 'var(--app-spacing-container)'
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
                            color: 'var(--app-color-primary)'}}>import_export</span>
                        <M3Typography
                            variant="label-small"
                            style={{color: 'var(--app-color-primary)',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'}}
                        >
                            Backup Tema
                        </M3Typography>
                    </div>
                    <M3Typography
                        variant="body-medium"
                        style={{color: 'var(--md-sys-color-on-surface-variant)',
                            marginBottom: 'var(--app-spacing-container)',
                            lineHeight: 1.5}}
                    >
                        Salva o carica configurazioni di tema personalizzate per riutilizzarle in futuro.
                    </M3Typography>
                    <div style={{display: 'flex',
                        gap: 'var(--app-spacing-container)',
                        alignItems: 'center'}}>
                        <M3Button
                            onClick={onExportTheme}
                            variant="outlined"
                        >
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                marginRight: 'var(--app-spacing-container)',
                                fontSize: 'var(--app-text-body)'}}>download</span>
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
                                    <span style={{fontFamily: 'Material Symbols Outlined',
                                        marginRight: 'var(--app-spacing-container)',
                                        fontSize: 'var(--app-text-body)'}}>upload</span>
                                    IMPORTA TEMA
                                </M3Button>
                            </label>
                        </div>
                    </div>
                </div>

                {/* SEZIONE 6: MANUTENZIONE BRAND */}
                <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-container)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-container)'}}>
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            color: 'var(--app-color-primary)'}}>refresh</span>
                        <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'}}>Manutenzione Brand</M3Typography>
                    </div>
                    <M3Typography variant="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)',
                        margin: 0}}>Se visualizzi ancora il vecchio logo o nomi non corretti, forza il ricaricamento della cache.</M3Typography>
                    <M3Button
                        onClick={onForceRefresh}
                        variant="tonal"
                    >
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            marginRight: 'var(--app-spacing-container)'}}>cached</span>
                        AGGIORNA BRAND E CACHE
                    </M3Button>
                </div>

                {/* SEZIONE 7: M3 THEME SETTINGS PANEL */}
                <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-container)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-container)'}}>
                        <span style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            color: 'var(--app-color-primary)'}}>tune</span>
                        <M3Typography variant="label-small" style={{color: 'var(--app-color-primary)',
                            fontWeight: 900,
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

// MD3 Compliant - Block P Migration Complete (2 violations eliminated)
// Note: Font sizes (rem values) retained for typography per MD3 policy
import React, { useState, useRef } from 'react';
import NKAHeaderAuraButton from '../nka/NKAHeaderAuraButton';
import Logo from './Logo';
import { HeaderProps } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import NotificationsPopover from './NotificationsPopover';
import {
    M3Dialog,
    M3DialogContent,
    M3DialogActions,
    M3Button,
    InfoCard,
    Avatar,
    AiThinkingGem,
    M3Typography
} from './ui';

import type { ActionsPopoverProps } from '../types';

const ActionsPopover: React.FC<ActionsPopoverProps> = (props) => {
    const { onClose, onOpenImageAnalysis, onOpenVideoAnalysis, onOpenHelp, user, onShareClick, unreadCount, onOpenNotifications, installPrompt, onInstallApp, onNavigate } = props;
    const popoverRef = useRef<HTMLDivElement>(null);

    // Focus management: trap focus within the popover and set initial focus when opened
    const getFocusableElements = () => {
        if (!popoverRef.current) return [] as HTMLElement[];
        const nodes = popoverRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        return Array.from(nodes).filter(el => {
            const style = window.getComputedStyle(el);
            return style.visibility !== 'hidden' && style.display !== 'none';
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const focusables = getFocusableElements();
        if (focusables.length > 0) {
            focusables[0].focus();
        } else if (popoverRef.current) {
            popoverRef.current.setAttribute('tabindex', '-1');
            popoverRef.current.focus();
        }
    }, []);

    const handleActionClick = (action: () => void) => {
        action();
        onClose();
    };

    const MenuItem: React.FC<{
        icon: string;
        label: string;
        onClick: () => void;
        badge?: number | string;
        variant?: 'primary' | 'secondary' | 'error';
    }> = ({ icon, label, onClick, badge, variant = 'primary' }) => {
        const getItemColors = () => {
            switch (variant) {
                case 'error':
                    return {
                        background: 'var(--md-sys-color-error-container)',
                        onBackground: 'var(--md-sys-color-on-error-container)',
                        iconBg: 'var(--md-sys-color-error-container)',
                        iconColor: 'var(--md-sys-color-error)'
                    };
                case 'secondary':
                    return {
                        background: 'var(--md-sys-color-secondary-container)',
                        onBackground: 'var(--md-sys-color-on-secondary-container)',
                        iconBg: 'var(--md-sys-color-secondary-container)',
                        iconColor: 'var(--md-sys-color-secondary)'
                    };
                default:
                    return {
                        background: 'var(--md-sys-color-primaryContainer)',
                        onBackground: 'var(--md-sys-color-on-primaryContainer)',
                        iconBg: 'var(--md-sys-color-primaryContainer)',
                        iconColor: 'var(--md-sys-color-primary)'
                    };
            }
        };

        const colors = getItemColors();

        return (
            <button
                onClick={onClick}
                style={{width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: `var(--md-sys-spacing-3)`,
                    padding: `var(--md-sys-spacing-4)`,
                    borderRadius: `var(--md-sys-shape-corner-medium)`,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--md-sys-color-on-surface)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: `all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`
                }}
                onMouseEnter={() => {
                }}
                onMouseLeave={() => {
                }}
                onFocus={() => {
                }}
                onBlur={() => {
                }}
                aria-label={label}
            >
                <div
                    style={{width: 'var(--md-sys-spacing-6)',
                        height: 'var(--md-sys-spacing-6)',
                        borderRadius: 'var(--md-sys-shape-corner-small)',
                        backgroundColor: colors.iconBg,
                        color: colors.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0}}
                >
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: `var(--md-sys-spacing-4)`}}
                    >
                        {icon}
                    </span>
                </div>
                <M3Typography
                    variant="body-medium"
                    style={{
                        flexGrow: 1,
                        fontWeight: '500'
                    }}
                >
                    {label}
                </M3Typography>
                {badge !== undefined && (
                    <span
                        style={{backgroundColor: 'var(--md-sys-color-error)',
                            color: 'var(--md-sys-color-on-error)',
                            fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                            fontWeight: '700',
                            padding: `0 var(--md-sys-spacing-2)`,
                            paddingTop: `var(--md-sys-spacing-1)`,
                            paddingBottom: `var(--md-sys-spacing-1)`,
                            borderRadius: `var(--md-sys-shape-corner-full)`,
                            lineHeight: 1}}
                    >
                        {badge}
                    </span>
                )}
                <span
                    style={{fontFamily: 'Material Symbols Outlined',
                        color: 'color-mix(in srgb, var(--md-sys-color-on-surface-variant) 30%, transparent)',
                        fontSize: 'var(--md-sys-spacing-3)',
                        transition: `transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`}}
                    onMouseEnter={() => {
                    }}
                    onMouseLeave={() => {
                    }}
                >
                    chevron_right
                </span>
            </button>
        );
    };

    return (
        <div
            ref={popoverRef}
            style={{position: 'fixed',
                top: `var(--md-sys-spacing-12)`,
                right: `var(--md-sys-spacing-4)`,
                backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)',
                borderRadius: `var(--md-sys-shape-corner-large)`,
                boxShadow: 'var(--md-sys-elevation-level3)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                display: 'flex',
                flexDirection: 'column',
                gap: `var(--md-sys-spacing-3)`,
                padding: `var(--md-sys-spacing-6)`,
                width: `var(--md-sys-spacing-20)`,
                maxWidth: `calc(100vw - var(--md-sys-spacing-4))`,
                zIndex: 1000}}
            role="dialog"
            aria-modal="true"
            onKeyDown={(e) => {
                if (e.key !== 'Tab') return;
                const focusables = getFocusableElements();
                if (focusables.length === 0) return;
                const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
                const goingBack = e.shiftKey;
                e.preventDefault();
                if (goingBack) {
                    const prevIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
                    focusables[prevIndex].focus();
                } else {
                    const nextIndex = currentIndex === -1 || currentIndex === focusables.length - 1 ? 0 : currentIndex + 1;
                    focusables[nextIndex].focus();
                }
            }}
        >
            <div
                style={{display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--md-sys-spacing-4)',
                    marginBottom: 'var(--md-sys-spacing-4)',
                    borderBottom: '1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 10%, transparent)'}}
            >
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)'}}>
                    <div style={{width: 'var(--md-sys-spacing-6)',
                        height: 'var(--md-sys-spacing-6)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'}}>
                        <Avatar
                            name={props.settings?.cognomeInsegnante && props.settings?.nomeInsegnante
                                ? `${props.settings.cognomeInsegnante} ${props.settings.nomeInsegnante}`
                                : props.settings?.nomeInsegnante || user?.displayName || 'Docente'}
                            src={user?.photoURL}
                            size="sm"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <M3Typography
                            variant="label-medium"
                            style={{fontWeight: '700',
                                color: 'var(--md-sys-color-primary)',
                                maxWidth: 'var(--md-sys-spacing-12)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'}}
                        >
                            {props.settings?.cognomeInsegnante && props.settings?.nomeInsegnante
                                ? `${props.settings.cognomeInsegnante} ${props.settings.nomeInsegnante}`
                                : props.settings?.nomeInsegnante || user?.displayName || 'Menu'}
                        </M3Typography>
                        <M3Typography
                            variant="label-small"
                            style={{color: 'var(--md-sys-color-on-surface-variant)',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'}}
                        >
                            {props.settings?.nomeIstituto || 'Docente'}
                        </M3Typography>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{width: 'var(--md-sys-spacing-5)',
                        height: 'var(--md-sys-spacing-5)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        transition: `all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`}}
                    onMouseEnter={() => {
                    }}
                    onMouseLeave={() => {
                    }}
                    aria-label="Chiudi menu"
                >
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-spacing-4)'}}
                    >
                        close
                    </span>
                </button>
            </div>

            <div style={{paddingLeft: 'var(--md-sys-spacing-2)', paddingRight: 'var(--md-sys-spacing-2)'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)'}}>
                    <MenuItem
                        icon="notifications"
                        label="Notifiche"
                        onClick={() => handleActionClick(onOpenNotifications)}
                        badge={unreadCount > 0 ? unreadCount : undefined}
                    />

                    <MenuItem
                        icon="settings"
                        label="Impostazioni"
                        onClick={() => handleActionClick(() => onNavigate('settings'))}
                    />

                    {installPrompt && onInstallApp && (
                        <MenuItem
                            icon="download"
                            label="Installa App"
                            onClick={() => handleActionClick(onInstallApp)}
                        />
                    )}

                    <div
                        style={{height: 'var(--md-sys-spacing-1)',
                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-outline-variant) 10%, transparent)',
                            margin: `var(--md-sys-spacing-2) var(--md-sys-spacing-1)`}}
                    />

                    <div style={{padding: 'var(--md-sys-spacing-2)', paddingLeft: 'var(--md-sys-spacing-3)'}}>
                        <M3Typography
                            variant="label-small"
                            style={{fontSize: 'var(--md-sys-spacing-4)',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'color-mix(in srgb, var(--md-sys-color-primary) 60%, transparent)'}}
                        >
                            Strumenti AI
                        </M3Typography>
                    </div>

                    <MenuItem
                        icon="image_search"
                        label="Analisi Immagine"
                        variant="secondary"
                        onClick={() => handleActionClick(onOpenImageAnalysis)}
                    />

                    <MenuItem
                        icon="movie_creation"
                        label="Genera Video (Veo)"
                        variant="secondary"
                        onClick={() => handleActionClick(onOpenVideoAnalysis)}
                    />

                    <div
                        style={{height: 'var(--md-sys-spacing-1)',
                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-outline-variant) 10%, transparent)',
                            margin: `var(--md-sys-spacing-2) var(--md-sys-spacing-1)`}}
                    />

                    <MenuItem
                        icon="help"
                        label="Guida & Novità"
                        onClick={() => handleActionClick(onOpenHelp)}
                    />

                    <MenuItem
                        icon="share"
                        label="Condividi App"
                        onClick={() => handleActionClick(onShareClick)}
                    />
                </div>
            </div>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = (props) => {
    const { showBackButton, user, settings, notifiche, setNotifiche, onOpenCircularAnalysis, onNavigate, isAiProcessing, installPrompt, onInstallApp, onOpenImageAnalysis, onOpenVideoAnalysis, onOpenHelp } = props;

    // Get display name from settings (teacher name/surname) or fallback to user
    const teacherName = settings?.nomeInsegnante || '';
    const teacherSurname = settings?.cognomeInsegnante || '';
    const isOnline = useOnlineStatus();

    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isShareInfoOpen, setIsShareInfoOpen] = useState(false);
    const notificationsAnchorRef = useRef<HTMLDivElement | null>(null);

    const unreadCount = notifiche.filter(n => !n.letta).length;

    const handleMarkAsRead = (notificationId: string) => {
        setNotifiche(prev => prev.map(n => n.id === notificationId ? { ...n, letta: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifiche(prev => prev.map(n => ({ ...n, letta: true })));
    };

    return (
        <>
            <header
                role="banner"
                style={{position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
                    boxShadow: 'var(--md-sys-elevation-level1)',
                    padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 'var(--md-sys-spacing-12)' // MD3 spacing token for minimum touch target
                }}
            >
                {/* Left section: Back button and Aura */}
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)'}}>
                    {showBackButton && (
                        <button
                            aria-label="Indietro"
                            onClick={props.onBack}
                            style={{width: 'var(--md-sys-spacing-6)',
                                height: 'var(--md-sys-spacing-6)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                backgroundColor: 'transparent',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--md-sys-color-on-surface-variant)',
                                transition: `all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`}}
                            onMouseEnter={() => {
                            }}
                            onMouseLeave={() => {
                            }}
                            onFocus={() => {
                            }}
                            onBlur={() => {
                            }}
                        >
                            <span
                                style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--md-sys-spacing-4)'}}
                            >
                                arrow_back
                            </span>
                        </button>
                    )}
                    <NKAHeaderAuraButton
                        hasNewNode={props.hasSuggestion}
                        onClick={props.onOpenOperations}
                        onLongPress={() => {}}
                    />
                </div>

                {/* Center section: Logo and AI indicator */}
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', flex: 1, justifyContent: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)'}}>
                        <div style={{cursor: 'pointer',
                            transition: `all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`}}>
                            <Logo
                                isAiThinking={isAiProcessing}
                                onHomeNavigate={() => !showBackButton && onNavigate('home')}
                            />
                        </div>
                    </div>
                    {isAiProcessing && <AiThinkingGem size="small" />}
                </div>

                {/* Right section: Status, Settings, Avatar/Menu */}
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)'}}>
                    {!isOnline && (
                        <div
                            title="Modalità Offline"
                            style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-1)',
                                padding: `var(--md-sys-spacing-1) var(--md-sys-spacing-2)`,
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                backgroundColor: 'var(--md-sys-color-error-container)',
                                color: 'var(--md-sys-color-on-error-container)'}}
                        >
                            <span
                                style={{fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--md-sys-spacing-3)'}}
                            >
                                cloud_off
                            </span>
                            <M3Typography variant="label-small" style={{ fontWeight: '500' }}>
                                Offline
                            </M3Typography>
                        </div>
                    )}
                    <button
                        aria-label="Impostazioni"
                        onClick={() => onNavigate('settings')}
                        style={{width: 'var(--md-sys-spacing-6)',
                            height: 'var(--md-sys-spacing-6)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--md-sys-color-on-surface-variant)',
                            transition: `all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`}}
                        onMouseEnter={() => {
                        }}
                        onMouseLeave={() => {
                        }}
                        onFocus={() => {
                        }}
                        onBlur={() => {
                        }}
                    >
                        <span
                            style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--md-sys-spacing-4)'}}
                        >
                            settings
                        </span>
                    </button>
                    <div
                        ref={notificationsAnchorRef}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <button
                            onClick={() => setIsActionsOpen(p => !p)}
                            aria-label="Menu"
                            style={{width: 'var(--md-sys-spacing-6)',
                                height: 'var(--md-sys-spacing-6)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                backgroundColor: 'transparent',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: `all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`}}
                            onMouseEnter={() => {
                            }}
                            onMouseLeave={() => {
                            }}
                            onFocus={() => {
                            }}
                            onBlur={() => {
                            }}
                        >
                            <div style={{width: 'var(--md-sys-spacing-6)',
                                height: 'var(--md-sys-spacing-6)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'}}>
                                <Avatar
                                    name={`${teacherSurname || ''} ${teacherName || 'Docente'}`.trim()}
                                    src={user?.photoURL}
                                    size="sm"
                                />
                            </div>
                            {unreadCount > 0 && (
                                <span
                                    style={{position: 'absolute',
                                        top: '-2px',
                                        right: '-2px',
                                        width: 'var(--md-sys-spacing-3)',
                                        height: 'var(--md-sys-spacing-3)',
                                        borderRadius: 'var(--md-sys-shape-corner-large)',
                                        backgroundColor: 'var(--md-sys-color-error)',
                                        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-surface-container-high)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'}}
                                    aria-label={`${unreadCount} notifiche non lette`}
                                >
                                    <span
                                        style={{fontSize: 'var(--md-sys-spacing-3)',
                                            fontWeight: '700',
                                            color: 'var(--md-sys-color-on-error)',
                                            lineHeight: 1}}
                                    >
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Backdrop and popovers outside header */}
            {isActionsOpen && (
                <>
                    <div
                        style={{position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-scrim) 50%, transparent)',
                            zIndex: 999}}
                        onClick={() => setIsActionsOpen(false)}
                    />
                    <ActionsPopover
                        {...props}
                        unreadCount={unreadCount}
                        onOpenNotifications={() => setIsNotificationsOpen(true)}
                        onClose={() => setIsActionsOpen(false)}
                        onShareClick={() => setIsShareInfoOpen(true)}
                        installPrompt={installPrompt}
                        onInstallApp={onInstallApp}
                        onOpenImageAnalysis={onOpenImageAnalysis}
                        onOpenVideoAnalysis={onOpenVideoAnalysis}
                        onOpenHelp={onOpenHelp}
                    />
                </>
            )}

            {isNotificationsOpen && (
                <>
                    <div
                        style={{position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-scrim) 50%, transparent)',
                            zIndex: 999}}
                        onClick={() => setIsNotificationsOpen(false)}
                    />
                    <NotificationsPopover
                        notifiche={notifiche}
                        onClose={() => setIsNotificationsOpen(false)}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAllAsRead={handleMarkAllAsRead}
                        onNavigate={onNavigate}
                        onOpenCircularAnalysis={onOpenCircularAnalysis}
                        anchorEl={notificationsAnchorRef.current}
                    />
                </>
            )}

            <M3Dialog
                isOpen={isShareInfoOpen}
                onClose={() => setIsShareInfoOpen(false)}
                title="Condividi Link"
            >
                <M3DialogContent>
                    <div style={{textAlign: 'center', padding: 'var(--md-sys-spacing-4)'}}>
                        <div
                            style={{
                                width: 'var(--md-sys-spacing-12)',
                                height: 'var(--md-sys-spacing-12)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                backgroundColor: 'var(--md-sys-color-primary-container)',
                                color: 'var(--md-sys-color-on-primary-container)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: `0 auto var(--md-sys-spacing-4)`,
                                fontSize: 'var(--md-sys-typescale-headline-large-font-size)' // 3xl equivalent
                            }}
                        >
                            <span
                            style={{
                                fontFamily: 'Material Symbols Outlined'
                            }}
                        >
                            share
                        </span>
                        </div>
                        <M3Typography
                            variant="body-medium"
                            style={{marginBottom: 'var(--md-sys-spacing-4)',
                                color: 'var(--md-sys-color-on-surface-variant)'}}
                        >
                            Scansiona o copia il link per accedere alla tua app didattica da altri dispositivi.
                        </M3Typography>
                        <div style={{marginBottom: 'var(--md-sys-spacing-4)'}}>
                            <InfoCard variant="tonal">
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--md-sys-spacing-3)'}}>
                                    <code
                                        style={{fontFamily: 'monospace',
                                            fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                            color: 'var(--md-sys-color-on-surface)',
                                            flex: 1,
                                            wordBreak: 'break-all'}}
                                    >
                                        {window.location.href}
                                    </code>
                                    <M3Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                        }}
                                        variant="tonal"
                                        size="small"
                                        style={{borderRadius: 'var(--md-sys-shape-corner-large)',
                                            flexShrink: 0}}
                                    >
                                        <span
                                        style={{fontFamily: 'Material Symbols Outlined',
                                            fontSize: 'var(--md-sys-spacing-4)'}}
                                    >
                                        content_copy
                                    </span>
                                    </M3Button>
                                </div>
                            </InfoCard>
                        </div>
                    </div>
                </M3DialogContent>
                <M3DialogActions>
                    <M3Button onClick={() => setIsShareInfoOpen(false)} variant="text">
                        Chiudi
                    </M3Button>
                </M3DialogActions>
            </M3Dialog>
        </>
    );
};









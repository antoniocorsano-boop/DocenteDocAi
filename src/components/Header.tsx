import React, { useState, useRef, useEffect } from 'react';
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
    AiThinkingGem 
} from './ui';
import { Z_INDEX } from '../design-system/zIndex';

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
    }> = ({ icon, label, onClick, badge, variant = 'primary' }) => (
        <button 
            onClick={onClick}
            className="w-full flex items-center gap-8 p-6 rounded-[var(--md-sys-shape-corner-medium)] hover:bg-[var(--md-sys-color-surface-container-high)]est transition-all group text-left"
            aria-label={label}
            >
            <div className={`w-10 h-10 rounded-[var(--md-sys-shape-corner-small)] flex items-center justify-center shrink-0 transition-colors ${
                variant === 'error' ? 'bg-error-subtle text-error' : 
                variant === 'secondary' ? 'bg-secondary-subtle text-secondary' : 
                'bg-primary-subtle text-primary'
            }`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="flex-grow font-medium text-[var(--md-sys-color-on-surface)]">{label}</span>
            {badge !== undefined && (
                <span className="bg-error text-on-error m3-label-tiny font-bold px-4 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
            <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant/30 group-hover:translate-x-1 transition-transform text-sm">chevron_right</span>
        </button>
    );

    return (
        <div
            ref={popoverRef}
            className="m3-popup-menu header-actions-popover aura-glass flex flex-col gap-4 !p-8 w-80 max-w-[calc(100vw-var(--md-sys-spacing-8))]"
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
            <div className="flex justify-between items-center p-8 mb-8 border-b border-[var(--md-sys-color-outline-variant)]/10">
                <div className="flex items-center gap-6">
                    <Avatar
                        name={props.settings?.cognomeInsegnante && props.settings?.nomeInsegnante 
                            ? `${props.settings.cognomeInsegnante} ${props.settings.nomeInsegnante}` 
                            : props.settings?.nomeInsegnante || user?.displayName || 'Docente'}
                        src={user?.photoURL}
                        size="sm"
                        className="w-10 h-10 ring-2 ring-primary-subtle"
                    />
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-primary truncate max-w-[180px]">
                            {props.settings?.cognomeInsegnante && props.settings?.nomeInsegnante 
                                ? `${props.settings.cognomeInsegnante} ${props.settings.nomeInsegnante}` 
                                : props.settings?.nomeInsegnante || user?.displayName || 'Menu'}
                        </p>
                        <p className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant font-medium uppercase tracking-wider">
                            {props.settings?.nomeIstituto || 'Docente'}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[var(--md-sys-color-surface-container-high)]est flex items-center justify-center transition-colors" aria-label="Chiudi menu">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            <div className="px-4 space-y-1">
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

                <div className="h-px bg-outline-variant/10 my-2 mx-2"></div>
                <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary/60">Strumenti AI</div>

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

                <div className="h-px bg-outline-variant/10 my-2 mx-2"></div>

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

    const unreadCount = notifiche.filter(n => !n.letta).length;

    const handleMarkAsRead = (notificationId: string) => {
        setNotifiche(prev => prev.map(n => n.id === notificationId ? { ...n, letta: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifiche(prev => prev.map(n => ({ ...n, letta: true })));
    };

    
    return (
        <>
            <header className="header-root" role="banner">
                <div className="header-left flex items-center gap-8">
                    {showBackButton && (
                        <button
                            aria-label="Indietro"
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--md-sys-color-surface-container-high)]est transition-colors"
                            onClick={props.onBack}
                            tabIndex={0}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    )}
                    <NKAHeaderAuraButton
                        hasNewNode={props.hasSuggestion}
                        onClick={props.onOpenOperations}
                        onLongPress={() => {}}
                    />
                </div>

                <div
                    className="header-center"
                    aria-label={!showBackButton ? 'Home' : undefined}
                >
                    <div className="flex items-center gap-8">
                        <Logo 
                            isAiThinking={isAiProcessing} 
                            className="header-logo" 
                            onHomeNavigate={() => !showBackButton && onNavigate('home')}
                        />
                    </div>
                    {isAiProcessing && <AiThinkingGem size="small" />}
                </div>

                <div className="header-right flex items-center gap-8">
                    {!isOnline && (
                        <div className="flex items-center gap-8 px-3 py-1.5 rounded-full bg-error/10 text-error border border-error/20 animate-pulse" title="Modalità Offline">
                            <span className="material-symbols-outlined text-sm">cloud_off</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Offline</span>
                        </div>
                    )}
                    <button
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--md-sys-color-surface-container-high)]est transition-colors"
                        aria-label="Impostazioni"
                        onClick={() => onNavigate('settings')}
                    >
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <button
                        className="w-10 h-10 rounded-full relative flex items-center justify-center hover:bg-[var(--md-sys-color-surface-container-high)]est transition-colors"
                        onClick={() => setIsActionsOpen(p => !p)}
                        aria-label="Menu"
                        tabIndex={0}
                    >
                        <Avatar
                            name={`${teacherSurname || ''} ${teacherName || 'Docente'}`.trim()}
                            src={user?.photoURL}
                            size="sm"
                            className="w-8 h-8 ring-2 ring-primary/20"
                        />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
                        )}
                    </button>
                </div>
            </header>

            {/* Blocchi condizionali fuori dal <header> */}
            {isActionsOpen && (
                <>
                    <div className="fixed inset-0" style={{ zIndex: Z_INDEX.modal.backdrop }} onClick={() => setIsActionsOpen(false)}></div>
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
                    <div className="fixed inset-0" style={{ zIndex: Z_INDEX.modal.backdrop }} onClick={() => setIsNotificationsOpen(false)}></div>
                    <NotificationsPopover
                        notifiche={notifiche}
                        onClose={() => setIsNotificationsOpen(false)}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAllAsRead={handleMarkAllAsRead}
                        onNavigate={onNavigate}
                        onOpenCircularAnalysis={onOpenCircularAnalysis}
                    />
                </>
            )}

            <M3Dialog
                isOpen={isShareInfoOpen}
                onClose={() => setIsShareInfoOpen(false)}
                title="Condividi Link"
            >
                <M3DialogContent>
                    <div className="flex flex-col items-center gap-6 py-4">
                        <div className="w-16 h-16 rounded-[var(--md-sys-shape-corner-large)] bg-secondary/10 flex items-center justify-center text-secondary mb-8">
                            <span className="material-symbols-outlined text-3xl">share</span>
                        </div>
                        <p className="text-center text-[var(--md-sys-color-on-surface)]-variant max-w-xs">
                            Scansiona o copia il link per accedere alla tua app didattica da altri dispositivi.
                        </p>
                        <InfoCard variant="tonal" className="w-full p-8 flex items-center justify-between gap-6 group">
                            <code className="text-sm font-mono text-primary truncate flex-grow">
                                {window.location.href}
                            </code>
                            <M3Button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                }}
                                variant="tonal"
                                size="small"
                                className="!rounded-full"
                            >
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                            </M3Button>
                        </InfoCard>
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
    }



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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

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
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-highest transition-all group text-left"
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                variant === 'error' ? 'bg-error/10 text-error' : 
                variant === 'secondary' ? 'bg-secondary/10 text-secondary' : 
                'bg-primary/10 text-primary'
            }`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="flex-grow font-medium text-on-surface">{label}</span>
            {badge !== undefined && (
                <span className="bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
            <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:translate-x-1 transition-transform text-sm">chevron_right</span>
        </button>
    );

    return (
        <div ref={popoverRef} className="m3-popup-menu header-actions-popover flex flex-col gap-1 !p-2 w-80 max-w-[calc(100vw-32px)] bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant/30 shadow-2xl">
            <div className="flex justify-between items-center p-4 mb-2 border-b border-outline-variant/10">
                <div className="flex items-center gap-3">
                    <Avatar
                        name={props.settings?.cognomeInsegnante && props.settings?.nomeInsegnante 
                            ? `${props.settings.cognomeInsegnante} ${props.settings.nomeInsegnante}` 
                            : props.settings?.nomeInsegnante || user?.displayName || 'Docente'}
                        src={user?.photoURL}
                        size="sm"
                        className="w-10 h-10 ring-2 ring-primary/20"
                    />
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-primary truncate max-w-[180px]">
                            {props.settings?.cognomeInsegnante && props.settings?.nomeInsegnante 
                                ? `${props.settings.cognomeInsegnante} ${props.settings.nomeInsegnante}` 
                                : props.settings?.nomeInsegnante || user?.displayName || 'Menu'}
                        </p>
                        <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
                            {props.settings?.nomeIstituto || 'Docente'}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors" aria-label="Chiudi menu">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            <div className="px-2 space-y-1">
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
            <header className="header-root backdrop-blur-md bg-surface-container-low/80 border-b border-outline-variant/20" role="banner">
                <div className="header-left flex items-center gap-2">
                    {showBackButton && (
                        <button
                            aria-label="Indietro"
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors"
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
                    <div className="flex items-center gap-2">
                        <Logo 
                            isAiThinking={isAiProcessing} 
                            className="header-logo" 
                            onHomeNavigate={() => !showBackButton && onNavigate('home')}
                        />
                    </div>
                    {isAiProcessing && <AiThinkingGem size="small" />}
                </div>

                <div className="header-right flex items-center gap-2">
                    {!isOnline && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-error/10 text-error border border-error/20 animate-pulse" title="Modalità Offline">
                            <span className="material-symbols-outlined text-sm">cloud_off</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Offline</span>
                        </div>
                    )}
                    <button
                        className="w-10 h-10 rounded-full relative flex items-center justify-center hover:bg-surface-container-highest transition-colors"
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
                        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                            <span className="material-symbols-outlined text-3xl">share</span>
                        </div>
                        <p className="text-center text-on-surface-variant max-w-xs">
                            Scansiona o copia il link per accedere alla tua app didattica da altri dispositivi.
                        </p>
                        <InfoCard variant="tonal" className="w-full p-4 flex items-center justify-between gap-3 group">
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

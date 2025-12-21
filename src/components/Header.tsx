import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { HeaderProps } from '../types';
import NotificationsPopover from './NotificationsPopover';
import Avatar from './Avatar';
import AiThinkingGem from './AiThinkingGem';
import { M3Dialog, M3ListItem } from './M3Components';

interface ActionsPopoverProps extends HeaderProps {
    onClose: () => void;
    onShareClick: () => void;
    unreadCount: number;
    onOpenNotifications: () => void;
}

const ActionsPopover: React.FC<ActionsPopoverProps> = (props) => {
    const { onClose, onOpenImageAnalysis, onOpenVideoAnalysis, onOpenHelp, user, onShareClick, unreadCount, onOpenNotifications, installPrompt, onInstallApp, onNavigateToLiveAssistant } = props;
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

    return (
        <div ref={popoverRef} className="m3-popup-menu header-actions-popover flex flex-col gap-1 !p-2 !w-80">
            <div className="flex justify-between items-center p-4 mb-2 border-b border-outline-variant/10">
                <div className="flex flex-col">
                    <p className="m3-label-large font-black text-primary truncate max-w-[180px]">{user?.displayName || 'Menu'}</p>
                    <p className="m3-body-small text-on-surface-variant font-medium">Docente</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors" aria-label="Chiudi menu">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            <M3ListItem
                headline="Notifiche"
                leadingElement={<span className={`material-symbols-outlined ${unreadCount > 0 ? 'text-primary filled-icon' : ''}`}>notifications</span>}
                trailingElement={unreadCount > 0 ? <span className="bg-error text-on-error text-[11px] px-2 py-0.5 rounded-full font-bold">{unreadCount}</span> : null}
                onClick={() => handleActionClick(onOpenNotifications)}
                className="!rounded-lg"
            />

            {installPrompt && onInstallApp && (
                <M3ListItem
                    headline="Installa App"
                    leadingElement={<span className="material-symbols-outlined text-primary">install_mobile</span>}
                    onClick={() => handleActionClick(onInstallApp)}
                    className="!rounded-lg"
                />
            )}

            <div className="h-px bg-outline-variant/10 my-1 mx-4"></div>
            <div className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-primary/60">Strumenti AI</div>

            <M3ListItem
                headline="Analisi Immagine"
                leadingElement={<span className="material-symbols-outlined text-secondary">image_search</span>}
                onClick={() => handleActionClick(onOpenImageAnalysis)}
                className="!rounded-lg"
            />

            <M3ListItem
                headline="Genera Video (Veo)"
                leadingElement={<span className="material-symbols-outlined text-secondary">movie_creation</span>}
                onClick={() => handleActionClick(onOpenVideoAnalysis)}
                className="!rounded-lg"
            />

            <M3ListItem
                headline="Assistente Live"
                leadingElement={<span className="material-symbols-outlined text-secondary">mic</span>}
                onClick={() => handleActionClick(onNavigateToLiveAssistant)}
                className="!rounded-lg"
            />

            <div className="h-px bg-outline-variant/10 my-1 mx-4"></div>

            <M3ListItem
                headline="Guida & Novità"
                leadingElement={<span className="material-symbols-outlined">help</span>}
                onClick={() => handleActionClick(onOpenHelp)}
                className="!rounded-lg"
            />

            <M3ListItem
                headline="Condividi App"
                leadingElement={<span className="material-symbols-outlined">share</span>}
                onClick={() => handleActionClick(onShareClick)}
                className="!rounded-lg"
            />
        </div>
    );
};

export const Header: React.FC<HeaderProps> = (props) => {
    const { showBackButton, onBack, user, notifiche, setNotifiche, onOpenCircularAnalysis, onNavigate, isAiProcessing, installPrompt, onInstallApp, onOpenOperations, hasSuggestion, onOpenImageAnalysis, onOpenVideoAnalysis, onOpenHelp, onNavigateToLiveAssistant } = props;

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
            <header className="fixed top-0 left-0 right-0 h-[72px] bg-surface-container/80 backdrop-blur-md z-[1100] border-b border-surface-container-high/50 flex items-center px-4 md:px-6 transition-all duration-300">
                <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between">

                    {/* Header Leading: Back/Home + Operations Center */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {showBackButton ? (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-surface-container-highest/50 active:bg-surface-container-highest transition-colors"
                                aria-label="Indietro"
                            >
                                <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => onNavigate('home')}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-primary-container/30 active:bg-primary-container text-primary transition-colors"
                                aria-label="Home"
                            >
                                <span className="material-symbols-outlined">grid_view</span>
                            </button>
                        )}

                        <button
                            onClick={onOpenOperations}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-primary-container/30 active:bg-primary-container text-primary relative transition-colors"
                            aria-label="Centro Operativo"
                            title="Centro Operativo & Wizard"
                        >
                            <span className="material-symbols-outlined filled-icon">bolt</span>
                            {hasSuggestion && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-pulse"></span>
                            )}
                        </button>
                    </div>

                    {/* Center Title/Logo */}
                    <div className="flex items-center gap-2 md:gap-3 cursor-pointer absolute left-1/2 transform -translate-x-1/2" onClick={() => !showBackButton && onNavigate('home')}>
                        <Logo title="OrarioDoc AI" isAiThinking={isAiProcessing} />
                        {isAiProcessing && <AiThinkingGem size="small" />}
                    </div>

                    {/* Header Trailing: Settings & Avatar */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {installPrompt && (
                            <button
                                onClick={onInstallApp}
                                className="hidden md:flex w-12 h-12 rounded-full items-center justify-center hover:bg-secondary-container/30 text-secondary transition-colors"
                                aria-label="Installa Applicazione"
                                title="Installa Applicazione"
                            >
                                <span className="material-symbols-outlined filled-icon">download</span>
                            </button>
                        )}

                        <button
                            onClick={() => onNavigate('settings')}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-surface-container-highest/50 active:bg-surface-container-highest text-on-surface-variant transition-colors"
                            aria-label="Impostazioni"
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>

                        <button
                            className={`relative w-9 h-9 md:w-10 md:h-10 ml-1 rounded-full transition-transform active:scale-95 ${unreadCount > 0 ? '' : ''}`}
                            onClick={() => setIsActionsOpen(p => !p)}
                            aria-label="Menu Utente"
                        >
                            <Avatar
                                name={user?.displayName || 'Docente'}
                                src={user?.photoURL}
                                size="small"
                                className="w-full h-full ring-2 ring-surface border-2 border-outline-variant/20"
                            />
                            {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-error rounded-full border-2 border-surface shadow-sm"></span>}
                        </button>
                    </div>
                </div>
            </header>

            {/* Spacer for Fixed Header */}
            <div className="h-[72px] w-full"></div>

            {isActionsOpen && (
                <>
                    <div className="fixed inset-0 z-[1999]" onClick={() => setIsActionsOpen(false)}></div>
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
                        onNavigateToLiveAssistant={onNavigateToLiveAssistant}
                    />
                </>
            )}

            {isNotificationsOpen && (
                <>
                    <div className="fixed inset-0 z-[1999]" onClick={() => setIsNotificationsOpen(false)}></div>
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
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                        <span className="material-symbols-outlined text-3xl">share</span>
                    </div>
                    <p className="m3-body-large text-center text-on-surface-variant max-w-xs">
                        Scansiona o copia il link per accedere alla tua app didattica.
                    </p>
                    <div className="w-full p-4 bg-surface-container-highest/50 rounded-2xl border border-outline-variant/30 flex items-center justify-between gap-3 group">
                        <code className="text-sm font-mono text-primary truncate flex-grow">
                            {window.location.href}
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                // Assuming a toast trigger here ideally, but for now simple feedback
                            }}
                            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                            title="Copia"
                        >
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                        </button>
                    </div>
                </div>
            </M3Dialog>
        </>
    );
};

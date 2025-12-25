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
    const { onClose, onOpenImageAnalysis, onOpenVideoAnalysis, onOpenHelp, user, onShareClick, unreadCount, onOpenNotifications, installPrompt, onInstallApp, onNavigateToLiveAssistant, onNavigate } = props;
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
        <div ref={popoverRef} className="m3-popup-menu header-actions-popover flex flex-col gap-1 !p-2 w-80 max-w-[calc(100vw-32px)]">
            <div className="flex justify-between items-center p-4 mb-2 border-b border-outline-variant/10">
                <div className="flex flex-col">
                    <p className="m3-label-large font-black text-primary truncate max-w-[180px]">{props.settings?.cognomeInsegnante && props.settings?.nomeInsegnante ? `${props.settings.cognomeInsegnante} ${props.settings.nomeInsegnante}` : props.settings?.nomeInsegnante || user?.displayName || 'Menu'}</p>
                    <p className="m3-body-small text-on-surface-variant font-medium">{props.settings?.nomeIstituto || 'Docente'}</p>
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

            {/* Impostazioni - visibile solo su mobile */}
            <M3ListItem
                headline="Impostazioni"
                leadingElement={<span className="material-symbols-outlined">settings</span>}
                onClick={() => handleActionClick(() => onNavigate('settings'))}
                className="!rounded-lg sm:hidden"
            />

            {installPrompt && onInstallApp && (
                <M3ListItem
                    headline="Installa App"
                    leadingElement={<span className="material-symbols-outlined text-primary filled-icon">download</span>}
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
    const { showBackButton, onBack, user, settings, notifiche, setNotifiche, onOpenCircularAnalysis, onNavigate, isAiProcessing, installPrompt, onInstallApp, onOpenOperations, hasSuggestion, onOpenImageAnalysis, onOpenVideoAnalysis, onOpenHelp, onNavigateToLiveAssistant } = props;

    // Get display name from settings (teacher name/surname) or fallback to user
    const teacherName = settings?.nomeInsegnante || '';
    const teacherSurname = settings?.cognomeInsegnante || '';
    const displayName = teacherSurname && teacherName 
        ? `${teacherSurname} ${teacherName}`
        : teacherName || user?.displayName || 'Docente';

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
            <header className="app-header">
                <div className="header-content">

                    {/* Left: Back/Home + Operations */}
                    <div className="header-leading">
                        {showBackButton ? (
                            <button
                                onClick={onBack}
                                className="icon-button"
                                aria-label="Indietro"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => onNavigate('home')}
                                className="icon-button primary"
                                aria-label="Home"
                            >
                                <span className="material-symbols-outlined">home</span>
                            </button>
                        )}

                        <button
                            onClick={onOpenOperations}
                            className="icon-button primary"
                            aria-label="Centro Operativo"
                        >
                            <span className="material-symbols-outlined filled-icon">bolt</span>
                            {hasSuggestion && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-pulse"></span>
                            )}
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div 
                        className="header-center cursor-pointer" 
                        onClick={() => !showBackButton && onNavigate('home')}
                    >
                        <Logo title="DocenteDoc AI" isAiThinking={isAiProcessing} />
                        {isAiProcessing && <AiThinkingGem size="small" />}
                    </div>

                    {/* Right: Actions */}
                    <div className="header-trailing">
                        {/* Settings - visible on tablet+ */}
                        <button
                            onClick={() => onNavigate('settings')}
                            className="icon-button hidden sm:flex"
                            aria-label="Impostazioni"
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>

                        {/* Menu button */}
                        <button
                            className="icon-button relative"
                            onClick={() => setIsActionsOpen(p => !p)}
                            aria-label="Menu"
                        >
                            {/* Mobile: hamburger icon, Desktop: avatar */}
                            <span className="material-symbols-outlined sm:hidden">menu</span>
                            <div className="hidden sm:block">
                                <Avatar
                                    name={teacherName || 'Docente'}
                                    surname={teacherSurname}
                                    src={user?.photoURL}
                                    size="small"
                                    className="w-9 h-9 ring-2 ring-outline-variant/30"
                                />
                            </div>
                            {unreadCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-error rounded-full border-2 border-surface"></span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {isActionsOpen && (
                <>
                    <div className="fixed inset-0" style={{ zIndex: 'var(--z-modal-backdrop)' }} onClick={() => setIsActionsOpen(false)}></div>
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
                    <div className="fixed inset-0" style={{ zIndex: 'var(--z-modal-backdrop)' }} onClick={() => setIsNotificationsOpen(false)}></div>
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

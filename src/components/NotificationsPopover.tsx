import React, { useRef, useEffect } from 'react';
import { Notifica, View } from '../types';
import { InfoCard, M3Button } from './ui';

interface NotificationsPopoverProps {
    notifiche: Notifica[];
    onClose: () => void;
    onMarkAsRead: (notificationId: string) => void;
    onMarkAllAsRead: () => void;
    onNavigate: (view: View) => void;
    onOpenCircularAnalysis: (url: string, title: string) => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
    notifiche,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
    onNavigate,
    onOpenCircularAnalysis,
}) => {
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

    const unreadCount = notifiche.filter(n => !n.letta).length;
    const sortedNotifiche = [...notifiche].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    const handleItemClick = (notifica: Notifica) => {
        onMarkAsRead(notifica.id);
        if (notifica.type === 'reminder') {
            onNavigate('calendario');
        }
    };

    return (
        <div ref={popoverRef} className="m3-popup-menu header-notifications-popover flex flex-col gap-4 !p-8 w-96 max-w-[calc(100vw-32px)] max-h-[80vh] overflow-y-auto custom-scrollbar bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant/30 shadow-2xl">
            <div className="flex justify-between items-center p-6 mb-4 border-b border-outline-variant/10 sticky top-0 bg-surface-container-high/50 backdrop-blur-md z-10">
                <h3 className="text-sm font-bold pl-1 text-on-surface">Notifiche</h3>
                <div className="flex items-center gap-8">
                    {unreadCount > 0 && (
                        <M3Button onClick={onMarkAllAsRead} variant="tonal" size="small" className="!rounded-full">
                            Segna lette
                        </M3Button>
                    )}
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors" aria-label="Chiudi notifiche">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            </div>

            {sortedNotifiche.length > 0 ? (
                <div className="flex flex-col gap-8 p-1">
                    {sortedNotifiche.map(notifica => (
                        <InfoCard
                            key={notifica.id}
                            variant={!notifica.letta ? 'elevated' : 'tonal'}
                            className={`p-6 transition-all cursor-pointer ${!notifica.letta ? 'ring-1 ring-primary/20' : 'opacity-80'}`}
                            onClick={() => handleItemClick(notifica)}
                        >
                            <div className="flex items-start gap-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!notifica.letta ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                    <span className="material-symbols-outlined text-lg">
                                        {notifica.type === 'circular' ? 'feed' : 'notifications'}
                                    </span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start gap-8">
                                        <h4 className={`text-sm font-bold truncate ${!notifica.letta ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                            {notifica.titolo}
                                        </h4>
                                        {!notifica.letta && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2.5"></div>}
                                    </div>
                                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                                        {notifica.messaggio}
                                    </p>
                                    
                                    {(() => {
                                        function isCircularPayload(payload: unknown): payload is { url: string; title: string } {
                                            return (
                                                !!payload &&
                                                typeof payload === 'object' &&
                                                'url' in payload &&
                                                'title' in payload &&
                                                typeof (payload as { url: unknown }).url === 'string' &&
                                                typeof (payload as { title: unknown }).title === 'string'
                                            );
                                        }
                                        if (notifica.type === 'circular' && isCircularPayload(notifica.payload)) {
                                            const { url, title } = notifica.payload;
                                            return (
                                                <div className="flex gap-8 mt-3">
                                                    <M3Button
                                                        onClick={(e) => { e.stopPropagation(); onOpenCircularAnalysis(url, title); onClose(); }}
                                                        variant="tonal"
                                                        size="small"
                                                        className="!bg-secondary/10 !text-secondary hover:!bg-secondary/20"
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-1.5">auto_awesome</span>
                                                        Analizza Circolare
                                                    </M3Button>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                        </InfoCard>
                    ))}
                </div>
            ) : (
                <div className="py-12 px-6 text-center text-on-surface-variant/60 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-8">
                        <span className="material-symbols-outlined text-3xl">notifications_off</span>
                    </div>
                    <p className="text-sm font-medium">Nessuna notifica</p>
                </div>
            )}
        </div>
    );
};

export default NotificationsPopover;

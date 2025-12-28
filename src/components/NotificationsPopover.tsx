import React, { useRef, useEffect } from 'react';
import { Notifica, View } from '../types';
import { M3ListItem } from './M3Components';

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
        <div ref={popoverRef} className="m3-popup-menu header-notifications-popover flex flex-col gap-1 !p-2 !w-96 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center p-3 mb-1 border-b border-outline-variant/10 sticky top-0 bg-surface-container z-10">
                <h3 className="m3-title-medium font-bold pl-1">Notifiche</h3>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button onClick={onMarkAllAsRead} className="text-primary text-xs font-bold px-3 py-1.5 rounded-full bg-primary-container hover:bg-primary/20 transition-colors">
                            Segna lette
                        </button>
                    )}
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors" aria-label="Chiudi notifiche">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            </div>

            {sortedNotifiche.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {sortedNotifiche.map(notifica => (
                        <M3ListItem
                            key={notifica.id}
                            className={`!items-start !rounded-xl transition-all ${!notifica.letta ? 'bg-primary-container/20 border border-primary/10' : ''}`}
                            onClick={() => handleItemClick(notifica)}
                            leadingElement={
                                <div className={`p-2 rounded-full ${!notifica.letta ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                    <span className="material-symbols-outlined text-sm block">
                                        {notifica.type === 'circular' ? 'feed' : 'notifications'}
                                    </span>
                                </div>
                            }
                            headline={notifica.titolo}
                            headlineSize="small"
                            supportingText={
                                <div>
                                    <p className="line-clamp-2 opacity-90">{notifica.messaggio}</p>
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
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onOpenCircularAnalysis(url, title); onClose(); }}
                                                        className="flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold hover:brightness-95 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                        Analizza
                                                    </button>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            }
                            trailingElement={
                                !notifica.letta ? <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shadow-sm"></div> : undefined
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className="py-12 px-6 text-center text-on-surface-variant/60 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-3xl">notifications_off</span>
                    </div>
                    <p className="m3-body-medium font-medium">Nessuna notifica</p>
                </div>
            )}
        </div>
    );
};

export default NotificationsPopover;

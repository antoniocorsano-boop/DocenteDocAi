// M3Expressive: NotificationsPopover - Notifications display popover with M3 tokens
import React from 'react';
import { Notifica, View } from '../types';
import { M3Button, M3Popover } from './ui';

interface NotificationsPopoverProps {
    anchorEl: HTMLElement | null;
    notifiche: Notifica[];
    onClose: () => void;
    onMarkAsRead: (notificationId: string) => void;
    onMarkAllAsRead: () => void;
    onNavigate: (view: View) => void;
    onOpenCircularAnalysis: (url: string, title: string) => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
    anchorEl,
    notifiche,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
    onNavigate,
    onOpenCircularAnalysis,
}) => {
    const unreadCount = notifiche.filter(n => !n.letta).length;
    const sortedNotifiche = [...notifiche].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    const handleItemClick = (notifica: Notifica) => {
        onMarkAsRead(notifica.id);
        if (notifica.type === 'reminder') {
            onNavigate('calendario');
        }
    };

    return (
        <M3Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            minWidth={320}
            maxWidth={384}
        >
            {/* Sticky Header */}
            <div className="notifications-popover-header">
                <span className="notifications-popover-title">Notifiche</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                    {unreadCount > 0 && (
                        <M3Button
                            onClick={onMarkAllAsRead}
                            variant="outlined"
                            size="small"
                        >
                            Segna lette
                        </M3Button>
                    )}
                    <button
                        onClick={onClose}
                        className="m3-interactive-close notifications-popover-close"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="notifications-popover-content">
                {sortedNotifiche.length > 0 ? (
                    <div className="notifications-popover-list">
                        {sortedNotifiche.map(notifica => (
                            <div
                                key={notifica.id}
                                onClick={() => handleItemClick(notifica)}
                                tabIndex={0}
                                role="button"
                                aria-pressed="false"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleItemClick(notifica);
                                    }
                                }}
                                className={`m3-interactive-card notifications-popover-card ${notifica.letta ? 'notifications-popover-card-read' : 'notifications-popover-card-unread'}`}
                            >
                                <div className="notifications-popover-card-row">
                                    {/* Icon */}
                                    <div className={`notifications-popover-card-icon ${notifica.letta ? 'notifications-popover-card-icon-read' : 'notifications-popover-card-icon-unread'}`}> 
                                        <span className="material-symbols-outlined text-lg">
                                            {notifica.type === 'circular' ? 'feed' : 'notifications'}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="notifications-popover-card-content">
                                        <div className="notifications-popover-card-title-row">
                                            <span className={`notifications-popover-card-title ${notifica.letta ? 'notifications-popover-card-title-read' : 'notifications-popover-card-title-unread'}`}>{notifica.titolo}</span>
                                            {!notifica.letta && (
                                                <div className="notifications-popover-card-dot" />
                                            )}
                                        </div>
                                        <p className="notifications-popover-card-message">{notifica.messaggio}</p>

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
                                                    <M3Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onOpenCircularAnalysis(url, title);
                                                            onClose();
                                                        }}
                                                        variant="text"
                                                        size="small"
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-1.5">auto_awesome</span>
                                                        Analizza Circolare
                                                    </M3Button>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="notifications-popover-empty">
                        <div className="notifications-popover-empty-icon">
                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                        </div>
                        <span className="notifications-popover-empty-title">Nessuna notifica</span>
                    </div>
                )}
            </div>
        </M3Popover>
    );
};

export default NotificationsPopover;



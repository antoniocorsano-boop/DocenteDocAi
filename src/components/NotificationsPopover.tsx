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
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    backdropFilter: 'blur(8px)',
                    padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-6)',
                    borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-4)',
                }}
            >
                <span
                    style={{
                        fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                        fontSize: 'var(--md-sys-typescale-body-medium-size)',
                        color: 'var(--md-sys-color-on-surface)',
                    }}
                >
                    Notifiche
                </span>
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
                        className="m3-interactive-close"
                        style={{
                            minWidth: 'var(--md-sys-spacing-8)',
                            width: 'var(--md-sys-spacing-8)',
                            height: 'var(--md-sys-spacing-8)',
                            padding: 0,
                            border: 'none',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                style={{
                    maxHeight: 'min(70vh, 32rem)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: 'var(--md-sys-spacing-2)',
                }}
            >
                {sortedNotifiche.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-2)' }}>
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
                                className="m3-interactive-card"
                                style={{
                                    padding: 'var(--md-sys-spacing-4)',
                                    backgroundColor: notifica.letta
                                        ? 'var(--md-sys-color-surface-container)'
                                        : 'var(--md-sys-color-surface-dim)',
                                    border: notifica.letta
                                        ? '1px solid var(--md-sys-color-outline-variant)'
                                        : '1px solid var(--md-sys-color-primary)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                }}
                            >
                                <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-4)', alignItems: 'flex-start' }}>
                                    {/* Icon */}
                                    <div
                                        style={{
                                            width: 'calc(var(--md-sys-spacing-8) + var(--md-sys-spacing-2))',
                                            height: 'calc(var(--md-sys-spacing-8) + var(--md-sys-spacing-2))',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            backgroundColor: notifica.letta
                                                ? 'var(--md-sys-color-surface-container-high)'
                                                : 'var(--md-sys-color-primary)',
                                            color: notifica.letta
                                                ? 'var(--md-sys-color-on-surface-variant)'
                                                : 'var(--md-sys-color-on-primary)',
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {notifica.type === 'circular' ? 'feed' : 'notifications'}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-1)' }}>
                                            <span
                                                style={{
                                                    fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                                                    fontSize: 'var(--md-sys-typescale-body-small-size)',
                                                    color: notifica.letta
                                                        ? 'var(--md-sys-color-on-surface-variant)'
                                                        : 'var(--md-sys-color-on-surface)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    flex: 1,
                                                }}
                                            >
                                                {notifica.titolo}
                                            </span>
                                            {!notifica.letta && (
                                                <div
                                                    style={{
                                                        width: 'var(--md-sys-spacing-2)',
                                                        height: 'var(--md-sys-spacing-2)',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'var(--md-sys-color-primary)',
                                                        flexShrink: 0,
                                                        marginTop: 'var(--md-sys-spacing-2)',
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <p
                                            style={{
                                                fontSize: 'var(--md-sys-typescale-body-small-size)',
                                                color: 'var(--md-sys-color-on-surface-variant)',
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                marginBottom: 'var(--md-sys-spacing-2)',
                                                margin: `0 0 var(--md-sys-spacing-2) 0`,
                                            }}
                                        >
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
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'var(--md-sys-spacing-8) var(--md-sys-spacing-6)',
                            color: 'var(--md-sys-color-on-surface-variant)',
                        }}
                    >
                        <div
                            style={{
                                width: 'calc(var(--md-sys-spacing-8) * 2)',
                                height: 'calc(var(--md-sys-spacing-8) * 2)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--md-sys-spacing-4)',
                            }}
                        >
                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                        </div>
                        <span style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)' }}>
                            Nessuna notifica
                        </span>
                    </div>
                )}
            </div>
        </M3Popover>
    );
};

export default NotificationsPopover;

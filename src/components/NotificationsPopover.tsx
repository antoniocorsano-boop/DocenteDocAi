import React from 'react';
import { Box, Button, Divider, Typography, Stack, Card } from '@mui/material';
import { Notifica, View } from '../types';
import { M3Button } from './ui';

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
    const unreadCount = notifiche.filter(n => !n.letta).length;
    const sortedNotifiche = [...notifiche].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    const handleItemClick = (notifica: Notifica) => {
        onMarkAsRead(notifica.id);
        if (notifica.type === 'reminder') {
            onNavigate('calendario');
        }
    };

    return (
        <Box
            sx={{
                width: 'min(384px, calc(100vw - 32px))',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--sys-surface-container-high)',
                borderRadius: 'var(--shape-xl)',
                border: '1px solid var(--sys-outline-variant)',
                boxShadow: 'var(--elevation-3)',
                overflow: 'hidden',
            }}
        >
            {/* Sticky Header */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'var(--sys-surface-container-high)',
                    backdropFilter: 'blur(8px)',
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--sys-outline-variant)',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 700,
                        color: 'var(--sys-on-surface)',
                    }}
                >
                    Notifiche
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {unreadCount > 0 && (
                        <Button
                            onClick={onMarkAllAsRead}
                            variant="outlined"
                            size="small"
                            sx={{
                                textTransform: 'capitalize',
                                fontSize: '0.75rem',
                                color: 'var(--sys-on-surface)',
                                borderColor: 'var(--sys-outline)',
                            }}
                        >
                            Segna lette
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        size="small"
                        sx={{
                            minWidth: '32px',
                            width: '32px',
                            height: '32px',
                            padding: 0,
                        }}
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </Button>
                </Box>
            </Box>

            {/* Scrollable Content */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '8px',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--sys-outline)',
                        borderRadius: 'var(--shape-lg)',
                        '&:hover': {
                            backgroundColor: 'var(--sys-outline-variant)',
                        },
                    },
                }}
            >
                {sortedNotifiche.length > 0 ? (
                    <Stack spacing={1} sx={{ padding: '8px' }}>
                        {sortedNotifiche.map(notifica => (
                            <Card
                                key={notifica.id}
                                onClick={() => handleItemClick(notifica)}
                                sx={{
                                    padding: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    backgroundColor: notifica.letta
                                        ? 'var(--sys-surface-container)'
                                        : 'var(--sys-surface-dim)',
                                    border: notifica.letta
                                        ? '1px solid var(--sys-outline-variant)'
                                        : '1px solid var(--sys-primary)',
                                    '&:hover': {
                                        boxShadow: 'var(--elevation-2)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: 'var(--shape-lg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            backgroundColor: notifica.letta
                                                ? 'var(--sys-surface-container-high)'
                                                : 'var(--sys-primary)',
                                            color: notifica.letta
                                                ? 'var(--sys-on-surface-variant)'
                                                : 'var(--sys-on-primary)',
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {notifica.type === 'circular' ? 'feed' : 'notifications'}
                                        </span>
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: notifica.letta
                                                        ? 'var(--sys-on-surface-variant)'
                                                        : 'var(--sys-on-surface)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    flex: 1,
                                                }}
                                            >
                                                {notifica.titolo}
                                            </Typography>
                                            {!notifica.letta && (
                                                <Box
                                                    sx={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'var(--sys-primary)',
                                                        flexShrink: 0,
                                                        marginTop: '6px',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'var(--sys-on-surface-variant)',
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {notifica.messaggio}
                                        </Typography>

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
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onOpenCircularAnalysis(url, title);
                                                            onClose();
                                                        }}
                                                        variant="text"
                                                        size="small"
                                                        sx={{
                                                            textTransform: 'capitalize',
                                                            fontSize: '0.75rem',
                                                            color: 'var(--sys-secondary)',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--sys-secondary)/10',
                                                            },
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-1.5">auto_awesome</span>
                                                        Analizza Circolare
                                                    </Button>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '32px 24px',
                            color: 'var(--sys-on-surface-variant)',
                        }}
                    >
                        <Box
                            sx={{
                                width: '64px',
                                height: '64px',
                                borderRadius: 'var(--shape-xl)',
                                backgroundColor: 'var(--sys-surface-container-highest)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px',
                            }}
                        >
                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Nessuna notifica
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default NotificationsPopover;

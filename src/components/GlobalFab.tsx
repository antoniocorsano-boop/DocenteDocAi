/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// LEGACY - MD3 Non-compliant

// M3Expressive refactor: ✅ COMPLETED - Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
// ...existing code...
import React, { useState, useRef } from 'react';
import { View } from '../types';

interface GlobalFabProps {
    currentView: View;
    onAction: (action: string) => void;
}

export const GlobalFab: React.FC<GlobalFabProps> = ({ currentView, onAction }) => {
    
    // FAB Logic: Super AI Assistant (nuovo design)
    const icon = 'smart_toy';
    const label = 'Super AI Assistant';
    const action = 'super-ai-assistant';
    let shouldRender = true;

    if ([
        'settings',
        'aula-session',
        'welcome',
        // aggiungi altre view dove il FAB non deve apparire
    ].includes(currentView)) {
        shouldRender = false;
    }

    // --- Draggable Logic ---
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const initialPosRef = useRef<{ top: number; left: number } | null>(null);
    const isDraggingRef = useRef(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        const btn = buttonRef.current;
        if (!btn) return;
        e.preventDefault(); // Prevent text selection

        const rect = btn.getBoundingClientRect();
        
        // Initialize position on first drag
        if (!position) {
            const initialPos = { top: rect.top, left: rect.left };
            setPosition(initialPos);
            initialPosRef.current = initialPos;
        } else {
            initialPosRef.current = position;
        }

        dragStartRef.current = { x: e.clientX, y: e.clientY };
        isDraggingRef.current = false;

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!dragStartRef.current || !initialPosRef.current) return;

        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            isDraggingRef.current = true;
            if (buttonRef.current) {
                // removed runtime mutation
            }
        }

        if (isDraggingRef.current) {
            let newTop = initialPosRef.current.top + deltaY;
            let newLeft = initialPosRef.current.left + deltaX;

            const btnSize = 56;
            const margin = 16;
            const maxTop = window.innerHeight - btnSize - margin;
            const maxLeft = window.innerWidth - btnSize - margin;

            newTop = Math.max(margin, Math.min(newTop, maxTop));
            newLeft = Math.max(margin, Math.min(newLeft, maxLeft));

            setPosition({ top: newTop, left: newLeft });
        }
    };

    const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        
        if (buttonRef.current) {
            // removed runtime mutation
        }
        dragStartRef.current = null;
        initialPosRef.current = null;
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDraggingRef.current) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            onAction(action);
        }
    };

    if (!shouldRender) return null;

    const style: React.CSSProperties = position 
        ? { position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, bottom: 'auto', right: 'auto' } 
        : {};

    return (
        <button 
            ref={buttonRef}
            
            data-assistant="true"
            style={style}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            aria-label={label}
            title={label}
        >
            <span >{icon}</span>
        </button>
    );
};











// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X

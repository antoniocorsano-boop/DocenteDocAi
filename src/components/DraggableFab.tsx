
import React, { useState, useRef, useEffect } from 'react';

interface DraggableFabProps {
    onClick: () => void;
    ariaLabel: string;
}

export const DraggableFab: React.FC<DraggableFabProps> = ({ onClick, ariaLabel }) => {
    // If position is null, it relies on CSS (bottom-right). Once set, it uses fixed top/left.
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const initialPosRef = useRef<{ top: number; left: number } | null>(null);
    const isDraggingRef = useRef(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        const btn = buttonRef.current;
        if (!btn) return;

        // Prevent default to avoid text selection or weird touch behaviors
        e.preventDefault();

        const rect = btn.getBoundingClientRect();
        
        // Initialize position state on first drag if it hasn't been set yet
        if (!position) {
            const initialPos = { top: rect.top, left: rect.left };
            setPosition(initialPos);
            initialPosRef.current = initialPos;
        } else {
            initialPosRef.current = position;
        }

        dragStartRef.current = { x: e.clientX, y: e.clientY };
        isDraggingRef.current = false;

        // Attach global listeners to window to handle fast drags outside the button
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!dragStartRef.current || !initialPosRef.current) return;

        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        // Threshold to consider it a drag (prevents micro-movements preventing click)
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            isDraggingRef.current = true;
            // Disable transition during drag for instant response
            if (buttonRef.current) buttonRef.current.style.transition = 'none';
        }

        if (isDraggingRef.current) {
            let newTop = initialPosRef.current.top + deltaY;
            let newLeft = initialPosRef.current.left + deltaX;

            // Boundary checks
            const btnSize = 64;
            const margin = 8;
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
        
        // Re-enable transition (if any defined in CSS for other props)
        if (buttonRef.current) buttonRef.current.style.transition = '';
        
        dragStartRef.current = null;
        initialPosRef.current = null;
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDraggingRef.current) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            onClick();
        }
    };

    // Apply inline styles only when we have a custom position
    const style: React.CSSProperties = position 
        ? { 
            top: `${position.top}px`, 
            left: `${position.left}px`, 
            bottom: 'auto', 
            right: 'auto',
            position: 'fixed' 
          } 
        : {};

    return (
        <button
            ref={buttonRef}
            className="live-assistant-fab"
            style={style}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            <span className="material-symbols-outlined">mic</span>
        </button>
    );
};

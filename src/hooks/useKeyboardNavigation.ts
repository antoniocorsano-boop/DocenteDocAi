import { useEffect, useRef } from 'react';

/**
 * Hook per gestire la navigazione da tastiera nei modal/dialog
 * Implementa focus trap, chiusura con ESC e navigazione con Tab
 */
export const useKeyboardNavigation = (
    isOpen: boolean,
    onClose?: () => void,
    options: {
        focusOnOpen?: boolean;
        restoreFocus?: boolean;
    } = {}
): React.RefObject<HTMLDivElement> => {
    const { focusOnOpen = true, restoreFocus = true } = options;
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<Element | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Salva l'elemento attualmente focalizzato
        if (restoreFocus) {
            previouslyFocusedElement.current = document.activeElement;
        }

        // Focus trap: cattura tutti gli elementi focusabili nel modal
        const getFocusableElements = (): HTMLElement[] => {
            if (!modalRef.current) return [];
            const focusableSelectors = [
                'a[href]',
                'button:not([disabled])',
                'textarea:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                '[tabindex]:not([tabindex="-1"])'
            ];
            return Array.from(
                modalRef.current.querySelectorAll(focusableSelectors.join(', '))
            ) as HTMLElement[];
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            const focusableElements = getFocusableElements();
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    if (onClose) onClose();
                    break;

                case 'Tab':
                    if (focusableElements.length === 0) return;

                    if (event.shiftKey) {
                        // Shift + Tab: vai all'ultimo elemento se siamo sul primo
                        if (document.activeElement === firstElement) {
                            event.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab: vai al primo elemento se siamo sull'ultimo
                        if (document.activeElement === lastElement) {
                            event.preventDefault();
                            firstElement.focus();
                        }
                    }
                    break;
            }
        };

        // Aggiungi event listener
        document.addEventListener('keydown', handleKeyDown);

        // Focus sul primo elemento quando il modal si apre
        if (focusOnOpen) {
            setTimeout(() => {
                const focusableElements = getFocusableElements();
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }, 100); // Timeout per permettere al DOM di aggiornarsi
        }

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            // Ripristina il focus quando il modal si chiude
            if (restoreFocus && previouslyFocusedElement.current && typeof (previouslyFocusedElement.current as HTMLElement).focus === 'function') {
                setTimeout(() => {
                    (previouslyFocusedElement.current as HTMLElement).focus();
                }, 100);
            }
        };
    }, [isOpen, onClose, focusOnOpen, restoreFocus]);

    return modalRef;
};
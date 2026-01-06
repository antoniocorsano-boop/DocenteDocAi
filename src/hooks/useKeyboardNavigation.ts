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

/**
 * Hook per la navigazione da tastiera negli elenchi
 * Supporta: frecce (su/giu), Home/End, Enter/Space
 * Implementa WCAG 2.1 compliance per list navigation
 * 
 * @param itemCount - Numero totale di elementi
 * @param selectedIndex - Indice attualmente selezionato
 * @param onSelect - Callback quando la selezione cambia
 * @param onActivate - Callback quando l'elemento è attivato (Enter/Space)
 * @param cycleItems - Se true, cicla tra elementi (wrap around)
 * 
 * @example
 * const { handleKeyDown, navigateToIndex } = useListKeyboardNavigation({
 *   itemCount: items.length,
 *   selectedIndex: selected,
 *   onSelect: setSelected,
 *   onActivate: handleActivate
 * });
 * 
 * <ul onKeyDown={handleKeyDown}>
 *   {items.map((item, i) => (
 *     <li key={i} tabIndex={i === selected ? 0 : -1}>
 *       {item}
 *     </li>
 *   ))}
 * </ul>
 */
export interface UseListKeyboardNavigationOptions {
  itemCount: number;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  onActivate?: (index: number) => void;
  cycleItems?: boolean;
}

export const useListKeyboardNavigation = (options: UseListKeyboardNavigationOptions) => {
  const {
    itemCount,
    selectedIndex = 0,
    onSelect,
    onActivate,
    cycleItems = true
  } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newIndex = selectedIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = selectedIndex + 1;
        if (newIndex >= itemCount) {
          newIndex = cycleItems ? 0 : itemCount - 1;
        }
        onSelect?.(newIndex);
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = selectedIndex - 1;
        if (newIndex < 0) {
          newIndex = cycleItems ? itemCount - 1 : 0;
        }
        onSelect?.(newIndex);
        break;

      case 'Home':
        e.preventDefault();
        onSelect?.(0);
        break;

      case 'End':
        e.preventDefault();
        onSelect?.(itemCount - 1);
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        onActivate?.(selectedIndex);
        break;

      default:
        break;
    }
  }, [selectedIndex, itemCount, cycleItems, onSelect, onActivate]);

  return { handleKeyDown };
};

// Re-export for convenience
export { useCallback } from 'react';
/**
 * GUIDA RAPIDA - Sistema Modali M3 Expressive
 * 
 * Questa guida contiene esempi di utilizzo del nuovo sistema di modali
 * basato su ModalContext e M3Dialog per la migrazione a Material Design 3
 * 
 * SETUP INIZIALE:
 * 1. Wrappa l'app con ModalProvider in main.tsx:
 * 
 *    import { ModalProvider } from './context/ModalContext';
 *    
 *    <ModalProvider>
 *      <App />
 *    </ModalProvider>
 * 
 * UTILIZZO BASE:
 * 2. Usa useModal() da qualsiasi componente:
 * 
 *    const { pushModal, popModal } = useModal();
 *    
 *    pushModal({
 *      id: 'my-dialog',
 *      component: (
 *        <M3Dialog
 *          title="Title"
 *          onClose={() => popModal('my-dialog')}
 *        >
 *          Content
 *        </M3Dialog>
 *      ),
 *    });
 * 
 * HOOK SEMPLIFICATO:
 * 3. Per un'interfaccia ancora più semplice, usa useModalController:
 * 
 *    const { openModal, closeModal, isOpen } = useModalController('my-id');
 *    
 *    openModal(
 *      <M3Dialog title="Title" onClose={closeModal}>
 *        Content
 *      </M3Dialog>
 *    );
 * 
 * DIALOGHI PREDEFINITI:
 * 4. Usa componenti predefiniti per pattern comuni:
 *    - M3ConfirmDialog: Conferme semplici
 *    - M3FormDialog: Form nei modali
 *    - M3AlertDialog: Alert/Info
 * 
 * STACK DI MODALI:
 * 5. Il sistema supporta automaticamente 3+ livelli nidificati
 *    senza conflitti di z-index. Ogni livello aggiunge 100 allo z-index.
 * 
 * FULLSCREEN MODE:
 * 6. Per contenuti estesi, usa mode="fullscreen":
 *    
 *    <M3Dialog
 *      mode="fullscreen"
 *      title="Document Editor"
 *      onClose={closeModal}
 *    >
 *      Large content
 *    </M3Dialog>
 * 
 * CSS CLASSES DISPONIBILI:
 * - Buttons: m3-button-filled, m3-button-outlined, m3-button-tonal, m3-button-text
 * - Typography: m3-display-*, m3-headline-*, m3-title-*, m3-body-*, m3-label-*
 * - Fields: m3-field-container, m3-field-wrapper, m3-field-input
 * - Cards: m3-card, m3-card-elevated, m3-card-outlined
 * 
 * PROSSIMI STEP:
 * 1. ✅ ModalContext creato in src/context/ModalContext.tsx
 * 2. ✅ M3Dialog creato in src/components/M3Dialog.tsx
 * 3. TODO: Avvolgere <App /> con <ModalProvider> in main.tsx
 * 4. TODO: Migrare dialoghi legacy al nuovo sistema
 * 5. TODO: Testare con 3+ livelli di modali nidificati
 * 6. TODO: Verificare ARIA accessibility
 */



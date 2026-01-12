import React, { useState } from 'react';
import { EventoCalendario, TipoEvento } from '../types';
import { TextField, TextArea, M3ChoiceCard, M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

interface EventModalProps {
    eventToEdit?: Partial<EventoCalendario>;
    onClose: () => void;
    onSave: (event: EventoCalendario) => void;
    onDelete: (eventId: string) => void;
}

const eventTypes: { value: TipoEvento; label: string; icon: string }[] = [
    { value: 'impegno', label: 'Impegno', icon: 'event' },
    { value: 'scadenza', label: 'Scadenza', icon: 'flag' },
    { value: 'consiglio', label: 'Consiglio', icon: 'groups' },
    { value: 'formazione', label: 'Formazione', icon: 'school' },
];

const EventModal: React.FC<EventModalProps> = ({ eventToEdit, onClose, onSave, onDelete }) => {
    const [event, setEvent] = useState<Partial<EventoCalendario>>({
        data: new Date().toISOString().split('T')[0],
        tipo: 'impegno',
        ...eventToEdit
    });

    const handleChange = (field: keyof EventoCalendario, value: unknown) => {
        const newEvent = { ...event, [field]: value };
        if (field === 'data' && newEvent.dataFine && newEvent.dataFine < (newEvent.data || '')) {
            newEvent.dataFine = newEvent.data;
        }
        setEvent(newEvent);
    };

    const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!event.titolo || !event.data || !event.tipo) {
            alert("Titolo, data e tipo sono obbligatori.");
            return;
        }
        const eventToSave: EventoCalendario = {
            id: event.id || `evt-${Date.now()}`,
            titolo: event.titolo!,
            data: event.data!,
            dataFine: event.dataFine,
            tipo: event.tipo as TipoEvento,
            oraInizio: event.oraInizio,
            oraFine: event.oraFine,
            descrizione: event.descrizione,
        };
        onSave(eventToSave);
    };

    return (
        <M3Dialog
            title={event.id ? 'Modifica Evento' : 'Nuovo Evento'}
            onClose={onClose}
            maxWidth="lg"
            level={1}
        >
            <M3DialogContent style={{
  marginTop: 'var(--md-sys-spacing-8)'
}}>
                <form id="event-modal-form" onSubmit={handleSubmit} style={{
  marginTop: 'var(--md-sys-spacing-8)'
}}>
                    <div>
                        <label className="text-[11px] tracking-[0.25em]" style={{ color: "var(--md-sys-color-primary)", fontWeight: "900", textTransform: "uppercase", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", marginBottom: "var(--md-sys-spacing-8)", display: "block" }}>Tipo Evento</label>
                        <div className="pb-2 custom-scrollbar" style={{ display: "flex", gap: "var(--md-sys-spacing-6)", overflowX: "auto" }}>
                            {eventTypes.map(t => (
                                <M3ChoiceCard
                                    key={t.value}
                                    icon={t.icon}
                                    label={t.label}
                                    onClick={() => handleChange('tipo', t.value)}
                                    selected={event.tipo === t.value}
                                />
                            ))}
                        </div>
                    </div>

                    <TextField 
                        id="event-titolo-input"
                        name="event-titolo"
                        label="Titolo" 
                        value={event.titolo || ''} 
                        onChange={e => handleChange('titolo', e.target.value)} 
                        placeholder="Es. Consiglio di Classe 3A" 
                        required 
                        autoFocus
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-8)" }}>
                        <TextField 
                            id="event-data-input"
                            name="event-data"
                            label="Data Inizio" 
                            type="date" 
                            value={event.data || ''} 
                            onChange={e => handleChange('data', e.target.value)} 
                            required 
                        />
                        <TextField 
                            id="event-ora-input"
                            name="event-ora"
                            label="Ora Inizio" 
                            type="time" 
                            value={event.oraInizio || ''} 
                            onChange={e => handleChange('oraInizio', e.target.value)} 
                        />
                    </div>

                    <TextArea 
                        id="event-desc-textarea"
                        name="event-desc"
                        label="Descrizione / Note" 
                        value={event.descrizione || ''} 
                        onChange={e => handleChange('descrizione', e.target.value)} 
                        rows={3}
                        containerClassName="shadow-inner !bg-[var(--md-sys-color-surface-container-low)]est"
                    />
                </form>
            </M3DialogContent>
            <M3DialogActions>
                {event.id && (
                    <M3Button onClick={() => onDelete(event.id!)} variant="text" className="!text-error mr-auto" style={{ fontWeight: "900" }}>
                        Elimina
                    </M3Button>
                )}
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSubmit} variant="filled" className="shadow-[var(--md-sys-elevation-level3)] !px-10">Salva</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default React.memo(EventModal);



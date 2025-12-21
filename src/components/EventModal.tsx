import React, { useState } from 'react';
import { EventoCalendario, TipoEvento } from '../types';
import { TextField, TextArea, M3ChoiceCard } from './M3Components';

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

    const handleChange = (field: keyof EventoCalendario, value: any) => {
        const newEvent = { ...event, [field]: value };
        if (field === 'data' && newEvent.dataFine && newEvent.dataFine < (newEvent.data || '')) {
            newEvent.dataFine = newEvent.data;
        }
        setEvent(newEvent);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="dialog-backdrop">
            <form onSubmit={handleSubmit} className="dialog-container w-full max-w-lg shadow-3xl">
                <div className="dialog-header border-b border-outline-variant bg-surface-container-high p-6">
                    <h2 className="m3-headline-small font-black">{event.id ? 'Modifica Evento' : 'Nuovo Evento'}</h2>
                    <button type="button" onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="dialog-content p-6 space-y-6">
                    <div>
                        <label className="text-[11px] text-primary font-black uppercase tracking-[0.25em] px-2 mb-4 block">Tipo Evento</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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

                    <div className="grid grid-cols-2 gap-4">
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
                    />
                </div>

                <div className="dialog-footer bg-surface-container-high p-6 border-t border-outline-variant">
                    {event.id && (
                        <button type="button" onClick={() => onDelete(event.id!)} className="button button-text !text-error mr-auto font-black">
                            Elimina
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="button button-text font-bold">Annulla</button>
                    <button type="submit" className="button button-filled shadow-lg font-black !px-10">Salva</button>
                </div>
            </form>
        </div>
    );
};

export default EventModal;

import { describe, it, expect, vi } from 'vitest';
import { parseCSVWithHeaders } from '../../utils/csvUtils';

describe('parseCSVWithHeaders', () => {
    it('dovrebbe parsare un CSV semplice con header', () => {
        const csvText = 'Header1,Header2\nValue1,Value2';
        const result = parseCSVWithHeaders(csvText);
        expect(result.headers).toEqual(['Header1', 'Header2']);
        expect(result.data).toEqual([{ Header1: 'Value1', Header2: 'Value2' }]);
    });

    it('dovrebbe parsare un CSV con valori contenenti virgole e racchiusi tra virgolette', () => {
        const csvText = 'Nome,Descrizione\n"Prodotto A","Descrizione, con virgola"';
        const result = parseCSVWithHeaders(csvText);
        expect(result.headers).toEqual(['Nome', 'Descrizione']);
        expect(result.data).toEqual([{ Nome: 'Prodotto A', Descrizione: 'Descrizione, con virgola' }]);
    });

    it('dovrebbe gestire virgolette doppie come escape all\'interno di un campo', () => {
        const csvText = 'Campo,"Testo con ""virgolette escape"""\nValore,"Altro ""testo"" citato"';
        const result = parseCSVWithHeaders(csvText);
        expect(result.data[0].Campo).toBe('Valore');
        expect(result.data[0]['Testo con "virgolette escape"']).toBe('Altro "testo" citato');
    });

    it('dovrebbe gestire righe vuote', () => {
        const csvText = 'Header1,Header2\n\nValue1,Value2\n';
        const result = parseCSVWithHeaders(csvText);
        expect(result.data).toEqual([{ Header1: 'Value1', Header2: 'Value2' }]);
    });

    it('dovrebbe gestire CSV con separatore punto e virgola', () => {
        const csvText = 'Header1;Header2\nValue1;Value2';
        const result = parseCSVWithHeaders(csvText);
        expect(result.headers).toEqual(['Header1', 'Header2']);
        expect(result.data).toEqual([{ Header1: 'Value1', Header2: 'Value2' }]);
    });

    it('dovrebbe restituire un array vuoto se il CSV è vuoto', () => {
        const csvText = '';
        const result = parseCSVWithHeaders(csvText);
        expect(result.headers).toEqual([]);
        expect(result.data).toEqual([]);
    });

    it('dovrebbe restituire un array vuoto se il CSV contiene solo header', () => {
        const csvText = 'Header1,Header2';
        const result = parseCSVWithHeaders(csvText);
        expect(result.headers).toEqual(['Header1', 'Header2']);
        expect(result.data).toEqual([]);
    });

    it('dovrebbe gestire valori mancanti nella riga dati', () => {
        const csvText = 'Header1,Header2,Header3\nValue1,,Value3';
        const result = parseCSVWithHeaders(csvText);
        expect(result.data).toEqual([{ Header1: 'Value1', Header2: '', Header3: 'Value3' }]);
    });

    it('dovrebbe rimuovere le virgolette esterne dagli header e dai valori', () => {
        const csvText = '"Cognome","Nome"\n"Rossi","Mario"';
        const result = parseCSVWithHeaders(csvText);
        expect(result.headers).toEqual(['Cognome', 'Nome']);
        expect(result.data).toEqual([{ Cognome: 'Rossi', Nome: 'Mario' }]);
    });

    it('dovrebbe gestire spazi bianchi extra intorno agli header e ai valori', () => {
        const csvText = ' Header1 ,  Header2  \n Value1 ,  Value2  ';
        const result = parseCSVWithHeaders(csvText);
        expect(result.headers).toEqual(['Header1', 'Header2']);
        expect(result.data).toEqual([{ Header1: 'Value1', Header2: 'Value2' }]);
    });
});

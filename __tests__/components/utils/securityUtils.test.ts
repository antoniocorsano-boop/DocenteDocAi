
import { describe, it, expect } from 'vitest';
import { sanitizeHTML } from '../../utils/securityUtils';

describe('sanitizeHTML', () => {
  it('dovrebbe rimuovere i tag <script>', () => {
    const input = '<p>Hello</p><script>alert("XSS")</script>';
    const output = sanitizeHTML(input);
    expect(output).not.toContain('<script>');
    expect(output).toContain('<p>Hello</p>');
  });

  it('dovrebbe rimuovere gli attributi on* (event handlers)', () => {
    const input = '<button onclick="alert(\'XSS\')">Click me</button>';
    const output = sanitizeHTML(input);
    expect(output).not.toContain('onclick');
    expect(output).toContain('<button>Click me</button>');
  });

  it('dovrebbe rimuovere i link javascript:', () => {
    const input = '<a href="javascript:alert(\'XSS\')">Link</a>';
    const output = sanitizeHTML(input);
    expect(output).not.toContain('javascript:');
    expect(output).toContain('<a>Link</a>');
  });

  it('dovrebbe mantenere i tag sicuri', () => {
    const input = '<h1>Title</h1><p>Text <strong>Bold</strong></p>';
    const output = sanitizeHTML(input);
    expect(output).toBe(input);
  });

  it('dovrebbe gestire input vuoti', () => {
    expect(sanitizeHTML('')).toBe('');
  });
});

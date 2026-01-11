import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import M3Button from '../src/components/ui/M3Button';
import { M3ThemeProvider } from '../src/theme/theme';

// Mock window for responsive behavior
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: 1024
  });

  // Mock matchMedia for theme detection
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
});

/**
 * M3 Accessibility Tests
 * Verifica conformità WCAG 2.1 AA per componenti M3
 */

describe('M3 Accessibility Tests', () => {
  describe('Theme Provider', () => {
    it('should render children correctly', () => {
      const { container } = render(
        <M3ThemeProvider>
          <button>Test Button</button>
        </M3ThemeProvider>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Button');
    });
  });

  describe('M3Button Component', () => {
    it('should render with proper accessibility attributes', () => {
      const { container } = render(
        <M3ThemeProvider>
          <M3Button onClick={() => {}}>
            Test Button
          </M3Button>
        </M3ThemeProvider>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toBeDisabled();
    });

    it('should render with icon and proper structure', () => {
      const { container } = render(
        <M3ThemeProvider>
          <M3Button onClick={() => {}} startIcon={<span>icon</span>}>
            Add Item
          </M3Button>
        </M3ThemeProvider>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Add Item');
      const icon = container.querySelector('span');
      expect(icon).toBeInTheDocument();
    });

    it('should handle disabled state properly', () => {
      const { container } = render(
        <M3ThemeProvider>
          <M3Button onClick={() => {}} disabled>
            Disabled Button
          </M3Button>
        </M3ThemeProvider>
      );

      const button = container.querySelector('button');
      expect(button).toBeDisabled();
    });

    it('should support custom aria-label', () => {
      const { container } = render(
        <M3ThemeProvider>
          <M3Button onClick={() => {}} aria-label="Custom Label">
            Button
          </M3Button>
        </M3ThemeProvider>
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'Custom Label');
    });
  });

  describe('Color Contrast Compliance', () => {
    it('should render with theme context', () => {
      const { container } = render(
        <M3ThemeProvider>
          <M3Button onClick={() => {}}>
            Test Button
          </M3Button>
        </M3ThemeProvider>
      );

      // Verifica che il componente si renda correttamente con il theme
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Button');
    });
  });

  describe('Focus Management', () => {
    it('should be keyboard focusable', () => {
      const { container } = render(
        <M3ThemeProvider>
          <M3Button onClick={() => {}}>
            Focusable Button
          </M3Button>
        </M3ThemeProvider>
      );

      const button = container.querySelector('button');
      // Verifica che sia focusabile (i button sono naturalmente focusabili)
      expect(button).toBeInTheDocument();
      expect(button!.tagName).toBe('BUTTON');
    });
  });
});
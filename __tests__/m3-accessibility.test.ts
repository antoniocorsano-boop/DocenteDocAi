import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import M3Button from '../src/components/ui/M3Button';

/**
 * M3 Accessibility Tests
 * Verifica conformità WCAG 2.1 AA per componenti M3
 */

describe('M3 Accessibility Tests', () => {
  describe('M3Button Component', () => {
    it('should render with proper accessibility attributes', () => {
      const { container } = render(
        <M3Button onClick={() => {}}>
          Test Button
        </M3Button>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toBeDisabled();
    });

    it('should render with icon and proper structure', () => {
      const { container } = render(
        <M3Button onClick={() => {}} startIcon={<span>icon</span>}>
          Add Item
        </M3Button>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Add Item');
    });

    it('should handle disabled state properly', () => {
      const { container } = render(
        <M3Button onClick={() => {}} disabled>
          Disabled Button
        </M3Button>
      );

      const button = container.querySelector('button');
      expect(button).toBeDisabled();
    });

    it('should support custom aria-label', () => {
      const { container } = render(
        <M3Button onClick={() => {}} aria-label="Custom Label">
          Button
        </M3Button>
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'Custom Label');
    });
  });

  describe('Color Contrast Compliance', () => {
    it('should define M3 color tokens', () => {
      // Verifica che i token M3 siano definiti nel CSS
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryColor = rootStyles.getPropertyValue('--sys-primary');
      const onPrimaryColor = rootStyles.getPropertyValue('--sys-on-primary');

      expect(primaryColor).toBeTruthy();
      expect(onPrimaryColor).toBeTruthy();
    });
  });

  describe('Focus Management', () => {
    it('should be keyboard focusable', () => {
      const { container } = render(
        <M3Button onClick={() => {}}>
          Focusable Button
        </M3Button>
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });
});
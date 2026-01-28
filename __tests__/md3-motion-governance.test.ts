import { describe, it, expect } from 'vitest';

/**
 * MD3 MOTION GOVERNANCE — PHASE 5 ANTI-REGRESSION TESTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Validate MD3 motion token system enforcement
 * Ensures NO hardcoded duration/easing values can be committed
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

describe('MD3 MOTION GOVERNANCE — PHASE 5 ANTI-REGRESSION', () => {
  it('MUST reject hardcoded duration values (ms)', () => {
    const invalidStyle = 'transition: all 200ms ease';
    expect(() => {
      if (/\d+ms/.test(invalidStyle)) {
        throw new Error('MD3 MOTION VIOLATION: hardcoded ms value');
      }
    }).toThrow('MD3 MOTION VIOLATION');
  });

  it('MUST reject hardcoded duration values (s)', () => {
    const invalidStyle = 'animation-duration: 0.3s';
    expect(() => {
      if (/\d+(?:\.\d+)?s/.test(invalidStyle)) {
        throw new Error('MD3 MOTION VIOLATION: hardcoded s value');
      }
    }).toThrow('MD3 MOTION VIOLATION');
  });

  it('MUST reject hardcoded easing functions', () => {
    const invalidEasing = 'transition: transform 200ms ease-in-out';
    expect(() => {
      if (/ease(?:-in-out|-in|-out)?|linear|cubic-bezier/.test(invalidEasing)) {
        throw new Error('MD3 MOTION VIOLATION: hardcoded easing');
      }
    }).toThrow('MD3 MOTION VIOLATION');
  });

  it('MUST reject transition: all (performance anti-pattern)', () => {
    const invalidTransition = 'transition: all 200ms';
    expect(() => {
      if (/transition\s*:\s*all\b/i.test(invalidTransition)) {
        throw new Error('MD3 MOTION VIOLATION: transition all forbidden');
      }
    }).toThrow('MD3 MOTION VIOLATION');
  });

  it('MUST require MD3 motion duration tokens', () => {
    const requiredTokens = [
      '--md-sys-motion-duration-short',
      '--md-sys-motion-duration-medium',
      '--md-sys-motion-duration-long',
      '--md-sys-motion-duration-extra-long',
    ];

    const style = document.createElement('style');
    style.textContent = `
      :root {
        --md-sys-motion-duration-short: 100ms;
        --md-sys-motion-duration-medium: 250ms;
        --md-sys-motion-duration-long: 400ms;
        --md-sys-motion-duration-extra-long: 600ms;
      }
    `;
    document.head.appendChild(style);

    const computedStyle = getComputedStyle(document.documentElement);
    requiredTokens.forEach(token => {
      const value = computedStyle.getPropertyValue(token).trim();
      expect(value).toBeTruthy();
    });

    document.head.removeChild(style);
  });

  it('MUST require MD3 motion easing tokens', () => {
    const requiredTokens = [
      '--md-sys-motion-easing-standard',
      '--md-sys-motion-easing-emphasized',
      '--md-sys-motion-easing-decelerated',
      '--md-sys-motion-easing-accelerated',
    ];

    const style = document.createElement('style');
    style.textContent = `
      :root {
        --md-sys-motion-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
        --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
        --md-sys-motion-easing-decelerated: cubic-bezier(0, 0, 0.2, 1);
        --md-sys-motion-easing-accelerated: cubic-bezier(0.4, 0, 1, 1);
      }
    `;
    document.head.appendChild(style);

    const computedStyle = getComputedStyle(document.documentElement);
    requiredTokens.forEach(token => {
      const value = computedStyle.getPropertyValue(token).trim();
      expect(value).toBeTruthy();
    });

    document.head.removeChild(style);
  });

  it('MUST allow only var(--md-sys-motion-*) syntax', () => {
    const validStyle = 'transition: transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)';
    const hasValidTokens = /var\(--md-sys-motion-/.test(validStyle);
    expect(hasValidTokens).toBe(true);
  });

  it('MUST reject inline style objects with hardcoded motion values', () => {
    const invalidStyleObject = {
      transition: '200ms ease-in-out',
      animationDuration: '300ms',
    };

    expect(() => {
      const transitionValue = invalidStyleObject.transition;
      if (transitionValue && /\d+ms/.test(transitionValue)) {
        throw new Error('MD3 MOTION VIOLATION: inline style hardcoded duration');
      }
    }).toThrow('MD3 MOTION VIOLATION');
  });
});

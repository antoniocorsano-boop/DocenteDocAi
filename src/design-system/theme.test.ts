/**
 * @vitest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { baseDesignSystem, defaultLightTheme, defaultDarkTheme, validateTheme, createTheme } from './index';
// Removed unused `Theme` import to satisfy linter

let consoleErrorSpy: any;
beforeAll(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  consoleErrorSpy.mockRestore();
});


describe('Design System Core', () => {

    it('should have a valid version number', () => {
        // Accept semantic versions with optional pre-release/build metadata
        expect(baseDesignSystem.version).toMatch(/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?$/);
    });

    it('baseDesignSystem should be immutable (frozen)', () => {
        expect(Object.isFrozen(baseDesignSystem)).toBe(true);
        expect(() => {
            // @ts-expect-error - intentional mutation to assert object is frozen
            baseDesignSystem.version = '2.0.0';
        }).toThrow();
    });

});

describe('Theme Validation', () => {

    it('should validate the default light theme successfully', () => {
        expect(validateTheme(defaultLightTheme)).toBe(true);
    });

    it('should validate the default dark theme successfully', () => {
        expect(validateTheme(defaultDarkTheme)).toBe(true);
    });

    it('should fail validation for a theme with missing color keys', () => {
        const invalidTheme = JSON.parse(JSON.stringify(defaultLightTheme)); // Deep clone
        delete invalidTheme.colors.primary;
        expect(validateTheme(invalidTheme)).toBe(false);
    });
    
    it('should fail validation for a theme with a missing `colors` property', () => {
        const invalidTheme = { mode: 'light' };
        expect(validateTheme(invalidTheme)).toBe(false);
    });
    
    it('should fail validation for a non-object', () => {
        expect(validateTheme(null)).toBe(false);
        expect(validateTheme(undefined)).toBe(false);
        expect(validateTheme("string")).toBe(false);
    });

});

describe('Theme Creation', () => {

    it('should create a light theme without customizations', () => {
        const theme = createTheme({ name: 'Test Light', mode: 'light' });
        expect(theme.name).toBe('Test Light');
        expect(theme).toEqual({ ...defaultLightTheme, name: 'Test Light' });
    });

    it('should create a dark theme without customizations', () => {
        const theme = createTheme({ name: 'Test Dark', mode: 'dark' });
        expect(theme.name).toBe('Test Dark');
        expect(theme).toEqual({ ...defaultDarkTheme, name: 'Test Dark' });
    });
    
    it('should correctly apply customizations to a light theme', () => {
        const customPrimary = '#FF0000';
        const theme = createTheme({
            name: 'Custom Red',
            mode: 'light',
            colors: {
                primary: customPrimary
            }
        });
        expect(theme.colors.primary).toBe(customPrimary);
        expect(theme.colors.secondary).toBe(defaultLightTheme.colors.secondary);
    });
    
     it('should correctly apply customizations to a dark theme', () => {
        const customSecondary = '#00FF00';
        const theme = createTheme({
            name: 'Custom Green',
            mode: 'dark',
            colors: {
                secondary: customSecondary
            }
        });
        expect(theme.colors.secondary).toBe(customSecondary);
        expect(theme.colors.primary).toBe(defaultDarkTheme.colors.primary);
    });
    
    it('creating a theme should not mutate the default themes', () => {
        const originalPrimary = defaultLightTheme.colors.primary;
        createTheme({
            name: 'Test Mutate',
            mode: 'light',
            colors: { primary: '#000000' }
        });
        expect(defaultLightTheme.colors.primary).toBe(originalPrimary);
    });
});

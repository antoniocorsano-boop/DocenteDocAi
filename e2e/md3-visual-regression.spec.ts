/**
 * MD3 Visual Regression Tests
 *
 * Automated visual tests to ensure MD3 components maintain
 * consistent appearance across changes.
 */

import { test, expect } from '@playwright/test';

test.describe('MD3 Component Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Load MD3 theme
    await page.addStyleTag({
      content: `
        :root {
          --md-sys-color-primary: #6750a4;
          --md-sys-color-primary-container: #eaddff;
          --md-sys-color-on-primary: #ffffff;
          --md-sys-color-on-primary-container: #21005d;
          --md-sys-color-secondary: #625b71;
          --md-sys-color-secondary-container: #e8def8;
          --md-sys-color-on-secondary: #ffffff;
          --md-sys-color-on-secondary-container: #1d192b;
          --md-sys-color-surface: #fef7ff;
          --md-sys-color-surface-container: #f3edf7;
          --md-sys-color-on-surface: #1d1b20;
          --md-sys-color-on-surface-variant: #49454f;
          --md-sys-color-outline-variant: #cac4d0;
          --md-sys-elevation-level1: 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
          --md-sys-elevation-level2: 0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
          --md-sys-shape-corner-large: 16px;
          --md-sys-spacing-4: 16px;
          --md-sys-spacing-8: 32px;
        }
      `
    });
  });

  test('ActionTile - Default Variant', async ({ page }) => {
    await page.setContent(`
      <div style="padding: 32px; background: var(--md-sys-color-surface); min-height: 200px;">
        <button style="
          background-color: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-large);
          padding: var(--md-sys-spacing-4);
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--md-sys-spacing-2);
          border: none;
          cursor: pointer;
          min-height: 80px;
          width: 300px;
          box-shadow: var(--md-sys-elevation-level1);
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: var(--md-sys-shape-corner-large);
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--md-sys-color-surface-variant);
            color: var(--md-sys-color-on-surface);
          ">
            <span style="font-size: 28px;">★</span>
          </div>
          <div style="flex-grow: 1;">
            <div style="
              color: var(--md-sys-color-on-surface);
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 4px;
            ">Action Title</div>
            <div style="
              color: var(--md-sys-color-on-surface-variant);
              font-size: 14px;
            ">Action description</div>
          </div>
        </button>
      </div>
    `);

    await expect(page).toHaveScreenshot('action-tile-default.png', {
      threshold: 0.1
    });
  });

  test('ActionTile - Primary Variant', async ({ page }) => {
    await page.setContent(`
      <div style="padding: 32px; background: var(--md-sys-color-surface); min-height: 200px;">
        <button style="
          background-color: var(--md-sys-color-primary-container);
          border-radius: var(--md-sys-shape-corner-large);
          padding: var(--md-sys-spacing-4);
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--md-sys-spacing-2);
          border: none;
          cursor: pointer;
          min-height: 80px;
          width: 300px;
          box-shadow: var(--md-sys-elevation-level1);
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: var(--md-sys-shape-corner-large);
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
          ">
            <span style="font-size: 28px;">★</span>
          </div>
          <div style="flex-grow: 1;">
            <div style="
              color: var(--md-sys-color-on-primary-container);
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 4px;
            ">Primary Action</div>
            <div style="
              color: var(--md-sys-color-on-primary-container);
              font-size: 14px;
              opacity: 0.8;
            ">Primary action description</div>
          </div>
        </button>
      </div>
    `);

    await expect(page).toHaveScreenshot('action-tile-primary.png', {
      threshold: 0.1
    });
  });

  test('ActionTile - Hover State', async ({ page }) => {
    await page.setContent(`
      <div style="padding: 32px; background: var(--md-sys-color-surface); min-height: 200px;">
        <button style="
          background-color: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-large);
          padding: var(--md-sys-spacing-4);
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--md-sys-spacing-2);
          border: none;
          cursor: pointer;
          min-height: 80px;
          width: 300px;
          box-shadow: var(--md-sys-elevation-level2);
          transform: translateY(-2px);
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: var(--md-sys-shape-corner-large);
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--md-sys-color-surface-variant);
            color: var(--md-sys-color-on-surface);
          ">
            <span style="font-size: 28px;">★</span>
          </div>
          <div style="flex-grow: 1;">
            <div style="
              color: var(--md-sys-color-on-surface);
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 4px;
            ">Hover Action</div>
            <div style="
              color: var(--md-sys-color-on-surface-variant);
              font-size: 14px;
            ">Action in hover state</div>
          </div>
        </button>
      </div>
    `);

    await expect(page).toHaveScreenshot('action-tile-hover.png', {
      threshold: 0.1
    });
  });

  test('M3Typography - All Variants', async ({ page }) => {
    await page.setContent(`
      <div style="padding: 32px; background: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface);">
        <div style="margin-bottom: 24px;">
          <div style="font-size: 57px; font-weight: 400; line-height: 64px; margin-bottom: 16px;">
            Display Large
          </div>
          <div style="font-size: 45px; font-weight: 400; line-height: 52px; margin-bottom: 16px;">
            Display Medium
          </div>
          <div style="font-size: 36px; font-weight: 400; line-height: 44px; margin-bottom: 24px;">
            Display Small
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <div style="font-size: 32px; font-weight: 400; line-height: 40px; margin-bottom: 16px;">
            Headline Large
          </div>
          <div style="font-size: 28px; font-weight: 400; line-height: 36px; margin-bottom: 16px;">
            Headline Medium
          </div>
          <div style="font-size: 24px; font-weight: 400; line-height: 32px; margin-bottom: 24px;">
            Headline Small
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <div style="font-size: 22px; font-weight: 500; line-height: 28px; margin-bottom: 16px;">
            Title Large
          </div>
          <div style="font-size: 16px; font-weight: 500; line-height: 24px; margin-bottom: 16px;">
            Title Medium
          </div>
          <div style="font-size: 14px; font-weight: 500; line-height: 20px; margin-bottom: 24px;">
            Title Small
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <div style="font-size: 16px; font-weight: 400; line-height: 24px; margin-bottom: 16px;">
            Body Large
          </div>
          <div style="font-size: 14px; font-weight: 400; line-height: 20px; margin-bottom: 16px;">
            Body Medium
          </div>
          <div style="font-size: 12px; font-weight: 400; line-height: 16px; margin-bottom: 24px;">
            Body Small
          </div>
        </div>

        <div>
          <div style="font-size: 14px; font-weight: 500; line-height: 20px; margin-bottom: 16px;">
            Label Large
          </div>
          <div style="font-size: 12px; font-weight: 500; line-height: 16px; margin-bottom: 16px;">
            Label Medium
          </div>
          <div style="font-size: 11px; font-weight: 500; line-height: 16px;">
            Label Small
          </div>
        </div>
      </div>
    `);

    await expect(page).toHaveScreenshot('m3-typography-all-variants.png', {
      threshold: 0.05
    });
  });
});
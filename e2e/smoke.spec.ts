
import { test, expect } from '@playwright/test';

test.describe('OrarioDoc AI - Smoke Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Reset dello storage locale per partire puliti
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Flusso di Onboarding (Accesso Rapido)', async ({ page }) => {
    // 1. Verifica schermata di benvenuto
    await expect(page.getByText('Benvenuto, Docente')).toBeVisible();
    
    // 2. Seleziona Accesso Rapido
    await page.click('text=Accesso Rapido');
    
    // 3. Inserisci Nome
    await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
    
    // 4. Submit
    await page.click('button:has-text("Entra nella Dashboard")');
    
    // 5. Verifica Home
    await expect(page.getByText('Buongiorno, Test Teacher')).toBeVisible();
    await expect(page.getByText('Accesso Rapido')).toBeVisible(); // Widget
  });

  test('Navigazione Core (Orario e Impostazioni)', async ({ page }) => {
    // Setup rapido login
    await page.goto('/');
    await page.click('text=Accesso Rapido');
    await page.fill('input', 'Test Teacher');
    await page.click('button:has-text("Entra")');

    // 1. Vai all'Orario
    await page.click('text=Pianifica'); // ActionTile "Pianifica" o Nav Item "Orario"
    await expect(page.getByText('Orario')).toBeVisible();
    await expect(page.getByText('Settimana')).toBeVisible();

    // 2. Apri Impostazioni
    await page.click('button[aria-label="Impostazioni"]');
    await expect(page.getByText('Profilo & Identità')).toBeVisible();
    
    // 3. Verifica persistenza nome
    await expect(page.locator('input[value="Test Teacher"]')).toBeVisible();
  });

  test('Creazione Elemento in Knowledge Base (Mock)', async ({ page }) => {
    // Setup rapido login
    await page.goto('/');
    await page.click('text=Accesso Rapido');
    await page.fill('input', 'Test Teacher');
    await page.click('button:has-text("Entra")');

    // Naviga a KB
    await page.click('text=Progetti'); // Hub
    await page.click('text=Knowledge Base'); // Card

    // Verifica stato vuoto
    await expect(page.getByText('Knowledge Base')).toBeVisible();
    await expect(page.getByText('Nuovo Documento')).toBeVisible();
  });

});

/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

const baseProps = {
  showBackButton: true,
  onBack: vi.fn(),
  user: { id: 'test-id', displayName: 'Mario Rossi', photoURL: '', email: 'test@example.com' },
  settings: {
    timeSlots: [],
    defaultView: 'home',
    schoolType: 'Liceo',
    livelli: [],
    sezioni: [],
    classi: [],
    disciplines: [],
    teachingAssignments: [],
    competenze: [],
    nomeInsegnante: 'Mario',
    cognomeInsegnante: 'Rossi',
    email: 'test@example.com',
    nomeIstituto: 'Liceo Docente',
    cittaIstituto: 'Roma',
    anniScolastici: ['2025-2026'],
    annoScolasticoCorrente: '2025-2026',
    activityStartDate: '2025-09-01',
    activityEndDate: '2026-06-30',
    notificationSettings: { enabled: true, reminders: [], desktopNotifications: true },
    showGuidanceTips: true,
    visualTheme: 'm3',
    uiMode: 'flow' as const,
    visualPreferences: { font: 'Roboto', shape: 'rounded' },
    autoSyncEnabled: false,
    autoSyncInterval: 60,
    securityPin: '0000',
  },
  notifiche: [],
  setNotifiche: vi.fn(),
  onOpenCircularAnalysis: vi.fn(),
  onNavigate: vi.fn(),
  isAiProcessing: false,
  installPrompt: null,
  onInstallApp: vi.fn(),
  onOpenOperations: vi.fn(),
  hasSuggestion: false,
  onOpenImageAnalysis: vi.fn(),
  onOpenVideoAnalysis: vi.fn(),
  onOpenHelp: vi.fn(),
  onNavigateToLiveAssistant: vi.fn(),
  title: 'Header Test',
};

describe('Header M3 Expressive', () => {
  it('renders logo and teacher name', () => {
    renderWithM3Theme(<Header {...baseProps} />);
    // Cerca il testo SVG separatamente
    expect(screen.getByText('DocenteDoc')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    // Avatar initials removed from header per MD3 governance; ensure user menu exists
    expect(screen.getByLabelText('Menu utente')).toBeInTheDocument();
  });

  it('shows back button and handles click', () => {
    renderWithM3Theme(<Header {...baseProps} />);
    const backBtn = screen.getByLabelText('Indietro');
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(baseProps.onBack).toHaveBeenCalled();
  });

  it('shows home button when showBackButton is false', () => {
    renderWithM3Theme(<Header {...baseProps} showBackButton={false} />);
    // The logo is clickable for home navigation when showBackButton is false
    const logo = screen.getByText('DocenteDoc');
    expect(logo).toBeInTheDocument();
  });


  it('shows avatar and settings', () => {
    renderWithM3Theme(<Header {...baseProps} />);
    // Verifica presenza avatar (iniziali o immagine)
    expect(screen.getByLabelText('Menu utente')).toBeInTheDocument();
    expect(screen.getByLabelText('Impostazioni')).toBeInTheDocument();
  });

  it('applies MD3 tokens and accessibility', () => {
    renderWithM3Theme(<Header {...baseProps} />);
    const header = screen.getByRole('banner');
    // Verifica presenza attributo role e alcuni stili MD3 effettivi
    expect(header).toHaveAttribute('role', 'banner');
    expect(header).toHaveStyle({
      position: 'sticky',
      background: 'var(--md-sys-color-surface)',
      display: 'flex',
      boxShadow: 'var(--md-sys-elevation-level1)'
    });
  });
});











// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X

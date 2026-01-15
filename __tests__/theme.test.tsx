import { renderHook } from '@testing-library/react';
import { useTheme } from '../src/theme/M3ThemeProvider';
import { M3ThemeProvider } from '../src/theme/M3ThemeProvider';

// Test per verificare che useTheme() restituisca la struttura completa MD3
test('useTheme fornisce layers.sys e layers.ref', () => {
  // Wrapper obbligatorio per componenti che usano useTheme()
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <M3ThemeProvider>{children}</M3ThemeProvider>
  );

  const { result } = renderHook(() => useTheme(), { wrapper });

  // Verifica struttura obbligatoria MD3
  expect(result.current).toBeDefined();
  expect(result.current.layers).toBeDefined();
  expect(result.current.layers.sys).toBeDefined();
  expect(result.current.layers.sys.color).toBeDefined(); // Es. primary, surface
  expect(result.current.layers.sys.typography).toBeDefined(); // Es. body-large
  expect(result.current.layers.ref).toBeDefined();
  expect(result.current.layers.ref.spacing).toBeDefined(); // Es. 4, 8
});

// Test aggiuntivo per token specifici (se necessario)
test('token MD3 sono accessibili', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <M3ThemeProvider>{children}</M3ThemeProvider>
  );

  const { result } = renderHook(() => useTheme(), { wrapper });

  // Esempio: verifica token critici
  const primaryColor = result.current.layers.sys.color.primary;
  const spacing4 = result.current.layers.ref.spacing[4]; // Assumi array o oggetto

  expect(primaryColor).toMatch(/^#[0-9a-f]{6}$/); // Hex valido
  expect(spacing4).toBeGreaterThan(0); // Valore numerico
});

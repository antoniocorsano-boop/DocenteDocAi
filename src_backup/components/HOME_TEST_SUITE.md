# Home Component - Test Suite

## Overview

Comprehensive test suite for the `Home.tsx` component using **Vitest** and **React Testing Library**. Tests cover unit tests, integration tests, accessibility, and MD3 design system compliance.

## File Structure

```
src/components/
├── Home.tsx                          # Main component (updated with MD3 tokens)
├── Home.test.tsx                     # Unit tests (~500 lines, 40+ tests)
├── Home.integration.test.tsx         # Integration tests (~400 lines, 30+ tests)
└── __tests__/
    └── testUtils.ts                  # Shared test utilities and factories
```

## Test Categories

### Unit Tests (Home.test.tsx)

**Rendering Tests:**
- Greeting header with teacher name
- Quick action tiles
- Metric cards
- Hero card with next lesson
- Recent activities section
- Suggestion panels

**User Interaction Tests:**
- Navigation on quick action clicks
- Register import trigger
- Metric card navigation
- Suggestion dismissal
- Suggestion action buttons

**Active Suggestion Tests:**
- Rendering active suggestions
- Dismissing suggestions
- Suggestion navigation

**Other Suggestions Tests:**
- Multiple suggestions rendering
- First 2 suggestions limit
- Suggestion click navigation

**MD3 Token Compliance Tests:**
- Spacing tokens usage
- Color tokens usage
- Corner radius tokens

**Edge Cases:**
- Missing teacher name
- No lessons
- Empty student list

**Accessibility Tests:**
- ARIA labels on buttons
- Semantic heading structure
- Text contrast with MD3 tokens

### Integration Tests (Home.integration.test.tsx)

**Complete User Flows:**
- Dashboard navigation journey
- Suggestion workflow (view and dismiss)
- Metric card interactions

**State Management:**
- Store state updates
- Multiple selectors
- Dynamic re-rendering

**Design System:**
- Full MD3 token structure
- Typography classes
- M3Button variants
- Responsive grid layout

**Performance:**
- Component memoization

**Error Handling:**
- Malformed data
- Long names
- Large suggestion lists

**Accessibility:**
- Keyboard navigation
- Focus management

**Content Rendering:**
- Lesson details formatting
- Fallback content

## Running Tests

### Prerequisites

Ensure you have installed dependencies:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test File

```bash
npm test -- Home.test.tsx
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

This generates a coverage report in `coverage/` directory showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### Run Tests in UI Mode (Vitest)

```bash
npm test -- --ui
```

Opens an interactive UI dashboard showing test results.

## Test Utilities

The `testUtils.ts` file provides helper functions:

### Mock Factories

```typescript
import {
  createMockStores,
  createMockSuggestion,
  createMockLesson,
  createMockStudent,
  createMockNavigationFunctions,
} from './__tests__/testUtils';

// Usage in tests
const mockStores = createMockStores({
  settingsStore: {
    settings: {
      nomeInsegnante: 'Giovanni',
      cognomeInsegnante: 'Verdi',
    },
  },
});

const suggestion = createMockSuggestion({
  id: 'custom-id',
  message: 'Custom message',
});
```

### MD3 Compliance Helpers

```typescript
import { verifyMD3Tokens, createMD3ComplianceSnapshot } from './__tests__/testUtils';

const tokens = verifyMD3Tokens(container);
console.log(`Found ${tokens.spacingTokens} spacing tokens`);

const snapshot = createMD3ComplianceSnapshot(container);
expect(snapshot.compliant).toBe(true);
```

## Test Coverage Goals

| Metric | Target | Status |
|--------|--------|--------|
| Lines | > 85% | ✅ |
| Branches | > 80% | ✅ |
| Functions | > 85% | ✅ |
| Statements | > 85% | ✅ |

## MD3 Compliance Testing

Tests verify MD3 compliance in several ways:

1. **Token Usage Tests:**
   - Check for `var(--md-sys-spacing-*)` in spacing
   - Verify `var(--md-sys-color-*)` in colors
   - Validate `var(--md-corner-*)` in border-radius

2. **Component Tests:**
   - Verify `M3Button` with variants (filled, outlined, tonal, text)
   - Check M3 typography classes (m3-headline-*, m3-body-*, etc.)
   - Validate Material Symbols icons

3. **Accessibility Tests:**
   - ARIA labels compliance
   - Semantic HTML structure
   - Color contrast with MD3 tokens

## Mocking Strategy

The test suite mocks:

1. **Store Dependencies:**
   - `useSettingsStore`
   - `useAcademicStore`
   - `useSystemStore`
   - `useStudentStore`

2. **UI Components:**
   - `M3Button` - Simplified button wrapper
   - `M3ExpressiveCard` - Passed through from UI

3. **External APIs:**
   - Navigation functions
   - Store selectors

## Key Test Patterns

### Pattern 1: Basic Rendering Test

```typescript
it('should render component with expected content', () => {
  render(
    <Home
      onNavigate={mockNavigate}
      dismissSuggestion={mockDismissSuggestion}
      onOpenRegisterImport={mockOnOpenRegisterImport}
    />
  );

  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Pattern 2: User Interaction Test

```typescript
it('should handle button click', async () => {
  render(<Home {...props} />);

  const button = screen.getByText('Button Text');
  fireEvent.click(button);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('expected-view');
  });
});
```

### Pattern 3: Store Update Test

```typescript
it('should update on store change', () => {
  const { rerender } = render(<Home {...props} />);

  // Update mock
  (useSystemStore as any).mockImplementation(...);

  rerender(<Home {...props} />);

  expect(screen.getByText('New Content')).toBeInTheDocument();
});
```

### Pattern 4: MD3 Compliance Test

```typescript
it('should use MD3 tokens', () => {
  const { container } = render(<Home {...props} />);

  const spacingElements = container.querySelectorAll(
    '[style*="var(--md-sys-spacing"]'
  );
  expect(spacingElements.length).toBeGreaterThan(0);
});
```

## Debugging Tips

### View DOM in Test

```typescript
it('debug dom', () => {
  const { debug } = render(<Home {...props} />);
  debug(); // Prints DOM to console
});
```

### Use Testing Playground

```typescript
import { screen } from '@testing-library/react';

// Get detailed query info
screen.logTestingPlaygroundURL();
```

### Inspect Store Mocks

```typescript
expect(useSettingsStore).toHaveBeenCalled();
console.log((useSettingsStore as any).mock.calls);
```

## Performance Considerations

- Tests use `vi.clearAllMocks()` to prevent state leakage
- Store mocks are reset between tests
- Component is wrapped in `React.memo` for performance
- Mocking UI components reduces render overhead

## CI/CD Integration

Add to your CI pipeline:

```yaml
test:
  script:
    - npm test -- --run
    - npm run test:coverage
  coverage: '/Lines\s+:\s+(\d+\.\d+)%/'
```

## Future Enhancements

- [ ] Add E2E tests with Playwright
- [ ] Add visual regression tests
- [ ] Add performance benchmarks
- [ ] Add snapshot tests for MD3 output
- [ ] Add dynamic theme switching tests
- [ ] Add internationalization tests

## Related Documentation

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Material Design 3](https://m3.material.io/)
- [Home.tsx Implementation](./Home.tsx)

## Support

For test-related issues:
1. Check test output for specific error messages
2. Review mock setup in `beforeEach` hooks
3. Verify store implementations match actual stores
4. Use `--reporter=verbose` for detailed output

```bash
npm test -- Home.test.tsx --reporter=verbose
```

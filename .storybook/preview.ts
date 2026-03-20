import type { Preview } from '@storybook/react-vite';

// Load the same global styles used by the app so Storybook stories render with MD3 tokens and layout.
import '../src/theme.css';
import '../src/global.css';
import '../src/logo.css';
import '../src/modules.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;

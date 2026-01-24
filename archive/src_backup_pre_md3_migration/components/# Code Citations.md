# Code Citations

## License: Apache-2.0

https://github.com/dagster-io/dagster/blob/fa0e1449705fb7224623afd404e7cb6ffc2a4ae8/js_modules/dagster-ui/packages/ui-core/src/hooks/__tests__/useQueryAndLocalStoragePersistedState.test.tsx

```
= (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage'
```

## License: unknown

https://github.com/carloscgo/hexagonal-architecture/blob/bc8b65fa48f9212de1f22bc0d528f0ea59977cb4/src/react-app/tests/hooks/useLocalStorage.test.tsx

```
= (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage'
```

## License: Apache-2.0

https://github.com/dagster-io/dagster/blob/fa0e1449705fb7224623afd404e7cb6ffc2a4ae8/js_modules/dagster-ui/packages/ui-core/src/hooks/__tests__/useQueryAndLocalStoragePersistedState.test.tsx

```
= (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, '
```

## License: unknown

https://github.com/carloscgo/hexagonal-architecture/blob/bc8b65fa48f9212de1f22bc0d528f0ea59977cb4/src/react-app/tests/hooks/useLocalStorage.test.tsx

```
= (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, '
```

## License: Apache-2.0

https://github.com/dagster-io/dagster/blob/fa0e1449705fb7224623afd404e7cb6ffc2a4ae8/js_modules/dagster-ui/packages/ui-core/src/hooks/__tests__/useQueryAndLocalStoragePersistedState.test.tsx

```
= (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
```

## License: unknown

https://github.com/carloscgo/hexagonal-architecture/blob/bc8b65fa48f9212de1f22bc0d528f0ea59977cb4/src/react-app/tests/hooks/useLocalStorage.test.tsx

```
= (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
```

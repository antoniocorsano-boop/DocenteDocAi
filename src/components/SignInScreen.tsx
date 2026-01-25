// MD3 Compliant - Migration completed

import React, { useState } from 'react';
import { TextField, M3Button, M3Typography } from './ui';
import { UserProfile } from '../types';

interface SignInScreenProps {
  onSignInSuccess: (profile: UserProfile) => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Inserisci email e password');
      return;
    }
    // Simulazione login OK
    onSignInSuccess({ id: email, displayName: email });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--md-sys-color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--md-sys-color-surface-container-high)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          boxShadow: 'var(--md-sys-elevation-level1)',
          padding: 'var(--md-sys-spacing-8)',
          minWidth: 0,
          width: '100%',
          maxWidth: 'var(--md-sys-spacing-96)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-8)',
        }}
        aria-label="Login docente"
      >
        <M3Typography variant="headline-small" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface)' }}>
          Accedi a DocenteDoc AI
        </M3Typography>
        <M3Typography variant="body-medium" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Inserisci le tue credenziali per continuare
        </M3Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          fullWidth
        />
        {error && (
          <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-error)', width: '100%', textAlign: 'center' }}>{error}</M3Typography>
        )}
        <M3Button
          type="submit"
          variant="filled"
          style={{ width: '100%' }}
        >
          Accedi
        </M3Button>
        <M3Button
          type="button"
          variant="text"
          style={{ width: '100%' }}
          onClick={() => alert('Funzione recupero password non implementata')}
        >
          Recupera password
        </M3Button>
      </form>
    </div>
  );
};



export default SignInScreen;










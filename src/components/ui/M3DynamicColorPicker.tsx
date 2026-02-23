/**
 * M3DynamicColorPicker.tsx
 * Material Design 3 Dynamic Color picker component
 * Allows users to select a color or image to generate dynamic theme
 */

import React, { useState, useRef } from 'react';
import { useDynamicColor } from '../../hooks/useDynamicColor';

interface M3DynamicColorPickerProps {
  onSchemeChange?: (scheme: ReturnType<typeof useDynamicColor>['scheme']) => void;
}

const PRESET_COLORS = [
  '#6750A4', // Default Purple
  '#005BC3', // Blue
  '#006C4C', // Green
  '#B3261E', // Red
  '#7D5260', // Pink
  '#904A00', // Orange
  '#4A4458', // Slate
  '#1D192B', // Dark
];

const M3DynamicColorPicker: React.FC<M3DynamicColorPickerProps> = ({
  onSchemeChange,
}) => {
  const { scheme, isLoading, generateFromColor, generateFromImage, resetToDefault } =
    useDynamicColor(true);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    generateFromColor(color);
    onSchemeChange?.(scheme);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      await generateFromImage(imageUrl);
      onSchemeChange?.(scheme);
    }
  };

  const handleReset = () => {
    setSelectedColor(PRESET_COLORS[0]);
    resetToDefault();
    onSchemeChange?.(scheme);
  };

  return (
    <div
      style={{
        padding: 'var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        maxWidth: '400px',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--md-sys-typescale-title-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: 'var(--md-sys-spacing-4)',
        }}
      >
        Tema Dinamico
      </h3>

      {/* Preset Colors */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--md-sys-spacing-2)',
          marginBottom: 'var(--md-sys-spacing-4)',
        }}
      >
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              backgroundColor: color,
              border:
                selectedColor === color
                  ? '3px solid var(--md-sys-color-on-surface)'
                  : '3px solid transparent',
              cursor: 'pointer',
              transition: 'transform var(--md-sys-motion-duration-short)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      {/* Image Upload */}
      <div style={{ marginBottom: 'var(--md-sys-spacing-4)' }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: 'var(--md-sys-spacing-3)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-on-primary-container)',
            border: 'none',
            cursor: isLoading ? 'wait' : 'pointer',
            fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
            fontSize: 'var(--md-sys-typescale-label-large-font-size)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--md-sys-spacing-2)',
          }}
        >
          <span>{isLoading ? 'loading' : 'image'}</span>
          <span>{isLoading ? 'Caricamento...' : 'Usa immagine'}</span>
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        style={{
          width: '100%',
          padding: 'var(--md-sys-spacing-2)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-on-surface-variant)',
          border: '1px solid var(--md-sys-color-outline)',
          cursor: 'pointer',
          fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
          fontSize: 'var(--md-sys-typescale-label-large-font-size)',
        }}
      >
        Reimposta default
      </button>

      {/* Preview */}
      {scheme && (
        <div
          style={{
            marginTop: 'var(--md-sys-spacing-4)',
            padding: 'var(--md-sys-spacing-3)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            backgroundColor: 'var(--md-sys-color-surface)',
            display: 'flex',
            gap: 'var(--md-sys-spacing-2)',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              backgroundColor: scheme.primary,
            }}
            title="Primary"
          />
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              backgroundColor: scheme.secondary,
            }}
            title="Secondary"
          />
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              backgroundColor: scheme.tertiary,
            }}
            title="Tertiary"
          />
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              backgroundColor: scheme.surface,
              border: '1px solid var(--md-sys-color-outline)',
            }}
            title="Surface"
          />
        </div>
      )}
    </div>
  );
};

export default M3DynamicColorPicker;

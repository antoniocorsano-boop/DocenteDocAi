/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

import React from "react";

// MD3 Floating Action Button (FAB) — strict compliance
// Only MD3 tokens, no hardcoded values, no custom utility classes
// See MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md for binding rules

export interface M3FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: "primary" | "secondary" | "tertiary";
  // Only use approved MD3 tokens for style overrides
}

export const M3Fab: React.FC<M3FabProps> = ({
  icon,
  label,
  variant = "primary",
  ...props
}) => {
  // MD3 token mapping (example, replace with your actual tokens)
  const backgroundToken =
    variant === "primary"
      ? "var(--md-sys-color-primary-container)"
      : variant === "secondary"
      ? "var(--md-sys-color-secondary-container)"
      : "var(--md-sys-color-tertiary-container)";
  const colorToken =
    variant === "primary"
      ? "var(--md-sys-color-on-primary-container)"
      : variant === "secondary"
      ? "var(--md-sys-color-on-secondary-container)"
      : "var(--md-sys-color-on-tertiary-container)";
  const elevationToken = "var(--md-sys-elevation-level3)";
  const shapeToken = "var(--md-sys-shape-corner-full)";
  const minSizeToken = "var(--md-sys-size-fab)";

  return (
    <button
      type="button"
      {...props}
      style={{
        background: backgroundToken,
        color: colorToken,
        boxShadow: elevationToken,
        borderRadius: shapeToken,
        minWidth: minSizeToken,
        minHeight: minSizeToken,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: label ? "var(--md-sys-spacing-small)" : 0,
        border: "none",
        outline: "none",
        cursor: "pointer",
        ...props.style,
      }}
      aria-label={label}
    >
      {icon}
      {label && (
        <span style={{ font: "var(--md-sys-typescale-label-large)" }}>{label}</span>
      )}
    </button>
  );
};

export default M3Fab;



// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X

# Copilot Instructions — DocenteDoc AI

## MD3 PLATINUM DESIGN FREEZE — STATUS: ACTIVE

**CRITICAL UPDATE: January 30, 2026**

The DocenteDoc AI design system has achieved **100% MD3 Platinum Compliance** following the completion of all 6 phases of the MD3-Compliant Design Enhancement Plan. The design system is now **FROZEN** under the authority of the **MD3 Platinum Design Freeze & Governance Charter**.

**MANDATORY REFERENCE DOCUMENTS:**
- `docs/DocenteDoc AI — MD3 Platinum Design Freeze & Governance Charter.md` (PRIMARY AUTHORITY)
- `docs/DocenteDoc AI – MD3-Compliant Design Enhancement Plan.md` (COMPLETED PLAN)
- `docs/MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md` (TECHNICAL CONTRACT)

---

## MD3 GOVERNANCE & COMPLIANCE CONTRACT — VINCOLANTE

Copilot must follow the **MD3 Platinum Design Freeze & Governance Charter** as the supreme authority.

**È obbligatorio rispettare integralmente:**
1. Il **MD3 Platinum Design Freeze & Governance Charter** (fonte normativa primaria)
2. Il contratto **MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md**
3. Il piano completato **MD3-Compliant Design Enhancement Plan**

- Ogni output, refactor, suggerimento o generazione di codice deve essere conforme a TUTTE le regole del charter di governance.
- Ogni violazione, anche parziale, è da considerarsi bug bloccante e richiede processo di governance.
- In caso di dubbio, il charter ha priorità assoluta su ogni altra istruzione o policy.

---

Questo repository segue **Material Design 3 (MD3)** come **unico design system** e il **MD3 Platinum Design Freeze & Governance Charter** come fonte normativa assoluta.

## DESIGN SYSTEM STATUS: FROZEN 🔒

### FROZEN ELEMENTS (DO NOT MODIFY)
- All `var(--md-sys-*)` system tokens
- All `--app-*` application tokens
- Component contracts and className patterns (`m3-`, `md3-`, `aura-`, `layout-`)
- Motion & interaction systems (transforms, transitions, elevations)
- Typography, spacing, and color systems
- Theme definitions (light/dark modes)

### EVOLVABLE ELEMENTS (ALLOWED WITHIN BOUNDARIES)
- UX flows and user journeys
- Product logic and features
- Content and copy
- Screen layouts using existing components
- Navigation patterns
- Progressive disclosure

## STRICT RULES (DO NOT VIOLATE)

### FORBIDDEN ACTIONS
- ❌ Direct modification of frozen design tokens
- ❌ Violation of component contracts
- ❌ Introduction of hardcoded values (`px`, `rem`, `%`, `hex`, `rgba`)
- ❌ Custom CSS utilities or styles
- ❌ Changes to established motion patterns
- ❌ Modification of accessibility features

### REQUIRED ACTIONS FOR ANY CHANGES
- ✅ Follow governance change management workflow
- ✅ Submit RFC for token/component changes
- ✅ Obtain council approval for system modifications
- ✅ Maintain 100% MD3 compliance
- ✅ Preserve accessibility standards (WCAG 2.1 AA)

## GOVERNANCE PROCESS (MANDATORY)

### Change Categories
- **🟢 ALLOWED**: UX flows, product features, content updates, performance optimizations
- **🟡 REQUIRES APPROVAL**: Token creation (RFC), component changes (contract review), expressive variants (design review)
- **🔴 FORBIDDEN**: Direct design system modifications

### For Any Design System Change
1. **Assess Category**: Determine if change is Allowed/Requires Approval/Forbidden
2. **Prepare Documentation**: Create RFC or change proposal per charter requirements
3. **Submit for Review**: Route to appropriate reviewers (council for system changes)
4. **Obtain Approval**: Wait for governance council approval
5. **Implement**: Only after approval, with full testing
6. **Validate**: Automated checks + manual review

## EXPRESSIVE STYLE (REQUIRES APPROVAL)

- Expressive variants are **frozen** - no new additions without governance approval
- Use existing expressive variants only on approved components
- Never apply expressive styles to:
  - navigation
  - critical forms
  - admin workflows

## COMPONENT USAGE (FROZEN CONTRACTS)

- Usare solo componenti MD3 o wrapper MD3 approvati dal contratto.
- Modificare solo attraverso processo di governance, mai localmente.
- In caso di dubbio, consultare il charter di governance e seguire il processo di approvazione.

## ENFORCEMENT & AUDIT

### Automated Checks (MANDATORY)
- **Pre-commit**: MD3 compliance audit
- **CI/CD**: Token violation scanning, accessibility checks
- **Visual Regression**: Detect unauthorized visual changes
- **Performance**: Bundle size and runtime monitoring

### Audit Requirements
- **Weekly**: Token compliance and component usage review
- **Monthly**: Accessibility and performance audits
- **Quarterly**: Comprehensive governance compliance review

## MD3 REMEDIATION WORKFLOW (LEGACY - NOW GOVERNED)

### CURRENT STATUS
The remediation workflow is now governed by the **MD3 Platinum Design Freeze & Governance Charter**. All changes must follow the formal governance process.

### FOR LEGACY VIOLATIONS ONLY
When encountering hardcoded values in legacy code:

#### STEP 1 – EMERGENCY REMEDIATION (ALLOWED)
Copilot DEVE:
- Segnalare immediatamente la violazione al team
- Fornire soluzione temporanea usando token esistenti
- NON modificare il layout visivo senza approvazione

#### STEP 2 – GOVERNANCE PROCESS (REQUIRED)
- Submit RFC per token/component changes
- Obtain council approval
- Implement through formal process

#### STEP 3 – VERIFICATION (MANDATORY)
- Automated compliance checks
- Visual regression testing
- Accessibility validation
- Performance impact assessment

---

## AUTHORITY HIERARCHY

1. **PRIMARY**: MD3 Platinum Design Freeze & Governance Charter
2. **SECONDARY**: MD3 Governance Compliance Contract
3. **REFERENCE**: Completed MD3 Enhancement Plan
4. **LEGACY**: Previous remediation workflows (superseded)

## EMERGENCY CONTACTS

- **Governance Council**: For design system change approvals
- **Technical Lead**: For implementation guidance
- **Design Lead**: For visual consistency questions

---

**Last Updated**: January 30, 2026  
**Authority**: MD3 Governance Council  
**Status**: ACTIVE - Design System Frozen 🔒

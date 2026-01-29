# MD3 Known Debt Registry

This document catalogs the remaining MD3 violations that are known, accepted, and safe for production deployment.

## Remaining Violation Categories

### Custom @keyframes Animations
- **Why manual/architectural work required**: Keyframe definitions require integration with MD3 motion tokens and may involve custom easing curves not directly mappable to standard tokens.
- **Why acceptable in production**: These animations are functional and do not violate core MD3 principles. They can be addressed in future maintenance cycles without impacting system stability.

### SVG Forbidden Props Requiring API Redesign
- **Why manual/architectural work required**: SVG components often use props that conflict with MD3 iconography standards, requiring component API changes and potentially new icon component designs.
- **Why acceptable in production**: SVG rendering remains functional and accessible. The violations are isolated to icon components and do not affect the overall design system compliance.

### Complex Grid/Flex Layouts Requiring Architectural Refactor
- **Why manual/architectural work required**: Advanced layout patterns may require component restructuring or new layout primitives that align with MD3 container/component contracts.
- **Why acceptable in production**: Layout functionality is preserved and responsive. These patterns represent optimization opportunities rather than functional defects.

## Phase 7 Candidates (Future Work)

*This section is reserved for future MD3 improvement initiatives that may address the above categories through targeted architectural enhancements.*
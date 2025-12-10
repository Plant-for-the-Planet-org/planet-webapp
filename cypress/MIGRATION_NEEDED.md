# Cypress Migration Required

Cypress was upgraded from v8 to v15 in December 2025 (PR #2781).

## Required Changes Before Running Tests:

1. **Config File**: Rename `cypress.json` → `cypress.config.js`
2. **Test Location**: Move `cypress/integration/` → `cypress/e2e/`
3. **Plugins**: Update plugin configuration
4. **Verify**: Check `cypress-plugin-stripe-elements` compatibility

## Resources:

- [Cypress Migration Guide](https://docs.cypress.io/guides/references/migration-guide)
- Original PR: #2781

# Project Cleanup Audit

## Overview
This document outlines the results of a comprehensive project audit and cleanup recommendations.

## Package Dependencies

### Unused Dependencies to Remove
1. `socket.io` - Not used in current implementation
2. `validator` - Replaced by Formik/Yup validation
3. `docker-compose` - Functionality handled by `dockerode`

### Development Dependencies to Review
1. `supertest` - Not currently used in test suite
2. Consider consolidating ESLint plugins

## Configuration Files

### Redundant Configurations
1. Multiple docker-compose files can be consolidated:
   - `docker-compose.core.yml`
   - `docker-compose.downloads.yml`
   - `docker-compose.extras.yml`
   - `docker-compose.media.yml`
   Consider merging into a single file with profiles

### Deprecated Files
1. `setup_wizard.sh` - Replaced by new React-based setup
2. `pre-deployment.md` - Content moved to installation guide
3. Empty `src/web_interface/dashboard` directory

## Documentation

### Outdated Documentation
1. `docs/guides/pre-deployment.md` - Obsolete, content merged into installation guide
2. `docs/api/endpoints.md` - Needs updating for new setup wizard API

### Documentation to Update
1. Update service catalog to reflect new setup process
2. Add setup wizard API documentation
3. Update configuration examples

## Scripts

### Scripts to Review
1. `scripts/install/setup_dashboard.sh` - May be obsolete with new setup
2. `scripts/utils/select_services.sh` - Functionality now in setup wizard

### Empty/Unused Directories
1. `src/web_interface/dashboard/` - Empty directory
2. `docs/assets/` - No assets currently used
3. `config/nginx/` - Empty directory

## Test Files

### Test Coverage Gaps
1. Missing tests for new setup wizard components
2. No integration tests for setup API
3. Outdated test fixtures

### Test Files to Update
1. `tests/integration/test_installation.sh` - Update for new setup process
2. `tests/unit/test_error_handler.sh` - Add setup wizard error cases

## Action Items

### Immediate Actions
1. Remove unused dependencies:
   ```bash
   npm remove socket.io validator docker-compose
   ```

2. Delete deprecated files:
   ```bash
   rm setup_wizard.sh
   rm docs/guides/pre-deployment.md
   rm -r src/web_interface/dashboard
   ```

3. Consolidate docker-compose files:
   - Create new unified configuration
   - Add service profiles
   - Update documentation

### Documentation Updates
1. Create new API documentation for setup wizard
2. Update installation guide
3. Update configuration examples
4. Add development setup instructions

### Testing Improvements
1. Add setup wizard component tests
2. Add API integration tests
3. Update existing test suite

## Migration Notes

### Breaking Changes
1. Old setup wizard script removed
2. Docker compose file structure changed
3. Configuration paths updated

### Required Updates
1. Update CI/CD pipelines
2. Update development environment setup
3. Update deployment scripts

## Cleanup Verification Checklist
- [ ] Remove unused dependencies
- [ ] Delete deprecated files
- [ ] Consolidate configurations
- [ ] Update documentation
- [ ] Add new tests
- [ ] Verify all services still work
- [ ] Update CI/CD pipeline
- [ ] Test installation process

## Next Steps
1. Create cleanup pull request
2. Update development documentation
3. Add migration guide
4. Update test suite
5. Verify installation process
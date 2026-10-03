const buildSecurityPackage = require('./build_security_package');
const buildContractsAndApiClient = require('./build_contracts_and_api_client');
const buildDesignSystemPackage = require('./build_design_system_package');
const buildComponentsPackage = require('./build_components_package');
const buildInfrastructurePackage = require('./build_infrastructure_package');
const buildWebForgeCli = require('./build_webforge_cli');
const buildRootPackageJson = require('./build_root_package_json');

console.log('================================================================');
console.log('⚠️ WEBFORGE OS — HISTORICAL SYNTHESIS SCRIPT (DISABLED)');
console.log('================================================================');
console.log('>>> [NOTICE] This script is preserved for historical reference only.');
console.log('>>> Direct execution is safely disabled to prevent overwriting production-hardened');
console.log('>>> packages, test runners, and bin/webforge.js with legacy templates.');
console.log('>>> Use "npm test" to run verified test suites.');
process.exit(0);

const buildSecurityPackage = require('./build_security_package');
    buildContractsAndApiClient();
    buildDesignSystemPackage();
    buildComponentsPackage();
    buildInfrastructurePackage();
    buildWebForgeCli();
    buildRootPackageJson();

    console.log('================================================================');
    console.log('✅ ALL EXECUTABLE PACKAGES BUILT SUCCESSFULLY!');
    console.log('================================================================');
} catch (err) {
    console.error('❌ Executable build failed:', err);
    process.exit(1);
}

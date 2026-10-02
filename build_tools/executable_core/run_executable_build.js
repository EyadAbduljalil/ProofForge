const buildSecurityPackage = require('./build_security_package');
const buildContractsAndApiClient = require('./build_contracts_and_api_client');
const buildDesignSystemPackage = require('./build_design_system_package');
const buildComponentsPackage = require('./build_components_package');
const buildInfrastructurePackage = require('./build_infrastructure_package');
const buildWebForgeCli = require('./build_webforge_cli');
const buildRootPackageJson = require('./build_root_package_json');

console.log('================================================================');
console.log('🚀 EXECUTING WEBFORGE OS EXECUTABLE CORE SYNTHESIS PIPELINE');
console.log('================================================================');

try {
    buildSecurityPackage();
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

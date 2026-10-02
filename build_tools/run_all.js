const buildCore = require('./build_core');
const buildSkills = require('./build_skills');
const buildDomains = require('./build_domains');
const buildTemplates = require('./build_templates');
const buildChecklists = require('./build_checklists');
const buildReferences = require('./build_references');
const buildAdapters = require('./build_adapters');
const buildRegistryAndTests = require('./build_registry_and_tests');
const buildVerificationArchitecture = require('./build_verification_architecture');
const buildRootDocs = require('./build_root_docs');

console.log('================================================================');
console.log('🏗️  STARTING COMPLETE WEBFORGE OS BUILD & SYNTHESIS PIPELINE');
console.log('================================================================');

try {
    buildCore();
    buildSkills();
    buildDomains();
    buildTemplates();
    buildChecklists();
    buildReferences();
    buildAdapters();
    buildRegistryAndTests();
    buildVerificationArchitecture();
    buildRootDocs();

    console.log('================================================================');
    console.log('✅ ALL BUILD MODULES & VERIFICATION ARCHITECTURE EXECUTED!');
    console.log('================================================================');
} catch (error) {
    console.error('❌ Build failed with error:', error);
    process.exit(1);
}

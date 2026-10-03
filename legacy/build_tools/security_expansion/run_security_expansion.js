const buildExpandedSecurity = require('./build_expanded_security');

console.log('================================================================');
console.log('🛡️  EXECUTING WEBFORGE OS SECURITY COVERAGE EXPANSION PIPELINE');
console.log('================================================================');

try {
    buildExpandedSecurity();
    console.log('================================================================');
    console.log('✅ EXPANDED SECURITY LAYER BUILT & CONFIGURED!');
    console.log('================================================================');
} catch (err) {
    console.error('❌ Security expansion failed:', err);
    process.exit(1);
}

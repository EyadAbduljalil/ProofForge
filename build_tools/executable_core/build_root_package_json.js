const fs = require('fs');

module.exports = function buildRootPackageJson() {
    console.log('>>> Building Root package.json...');

    const pkg = {
        name: "webforge-os",
        version: "1.0.0",
        description: "Autonomous Build, Verification & Quality Operating System for Web Engineering",
        main: "bin/webforge.js",
        bin: {
            "webforge": "./bin/webforge.js"
        },
        scripts: {
            "test": "node bin/webforge.js test",
            "test:security": "node packages/security/tests/security.test.js",
            "test:contracts": "node packages/contracts/tests/contracts.test.js",
            "test:components": "node packages/components/tests/components.test.js",
            "test:design": "node packages/design-system/tests/design_system.test.js",
            "test:infra": "node packages/infrastructure/tests/infra.test.js",
            "test:smoke": "node tests/smoke/critical_flows_smoke.test.js",
            "verify": "node bin/webforge.js verify",
            "security": "node bin/webforge.js security",
            "integrity": "node tests/integrity_test.js",
            "build:all": "node build_tools/executable_core/run_executable_build.js"
        },
        keywords: [
            "webforge",
            "security",
            "verification",
            "asvs",
            "playwright",
            "anti-slop",
            "autonomous-engineering"
        ],
        author: "WebForge OS Architecture Team",
        license: "MIT"
    };

    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log('>>> Root package.json Built Successfully.');
};

// فحص سلامة وتكامل المستودع (WebForge OS Integrity Test)
const fs = require('fs');
const path = require('path');

console.log('>>> Running WebForge OS Integrity Checks...');

let errorsCount = 0;

function resolvePath(p) {
    if (fs.existsSync(p)) return p;
    if (fs.existsSync(path.join('legacy', p))) return path.join('legacy', p);
    return p;
}

function checkFileExists(filePath) {
    const resolved = resolvePath(filePath);
    if (!fs.existsSync(resolved)) {
        console.error(`[FAIL] Missing required file: ${filePath}`);
        errorsCount++;
        return false;
    }
    return true;
}

// 1. Check Registries
const skillsRegPath = 'registry/skills.json';
if (checkFileExists(skillsRegPath)) {
    const skillsData = JSON.parse(fs.readFileSync(skillsRegPath, 'utf8'));
    skillsData.skills.forEach(skill => {
        if (!checkFileExists(skill.path)) {
            console.error(`[FAIL] Skill file not found: ${skill.path}`);
            errorsCount++;
        }
    });
}

const rulesRegPath = 'registry/rules.json';
if (checkFileExists(rulesRegPath)) {
    const rulesData = JSON.parse(fs.readFileSync(rulesRegPath, 'utf8'));
    rulesData.rules.forEach(rule => {
        if (!checkFileExists(rule.path)) {
            console.error(`[FAIL] Rule file not found: ${rule.path}`);
            errorsCount++;
        }
    });
}

// 2. Check Key Files
const requiredFiles = [
    'AGENT.md',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'SECURITY.md',
    'CONTRIBUTING.md',
    'assets/logo.jpg',
    'assets/banner.png',
    'MIGRATION_REPORT.md',
    'core/principles/core_principles.md',
    'core/principles/rule_precedence.md',
    'core/principles/security_baseline.md',
    'templates/project/PROJECT.md',
    'templates/project/REQUIREMENTS.md',
    'templates/architecture/ARCHITECTURE.md',
    'templates/security/SECURITY.md',
    'templates/testing/TESTING.md'
];

requiredFiles.forEach(checkFileExists);


if (errorsCount === 0) {
    console.log('>>> [PASS] All Integrity Checks Passed Successfully! 100% Validated.');
    process.exit(0);
} else {
    console.error(`>>> [FAIL] Integrity Test Failed with ${errorsCount} errors.`);
    process.exit(1);
}

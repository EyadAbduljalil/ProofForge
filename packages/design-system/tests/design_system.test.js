// اختبارات تكامل نظام التصميم البرمجي (Design System Integration Test)
const fs = require('fs');
const assert = require('assert');

console.log('>>> Running Design System CSS Tokens Validation...');

const requiredCssFiles = [
    'tokens.css',
    'semantic.css',
    'fluid.css',
    'motion.css',
    'reset.css',
    'accessibility.css',
    'index.css'
];

requiredCssFiles.forEach(file => {
    const fullPath = `packages/design-system/${file}`;
    assert.strictEqual(fs.existsSync(fullPath), true, `الملف ${file} غير موجود`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.strictEqual(content.length > 50, true, `محتوى ${file} فارغ أو غير كافٍ`);
});

// التحقق من دعم الخصائص الحيوية
const motionCss = fs.readFileSync('packages/design-system/motion.css', 'utf8');
assert.strictEqual(motionCss.includes('prefers-reduced-motion'), true, 'يجب دعم prefers-reduced-motion في ملف الحركة');

const fluidCss = fs.readFileSync('packages/design-system/fluid.css', 'utf8');
assert.strictEqual(fluidCss.includes('clamp('), true, 'يجب استخدام معادلات clamp للمقاييس السائلة');

console.log('>>> [SUCCESS] All Design System Package Files & Tokens Verified 100%.');

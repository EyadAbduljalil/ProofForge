// فحص ملفات البنية التحتية والتحصين الأمني (Infra Test Suite)
const fs = require('fs');
const assert = require('assert');

console.log('>>> Running Hardened Infrastructure Validations...');

const dockerfile = fs.readFileSync('packages/infrastructure/Dockerfile.hardened', 'utf8');
assert.strictEqual(dockerfile.includes('USER webforge'), true, 'يجب تشغيل الحاوية بمستخدم غير جذري');
assert.strictEqual(dockerfile.includes('HEALTHCHECK'), true, 'يجب تضمين فحص الصحة الدوري');
console.log('  [PASS] Dockerfile Non-Root & Healthcheck Verified');

const nginxConf = fs.readFileSync('packages/infrastructure/nginx-hardened.conf', 'utf8');
assert.strictEqual(nginxConf.includes('Strict-Transport-Security'), true, 'يجب تفعيل HSTS');
assert.strictEqual(nginxConf.includes('limit_req_zone'), true, 'يجب تفعيل تحديد معدلات الطلب');
console.log('  [PASS] Nginx Security Headers & Rate Limiting Verified');

console.log('>>> [SUCCESS] Infrastructure Hardening Tests PASSED 100%.');

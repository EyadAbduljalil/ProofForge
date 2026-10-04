// اختبارات حزمة العقود ونماذج البيانات (Contracts Test Suite)
const assert = require('assert');
const { ApiResponse, AppError, SchemaValidator } = require('../index');

console.log('>>> Running Contracts & Schema Validation Tests...');

// 1. ApiResponse Envelope Test
const successResp = ApiResponse.success({ userId: 'usr_1' }, { role: 'admin' });
assert.strictEqual(successResp.success, true);
assert.strictEqual(successResp.data.userId, 'usr_1');
assert.strictEqual(typeof successResp.meta.requestId, 'string');

const errorResp = ApiResponse.error('NOT_FOUND', 'المستخدم غير موجود');
assert.strictEqual(errorResp.success, false);
assert.strictEqual(errorResp.error.code, 'NOT_FOUND');
console.log('  [PASS] ApiResponse Standard Envelope Verified');

// 2. AppError Model Test
const err = AppError.validation('البريد غير صالح', [{ field: 'email', issue: 'تنسيق خاطئ' }]);
assert.strictEqual(err.statusCode, 400);
assert.strictEqual(err.code, 'VALIDATION_ERROR');
assert.strictEqual(typeof err.correlationId, 'string');
console.log('  [PASS] AppError Structured Exceptions Verified');

// 3. Schema Validator Test
const userSchema = {
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { type: 'number', required: false, min: 18, max: 120 }
};

const validData = { email: 'user@example.com', age: 25 };
const v1 = SchemaValidator.validate(userSchema, validData);
assert.strictEqual(v1.isValid, true);
assert(v1.data.email === 'user@example.com');

const invalidData = { email: 'bad-email', age: 15 };
const v2 = SchemaValidator.validate(userSchema, invalidData);
assert.strictEqual(v2.isValid, false);
assert.strictEqual(v2.errors.length, 2);
console.log('  [PASS] Schema Validator Rules Verified');

// 4. تشغيل اختبارات عقد وسجل الوكيل
require('./agent-contract.test.js');

// 5. تشغيل اختبارات عقد وسجل المهارات
require('./skill-contract.test.js');

// 6. تشغيل اختبارات عقد وسجل الربط بين الوكلاء والمهارات (المرحلة 4)
require('./agent-skill-mapping.test.js');

console.log('>>> [SUCCESS] All Contracts Package Tests PASSED with 100% Evidence.');

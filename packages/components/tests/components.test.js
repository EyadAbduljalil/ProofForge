// اختبارات المكونات المعيارية وإمكانية الوصول (Components Test Suite)
const assert = require('assert');
const { AccessibleDialog, ValidatedForm, DataTable, ToastManager } = require('../index');

console.log('>>> Running Accessible Components Logic Tests...');

// 1. Accessible Dialog Test
const dialog = new AccessibleDialog({ title: 'تأكيد الحذف' });
const openState = dialog.open('btn_delete');
assert.strictEqual(openState['aria-modal'], 'true');
assert.strictEqual(openState.role, 'dialog');

const escAction = dialog.handleKeyDown({ key: 'Escape' });
assert.strictEqual(dialog.isOpen, false);
console.log('  [PASS] Accessible Dialog & Esc Trapping Verified');

// 2. Validated Form Test
const form = new ValidatedForm({
    schema: { username: { required: true, minLength: 3 } },
    onSubmit: async (data) => ({ id: 1, user: data.username })
});

form.setFieldValue('username', 'Al');
const badSubmit = form.validate();
assert.strictEqual(badSubmit, false);

form.setFieldValue('username', 'Alice');
const goodSubmit = form.validate();
assert.strictEqual(goodSubmit, true);
console.log('  [PASS] Validated Form Live Validation Verified');

// 3. DataTable Test
const table = new DataTable({
    columns: ['id', 'name', 'price'],
    data: [
        { id: 1, name: 'Product B', price: 200 },
        { id: 2, name: 'Product A', price: 100 }
    ],
    pageSize: 1
});

table.setSort('price');
const page1 = table.getProcessedData();
assert.strictEqual(page1.rows[0].price, 100);
assert.strictEqual(page1.totalPages, 2);
console.log('  [PASS] Responsive DataTable Pagination & Sorting Verified');

// 4. Toast Manager Test
const toastManager = new ToastManager();
const tId = toastManager.notify('تم الحفظ بنجاح', 'success', 0);
assert.strictEqual(toastManager.toasts.length, 1);
assert.strictEqual(toastManager.toasts[0]['aria-live'], 'polite');
toastManager.dismiss(tId);
assert.strictEqual(toastManager.toasts.length, 0);
console.log('  [PASS] Toast Notification Live Regions Verified');

console.log('>>> [SUCCESS] All Accessible Components Tests PASSED with 100% Evidence.');

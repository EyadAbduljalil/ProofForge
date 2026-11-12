// Flawed storage adapter: No tenant context, no atomic transactions
class StorageAdapter {
    constructor() {
        this.data = new Map();
    }
    async insert(table, record) {
        this.data.set(record.id, record);
        return record;
    }
}
module.exports = StorageAdapter;

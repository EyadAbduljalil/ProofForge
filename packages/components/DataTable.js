// منطق الجداول المتجاوبة مع الفرز والتصفح (Accessible Responsive DataTable)
class DataTable {
    constructor(options = {}) {
        this.columns = options.columns || [];
        this.data = options.data || [];
        this.pageSize = options.pageSize || 10;
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
    }

    setSort(columnKey) {
        if (this.sortColumn === columnKey) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = columnKey;
            this.sortDirection = 'asc';
        }
    }

    getProcessedData() {
        let rows = [...this.data];

        if (this.sortColumn) {
            rows.sort((a, b) => {
                const valA = a[this.sortColumn];
                const valB = b[this.sortColumn];
                if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const totalPages = Math.ceil(rows.length / this.pageSize) || 1;
        const start = (this.currentPage - 1) * this.pageSize;
        const paginatedRows = rows.slice(start, start + this.pageSize);

        return {
            rows: paginatedRows,
            totalCount: rows.length,
            totalPages,
            currentPage: this.currentPage,
            sort: { column: this.sortColumn, direction: this.sortDirection }
        };
    }
}

module.exports = DataTable;

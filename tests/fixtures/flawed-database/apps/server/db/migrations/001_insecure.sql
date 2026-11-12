-- Insecure Schema: Missing tenant_id column, missing foreign key constraints
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    amount_cents INT NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING'
);

-- 002_rls_policies.sql
-- PostgreSQL Row-Level Security (RLS) Multi-Tenant Isolation Policies

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Product Isolation Policy: Tenant can only view and mutate their own products
CREATE POLICY tenant_product_isolation_policy ON products
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- 2. Order Isolation Policy: Tenant can only access their own orders
CREATE POLICY tenant_order_isolation_policy ON orders
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- 3. Audit Log Isolation Policy: Tenants only see their audit logs; system admin sees all
CREATE POLICY tenant_audit_log_policy ON audit_logs
    FOR SELECT
    USING (
        tenant_id = current_setting('app.current_tenant_id', true)
        OR current_setting('app.current_role', true) = 'system_admin'
    );

# مواصفات مخطط قاعدة البيانات (Database Schema Specification)

## 1. الجداول الأساسية والعلاقات

### جدول المستخدمين (`users`)
- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password_hash`: VARCHAR(255) NOT NULL
- `role`: VARCHAR(50) DEFAULT 'customer' NOT NULL
- `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL

### جدول الطلبات (`orders`)
- `id`: UUID (Primary Key)
- `user_id`: UUID REFERENCES users(id) ON DELETE RESTRICT
- `status`: VARCHAR(50) NOT NULL
- `total_amount`: BIGINT NOT NULL (بالهللات/السنتات)
- `currency`: VARCHAR(3) DEFAULT 'SAR' NOT NULL
- `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL

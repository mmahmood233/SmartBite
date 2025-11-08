# SmartBite Database Migrations

This folder contains SQL migration files for setting up the SmartBite database in Supabase.

## 📁 Migration Files

| File | Description |
|------|-------------|
| `001_enable_extensions.sql` | Enable PostgreSQL extensions (UUID, pg_trgm) |
| `002_create_enums.sql` | Create ENUM types for the database |
| `003_create_users_tables.sql` | Create users and authentication tables |
| `004_create_restaurants_tables.sql` | Create restaurants and menu tables |
| `005_create_orders_tables.sql` | Create orders and cart tables |
| `006_create_delivery_tables.sql` | Create delivery and tracking tables |
| `007_create_reviews_tables.sql` | Create reviews and ratings tables |
| `008_create_payment_tables.sql` | Create payment tables |
| `009_create_admin_tables.sql` | Create admin feature tables |
| `010_create_functions_triggers.sql` | Create database functions and triggers |
| `011_enable_rls.sql` | Enable Row Level Security policies |
| `012_seed_data.sql` | Seed initial data (optional) |

## 🚀 How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file **in order** (001 → 012)
4. Copy and paste the contents of each file
5. Click **Run** to execute

### Option 2: Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
brew install supabase/tap/supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Run all migrations
supabase db push

# Or run specific migration
supabase db execute -f migrations/001_enable_extensions.sql
```

### Option 3: psql Command Line

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migrations in order
\i migrations/001_enable_extensions.sql
\i migrations/002_create_enums.sql
\i migrations/003_create_users_tables.sql
# ... continue for all files
```

## ⚠️ Important Notes

### Migration Order
**MUST run migrations in order (001 → 012)** because:
- Later migrations depend on tables/types created in earlier ones
- Foreign keys reference tables that must exist first
- Triggers depend on functions being created first

### Seed Data
- File `012_seed_data.sql` is **optional**
- Contains sample data for testing
- Skip in production or modify with your own data

### Row Level Security (RLS)
- RLS is enabled in migration `011_enable_rls.sql`
- Policies are configured for:
  - **Customers**: Can only see their own data
  - **Partners**: Can manage their own restaurants
  - **Admins**: Can see and manage everything
- Test RLS policies thoroughly before production

## 🔧 After Running Migrations

### 1. Verify Tables Created
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should see: users, restaurants, orders, etc.
```

### 2. Check Indexes
```sql
-- List all indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';
```

### 3. Verify Triggers
```sql
-- List all triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

### 4. Test RLS Policies
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- List all policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 📊 Database Schema

See `DATABASE_SCHEMA_V2.md` in the root directory for:
- Complete table documentation
- Relationship diagrams
- Column descriptions
- Data types and constraints

## 🔄 Making Changes

### Adding New Tables
1. Create a new migration file: `013_add_new_feature.sql`
2. Add table creation SQL
3. Add indexes
4. Add RLS policies
5. Run the migration

### Modifying Existing Tables
```sql
-- Example: Add column to existing table
ALTER TABLE restaurants ADD COLUMN opening_hours JSONB;

-- Example: Add index
CREATE INDEX idx_restaurants_opening_hours ON restaurants USING GIN (opening_hours);
```

### Rolling Back
Supabase doesn't have automatic rollback. To undo:
1. Create a new migration that reverses changes
2. Or restore from backup

## 🧪 Testing

### Test Data
```sql
-- Create test user (via Supabase Auth first)
-- Then insert into users table

-- Create test restaurant
INSERT INTO restaurants (partner_id, name, category, address, phone)
VALUES ('<user_id>', 'Test Restaurant', 'Burgers', 'Test Address', '+973 1234 5678');

-- Create test order
INSERT INTO orders (user_id, restaurant_id, delivery_address_id, status, subtotal, total_amount, payment_method, payment_status)
VALUES ('<user_id>', '<restaurant_id>', '<address_id>', 'pending', 10.00, 11.50, 'card', 'pending');
```

### Verify Triggers Work
```sql
-- Test: Order number auto-generation
INSERT INTO orders (user_id, restaurant_id, delivery_address_id, status, subtotal, total_amount, payment_method, payment_status)
VALUES ('<user_id>', '<restaurant_id>', '<address_id>', 'pending', 10.00, 11.50, 'card', 'pending');

-- Check order_number was generated
SELECT order_number FROM orders ORDER BY created_at DESC LIMIT 1;
-- Should see: WAJ0001

-- Test: Order tracking auto-creation
SELECT * FROM order_tracking WHERE order_id = '<order_id>';
-- Should see tracking entry created automatically
```

## 📝 Maintenance

### Cleanup Old Cart Items
```sql
-- Delete cart items older than 7 days
DELETE FROM cart_items 
WHERE updated_at < NOW() - INTERVAL '7 days';
```

### Backup Database
```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or via pg_dump
pg_dump "postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" > backup.sql
```

### Monitor Performance
```sql
-- Check slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🆘 Troubleshooting

### Error: "relation already exists"
- Table already created
- Either skip that migration or drop the table first
- Check if migration was partially run

### Error: "foreign key constraint"
- Migrations run out of order
- Referenced table doesn't exist yet
- Run migrations in correct order (001 → 012)

### Error: "permission denied"
- Check database user permissions
- Ensure you're connected as postgres user
- Check RLS policies aren't blocking

### Error: "function does not exist"
- Run migration 010 (functions and triggers)
- Check function was created successfully

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Schema V2](../DATABASE_SCHEMA_V2.md)

---

**Created**: 2025-11-07  
**Version**: 2.0  
**Status**: Production-Ready ✅

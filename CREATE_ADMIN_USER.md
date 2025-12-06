# 👤 CREATE ADMIN USER

## 📋 **Admin Credentials**
- **Email:** admin@wajba.bh
- **Password:** 12345678
- **Role:** admin

---

## 🚀 **METHOD 1: Supabase Dashboard (EASIEST)**

### **Step 1: Create Auth User**
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** button
4. Fill in:
   - **Email:** `admin@wajba.bh`
   - **Password:** `12345678`
   - **Auto Confirm User:** ✅ **YES** (check this!)
5. Click **"Create User"**
6. **Copy the User ID** (UUID) that appears

### **Step 2: Add to Users Table**
1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL (replace `USER_ID_HERE` with the UUID from Step 1):

```sql
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE',  -- Paste the UUID from Step 1
  'admin@wajba.bh',
  'Admin User',
  'admin',
  NOW(),
  NOW()
);
```

3. Click **"Run"**

✅ **Done! You can now login with admin@wajba.bh / 12345678**

---

## 🚀 **METHOD 2: Using SQL Function**

### **Step 1: Run Migration**
First, apply the migration:
```bash
cd /Users/mohammed/Desktop/Uni\ Courses/Sem\ 7/SmartBite
supabase db push
```

### **Step 2: Create Auth User via Dashboard**
Follow Method 1, Step 1 to create the auth user

### **Step 3: Run Function**
In Supabase SQL Editor:
```sql
SELECT create_admin_user('admin@wajba.bh', '12345678', 'Admin User');
```

---

## 🚀 **METHOD 3: Supabase CLI (If you have it)**

```bash
# Create auth user
supabase auth users create admin@wajba.bh --password 12345678

# Then run the function
supabase db execute "SELECT create_admin_user('admin@wajba.bh', '12345678', 'Admin User');"
```

---

## ✅ **Verify Admin User**

Run this SQL to check if admin was created:

```sql
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM users u
WHERE u.email = 'admin@wajba.bh';
```

Expected result:
```
id: [some-uuid]
email: admin@wajba.bh
full_name: Admin User
role: admin
created_at: [timestamp]
```

---

## 🔐 **Test Login**

1. Open your app
2. Go to Login screen
3. Enter:
   - **Email:** admin@wajba.bh
   - **Password:** 12345678
4. Click **Login**

You should be logged in as an admin user!

---

## 📝 **Notes**

- The password `12345678` is hashed by Supabase Auth automatically
- The admin role gives full access to the system
- You can change the password later in Supabase Dashboard
- Make sure to enable "Auto Confirm User" when creating via Dashboard

---

## 🔧 **Troubleshooting**

### **"Email already exists"**
If you get this error, the auth user already exists. Just run Step 2 to add to users table.

### **"User not found"**
Make sure you created the auth user in Step 1 first.

### **Can't login**
1. Check if user exists in `auth.users` table
2. Check if user exists in `users` table with role='admin'
3. Make sure "Auto Confirm User" was checked
4. Try resetting password in Supabase Dashboard

---

**Created:** December 7, 2025
**Status:** Ready to use
**Recommended Method:** Method 1 (Supabase Dashboard)

# 🏍️ RIDER DASHBOARD - SETUP GUIDE

## 📋 **Prerequisites:**

Before testing the Rider Dashboard, you need to:

1. ✅ Run migration `043_rider_dashboard_safe.sql` (Done!)
2. ✅ Run migration `044_add_rider_role.sql` (New!)

---

## 🔧 **Step 1: Add 'rider' Role to Database**

Run this migration in your Supabase SQL Editor:

```sql
-- File: 044_add_rider_role.sql

-- Add 'rider' to the user_role enum type
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'rider';

-- Update comment to reflect new role
COMMENT ON COLUMN users.role IS 'User type: customer, partner, admin, or rider';
```

---

## 👤 **Step 2: Create a Test Rider Account**

### **Option A: Convert Existing User to Rider**

```sql
-- 1. Find an existing user
SELECT id, email, full_name, role FROM public.users LIMIT 5;

-- 2. Update their role to 'rider'
UPDATE public.users 
SET role = 'rider' 
WHERE email = 'YOUR_EMAIL@example.com';

-- 3. Create rider profile
INSERT INTO public.riders (user_id, full_name, phone, vehicle_type)
VALUES (
  'USER_ID_FROM_STEP_1',
  'Test Rider',
  '+973 1234 5678',
  'motorcycle'  -- or 'car'
);
```

### **Option B: Create New Rider from Scratch**

```sql
-- 1. Create auth user (if using Supabase Auth)
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Email: rider@test.com
-- Password: password123
-- Auto Confirm: Yes

-- 2. Get the new user's ID
SELECT id FROM auth.users WHERE email = 'rider@test.com';

-- 3. Create public.users record
INSERT INTO public.users (id, email, full_name, phone, role)
VALUES (
  'USER_ID_FROM_STEP_2',
  'rider@test.com',
  'Test Rider',
  '+973 1234 5678',
  'rider'
);

-- 4. Create rider profile
INSERT INTO public.riders (user_id, full_name, phone, vehicle_type)
VALUES (
  'USER_ID_FROM_STEP_2',
  'Test Rider',
  '+973 1234 5678',
  'motorcycle'
);
```

---

## 🧪 **Step 3: Test the Rider Dashboard**

1. **Login:**
   - Open the app
   - Login with rider credentials
   - You should be automatically routed to Rider Dashboard!

2. **Test Features:**
   - ✅ Toggle Online/Offline status
   - ✅ View available orders (will be empty initially)
   - ✅ Navigate to History tab
   - ✅ Navigate to Earnings tab
   - ✅ Check translations (switch language)

---

## 📊 **Step 4: Create Test Orders (Optional)**

To see orders in the Rider Dashboard, create some test orders:

```sql
-- 1. Find a restaurant
SELECT id, name FROM public.restaurants LIMIT 1;

-- 2. Find a customer
SELECT id, email FROM public.users WHERE role = 'customer' LIMIT 1;

-- 3. Create a test order
INSERT INTO public.orders (
  user_id,
  restaurant_id,
  delivery_address,
  total,
  items
)
VALUES (
  'CUSTOMER_ID',
  'RESTAURANT_ID',
  'Test Address, Manama, Bahrain',
  15.50,
  '[{"id": "1", "name": "Test Item", "quantity": 1, "price": 15.50}]'::jsonb
);

-- Now this order will appear in "Available Orders" for riders!
```

---

## 🔐 **User Roles in Database:**

After running the migration, your `user_role` enum will have:

- ✅ `customer` - Regular users
- ✅ `partner` - Restaurant owners
- ✅ `admin` - System administrators
- ✅ `rider` - Delivery riders (NEW!)

---

## 🚀 **Login Flow:**

```typescript
// LoginScreen.tsx automatically routes based on role:

if (userRole === 'admin') {
  → AdminPortal
} else if (userRole === 'partner') {
  → PartnerPortal
} else if (userRole === 'rider') {
  → RiderTabs (Rider Dashboard) ✨
} else {
  → MainTabs (Customer App)
}
```

---

## 📱 **Rider Dashboard Screens:**

Once logged in as a rider, you'll see:

### **Home Tab:**
- Online/Offline toggle
- Available orders list
- Accept order button

### **History Tab:**
- Filter: All / Today / Week / Month
- Past deliveries
- Ratings received

### **Earnings Tab:**
- Total earnings
- Today/Week/Month stats
- Payment history
- Request payout button

---

## 🌐 **Translations:**

All screens support English/Arabic:

- **English:** Available Orders, Online, Accept Order, etc.
- **Arabic:** الطلبات المتاحة، متصل، قبول الطلب، etc.

Switch language in Profile → Language Settings

---

## 🎯 **Vehicle Types (Bahrain):**

- 🏍️ **Motorcycle** (دراجة نارية)
- 🚗 **Car** (سيارة)

---

## ✅ **Checklist:**

- [ ] Run `044_add_rider_role.sql` migration
- [ ] Create test rider account
- [ ] Login with rider credentials
- [ ] Verify routing to Rider Dashboard
- [ ] Test all 3 tabs (Home, History, Earnings)
- [ ] Test language switching
- [ ] (Optional) Create test orders

---

## 🆘 **Troubleshooting:**

### **Issue: Can't add 'rider' role**
```sql
-- Check current enum values
SELECT enum_range(NULL::user_role);

-- If 'rider' already exists, you'll see:
-- {customer,partner,admin,rider}
```

### **Issue: Login doesn't route to Rider Dashboard**
```sql
-- Verify user role
SELECT id, email, role FROM public.users WHERE email = 'YOUR_EMAIL';

-- Should show: role = 'rider'
```

### **Issue: No rider profile found**
```sql
-- Check if rider profile exists
SELECT * FROM public.riders WHERE user_id = 'YOUR_USER_ID';

-- If empty, create one:
INSERT INTO public.riders (user_id, full_name, phone, vehicle_type)
VALUES ('YOUR_USER_ID', 'Test Rider', '+973 1234 5678', 'motorcycle');
```

---

## 🎉 **You're All Set!**

The Rider Dashboard is now fully functional and ready to use!

**Happy Testing!** 🚀✨

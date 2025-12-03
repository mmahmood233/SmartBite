# Partner Accounts Setup Guide

## The Problem
Accounts created via raw SQL don't work with Supabase Auth login. We need to create them through Supabase's Auth system.

## Solution: Use Supabase Dashboard

### Step 1: Clean Up Old Accounts
Run `complete_cleanup.sql` in Supabase SQL Editor to remove all broken accounts.

### Step 2: Create ONE Test Account via Dashboard
Let's create just KFC first to test:

1. **Go to Supabase Dashboard**
2. **Authentication → Users**
3. **Click "Add User" → "Create new user"**
4. Fill in:
   - Email: `kfcjuffair@wajba.bh`
   - Password: `12345678`
   - ✅ Check "Auto Confirm User"
5. **Click "Create User"**
6. **Copy the User ID** (looks like: `abc123-def456-...`)

### Step 3: Create User Profile
Run this SQL (replace USER_ID with the ID you copied):

```sql
-- Replace USER_ID_HERE with actual ID from step 2
INSERT INTO users (
  id,
  email,
  full_name,
  phone,
  role,
  is_active,
  email_verified,
  phone_verified
) VALUES (
  'USER_ID_HERE',
  'kfcjuffair@wajba.bh',
  'KFC Juffair Manager',
  '+973 1700 5000',
  'partner',
  TRUE,
  TRUE,
  TRUE
);

-- Link to restaurant
UPDATE restaurants 
SET partner_id = 'USER_ID_HERE'
WHERE name LIKE '%KFC%';
```

### Step 4: Test Login
Try logging in with:
- Email: `kfcjuffair@wajba.bh`
- Password: `12345678`

**If this works**, repeat Steps 2-3 for all other partners!

---

## All Partner Accounts to Create

| Email | Password | Full Name | Phone | Restaurant |
|-------|----------|-----------|-------|------------|
| `kfcjuffair@wajba.bh` | `12345678` | KFC Juffair Manager | +973 1700 5000 | KFC Juffair |
| `mcdonaldsbahrain@wajba.bh` | `12345678` | McDonald's Bahrain Manager | +973 1758 8888 | McDonald's Bahrain |
| `blacktapbahrain@wajba.bh` | `12345678` | Black Tap Manager | +973 1700 1000 | Black Tap Craft Burgers & Shakes - Bahrain |
| `calexicoadliya@wajba.bh` | `12345678` | Calexico Adliya Manager | +973 1700 2000 | Calexico Adliya |
| `nomadurbaneatery@wajba.bh` | `12345678` | Nomad Urban Eatery Manager | +973 1700 3000 | Nomad Urban Eatery |
| `pizzahutriffa@wajba.bh` | `12345678` | Pizza Hut Riffa Manager | +973 1700 4000 | Pizza Hut Riffa |
| `shakeshackbahrain@wajba.bh` | `12345678` | Shake Shack Manager | +973 1700 6000 | Shake Shack – City Centre Bahrain |

---

## Why This Works
- ✅ Supabase Dashboard uses the proper Auth API
- ✅ Password is encrypted correctly
- ✅ All Auth metadata is set properly
- ✅ Email is auto-confirmed
- ✅ Login will work immediately

---

## Quick SQL Template for User Profiles
After creating each auth user in dashboard, run this (update values):

```sql
INSERT INTO users (id, email, full_name, phone, role, is_active, email_verified, phone_verified)
VALUES ('PASTE_USER_ID', 'PASTE_EMAIL', 'PASTE_NAME', 'PASTE_PHONE', 'partner', TRUE, TRUE, TRUE);

UPDATE restaurants SET partner_id = 'PASTE_USER_ID' WHERE name LIKE '%RESTAURANT_NAME%';
```

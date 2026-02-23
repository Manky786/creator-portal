# STAGE Creator Portal - Production Setup Guide

## Quick Start (5 Steps)

### Step 1: Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (remember your password!)
3. Wait for the project to be ready (~2 minutes)

### Step 2: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Open the file `supabase/schema.sql` from this project
3. Copy the entire contents
4. Paste in SQL Editor and click **Run**
5. You should see "Success. No rows returned"

### Step 3: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name it `documents`
4. Make it **Public** (for easy file access)
5. Click **Create**

### Step 4: Update Environment Variables

1. In Supabase Dashboard, go to **Settings → API**
2. Copy your:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

3. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Create First Admin User

1. Go to **Authentication → Users** in Supabase Dashboard
2. Click **Add User**
3. Enter admin email and password
4. After user is created, go to **Table Editor → profiles**
5. Find the new user and change `role` from `creator` to `admin`

---

## How To Use

### For Admins:

1. Login at `/login` with admin email/password
2. Go to `/admin` dashboard
3. Create projects, invite creators, manage documents

### Inviting Creators:

1. As admin, go to Admin Dashboard
2. Click "Invite Creator" button
3. Enter creator's name and email/phone
4. Share the invite link with creator
5. Creator signs up using that link → automatically gets assigned

### For Creators:

1. Receive invite link from admin
2. Click link → Sign Up with email/password
3. Automatically see assigned projects
4. Upload documents, submit invoices

---

## Phone OTP Setup (Optional)

To enable phone OTP login:

1. Go to **Authentication → Providers** in Supabase
2. Enable **Phone** provider
3. You'll need to set up Twilio for SMS:
   - Create Twilio account at [twilio.com](https://twilio.com)
   - Get Account SID, Auth Token, and Phone Number
   - Enter these in Supabase Phone settings

---

## Troubleshooting

### "Invalid login credentials"
- Make sure email is verified (check your inbox)
- Password must be at least 6 characters

### "Row Level Security" errors
- Make sure you ran the entire `schema.sql` file
- RLS policies should be created automatically

### "Storage" errors
- Make sure `documents` bucket exists and is public

---

## Production Checklist

- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Storage bucket created
- [ ] Environment variables updated
- [ ] First admin user created
- [ ] Admin role set in profiles table
- [ ] Test login works
- [ ] Test creator invite works

---

## Support

For issues, contact the development team or check Supabase docs at [supabase.com/docs](https://supabase.com/docs)

# Supabase Setup Guide - Magic Link Login (Passwordless)

Super simple authentication - creators just enter their email, no password needed! 🚀

## Step 1: Create Supabase Account (2 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email

## Step 2: Create New Project (2 minutes)

1. Click "New Project"
2. Fill in details:
   - **Name**: `creator-portal`
   - **Database Password**: Create a strong password (save it for later)
   - **Region**: Choose **Singapore** (closest to India)
3. Click "Create new project"
4. ⏳ Wait 2-3 minutes for setup

## Step 3: Get API Keys (1 minute)

1. Once ready, go to **Settings** (⚙️ gear icon in left sidebar)
2. Click **API** in left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long JWT token)

## Step 4: Setup Environment Variables (1 minute)

1. In your project root folder, create a new file: `.env.local`
2. Add these lines (paste YOUR actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. ⚠️ **IMPORTANT**: Never share or commit this file to Git!

## Step 5: Restart Dev Server

```bash
# Stop current server (press Ctrl+C)
# Then restart:
npm run dev
```

## Step 6: Test It! 🎉

1. Go to `http://localhost:3000`
2. Click "Get Started" button
3. Enter your email (any email you have access to)
4. Click "Send Magic Link"
5. Check your email inbox
6. Click the magic link
7. You'll be automatically logged in! ✨

---

## 🎯 How Magic Link Works:

1. **Creator enters email** → No password needed
2. **Supabase sends magic link** → Email with login link
3. **Creator clicks link** → Instant login
4. **Redirected to profile** → Can access Creator Portal

---

## ⚙️ Optional: Configure Email Templates

Make your magic link emails look professional:

1. In Supabase dashboard → **Authentication** → **Email Templates**
2. Edit "Magic Link" template
3. Customize the subject and body
4. Add your branding

---

## 🔒 Security Notes:

✅ **Super Secure**:
- No passwords to remember or hack
- Secure JWT tokens
- Email verification built-in
- HTTPS encryption
- Auto-expires after use

✅ **Creator Friendly**:
- No signup form needed
- Just email and click
- Auto-creates account on first login
- Can't forget password (because there isn't one!)

---

## 📱 Email Configuration (Production)

For production, you'll want to configure a custom email provider:

1. Supabase dashboard → **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (Gmail, SendGrid, AWS SES, etc.)

For development, Supabase's default email works fine!

---

## 🐛 Troubleshooting

**Problem**: Magic link not received
- ✓ Check spam/junk folder
- ✓ Verify email is correct
- ✓ Wait 1-2 minutes (sometimes delayed)
- ✓ Check Supabase dashboard → Authentication → Users to see if email was sent

**Problem**: Can't connect to Supabase
- ✓ Verify `.env.local` file exists in project root
- ✓ Check API keys are correct (no extra spaces)
- ✓ Restart dev server after adding env variables
- ✓ Check Supabase project is running (green status)

**Problem**: Link expired
- ✓ Magic links expire after 1 hour
- ✓ Just request a new one - no problem!

**Problem**: Redirects not working
- ✓ Clear browser cache
- ✓ Check browser console for errors
- ✓ Verify `/profile` page exists

---

## 🎬 User Flow:

```
Landing Page → "Get Started"
    ↓
Login Page → Enter Email
    ↓
Check Email → Click Magic Link
    ↓
Profile Dashboard → "Creator Portal"
    ↓
11-Step Onboarding → Submit Project
```

---

## 📊 Monitor Users

Track your creators in Supabase:

1. **Authentication** → **Users**
   - See all registered creators
   - Their login history
   - Email verification status

2. **Table Editor** (optional)
   - Create `profiles` table for additional user data
   - Create `projects` table for submissions
   - Link to auth users via `user_id`

---

## 🚀 Next Steps:

Once working:
- ✅ Creators can login with just email
- ✅ No passwords to manage
- ✅ Secure authentication
- ✅ Ready to build more features!

Future enhancements:
- Add profile editing
- Store project submissions
- Admin dashboard for reviewing projects
- Email notifications for project status

---

## 🔐 Google OAuth Setup (Optional but Recommended)

Enable "Sign in with Google" for a seamless login experience:

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URI:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   (Replace `YOUR_SUPABASE_PROJECT_ID` with your actual project ID)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Google Provider in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Toggle **Enable Sign in with Google** to ON
5. Paste your **Client ID** and **Client Secret**
6. Save changes

### Step 3: Configure OAuth Consent Screen (if not done)

1. In Google Cloud Console → **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in required fields:
   - App name: `STAGE Creator Portal`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if in testing mode

### Step 4: Test Google Sign-In

1. Go to your login page
2. Click **Continue with Google**
3. Select your Google account
4. You'll be redirected back and logged in!

---

**That's it! Simple, secure, creator-friendly! 🎬✨**

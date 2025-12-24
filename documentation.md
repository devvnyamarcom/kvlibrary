# Project History & Changelog

# Project History & Changelog

## v1.5.0 - Supabase Integration (Backend)
**Date:** December 24, 2025
**Changes:**
- **Backend Integration:**
  - Migrated from local mock data to **Supabase** (Real Backend).
  - Connected Supabase Authentication for login management.
  - Connected Supabase Database (`postgresql`) for Asset storage (`kv_assets` table).
- **Files Modified:**
  - `App.tsx`: Replaced mock user/asset logic with `supabase-js` client listeners and data fetching.
  - `LoginView.tsx`: Integrated `supabase.auth.signInWithPassword`.
  - `ProfileView.tsx`: Implemented `supabase.auth.signOut`.
  - `InputKVView.tsx`: Updated form submission to insert data directly into the database.
- **New Files:**
  - `lib/supabaseClient.ts`: Supabase client initialization.
  - `.env.local`: Configured Supabase Project URL and Anon Keys.

## v1.4.1 - Critical Bug Fix
**Date:** December 23, 2025
**Changes:**
- **Hotfix:** Resolved blank/red screen issue caused by duplicate import statements in `AdminView.tsx`.

## v1.4.0 - User Management & Security
**Date:** December 23, 2025
**Changes:**
- **Login Security:**
  - Removed "Create Account" self-registration option from the Login View.
  - Access is now restricted to existing credentials only.
- **Admin Features:**
  - Implemented client-side User Management in Admin View.
  - Admins can now **Add** and **Delete** users (simulated state).
  - Search functionality and UI layout improved for user list.

## v1.3.0 - Dashboard Logic Update (Current)
**Date:** December 23, 2025
**Changes:**
- **Dynamic Dashboard Banner:**
  - The "Hero" banner on the Dashboard now automatically displays the most recently added asset (the first item in the asset list).
  - Previously, this was hardcoded to "Ramadan 2024 Assets".
  - Now shows: Asset Name, Upload Date, and generated description based on metadata.
  - Background image updates to show the asset's thumbnail.

## v1.2.0 - UI Branding & Customization
**Date:** December 23, 2025
**Changes:**
- **Login View Updates:**
  - Updated Title to "KV LIBRARY" (Uppercase).
  - Added subtitle "by Marcomm Area 3".
  - Updated Footer text to "© 2026 Telkomsel Marketing Communications Area 3 Jawa Bali".
  - Adjusted input field placeholders.

## v1.1.0 - Local Initialization & Setup
**Date:** December 23, 2025
**Changes:**
- **Environment Setup:**
  - Configured project for local execution.
  - Installed NPM dependencies.
  - Resolved PowerShell execution policy restrictions during installation.
- **Verification:**
  - Validated application startup on `http://localhost:3000`.
  - Confirmed Login Flow (Admin/Guest) and Navigation.

## v1.0.0 - Initial Release (AI Studio Export)
**Date:** Initial Creation
**Features:**
- **Core Views:**
  - Login Page (with mock authentication).
  - Dashboard (Overview with stats).
  - Input KV Form.
  - Asset Details View.
- **Mock Data:**
  - Set up `constants.ts` with mock Users and Assets to simulate a working environment without a real backend.

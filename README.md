# RePrime Group - Investor Portal

A professional login portal for investors that gates access to your deals dashboard using Netlify Identity for secure authentication.

---

## 🚀 DEPLOYMENT GUIDE (Step-by-Step)

### Step 1: Create a GitHub Account (if you don't have one)
1. Go to [github.com](https://github.com)
2. Click "Sign up" and create a free account

### Step 2: Upload This Project to GitHub
1. Log into GitHub
2. Click the **+** icon in the top right → **New repository**
3. Name it: `reprime-investor-portal`
4. Keep it **Private** (important for security)
5. Click **Create repository**
6. On the next page, click **"uploading an existing file"**
7. Drag and drop ALL files from this folder
8. Click **Commit changes**

### Step 3: Create a Netlify Account
1. Go to [netlify.com](https://www.netlify.com)
2. Click **Sign up** → **Sign up with GitHub**
3. Authorize Netlify to access your GitHub

### Step 4: Deploy Your Site
1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub**
3. Find and select your `reprime-investor-portal` repository
4. Netlify will auto-detect settings. Just click **Deploy site**
5. Wait 1-2 minutes for deployment to complete

### Step 5: Enable Netlify Identity (User Management)
1. In your Netlify site dashboard, go to **Site configuration** (left sidebar)
2. Click **Identity** in the left menu
3. Click **Enable Identity**
4. Under **Registration preferences**, select **"Invite only"** (so only people YOU invite can sign up)
5. Click **Save**

### Step 6: Invite Your First Investor
1. Still in Identity settings, click the **Identity** tab at the top
2. Click **Invite users**
3. Enter the investor's email address
4. Click **Send**
5. They'll receive an email to set up their password

### Step 7: Configure Your Dashboard URL
1. In your GitHub repository, open `src/App.jsx`
2. Find this line near the top:
   ```javascript
   const DASHBOARD_URL = 'https://your-deals-dashboard.com'
   ```
3. Replace with your actual dashboard URL
4. Commit the change
5. Netlify will automatically redeploy

### Step 8: Get a Custom Domain (Optional)
1. In Netlify, go to **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `investors.reprimegroup.com`)
4. Follow the DNS configuration instructions

---

## 📋 MANAGING INVESTORS

### To Add a New Investor:
1. Go to Netlify → Your site → **Identity** tab
2. Click **Invite users**
3. Enter their email
4. They'll receive a welcome email with login instructions

### To Remove an Investor:
1. Go to Identity tab
2. Find the user
3. Click on their email
4. Click **Delete user**

### To Reset Someone's Password:
1. Users can click "Forgot Password" on the login page
2. Or you can delete and re-invite them

---

## 🎨 CUSTOMIZATION

### Change the Logo/Branding
Edit `src/components/LoginPage.jsx`:
- Change `RePrime` text to your company name
- Modify the logo bars or replace with an image
- Update colors in `src/index.css`

### Change Colors
In `src/index.css`, look for these values:
- `#b8a369` - Gold/tan accent color
- `#1a2332` - Dark navy blue
- `#fdfcfa` - Light cream background

### Change the Background Image
In `src/components/LoginPage.jsx`, find the image URL and replace it:
```javascript
src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab..."
```

---

## 🔒 SECURITY NOTES

- **Invite Only**: Only people you explicitly invite can create accounts
- **No Password Storage**: Netlify handles all password security
- **HTTPS**: Automatically enabled on all Netlify sites
- **Keep GitHub repo Private**: Prevents others from seeing your configuration

---

## 📁 FILE STRUCTURE

```
reprime-investor-portal/
├── index.html              # Main HTML file
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies
├── vite.config.js          # Build configuration
├── README.md               # This file
└── src/
    ├── main.jsx            # App entry point
    ├── App.jsx             # Main component (SET YOUR DASHBOARD URL HERE)
    ├── index.css           # All styles
    └── components/
        ├── LoginPage.jsx   # Login screen
        └── Dashboard.jsx   # Post-login redirect screen
```

---

## ❓ TROUBLESHOOTING

**"Site not loading"**
- Wait 2-3 minutes after deployment
- Check Netlify deploy logs for errors

**"Identity not working"**
- Make sure you enabled Identity in Site configuration
- Check that you're on the correct site URL

**"Users not receiving invite emails"**
- Check spam folders
- Verify email addresses are correct

**"Changes not showing"**
- Netlify auto-deploys from GitHub
- Check the Deploys tab for status
- Try clearing browser cache

---

## 🆘 NEED HELP?

- Netlify Docs: https://docs.netlify.com
- Netlify Identity Docs: https://docs.netlify.com/security/secure-access-to-sites/identity/
- Netlify Support: https://www.netlify.com/support/

---

Built with ❤️ for RePrime Group

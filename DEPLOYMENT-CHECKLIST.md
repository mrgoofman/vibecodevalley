# Vibecode Valley - Deployment Checklist

Follow these steps to deploy your landing page to Cloudflare Pages.

## ✅ Pre-Deployment Checklist

- [x] Hugo site built successfully locally
- [x] All content and styling completed
- [x] Email form JavaScript working
- [x] Database schema created

## 📋 Deployment Steps

### Step 1: Push to GitHub (5 minutes)

```bash
# Initialize git (if starting fresh)
git init
git add .
git commit -m "Initial commit: Vibecode Valley landing page"

# Create a new repository on GitHub
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/vibecodevalley-landing.git
git branch -M main
git push -u origin main
```

**✓ Checkpoint:** Your code is now on GitHub

---

### Step 2: Create Cloudflare D1 Database (5 minutes)

```bash
# Install Wrangler CLI (if needed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create the database
wrangler d1 create vibecode-emails
```

**Important:** Copy the database ID from the output! You'll need it.

```bash
# Initialize the database with the schema
wrangler d1 execute vibecode-emails --file=./schema.sql

# Verify it worked
wrangler d1 execute vibecode-emails --command="SELECT * FROM emails"
```

**✓ Checkpoint:** Database created and schema loaded

---

### Step 3: Deploy to Cloudflare Pages (10 minutes)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages** → **Create application** → **Pages**
3. Click **Connect to Git**
4. Select your GitHub repository: `vibecodevalley-landing`
5. Configure build settings:
   ```
   Build command: hugo --minify
   Build output directory: public
   Root directory: /
   ```
6. Click **Save and Deploy**
7. Wait for the initial build (2-3 minutes)

**✓ Checkpoint:** Site is deployed (but forms won't work yet)

---

### Step 4: Connect D1 Database to Pages (3 minutes)

1. In your Pages project, go to **Settings** → **Functions**
2. Scroll to **D1 database bindings**
3. Click **Add binding**
   - Variable name: `DB`
   - D1 database: Select `vibecode-emails`
4. Click **Save**
5. Go to **Deployments** and click **Retry deployment** (top right)

**✓ Checkpoint:** Forms now work and save to database!

---

### Step 5: Configure Custom Domain (2 minutes)

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `vibecodevalley.com`
4. Cloudflare will automatically configure DNS
5. Wait 1-2 minutes for SSL certificate

**✓ Checkpoint:** Site live at vibecodevalley.com with HTTPS!

---

## 🎉 You're Live!

Your landing page is now deployed at: **https://vibecodevalley.com**

## 🔍 Testing Checklist

- [ ] Visit the site and check all sections load
- [ ] Submit test email in hero form
- [ ] Submit test email in footer form
- [ ] Check database: `wrangler d1 execute vibecode-emails --command="SELECT * FROM emails"`
- [ ] Test on mobile device
- [ ] Share with a friend to test

## 📊 View Your Subscribers

At any time, you can view your email list:

```bash
# View all subscribers
wrangler d1 execute vibecode-emails --command="SELECT email, source, created_at FROM emails ORDER BY created_at DESC"

# Count total subscribers
wrangler d1 execute vibecode-emails --command="SELECT COUNT(*) as total FROM emails"

# Export to JSON
wrangler d1 execute vibecode-emails --command="SELECT * FROM emails ORDER BY created_at DESC" --json > subscribers.json
```

## 🚀 Making Updates

After making changes to your code:

```bash
git add .
git commit -m "Update: description of changes"
git push
```

Cloudflare Pages will automatically detect the push and redeploy (takes 2-3 minutes).

## 🆘 Troubleshooting

### Forms not working?
- Check D1 binding is configured correctly
- Redeploy after adding the binding
- Check browser console for errors

### Database not saving emails?
- Verify schema was applied: `wrangler d1 execute vibecode-emails --command="PRAGMA table_info(emails)"`
- Check function logs in Cloudflare dashboard

### Site not updating?
- Clear your browser cache
- Check deployment status in Cloudflare dashboard
- Verify changes were pushed to GitHub

## 📧 Next Steps

- [ ] Set up email automation (SendGrid, Mailgun, etc.)
- [ ] Add analytics (Cloudflare Analytics, Plausible, etc.)
- [ ] Create email welcome sequence
- [ ] Build the actual course!

---

Made with love, curiosity, and Claude Code 💫

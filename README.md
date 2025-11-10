# Vibecode Valley Landing Page

A Hugo-based landing page for the Vibecode Valley online course, deployed on Cloudflare Pages with D1 database integration for email waitlist collection.

## Tech Stack

- **Hugo** - Static site generator
- **Cloudflare Pages** - Hosting and deployment
- **Cloudflare D1** - SQLite database for email storage
- **Cloudflare Pages Functions** - Serverless API endpoints

## Project Structure

```
vibecodevalleycom/
├── themes/vibecode/          # Custom Hugo theme
│   ├── layouts/
│   │   └── index.html        # Main landing page template
│   └── static/
│       ├── css/style.css     # Styles (dark mode + neon aesthetic)
│       └── js/main.js        # Form handling JavaScript
├── functions/
│   └── api/
│       └── subscribe.js      # Email subscription API endpoint
├── schema.sql                # D1 database schema
├── hugo.toml                 # Hugo configuration
└── README.md                 # This file
```

## Local Development

### Prerequisites

- Hugo Extended (v0.120.0 or later)
- Node.js (optional, for Cloudflare Workers local dev)

### Running Locally

1. Start the Hugo development server:
```bash
hugo server -D
```

2. Open your browser to `http://localhost:1313`

The site will automatically reload when you make changes.

## Deployment to Cloudflare Pages

### Step 1: Create a GitHub Repository

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Vibecode Valley landing page"
```

2. Create a new repository on GitHub (e.g., `vibecodevalley-landing`)

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/vibecodevalley-landing.git
git branch -M main
git push -u origin main
```

### Step 2: Setup Cloudflare D1 Database

1. Install Wrangler CLI (if not already installed):
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Create a D1 database:
```bash
wrangler d1 create vibecode-emails
```

4. Note the database ID from the output (you'll need this later)

5. Initialize the database with the schema:
```bash
wrangler d1 execute vibecode-emails --file=./schema.sql
```

### Step 3: Deploy to Cloudflare Pages

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure the build settings:
   - **Build command:** `hugo --minify`
   - **Build output directory:** `public`
   - **Root directory:** `/`
5. Click **Save and Deploy**

### Step 4: Configure D1 Database Binding

1. In your Cloudflare Pages project, go to **Settings** → **Functions**
2. Under **D1 database bindings**, add a new binding:
   - **Variable name:** `DB`
   - **D1 database:** Select `vibecode-emails` (the database you created)
3. Save the binding
4. Redeploy your site for the changes to take effect

### Step 5: Connect Custom Domain

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter `vibecodevalley.com`
4. Cloudflare will automatically configure DNS if the domain is in your account

## Environment Variables

The email subscription API endpoint uses the following Cloudflare binding:
- `DB` - D1 database binding (configured in Cloudflare Pages dashboard)

## Database Schema

The D1 database contains one table:

```sql
emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,  -- 'hero' or 'footer'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT
)
```

## Managing Email Subscribers

To view your email subscribers:

```bash
wrangler d1 execute vibecode-emails --command="SELECT * FROM emails ORDER BY created_at DESC"
```

To export to CSV:

```bash
wrangler d1 execute vibecode-emails --command="SELECT email, source, created_at FROM emails ORDER BY created_at DESC" --json > subscribers.json
```

## API Endpoints

### POST /api/subscribe

Handles email waitlist subscriptions.

**Request:**
```
POST /api/subscribe
Content-Type: multipart/form-data

email=user@example.com&source=hero
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Thanks for joining! Check your email for your free guide."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "This email is already on the waitlist!"
}
```

## Design Notes

- **Color Palette:** Deep indigo background with neon blue, purple, and mint accents
- **Typography:** Inter font family
- **Style:** Futuristic minimalism meets digital zen
- **Responsive:** Fully responsive design for mobile, tablet, and desktop

## Future Enhancements

- [ ] Add email delivery integration (SendGrid, Mailgun, etc.)
- [ ] Implement Google Analytics or Plausible Analytics
- [ ] Add OpenGraph and Twitter Card meta tags
- [ ] Create an admin dashboard to view subscribers
- [ ] Add email verification/double opt-in
- [ ] Add A/B testing for conversion optimization

## Support

For issues or questions, contact Moritz Lumetsberger.

---

Made with love, curiosity, and Claude Code 💫

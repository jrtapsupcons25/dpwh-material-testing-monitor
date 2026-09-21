# 🚀 Deployment Guide - DPWH Material Testing System

Complete guide to deploy the Admin Panel on different platforms.

---

## 📋 Table of Contents

- [Pre-Deployment Checklist](#-pre-deployment-checklist)
- [Vercel (Recommended)](#-vercel-recommended)
- [Netlify](#-netlify)
- [AWS](#-aws)
- [DigitalOcean](#-digitalocean)
- [Custom Server](#-custom-server)
- [Post-Deployment](#-post-deployment)
- [Monitoring](#-monitoring)
- [Troubleshooting](#-troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm test` - All tests pass
- [ ] Run `npm run build` - No build errors
- [ ] No console.log statements in production code
- [ ] No sensitive data in component code
- [ ] Code follows style guidelines

### Security
- [ ] Admin password changed from default
- [ ] Environment variables configured
- [ ] HTTPS enabled (all platforms do this)
- [ ] Row Level Security reviewed (Supabase)
- [ ] API keys are NOT in component

### Documentation
- [ ] README.md updated
- [ ] Deployment URL documented
- [ ] Admin credentials stored securely
- [ ] Team trained on system
- [ ] Backup procedures in place

### Database
- [ ] All tables created
- [ ] Initial data loaded
- [ ] Backups configured
- [ ] Connection tested

### Performance
- [ ] Build size checked
- [ ] No unused dependencies
- [ ] Images optimized
- [ ] Code splitting configured

---

## 🎯 Vercel (Recommended)

**Best for:** Most users, easiest setup, best integration with React apps

### Step 1: Connect GitHub

```bash
# Ensure code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up"
3. Choose "GitHub"
4. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Select your `dpwh-material-testing` repository
3. Click "Import"

### Step 4: Configure Project

**Project Settings:**
```
Framework: Create React App (auto-detected)
Root Directory: ./ (default)
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### Step 5: Environment Variables

Click "Environment Variables" and add:

```
REACT_APP_SUPABASE_URL = https://akcbgvpdbxepgoklpuia.supabase.co
REACT_APP_SUPABASE_KEY = your-anon-key
```

### Step 6: Deploy

Click "Deploy" button and wait 1-2 minutes.

**Your live URL:**
```
https://dpwh-material-testing.vercel.app
```

### Step 7: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain: `admin.dpwh-ilocos.ph`
3. Update DNS records (Vercel shows instructions)
4. Wait for SSL certificate (5-10 minutes)

### Automatic Redeploys

Every time you push to GitHub:
```bash
git push origin main
```

Vercel automatically rebuilds and deploys your site!

---

## 🌐 Netlify

**Best for:** Static site hosting, good CMS integration

### Step 1: Connect GitHub

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select GitHub
4. Authorize Netlify

### Step 2: Configure Build

Select your repository and configure:

```
Build command:    npm run build
Publish directory: build
```

### Step 3: Environment Variables

In Netlify dashboard:
1. Go to Settings → Build & Deploy → Environment
2. Add variables:
   ```
   REACT_APP_SUPABASE_URL = ...
   REACT_APP_SUPABASE_KEY = ...
   ```

### Step 4: Deploy

Click "Deploy site" and wait 2-3 minutes.

**Your site URL:**
```
https://dpwh-material-testing.netlify.app
```

### Custom Domain

1. Go to Settings → Domain management
2. Add your domain
3. Update DNS records
4. SSL certificate auto-provisioned

---

## ☁️ AWS (Advanced)

**Best for:** High traffic, AWS ecosystem integration

### Using AWS Amplify (Easiest)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure AWS credentials
amplify configure

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Using AWS S3 + CloudFront

1. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://dpwh-material-testing
   ```

2. **Build locally:**
   ```bash
   npm run build
   ```

3. **Upload to S3:**
   ```bash
   aws s3 sync build/ s3://dpwh-material-testing --delete
   ```

4. **Create CloudFront distribution:**
   - AWS Console → CloudFront
   - Create distribution
   - Point to S3 bucket

### Using AWS EC2 (Full Control)

1. Launch Ubuntu EC2 instance
2. Install Node.js and npm
3. Clone repository
4. Run build and production server
5. Configure Nginx reverse proxy

---

## 💧 DigitalOcean (Affordable)

**Best for:** Budget-friendly, good performance

### Using DigitalOcean App Platform

1. **Connect GitHub:**
   - Create DigitalOcean account
   - Link GitHub account

2. **Create App:**
   - Click "Create" → "App"
   - Select your repository
   - Choose Branch: `main`

3. **Configure:**
   ```
   Source Type:  GitHub
   Build Command: npm run build
   Output Dir:   build
   Run Command:  npm start
   ```

4. **Deploy:**
   - Add environment variables
   - Click "Deploy"
   - Wait 3-5 minutes

### Using DigitalOcean Droplet

```bash
# 1. SSH into droplet
ssh root@your-droplet-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
git clone https://github.com/YOUR-USERNAME/dpwh-material-testing.git
cd dpwh-material-testing

# 4. Install & build
npm install
npm run build

# 5. Install PM2
npm install -g pm2

# 6. Start app
pm2 start "npm start" --name "dpwh-admin"
pm2 startup
pm2 save

# 7. Install Nginx
sudo apt-get install -y nginx

# 8. Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx configuration:
```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx
```

---

## 🖥️ Custom Server

**Best for:** Full control, specific requirements

### Prerequisites
- Linux server (Ubuntu 20.04+)
- Node.js 18+
- Nginx or Apache
- SSH access
- Domain name
- SSL certificate (Let's Encrypt - free)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs npm

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt-get install -y git

# Install Nginx
sudo apt-get install -y nginx

# Install Certbot (SSL)
sudo apt-get install -y certbot python3-certbot-nginx
```

### Step 2: Deploy Application

```bash
# Create app directory
sudo mkdir -p /var/www/dpwh-admin
cd /var/www/dpwh-admin

# Clone repository
sudo git clone https://github.com/YOUR-USERNAME/dpwh-material-testing.git .

# Install dependencies
npm install

# Build
npm run build

# Create .env file
sudo nano .env.production
# Add your environment variables

# Start with PM2
pm2 start "npm start" --name "dpwh-admin"
pm2 startup
pm2 save
```

### Step 3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/admin.dpwh.com
```

```nginx
server {
    listen 80;
    server_name admin.dpwh.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/admin.dpwh.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL Certificate

```bash
# Install Let's Encrypt certificate
sudo certbot --nginx -d admin.dpwh.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 5: Auto-Updates

Create update script:
```bash
sudo nano /usr/local/bin/update-dpwh-admin.sh
```

```bash
#!/bin/bash
cd /var/www/dpwh-admin
git pull origin main
npm install
npm run build
pm2 restart dpwh-admin
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/update-dpwh-admin.sh
```

Add to crontab for daily updates:
```bash
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/update-dpwh-admin.sh
```

---

## 📋 Post-Deployment

### Verify Deployment

1. **Access the site:**
   - Open deployment URL in browser
   - Test login with admin credentials
   - Test creating user/project

2. **Check functionality:**
   - Dashboard loads
   - Data displays correctly
   - Forms submit successfully
   - Supabase connection working

3. **Performance check:**
   - Page loads in <2 seconds
   - No console errors (F12)
   - Responsive on mobile (test on phone)

### Setup Notifications

1. **Slack integration (optional):**
   - Add deployment webhook
   - Get notified on failed deployments

2. **Email alerts:**
   - Set up error notifications
   - Configure uptime monitoring

### Document Deployment

Create deployment record:
```markdown
# Deployment Record

**Date:** September 21, 2026
**Platform:** Vercel
**URL:** https://dpwh-material-testing.vercel.app
**Admin User:** admin
**Database:** Supabase (Singapore)
**Deployed By:** [Your Name]

## Configuration
- Node: 18.x
- React: 18.2.0
- Supabase JS SDK: 2.38.0

## Environment Variables
- REACT_APP_SUPABASE_URL: [Configured]
- REACT_APP_SUPABASE_KEY: [Configured]

## Backup Location
- Git: https://github.com/YOUR-USERNAME/dpwh-material-testing
- Database: Supabase automated backups enabled
```

---

## 📊 Monitoring

### Vercel Dashboard
- Real-time deployment status
- Function execution logs
- Performance analytics
- Error tracking

### Supabase Monitoring
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Monitor:
   - Database queries
   - API usage
   - Error logs
   - Real-time events

### Application Health

Add monitoring script:
```javascript
// Monitor API health
setInterval(async () => {
  const response = await fetch('/api/health', {
    method: 'GET'
  });
  
  if (!response.ok) {
    console.error('Health check failed');
    // Send alert
  }
}, 60000); // Every minute
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://www.pingdom.com) - Paid
- [Datadog](https://www.datadoghq.com) - Enterprise

---

## 🆘 Troubleshooting

### Deployment Fails

**Build error:**
```bash
# Check build locally
npm run build

# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Missing dependencies:**
```bash
# Install missing packages
npm install package-name

# Update package.json
git add package.json
git commit -m "Add missing dependency"
git push
```

### Site Not Loading

1. Check deployment URL
2. Clear browser cache (Ctrl+Shift+Del)
3. Check DNS records (for custom domain)
4. Verify SSL certificate

### Data Not Displaying

1. Check Supabase connection
2. Verify database has data
3. Check API credentials
4. Check browser console for errors

### Performance Issues

1. Check build size: `npm run build`
2. Analyze bundle: `npm run build -- --analyze`
3. Optimize images
4. Check database queries

---

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

Repository secrets needed:
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

Automatic workflow on push to main branch.

---

## 📞 Support

**Deployment Issues?**
1. Check this guide
2. Review platform-specific docs
3. Check error logs
4. Contact platform support

---

**Ready to Deploy!** 🚀

Choose your platform and follow the steps above.

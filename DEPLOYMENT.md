# STG Wiki Deployment Guide

This guide provides instructions for deploying the STG Wiki application on a server with Nginx as a reverse proxy and SSL certificates from Let's Encrypt.

## Prerequisites

- A server running Ubuntu/Debian or similar Linux distribution
- Node.js 18+ and npm installed
- Git installed
- Domain name pointing to your server (in this case, hfwstgmizoram.in)

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url> /var/www/stg-wiki
cd /var/www/stg-wiki
```

## Step 2: Install Dependencies

```bash
# Install dependencies
npm install
```

## Step 3: Build the Application

```bash
# Build the Next.js application
npm run build
```

## Step 4: Set Up Environment Variables

Create a `.env` file in the root directory with the necessary environment variables:

```bash
# Create .env file
cp .env.example .env
nano .env
```

Make sure to configure:
- Database connection string
- NextAuth secret
- Any other required environment variables

## Step 5: Install and Configure PM2

PM2 is a process manager for Node.js applications that helps keep your application running.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "stg-wiki" -- start

# Set PM2 to start on system boot
pm2 startup
pm2 save
```

## Step 6: Install and Configure Nginx

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/stg-wiki
```

Copy the contents from the `nginx-config.conf` file in this repository into the Nginx configuration file.

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/stg-wiki /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If the test is successful, restart Nginx
sudo systemctl restart nginx
```

## Step 7: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d hfwstgmizoram.in -d www.hfwstgmizoram.in

# Verify auto-renewal is set up
sudo systemctl status certbot.timer
```

## Step 8: Verify Deployment

Visit your domain (https://hfwstgmizoram.in) to verify that the application is running correctly.

## Maintenance

### Updating the Application

```bash
# Pull the latest changes
cd /var/www/stg-wiki
git pull

# Install dependencies if needed
npm install

# Rebuild the application
npm run build

# Restart the application
pm2 restart stg-wiki
```

### Monitoring

```bash
# View application logs
pm2 logs stg-wiki

# Monitor application status
pm2 monit
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/hfwstgmizoram.in_access.log

# Error logs
sudo tail -f /var/log/nginx/hfwstgmizoram.in_error.log
```

## Troubleshooting

### If the application is not accessible

1. Check if the Next.js application is running:
   ```bash
   pm2 status
   ```

2. Check Nginx status:
   ```bash
   sudo systemctl status nginx
   ```

3. Check firewall settings:
   ```bash
   sudo ufw status
   ```

4. Ensure ports 80 and 443 are open:
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   ```

### SSL Certificate Issues

If you encounter SSL certificate issues, you can manually renew the certificate:

```bash
sudo certbot renew
```

For more detailed troubleshooting, check the Certbot logs:

```bash
sudo journalctl -xeu certbot.service
```

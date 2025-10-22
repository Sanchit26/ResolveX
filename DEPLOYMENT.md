# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Connect your repository to Vercel
3. **MongoDB Atlas**: Set up a cloud MongoDB database
4. **OpenAI API Key**: Get from [platform.openai.com](https://platform.openai.com)
5. **Cloudinary Account**: Set up for image uploads
6. **Email Service**: Configure SMTP for notifications

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Ensure all dependencies are in package.json** (already done)

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password
5. Add your IP to the whitelist (or use 0.0.0.0/0 for all IPs)

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cpgrams
   JWT_SECRET=your-super-secret-jwt-key-change-this
   OPENAI_API_KEY=sk-your-openai-api-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=Grievance Portal <noreply@grievance-portal.com>
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add OPENAI_API_KEY
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   vercel env add SMTP_HOST
   vercel env add SMTP_PORT
   vercel env add SMTP_USER
   vercel env add SMTP_PASS
   vercel env add SMTP_FROM
   ```

## Step 4: Post-Deployment Setup

1. **Create Admin User**:
   - Access your deployed site
   - Go to `/admin`
   - Use default credentials: `admin` / `admin123`
   - Or create a new admin user via MongoDB

2. **Test Features**:
   - Test complaint filing
   - Test voice recording (if API keys are set)
   - Test image upload (if Cloudinary is configured)
   - Test chatbot (if OpenAI API key is set)

## Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret for JWT tokens | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | ❌ No (fallback available) |
| `CLOUDINARY_*` | Cloudinary credentials for file uploads | ❌ No (fallback available) |
| `SMTP_*` | Email server credentials | ❌ No (fallback available) |

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure TypeScript compilation passes locally
- Check for any import errors

### Runtime Errors
- Verify environment variables are set correctly
- Check MongoDB connection string
- Ensure API keys are valid

### Feature Not Working
- **Voice/Image features**: Check OpenAI API key
- **File uploads**: Check Cloudinary credentials
- **Email notifications**: Check SMTP settings

## Security Notes

1. **Change default admin password** after first login
2. **Use strong JWT_SECRET** in production
3. **Restrict MongoDB access** to Vercel IPs
4. **Use environment variables** for all secrets
5. **Enable HTTPS** (automatic with Vercel)

## Performance Optimization

1. **Enable caching** for static assets
2. **Use CDN** for images (Cloudinary)
3. **Optimize images** before upload
4. **Monitor API usage** for OpenAI/Cloudinary

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors

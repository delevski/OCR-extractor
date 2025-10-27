# Deployment Guide

## Deploying to Vercel

The OCR Extractor web app is configured to deploy on Vercel (recommended) or other platforms.

### Option 1: Deploy to Vercel (Recommended)

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Import Project"
   - Select the `OCR-extractor` repository
   - Choose the `ocr-webapp` directory as the root directory

2. **Configure the project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `ocr-webapp`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`

3. **Set Environment Variables** (if needed):
   - None required for the frontend (backend runs separately)

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Option 2: Deploy Backend Separately

The backend (`server.py`) needs to run separately. Options:

#### Option 2A: Same server as frontend (if using same Vercel project)
- Not recommended for production due to Python dependency

#### Option 2B: Deploy backend separately on Railway/Render/Fly.io
1. **Railway**:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Initialize and deploy
   cd ocr-webapp
   railway init
   railway up
   ```

2. **Render**:
   - Create a new Web Service on [render.com](https://render.com)
   - Connect your GitHub repo
   - Set:
     - **Build Command**: `pip install -r ../DeepSeek-OCR/requirements.txt`
     - **Start Command**: `cd ocr-webapp && python server.py`
     - **Environment**: Python 3.9+

3. **Fly.io**:
   ```bash
   # Install Fly CLI
   curl -L https://fly.io/install.sh | sh
   
   # Login
   fly auth login
   
   # Deploy
   cd ocr-webapp
   fly deploy
   ```

### Option 3: Deploy Both on the Same Server

If you have a VPS or dedicated server:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/delevski/OCR-extractor.git
   cd OCR-extractor
   ```

2. **Set up the backend:**
   ```bash
   cd DeepSeek-OCR
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend:**
   ```bash
   cd ../ocr-webapp
   npm install
   npm run build
   ```

4. **Configure PM2 (for process management):**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start backend
   cd ../ocr-webapp
   pm2 start server.py --name ocr-backend --interpreter python3
   
   # Start frontend
   pm2 start npm --name ocr-frontend -- start
   ```

5. **Set up Nginx (for reverse proxy):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Backend
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Troubleshooting Deployment

### Issue: 404 NOT_FOUND error on Vercel

**Solution:** Make sure you've set the correct root directory:
- Root Directory: `ocr-webapp`
- Not the repository root

### Issue: Build fails on Vercel

**Possible causes:**
1. Node.js version mismatch - Vercel should auto-detect, but you can specify in `package.json`:
   ```json
   {
     "engines": {
       "node": ">=20.9.0"
     }
   }
   ```

2. Missing dependencies - Ensure all dependencies are in `package.json`

### Issue: Backend connection refused

The frontend tries to connect to `http://localhost:5000`. If the backend is hosted separately:

1. Update the backend URL in `app/page.tsx`:
   ```typescript
   const response = await fetch('https://your-backend-url.com/infer', {
     method: 'POST',
     body: formData,
   });
   ```

2. Update CORS settings in `server.py`:
   ```python
   from flask_cors import CORS
   CORS(app, origins=["https://your-frontend-url.vercel.app"])
   ```

## Environment Variables

Create a `.env.local` file in the `ocr-webapp` directory for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then update `app/page.tsx` to use it:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

## Production Checklist

- [ ] Backend is running and accessible
- [ ] Frontend build completes successfully
- [ ] CORS is properly configured on the backend
- [ ] API URLs are updated for production
- [ ] Environment variables are set
- [ ] SSL certificate is configured (HTTPS)
- [ ] Error monitoring is set up (optional)

## Need Help?

If you encounter issues:
1. Check the deployment logs on your platform
2. Verify all environment variables are set
3. Ensure the backend is running and accessible
4. Check CORS settings
5. Open an issue on [GitHub](https://github.com/delevski/OCR-extractor/issues)

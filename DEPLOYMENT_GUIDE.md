# Netra Sarthi — Production Deployment & Domain Routing Guide

Comprehensive guide for deploying Netra Sarthi with **Cloudflare Pages** (Frontend) and **Vercel / Container** (Backend) using a single **`.com`** custom domain.

---

## 1. Recommended Architecture: Subdomain Routing

```
                              [ DNS: Cloudflare ]
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
    yourdomain.com (Apex & www)                            api.yourdomain.com
            │                                                     │
            ▼                                                     ▼
   [ Cloudflare Pages ]                                   [ Vercel / Render Backend ]
    (Vite React SPA)                                       (Node Express REST API)
            │                                                     │
            ▼                                                     ▼
     Browser Client                                       Firebase RTDB + Cloudinary
                                                          Hardware Helmet Telemetry
```

### Why This Architecture is Best for Netra Sarthi

| Feature | Subdomain Routing (`api.yourdomain.com`) | Single-Domain Proxy (`yourdomain.com/api/*`) |
| :--- | :--- | :--- |
| **IoT Hardware Ingestion** | **Flawless**: Microcontrollers (ESP32/cellular) send telemetry directly to `api.yourdomain.com/api/devices/telemetry`. | Complex: Requires routing hardware traffic through the frontend reverse proxy. |
| **DNS Configuration** | **Simple**: Just 2 standard `CNAME` records in Cloudflare DNS. | Complex: Requires Cloudflare Workers or Origin Rules to rewrite URL paths. |
| **Edge Caching Safety** | **Isolated**: Cloudflare aggressively caches static frontend assets (JS/CSS/images) without risking caching dynamic GPS coordinates. | High Risk: Can inadvertently cache dynamic telemetry and alerts if cache rules misconfigured. |
| **Backend Portability** | **High**: Can switch backend hosting (Vercel $\rightarrow$ Render $\rightarrow$ AWS) simply by changing 1 DNS record without modifying frontend routes. | Low: Tied to Cloudflare proxy path routing rules. |

---

## 2. Cloudflare DNS Configuration

Assuming your registered domain is `yourdomain.com` managed on Cloudflare DNS:

| Type | Name | Content / Target | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` (apex) | `<your-project>.pages.dev` | **Proxied (Orange Cloud)** | Frontend Root (`https://yourdomain.com`) |
| **CNAME** | `www` | `<your-project>.pages.dev` | **Proxied (Orange Cloud)** | Frontend Alias (`https://www.yourdomain.com`) |
| **CNAME** | `api` | `cname.vercel-dns.com` | **DNS Only (Grey Cloud)** or Proxied | Backend API (`https://api.yourdomain.com`) |

> [!WARNING]
> Per the DNS spec, a **CNAME is not technically valid at the apex/root (`@`)** because the apex must also hold mandatory records (SOA, NS). Cloudflare works around this with **CNAME flattening**, which is why the `@` row above works when Cloudflare is your DNS provider. If you ever move DNS off Cloudflare (e.g. to Route 53 or the registrar's default DNS) without flattening support, the apex record must instead be an `A`/`ALIAS` record pointing at Cloudflare Pages' IPs, or you'll need to redirect `yourdomain.com` → `www.yourdomain.com` instead.

> [!TIP]
> If using **Vercel** for the backend, keep the `api` CNAME **DNS Only (Grey Cloud)** during initial domain verification on Vercel so Vercel can automatically issue the SSL certificate. Once verified, you can toggle it to Proxied for Cloudflare DDoS protection.
> If using **Render**, point `api` to `<service-name>.onrender.com`.

---

## 3. Frontend Deployment (Cloudflare Pages)

### 3.1 Setup Steps
1. Navigate to **Cloudflare Dashboard** $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
2. Select repository: `Anonymyrp/netrasarthiv1`.
3. Configure Build Settings:
   - **Framework preset**: `Vite`
   - **Root directory**: `netrasarthiv1`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Add Environment Variables in Cloudflare Pages:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   VITE_FIREBASE_API_KEY=your_firebase_web_api_key
   VITE_FIREBASE_AUTH_DOMAIN=netra-sarthi-46868.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://netra-sarthi-46868-default-rtdb.firebaseio.com/
   VITE_FIREBASE_PROJECT_ID=netra-sarthi-46868
   VITE_FIREBASE_STORAGE_BUCKET=netra-sarthi-46868.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   > **Note:** Firebase projects created **after October 2024** default to the `.firebasestorage.app` bucket domain shown above. If this project's bucket predates that change, check the Firebase Console → Storage for the exact bucket name — it may still be `netra-sarthi-46868.appspot.com`. Using the wrong suffix will break Cloudinary/Firebase upload URLs.

5. Connect Custom Domain:
   - Go to your Pages project $\rightarrow$ **Custom domains** $\rightarrow$ Click **Set up a custom domain**.
   - Enter `yourdomain.com` and `www.yourdomain.com`.

---

## 4. Backend Deployment (Vercel vs Render)

### 4.1 Important Note on Live GPS Streaming (SSE)
- **Vercel Serverless**: Functions auto-terminate after **10–60 seconds** on free/hobby plans. This causes long-lived SSE connections (`/api/locations/live/stream`) to close and reconnect periodically.
- **Render / Railway / VPS**: Runs a 24/7 continuous Node.js container process. SSE streams remain open indefinitely with zero reconnections.

### 4.2 Deploying on Vercel

1. Create a `vercel.json` in the `server/` directory. **Avoid the legacy `builds`/`routes` schema** — it's deprecated, unmaintained, and can interfere with streaming responses (needed for the SSE endpoint in 4.1). Use the modern `rewrites` schema instead:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.js"
       }
     ]
   }
   ```
   Vercel will auto-detect `index.js` as a Node serverless function; no `builds` block is needed.
2. In Vercel Project Settings $\rightarrow$ **Root Directory**, set to `netrasarthiv1/server`.
3. Add Environment Variables in Vercel:
   ```env
   NODE_ENV=production
   CLIENT_URL=https://yourdomain.com
   JWT_SECRET=your_32_char_cryptographic_secret
   JWT_REFRESH_SECRET=your_32_char_refresh_secret
   DEVICE_API_KEY=your_secure_helmet_device_key
   FIREBASE_PROJECT_ID=netra-sarthi-46868
   FIREBASE_DATABASE_URL=https://netra-sarthi-46868-default-rtdb.firebaseio.com/
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   > **Note:** `PORT` is intentionally omitted — Vercel serverless functions don't bind to a port, so setting it has no effect and can be misleading. If you deploy to **Render** instead, add `PORT=5000` there since Render runs a persistent container that needs to listen on an actual port.
4. Connect Custom Domain in Vercel:
   - Go to **Project Settings** $\rightarrow$ **Domains** $\rightarrow$ Add `api.yourdomain.com`.

---

## 5. Backend CORS Configuration Update

Ensure `server/config/cors.js` allows your custom domain:

```javascript
import { config } from './env.js'

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || config.isDev) {
      return callback(null, true)
    }

    const allowedOrigins = [
      config.clientUrl, // should resolve to https://yourdomain.com via CLIENT_URL env var
      'https://www.yourdomain.com',
      'http://localhost:5173',
    ]

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Key'],
}
```

---

## 6. Hardware Device (Smart Helmet) Ingestion

Microcontrollers on the helmet connect over cellular or Wi-Fi to send telemetry:

- **Endpoint**: `https://api.yourdomain.com/api/devices/telemetry`
- **Method**: `POST`
- **Headers**:
  ```http
  Content-Type: application/json
  X-Device-Key: your_secure_helmet_device_key
  ```
- **Payload Example**:
  ```json
  {
    "deviceId": "netra-helmet-01",
    "battery": 88,
    "charging": false,
    "latitude": 18.5204,
    "longitude": 73.8567,
    "speed": 24.5,
    "accuracy": 8
  }
  ```

---

## 7. Deployment Checklist

- [ ] Domain nameservers pointed to Cloudflare.
- [ ] Cloudflare Pages project created and connected to `Anonymyrp/netrasarthiv1`.
- [ ] Build configuration set to `dist` and `npm run build`.
- [ ] Frontend environment variables set on Cloudflare Pages.
- [ ] Backend deployed (Vercel or Render) with `NODE_ENV=production`.
- [ ] Backend environment variables injected securely (JWT, Cloudinary, Firebase).
- [ ] CNAME `api` pointing to backend host.
- [ ] CORS allowed origins updated to match `https://yourdomain.com`.
- [ ] Test live authentication, GPS tracking, and video recordings on production URL.

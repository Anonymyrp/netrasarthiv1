# Netra Sarthi 🪖📍

> **Next-Generation Smart Helmet IoT Telemetry & Guardian Safety Platform**  
> Developed for Smart India Hackathon (SIH)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-netra--sarathi.vercel.app-blue?style=flat-square&logo=vercel)](https://netra-sarathi.vercel.app/)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-netrasarthiv1.vercel.app-black?style=flat-square&logo=vercel)](https://netrasarthiv1.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Video%20API-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)

---

## 🌟 Overview

**Netra Sarthi** is an intelligent safety and telemetry ecosystem designed to protect riders and workforce personnel using smart helmet IoT technology. The system continuously synchronizes real-time GPS coordinates, device vitals, sensor telemetry, and on-device camera footage to a unified cloud dashboard.

Guardians and fleet controllers can monitor live coordinates, inspect past travel routes with simulated playback, review high-definition helmet video feeds, and receive instant alerts for emergencies or safety boundary deviations.

---

## ✨ Key Features

### 📍 Real-Time Location Tracking
- Sub-second GPS telemetry synchronization using **Firebase Realtime Database**.
- Visualized on interactive **OpenStreetMap / Leaflet** interfaces with custom status markers and radius accuracy circles.
- One-click direction dispatch to Google Maps.

### 🗺️ Route History & Playback
- Historical breadcrumb recording indexed chronologically.
- Interactive **Route Playback** simulator with speed multipliers ($1\times, 2\times, 4\times$) and time-step scrubbing.
- Automatic geodesic distance calculations (Haversine formula), average travel speeds, and active operating hours.

### 📹 Helmet Stream & Cloud Recordings
- Cloud-hosted camera recording archives powered by **Cloudinary**.
- In-browser playback and MSE (Media Source Extensions) remuxing for raw **H.264** video streams via **JMuxer**.
- Built-in video player modal featuring timeline navigation, autoplay policies, and video deletion controls.

### 🚨 Smart Alerts & Incident Monitoring
- Immediate notifications for critical triggers (low battery alerts, sync disconnections, geofence breaches).
- Device vitals monitoring including battery percentages, network connectivity (4G/5G/WiFi), and GPS lock status.

### ⚡ Full-Stack Serverless Architecture
- Express.js API deployed seamlessly as **Vercel Serverless Functions** under `/api/*`.
- Secured with **JWT authentication**, device secret keys, and express rate-limiting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) |
| **Maps & Telemetry** | [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/), OpenStreetMap |
| **Video Processing** | [JMuxer](https://github.com/samirkumardas/jmuxer) (H.264 stream remuxer), Cloudinary SDK |
| **Backend & APIs** | [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/), [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) |
| **Database & Cloud** | [Firebase Realtime Database](https://firebase.google.com/docs/database), Cloudinary Media Storage |
| **Deployment** | [Vercel](https://vercel.com/) (Vite Static Hosting + Node Serverless Functions) |

---

## 📁 Project Structure

```
netrasarthiv1/
├── api/                   # Vercel serverless function entrypoint (/api/index.js)
├── public/                # Public assets, static 3D models & icons
├── server/                # Express backend application
│   ├── config/            # Environment parsing, CORS, Firebase Admin config
│   ├── middleware/        # JWT auth, rate limiters, error handling
│   ├── routes/            # REST API endpoints (locations, devices, recordings, alerts)
│   ├── services/          # Firebase Realtime DB & Cloudinary adapters
│   └── app.js             # Express application assembly
├── src/                   # React frontend application
│   ├── assets/            # UI images and icons
│   ├── components/        # Reusable dashboard widgets, modals, map components
│   ├── config/            # Client-side Firebase SDK configuration
│   ├── data/              # Mock fallback datasets and API contracts
│   ├── Layout/            # Responsive dashboard layouts & navigation sidebar
│   ├── Pages/             # Primary views (Live Location, Past History, Recordings, Alerts)
│   ├── App.jsx            # Application routing & authentication state
│   └── main.jsx           # React root renderer
├── .env.example           # Environment template (safe for version control)
├── vercel.json            # Vercel routing rewrites for SPA and serverless API
├── vite.config.js         # Vite configuration with Tailwind CSS plugin
└── package.json           # Project manifest and dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn** / **pnpm**
- Firebase project with Realtime Database enabled
- Cloudinary account (for video recordings)

### 1. Clone the Repository
```bash
git clone https://github.com/Anonymyrp/netrasarthiv1.git
cd netrasarthiv1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Fill in your credentials in `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT & Device Security
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
DEVICE_API_KEY=your_helmet_device_api_key

# Firebase Server Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client (Vite)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Production & Vercel Deployment

This project is configured for single-repository deployment on **Vercel**:
- Frontend static assets are built with `npm run build` (`vite build`).
- Backend routes are automatically served as serverless functions through `/api` as defined in `vercel.json`.

### Deploying to Vercel
1. Import the repository into your Vercel Dashboard.
2. In **Project Settings** &rarr; **Environment Variables**, add the server and client configuration keys defined in `.env.example`.
3. Ensure `FIREBASE_PRIVATE_KEY` contains the complete RSA private key string.
4. Deploy the project. The live health verification is accessible at `/api/health`.

---

## 🔒 Security & Best Practices

- **Zero Secret Leaks**: `.env` and sensitive certificates are strictly ignored by `.gitignore`. Never commit service account private keys or secrets.
- **Reverse Proxy Trust**: The Express server is configured to trust upstream reverse proxies on Vercel/Cloudflare.
- **CORS Guards**: Pre-configured cross-origin resource sharing allowing safe origins while blocking arbitrary origins in production.

---

## 📄 License

Developed for academic and Smart India Hackathon (SIH) prototype demonstration.  
All rights reserved © 2026 **Team Netra Sarthi**.

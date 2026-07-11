# MechaMind OS 2.0

MechaMind OS 2.0 is an enterprise-grade, AI-driven Smart Factory Operating System. It serves as a unified command center for automated manufacturing plants, bridging live IoT telemetry, 3D Digital Twins, Predictive Maintenance simulations, and Multi-Agent AI orchestration.

---

## What is Inside the Platform

### 1. Live Operations & 3D Digital Twin
- **3D Interactive Factory Map**: An immersive WebGL canvas (rendered using Three.js / React Three Fiber) depicting real-time machine node states, alerts, and spatial structures.
- **IoT Telemetry & Analytics**: Real-time streaming charts showing machine vibrations, temperatures, and pressures to prevent sudden failures.
- **Vision AI Gateway**: Live camera feed overlays demonstrating safety violations and automated parts inspection.
- **Control Room HUD**: A full-screen, high-contrast dashboard optimized for overhead factory monitor displays.

### 2. Predictive Maintenance & Planning
- **Remaining Useful Life (RUL) Forecasting**: AI-generated degradation trajectories that predict the precise day a machine will fail.
- **What-If Scenario Simulator**: Interactive cost-vs-downtime calculation parameters allowing maintenance planners to test the financial impact of delaying repairs.
- **Enterprise Risk Matrix**: A global heatmap charting failure probability against operational severity for the entire fleet.
- **Custom Scheduling Calendar**: High-performance weekly/monthly planner grids built without heavy external libraries.

### 3. Artificial Intelligence & MLOps
- **Multi-Agent Workspace**: An interface where distinct AI agents (e.g. Reliability Agent and Safety Officer Agent) debate maintenance recommendations.
- **Vector Search & Document Intelligence**: RAG-supported document scanner indexing heavy operating manuals to answer engineering troubleshooting queries.
- **MLOps Dashboard**: Token trackers, safety evaluation logs, latency statistics, and prompt A/B versioning dashboards.

### 4. Field Operations & Mobile App
- **Offline Work Queue**: Progressive Web App (PWA) sync queues allowing technicians to complete forms and upload defects without a live internet connection.
- **QR Code Scanner**: Mock hardware scanner integration for instant machine asset mapping.

---

## Quick Start (Frontend Only - No Backend Required)

The frontend runs independently with mock data. No Docker or backend services needed.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Step 1: Install Dependencies
```bash
id 
```
> If you encounter peer dependency conflicts, use: `npm install --legacy-peer-deps`

### Step 2: Start the Dev Server
```bash
npm run dev
```

### Step 3: Open the App
Navigate to **http://localhost:3000** in your browser.

### Login
Use the login page at `/login` and enter any email/password to access the dashboard. The app uses mock authentication by default.

---

## Full Stack (With Docker Backend)

To run the complete stack with database, vector store, and API:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Step 1: Start Backend Infrastructure
From the project root:
```bash
docker-compose up --build
```
This starts: Postgres, Redis, Neo4j, Qdrant, MinIO, Prometheus, and the FastAPI backend.

### Step 2: Start the Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Project Structure

```
mechamind-os/
├── frontend/              # Vite + React 19 SPA
│   ├── src/
│   │   ├── components/    # UI components (Sidebar, Navbar, charts, etc.)
│   │   ├── pages/         # All page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── store/         # Zustand state management
│   │   ├── lib/           # Utilities (API client, supabase)
│   │   └── layouts/       # Layout components
│   └── package.json
├── backend/               # FastAPI Python backend
├── docker-compose.yml     # Infrastructure services
└── README.md
```

## Frontend Routes

| Path | Page |
|------|------|
| `/` | Command Center Dashboard |
| `/login` | Login |
| `/assets` | Asset Management |
| `/assets/machines` | Machine List |
| `/maintenance` | Maintenance Dashboard |
| `/maintenance/work-orders` | Work Orders |
| `/maintenance/predictive` | Predictive Maintenance |
| `/documents` | Document Intelligence |
| `/iot/sensors` | Sensor Telemetry |
| `/iot/alarms` | Alarm Center |
| `/ai/workspace` | AI Workspace |
| `/ai/knowledge` | Knowledge Base |
| `/ai/knowledge-graph` | Knowledge Graph Explorer |
| `/digital-twin` | Digital Twin Dashboard |
| `/digital-twin/control-room` | Control Room HUD |
| `/predictive` | Predictive Analytics |
| `/predictive/failures` | Failure Prediction |
| `/production` | Production Operations |
| `/agents` | AI Agent Hub |
| `/mobile` | Mobile Workforce |
| `/platform/flags` | Feature Flags |
| `/platform/deployments` | Deployments |
| `/admin` | Admin Dashboard |
| `/profile` | User Profile |

## Architecture

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS
- **State Management**: Zustand + React Query (TanStack Query)
- **Routing**: React Router v6
- **Charts**: Recharts, Custom SVG gauges
- **3D Visualization**: React Three Fiber + Three.js
- **Backend**: FastAPI (Python 3.12)
- **Databases**: PostgreSQL, Redis, Neo4j, Qdrant
- **Auth**: Supabase / JWT
- **Infrastructure**: Docker Compose
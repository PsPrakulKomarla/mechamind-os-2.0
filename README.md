# MechaMind OS 2.0

MechaMind OS 2.0 is an enterprise-grade, AI-driven Smart Factory Operating System. It serves as a unified command center for automated manufacturing plants, bridging live IoT telemetry, 3D Digital Twins, Predictive Maintenance simulations, and Multi-Agent AI orchestration.

---

## What is Inside the Platform

### 1. Live Operations & 3D Digital Twin
*   **3D Interactive Factory Map**: An immersive WebGL canvas (rendered using Three.js / React Three Fiber) depicting real-time machine node states, alerts, and spatial structures.
*   **IoT Telemetry & Analytics**: Real-time streaming charts showing machine vibrations, temperatures, and pressures to prevent sudden failures.
*   **Vision AI Gateway**: Live camera feed overlays demonstrating safety violations and automated parts inspection.
*   **Control Room HUD**: A full-screen, high-contrast dashboard optimized for overhead factory monitor displays.

### 2. Predictive Maintenance & Planning
*   **Remaining Useful Life (RUL) Forecasting**: AI-generated degradation trajectories that predict the precise day a machine will fail.
*   **What-If Scenario Simulator**: Interactive cost-vs-downtime calculation parameters allowing maintenance planners to test the financial impact of delaying repairs.
*   **Enterprise Risk Matrix**: A global heatmap charting failure probability against operational severity for the entire fleet.
*   **Custom Scheduling Calendar**: High-performance weekly/monthly planner grids built without heavy external libraries.

### 3. Artificial Intelligence & MLOps
*   **Multi-Agent Workspace**: An interface where distinct AI agents (e.g. Reliability Agent and Safety Officer Agent) debate maintenance recommendations.
*   **Vector Search & Document Intelligence**: RAG-supported document scanner indexing heavy operating manuals to answer engineering troubleshooting queries.
*   **MLOps Dashboard**: Token trackers, safety evaluation logs, latency statistics, and prompt A/B versioning dashboards.

### 4. Field Operations & Mobile App
*   **Offline Work Queue**: Progressive Web App (PWA) sync queues allowing technicians to complete forms and upload defects without a live internet connection.
*   **QR Code Scanner**: Mock hardware scanner integration for instant machine asset mapping.

---

## Supabase Configuration
The application is pre-configured to use **Supabase** for client-side API calls and user authentication.

Configurations are managed in the `frontend/.env` file:
*   `VITE_SUPABASE_URL`: `https://qzzihngzmvwcdyeixlbv.supabase.co`
*   `VITE_SUPABASE_ANON_KEY`: `sb_publishable_oWDPMlRh3DmeMnOVfWARgA_5KH_MWLj`

---

## How to Run the Application

### Prerequisites
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [Node.js](https://nodejs.org/) (v18+) installed.

### Step 1: Spin up the Infrastructure Containers
Open a terminal in the project root directory and start the database and backend services:
```bash
docker-compose up --build
```
This boots up Postgres, Redis, Neo4j, Qdrant, MinIO, Prometheus, and the backend FastAPI application.

### Step 2: Spin up the Frontend
Open a new terminal window, navigate to the `frontend` folder, install the node modules, and boot up the Vite dev server:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Step 3: Accessing the App
*   **Frontend Dashboard**: Open your browser and navigate to `http://localhost:5173`
*   **Backend API Documentation**: Access the Swagger documentation at `http://localhost:8000/docs`

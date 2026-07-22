# MechaMind OS 2.0

Welcome to MechaMind OS 2.0, the next-generation Industrial AI Copilot and Operations Dashboard. This guide will walk you through exactly how to download, set up, and run the entire application step-by-step.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your computer:
1. **[Git](https://git-scm.com/downloads)** (To download the code)
2. **[Node.js](https://nodejs.org/)** (v18 or higher, for the frontend)
3. **[Python](https://www.python.org/downloads/)** (v3.10 or higher, for the backend)
4. **[Docker Desktop](https://www.docker.com/products/docker-desktop)** (To run the databases)

---

## Step 1: Download the Project

Open your terminal or command prompt and clone the repository:

```bash
git clone https://github.com/PsPrakulKomarla/mechamind-os-2.0.git
cd mechamind-os-2.0
```
*(If you have already downloaded it, just open your terminal and `cd` into the project folder).*

---

## Step 2: Start the Databases (Docker)

MechaMind OS relies on several databases like PostgreSQL, Redis, Neo4j, and Qdrant. The easiest way to run them is via Docker.

1. Ensure **Docker Desktop** is open and running on your computer.
2. **IMPORTANT:** Open your terminal and make sure you are in the **root directory** of the project (e.g. `C:\Users\prakul\Desktop\projects\mechamind-os`), NOT inside the `backend` folder!
3. Run the following command:
   ```bash
   docker-compose up -d postgres redis neo4j qdrant minio
   ```
   *This will download and start all the necessary databases in the background.*

---

## Step 3: Run the Backend (Python API)

Now we need to start the backend API server. Open a **new terminal window** and run these commands:

### For Windows:
```powershell
# 1. Go to the backend folder
cd backend

# 2. Create a virtual environment
python -m venv .venv

# 3. Activate the virtual environment
.venv\Scripts\activate

# 4. Install dependencies
pip install -e .

# 5. Start the backend server
uvicorn app.main:app --reload --port 8000
```

*Leave this terminal window open! The backend is now running at `http://localhost:8000`.*

---

## Step 4: Run the Frontend (React UI)

Finally, let's start the user interface. Open a **third new terminal window** and run these commands:

```bash
# 1. Go to the frontend folder
cd frontend

# 2. Install all frontend packages
npm install

# 3. Start the development server
npm run dev
```

---

## 🎉 Step 5: Access the Application

Once the frontend finishes loading, open your web browser and go to:

👉 **http://localhost:3000**

You can now log in, view the dashboards, and use the AI copilot!

---

## 🛠️ Troubleshooting

- **`ECONNREFUSED` error in the frontend terminal?** 
  This means your frontend can't find your backend. Make sure Step 3 was completed successfully and the backend is running on port 8000.
- **Database Connection Errors?**
  Make sure Docker Desktop is open and you ran the `docker-compose up -d` command in Step 2.
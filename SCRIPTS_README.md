# 🚀 AEGISFLOW Startup Scripts

Three convenient scripts to manage the AEGISFLOW system.

---

## 📋 Scripts Overview

### 1. `start_aegisflow.sh` (Recommended)
**Full-featured startup script with monitoring**

**Features:**
- ✅ Starts both backend and frontend
- ✅ Waits for services to be healthy
- ✅ Monitors processes continuously
- ✅ Auto-cleanup on Ctrl+C
- ✅ Colored output and status display
- ✅ Logs to `/tmp/aegisflow_*.log`

**Usage:**
```bash
./start_aegisflow.sh
```

Press `Ctrl+C` to stop both services automatically.

---

### 2. `start_simple.sh` (Quick Start)
**Lightweight script for development**

**Features:**
- ✅ Starts backend in background
- ✅ Starts frontend in background
- ✅ Quick startup (no health checks)
- ✅ Logs to `/tmp/aegisflow_*.log`

**Usage:**
```bash
# Start services
./start_simple.sh

# Stop services
./stop_aegisflow.sh
```

---

### 3. `stop_aegisflow.sh` (Cleanup)
**Stops all AEGISFLOW services**

**Features:**
- ✅ Kills backend process
- ✅ Kills frontend process
- ✅ Cleans up PID files
- ✅ Kills any remaining processes on ports 8000 and 5173

**Usage:**
```bash
./stop_aegisflow.sh
```

---

## 🎯 Quick Start

### Option 1: Full Monitoring (Recommended)
```bash
cd /home/smitp/unstop/CIH
./start_aegisflow.sh
```

**Output:**
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           AEGISFLOW SYSTEM STARTUP                        ║
║     NASA C-MAPSS Turbofan RUL Prediction System          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Starting Backend...
✓ Backend started (PID: 12345)
  URL: http://localhost:8000
  Logs: /tmp/aegisflow_backend.log

Waiting for backend to be ready...
✓ Backend is healthy!

Starting Frontend...
✓ Frontend started (PID: 12346)
  Logs: /tmp/aegisflow_frontend.log

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         AEGISFLOW SYSTEM IS RUNNING                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Backend:   http://localhost:8000
Frontend:  http://localhost:5173
API Docs:  http://localhost:8000/docs

Press Ctrl+C to stop all services
```

### Option 2: Simple Background Start
```bash
cd /home/smitp/unstop/CIH
./start_simple.sh

# When done:
./stop_aegisflow.sh
```

---

## 📊 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React web interface |
| **Backend API** | http://localhost:8000 | FastAPI REST endpoints |
| **API Docs** | http://localhost:8000/docs | Swagger UI documentation |
| **Health Check** | http://localhost:8000/health | System status |

---

## 🔐 Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `engineer` | `engineer123` | User |

---

## 📝 Log Files

All logs are written to `/tmp/`:

```bash
# View backend logs (live)
tail -f /tmp/aegisflow_backend.log

# View frontend logs (live)
tail -f /tmp/aegisflow_frontend.log

# View last 50 lines of backend
tail -50 /tmp/aegisflow_backend.log

# Search for errors
grep -i error /tmp/aegisflow_backend.log
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill processes on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill processes on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Or use the stop script
./stop_aegisflow.sh
```

### Script Won't Start
```bash
# Make sure scripts are executable
chmod +x *.sh

# Check if virtual environment exists
ls -la /home/smitp/unstop/CIH/CIHenv/bin/python

# Check if dependencies are installed
source /home/smitp/unstop/CIH/CIHenv/bin/activate
pip list
```

### Services Not Starting
```bash
# Check the logs
tail -50 /tmp/aegisflow_backend.log
tail -50 /tmp/aegisflow_frontend.log

# Test backend manually
cd /home/smitp/unstop/CIH/CIH-Main/backend
source /home/smitp/unstop/CIH/CIHenv/bin/activate
python main.py

# Test frontend manually
cd /home/smitp/unstop/CIH/CIH-Main/frontend
pnpm run dev
```

---

## 🎮 Manual Commands

If you prefer to run services manually:

### Backend Only
```bash
cd /home/smitp/unstop/CIH/CIH-Main/backend
source /home/smitp/unstop/CIH/CIHenv/bin/activate
python main.py
```

### Frontend Only
```bash
cd /home/smitp/unstop/CIH/CIH-Main/frontend
pnpm run dev
```

---

## 📦 What Each Script Does

### start_aegisflow.sh
1. Validates directories and virtual environment
2. Starts backend with Python uvicorn server
3. Waits for backend health check (up to 30 seconds)
4. Starts frontend with Vite dev server
5. Monitors both processes continuously
6. Handles Ctrl+C gracefully, stopping all services
7. Cleans up PID files on exit

### start_simple.sh
1. Starts backend in background
2. Waits 3 seconds
3. Starts frontend in background
4. Prints service info and exits

### stop_aegisflow.sh
1. Reads PID files
2. Kills backend process
3. Kills frontend process and children
4. Cleans up PID files
5. Force-kills any remaining processes on ports 8000/5173

---

## ✅ Verification

After starting, verify services are running:

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:5173

# Check processes
ps aux | grep -E "python main.py|vite"

# Check ports
lsof -i :8000
lsof -i :5173
```

---

## 🎯 Recommended Workflow

### For Development
Use `start_aegisflow.sh` for active development:
- Continuous monitoring
- Immediate error detection
- Easy shutdown with Ctrl+C

### For Quick Testing
Use `start_simple.sh` for quick tests:
- Fast startup
- Background execution
- Manual control

### For Cleanup
Always use `stop_aegisflow.sh` to ensure clean shutdown:
- Kills all related processes
- Cleans up PID files
- Frees ports for next run

---

**Created:** 2026-01-31  
**Version:** 1.0.0  
**System:** AEGISFLOW RUL Prediction Platform

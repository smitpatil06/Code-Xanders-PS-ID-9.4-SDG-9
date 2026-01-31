# 🚀 AEGISFLOW - Quick Start Guide

## Running the System

### 🚀 Quick Start (Recommended)
Use the automated startup scripts:

```bash
cd /home/smitp/unstop/CIH

# Option 1: Full monitoring (recommended)
./start_aegisflow.sh
# Press Ctrl+C to stop

# Option 2: Simple background start
./start_simple.sh
# Stop with: ./stop_aegisflow.sh
```

See [SCRIPTS_README.md](SCRIPTS_README.md) for detailed script documentation.

### Manual Start

#### 1. Start Backend
```bash
cd /home/smitp/unstop/CIH/CIH-Main/backend
source /home/smitp/unstop/CIH/CIHenv/bin/activate
python main.py
```
**Backend will run on:** http://localhost:8000

#### 2. Start Frontend (Development)
```bash
cd /home/smitp/unstop/CIH/CIH-Main/frontend
pnpm run dev
```
**Frontend will run on:** http://localhost:5173

#### 3. Or Use Production Build
```bash
cd /home/smitp/unstop/CIH/CIH-Main/frontend
pnpm run build
pnpm run preview
```

---

## 🔑 Default Credentials

Access the system through the login page:

| User | Username | Password | Role |
|------|----------|----------|------|
| **Admin** | `admin` | `admin123` | admin |
| **Engineer** | `engineer` | `engineer123` | user |

**Quick Access:** Use the demo login buttons on the login page for one-click authentication!

---

## 🌐 API Endpoints

### Public Endpoints
- `GET /` - API information
- `GET /health` - System health check

### Authentication Required
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info
- `POST /upload_test` - Upload test data for batch analysis
- `POST /set_engine` - Switch to different engine
- `GET /alerts` - Get alert history
- `GET /predictions` - Get prediction history

### Real-time
- `WS /ws` - WebSocket for real-time monitoring

---

## 🧪 Quick API Tests

### 1. Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Upload File
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:8000/upload_test \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/home/smitp/unstop/CIH/dataset/test_FD001.txt"
```

### 3. Switch Engine
```bash
curl -X POST http://localhost:8000/set_engine \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"unit_id": 50}'
```

### 4. Get Alerts
```bash
curl -X GET "http://localhost:8000/alerts?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Project Structure

```
CIH/
├── CIH-Main/
│   ├── ai_engine/           # ML models and inference
│   │   ├── rul_predictor.joblib
│   │   ├── inference.py
│   │   └── processing.py
│   ├── backend/             # FastAPI backend
│   │   ├── main.py          # Main API server
│   │   └── sensor_sim_fixed.py
│   └── frontend/            # React frontend
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── hooks/       # Custom hooks
│       │   └── App.tsx
│       └── dist/           # Production build
├── dataset/                # NASA C-MAPSS data
│   ├── train_FD001.txt
│   ├── test_FD001.txt
│   └── ...
└── CIHenv/                 # Python virtual environment

```

---

## 🔧 Common Commands

### Backend
```bash
# Activate environment
source /home/smitp/unstop/CIH/CIHenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
cd CIH-Main/backend && python main.py

# Check logs
tail -f /tmp/backend_test.log
```

### Frontend
```bash
# Install dependencies
cd CIH-Main/frontend && pnpm install

# Development server
pnpm run dev

# Production build
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Port 8000 already in use
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
```

**Problem:** Module not found
```bash
# Reinstall dependencies
source /home/smitp/unstop/CIH/CIHenv/bin/activate
pip install -r requirements.txt
```

**Problem:** Model file not found
```bash
# Check model files exist
ls -lh CIH-Main/ai_engine/*.joblib
```

### Frontend Issues

**Problem:** Dependencies missing
```bash
cd CIH-Main/frontend
pnpm install
```

**Problem:** Build fails
```bash
# Clean and rebuild
rm -rf node_modules dist
pnpm install
pnpm run build
```

**Problem:** TypeScript errors
```bash
# Check for errors
pnpm run build
```

### Authentication Issues

**Problem:** Login fails
```bash
# Check backend is running
curl http://localhost:8000/health

# Test credentials
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Problem:** Token expired
- Tokens expire after 30 minutes
- Frontend auto-login will refresh automatically
- Or manually re-authenticate

---

## 📊 Monitoring

### Check System Status
```bash
curl http://localhost:8000/health | python3 -m json.tool
```

### View Metrics
- Total Requests
- Total Predictions
- Total Alerts
- Active WebSocket Connections
- Uptime

### Check Logs
```bash
# Backend logs (if running in background)
tail -f /tmp/backend_test.log

# Or check backend terminal directly
```

---

## 🔐 Security Notes

### Development
- Auto-login enabled for convenience
- Tokens stored in localStorage
- CORS enabled for localhost

### Production (Required Changes)
1. Change `SECRET_KEY` in main.py
2. Use environment variables for credentials
3. Enable HTTPS
4. Restrict CORS to specific domains
5. Add rate limiting
6. Implement refresh tokens
7. Add request logging

---

## 📈 Performance Tips

### Backend
- Model is pre-loaded for fast predictions
- WebSocket streaming at 300ms intervals
- Rate limiting prevents abuse
- Async/await for non-blocking I/O

### Frontend
- Production build is optimized (174KB gzipped)
- Lazy loading for routes
- Efficient React hooks
- Optimized re-renders

---

## 🎯 Feature Overview

### Real-Time Monitoring
- 14 NASA C-MAPSS sensors tracked
- 300ms update interval
- Visual status indicators (Healthy/Warning/Critical)
- Historical data plotting (last 50 cycles)

### Batch Analysis
- Upload test files
- Analyze 100+ engines simultaneously
- CSV export functionality
- Confidence scoring

### Alert System
- RUL threshold alerts
- Temperature warnings
- Sensor anomaly detection
- Alert history tracking

### Engine Management
- Switch between engines (1-100)
- Pre-configured demo units
- Real-time simulator
- Lifecycle tracking

---

## 📚 Additional Documentation

- [TEST_REPORT.md](TEST_REPORT.md) - Comprehensive test results
- [UPLOAD_FIX.md](UPLOAD_FIX.md) - File upload bug analysis
- [CHECKUP_SUMMARY.md](CHECKUP_SUMMARY.md) - Full system checkup
- [API_INTEGRATION.md](CIH-Main/frontend/API_INTEGRATION.md) - API documentation

---

## 🆘 Support

### Check These First
1. Backend running? `curl http://localhost:8000/health`
2. Frontend built? `ls -lh CIH-Main/frontend/dist/`
3. Virtual env active? `which python` (should show CIHenv path)
4. Dependencies installed? Check requirements.txt vs installed packages

### Common Solutions
- Restart backend: Kill process and restart
- Clear browser cache: Ctrl+Shift+R
- Rebuild frontend: `pnpm run build`
- Reset simulator: POST to `/set_engine` with unit_id

---

**System Status:** ✅ All systems operational
**Last Updated:** 2026-01-31
**Version:** 2.0.0

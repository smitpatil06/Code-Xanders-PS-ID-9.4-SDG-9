#!/bin/bash

# Simple AEGISFLOW Startup Script
# Starts backend and frontend in separate terminal windows (for development)

PROJECT_DIR="/home/smitp/unstop/CIH"
BACKEND_DIR="$PROJECT_DIR/CIH-Main/backend"
FRONTEND_DIR="$PROJECT_DIR/CIH-Main/frontend"
VENV_DIR="$PROJECT_DIR/CIHenv"

echo "🚀 Starting AEGISFLOW System..."
echo ""

# Start backend in background
echo "📡 Starting Backend..."
cd "$BACKEND_DIR"
source "$VENV_DIR/bin/activate"
python main.py > /tmp/aegisflow_backend.log 2>&1 &
echo $! > /tmp/aegisflow_backend.pid
echo "   Backend PID: $(cat /tmp/aegisflow_backend.pid)"
echo "   URL: http://localhost:8000"
echo "   Logs: tail -f /tmp/aegisflow_backend.log"

# Wait for backend
echo ""
echo "⏳ Waiting for backend..."
sleep 3

# Start frontend in background
echo ""
echo "🎨 Starting Frontend..."
cd "$FRONTEND_DIR"
pnpm run dev > /tmp/aegisflow_frontend.log 2>&1 &
echo $! > /tmp/aegisflow_frontend.pid
echo "   Frontend PID: $(cat /tmp/aegisflow_frontend.pid)"
echo "   URL: http://localhost:5173"
echo "   Logs: tail -f /tmp/aegisflow_frontend.log"

echo ""
echo "✅ AEGISFLOW is starting up!"
echo ""
echo "To stop: ./stop_aegisflow.sh"
echo "Or run: kill \$(cat /tmp/aegisflow_backend.pid /tmp/aegisflow_frontend.pid)"

#!/bin/bash

# Stop AEGISFLOW System

echo "🛑 Stopping AEGISFLOW System..."

if [ -f /tmp/aegisflow_backend.pid ]; then
    BPID=$(cat /tmp/aegisflow_backend.pid)
    if ps -p $BPID > /dev/null 2>&1; then
        echo "   Stopping backend (PID: $BPID)..."
        kill $BPID 2>/dev/null
        rm /tmp/aegisflow_backend.pid
    else
        echo "   Backend not running"
        rm -f /tmp/aegisflow_backend.pid
    fi
else
    echo "   Backend PID file not found"
fi

if [ -f /tmp/aegisflow_frontend.pid ]; then
    FPID=$(cat /tmp/aegisflow_frontend.pid)
    if ps -p $FPID > /dev/null 2>&1; then
        echo "   Stopping frontend (PID: $FPID)..."
        kill $FPID 2>/dev/null
        # Kill child processes (vite)
        pkill -P $FPID 2>/dev/null || true
        rm /tmp/aegisflow_frontend.pid
    else
        echo "   Frontend not running"
        rm -f /tmp/aegisflow_frontend.pid
    fi
else
    echo "   Frontend PID file not found"
fi

# Kill any remaining processes on the ports
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo ""
echo "✅ AEGISFLOW stopped"

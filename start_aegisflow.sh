#!/bin/bash

# AEGISFLOW System Startup Script
# Starts both backend and frontend simultaneously

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
PROJECT_DIR="/home/smitp/unstop/CIH"
BACKEND_DIR="$PROJECT_DIR/CIH-Main/backend"
FRONTEND_DIR="$PROJECT_DIR/CIH-Main/frontend"
VENV_DIR="$PROJECT_DIR/CIHenv"

# Log files
BACKEND_LOG="/tmp/aegisflow_backend.log"
FRONTEND_LOG="/tmp/aegisflow_frontend.log"

# PID files
BACKEND_PID="/tmp/aegisflow_backend.pid"
FRONTEND_PID="/tmp/aegisflow_frontend.pid"

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Shutting down AEGISFLOW system...${NC}"
    
    if [ -f "$BACKEND_PID" ]; then
        BPID=$(cat "$BACKEND_PID")
        if ps -p $BPID > /dev/null 2>&1; then
            echo -e "${BLUE}Stopping backend (PID: $BPID)...${NC}"
            kill $BPID 2>/dev/null || true
        fi
        rm -f "$BACKEND_PID"
    fi
    
    if [ -f "$FRONTEND_PID" ]; then
        FPID=$(cat "$FRONTEND_PID")
        if ps -p $FPID > /dev/null 2>&1; then
            echo -e "${BLUE}Stopping frontend (PID: $FPID)...${NC}"
            kill $FPID 2>/dev/null || true
            # Also kill any child processes (vite)
            pkill -P $FPID 2>/dev/null || true
        fi
        rm -f "$FRONTEND_PID"
    fi
    
    echo -e "${GREEN}AEGISFLOW system stopped.${NC}"
    exit 0
}

# Register cleanup on exit
trap cleanup EXIT INT TERM

# Print banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║           AEGISFLOW SYSTEM STARTUP                        ║"
echo "║     NASA C-MAPSS Turbofan RUL Prediction System          ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${RED}Error: Virtual environment not found at $VENV_DIR${NC}"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Error: Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Check if required ports are available
if lsof -ti:8000 > /dev/null 2>&1; then
    echo -e "${RED}Error: Port 8000 is already in use.${NC}"
    echo -e "${YELLOW}Run ./stop_aegisflow.sh or kill the process using port 8000, then retry.${NC}"
    exit 1
fi

if lsof -ti:5173 > /dev/null 2>&1; then
    echo -e "${RED}Error: Port 5173 is already in use.${NC}"
    echo -e "${YELLOW}Run ./stop_aegisflow.sh or kill the process using port 5173, then retry.${NC}"
    exit 1
fi

# Start Backend
echo -e "${YELLOW}Starting Backend...${NC}"
cd "$BACKEND_DIR"
source "$VENV_DIR/bin/activate"

# Start backend in background
nohup python main.py > "$BACKEND_LOG" 2>&1 &
BACKEND_PID_VALUE=$!
echo $BACKEND_PID_VALUE > "$BACKEND_PID"

echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID_VALUE)${NC}"
echo -e "${BLUE}  URL: http://localhost:8000${NC}"
echo -e "${BLUE}  Logs: $BACKEND_LOG${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is healthy!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}Error: Backend failed to start. Check logs: $BACKEND_LOG${NC}"
        exit 1
    fi
    sleep 1
done

# Start Frontend
echo -e "\n${YELLOW}Starting Frontend...${NC}"
cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    pnpm install
fi

# Start frontend in background
nohup pnpm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID_VALUE=$!
echo $FRONTEND_PID_VALUE > "$FRONTEND_PID"

echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID_VALUE)${NC}"
echo -e "${BLUE}  Logs: $FRONTEND_LOG${NC}"

# Wait for frontend to be ready
echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
sleep 3

# Try to detect the frontend URL
FRONTEND_URL="http://localhost:5173"
for i in {1..20}; do
    if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready!${NC}"
        echo -e "${BLUE}  URL: $FRONTEND_URL${NC}"
        break
    fi
    sleep 1
done

# Print status
echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║         AEGISFLOW SYSTEM IS RUNNING                       ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo -e ""
echo -e "${BLUE}Backend:${NC}   http://localhost:8000"
echo -e "${BLUE}Frontend:${NC}  $FRONTEND_URL"
echo -e "${BLUE}API Docs:${NC}  http://localhost:8000/docs"
echo -e ""
echo -e "${YELLOW}Default Credentials:${NC}"
echo -e "  Username: admin"
echo -e "  Password: admin123"
echo -e ""
echo -e "${YELLOW}Logs:${NC}"
echo -e "  Backend:  tail -f $BACKEND_LOG"
echo -e "  Frontend: tail -f $FRONTEND_LOG"
echo -e ""
echo -e "${RED}Press Ctrl+C to stop all services${NC}"
echo -e ""

# Keep script running and monitor processes
while true; do
    # Check if backend is still running
    if [ -f "$BACKEND_PID" ]; then
        BPID=$(cat "$BACKEND_PID")
        if ! ps -p $BPID > /dev/null 2>&1; then
            echo -e "${RED}Backend process died! Check logs: $BACKEND_LOG${NC}"
            exit 1
        fi
    fi
    
    # Check if frontend is still running
    if [ -f "$FRONTEND_PID" ]; then
        FPID=$(cat "$FRONTEND_PID")
        if ! ps -p $FPID > /dev/null 2>&1; then
            echo -e "${RED}Frontend process died! Check logs: $FRONTEND_LOG${NC}"
            exit 1
        fi
    fi
    
    sleep 5
done

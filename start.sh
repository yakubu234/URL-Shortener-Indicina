#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Backend (pnpm dev)...${NC}"
cd src || exit 1
pnpm dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}Starting Frontend (pnpm dev)...${NC}"
cd frontend || exit 1
pnpm dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Trap SIGINT and SIGTERM to kill child processes
trap "echo -e '\n${RED}Shutting down...${NC}'; kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGINT SIGTERM

# Tail logs
echo -e "${GREEN}Tailing logs... Press Ctrl+C to stop.${NC}"
tail -f backend.log frontend.log

#!/bin/bash

# VitalTrack - Quick Start Guide
# This script helps you get the application running with all 10 new features

echo "🚀 VitalTrack - Starting Application"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "⚠️  This application is configured for macOS. Some instructions may differ."
fi

echo "📋 Pre-requisites Check"
echo "====================="

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js is not installed${NC}"
  echo "  Please install from: https://nodejs.org"
  exit 1
else
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
fi

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo -e "${YELLOW}⚠ MongoDB is not installed or not in PATH${NC}"
  echo "  Install with: brew install mongodb-community"
  echo "  Start with: brew services start mongodb-community"
  echo "  (Assuming you have Homebrew installed)"
else
  echo -e "${GREEN}✓ MongoDB found${NC}"
fi

echo ""
echo "📦 Installing Dependencies"
echo "=========================="

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
  echo -e "${RED}✗ Failed to install backend dependencies${NC}"
  exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
  echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
  exit 1
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "1. Open Terminal 1 and run:"
echo -e "   ${YELLOW}cd backend && npm start${NC}"
echo ""
echo "2. Open Terminal 2 and run:"
echo -e "   ${YELLOW}cd frontend && npm start${NC}"
echo ""
echo "3. Open your browser to: http://localhost:3000"
echo ""
echo "📝 Test Credentials:"
echo "   Email: test@vitaltrack.com"
echo "   Password: Test@123"
echo ""
echo "🎯 New Features Available:"
echo "   • Health Goals (Set and track targets)"
echo "   • Medications (Track adherence)"
echo "   • Doctor Notes (Store visit records)"
echo "   • Food & Nutrition (Track meals)"
echo "   • Symptoms (Monitor health symptoms)"
echo "   • Achievements (Earn badges)"
echo "   • Dark Mode (Toggle theme)"
echo ""
echo "📚 For more information, see FEATURES.md"
echo ""

#!/bin/bash
# filepath: e:/realestate/run_tests.sh

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${YELLOW}====== REAL ESTATE ML INTEGRATION TEST RUNNER ======${NC}"
echo -e "${BLUE}This script will verify the full integration between ML API, backend, and frontend${NC}"

# Check if ML API is running
echo -e "\n${YELLOW}1. Checking if ML API is running...${NC}"
ML_API_RUNNING=false
curl -s http://localhost:5001/sample-data > /dev/null
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ ML API is running${NC}"
  ML_API_RUNNING=true
else
  echo -e "${RED}✗ ML API is not running${NC}"
  echo -e "${BLUE}Starting ML API...${NC}"
  cd ML-api && python app.py > ml_api.log 2>&1 &
  ML_PID=$!
  echo -e "${BLUE}Waiting for ML API to start up...${NC}"
  sleep 5
  # Check if it's running now
  curl -s http://localhost:5001/sample-data > /dev/null
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ML API successfully started${NC}"
    ML_API_RUNNING=true
  else
    echo -e "${RED}✗ Failed to start ML API${NC}"
    echo -e "${BLUE}Please check ML-api/ml_api.log for details${NC}"
  fi
  cd ..
fi

# Check if backend API is running
echo -e "\n${YELLOW}2. Checking if backend API is running...${NC}"
BACKEND_API_RUNNING=false
curl -s http://localhost:3000/api/ml/sample-data > /dev/null
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Backend API is running${NC}"
  BACKEND_API_RUNNING=true
else
  echo -e "${RED}✗ Backend API is not running${NC}"
  echo -e "${BLUE}Starting backend API...${NC}"
  cd api && npm start > backend_api.log 2>&1 &
  BACKEND_PID=$!
  echo -e "${BLUE}Waiting for backend API to start up...${NC}"
  sleep 5
  # Check if it's running now
  curl -s http://localhost:3000/api/ml/sample-data > /dev/null
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend API successfully started${NC}"
    BACKEND_API_RUNNING=true
  else
    echo -e "${RED}✗ Failed to start backend API${NC}"
    echo -e "${BLUE}Please check api/backend_api.log for details${NC}"
  fi
  cd ..
fi

# Run tests if both services are running
if [ "$ML_API_RUNNING" = true ] && [ "$BACKEND_API_RUNNING" = true ]; then
  echo -e "\n${YELLOW}3. Running integration tests...${NC}"
  npm test
  TEST_EXIT_CODE=$?
  
  # Report test results
  if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed successfully!${NC}"
  else
    echo -e "\n${RED}✗ Some tests failed. Please check the output above.${NC}"
  fi
else
  echo -e "\n${RED}Cannot run tests because one or more required services are not running.${NC}"
  echo -e "${BLUE}Please start the services manually and run 'npm test'${NC}"
  exit 1
fi

# Clean up if we started the services
if [ -n "$ML_PID" ]; then
  echo -e "\n${BLUE}Stopping ML API service...${NC}"
  kill $ML_PID
fi

if [ -n "$BACKEND_PID" ]; then
  echo -e "${BLUE}Stopping backend API service...${NC}"
  kill $BACKEND_PID
fi

echo -e "\n${YELLOW}====== TEST RUNNER FINISHED ======${NC}"
exit $TEST_EXIT_CODE

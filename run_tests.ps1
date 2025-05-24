
# Print header
Write-Host "====== REAL ESTATE ML INTEGRATION TEST RUNNER ======" -ForegroundColor Yellow
Write-Host "This script will verify the full integration between ML API, backend, and frontend" -ForegroundColor Cyan

# Check if ML API is running
Write-Host "`n1. Checking if ML API is running..." -ForegroundColor Yellow
$ML_API_RUNNING = $false
try {
  $response = Invoke-WebRequest -Uri "http://localhost:5001/sample-data" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
  if ($response.StatusCode -eq 200) {
    Write-Host "✓ ML API is running" -ForegroundColor Green
    $ML_API_RUNNING = $true
  }
} catch {
  Write-Host "✗ ML API is not running" -ForegroundColor Red
  Write-Host "Starting ML API..." -ForegroundColor Cyan
  Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory "E:\realestate\ML-api" -WindowStyle Hidden
  Write-Host "Waiting for ML API to start up..." -ForegroundColor Cyan
  Start-Sleep -Seconds 5
  # Check if it's running now
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/sample-data" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
      Write-Host "✓ ML API successfully started" -ForegroundColor Green
      $ML_API_RUNNING = $true
    }
  } catch {
    Write-Host "✗ Failed to start ML API" -ForegroundColor Red
    Write-Host "Please start the ML API manually: cd ML-api && python app.py" -ForegroundColor Cyan
  }
}

# Check if backend API is running
Write-Host "`n2. Checking if backend API is running..." -ForegroundColor Yellow
$BACKEND_API_RUNNING = $false
try {
  $response = Invoke-WebRequest -Uri "http://localhost:3000/api/ml/sample-data" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
  if ($response.StatusCode -eq 200) {
    Write-Host "✓ Backend API is running" -ForegroundColor Green
    $BACKEND_API_RUNNING = $true
  }
} catch {
  Write-Host "✗ Backend API is not running" -ForegroundColor Red
  Write-Host "Starting backend API..." -ForegroundColor Cyan
  Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "E:\realestate\api" -WindowStyle Hidden
  Write-Host "Waiting for backend API to start up..." -ForegroundColor Cyan
  Start-Sleep -Seconds 5
  # Check if it's running now
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/ml/sample-data" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
      Write-Host "✓ Backend API successfully started" -ForegroundColor Green
      $BACKEND_API_RUNNING = $true
    }
  } catch {
    Write-Host "✗ Failed to start backend API" -ForegroundColor Red
    Write-Host "Please start the backend API manually: cd api && npm start" -ForegroundColor Cyan
  }
}

# Run tests if both services are running
if ($ML_API_RUNNING -and $BACKEND_API_RUNNING) {
  Write-Host "`n3. Running integration tests..." -ForegroundColor Yellow
  Set-Location -Path "E:\realestate"
  npm test
  $TEST_EXIT_CODE = $LASTEXITCODE
  
  # Report test results
  if ($TEST_EXIT_CODE -eq 0) {
    Write-Host "`n✓ All tests passed successfully!" -ForegroundColor Green
  } else {
    Write-Host "`n✗ Some tests failed. Please check the output above." -ForegroundColor Red
  }
} else {
  Write-Host "`nCannot run tests because one or more required services are not running." -ForegroundColor Red
  Write-Host "Please start the services manually and run 'npm test'" -ForegroundColor Cyan
  Exit 1
}

Write-Host "`n====== TEST RUNNER FINISHED ======" -ForegroundColor Yellow
Exit $TEST_EXIT_CODE

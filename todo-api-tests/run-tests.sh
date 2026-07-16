#!/bin/bash

# Get the script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

echo "=================================================="
echo "🚀 Starting Automated API Integration Tests"
echo "=================================================="

# Check if npm/npx is available
if ! command -v npx &> /dev/null
then
    echo "❌ Node.js and npm (npx) are required to run tests from the command line."
    echo "Please install Node.js (which includes npm) or run tests by importing"
    echo "these collection files into the Postman Desktop App."
    exit 1
fi

BASE_URL=${BASE_URL:-http://localhost}

echo "📦 Installing/running Newman on-the-fly targeting ${BASE_URL}..."
npx -y newman run Todo_App_API_Tests.postman_collection.json -e Todo_App_Local.postman_environment.json --env-var "baseUrl=${BASE_URL}" --reporters cli

EXIT_CODE=$?

echo "=================================================="
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ ALL API TESTS PASSED SUCCESSFULLY!"
else
  echo "❌ SOME API TESTS FAILED! Please check the detailed console output above."
fi
echo "=================================================="

exit $EXIT_CODE

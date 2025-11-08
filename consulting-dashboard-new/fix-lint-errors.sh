#!/bin/bash

# Fix lint errors script

echo "Starting automated lint fixes..."

# First, try to auto-fix what ESLint can handle
echo "Running ESLint auto-fix..."
npm run lint -- --fix

# Count remaining errors
echo -e "\nCounting remaining errors..."
npm run lint 2>&1 | grep -E "error|warning" | wc -l

echo -e "\nScript completed. Manual fixes may still be required for:"
echo "1. Explicit 'any' types that need proper typing"
echo "2. Unused variables that should be removed or used"
echo "3. Missing dependencies in useEffect hooks"
echo "4. require() imports that need to be converted to ES6 imports"
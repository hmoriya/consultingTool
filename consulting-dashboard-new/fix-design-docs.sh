#!/bin/bash

# Services to update
services=("secure-access-service" "collaboration-facilitation-service")

# Document types
doc_types=("api-specification" "database-design" "integration-specification")

# Base URL
BASE_URL="http://localhost:3000/api/parasol/services"

for service in "${services[@]}"; do
  echo ""
  echo "=== $service ==="

  for doc in "${doc_types[@]}"; do
    file_path="docs/parasol/services/$service/$doc.md"

    if [ ! -f "$file_path" ]; then
      echo "❌ File not found: $file_path"
      continue
    fi

    # Read file content and create JSON payload
    content=$(cat "$file_path" | jq -Rs .)
    payload="{\"content\":$content}"

    # Send PUT request
    response=$(curl -s -w "\n%{http_code}" -X PUT \
      "$BASE_URL/$service/$doc" \
      -H "Content-Type: application/json" \
      -d "$payload")

    # Extract status code (last line)
    status=$(echo "$response" | tail -n1)
    # Extract body (all but last line)
    body=$(echo "$response" | head -n -1)

    if [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
      echo "✅ $service/$doc.md: $status"
    else
      echo "❌ $service/$doc.md: $status"
      echo "   Response: $body"
    fi
  done
done

echo ""
echo "✅ All documents processed!"

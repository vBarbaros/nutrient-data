#!/bin/bash

# Copy all JSON files from /api/v1/data to /docs/api/v1
mkdir -p docs/api/v1

if [ -d "api/v1/data" ]; then
    cp api/v1/data/*.json docs/api/v1/ 2>/dev/null
    echo "✓ Copied data files to docs/api/v1/"
else
    echo "✗ No api/v1/data directory found"
fi

# Copy list.json if it exists
if [ -f "api/v1/list.json" ]; then
    cp api/v1/list.json docs/api/v1/
    echo "✓ Copied list.json to docs/api/v1/"
fi

# Copy human-daily-needs.json to docs root
if [ -f "human-daily-needs.json" ]; then
    cp human-daily-needs.json docs/
    echo "✓ Copied human-daily-needs.json to docs/"
fi

echo "API generation complete!"

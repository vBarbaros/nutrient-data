#!/bin/bash

# Copy all JSON files from /api/v1/data to /docs/api/v1
mkdir -p docs/api/v1

if [ -d "api/v1/data" ]; then
    cp api/v1/data/*.json docs/api/v1/ 2>/dev/null
    echo "✓ Copied data files to docs/api/v1/"
else
    echo "✗ No api/v1/data directory found"
fi

echo "API generation complete!"

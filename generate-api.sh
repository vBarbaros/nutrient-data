#!/bin/bash

mkdir -p docs/api/v1

if [ -d "api/v1/data" ]; then
    cp api/v1/data/*.json docs/api/v1/ 2>/dev/null
    echo "✓ Copied data files"
fi

if [ -f "api/v1/list.json" ]; then
    cp api/v1/list.json docs/api/v1/
    echo "✓ Copied list.json"
fi

if [ -f "api/human-daily-needs.json" ]; then
    cp api/human-daily-needs.json docs/api/
    echo "✓ Copied human-daily-needs.json"
fi

echo "API generation complete!"

#!/bin/bash

mkdir -p public/v1
mkdir -p docs/v1

if [ -d "api/v1/data" ]; then
    cp api/v1/data/*.json public/v1/ 2>/dev/null
    cp api/v1/data/*.json docs/v1/ 2>/dev/null
    echo "✓ Copied data files"
fi

if [ -f "api/v1/list.json" ]; then
    cp api/v1/list.json public/v1/
    cp api/v1/list.json docs/v1/
    echo "✓ Copied list.json"
fi

if [ -f "api/human-daily-needs.json" ]; then
    cp api/human-daily-needs.json public/
    cp api/human-daily-needs.json docs/
    echo "✓ Copied human-daily-needs.json"
fi

if [ -f "api/statements.json" ]; then
    cp api/statements.json public/
    cp api/statements.json docs/
    echo "✓ Copied statements.json"
fi

if [ -f "api/citations.json" ]; then
    cp api/citations.json public/
    cp api/citations.json docs/
    echo "✓ Copied citations.json"
fi

echo "API generation complete!"

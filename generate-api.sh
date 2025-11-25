#!/bin/bash

# Generate API files from source data
SOURCE_DIR="data/source"
API_DIR="api/v1"

# Create API directories
mkdir -p "$API_DIR/nutrients"
mkdir -p "$API_DIR/foods"

# Process nutrients
if [ -f "$SOURCE_DIR/nutrients.json" ]; then
    # Copy full list
    cp "$SOURCE_DIR/nutrients.json" "$API_DIR/nutrients/list.json"
    
    # Generate individual nutrient files
    jq -c '.[]' "$SOURCE_DIR/nutrients.json" | while read item; do
        id=$(echo "$item" | jq -r '.id')
        echo "$item" > "$API_DIR/nutrients/$id.json"
    done
    echo "✓ Generated nutrient API files"
fi

# Process foods
if [ -f "$SOURCE_DIR/foods.json" ]; then
    # Copy full list
    cp "$SOURCE_DIR/foods.json" "$API_DIR/foods/list.json"
    
    # Generate individual food files
    jq -c '.[]' "$SOURCE_DIR/foods.json" | while read item; do
        id=$(echo "$item" | jq -r '.id')
        echo "$item" > "$API_DIR/foods/$id.json"
    done
    echo "✓ Generated food API files"
fi

# Copy API to docs if it exists
if [ -d "docs" ]; then
    cp -r api docs/
    echo "✓ Copied API to docs folder"
fi

echo "API generation complete!"

# nutrient-data

Static API and visualization for nutrient data, hosted on GitHub Pages.

## Project Structure

```
/data/source/          # Raw source data files (add your JSON here)
  nutrients.json       # Array of nutrient objects
  foods.json           # Array of food objects
/api/v1/               # Generated API endpoints (static JSON)
  /nutrients/          
    list.json          # All nutrients
    {id}.json          # Individual nutrient by ID
  /foods/              
    list.json          # All foods
    {id}.json          # Individual food by ID
/public/               # Visualization website
  index.html
  app.js
generate-api.sh        # Script to generate API files
```

## Usage

### 1. Add Source Data

Create JSON files in `/data/source/`:

**nutrients.json** - Array of nutrient objects:
```json
[
  {"id": 1, "name": "Vitamin A", "unit": "mcg"},
  {"id": 2, "name": "Vitamin C", "unit": "mg"}
]
```

**foods.json** - Array of food objects:
```json
[
  {"id": 1, "name": "Apple", "calories": 95},
  {"id": 2, "name": "Banana", "calories": 105}
]
```

### 2. Generate API Files

Run the generation script:
```bash
./generate-api.sh
```

This will:
- Create `/api/v1/nutrients/list.json` and individual files per nutrient
- Create `/api/v1/foods/list.json` and individual files per food

### 3. Deploy to GitHub Pages

1. Push to GitHub
2. Go to Settings → Pages
3. Set source to main branch, root directory
4. Save

## API Endpoints

Once deployed, access via:

- `https://yourusername.github.io/nutrient-data/api/v1/nutrients/list.json`
- `https://yourusername.github.io/nutrient-data/api/v1/nutrients/1.json`
- `https://yourusername.github.io/nutrient-data/api/v1/foods/list.json`
- `https://yourusername.github.io/nutrient-data/api/v1/foods/1.json`

## Visualization

Access the web visualization at:
- `https://yourusername.github.io/nutrient-data/public/`

## Requirements

- `jq` command-line JSON processor (install: `brew install jq` on macOS)

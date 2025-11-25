# Project Structure

## Current Structure

```
/api/v1/data/          # Source data (JSON files)
  apple.json
  banana.json
  ...
/src/                  # React app source
  App.jsx
  main.jsx
  index.css
/docs/                 # Built site (committed to repo)
  index.html
  assets/
  /api/v1/            # Generated API endpoints
    apple.json
    banana.json
    ...
```

## Workflow

1. **Add/edit data** in `/api/v1/data/` directory
2. **Run build**: `npm run build`
3. **Generate API**: `./generate-api.sh` (copies `/api/v1/data/*.json` to `/docs/api/v1/`)
4. **Commit**: `git add docs/ && git commit -m "Update data"`
5. **Push**: `git push`

## Benefits

- Versioned API structure from the start
- Clear separation: source in `/api/v1/data/`, deployed in `/docs/api/v1/`
- Easy to add v2 later: just create `/api/v2/data/`

# nutrient-data

A React-based data visualization and static REST API for nutrient and food information, designed to be hosted on GitHub Pages. This project allows you to maintain structured data in JSON format and automatically generates API endpoints while providing a clean web interface for visualization.

## Project Structure

```
/api/v1/data/          # Your source data (add JSON files here)
  apple.json
  banana.json
/src/                  # React source code
  App.jsx
  main.jsx
  index.css
/docs/                 # Built React app + API (committed to repo)
  /api/v1/             # Generated API endpoints
generate-api.sh        # Script to copy data to docs/api/v1
```

## Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Add your data** to `/api/v1/data/` directory as JSON files

3. **Run development server:**
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

## Deploy to GitHub Pages

1. **Update `vite.config.js`** - Change `base` to match your repo name:
```javascript
base: '/your-repo-name/',
```

2. **Build and generate API:**
```bash
npm run build
./generate-api.sh
```

3. **Commit and push:**
```bash
git add docs/
git commit -m "Build for GitHub Pages"
git push
```

4. **Configure GitHub Pages:**
- Go to repo Settings → Pages
- Source: "Deploy from a branch"
- Branch: "main", Folder: "/docs"
- Save

5. **Access your site:**
- Visualization: `https://yourusername.github.io/your-repo-name/`
- API: `https://yourusername.github.io/your-repo-name/api/v1/apple.json`

## API Usage

All JSON files in `/api/v1/data/` are available as API endpoints:

```javascript
// Fetch apple data
fetch('https://yourusername.github.io/your-repo-name/api/v1/apple.json')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Requirements

- Node.js & npm

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `./generate-api.sh` - Copy data files to docs/api/v1

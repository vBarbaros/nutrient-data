const API_BASE = '../api/v1';

async function loadNutrients() {
    try {
        const res = await fetch(`${API_BASE}/nutrients/list.json`);
        const data = await res.json();
        const container = document.getElementById('nutrients-list');
        container.innerHTML = data.map(item => 
            `<div class="card">
                <h3>${item.name}</h3>
                <p>Unit: ${item.unit}</p>
            </div>`
        ).join('');
    } catch (err) {
        document.getElementById('nutrients-list').innerHTML = '<p>No data available</p>';
    }
}

async function loadFoods() {
    try {
        const res = await fetch(`${API_BASE}/foods/list.json`);
        const data = await res.json();
        const container = document.getElementById('foods-list');
        container.innerHTML = data.map(item => 
            `<div class="card">
                <h3>${item.name}</h3>
                <p>Calories: ${item.calories}</p>
            </div>`
        ).join('');
    } catch (err) {
        document.getElementById('foods-list').innerHTML = '<p>No data available</p>';
    }
}

loadNutrients();
loadFoods();

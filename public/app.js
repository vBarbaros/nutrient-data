// Fetch and display nutrient data
fetch('../api/v1/nutrients/list.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('app').innerHTML = JSON.stringify(data, null, 2);
    });

import { useState, useEffect } from 'react'

const API_BASE = '/nutrient-data/api/v1'

function App() {
  const [nutrients, setNutrients] = useState([])
  const [foods, setFoods] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/nutrients/list.json`)
      .then(res => res.json())
      .then(setNutrients)
      .catch(() => setNutrients([]))

    fetch(`${API_BASE}/foods/list.json`)
      .then(res => res.json())
      .then(setFoods)
      .catch(() => setFoods([]))
  }, [])

  return (
    <>
      <header>
        <h1>Nutrient Data Visualization</h1>
      </header>
      
      <main>
        <section>
          <h2>Nutrients</h2>
          <div className="grid">
            {nutrients.length ? nutrients.map(item => (
              <div key={item.id} className="card">
                <h3>{item.name}</h3>
                <p>Unit: {item.unit}</p>
              </div>
            )) : <p>No data available</p>}
          </div>
        </section>
        
        <section>
          <h2>Foods</h2>
          <div className="grid">
            {foods.length ? foods.map(item => (
              <div key={item.id} className="card">
                <h3>{item.name}</h3>
                <p>Calories: {item.calories}</p>
              </div>
            )) : <p>No data available</p>}
          </div>
        </section>
      </main>
    </>
  )
}

export default App

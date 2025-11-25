import { useState, useEffect } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('apple')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [combinedMode, setCombinedMode] = useState(false)
  const [showDailyNeeds, setShowDailyNeeds] = useState(false)
  const [compareItems, setCompareItems] = useState([])
  const [compareData, setCompareData] = useState({})
  const [servingSizes, setServingSizes] = useState({})
  const [dailyNeeds, setDailyNeeds] = useState(null)

  useEffect(() => {
    fetch('/human-daily-needs.json')
      .then(res => res.json())
      .then(data => setDailyNeeds(data.dailyNeeds))
      .catch(err => console.error('Failed to load daily needs:', err))
  }, [])

  useEffect(() => {
    fetch('/api/v1/list.json')
      .then(res => res.json())
      .then(list => {
        const itemNames = list.map(item => item.name).sort()
        setItems(itemNames)
      })
      .catch(err => console.error('Failed to load items list:', err))
  }, [])

  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (!selected) return
    
    fetch(`/api/v1/${selected}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setData(data)
        setError(null)
      })
      .catch(err => {
        setError(err.message)
        setData(null)
      })
  }, [selected])

  const toggleCompareItem = (item) => {
    if (compareItems.includes(item)) {
      setCompareItems(compareItems.filter(i => i !== item))
      const newSizes = { ...servingSizes }
      delete newSizes[item]
      setServingSizes(newSizes)
    } else {
      setCompareItems([...compareItems, item])
      setServingSizes({ ...servingSizes, [item]: 100 })
      fetch(`/api/v1/${item}.json`)
        .then(res => res.json())
        .then(data => {
          setCompareData(prev => ({ ...prev, [item]: data[item] }))
        })
    }
  }

  const updateServingSize = (item, size) => {
    setServingSizes({ ...servingSizes, [item]: Math.max(0, size) })
  }

  const getCombinedData = () => {
    if (compareItems.length === 0) return null

    const combined = {
      mainElements: {
        calories: { value: 0, unit: 'kcal' },
        water: { value: 0, unit: 'g' },
        protein: { value: 0, unit: 'g' },
        carbohydrates: { value: 0, unit: 'g' },
        sugar: { value: 0, unit: 'g' },
        fiber: { value: 0, unit: 'g' },
        fat: { value: 0, unit: 'g' }
      },
      vitamins: {
        vitaminC: { value: 0, unit: 'mg' },
        vitaminK: { value: 0, unit: 'mcg' },
        vitaminB6: { value: 0, unit: 'mg' },
        vitaminE: { value: 0, unit: 'mg' },
        folate: { value: 0, unit: 'mcg' }
      },
      microelements: {
        potassium: { value: 0, unit: 'mg' },
        magnesium: { value: 0, unit: 'mg' },
        calcium: { value: 0, unit: 'mg' },
        phosphorus: { value: 0, unit: 'mg' },
        iron: { value: 0, unit: 'mg' },
        zinc: { value: 0, unit: 'mg' },
        manganese: { value: 0, unit: 'mg' }
      }
    }

    compareItems.forEach(item => {
      const itemData = compareData[item]
      if (!itemData) return

      const multiplier = (servingSizes[item] || 100) / 100

      Object.keys(combined.mainElements).forEach(key => {
        combined.mainElements[key].value += itemData.mainElements[key].value * multiplier
      })

      Object.keys(combined.vitamins).forEach(key => {
        const val = itemData.vitamins[key].value
        if (val !== null) {
          combined.vitamins[key].value += val * multiplier
        }
      })

      Object.keys(combined.microelements).forEach(key => {
        combined.microelements[key].value += itemData.microelements[key].value * multiplier
      })
    })

    Object.keys(combined.mainElements).forEach(key => {
      combined.mainElements[key].value = Math.round(combined.mainElements[key].value * 100) / 100
    })
    Object.keys(combined.vitamins).forEach(key => {
      combined.vitamins[key].value = Math.round(combined.vitamins[key].value * 100) / 100
    })
    Object.keys(combined.microelements).forEach(key => {
      combined.microelements[key].value = Math.round(combined.microelements[key].value * 100) / 100
    })

    return combined
  }

  const getDelta = (current, daily) => {
    if (!daily) return null
    const percentage = Math.round((current / daily) * 100)
    return { percentage, isOver: current >= daily }
  }

  const renderValueWithDelta = (current, dailyValue, unit) => {
    if (!showDailyNeeds || !dailyValue) {
      return `${current}${unit}`
    }

    const delta = getDelta(current, dailyValue)
    if (!delta) return `${current}${unit}`

    return (
      <span className={delta.isOver ? 'over-daily' : 'under-daily'}>
        {current}{unit}
        <span className="delta">
          {delta.isOver ? '↑' : '↓'} ({delta.percentage}%)
        </span>
      </span>
    )
  }

  const itemData = data?.[selected]
  const combinedData = getCombinedData()

  return (
    <>
      <header>
        <h1>Nutrient Data Visualization</h1>
      </header>
      
      <div className="container">
        <aside className="sidebar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sidebar-items">
            {filteredItems.map(item => (
              <div
                key={item}
                className={`sidebar-item ${!compareMode && !combinedMode && selected === item ? 'active' : ''} ${compareItems.includes(item) ? 'compare-selected' : ''}`}
                onClick={() => (compareMode || combinedMode) ? toggleCompareItem(item) : setSelected(item)}
              >
                {(compareMode || combinedMode) && <input type="checkbox" checked={compareItems.includes(item)} readOnly />}
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </div>
            ))}
          </div>
        </aside>
        
        <main>
          <div className="compare-controls">
            <button onClick={() => {
              setCompareMode(!compareMode)
              setCombinedMode(false)
              setShowDailyNeeds(false)
              if (compareMode) {
                setCompareItems([])
                setCompareData({})
                setServingSizes({})
              }
            }}>
              {compareMode ? 'Exit Compare' : 'Compare'}
            </button>
            <button onClick={() => {
              setCombinedMode(!combinedMode)
              setCompareMode(false)
              if (combinedMode) {
                setCompareItems([])
                setCompareData({})
                setServingSizes({})
                setShowDailyNeeds(false)
              }
            }}>
              {combinedMode ? 'Exit Combined' : 'Combined'}
            </button>
            {combinedMode && (
              <div className="toggle-container">
                <span className="toggle-label">Show Daily Needs</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={showDailyNeeds}
                    onChange={() => setShowDailyNeeds(!showDailyNeeds)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            )}
            {(compareMode || combinedMode) && compareItems.length > 0 && (
              <span>{compareItems.length} items selected</span>
            )}
          </div>

          {error && <p style={{color: 'red'}}>Error: {error}</p>}
          
          {combinedMode && compareItems.length > 0 ? (
            <div className="combined-view">
              <div className="serving-sizes">
                <h3>Serving Sizes (g)</h3>
                {compareItems.map(item => (
                  <div key={item} className="serving-control">
                    <label>{item.charAt(0).toUpperCase() + item.slice(1)}</label>
                    <div className="size-controls">
                      <input
                        type="number"
                        value={servingSizes[item] || 100}
                        onChange={(e) => updateServingSize(item, parseFloat(e.target.value) || 0)}
                        step="10"
                      />
                      <span className="unit">g</span>
                    </div>
                  </div>
                ))}
              </div>

              {combinedData && (
                <div className="nutrition-facts">
                  <div className="facts-header">
                    <h1>Nutrition Facts</h1>
                    <div className="serving-size">Combined: {compareItems.join(', ')}</div>
                  </div>
                  
                  <div className="facts-section thick-border">
                    <div className="facts-row bold">
                      <span>Calories</span>
                      <span>{renderValueWithDelta(combinedData.mainElements.calories.value, dailyNeeds?.mainElements.calories.value, '')}</span>
                    </div>
                  </div>

                  <div className="facts-section">
                    <div className="facts-label">Amount per serving</div>
                    
                    <div className="facts-row">
                      <span>Water</span>
                      <span>{renderValueWithDelta(combinedData.mainElements.water.value, dailyNeeds?.mainElements.water.value, combinedData.mainElements.water.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>Protein</span>
                      <span>{renderValueWithDelta(combinedData.mainElements.protein.value, dailyNeeds?.mainElements.protein.value, combinedData.mainElements.protein.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>Carbohydrates</span>
                      <span>{renderValueWithDelta(combinedData.mainElements.carbohydrates.value, dailyNeeds?.mainElements.carbohydrates.value, combinedData.mainElements.carbohydrates.unit)}</span>
                    </div>
                    <div className="facts-row indent">
                      <span>Sugar</span>
                      <span>{combinedData.mainElements.sugar.value}{combinedData.mainElements.sugar.unit}</span>
                    </div>
                    <div className="facts-row indent">
                      <span>Fiber</span>
                      <span>{renderValueWithDelta(combinedData.mainElements.fiber.value, dailyNeeds?.mainElements.fiber.value, combinedData.mainElements.fiber.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>Fat</span>
                      <span>{renderValueWithDelta(combinedData.mainElements.fat.value, dailyNeeds?.mainElements.fat.value, combinedData.mainElements.fat.unit)}</span>
                    </div>
                  </div>

                  <div className="facts-section thick-border">
                    <div className="facts-label bold">Vitamins</div>
                    <div className="facts-row">
                      <span>vitaminC</span>
                      <span>{renderValueWithDelta(combinedData.vitamins.vitaminC.value, dailyNeeds?.vitamins.vitaminC.value, combinedData.vitamins.vitaminC.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>vitaminK</span>
                      <span>{renderValueWithDelta(combinedData.vitamins.vitaminK.value, dailyNeeds?.vitamins.vitaminK.value, combinedData.vitamins.vitaminK.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>vitaminB6</span>
                      <span>{renderValueWithDelta(combinedData.vitamins.vitaminB6.value, dailyNeeds?.vitamins.vitaminB6.value, combinedData.vitamins.vitaminB6.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>vitaminE</span>
                      <span>{renderValueWithDelta(combinedData.vitamins.vitaminE.value, dailyNeeds?.vitamins.vitaminE.value, combinedData.vitamins.vitaminE.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>folate</span>
                      <span>{renderValueWithDelta(combinedData.vitamins.folate.value, dailyNeeds?.vitamins.folate.value, combinedData.vitamins.folate.unit)}</span>
                    </div>
                  </div>

                  <div className="facts-section">
                    <div className="facts-label bold">Minerals</div>
                    <div className="facts-row">
                      <span>potassium</span>
                      <span>{renderValueWithDelta(combinedData.microelements.potassium.value, dailyNeeds?.microelements.potassium.value, combinedData.microelements.potassium.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>magnesium</span>
                      <span>{renderValueWithDelta(combinedData.microelements.magnesium.value, dailyNeeds?.microelements.magnesium.value, combinedData.microelements.magnesium.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>calcium</span>
                      <span>{renderValueWithDelta(combinedData.microelements.calcium.value, dailyNeeds?.microelements.calcium.value, combinedData.microelements.calcium.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>phosphorus</span>
                      <span>{renderValueWithDelta(combinedData.microelements.phosphorus.value, dailyNeeds?.microelements.phosphorus.value, combinedData.microelements.phosphorus.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>iron</span>
                      <span>{renderValueWithDelta(combinedData.microelements.iron.value, dailyNeeds?.microelements.iron.value, combinedData.microelements.iron.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>zinc</span>
                      <span>{renderValueWithDelta(combinedData.microelements.zinc.value, dailyNeeds?.microelements.zinc.value, combinedData.microelements.zinc.unit)}</span>
                    </div>
                    <div className="facts-row">
                      <span>manganese</span>
                      <span>{renderValueWithDelta(combinedData.microelements.manganese.value, dailyNeeds?.microelements.manganese.value, combinedData.microelements.manganese.unit)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : compareMode && compareItems.length > 0 ? (
            <div className="compare-table">
              <table>
                <thead>
                  <tr>
                    <th>Nutrient</th>
                    {compareItems.map(item => (
                      <th key={item}>
                        <div className="header-item-name">{item.charAt(0).toUpperCase() + item.slice(1)}</div>
                        <div className="header-controls">
                          <input
                            type="number"
                            value={servingSizes[item] || 100}
                            onChange={(e) => updateServingSize(item, parseFloat(e.target.value) || 0)}
                            step="10"
                          />
                          <span className="unit">g</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="section-header">
                    <td colSpan={compareItems.length + 1}><strong>Main Elements</strong></td>
                  </tr>
                  <tr>
                    <td>Calories</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.mainElements.calories.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Water (g)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.mainElements.water.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Protein (g)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.mainElements.protein.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Carbs (g)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.mainElements.carbohydrates.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Sugar (g)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.mainElements.sugar.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Fiber (g)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.mainElements.fiber.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Fat (g)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.mainElements.fat.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr className="section-header">
                    <td colSpan={compareItems.length + 1}><strong>Vitamins</strong></td>
                  </tr>
                  <tr>
                    <td>Vitamin C (mg)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      const value = compareData[item]?.vitamins.vitaminC.value
                      return <td key={item}>{value ? Math.round(value * multiplier * 100) / 100 : 'N/A'}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Vitamin K (mcg)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      const value = compareData[item]?.vitamins.vitaminK.value
                      return <td key={item}>{value ? Math.round(value * multiplier * 100) / 100 : 'N/A'}</td>
                    })}
                  </tr>
                  <tr className="section-header">
                    <td colSpan={compareItems.length + 1}><strong>Minerals</strong></td>
                  </tr>
                  <tr>
                    <td>Potassium (mg)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.microelements.potassium.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Calcium (mg)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.microelements.calcium.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                  <tr>
                    <td>Iron (mg)</td>
                    {compareItems.map(item => {
                      const multiplier = (servingSizes[item] || 100) / 100
                      return <td key={item}>{Math.round(compareData[item]?.microelements.iron.value * multiplier * 100) / 100}</td>
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : itemData && !compareMode && !combinedMode ? (
            <div className="nutrition-facts">
              <div className="facts-header">
                <h1>Nutrition Facts</h1>
                <div className="serving-size">Serving size 100g</div>
              </div>
              
              <div className="facts-section thick-border">
                <div className="facts-row bold">
                  <span>Calories</span>
                  <span>{itemData.mainElements.calories.value}</span>
                </div>
              </div>

              <div className="facts-section">
                <div className="facts-label">Amount per serving</div>
                
                <div className="facts-row">
                  <span>Water</span>
                  <span>{itemData.mainElements.water.value}{itemData.mainElements.water.unit}</span>
                </div>
                <div className="facts-row">
                  <span>Protein</span>
                  <span>{itemData.mainElements.protein.value}{itemData.mainElements.protein.unit}</span>
                </div>
                <div className="facts-row">
                  <span>Carbohydrates</span>
                  <span>{itemData.mainElements.carbohydrates.value}{itemData.mainElements.carbohydrates.unit}</span>
                </div>
                <div className="facts-row indent">
                  <span>Sugar</span>
                  <span>{itemData.mainElements.sugar.value}{itemData.mainElements.sugar.unit}</span>
                </div>
                <div className="facts-row indent">
                  <span>Fiber</span>
                  <span>{itemData.mainElements.fiber.value}{itemData.mainElements.fiber.unit}</span>
                </div>
                <div className="facts-row">
                  <span>Fat</span>
                  <span>{itemData.mainElements.fat.value}{itemData.mainElements.fat.unit}</span>
                </div>
              </div>

              <div className="facts-section thick-border">
                <div className="facts-label bold">Vitamins</div>
                {Object.entries(itemData.vitamins).map(([key, val]) => (
                  <div key={key} className="facts-row">
                    <span>{key}</span>
                    <span>{val.value !== null ? `${val.value}${val.unit}` : 'N/A'}</span>
                  </div>
                ))}
              </div>

              <div className="facts-section">
                <div className="facts-label bold">Minerals</div>
                {Object.entries(itemData.microelements).map(([key, val]) => (
                  <div key={key} className="facts-row">
                    <span>{key}</span>
                    <span>{val.value !== null ? `${val.value}${val.unit}` : 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (compareMode || combinedMode) ? (
            <p>Select items from the sidebar to {compareMode ? 'compare' : 'combine'}</p>
          ) : !error && <p>Loading...</p>}
        </main>
      </div>
    </>
  )
}

export default App

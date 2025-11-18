import { useEffect, useState } from 'react'

function FoodList({ refreshFlag }) {
  const [foods, setFoods] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/foods?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setFoods(data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [refreshFlag])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search foods" className="flex-1 px-3 py-2 rounded bg-slate-800 text-blue-100 border border-slate-700 outline-none" />
        <button onClick={load} className="px-4 py-2 rounded bg-slate-700 text-blue-100">Search</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {foods.map(f => (
          <div key={f._id} className="p-4 rounded-lg border border-slate-700 bg-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">{f.name}</h4>
            </div>
            <p className="text-blue-200 text-sm">Per 100g: {f.calories_per_100g} kcal • {f.protein_per_100g}p • {f.carbs_per_100g}c • {f.fat_per_100g}f</p>
          </div>
        ))}
        {foods.length === 0 && !loading && (
          <p className="text-blue-300/70">No foods yet. Add some above.</p>
        )}
      </div>
    </div>
  )
}

export default FoodList

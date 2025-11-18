import { useEffect, useState } from 'react'

function MealHistory() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/meals`)
      const data = await res.json()
      setMeals(data)
    } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        {meals.map(m => (
          <div key={m._id} className="p-4 rounded-lg border border-slate-700 bg-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">{m.name}</h4>
              <div className="text-blue-200 text-sm">{m.total_calories} kcal • P {m.total_protein}g • C {m.total_carbs}g • F {m.total_fat}g</div>
            </div>
            <div className="text-blue-300/80 text-sm">
              {m.items && m.items.map((it, idx)=>(
                <span key={idx} className="inline-block mr-2">{it.name} ({it.grams}g)</span>
              ))}
            </div>
          </div>
        ))}
        {meals.length===0 && !loading && (
          <p className="text-blue-300/70">No saved meals yet.</p>
        )}
      </div>
    </div>
  )
}

export default MealHistory

import { useEffect, useMemo, useState } from 'react'

function MealCalculator() {
  const [rows, setRows] = useState([{ name: '', grams: '', cal100: '', pro100: '', carb100: '', fat100: '' }])
  const [loading, setLoading] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const totals = useMemo(() => {
    let t = { calories: 0, protein: 0, carbs: 0, fat: 0 }
    rows.forEach(r => {
      const grams = parseFloat(r.grams || 0)
      const factor = grams / 100
      t.calories += parseFloat(r.cal100 || 0) * factor
      t.protein += parseFloat(r.pro100 || 0) * factor
      t.carbs += parseFloat(r.carb100 || 0) * factor
      t.fat += parseFloat(r.fat100 || 0) * factor
    })
    return Object.fromEntries(Object.entries(t).map(([k,v]) => [k, Math.round(v*100)/100]))
  }, [rows])

  const addRow = () => setRows([...rows, { name: '', grams: '', cal100: '', pro100: '', carb100: '', fat100: '' }])
  const removeRow = (idx) => setRows(rows.filter((_,i)=>i!==idx))

  const update = (idx, key, val) => {
    const copy = [...rows]
    copy[idx] = { ...copy[idx], [key]: val }
    setRows(copy)
  }

  const submitCalc = async () => {
    setLoading(true); setSavedMessage('')
    try {
      const items = rows.filter(r=>parseFloat(r.grams)>0).map(r => ({
        name: r.name || 'Item',
        grams: parseFloat(r.grams||0),
        calories_per_100g: parseFloat(r.cal100||0),
        protein_per_100g: parseFloat(r.pro100||0),
        carbs_per_100g: parseFloat(r.carb100||0),
        fat_per_100g: parseFloat(r.fat100||0),
      }))
      const res = await fetch(`${baseUrl}/api/meals/calculate`, {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ items })
      })
      const data = await res.json()
      setSavedMessage(`Calculated: ${data.totals.calories} kcal, P ${data.totals.protein}g, C ${data.totals.carbs}g, F ${data.totals.fat}g`)
    } finally { setLoading(false) }
  }

  const submitSave = async () => {
    setLoading(true); setSavedMessage('')
    try {
      const items = rows.filter(r=>parseFloat(r.grams)>0).map(r => ({
        name: r.name || 'Item',
        grams: parseFloat(r.grams||0),
        calories_per_100g: parseFloat(r.cal100||0),
        protein_per_100g: parseFloat(r.pro100||0),
        carbs_per_100g: parseFloat(r.carb100||0),
        fat_per_100g: parseFloat(r.fat100||0),
      }))
      const res = await fetch(`${baseUrl}/api/meals/save`, {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ items, name: 'Meal' })
      })
      const data = await res.json()
      setSavedMessage(`Saved! Total ${data.totals.calories} kcal`)
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-blue-100">
          <thead className="text-blue-300">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Grams</th>
              <th className="text-left p-2">Cal/100g</th>
              <th className="text-left p-2">Protein/100g</th>
              <th className="text-left p-2">Carbs/100g</th>
              <th className="text-left p-2">Fat/100g</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-slate-700/60">
                <td className="p-2"><input value={r.name} onChange={e=>update(idx,'name',e.target.value)} placeholder="Chicken" className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 outline-none" /></td>
                <td className="p-2"><input type="number" step="1" value={r.grams} onChange={e=>update(idx,'grams',e.target.value)} placeholder="150" className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700 outline-none" /></td>
                <td className="p-2"><input type="number" step="0.1" value={r.cal100} onChange={e=>update(idx,'cal100',e.target.value)} placeholder="165" className="w-28 px-2 py-1 rounded bg-slate-800 border border-slate-700 outline-none" /></td>
                <td className="p-2"><input type="number" step="0.1" value={r.pro100} onChange={e=>update(idx,'pro100',e.target.value)} placeholder="31" className="w-28 px-2 py-1 rounded bg-slate-800 border border-slate-700 outline-none" /></td>
                <td className="p-2"><input type="number" step="0.1" value={r.carb100} onChange={e=>update(idx,'carb100',e.target.value)} placeholder="0" className="w-28 px-2 py-1 rounded bg-slate-800 border border-slate-700 outline-none" /></td>
                <td className="p-2"><input type="number" step="0.1" value={r.fat100} onChange={e=>update(idx,'fat100',e.target.value)} placeholder="3.6" className="w-28 px-2 py-1 rounded bg-slate-800 border border-slate-700 outline-none" /></td>
                <td className="p-2"><button onClick={()=>removeRow(idx)} className="text-red-300 hover:text-red-200">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={addRow} className="px-3 py-2 rounded bg-slate-700 text-blue-100">Add Row</button>
        <div className="ml-auto text-blue-200">Totals: {totals.calories} kcal • P {totals.protein}g • C {totals.carbs}g • F {totals.fat}g</div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={submitCalc} disabled={loading} className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white">Calculate</button>
        <button onClick={submitSave} disabled={loading} className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white">Save Meal</button>
        {savedMessage && <span className="text-blue-200">{savedMessage}</span>}
      </div>
    </div>
  )
}

export default MealCalculator

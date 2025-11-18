import { useState } from 'react'

function FoodForm({ onCreated }) {
  const [name, setName] = useState('')
  const [cal, setCal] = useState('')
  const [pro, setPro] = useState('')
  const [carb, setCarb] = useState('')
  const [fat, setFat] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/foods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          calories_per_100g: parseFloat(cal || 0),
          protein_per_100g: parseFloat(pro || 0),
          carbs_per_100g: parseFloat(carb || 0),
          fat_per_100g: parseFloat(fat || 0),
        })
      })
      if (!res.ok) throw new Error('Failed to create food')
      setName(''); setCal(''); setPro(''); setCarb(''); setFat('')
      onCreated && onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-6 gap-3">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="col-span-2 md:col-span-2 px-3 py-2 rounded bg-slate-800 text-blue-100 border border-slate-700 outline-none" required />
      <input value={cal} onChange={e=>setCal(e.target.value)} placeholder="Cal/100g" type="number" step="0.1" className="px-3 py-2 rounded bg-slate-800 text-blue-100 border border-slate-700 outline-none" required />
      <input value={pro} onChange={e=>setPro(e.target.value)} placeholder="Protein/100g" type="number" step="0.1" className="px-3 py-2 rounded bg-slate-800 text-blue-100 border border-slate-700 outline-none" required />
      <input value={carb} onChange={e=>setCarb(e.target.value)} placeholder="Carbs/100g" type="number" step="0.1" className="px-3 py-2 rounded bg-slate-800 text-blue-100 border border-slate-700 outline-none" required />
      <input value={fat} onChange={e=>setFat(e.target.value)} placeholder="Fat/100g" type="number" step="0.1" className="px-3 py-2 rounded bg-slate-800 text-blue-100 border border-slate-700 outline-none" required />
      <button disabled={loading} className="col-span-2 md:col-span-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded px-4 py-2">{loading ? 'Saving...' : 'Add Food'}</button>
      {error && <p className="col-span-2 text-red-400 text-sm">{error}</p>}
    </form>
  )
}

export default FoodForm

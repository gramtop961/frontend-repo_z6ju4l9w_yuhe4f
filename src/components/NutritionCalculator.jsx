import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export default function NutritionCalculator() {
  const [foods, setFoods] = useState([]);
  const [items, setItems] = useState([
    { id: crypto.randomUUID(), food_id: "", name: "", quantity_g: 100, custom: false, calories_per_100g: "", protein_per_100g: "", carbs_per_100g: "", fat_per_100g: "" },
  ]);
  const [mealName, setMealName] = useState("My Meal");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFoods() {
      try {
        const r = await fetch(`${BACKEND_URL}/api/foods`);
        const data = await r.json();
        setFoods(data || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadFoods();
  }, []);

  const totals = useMemo(() => {
    if (!result) return null;
    return result.totals;
  }, [result]);

  function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), food_id: "", name: "", quantity_g: 100, custom: false, calories_per_100g: "", protein_per_100g: "", carbs_per_100g: "", fat_per_100g: "" },
    ]);
  }

  function removeRow(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: mealName,
        items: items.map((it) => {
          if (!it.custom && it.food_id) {
            return { food_id: it.food_id, quantity_g: Number(it.quantity_g) };
          }
          return {
            name: it.name || "Custom",
            quantity_g: Number(it.quantity_g),
            calories_per_100g: Number(it.calories_per_100g || 0),
            protein_per_100g: Number(it.protein_per_100g || 0),
            carbs_per_100g: Number(it.carbs_per_100g || 0),
            fat_per_100g: Number(it.fat_per_100g || 0),
          };
        }),
      };
      const r = await fetch(`${BACKEND_URL}/api/calc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Failed to calculate");
      const data = await r.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function seedFood(e) {
    e.preventDefault();
    try {
      const samples = [
        { name: "Chicken Breast (raw)", calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6 },
        { name: "White Rice (cooked)", calories_per_100g: 130, protein_per_100g: 2.7, carbs_per_100g: 28, fat_per_100g: 0.3 },
        { name: "Broccoli (raw)", calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4 },
        { name: "Olive Oil", calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100 },
      ];
      for (const f of samples) {
        await fetch(`${BACKEND_URL}/api/foods`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(f),
        });
      }
      const r = await fetch(`${BACKEND_URL}/api/foods`);
      const data = await r.json();
      setFoods(data || []);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Nutrition Calculator</h1>
        <p className="text-blue-200/80 mt-2">Build a meal and instantly see calories, protein, carbs, and fat.</p>
      </div>

      <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <input
            className="w-full sm:w-1/2 bg-slate-900/60 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Meal name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={addRow}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              Add item
            </button>
            <button
              onClick={calculate}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
            <button
              onClick={seedFood}
              className="px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition"
            >
              Load sample foods
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-blue-100/90">
            <thead>
              <tr className="text-blue-300/80">
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Food / Name</th>
                <th className="py-2 pr-4">Qty (g)</th>
                <th className="py-2 pr-4">kcal/100g</th>
                <th className="py-2 pr-4">P/100g</th>
                <th className="py-2 pr-4">C/100g</th>
                <th className="py-2 pr-4">F/100g</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const isCustom = row.custom || !row.food_id;
                return (
                  <tr key={row.id} className="border-t border-slate-700/60">
                    <td className="py-2 pr-4">
                      <select
                        className="bg-slate-900/60 border border-slate-700 text-white rounded px-2 py-1"
                        value={isCustom ? "custom" : "food"}
                        onChange={(e) => updateItem(row.id, { custom: e.target.value === "custom" })}
                      >
                        <option value="food">Food</option>
                        <option value="custom">Custom</option>
                      </select>
                    </td>

                    <td className="py-2 pr-4">
                      {isCustom ? (
                        <input
                          className="bg-slate-900/60 border border-slate-700 text-white rounded px-2 py-1 w-56"
                          placeholder="Item name"
                          value={row.name}
                          onChange={(e) => updateItem(row.id, { name: e.target.value })}
                        />
                      ) : (
                        <select
                          className="bg-slate-900/60 border border-slate-700 text-white rounded px-2 py-1 w-56"
                          value={row.food_id}
                          onChange={(e) => updateItem(row.id, { food_id: e.target.value })}
                        >
                          <option value="">Select food...</option>
                          {foods.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td className="py-2 pr-4">
                      <input
                        type="number"
                        min="1"
                        className="bg-slate-900/60 border border-slate-700 text-white rounded px-2 py-1 w-24"
                        value={row.quantity_g}
                        onChange={(e) => updateItem(row.id, { quantity_g: e.target.value })}
                      />
                    </td>

                    {["calories_per_100g", "protein_per_100g", "carbs_per_100g", "fat_per_100g"].map((key) => (
                      <td key={key} className="py-2 pr-4">
                        <input
                          type="number"
                          step="any"
                          disabled={!isCustom}
                          className="bg-slate-900/60 border border-slate-700 text-white rounded px-2 py-1 w-28 disabled:opacity-50"
                          value={row[key]}
                          onChange={(e) => updateItem(row.id, { [key]: e.target.value })}
                        />
                      </td>
                    ))}

                    <td className="py-2 pr-4">
                      <button onClick={() => removeRow(row.id)} className="px-2 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded">Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="text-red-400 bg-red-900/20 border border-red-700/30 p-3 rounded">{error}</div>
        )}

        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Calories" value={totals?.calories} unit="kcal" />
            <Stat label="Protein" value={totals?.protein} unit="g" />
            <Stat label="Carbs" value={totals?.carbs} unit="g" />
            <Stat label="Fat" value={totals?.fat} unit="g" />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4 text-center">
      <div className="text-blue-300 text-sm">{label}</div>
      <div className="text-white text-2xl font-semibold mt-1">
        {value !== undefined && value !== null ? value : "-"} <span className="text-blue-300 text-base">{unit}</span>
      </div>
    </div>
  );
}

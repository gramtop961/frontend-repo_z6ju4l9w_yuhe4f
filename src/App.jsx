import { useState } from 'react'
import Header from './components/Header'
import FoodForm from './components/FoodForm'
import FoodList from './components/FoodList'
import MealCalculator from './components/MealCalculator'
import MealHistory from './components/MealHistory'

function App() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [refreshFlag, setRefreshFlag] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'calculator' && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Meal Calculator</h2>
            <p className="text-blue-300/80">Enter items with nutrition per 100g and the grams you plan to eat. Totals update live, and you can save the meal.</p>
            <MealCalculator />
          </section>
        )}

        {activeTab === 'foods' && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Food Database</h2>
            <p className="text-blue-300/80">Add foods with nutrition per 100g, and browse/search the saved list.</p>
            <FoodForm onCreated={() => setRefreshFlag(v=>v+1)} />
            <FoodList refreshFlag={refreshFlag} />
          </section>
        )}

        {activeTab === 'history' && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Saved Meals</h2>
            <p className="text-blue-300/80">Browse previously saved meals.</p>
            <MealHistory />
          </section>
        )}
      </main>
    </div>
  )
}

export default App

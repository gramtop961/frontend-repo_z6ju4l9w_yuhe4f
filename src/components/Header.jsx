import { useState } from 'react'

function Header({ onTabChange, activeTab }) {
  const tabs = [
    { key: 'calculator', label: 'Calculator' },
    { key: 'foods', label: 'Foods' },
    { key: 'history', label: 'History' },
  ]

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-slate-900/60 border-b border-slate-700/50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-xl font-semibold text-white">Nutrition Planner</h1>
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-200 hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header

import { useState } from 'react';
import { searchFoods } from '../lib/foodDatabase';
import { useUser } from '../lib/UserContext';
import { Search, X, Plus } from 'lucide-react';

export default function FoodSearchModal({ isOpen, onClose, onAdd, mealType = 'snack' }) {
  const { profile } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [grams, setGrams] = useState({});

  const handleSearch = (q) => {
    setQuery(q);
    setResults(searchFoods(q, profile.healthConditions));
  };

  const handleAdd = (food) => {
    const g = grams[food.id] || 100;
    onAdd(food, g, mealType);
    setResults(results.filter(r => r.id !== food.id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg card max-h-[80vh] flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Add Food</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark-600 transition-colors">
            <X className="w-5 h-5 text-dark-300" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
          <input
            type="text"
            className="input-field pl-11"
            placeholder="Search foods (e.g., dal, paneer, roti)..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {results.length === 0 && query.length >= 2 && (
            <p className="text-center text-dark-300 py-8 text-sm">No foods found. Try a different search.</p>
          )}
          {query.length < 2 && (
            <p className="text-center text-dark-400 py-8 text-sm">Type at least 2 characters to search...</p>
          )}
          {results.map(food => {
            const g = grams[food.id] || 100;
            const multiplier = g / 100;
            return (
              <div key={food.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-700 hover:bg-dark-600 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{food.name}</p>
                  <p className="text-xs text-dark-300">
                    {Math.round(food.calories * multiplier)} cal ·
                    P: {Math.round(food.protein * multiplier)}g ·
                    C: {Math.round(food.carbs * multiplier)}g ·
                    F: {Math.round(food.fat * multiplier)}g
                  </p>
                  <p className="text-xs text-dark-400 mt-0.5">per 100g: {food.calories} cal</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      step="10"
                      className="w-20 bg-dark-800 border border-dark-500 rounded-lg px-2 py-1.5 text-center text-sm text-white outline-none focus:border-accent-primary pr-6"
                      value={g}
                      onChange={(e) => setGrams({ ...grams, [food.id]: parseFloat(e.target.value) || 100 })}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-400 text-xs">g</span>
                  </div>
                  <button
                    onClick={() => handleAdd(food)}
                    className="p-2 rounded-lg bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

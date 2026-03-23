import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '../lib/UserContext';
import { api } from '../lib/api';
import { motion } from 'framer-motion';
import {
  CalendarDays, RefreshCw, ChevronLeft, ChevronRight,
  Coffee, Sun, Moon, UtensilsCrossed, Plus, Loader2, AlertTriangle
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'lunch', label: 'Lunch', icon: Sun },
  { id: 'dinner', label: 'Dinner', icon: Moon },
  { id: 'snack', label: 'Snack', icon: UtensilsCrossed },
];

export default function MealPlanner() {
  const { targets, addMeal, profile } = useUser();
  const [selectedDay, setSelectedDay] = useState(0);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateMealPlan({
        calories: targets.calories || 2000,
        protein: targets.protein || 150,
        carbs: targets.carbs || 200,
        fat: targets.fat || 60,
        preferences: profile.goals || [],
        health_conditions: profile.healthConditions || []
      });
      setPlan(res.meal_plan || []);
    } catch (err) {
      setError("Failed to generate meal plan. Ensure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [targets, profile.goals, profile.healthConditions]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const dayPlan = plan[selectedDay];

  const dayCalories = useMemo(() => {
    if (!dayPlan || !dayPlan.meals) return 0;
    return Object.values(dayPlan.meals).flat().reduce((s, f) => s + f.calories, 0);
  }, [dayPlan]);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-accent-secondary" />
              <span className="gradient-text">Weekly Meal Plan</span>
            </h1>
            <p className="text-dark-200 mt-1">Indian meals auto-generated to hit your macro goals.</p>
          </div>
          <button onClick={fetchPlan} disabled={loading} className="btn-secondary flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Regenerate
          </button>
        </div>
      </motion.div>

      {loading && !plan.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-dark-300">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-accent-secondary" />
          <p>Generating personalized meal plan based on your health profile...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : plan.length > 0 ? (
        <>
          {/* Day Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {DAYS.map((day, i) => (
              <button
            key={day}
            onClick={() => setSelectedDay(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all ${
              selectedDay === i
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
            }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

      {/* Day navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
          disabled={selectedDay === 0}
          className="p-2 rounded-lg hover:bg-dark-700 text-dark-300 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">{dayPlan.day}</h2>
          <p className="text-sm text-dark-300">~{dayCalories} calories planned (per 100g each)</p>
        </div>
        <button
          onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))}
          disabled={selectedDay === 6}
          className="p-2 rounded-lg hover:bg-dark-700 text-dark-300 disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Meals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MEALS.map(meal => {
          const Icon = meal.icon;
          const items = dayPlan.meals[meal.id] || [];
          const mealCal = items.reduce((s, f) => s + f.calories, 0);

          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{meal.label}</h3>
                    <p className="text-xs text-dark-300">{mealCal} cal</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((food, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
                    <div>
                      <p className="text-sm font-medium">{food.name}</p>
                      <p className="text-xs text-dark-300">
                        {food.calories} cal · P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                        <span className="text-dark-400 ml-1">(per 100g)</span>
                      </p>
                    </div>
                    <button
                      onClick={() => addMeal(food, 100, meal.id)}
                      className="p-1.5 rounded-lg bg-green-accent/10 hover:bg-green-accent/20 text-green-accent transition-colors"
                      title="Log this meal (100g)"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Daily Summary */}
      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Daily Total</p>
            <p className="text-xs text-dark-300">Target: {targets.calories} cal</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold gradient-text">{dayCalories}</p>
          </div>
        </div>
      </div>
    </>
  ) : null}
    </div>
  );
}

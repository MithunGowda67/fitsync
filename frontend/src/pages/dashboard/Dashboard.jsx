import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import MacroRing from '../../components/MacroRing';
import MacroBar from '../../components/MacroBar';
import FoodSearchModal from '../../components/FoodSearchModal';
import HydrationWidget from '../../components/HydrationWidget';
import { motion } from 'framer-motion';
import {
  Plus, Trash2, Droplets, Dumbbell, Coffee, Sun, Moon, Apple,
  Flame, TrendingUp, Sparkles
} from 'lucide-react';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#ffab40' },
  { id: 'lunch', label: 'Lunch', icon: Sun, color: '#ffd740' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: '#a29bfe' },
  { id: 'snack', label: 'Snacks', icon: Apple, color: '#00e676' },
];

const EXERCISE_PRESETS = [
  { name: 'Running (30 min)', calories: 300, type: 'cardio' },
  { name: 'Walking (30 min)', calories: 150, type: 'cardio' },
  { name: 'Cycling (30 min)', calories: 260, type: 'cardio' },
  { name: 'Weight Training (45 min)', calories: 220, type: 'strength' },
  { name: 'Swimming (30 min)', calories: 250, type: 'cardio' },
  { name: 'Yoga (30 min)', calories: 120, type: 'flexibility' },
  { name: 'HIIT (20 min)', calories: 280, type: 'cardio' },
  { name: 'Jump Rope (15 min)', calories: 200, type: 'cardio' },
];

export default function Dashboard() {
  const {
    profile, targets, consumed, exerciseCalories,
    dailyLog, addMeal, removeMeal, addExercise, removeExercise,
  } = useUser();

  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [showExercisePanel, setShowExercisePanel] = useState(false);

  const netCalories = consumed.calories - exerciseCalories;
  const weightUnit = profile.unit === 'imperial' ? 'lbs' : 'kg';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* ──── Header ──── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px', lineHeight: 1.2 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span style={{ background: 'linear-gradient(135deg, #6c5ce7, #a29bfe, #74b9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {profile.name}
          </span>
        </h1>
        <p style={{ color: '#8888a8', fontSize: '14px' }}>Here's your nutrition overview for today.</p>
      </motion.div>

      {/* ──── Top Section: Calorie Ring + Macros ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5 mb-6">
        {/* Calorie Ring Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#12121a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '28px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MacroRing consumed={netCalories} target={targets.calories} />
          {exerciseCalories > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#00e676' }}>
              <Flame style={{ width: '14px', height: '14px' }} />
              {exerciseCalories} cal burned
            </div>
          )}
        </motion.div>

        {/* Macro Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#12121a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#b0b0c8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp style={{ width: '16px', height: '16px', color: '#a29bfe' }} />
            Macro Breakdown
          </h3>
          <MacroBar label="Protein" consumed={consumed.protein} target={targets.protein} color="protein" />
          <MacroBar label="Carbs" consumed={consumed.carbs} target={targets.carbs} color="carbs" />
          <MacroBar label="Fat" consumed={consumed.fat} target={targets.fat} color="fat" />
        </motion.div>
      </div>

      {/* ──── Quick Actions Row ──── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Log Food */}
        <button
          onClick={() => setFoodModalOpen(true)}
          style={{
            background: '#12121a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
            padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', transition: 'all 0.2s', color: 'white', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,230,118,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,230,118,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus style={{ width: '18px', height: '18px', color: '#00e676' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Log Food</span>
        </button>

        {/* Exercise */}
        <button
          onClick={() => setShowExercisePanel(!showExercisePanel)}
          style={{
            background: '#12121a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
            padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', transition: 'all 0.2s', color: 'white', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,171,64,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,171,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell style={{ width: '18px', height: '18px', color: '#ffab40' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Exercise</span>
        </button>

        {/* Water */}
        <button
          onClick={() => addWater(1)}
          style={{
            background: '#12121a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
            padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', transition: 'all 0.2s', color: 'white', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(79,195,247,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(79,195,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplets style={{ width: '18px', height: '18px', color: '#4fc3f7' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block' }}>Water</span>
            <span style={{ fontSize: '11px', color: '#5a5a7a' }}>{dailyLog.water} glasses</span>
          </div>
        </button>

        {/* Goal */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
          padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108,92,231,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: '18px', height: '18px', color: '#a29bfe' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', color: 'white' }}>Goal</span>
            <span style={{ fontSize: '11px', color: '#5a5a7a' }}>{targets.calories} cal/day</span>
          </div>
        </div>
      </div>

      {/* ──── Exercise Panel ──── */}
      {showExercisePanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: '#12121a', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px', marginBottom: '24px',
          }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#b0b0c8' }}>
            <Dumbbell style={{ width: '16px', height: '16px', color: '#ffab40' }} /> Quick Add Exercise
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {EXERCISE_PRESETS.map((ex) => (
              <button
                key={ex.name}
                onClick={() => addExercise(ex)}
                style={{
                  padding: '12px', borderRadius: '12px', background: '#1a1a2e', border: '1px solid #222240',
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', color: 'white', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#222240'; e.currentTarget.style.borderColor = 'rgba(255,171,64,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.borderColor = '#222240'; }}
              >
                <p style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
                <p style={{ fontSize: '12px', color: '#ffab40', marginTop: '4px' }}>-{ex.calories} cal</p>
              </button>
            ))}
          </div>
          {dailyLog.exercises.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '11px', color: '#5a5a7a', fontWeight: 600, marginBottom: '8px' }}>Today's Exercise</p>
              {dailyLog.exercises.map(ex => (
                <div key={ex.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: '10px', background: '#1a1a2e', marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '13px' }}>{ex.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#ffab40' }}>-{ex.calories} cal</span>
                    <button
                      onClick={() => removeExercise(ex.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d3d5c', padding: '4px' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ff5252')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#3d3d5c')}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ──── Food Diary — Meal Sections ──── */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#e8e8f0' }}>
          Food Diary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEAL_TYPES.map(meal => {
            const Icon = meal.icon;
            const mealItems = dailyLog.meals.filter(m => m.mealType === meal.id);
            const mealCal = mealItems.reduce((s, m) => s + (m.calories * m.grams / 100), 0);

            return (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#12121a',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px',
                  padding: '20px',
                }}
              >
                {/* Meal Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '10px',
                      background: `${meal.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: '16px', height: '16px', color: meal.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{meal.label}</h3>
                      <p style={{ fontSize: '11px', color: '#5a5a7a' }}>
                        {mealCal > 0 ? `${Math.round(mealCal)} cal` : 'No entries'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setActiveMealType(meal.id); setFoodModalOpen(true); }}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(108,92,231,0.1)',
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,92,231,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(108,92,231,0.1)')}
                  >
                    <Plus style={{ width: '16px', height: '16px', color: '#a29bfe' }} />
                  </button>
                </div>

                {/* Meal Items */}
                {mealItems.length === 0 ? (
                  <div style={{
                    padding: '20px', borderRadius: '12px', border: '1px dashed #222240',
                    textAlign: 'center', color: '#3d3d5c', fontSize: '12px',
                  }}>
                    Tap + to add {meal.label.toLowerCase()}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {mealItems.map(item => {
                      const mult = item.grams / 100;
                      return (
                        <div key={item.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 12px', borderRadius: '12px', background: '#1a1a2e',
                        }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </p>
                            <p style={{ fontSize: '11px', color: '#5a5a7a', marginTop: '2px' }}>
                              {Math.round(item.calories * mult)} cal ·
                              P: {Math.round(item.protein * mult)}g ·
                              C: {Math.round(item.carbs * mult)}g ·
                              F: {Math.round(item.fat * mult)}g
                              <span style={{ color: '#3d3d5c', marginLeft: '6px' }}>({item.grams}g)</span>
                            </p>
                          </div>
                          <button
                            onClick={() => removeMeal(item.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#3d3d5c', flexShrink: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ff5252')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#3d3d5c')}
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ──── Hydration Widget ──── */}
      <HydrationWidget />

      {/* ──── Food Search Modal ──── */}
      <FoodSearchModal
        isOpen={foodModalOpen}
        onClose={() => setFoodModalOpen(false)}
        onAdd={(food, grams) => addMeal(food, grams, activeMealType)}
        mealType={activeMealType}
      />
    </div>
  );
}

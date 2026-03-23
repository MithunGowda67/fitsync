import { useState, useRef } from 'react';
import { useUser } from '../lib/UserContext';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, Sparkles, Loader2, Plus, Check,
  AlertTriangle, Scale, Droplets, Flame, Beef
} from 'lucide-react';

// Mock scan results (matches backend mock when no API key)
const MOCK_SCAN = [
  { dish: 'Dal Tadka', food_category: 'cooked_dal', volume_cups: 1.0, weight_g: 200, protein_g: 14, fat_g: 1, carbs_g: 36, calories: 208, confidence: 85 },
  { dish: 'Steamed Rice', food_category: 'cooked_rice', volume_cups: 1.5, weight_g: 225, protein_g: 6.1, fat_g: 0.7, carbs_g: 63, calories: 293, confidence: 90 },
  { dish: 'Mixed Sabzi', food_category: 'dry_sabzi', volume_cups: 0.75, weight_g: 120, protein_g: 3.6, fat_g: 4.8, carbs_g: 12, calories: 108, confidence: 78 },
];

export default function SnapCook() {
  const { targets, consumed, addMeal } = useUser();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [loggedItems, setLoggedItems] = useState(new Set());
  const [editWeights, setEditWeights] = useState({});
  const fileInputRef = useRef(null);

  const remaining = {
    calories: Math.max(targets.calories - consumed.calories, 0),
    protein: Math.max(targets.protein - consumed.protein, 0),
    carbs: Math.max(targets.carbs - consumed.carbs, 0),
    fat: Math.max(targets.fat - consumed.fat, 0),
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      fileInputRef.current = file;
      setResults(null);
      setError(null);
      setLoggedItems(new Set());
      setEditWeights({});
    }
  };

  const analyzeImage = async () => {
    if (!fileInputRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.snapCook(fileInputRef.current, remaining);
      if (res.recipes && res.recipes.length > 0) {
        setResults(res.recipes);
      } else {
        setError("AI could not detect any food in the image.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      if (errMsg.includes('403') || errMsg.includes('API_KEY_INVALID')) {
        setError("Google Gemini API Key is missing or invalid in the backend. Falling back to mock data.");
        setResults(MOCK_SCAN);
      } else {
        setError("Failed to connect to backend server or upload image.");
        console.error("SnapCook API Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const logItem = (item) => {
    const finalWeight = editWeights[item.dish] || item.weight_g;
    const ratio = finalWeight / item.weight_g;
    addMeal({
      name: item.dish,
      calories: item.calories,
      protein: item.protein_g,
      carbs: item.carbs_g,
      fat: item.fat_g,
    }, Math.round(finalWeight), 'lunch');
    setLoggedItems(prev => new Set([...prev, item.dish]));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Camera className="w-8 h-8 text-accent-secondary" />
          <span className="gradient-text">Snap & Cook</span>
        </h1>
        <p className="text-dark-200 mt-1">
          Snap your plate — AI estimates volume, weight, and macros in seconds.
        </p>
      </motion.div>

      {/* Remaining Macros */}
      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-dark-100 mb-3">
          <Sparkles className="w-4 h-4 inline text-accent-secondary mr-1" /> Remaining Today
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Calories', value: remaining.calories, unit: '', color: 'accent-secondary' },
            { label: 'Protein', value: remaining.protein, unit: 'g', color: 'protein' },
            { label: 'Carbs', value: remaining.carbs, unit: 'g', color: 'carbs' },
            { label: 'Fat', value: remaining.fat, unit: 'g', color: 'fat' },
          ].map(m => (
            <div key={m.label} className="text-center">
              <p className="text-lg font-bold" style={{ color: `var(--color-${m.color})` }}>
                {Math.round(m.value)}{m.unit}
              </p>
              <p className="text-xs text-dark-300">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="card mb-6">
        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center py-16 cursor-pointer border-2 border-dashed border-dark-500 rounded-2xl hover:border-accent-primary/50 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-accent-primary/15 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-accent-secondary" />
            </div>
            <p className="text-sm font-medium mb-1">Upload a photo of your plate</p>
            <p className="text-xs text-dark-400">Click or drag & drop an image</p>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        ) : (
          <div>
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img src={imagePreview} alt="Scanned plate" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
              <button
                onClick={() => { setImagePreview(null); setResults(null); }}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-dark-900/80 text-sm text-dark-200 hover:text-white transition-colors"
              >
                Change
              </button>
            </div>
            {!results && (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Estimating portions...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Analyze & Estimate Nutrition</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Pipeline Results ── */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Pipeline header */}
          <div className="card bg-gradient-to-r from-accent-primary/10 to-accent-secondary/5 border-accent-primary/20">
            <h3 className="text-sm font-bold text-accent-secondary mb-2">3-Step Nutritional Engine</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Droplets className="w-5 h-5 mx-auto text-blue-accent mb-1" />
                <p className="text-xs text-dark-200">Volume (cups)</p>
              </div>
              <div>
                <Scale className="w-5 h-5 mx-auto text-orange-accent mb-1" />
                <p className="text-xs text-dark-200">Weight (grams)</p>
              </div>
              <div>
                <Flame className="w-5 h-5 mx-auto text-red-accent mb-1" />
                <p className="text-xs text-dark-200">Macros</p>
              </div>
            </div>
          </div>

          {/* Individual items */}
          {results.map((item, idx) => {
            const finalWeight = editWeights[item.dish] || item.weight_g;
            const ratio = finalWeight / item.weight_g;
            const needsVerify = item.confidence < 70;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{item.dish}</h3>
                    <p className="text-xs text-dark-400">{item.food_category.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {needsVerify && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-accent/10 text-yellow-accent text-xs">
                        <AlertTriangle className="w-3 h-3" /> Verify
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      item.confidence >= 80 ? 'bg-green-accent/10 text-green-accent' :
                      item.confidence >= 70 ? 'bg-blue-accent/10 text-blue-accent' :
                      'bg-yellow-accent/10 text-yellow-accent'
                    }`}>
                      {item.confidence}% conf
                    </span>
                  </div>
                </div>

                {/* Estimation breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-xl bg-dark-700/50">
                    <p className="text-lg font-bold text-blue-accent">{item.volume_cups}</p>
                    <p className="text-xs text-dark-300">cups</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-dark-700/50">
                    <div className="relative inline-block">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        className="w-20 text-lg font-bold text-center bg-transparent text-orange-accent outline-none border-b border-dark-500 focus:border-orange-accent"
                        value={Math.round(finalWeight)}
                        onChange={(e) => setEditWeights({ ...editWeights, [item.dish]: parseFloat(e.target.value) || item.weight_g })}
                      />
                    </div>
                    <p className="text-xs text-dark-300 mt-1">grams</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-dark-700/50">
                    <p className="text-lg font-bold text-red-accent">{Math.round(item.calories * ratio)}</p>
                    <p className="text-xs text-dark-300">cal</p>
                  </div>
                </div>

                {/* Macro breakdown */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs px-2 py-1 rounded-lg bg-protein/10 text-protein">
                    P: {(item.protein_g * ratio).toFixed(1)}g
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg bg-fat/10 text-fat">
                    F: {(item.fat_g * ratio).toFixed(1)}g
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg bg-carbs/10 text-carbs">
                    C: {(item.carbs_g * ratio).toFixed(1)}g
                  </span>
                </div>

                {/* Log button */}
                {loggedItems.has(item.dish) ? (
                  <span className="flex items-center justify-center gap-2 py-2 rounded-xl bg-green-accent/15 text-green-accent text-sm font-medium">
                    <Check className="w-4 h-4" /> Logged
                  </span>
                ) : (
                  <button
                    onClick={() => logItem(item)}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Log {Math.round(finalWeight)}g
                  </button>
                )}
              </motion.div>
            );
          })}

          {/* Total Summary */}
          <div className="card">
            <h3 className="text-sm font-semibold text-dark-100 mb-3">Plate Total</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: 'Calories', value: results.reduce((s, i) => s + i.calories * ((editWeights[i.dish] || i.weight_g) / i.weight_g), 0), unit: '' },
                { label: 'Protein', value: results.reduce((s, i) => s + i.protein_g * ((editWeights[i.dish] || i.weight_g) / i.weight_g), 0), unit: 'g' },
                { label: 'Carbs', value: results.reduce((s, i) => s + i.carbs_g * ((editWeights[i.dish] || i.weight_g) / i.weight_g), 0), unit: 'g' },
                { label: 'Fat', value: results.reduce((s, i) => s + i.fat_g * ((editWeights[i.dish] || i.weight_g) / i.weight_g), 0), unit: 'g' },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-xl font-bold gradient-text">{Math.round(m.value)}{m.unit}</p>
                  <p className="text-xs text-dark-300">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

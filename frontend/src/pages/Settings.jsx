import { useState, useEffect } from 'react';
import { useUser } from '../lib/UserContext';
import { api } from '../lib/api';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, User, Target, Activity, Edit3, 
  LogOut, Save, ShieldAlert, Check, Loader2, AlertTriangle
} from 'lucide-react';

const HEALTH_CONDITIONS = [
  { id: 'diabetic', label: 'Diabetic', desc: 'Prioritizes Low-GI foods' },
  { id: 'pcos', label: 'PCOS', desc: 'Focuses on insulin sensitivity' },
  { id: 'hypertension', label: 'Hypertension', desc: 'Low sodium focus' },
  { id: ' lactose_intolerant', label: 'Lactose Intolerant', desc: 'Dairy-free' },
  { id: 'gluten_free', label: 'Gluten Free', desc: 'No wheat products' }
];

export default function Settings() {
  const { profile, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Local state for editing
  const [formData, setFormData] = useState({
    name: profile.name || '',
    age: profile.age || 25,
    currentWeight: profile.currentWeight || 70,
    goalWeight: profile.goalWeight || 65,
    activityLevel: profile.activityLevel || 'lightly_active',
    healthConditions: profile.healthConditions || [],
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Sync if profile loads late
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      age: profile.age || 25,
      currentWeight: profile.currentWeight || 70,
      goalWeight: profile.goalWeight || 65,
      activityLevel: profile.activityLevel || 'lightly_active',
      healthConditions: profile.healthConditions || [],
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCondition = (id) => {
    setFormData(prev => {
      const exists = prev.healthConditions.includes(id);
      return {
        ...prev,
        healthConditions: exists 
          ? prev.healthConditions.filter(c => c !== id)
          : [...prev.healthConditions, id]
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      // 1. Recalculate TDEE targets via Python Backend
      const res = await api.calculateTDEE({
        weight_kg: Number(formData.currentWeight),
        height_cm: profile.heightCm || 175,
        age: Number(formData.age),
        sex: profile.sex || 'male',
        activity_level: formData.activityLevel,
        goal: formData.currentWeight > formData.goalWeight ? 'lose_weight' : 
              (formData.currentWeight < formData.goalWeight ? 'gain_weight' : 'maintain_weight')
      });

      // 2. Save new profile and new targets to Context (which syncs to Firestore)
      await updateProfile({
        name: formData.name,
        age: Number(formData.age),
        currentWeight: Number(formData.currentWeight),
        goalWeight: Number(formData.goalWeight),
        activityLevel: formData.activityLevel,
        healthConditions: formData.healthConditions,
        targets: res.targets // Extracted from backend!
      });

      setSuccessMsg("Settings updated and macro targets recalculated.");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000);

    } catch (err) {
      console.error(err);
      setError("Failed to save settings or recalculate macros.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-accent-secondary" />
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-dark-200 mt-1">Manage your health profile and account.</p>
        </div>
        
        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-400/10 hover:bg-red-400/20 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-600 mb-6">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'goals', label: 'Goals & Targets', icon: Target },
          { id: 'health', label: 'Health Profile', icon: ShieldAlert },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                isActive 
                  ? 'border-accent-primary text-accent-primary' 
                  : 'border-transparent text-dark-300 hover:text-dark-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {/* Status Messages */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {successMsg && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-400">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{successMsg}</p>
          </div>
        )}

        {/* Tab Content: Profile */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-4">
            <h3 className="text-lg font-bold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark-300 uppercase mb-2">Display Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-300 uppercase mb-2">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="input w-full" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content: Goals */}
        {activeTab === 'goals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-4">
            <h3 className="text-lg font-bold mb-4">Body Metrics & Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark-300 uppercase mb-2">Current Weight (kg)</label>
                <input type="number" name="currentWeight" value={formData.currentWeight} onChange={handleChange} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-300 uppercase mb-2">Goal Weight (kg)</label>
                <input type="number" name="goalWeight" value={formData.goalWeight} onChange={handleChange} className="input w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-dark-300 uppercase mb-2">Activity Level</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="input w-full appearance-none">
                  <option value="sedentary">Sedentary (Office job, little exercise)</option>
                  <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                  <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                  <option value="active">Very Active (6-7 days/week)</option>
                  <option value="very_active">Extra Active (Physical job or training)</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-dark-300 mt-2 flex items-center gap-1">
              <Activity className="w-4 h-4" /> 
              Saving these changes will recalculate your daily Macro targets.
            </p>
          </motion.div>
        )}

        {/* Tab Content: Health */}
        {activeTab === 'health' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="text-lg font-bold mb-4">Health Conditions</h3>
            <p className="text-sm text-dark-200 mb-6">Select conditions to adjust your AI Meal Planner.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HEALTH_CONDITIONS.map(cond => {
                const isSelected = formData.healthConditions.includes(cond.id);
                return (
                  <button
                    key={cond.id}
                    onClick={() => toggleCondition(cond.id)}
                    className={`p-4 rounded-xl border text-left flex items-start justify-between transition-colors ${
                      isSelected 
                        ? 'bg-accent-primary/10 border-accent-primary text-white'
                        : 'bg-dark-700/50 border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm">{cond.label}</p>
                      <p className={`text-xs mt-1 ${isSelected ? 'text-blue-200' : 'text-dark-300'}`}>{cond.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-accent-primary" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Save Acton */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving & Recalculating...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

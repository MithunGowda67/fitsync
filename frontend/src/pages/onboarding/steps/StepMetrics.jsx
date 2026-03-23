import { useUser } from '../../../lib/UserContext';
import { Ruler } from 'lucide-react';

export default function StepMetrics() {
  const { profile, updateProfile } = useUser();
  const isImperial = profile.unit === 'imperial';

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-accent to-accent-primary flex items-center justify-center mx-auto mb-4">
          <Ruler className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your body metrics</h2>
        <p className="text-dark-200">We'll use this to calculate your ideal calories and macros.</p>
      </div>

      {/* Unit Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-dark-700 rounded-xl p-1">
          {['metric', 'imperial'].map(u => (
            <button
              key={u}
              onClick={() => updateProfile({ unit: u })}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                profile.unit === u ? 'bg-accent-primary text-white' : 'text-dark-300 hover:text-white'
              }`}
            >
              {u === 'imperial' ? 'lbs / ft' : 'kg / cm'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-dark-100 mb-2">Height</label>
          {isImperial ? (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="number" min="3" max="8"
                  className="input-field pr-10"
                  placeholder="Feet"
                  value={profile.heightFt || ''}
                  onChange={(e) => updateProfile({ heightFt: parseInt(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">ft</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number" min="0" max="11"
                  className="input-field pr-10"
                  placeholder="Inches"
                  value={profile.heightIn || ''}
                  onChange={(e) => updateProfile({ heightIn: parseInt(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">in</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="number" min="100" max="250"
                className="input-field pr-10"
                placeholder="Height in cm"
                value={profile.heightCm || ''}
                onChange={(e) => updateProfile({ heightCm: parseInt(e.target.value) || 0 })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">cm</span>
            </div>
          )}
        </div>

        {/* Current Weight */}
        <div>
          <label className="block text-sm font-medium text-dark-100 mb-2">Current Weight</label>
          <div className="relative">
            <input
              type="number" min="20" max="300"
              className="input-field pr-12"
              placeholder={`Weight in ${isImperial ? 'lbs' : 'kg'}`}
              value={profile.currentWeight || ''}
              onChange={(e) => updateProfile({ currentWeight: parseFloat(e.target.value) || 0 })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">
              {isImperial ? 'lbs' : 'kg'}
            </span>
          </div>
        </div>

        {/* Goal Weight */}
        <div>
          <label className="block text-sm font-medium text-dark-100 mb-2">Goal Weight</label>
          <div className="relative">
            <input
              type="number" min="20" max="300"
              className="input-field pr-12"
              placeholder={`Goal in ${isImperial ? 'lbs' : 'kg'}`}
              value={profile.goalWeight || ''}
              onChange={(e) => updateProfile({ goalWeight: parseFloat(e.target.value) || 0 })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">
              {isImperial ? 'lbs' : 'kg'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

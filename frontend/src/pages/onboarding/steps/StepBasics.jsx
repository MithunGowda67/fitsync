import { useUser } from '../../../lib/UserContext';
import { User, Users } from 'lucide-react';

export default function StepBasics() {
  const { profile, updateProfile } = useUser();

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Let's get to know you</h2>
        <p className="text-dark-200">Basic info to personalize your experience.</p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-dark-100 mb-2">What should we call you?</label>
          <input
            type="text"
            className="input-field"
            placeholder="Your first name"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            autoFocus
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-dark-100 mb-2">Age</label>
          <input
            type="number"
            min="13"
            max="100"
            className="input-field"
            placeholder="Enter your age"
            value={profile.age || ''}
            onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-dark-100 mb-2">Biological Sex</label>
          <div className="flex gap-3">
            {['male', 'female'].map(sex => (
              <button
                key={sex}
                onClick={() => updateProfile({ sex })}
                className={`flex-1 py-3 rounded-xl font-medium text-sm capitalize transition-all ${
                  profile.sex === sex
                    ? 'bg-accent-primary/20 border border-accent-primary text-white'
                    : 'bg-dark-700 border border-dark-500 text-dark-200 hover:border-dark-300'
                }`}
              >
                {sex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

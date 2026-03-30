import { useUser } from '../../../lib/UserContext';
import { User } from 'lucide-react';

export default function StepBasics() {
  const { profile, updateProfile } = useUser();

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">
          Let's get to know you
        </h2>
        <p className="text-gray-400">
          Basic info to personalize your experience.
        </p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What should we call you?
          </label>
          <input
            type="text"
            placeholder="Your first name"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a2e] border border-gray-600 text-white 
            placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Age
          </label>
          <input
            type="number"
            min="13"
            max="100"
            placeholder="Enter your age"
            value={profile.age || ''}
            onChange={(e) =>
              updateProfile({ age: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a2e] border border-gray-600 text-white 
            placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Biological Sex
          </label>

          <div className="flex gap-3">
            {['male', 'female'].map((sex) => (
              <button
                key={sex}
                onClick={() => updateProfile({ sex })}
                className={`flex-1 py-3 rounded-xl font-medium capitalize transition-all duration-200
                  
                  ${profile.sex === sex
                    ? 'bg-purple-600 text-white border border-purple-600 shadow-lg scale-[1.02]'
                    : 'bg-[#1a1a2e] text-gray-300 border border-gray-600 hover:bg-purple-500 hover:text-white hover:border-purple-500'
                  }
                `}
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
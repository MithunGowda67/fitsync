import { useUser } from '../../../lib/UserContext';
import { Target, Scale, TrendingUp, Dumbbell } from 'lucide-react';

const GOALS = [
  { id: 'lose_weight', label: 'Lose weight', desc: 'Reduce body fat and slim down', icon: Scale, color: 'text-red-accent' },
  { id: 'maintain_weight', label: 'Maintain weight', desc: 'Stay at your current weight', icon: Target, color: 'text-blue-accent' },
  { id: 'gain_muscle', label: 'Gain muscle', desc: 'Build lean muscle mass', icon: Dumbbell, color: 'text-orange-accent' },
  { id: 'gain_weight', label: 'Gain weight', desc: 'Increase body weight healthily', icon: TrendingUp, color: 'text-green-accent' },
];

export default function StepGoals() {
  const { profile, updateProfile } = useUser();

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-accent to-blue-accent flex items-center justify-center mx-auto mb-4">
          <Target className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">What's your goal?</h2>
        <p className="text-dark-200">This shapes your calorie and macro targets.</p>
      </div>
      <div className="space-y-3">
        {GOALS.map(goal => {
          const Icon = goal.icon;
          const isSelected = profile.goals?.[0] === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => updateProfile({ goals: [goal.id] })}
              className={`card card-selectable w-full flex items-center gap-4 py-4 px-5 ${
                isSelected ? 'card-selected' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-accent-secondary' : goal.color}`} />
              <div className="text-left flex-1">
                <p className="font-semibold text-sm">{goal.label}</p>
                <p className="text-xs text-dark-300">{goal.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'border-accent-primary bg-accent-primary'
                  : 'border-dark-400'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

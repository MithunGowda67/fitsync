import { useUser } from '../../../lib/UserContext';
import { Zap, Sofa, Bike, Flame, Mountain } from 'lucide-react';

const LEVELS = [
  {
    id: 'not_very_active',
    label: 'Not Very Active',
    desc: 'Little to no exercise, desk job',
    icon: Sofa,
    color: 'text-dark-200',
  },
  {
    id: 'lightly_active',
    label: 'Lightly Active',
    desc: 'Light exercise 1–3 days/week',
    icon: Bike,
    color: 'text-blue-accent',
  },
  {
    id: 'active',
    label: 'Active',
    desc: 'Moderate exercise 3–5 days/week',
    icon: Flame,
    color: 'text-orange-accent',
  },
  {
    id: 'very_active',
    label: 'Very Active',
    desc: 'Hard exercise 6–7 days/week',
    icon: Mountain,
    color: 'text-green-accent',
  },
];

export default function StepActivity() {
  const { profile, updateProfile } = useUser();

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-accent to-yellow-accent flex items-center justify-center mx-auto mb-4">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Activity Level</h2>
        <p className="text-dark-200">How active are you on a typical week?</p>
      </div>
      <div className="space-y-3">
        {LEVELS.map(level => {
          const Icon = level.icon;
          const isSelected = profile.activityLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => updateProfile({ activityLevel: level.id })}
              className={`card card-selectable w-full flex items-center gap-4 py-4 px-5 ${
                isSelected ? 'card-selected' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-accent-secondary' : level.color}`} />
              <div className="text-left flex-1">
                <p className="font-semibold text-sm">{level.label}</p>
                <p className="text-xs text-dark-300">{level.desc}</p>
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

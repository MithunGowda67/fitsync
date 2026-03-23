import { useUser } from '../../../lib/UserContext';
import { HeartPulse, Check } from 'lucide-react';

const CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes', desc: 'Type 1 or Type 2 diabetes', emoji: '🩸' },
  { id: 'pcos', label: 'PCOS', desc: 'Polycystic ovary syndrome', emoji: '🔬' },
  { id: 'hypertension', label: 'Hypertension', desc: 'High blood pressure', emoji: '❤️‍🩹' },
  { id: 'thyroid', label: 'Thyroid', desc: 'Hypo/hyperthyroidism', emoji: '🦋' },
  { id: 'cholesterol', label: 'High Cholesterol', desc: 'Elevated LDL or triglycerides', emoji: '🫀' },
  { id: 'none', label: 'None', desc: 'No known health conditions', emoji: '✅' },
];

export default function StepHealth() {
  const { profile, updateProfile } = useUser();
  const selected = profile.healthConditions || [];

  const toggle = (id) => {
    if (id === 'none') {
      updateProfile({ healthConditions: ['none'] });
      return;
    }
    const without = selected.filter(c => c !== 'none');
    const updated = without.includes(id)
      ? without.filter(c => c !== id)
      : [...without, id];
    updateProfile({ healthConditions: updated.length > 0 ? updated : [] });
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-accent to-pink-accent flex items-center justify-center mx-auto mb-4">
          <HeartPulse className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Health Conditions</h2>
        <p className="text-dark-200">
          Select any that apply — we'll permanently filter meals that conflict with your health.
        </p>
      </div>
      <div className="space-y-3">
        {CONDITIONS.map(cond => {
          const isSelected = selected.includes(cond.id);
          return (
            <button
              key={cond.id}
              onClick={() => toggle(cond.id)}
              className={`card card-selectable w-full flex items-center justify-between py-3 px-5 ${
                isSelected ? 'card-selected' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{cond.emoji}</span>
                <div className="text-left">
                  <p className="font-medium text-sm">{cond.label}</p>
                  <p className="text-xs text-dark-300">{cond.desc}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'border-accent-primary bg-accent-primary'
                  : 'border-dark-400'
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

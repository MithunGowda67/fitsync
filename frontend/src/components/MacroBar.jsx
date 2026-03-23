export default function MacroBar({ label, consumed, target, color, unit = 'g' }) {
  const progress = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: `var(--color-${color})` }} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-xs text-dark-300">
          {Math.round(consumed)}{unit} / {Math.round(target)}{unit}
        </span>
      </div>
      <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: `var(--color-${color})`,
            boxShadow: `0 0 8px var(--color-${color})40`,
          }}
        />
      </div>
      <p className="text-xs text-dark-400 mt-1">{Math.round(remaining)}{unit} remaining</p>
    </div>
  );
}

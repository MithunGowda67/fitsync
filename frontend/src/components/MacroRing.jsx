export default function MacroRing({ consumed, target, size = 160, strokeWidth = 12, label = 'Calories' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / target, 1);
  const offset = circumference - progress * circumference;
  const remaining = Math.max(target - consumed, 0);
  const isOver = consumed > target;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-dark-600)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isOver ? 'var(--color-red-accent)' : 'url(#calorieGradient)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <defs>
            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-primary)" />
              <stop offset="100%" stopColor="var(--color-accent-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{Math.round(remaining)}</span>
          <span className="text-xs text-dark-300 mt-0.5">remaining</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-dark-200">
        <span className="text-white font-semibold">{Math.round(consumed)}</span>
        <span className="text-dark-400"> / </span>
        <span>{Math.round(target)}</span>
        <span className="ml-1">{label}</span>
      </p>
    </div>
  );
}

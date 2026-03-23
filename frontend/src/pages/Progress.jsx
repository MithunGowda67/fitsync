import { useState } from 'react';
import { useUser } from '../lib/UserContext';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Target, Scale, Plus, Calendar
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-3 shadow-lg">
        <p className="text-xs text-dark-300 mb-1">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value} {unit}</p>
      </div>
    );
  }
  return null;
};

export default function Progress() {
  const { profile, weightHistory, logWeight } = useUser();
  const [newWeight, setNewWeight] = useState('');

  const handleLog = () => {
    if (newWeight) {
      logWeight(parseFloat(newWeight));
      setNewWeight('');
    }
  };

  // Generate sample data if no history
  const chartData = weightHistory.length > 0
    ? weightHistory.map(w => ({ date: w.date.slice(5), weight: w.weight }))
    : Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const base = profile.currentWeight || 170;
        const trend = profile.goals?.includes('lose_weight') ? -0.15 : 0.1;
        return {
          date: `${d.getMonth() + 1}/${d.getDate()}`,
          weight: Math.round((base + trend * i + (Math.random() - 0.5) * 2) * 10) / 10,
        };
      });

  const currentWeight = chartData.length > 0 ? chartData[chartData.length - 1].weight : profile.currentWeight;
  const startWeight = chartData.length > 0 ? chartData[0].weight : profile.currentWeight;
  const change = currentWeight - startWeight;
  const goalWeight = profile.goalWeight || 160;
  const toGoal = currentWeight - goalWeight;
  const isLosing = profile.goals?.includes('lose_weight');

  const stats = [
    {
      label: 'Current Weight',
      value: `${currentWeight}`,
      unit: profile.unit === 'imperial' ? 'lbs' : 'kg',
      icon: Scale,
      color: 'accent-secondary',
    },
    {
      label: 'Change',
      value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}`,
      unit: profile.unit === 'imperial' ? 'lbs' : 'kg',
      icon: change < 0 ? TrendingDown : TrendingUp,
      color: (isLosing && change < 0) || (!isLosing && change > 0) ? 'green-accent' : 'red-accent',
    },
    {
      label: 'Goal Weight',
      value: `${goalWeight}`,
      unit: profile.unit === 'imperial' ? 'lbs' : 'kg',
      icon: Target,
      color: 'blue-accent',
    },
    {
      label: 'To Goal',
      value: `${Math.abs(toGoal).toFixed(1)}`,
      unit: `${profile.unit === 'imperial' ? 'lbs' : 'kg'} ${toGoal > 0 ? 'to lose' : 'to gain'}`,
      icon: Calendar,
      color: 'orange-accent',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-accent-secondary" />
          <span className="gradient-text">Progress</span>
        </h1>
        <p className="text-dark-200 mt-1">Track your weight journey over time.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: `var(--color-${stat.color})` }} />
                <span className="text-xs text-dark-300">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: `var(--color-${stat.color})` }}>
                {stat.value}
              </p>
              <p className="text-xs text-dark-400">{stat.unit}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Weight Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
      >
        <h3 className="text-sm font-semibold mb-6">Weight Over Time</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-dark-600)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="var(--color-dark-400)"
                tick={{ fill: 'var(--color-dark-300)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--color-dark-600)' }}
              />
              <YAxis
                stroke="var(--color-dark-400)"
                tick={{ fill: 'var(--color-dark-300)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--color-dark-600)' }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip unit={profile.unit === 'imperial' ? 'lbs' : 'kg'} />} />
              <ReferenceLine
                y={goalWeight}
                stroke="var(--color-green-accent)"
                strokeDasharray="5 5"
                label={{ value: 'Goal', fill: 'var(--color-green-accent)', fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="var(--color-accent-primary)"
                strokeWidth={2.5}
                fill="url(#weightGradient)"
                dot={{ fill: 'var(--color-accent-secondary)', r: 4, strokeWidth: 0 }}
                activeDot={{ fill: 'var(--color-accent-primary)', r: 6, strokeWidth: 2, stroke: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Log Weight */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Scale className="w-4 h-4 text-accent-secondary" /> Log Today's Weight
        </h3>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              step="0.1"
              className="input-field pr-12"
              placeholder={`Enter weight in ${profile.unit === 'imperial' ? 'lbs' : 'kg'}`}
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLog()}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">
              {profile.unit === 'imperial' ? 'lbs' : 'kg'}
            </span>
          </div>
          <button onClick={handleLog} disabled={!newWeight} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Log
          </button>
        </div>

        {/* Weight History */}
        {weightHistory.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-dark-300 font-medium">Recent Entries</p>
            {[...weightHistory].reverse().slice(0, 7).map((w, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-dark-700/50">
                <span className="text-sm text-dark-200">{w.date}</span>
                <span className="text-sm font-semibold">
                  {w.weight} {profile.unit === 'imperial' ? 'lbs' : 'kg'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

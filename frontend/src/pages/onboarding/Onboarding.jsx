import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../lib/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import StepBasics from './steps/StepBasics';
import StepMetrics from './steps/StepMetrics';
import StepHealth from './steps/StepHealth';
import StepActivity from './steps/StepActivity';
import StepGoals from './steps/StepGoals';

const STEPS = [
  StepBasics,    // 0 — Name, Age, Gender
  StepMetrics,   // 1 — Height, Weight (kg/lbs toggle)
  StepHealth,    // 2 — Health Conditions
  StepActivity,  // 3 — Activity Level
  StepGoals,     // 4 — Goal selection
];

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const { profile, updateProfile } = useUser();
  const navigate = useNavigate();

  const StepComponent = STEPS[step];
  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 0: return profile.name?.trim().length >= 1 && profile.age > 0;  // Basics
      case 1: return profile.currentWeight > 0 && profile.goalWeight > 0;  // Metrics
      case 2: return (profile.healthConditions || []).length > 0;           // Health
      case 3: return !!profile.activityLevel;                              // Activity
      case 4: return profile.goals?.length > 0;                            // Goals
      default: return true;
    }
  };

  const next = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const [isFinishing, setIsFinishing] = useState(false);
  
  const finish = async () => {
    setIsFinishing(true);
    try {
      const { api } = await import('../../lib/api');
      const { lbsToKg, ftInToCm } = await import('../../lib/utils');
      
      const weight_kg = profile.unit === 'imperial' ? lbsToKg(profile.currentWeight) : profile.currentWeight;
      const height_cm = profile.unit === 'imperial' ? ftInToCm(profile.heightFt, profile.heightIn) : profile.heightCm;
      
      const res = await api.calculateTDEE({
        sex: profile.sex,
        weight_kg,
        height_cm,
        age: profile.age,
        activity_level: profile.activityLevel,
        goal: profile.goals[0] || 'maintain_weight'
      });
      
      updateProfile({ onboarded: true, targets: res.targets });
      navigate('/dashboard');
    } catch (err) {
      console.error("Failed to calculate TDEE via API:", err);
      setIsFinishing(false);
      alert("Failed to connect to backend server. Make sure it is running.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-accent/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-accent-secondary mb-4">
            <Sparkles className="w-4 h-4" />
            Step {step + 1} of {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-dark-700 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Step Content */}
        <div className="card min-h-[400px] flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-1"
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-600/50">
            <button
              onClick={prev}
              disabled={step === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < totalSteps - 1 ? (
              <button
                onClick={next}
                disabled={!canProceed()}
                className="btn-primary flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={!canProceed() || isFinishing}
                className="btn-primary flex items-center gap-2 animate-pulse-glow"
              >
                {isFinishing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Get Started</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

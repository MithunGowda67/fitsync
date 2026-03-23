import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#09090f',
          }}
        >
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,92,231,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              position: 'relative',
            }}
          >
            {/* Icon */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(108,92,231,0.3)',
            }}>
              <Activity style={{ width: '28px', height: '28px', color: 'white' }} />
            </div>

            {/* Wordmark */}
            <span style={{
              fontSize: '42px',
              fontWeight: 800,
              letterSpacing: '-1px',
              background: 'linear-gradient(135deg, #ffffff 0%, #a29bfe 50%, #6c5ce7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Inter', sans-serif",
            }}>
              FitSync
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              marginTop: '20px',
              fontSize: '16px',
              fontWeight: 400,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(162, 155, 254, 0.7)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            FitSync: Start Living
          </motion.p>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{ marginTop: '48px' }}
          >
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 1.5, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{
                height: '2px',
                width: '120px',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, transparent, #6c5ce7, #a29bfe, transparent)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

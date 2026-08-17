import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/queue');
    }
  };

  const handleSkip = () => {
    navigate('/queue');
  };

  const steps = [
    {
      title: 'Screenshots pile up',
      description: 'Almost nothing gets done with them. They sit in your camera roll, forgotten.',
      icon: '📸',
    },
    {
      title: 'Clearshot turns them into action',
      description: 'Each screenshot becomes a card with one clear thing to do — buy it, call it, calendar it, or file it.',
      icon: '⚡',
    },
    {
      title: "Let's clear your backlog",
      description: 'Upload your existing screenshots and watch them transform into sorted, actionable cards.',
      icon: '🏃',
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-teal-600 rounded-card flex items-center justify-center text-cream font-bold text-lg">
            C
          </div>
          <h1 className="mt-4 text-2xl font-bold text-charcoal">Clearshot</h1>
        </div>

        {/* Steps indicator */}
        <div className="flex gap-1 justify-center">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors ${
                idx + 1 <= step ? 'bg-teal-600' : 'bg-taupe/20'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <div className="text-6xl">{currentStep.icon}</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-charcoal">{currentStep.title}</h2>
            <p className="text-taupe leading-relaxed">{currentStep.description}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {step === 3 ? (
            <button
              onClick={() => navigate('/queue')}
              className="w-full px-6 py-3 bg-teal-600 text-cream rounded-card font-semibold hover:bg-teal-700 transition-colors text-lg"
            >
              Upload your screenshots
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-teal-600 text-cream rounded-card font-semibold hover:bg-teal-700 transition-colors text-lg"
            >
              Next
            </button>
          )}
          <button
            onClick={handleSkip}
            className="w-full px-6 py-3 border border-teal-600 text-teal-600 rounded-card font-semibold hover:bg-teal-50 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

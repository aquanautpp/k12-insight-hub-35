import React from 'react';

interface FeatureFlags {
  cpaExplanationTooltip: boolean;
  learningTestOnboarding: boolean;
  personalizedInsights: boolean;
  gamificationRewards: boolean;
  aiTutorIntegration: boolean;
  accessibilityPanel: boolean;
  feedbackSystem: boolean;
  contentAsData: boolean;
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  toggleFlag: (flag: keyof FeatureFlags) => void;
  isEnabled: (flag: keyof FeatureFlags) => boolean;
}

const defaultFlags: FeatureFlags = {
  cpaExplanationTooltip: true, // Primeiro recurso ativo para demonstração
  learningTestOnboarding: false,
  personalizedInsights: false,
  gamificationRewards: false,
  aiTutorIntegration: false,
  accessibilityPanel: false,
  feedbackSystem: false,
  contentAsData: false,
};

const FeatureFlagsContext = React.createContext<FeatureFlagsContextType | undefined>(undefined);

export const useFeatureFlags = () => {
  const context = React.useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
}

export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({ children }) => {
  const [flags, setFlags] = React.useState<FeatureFlags>(() => {
    // Carregar flags do localStorage se disponível
    const saved = localStorage.getItem('featureFlags');
    return saved ? { ...defaultFlags, ...JSON.parse(saved) } : defaultFlags;
  });

  const toggleFlag = (flag: keyof FeatureFlags) => {
    setFlags(prev => {
      const newFlags = { ...prev, [flag]: !prev[flag] };
      localStorage.setItem('featureFlags', JSON.stringify(newFlags));
      return newFlags;
    });
  };

  const isEnabled = (flag: keyof FeatureFlags) => flags[flag];

  return (
    <FeatureFlagsContext.Provider value={{ flags, toggleFlag, isEnabled }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};
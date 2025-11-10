import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KubectlSimulator } from '@/lib/kubectl-simulator';

interface SimulatorContextType {
  simulator: KubectlSimulator;
  state: ReturnType<KubectlSimulator['getState']>;
}

const SimulatorContext = createContext<SimulatorContextType | null>(null);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [simulator] = useState(() => new KubectlSimulator());
  const [state, setState] = useState(() => simulator.getState());

  useEffect(() => {
    const handleStateChange = () => {
      setState(simulator.getState());
    };

    simulator.onStateChange(handleStateChange);
  }, [simulator]);

  return (
    <SimulatorContext.Provider value={{ simulator, state }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within SimulatorProvider');
  }
  return context;
}

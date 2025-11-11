import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { KubectlSimulator } from '@/lib/kubectl-simulator';
import type { SimulatorMode } from '@shared/schema';

interface SimulatorContextType {
  simulator: KubectlSimulator;
  state: ReturnType<KubectlSimulator['getState']>;
}

const SimulatorContext = createContext<SimulatorContextType | null>(null);

interface SimulatorProviderProps {
  children: ReactNode;
  mode: SimulatorMode;
}

export function SimulatorProvider({ children, mode }: SimulatorProviderProps) {
  const simulator = useMemo(() => new KubectlSimulator(mode), [mode]);
  const [state, setState] = useState(() => simulator.getState());

  useEffect(() => {
    setState(simulator.getState());
    
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

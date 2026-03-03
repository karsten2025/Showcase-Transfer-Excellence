import React from 'react';
import { Factory, Cpu } from 'lucide-react';
import type { ActiveProfile } from '../store/useDataStore';

interface ProfileSwitcherProps {
  activeProfile: ActiveProfile;
  onSwitch: (profile: ActiveProfile) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  activeProfile,
  onSwitch,
}) => {
  return (
    <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
      <button
        type="button"
        onClick={() => onSwitch('STEEL')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          activeProfile === 'STEEL'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Factory className="w-4 h-4" />
        Montan-Stahl
      </button>
      <button
        type="button"
        onClick={() => onSwitch('AUTOMOTIVE')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          activeProfile === 'AUTOMOTIVE'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Cpu className="w-4 h-4" />
        Automotive/Modern
      </button>
    </div>
  );
};

import React from 'react';
import { Award, ShieldCheck, UserCheck } from 'lucide-react';

export interface CredentialPreset {
  id: string;
  name: string;
  category: string;
  secret: string;
  description: string;
  badgeColor: string;
}

export const PRESETS: CredentialPreset[] = [
  {
    id: 'kyc_level3',
    name: 'KYC Level 3 Compliance Pass',
    category: 'Regulatory Compliance',
    secret: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    description: 'Private verification of verified identity without exposing passport data',
    badgeColor: 'border-prism-emerald/40 text-prism-emerald bg-prism-emerald/10',
  },
  {
    id: 'accredited_investor',
    name: 'Accredited Investor Tier',
    category: 'Institutional Access',
    secret: 'secret_accredited_investor_9999',
    description: 'Proves accredited net-worth eligibility for private token sales',
    badgeColor: 'border-prism-purple/40 text-prism-purple bg-prism-purple/10',
  },
  {
    id: 'vip_dao',
    name: 'DAO Inner Circle VIP',
    category: 'Governance Membership',
    secret: 'secret_vip_club_member_8888',
    description: 'Exclusive voting & proposal submission pass with 100% address anonymity',
    badgeColor: 'border-prism-teal/40 text-prism-teal bg-prism-teal/10',
  },
];

interface PresetSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (preset: CredentialPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ selectedPresetId, onSelectPreset }) => {
  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="text-slate-400 flex items-center justify-between text-[11px]">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-prism-emerald" /> Select Credential Case Preset
        </span>
        <span className="text-slate-500">Quick Test Cases</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-cyber-800 border-prism-emerald shadow-prism-emerald text-white'
                  : 'bg-cyber-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${preset.badgeColor}`}>
                  {preset.category}
                </span>
                {isSelected && <ShieldCheck className="w-4 h-4 text-prism-emerald" />}
              </div>
              <div className="font-bold text-xs text-white truncate mt-1">{preset.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{preset.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

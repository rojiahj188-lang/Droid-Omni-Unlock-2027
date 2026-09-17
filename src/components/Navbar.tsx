import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Usb, 
  Lock, 
  Info, 
  CheckCircle2, 
  Cpu, 
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { DeviceInfo } from '../types';

interface NavbarProps {
  device: DeviceInfo;
  onOpenSecurityModal: () => void;
  onSelectDevicePreset: (dev: DeviceInfo) => void;
  popularDevices: DeviceInfo[];
}

export const Navbar: React.FC<NavbarProps> = ({
  device,
  onOpenSecurityModal,
  onSelectDevicePreset,
  popularDevices
}) => {
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                OmniUnlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pro</span>
              </span>
              <span className="hidden rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 sm:inline-flex">
                v2.6 Global
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Asisten Diagnostik & Pembuka Kunci HP Luar Negeri (iOS & Android)
            </p>
          </div>
        </div>

        {/* Current Active Device & Security Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Preset Picker */}
          <div className="relative">
            <button
              id="device-preset-selector-button"
              type="button"
              onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition"
            >
              <Smartphone className="h-3.5 w-3.5 text-blue-400" />
              <span className="max-w-[120px] truncate sm:max-w-[180px]">
                {device.brand} {device.model}
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                {device.regionCode}
              </span>
            </button>

            {showPresetsDropdown && (
              <div 
                id="device-preset-dropdown-menu"
                className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Pilih Preset Perangkat Uji
                </div>
                <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
                  {popularDevices.map((dev) => (
                    <button
                      key={dev.id}
                      id={`preset-device-${dev.id}`}
                      onClick={() => {
                        onSelectDevicePreset(dev);
                        setShowPresetsDropdown(false);
                      }}
                      className={`w-full text-left rounded-lg px-2.5 py-2 text-xs transition flex items-center justify-between ${
                        dev.id === device.id
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white">{dev.model}</div>
                        <div className="text-[11px] text-slate-400">
                          {dev.regionCountry} • {dev.carrierName}
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                        {dev.regionCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Security Guarantee Button */}
          <button
            id="security-guarantee-button"
            type="button"
            onClick={onOpenSecurityModal}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900/40 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keamanan Terjamin</span>
            <span className="sm:hidden">Aman</span>
          </button>
        </div>
      </div>
    </header>
  );
};

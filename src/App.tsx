import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DeviceScanner } from './components/DeviceScanner';
import { DeviceSelectionCard } from './components/DeviceSelectionCard';
import { CarrierUnlockView } from './components/CarrierUnlockView';
import { ImeiBeaCukaiView } from './components/ImeiBeaCukaiView';
import { IosRecoveryDfuView } from './components/IosRecoveryDfuView';
import { AndroidFrpScreenView } from './components/AndroidFrpScreenView';
import { AiDiagnosticAssistant } from './components/AiDiagnosticAssistant';
import { SecurityGuaranteeModal } from './components/SecurityGuaranteeModal';
import { POPULAR_DEVICES } from './data/deviceData';
import { DeviceInfo, UnlockCategory } from './types';
import { 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Globe2, 
  Cpu, 
  Radio, 
  Lock, 
  Wifi, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export default function App() {
  const [currentDevice, setCurrentDevice] = useState<DeviceInfo>(POPULAR_DEVICES[0]);
  const [selectedPlatform, setSelectedPlatform] = useState<'iOS' | 'Android'>('iOS');
  const [activeCategory, setActiveCategory] = useState<UnlockCategory>('carrier_sim');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // When platform changes, switch current device preset to match platform if needed
  const handleSelectPlatform = (platform: 'iOS' | 'Android') => {
    setSelectedPlatform(platform);
    if (platform === 'iOS') {
      const iosDevice = POPULAR_DEVICES.find(d => d.osType === 'iOS') || POPULAR_DEVICES[0];
      setCurrentDevice(iosDevice);
      if (activeCategory === 'android_frp_screen') {
        setActiveCategory('carrier_sim');
      }
    } else {
      const androidDevice = POPULAR_DEVICES.find(d => d.osType === 'Android') || POPULAR_DEVICES[3];
      setCurrentDevice(androidDevice);
      if (activeCategory === 'ios_recovery_dfu') {
        setActiveCategory('android_frp_screen');
      }
    }
  };

  const handleSelectDevicePreset = (device: DeviceInfo) => {
    setCurrentDevice(device);
    setSelectedPlatform(device.osType);
    if (device.osType === 'iOS' && activeCategory === 'android_frp_screen') {
      setActiveCategory('ios_recovery_dfu');
    } else if (device.osType === 'Android' && activeCategory === 'ios_recovery_dfu') {
      setActiveCategory('android_frp_screen');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        device={currentDevice}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onSelectDevicePreset={handleSelectDevicePreset}
        popularDevices={POPULAR_DEVICES}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Device Scanner & Live Diagnostic HUD */}
        <section aria-label="Device Diagnostic HUD">
          <DeviceScanner
            device={currentDevice}
            onUpdateDevice={setCurrentDevice}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        </section>

        {/* Device Selection Card (Platform Switcher: iOS vs Android + Sub-services) */}
        <section aria-label="Device Platform and Service Selection">
          <DeviceSelectionCard
            selectedPlatform={selectedPlatform}
            onSelectPlatform={handleSelectPlatform}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        </section>

        {/* Dynamic Service View */}
        <section 
          id="active-service-view-panel"
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7 shadow-xl backdrop-blur-sm"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                {activeCategory === 'carrier_sim' && <Radio className="h-5 w-5" />}
                {activeCategory === 'imei_beacukai' && <Wifi className="h-5 w-5" />}
                {activeCategory === 'ios_recovery_dfu' && <Clock className="h-5 w-5" />}
                {activeCategory === 'android_frp_screen' && <Lock className="h-5 w-5" />}
                {activeCategory === 'ai_assistant' && <Sparkles className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeCategory === 'carrier_sim' && 'Prosedur Pembukaan Kunci Operator (Carrier Unlock & R-SIM)'}
                  {activeCategory === 'imei_beacukai' && 'Kalkulator & Pendaftaran Sinyal IMEI Bea Cukai RI'}
                  {activeCategory === 'ios_recovery_dfu' && 'Asisten Kunci Layar & Mode DFU Firmware iOS'}
                  {activeCategory === 'android_frp_screen' && 'Bypass FRP Google & Pemulihan Pola Layar Android'}
                  {activeCategory === 'ai_assistant' && 'Konsultan Diagnostik AI Cerdas (OmniTech)'}
                </h2>
                <p className="text-xs text-slate-400">
                  Perangkat Aktif: <span className="text-slate-200 font-semibold">{currentDevice.brand} {currentDevice.model}</span> ({currentDevice.regionCode})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Protokol Terjamin Aman</span>
              </span>
            </div>
          </div>

          {/* Render Active View */}
          {activeCategory === 'carrier_sim' && (
            <CarrierUnlockView device={currentDevice} />
          )}

          {activeCategory === 'imei_beacukai' && (
            <ImeiBeaCukaiView device={currentDevice} />
          )}

          {activeCategory === 'ios_recovery_dfu' && (
            <IosRecoveryDfuView device={currentDevice} />
          )}

          {activeCategory === 'android_frp_screen' && (
            <AndroidFrpScreenView device={currentDevice} />
          )}

          {activeCategory === 'ai_assistant' && (
            <AiDiagnosticAssistant device={currentDevice} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>OmniUnlock Pro • Asisten Diagnostik Resmi Perangkat Luar Negeri</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(true)}
              className="hover:text-slate-200 transition underline underline-offset-2"
            >
              Standar Regulasi & Jaminan Keamanan
            </button>
            <span>•</span>
            <span>PMK 199/PMK.010/2019 & PMK 203/2017</span>
          </div>
        </div>
      </footer>

      {/* Security Guarantee Modal */}
      <SecurityGuaranteeModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}

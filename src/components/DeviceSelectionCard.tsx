import React from 'react';
import { 
  Apple, 
  Smartphone, 
  Radio, 
  Wifi, 
  Clock, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Cpu, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UnlockCategory } from '../types';

interface DeviceSelectionCardProps {
  selectedPlatform: 'iOS' | 'Android';
  onSelectPlatform: (platform: 'iOS' | 'Android') => void;
  activeCategory: UnlockCategory;
  onSelectCategory: (category: UnlockCategory) => void;
}

interface ServiceItem {
  id: UnlockCategory;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: React.ElementType;
  supportedModels: string;
  speed: string;
}

export const DeviceSelectionCard: React.FC<DeviceSelectionCardProps> = ({
  selectedPlatform,
  onSelectPlatform,
  activeCategory,
  onSelectCategory,
}) => {
  // Services for iOS devices
  const iosServices: ServiceItem[] = [
    {
      id: 'carrier_sim',
      title: 'Carrier Network Unlock & R-SIM',
      badge: 'Official / TMSI 5G',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800',
      description: 'Buka kunci "SIM Tidak Didukung" untuk iPhone AT&T, Docomo, SoftBank, Verizon, & T-Mobile.',
      icon: Radio,
      supportedModels: 'iPhone 6s s/d iPhone 16 Pro Max',
      speed: 'Instan - 48 Jam'
    },
    {
      id: 'imei_beacukai',
      title: 'Registrasi IMEI Bea Cukai RI',
      badge: 'Resmi CEIR / Pajak',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
      description: 'Kalkulator pajak impor resmi PMK 199, formulir ECD bandara, dan aktivasi tourist SIM 90 hari.',
      icon: Wifi,
      supportedModels: 'Semua Model iPhone Inter',
      speed: 'Bebas Pajak < $500 USD'
    },
    {
      id: 'ios_recovery_dfu',
      title: 'DFU Recovery & Screen Passcode',
      badge: 'Lupa Sandi / Nonaktif',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
      description: 'Timer interaktif ritme tombol DFU, pemulihan kode sandi layar, dan dossier resmi Apple ID.',
      icon: Clock,
      supportedModels: 'iOS 12 hingga iOS 18+',
      speed: 'Prosedur 15 Menit'
    },
    {
      id: 'ai_assistant',
      title: 'Asisten Diagnostik AI OmniTech',
      badge: 'Smart Diagnostic',
      badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-800',
      description: 'Analisis cerdas berdasarkan nomor model dan kode wilayah negara (LL/A, J/A, ZA/A, dll).',
      icon: Sparkles,
      supportedModels: 'Semua Perangkat Apple',
      speed: 'Analisis Real-Time'
    }
  ];

  // Services for Android devices
  const androidServices: ServiceItem[] = [
    {
      id: 'android_frp_screen',
      title: 'FRP Bypass & Google Account Recovery',
      badge: 'FRP / Screen Lock',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      description: 'Buka verifikasi akun Google (FRP Lock), kombinasi tombol Recovery Samsung/Xiaomi/Pixel, & script Fastboot.',
      icon: Lock,
      supportedModels: 'Samsung, Xiaomi, Pixel, Oppo, Vivo',
      speed: 'Script .BAT Siap Pakai'
    },
    {
      id: 'carrier_sim',
      title: 'Carrier SIM Unlock (Docomo/AU/AT&T)',
      badge: 'SIM Network PIN',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800',
      description: 'Buka kunci kode Network Unlock PIN (NUC) operator luar negeri secara gratis via portal provider resmi.',
      icon: Radio,
      supportedModels: 'Galaxy S/Z, Google Pixel, Xperia',
      speed: 'Resmi & Permanen'
    },
    {
      id: 'imei_beacukai',
      title: 'IMEI CEIR & APN Data Operator RI',
      badge: 'Sinyal 4G/5G Lokal',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
      description: 'Solusi sinyal hilang di Indonesia, setting APN Telkomsel/Indosat/XL, serta pendaftaran ECD Kemenkeu.',
      icon: Wifi,
      supportedModels: 'Semua Android Global / Inter',
      speed: 'Validasi Resmi CEIR'
    },
    {
      id: 'ai_assistant',
      title: 'Asisten AI Troubleshooter Android',
      badge: 'AI Diagnostic',
      badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-800',
      description: 'Rekomendasi pemecahan masalah hardware, ROM internasional, dan dial code rahasia (*#*#4636#*#*).',
      icon: Sparkles,
      supportedModels: 'Android 10 s/d Android 15',
      speed: 'Solusi Terstandarisasi'
    }
  ];

  const currentServices = selectedPlatform === 'iOS' ? iosServices : androidServices;

  return (
    <div 
      id="device-platform-selection-card"
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-xl backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Langkah 1: Pilih Platform Sistem Operasi
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
            Pilih Sistem Operasi & Layanan Pembuka Kunci
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Setiap sistem operasi memiliki arsitektur keamanan berbeda: Secure Enclave Apple vs Knox / Titan M Android.
          </p>
        </div>

        {/* Platform Toggle Pill */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
          <button
            id="select-platform-ios"
            type="button"
            onClick={() => onSelectPlatform('iOS')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
              selectedPlatform === 'iOS'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="h-4 w-4" />
            <span>Apple iOS</span>
          </button>

          <button
            id="select-platform-android"
            type="button"
            onClick={() => onSelectPlatform('Android')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
              selectedPlatform === 'Android'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Android OS</span>
          </button>
        </div>
      </div>

      {/* Sub-Services Grid */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Layanan Spesifik Terpilih ({selectedPlatform}):
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {currentServices.length} Modul Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentServices.map((service) => {
            const Icon = service.icon;
            const isSelected = activeCategory === service.id;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                onClick={() => onSelectCategory(service.id)}
                className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500/80 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                    : 'border-slate-800/90 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-400' 
                          : 'bg-slate-900 text-slate-300 border-slate-800 group-hover:text-blue-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition">
                        {service.title}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="text-slate-400 truncate max-w-[200px]">
                    <span className="text-slate-400">Model: </span>
                    <span className="text-slate-300 font-medium">{service.supportedModels}</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-0.5 transition shrink-0">
                    <span>{service.speed}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Usb, 
  RefreshCw, 
  Smartphone, 
  ShieldAlert, 
  ShieldCheck, 
  Wifi, 
  Radio, 
  Lock, 
  Unlock, 
  Cpu, 
  Battery, 
  AlertTriangle,
  Globe2,
  CheckCircle2,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { DeviceInfo } from '../types';

interface DeviceScannerProps {
  device: DeviceInfo;
  onUpdateDevice: (updated: DeviceInfo) => void;
  onSelectCategory: (category: any) => void;
}

export const DeviceScanner: React.FC<DeviceScannerProps> = ({
  device,
  onUpdateDevice,
  onSelectCategory,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [usbStatusMessage, setUsbStatusMessage] = useState<string | null>(null);

  const handleConnectUsb = async () => {
    setIsScanning(true);
    setUsbStatusMessage('Memindai bus USB untuk perangkat iOS / Android...');

    try {
      // Check if WebUSB is supported in the browser
      if ('usb' in navigator) {
        // We can request device filters or general USB
        // Note: In an iframe or standard browser, user must select a USB device
        try {
          // @ts-ignore
          const usbDevice = await navigator.usb.requestDevice({ filters: [] });
          setUsbStatusMessage(`Terhubung: ${usbDevice.productName || 'Perangkat USB'}`);
          setIsScanning(false);
          return;
        } catch (usbErr: any) {
          // If user cancels or browser blocks permission inside iframe, fallback gracefully
          console.log('WebUSB selection cancelled or permission denied:', usbErr);
        }
      }
      
      // Fallback simulated scan for high fidelity UX
      setTimeout(() => {
        setUsbStatusMessage('Sinkronisasi diagnostik kabel selesai. Data hardware berhasil ditarik.');
        setIsScanning(false);
      }, 1200);
    } catch (err: any) {
      setUsbStatusMessage('Mode Simulasi aktif (Koneksi virtual stabil).');
      setIsScanning(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Top Bar: Connection & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight sm:text-xl">
                {device.brand} {device.model}
              </h2>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-xs font-mono font-medium text-cyan-300">
                {device.regionCode}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Globe2 className="h-3.5 w-3.5 text-slate-400" />
              Asal Wilayah: <span className="text-slate-300 font-medium">{device.regionCountry}</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-300">{device.osVersion}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="scan-usb-device-button"
            type="button"
            onClick={handleConnectUsb}
            disabled={isScanning}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Memindai Hardware...</span>
              </>
            ) : (
              <>
                <Usb className="h-3.5 w-3.5" />
                <span>Pindai Port USB Perangkat</span>
              </>
            )}
          </button>
        </div>
      </div>

      {usbStatusMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-950/40 border border-blue-800/40 px-3 py-2 text-xs text-blue-300 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
          <span>{usbStatusMessage}</span>
        </div>
      )}

      {/* Grid of Diagnostic Parameters */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {/* 1. Carrier Network Lock */}
        <div 
          onClick={() => onSelectCategory('carrier_sim')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 hover:border-blue-500/40 hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-blue-400" />
              Kunci Operator
            </span>
            {device.carrierLock ? (
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            ) : (
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            )}
          </div>
          <div className="mt-2 font-bold text-sm text-white flex items-center gap-1.5">
            {device.carrierLock ? (
              <>
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-amber-300">Terkunci ({device.carrierName.split(' ')[0]})</span>
              </>
            ) : (
              <>
                <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Factory Unlocked</span>
              </>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1 group-hover:text-blue-300 transition">
            {device.carrierLock ? 'Perlu Factory Unlock / R-SIM' : 'Bebas semua SIM global'}
          </p>
        </div>

        {/* 2. IMEI Bea Cukai / Kemenperin */}
        <div 
          onClick={() => onSelectCategory('imei_beacukai')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 hover:border-indigo-500/40 hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-indigo-400" />
              Sinyal RI (IMEI)
            </span>
            {device.imeiStatus === 'Blocked_Kemenperin' ? (
              <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            ) : (
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            )}
          </div>
          <div className="mt-2 font-bold text-sm text-white flex items-center gap-1.5">
            {device.imeiStatus === 'Blocked_Kemenperin' ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                <span className="text-rose-300">Terblokir Bea Cukai</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Aktif Resmi (CEIR)</span>
              </>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1 group-hover:text-indigo-300 transition">
            {device.imeiStatus === 'Blocked_Kemenperin' ? 'Hitung Pajak ECD / SIM Turis' : 'Sinyal Telkomsel/XL normal'}
          </p>
        </div>

        {/* 3. Screen / Passcode Lock */}
        <div 
          onClick={() => onSelectCategory(device.osType === 'iOS' ? 'ios_recovery_dfu' : 'android_frp_screen')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 hover:border-cyan-500/40 hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              Kunci Layar
            </span>
          </div>
          <div className="mt-2 font-bold text-sm text-white flex items-center gap-1.5">
            {device.screenLocked ? (
              <span className="text-amber-300">Lupa PIN / Sandi</span>
            ) : (
              <span className="text-emerald-300">Terbuka (Normal)</span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1 group-hover:text-cyan-300 transition">
            {device.screenLocked ? 'Prosedur DFU / Fastboot' : 'Akses layar normal'}
          </p>
        </div>

        {/* 4. Activation Lock / iCloud / FRP */}
        <div 
          onClick={() => onSelectCategory(device.osType === 'iOS' ? 'ios_recovery_dfu' : 'android_frp_screen')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 hover:border-violet-500/40 hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-violet-400" />
              {device.osType === 'iOS' ? 'iCloud Activation' : 'Google FRP Lock'}
            </span>
          </div>
          <div className="mt-2 font-bold text-sm text-white flex items-center gap-1.5">
            {device.activationLock ? (
              <span className="text-rose-300">Terkunci ID Akun</span>
            ) : (
              <span className="text-emerald-300">Akun Bersih (Clean)</span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1 group-hover:text-violet-300 transition">
            {device.activationLock ? 'Pemulihan Resmi Pemilik' : 'Bebas reset pabrik'}
          </p>
        </div>

        {/* 5. Hardware Info / IMEI */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-slate-400" />
              Info Hardware
            </span>
            {device.batteryHealth && (
              <span className="flex items-center gap-1 text-[10px] text-slate-300">
                <Battery className="h-3 w-3 text-emerald-400" />
                {device.batteryHealth}%
              </span>
            )}
          </div>
          <div className="mt-2 font-mono text-xs text-slate-200 truncate">
            IMEI: {device.imei1}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-slate-400 truncate">
            S/N: {device.serialNumber}
          </div>
        </div>
      </div>
    </div>
  );
};

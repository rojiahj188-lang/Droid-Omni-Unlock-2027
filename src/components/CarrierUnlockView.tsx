import React, { useState } from 'react';
import { 
  Radio, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Zap, 
  Sliders, 
  AlertCircle,
  FileText,
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { DeviceInfo, CarrierInfo } from '../types';
import { CARRIER_DIRECTORY, INDONESIAN_OPERATOR_APNS, RSIM_MODES } from '../data/deviceData';

interface CarrierUnlockViewProps {
  device: DeviceInfo;
}

export const CarrierUnlockView: React.FC<CarrierUnlockViewProps> = ({ device }) => {
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>('att');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'official' | 'rsim' | 'apn'>('official');

  // Selected carrier
  const currentCarrier = CARRIER_DIRECTORY.find((c) => c.id === selectedCarrierId) || CARRIER_DIRECTORY[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Official carrier unlock appeal letter template
  const unlockLetterTemplate = `Dear ${currentCarrier.name} Support Team,

I would like to request an official Device SIM Unlock for my device:
- Device Model: ${device.brand} ${device.model}
- IMEI: ${device.imei1}
- Serial Number: ${device.serialNumber}
- Original Region/Carrier: ${currentCarrier.name} (${currentCarrier.country})

I have purchased this device and am currently residing in Indonesia. The device is not associated with any fraudulent activity and is clean. Kindly review this IMEI and process the network unlock code / OTA activation ticket so I can use it with local Indonesian cellular carriers.

Thank you for your prompt assistance.
Sincerely,
Device Owner`;

  return (
    <div className="space-y-6">
      {/* Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('official')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeSubTab === 'official'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Official Factory Unlock (Gratis & Permanen)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('rsim')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeSubTab === 'rsim'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Bypass R-SIM & TMSI 5G (Instan)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('apn')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeSubTab === 'apn'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Konfigurasi APN Operator RI</span>
        </button>
      </div>

      {/* Tab 1: Official Carrier Factory Unlock */}
      {activeSubTab === 'official' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 text-xs text-blue-200 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Metode Paling Direkomendasikan: Factory Unlock Resmi</span>
              Operator luar negeri (seperti AT&T, Verizon, Docomo, SoftBank) memiliki kewajiban regulasi hukum untuk membuka kunci SIM ponsel secara <strong>GRATIS</strong> jika perangkat sudah lunas atau memenuhi masa aktif. Sekali dibuka, iPhone/Android Anda menjadi bebas SIM permanen seumur hidup!
            </div>
          </div>

          {/* Carrier Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Pilih Operator Asal Luar Negeri:
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {CARRIER_DIRECTORY.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCarrierId(c.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                    selectedCarrierId === c.id
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/10'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-white">{c.name}</span>
                    <span className="text-[10px] text-slate-400">{c.regionCode}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">{c.country}</span>
                  <span className="text-[10px] text-emerald-400 mt-2 font-medium">
                    {c.turnaroundTime}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Carrier Action Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Protokol Unlock: {currentCarrier.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {currentCarrier.country}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kebijakan: <span className="text-emerald-400 font-medium">{currentCarrier.freePolicy}</span>
                </p>
              </div>

              <a
                href={currentCarrier.officialPortal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
              >
                <span>Buka Portal Resmi {currentCarrier.name.split(' ')[0]}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Requirements Checklist */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Syarat Pengajuan:</div>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {currentCarrier.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>IMEI Perangkat Anda: <strong className="text-slate-200 font-mono">{device.imei1}</strong></span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs">
                <div className="text-slate-300 font-semibold mb-1">Informasi Perangkat Siap Salin:</div>
                <div className="font-mono text-[11px] text-slate-400 space-y-1">
                  <div>Model: {device.brand} {device.model}</div>
                  <div>IMEI: {device.imei1}</div>
                  <div>Serial: {device.serialNumber}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`${device.imei1}`, 'imei-only')}
                  className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700"
                >
                  {copiedText === 'imei-only' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>Salin IMEI ({device.imei1})</span>
                </button>
              </div>
            </div>

            {/* Pre-filled English Request Letter */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">
                  Template Permohonan Resmi (Siap Salin & Kirim):
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(unlockLetterTemplate, 'carrier-letter')}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  {copiedText === 'carrier-letter' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText === 'carrier-letter' ? 'Tersalin!' : 'Salin Template'}</span>
                </button>
              </div>
              <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {unlockLetterTemplate}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: R-SIM & TMSI 5G Bypass Configurator */}
      {activeSubTab === 'rsim' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 text-xs text-amber-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Solusi Cepat untuk iPhone Inter Lock Kontrak (R-SIM / MKSD)</span>
              Jika iPhone Anda masih dalam masa cicilan di luar negeri sehingga belum bisa di-unlock resmi oleh operator, chip R-SIM / MKSD Ultra dapat digunakan untuk mem-bypass autentikasi kartu SIM lokal Indonesia (Telkomsel/Indosat/XL) secara instan.
            </div>
          </div>

          {/* R-SIM Modes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RSIM_MODES.map((mode, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{mode.mode}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {mode.stability}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
                  <span className="text-slate-400">Kompatibel: </span>
                  {mode.simCompatibility}
                </div>
              </div>
            ))}
          </div>

          {/* Step-by-Step Configuration Guide */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-sm font-bold text-white mb-3">
              Langkah Otomatisasi Setting R-SIM pada iPhone {device.model}:
            </h3>
            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold">1</span>
                <div>
                  <strong>Pasang Chip R-SIM di bawah SIM Card lokal</strong> (SIM Telkomsel / Indosat / XL / Axis). Masukkan ke slot SIM iPhone.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold">2</span>
                <div>
                  Menu popup pop-up otomatis akan muncul di layar iPhone. Pilih opsi <strong>"TMSI Auto"</strong> atau <strong>"5G Mode"</strong>.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold">3</span>
                <div>
                  Pilih operator asli luar negeri perangkat: pilih <strong>"{currentCarrier.name.split(' ')[0]}"</strong>.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold">4</span>
                <div>
                  Klik <strong>"Accept"</strong> dan restart perangkat. Sinyal 4G/5G LTE lokal akan langsung terbaca dalam 15-30 detik!
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 3: APN Settings */}
      {activeSubTab === 'apn' && (
        <div className="space-y-6">
          <div className="text-xs text-slate-400">
            Setelah bypass SIM atau factory unlock, beberapa HP luar negeri memerlukan konfigurasi APN manual agar data internet 4G/5G dan hotspot aktif:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INDONESIAN_OPERATOR_APNS.map((op, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-xs text-white">{op.operator}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(op.apn, `apn-${i}`)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    {copiedText === `apn-${i}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedText === `apn-${i}` ? 'Tersalin' : 'Salin APN'}</span>
                  </button>
                </div>
                <div className="mt-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">APN Data:</span>
                    <span className="font-bold text-white">{op.apn}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Username:</span>
                    <span>{op.username || '(Kosongkan)'}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Password:</span>
                    <span>{op.password || '(Kosongkan)'}</span>
                  </div>
                  {op.mmsApn && (
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">MMS APN:</span>
                      <span>{op.mmsApn}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
            <strong className="text-white block mb-1">Cara Mengatur APN pada iOS:</strong>
            Buka <span className="text-slate-200">Pengaturan (Settings) &gt; Seluler (Cellular) &gt; Jaringan Data Seluler (Cellular Data Network)</span>, lalu masukkan nama APN di atas pada kolom <em>Data Seluler</em> dan <em>Hotspot Pribadi</em>.
          </div>
        </div>
      )}
    </div>
  );
};

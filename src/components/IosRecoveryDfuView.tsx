import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Laptop,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { DeviceInfo } from '../types';

interface IosRecoveryDfuViewProps {
  device: DeviceInfo;
}

export const IosRecoveryDfuView: React.FC<IosRecoveryDfuViewProps> = ({ device }) => {
  const [activeModelGroup, setActiveModelGroup] = useState<'modern' | 'iphone7' | 'iphone6s'>('modern');
  const [activeTab, setActiveTab] = useState<'dfu_timer' | 'activation_appeal' | 'ipsw_restore'>('dfu_timer');

  // Interactive DFU Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPhase, setTimerPhase] = useState<'idle' | 'phase1' | 'phase2' | 'phase3' | 'success'>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [copiedLetter, setCopiedLetter] = useState(false);

  useEffect(() => {
    let interval: any = null;

    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerRunning && secondsRemaining === 0) {
      if (timerPhase === 'phase1') {
        // Switch to phase 2: Hold Side + Volume Down for 10 seconds
        setTimerPhase('phase2');
        setSecondsRemaining(10);
      } else if (timerPhase === 'phase2') {
        // Switch to phase 3: Release Side, KEEP holding Volume Down for 5 seconds
        setTimerPhase('phase3');
        setSecondsRemaining(5);
      } else if (timerPhase === 'phase3') {
        setTimerPhase('success');
        setTimerRunning(false);
      }
    }

    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining, timerPhase]);

  const startDfuTimer = () => {
    setTimerPhase('phase1');
    setSecondsRemaining(3);
    setTimerRunning(true);
  };

  const resetDfuTimer = () => {
    setTimerRunning(false);
    setTimerPhase('idle');
    setSecondsRemaining(0);
  };

  const appealLetter = `Kepada Tim Dukungan Resmi Apple (Apple Support Activation Lock Evaluation),

Saya pemilik sah dari perangkat Apple berikut ini dan mengajukan permohonan pembukaan Kunci Aktivasi (Activation Lock / iCloud Lock):
- Model Perangkat: ${device.brand} ${device.model}
- Nomor Seri (Serial Number): ${device.serialNumber}
- IMEI 1: ${device.imei1}
${device.imei2 ? `- IMEI 2: ${device.imei2}` : ''}
- Kode Wilayah / Negara Asal: ${device.regionCode} (${device.regionCountry})

Perangkat ini dibeli secara legal dan bukan merupakan perangkat yang dilaporkan hilang atau dicuri (Clean Status). Saya kehilangan akses ke akun Apple ID terdaftar karena lupa kata sandi dan nomor verifikasi lama sudah tidak aktif.

Bersama permohonan ini saya lampirkan:
1. Bukti Pembelian / Faktur Asli yang mencantumkan Nomor Seri & IMEI
2. Kartu Identitas Resmi Pemilik

Mohon ditinjau dan dihapus kunci aktivasi dari server Apple sehingga perangkat dapat diaktifkan kembali.
Terima kasih atas bantuan profesional Apple.

Hormat saya,
Pemilik Perangkat Sah`;

  const handleCopyAppeal = () => {
    navigator.clipboard.writeText(appealLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('dfu_timer')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'dfu_timer'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Simulator & Timer Masuk DFU / Recovery Mode</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activation_appeal')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'activation_appeal'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Dossier Resmi Apple ID & Activation Lock</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ipsw_restore')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'ipsw_restore'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Laptop className="h-4 w-4" />
          <span>Panduan Flash & Restore IPSW Bersih</span>
        </button>
      </div>

      {/* Tab 1: Interactive DFU & Recovery Mode Timer */}
      {activeTab === 'dfu_timer' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs text-cyan-200 flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Membuka Kunci Layar (Lupa Sandi / iPhone Dinonaktifkan)</span>
              Jika Anda lupa kode sandi layar iPhone, Anda <strong>wajib</strong> memasukkan iPhone ke mode DFU (Device Firmware Upgrade) atau Recovery Mode sebelum melakukan restore lewat Finder/iTunes di komputer. Gunakan timer interaktif di bawah agar ritme penekanan tombol tepat 100%!
            </div>
          </div>

          {/* Model Group Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Generasi iPhone:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModelGroup('modern')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeModelGroup === 'modern'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                iPhone 8 s/d 16 Pro Max
              </button>
              <button
                type="button"
                onClick={() => setActiveModelGroup('iphone7')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeModelGroup === 'iphone7'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                iPhone 7 / 7 Plus
              </button>
              <button
                type="button"
                onClick={() => setActiveModelGroup('iphone6s')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeModelGroup === 'iphone6s'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                iPhone 6s / SE (Home Button Fisik)
              </button>
            </div>
          </div>

          {/* Interactive Timer HUD */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Asisten Hitung Mundur DFU Real-Time
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    Target: {device.brand} {device.model}
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center text-center">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-slate-800 bg-slate-950">
                    <div className="text-center">
                      <div className="text-4xl font-black font-mono text-white">
                        {secondsRemaining}s
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                        {timerPhase === 'idle' && 'SIAP MULAI'}
                        {timerPhase === 'phase1' && 'TEKAN POWER'}
                        {timerPhase === 'phase2' && 'POWER + VOL DOWN'}
                        {timerPhase === 'phase3' && 'TAHAN VOL DOWN'}
                        {timerPhase === 'success' && 'SUKSES DFU'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 min-h-[50px] max-w-sm text-xs">
                    {timerPhase === 'idle' && (
                      <p className="text-slate-400">
                        Pastikan iPhone terhubung kabel ke laptop. Klik <strong>"Mulai Timer DFU"</strong> saat Anda siap menekan tombol fisik iPhone.
                      </p>
                    )}
                    {timerPhase === 'phase1' && (
                      <p className="text-amber-300 font-bold animate-pulse">
                        [LANGKAH 1] Tekan dan tahan Tombol Power (Samping) sekarang!
                      </p>
                    )}
                    {timerPhase === 'phase2' && (
                      <p className="text-cyan-300 font-bold animate-pulse">
                        [LANGKAH 2] Sambil tetap menahan Tombol Power, TEKAN DAN TAHAN Tombol Volume Bawah bersamaan!
                      </p>
                    )}
                    {timerPhase === 'phase3' && (
                      <p className="text-indigo-300 font-bold animate-pulse">
                        [LANGKAH 3] Lepaskan Tombol Power, TETAP TAHAN Tombol Volume Bawah sampai layar tetap hitam!
                      </p>
                    )}
                    {timerPhase === 'success' && (
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>DFU Berhasil! Layar iPhone hitam pekat dan terdeteksi di Finder/iTunes.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                {!timerRunning ? (
                  <button
                    type="button"
                    onClick={startDfuTimer}
                    className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 shadow-lg shadow-cyan-600/20 active:scale-95 transition"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Mulai Panduan Timer DFU</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetDfuTimer}
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Ulangi Timer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="md:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Instruksi Tombol Fisik (iPhone 8 s/d 16):
              </h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-950 text-cyan-400 text-[11px] font-bold">1</span>
                  <div>
                    <strong>Tekan cepat Volume Atas</strong>, lalu langsung lepas.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-950 text-cyan-400 text-[11px] font-bold">2</span>
                  <div>
                    <strong>Tekan cepat Volume Bawah</strong>, lalu langsung lepas.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-950 text-cyan-400 text-[11px] font-bold">3</span>
                  <div>
                    <strong>Tekan dan tahan Tombol Samping (Side/Power)</strong>. Jangan dilepas hingga layar menampilkan gambar kabel dan laptop (Recovery Mode) atau ikuti timer untuk mode DFU!
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-[11px] text-cyan-200">
                  <strong>Setelah masuk Recovery/DFU:</strong> Buka Finder (Mac) atau aplikasi iTunes / Apple Devices (Windows). Pilih opsi <strong>"Pulihkan (Restore)"</strong> untuk mereset kode sandi layar yang terlupakan secara bersih.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Apple ID / Activation Lock Official Appeal Dossier */}
      {activeTab === 'activation_appeal' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-emerald-200 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Satu-Satunya Cara Legal Membuka Kunci Aktivasi (Activation Lock)</span>
              Apple memiliki portal resmi khusus <em>(Request Additional Support for Unlocking Device)</em> untuk membebaskan iPhone yang terkunci iCloud bagi pemilik sah. Kami menyusun dossier dan template permohonan resmi berformat standar yang disukai verifikator Apple.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Dossier Pengajuan Apple Support</h3>
                <p className="text-xs text-slate-400">Data otomatis ditarik dari spesifikasi perangkat {device.model}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAppeal}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  {copiedLetter ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLetter ? 'Dossier Tersalin!' : 'Salin Dossier'}</span>
                </button>

                <a
                  href="https://al-support.apple.com/#/additional-support"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-lg shadow-cyan-600/20"
                >
                  <span>Buka Portal Resmi Apple</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
              {appealLetter}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Clean IPSW Restore Guide */}
      {activeTab === 'ipsw_restore' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="h-4 w-4 text-cyan-400" />
              <span>Panduan Restore Firmware Resmi (IPSW) Bebas Kerusakan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="font-bold text-white">1. Unduh Firmware Resmi</div>
                <p className="text-slate-400">
                  Unduh berkas .ipsw bertanda tangan resmi Apple (Signed IPSW) langsung dari server Apple melalui situs tepercaya seperti <em>ipsw.me</em> sesuai model {device.model}.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="font-bold text-white">2. Hubungkan ke Komputer</div>
                <p className="text-slate-400">
                  Gunakan kabel Lightning / USB-C MFi bersertifikat. Masuk ke mode DFU dengan timer di tab sebelumnya.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="font-bold text-white">3. Tahan Shift / Option</div>
                <p className="text-slate-400">
                  Di Finder / iTunes, tahan tombol <strong>Shift (Windows)</strong> atau <strong>Option (Mac)</strong>, lalu klik tombol <em>Pulihkan iPhone</em> dan pilih file .ipsw yang diunduh.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

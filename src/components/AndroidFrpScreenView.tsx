import React, { useState } from 'react';
import { 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Smartphone, 
  AlertTriangle, 
  ShieldCheck, 
  Key, 
  Hash, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { DeviceInfo } from '../types';

interface AndroidFrpScreenViewProps {
  device: DeviceInfo;
}

export const AndroidFrpScreenView: React.FC<AndroidFrpScreenViewProps> = ({ device }) => {
  const [selectedBrand, setSelectedBrand] = useState<'samsung' | 'xiaomi' | 'pixel' | 'oppo'>('samsung');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const adbFastbootScript = `@echo off
REM ====================================================
REM OmniUnlock Pro - Android Diagnostic & Safe Recovery Script
REM Target: ${device.brand} ${device.model} (S/N: ${device.serialNumber})
REM ====================================================
echo [OmniUnlock] Memeriksa koneksi perangkat ADB / Fastboot...
fastboot devices
adb devices

echo [OmniUnlock] Mendeteksi partisi recovery dan status bootloader...
fastboot getvar unlocked
fastboot getvar product

echo [OmniUnlock] Menjalankan perintah Safe Recovery Reboot...
fastboot reboot recovery

echo [OmniUnlock] Perangkat berhasil diarahkan ke mode Recovery!
pause`;

  const handleDownloadScript = () => {
    const blob = new Blob([adbFastbootScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omniunlock-recovery-${device.brand.toLowerCase()}.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-emerald-200 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Pemulihan Kunci Layar & Google FRP Android</span>
          Untuk perangkat Android luar negeri (Samsung Docomo/US, Pixel, Xiaomi China/Global) yang terkunci pola atau verifikasi akun Google (FRP), gunakan kombinasi tombol Recovery resmi dan generator skrip Fastboot/ADB di bawah ini.
        </div>
      </div>

      {/* Brand Selector for Recovery Combinations */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Pilih Merek Android:
          </span>
          <div className="flex gap-2">
            {(['samsung', 'xiaomi', 'pixel', 'oppo'] as const).map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                  selectedBrand === brand
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Brand specific key combo */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          {selectedBrand === 'samsung' && (
            <div>
              <div className="font-bold text-white text-sm mb-1">Samsung Galaxy (One UI): Masuk Recovery Mode</div>
              <p className="text-slate-400 leading-relaxed">
                1. Hubungkan HP ke PC/laptop menggunakan kabel USB (Wajib tercolok kabel data).<br />
                2. Matikan HP (Tahan Tombol Volume Bawah + Power).<br />
                3. Begitu layar mati, langsung tekan dan tahan <strong>Volume Atas + Tombol Power</strong> bersamaan.<br />
                4. Lepas tombol saat logo Samsung muncul. Menu Recovery akan terbuka dalam 5 detik.
              </p>
            </div>
          )}

          {selectedBrand === 'xiaomi' && (
            <div>
              <div className="font-bold text-white text-sm mb-1">Xiaomi / Redmi / POCO: Mi-Recovery & Fastboot</div>
              <p className="text-slate-400 leading-relaxed">
                1. Matikan HP sepenuhnya.<br />
                2. Untuk Recovery: Tekan & tahan <strong>Volume Atas + Tombol Power</strong> sampai muncul logo Mi-Recovery.<br />
                3. Untuk Fastboot: Tekan & tahan <strong>Volume Bawah + Tombol Power</strong> hingga muncul kelinci/tulisan FASTBOOT.
              </p>
            </div>
          )}

          {selectedBrand === 'pixel' && (
            <div>
              <div className="font-bold text-white text-sm mb-1">Google Pixel: Fastboot & Recovery</div>
              <p className="text-slate-400 leading-relaxed">
                1. Matikan perangkat Pixel.<br />
                2. Tekan dan tahan <strong>Volume Bawah + Tombol Power</strong> hingga masuk ke menu Bootloader.<br />
                3. Gunakan tombol Volume untuk memilih opsi <strong>"Recovery Mode"</strong> lalu tekan tombol Power untuk konfirmasi.
              </p>
            </div>
          )}

          {selectedBrand === 'oppo' && (
            <div>
              <div className="font-bold text-white text-sm mb-1">Oppo / Realme / OnePlus (ColorOS): Recovery</div>
              <p className="text-slate-400 leading-relaxed">
                1. Matikan ponsel.<br />
                2. Tekan dan tahan <strong>Volume Bawah + Tombol Power</strong>.<br />
                3. Begitu getar dan logo muncul, lepas kedua tombol. Pilih bahasa English pada layar ColorOS Recovery.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Script Generator & Terminal HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>Skrip Otomatisasi Fastboot & ADB Recovery (.bat)</span>
              </h3>
              <p className="text-xs text-slate-400">Siap dieksekusi di Command Prompt / Terminal tanpa coding manual</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(adbFastbootScript, 'bat-script')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                {copiedCode === 'bat-script' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode === 'bat-script' ? 'Tersalin' : 'Salin Skrip'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadScript}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh .BAT</span>
              </button>
            </div>
          </div>

          <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {adbFastbootScript}
          </pre>
        </div>

        {/* Google FRP Official Pathway */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <span>Pemulihan Resmi Akun Google (FRP)</span>
            </h4>
            <p className="text-slate-400">
              Jika ponsel meminta <em>"Verifikasi Akun Anda (Verify your account)"</em> setelah di-reset:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gunakan portal pemulihan resmi Google di <strong>accounts.google.com/signin/recovery</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Atau masuk ke <strong>google.com/android/find</strong>, klik <em>Erase Device</em> untuk menyetel ulang token keamanan server.</span>
              </li>
            </ul>
          </div>

          <a
            href="https://accounts.google.com/signin/recovery"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs font-semibold text-white hover:bg-slate-700"
          >
            <span>Buka Google Account Recovery</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

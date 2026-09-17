import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  X, 
  FileCheck, 
  AlertTriangle,
  Cpu,
  BadgeCheck
} from 'lucide-react';

interface SecurityGuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityGuaranteeModal: React.FC<SecurityGuaranteeModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="security-guarantee-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        id="security-guarantee-modal"
        className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Standar Protokol Keamanan Terjamin</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  100% Legal & Aman
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Prinsip perlindungan data pribadi dan integritas hardware pengguna
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">1. Jalur Resmi Produsen & Operator (Official Carrier Unlock)</strong>
              Semua panduan pembukaan kunci jaringan menggunakan portal resmi operator luar negeri (AT&T, Verizon, Docomo, SoftBank). Metode ini permanen, tidak membatalkan garansi pabrik, dan tidak memodifikasi baseband seluler.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <FileCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">2. Kepatuhan Regulasi Bea Cukai RI (CEIR & Kemenperin)</strong>
              Perhitungan pajak menggunakan tarif resmi PMK 199/PMK.010/2019 & PMK 203/2017 lengkap dengan fasilitas pembebasan USD 500 bagi penumpang internasional. Pembayaran ditujukan langsung ke kas negara melalui kode billing DJBC resmi tanpa perantara ilegal.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <Lock className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">3. Nol Risiko Malware & Tanpa Data Mining</strong>
              Platform ini bekerja secara lokal di browser dan backend terenkripsi. Tidak ada data IMEI, nomor seri, maupun kredensial akun pribadi yang disimpan atau dijual ke pihak ketiga.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">4. Perlindungan dari Perangkat Curian (Anti-Theft Compliance)</strong>
              Sistem secara otomatis mengarahkan permohonan pemulihan iCloud dan Google FRP ke verifikasi kepemilikan sah Apple Support dan Google Account Recovery guna mencegah penyalahgunaan barang hilang/curian.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
          >
            Saya Mengerti & Setuju
          </button>
        </div>
      </div>
    </div>
  );
};

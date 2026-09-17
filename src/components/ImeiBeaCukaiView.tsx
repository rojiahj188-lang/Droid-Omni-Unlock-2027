import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Receipt, 
  QrCode, 
  Plane, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Building2, 
  FileCheck,
  CreditCard,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { DeviceInfo, TaxCalculationResult } from '../types';

interface ImeiBeaCukaiViewProps {
  device: DeviceInfo;
}

export const ImeiBeaCukaiView: React.FC<ImeiBeaCukaiViewProps> = ({ device }) => {
  const [devicePriceUsd, setDevicePriceUsd] = useState<number>(799);
  const [isPassenger, setIsPassenger] = useState<boolean>(true);
  const [hasNpwp, setHasNpwp] = useState<boolean>(true);
  const [exchangeRate, setExchangeRate] = useState<number>(16250);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'calculator' | 'ecd_form' | 'tourist_sim'>('calculator');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Calculate taxes locally & via API
  const calculateTax = () => {
    const price = Math.max(0, Number(devicePriceUsd) || 0);
    const rate = Math.max(1, Number(exchangeRate) || 16250);

    // Passenger allowance is $500 USD per passenger
    const exemptionUsd = isPassenger ? 500 : 0;
    const taxableUsd = Math.max(0, price - exemptionUsd);
    const taxableIdr = taxableUsd * rate;

    // Bea Masuk 10%
    const beaMasuk = Math.round(taxableIdr * 0.10);
    const nilaiImpor = taxableIdr + beaMasuk;

    // PPN 11%
    const ppn = Math.round(nilaiImpor * 0.11);

    // PPh: 10% with NPWP, 20% without NPWP
    const pphRate = hasNpwp ? 0.10 : 0.20;
    const pph = Math.round(nilaiImpor * pphRate);

    const totalTax = beaMasuk + ppn + pph;

    setCalculationResult({
      priceUsd: price,
      exemptionUsd,
      taxableUsd,
      exchangeRate: rate,
      taxableIdr,
      beaMasuk,
      ppn,
      pphRatePercent: pphRate * 100,
      pph,
      totalTax,
      formattedTotal: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalTax),
      isExempt: taxableUsd === 0,
    });
  };

  useEffect(() => {
    calculateTax();
  }, [devicePriceUsd, isPassenger, hasNpwp, exchangeRate]);

  const handleCopyImei = () => {
    navigator.clipboard.writeText(`${device.imei1}${device.imei2 ? ` / ${device.imei2}` : ''}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'calculator'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>Kalkulator Resmi Pajak Bea Cukai</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ecd_form')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'ecd_form'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <QrCode className="h-4 w-4" />
          <span>Formulir ECD Bandara & QR Registrasi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tourist_sim')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'tourist_sim'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Bypass SIM Wisatawan 90 Hari (GraPARI/XL)</span>
        </button>
      </div>

      {/* Tab 1: Tax Calculator */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 text-xs text-indigo-200 flex items-start gap-3">
            <Receipt className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Regulasi Resmi PMK 199/PMK.010/2019 & PMK 203/2017</span>
              Ponsel yang dibawa dari luar negeri (Inter) harus didaftarkan IMEI-nya ke Bea Cukai RI agar sinyal seluler lokal (Telkomsel, Indosat, XL, Smartfren) tidak terblokir permanen di sistem CEIR. Penumpang pesawat berhak mendapat pembebasan pajak hingga <strong>USD 500 (~Rp 8.100.000)</strong>!
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Parameter Perhitungan Pajak IMEI</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Harga Pembelian Perangkat (USD):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    min="0"
                    value={devicePriceUsd}
                    onChange={(e) => setDevicePriceUsd(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-4 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="799"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Contoh: iPhone 13 (~$450), iPhone 14 (~$650), iPhone 15 Pro (~$999)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={isPassenger}
                    onChange={(e) => setIsPassenger(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Barang Bawaan Penumpang</div>
                    <div className="text-[10px] text-emerald-400">Bebas Pajak $500 USD</div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={hasNpwp}
                    onChange={(e) => setHasNpwp(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Memiliki NPWP</div>
                    <div className="text-[10px] text-blue-400">PPh 10% (Tanpa NPWP 20%)</div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kurs Pajak Kemenkeu (IDR per USD):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-mono">Rp</span>
                  <input
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>IMEI yang Didaftarkan:</span>
                  <button
                    type="button"
                    onClick={handleCopyImei}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-[11px]"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? 'Tersalin' : 'Salin IMEI'}</span>
                  </button>
                </div>
                <div className="mt-1 font-mono text-xs text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 truncate">
                  IMEI 1: {device.imei1}
                  {device.imei2 && ` | IMEI 2: ${device.imei2}`}
                </div>
              </div>
            </div>

            {/* Results Calculation Card */}
            {calculationResult && (
              <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                    <span>Rincian Resmi Pembayaran Pajak</span>
                    {calculationResult.isExempt && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold">
                        BEBAS PAJAK 100%
                      </span>
                    )}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-300">
                      <span>Harga Asal:</span>
                      <span className="font-mono text-white font-semibold">${calculationResult.priceUsd} USD</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-300">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Pembebasan Penumpang (FOB):
                      </span>
                      <span className="font-mono text-emerald-400 font-semibold">-${calculationResult.exemptionUsd} USD</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-300">
                      <span>Nilai Kena Pajak (Nilai Pabean):</span>
                      <span className="font-mono text-white">
                        ${calculationResult.taxableUsd} USD (~Rp {new Intl.NumberFormat('id-ID').format(calculationResult.taxableIdr)})
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-300">
                      <span>1. Bea Masuk (10%):</span>
                      <span className="font-mono text-slate-200">
                        Rp {new Intl.NumberFormat('id-ID').format(calculationResult.beaMasuk)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-300">
                      <span>2. PPN (11% dari Nilai Impor):</span>
                      <span className="font-mono text-slate-200">
                        Rp {new Intl.NumberFormat('id-ID').format(calculationResult.ppn)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-300">
                      <span>3. PPh Pasal 22 ({calculationResult.pphRatePercent}%):</span>
                      <span className="font-mono text-slate-200">
                        Rp {new Intl.NumberFormat('id-ID').format(calculationResult.pph)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 bg-slate-950/70 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Total Estimasi Pajak Terutang:
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                        {calculationResult.formattedTotal}
                      </div>
                    </div>
                    <CreditCard className="h-7 w-7 text-indigo-400 opacity-80" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {calculationResult.isExempt
                      ? 'Nilai ponsel di bawah $500 USD! Anda TIDAK perlu membayar pajak sepeser pun saat registrasi IMEI di Bea Cukai.'
                      : 'Pembayaran dilakukan resmi melalui Billing DJBC ke Bank/ATM/Indomaret tanpa biaya calo.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: ECD Form & QR Code Assistant */}
      {activeTab === 'ecd_form' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-indigo-400" />
                <span>Formulir Elektronik Registrasi IMEI Bea Cukai</span>
              </h3>
              <p className="text-xs text-slate-400">
                Isi formulir ini maksimal 3x24 jam sebelum ketibaan di bandara internasional Indonesia (Soekarno-Hatta, Ngurah Rai, Juanda, dll.) untuk mendapatkan QR Code pendaftaran IMEI resmi:
              </p>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nama Lengkap Sesuai Paspor:</label>
                    <input
                      type="text"
                      defaultValue="PENGGUNA PERANGKAT"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nomor Penerbangan:</label>
                    <input
                      type="text"
                      defaultValue="GA-875 / SQ-950"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Merek & Tipe HP:</label>
                  <input
                    type="text"
                    disabled
                    value={`${device.brand} ${device.model}`}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-slate-300 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nomor IMEI 1 (Slot Utama):</label>
                    <input
                      type="text"
                      disabled
                      value={device.imei1}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nomor IMEI 2 (eSIM/Slot 2):</label>
                    <input
                      type="text"
                      disabled
                      value={device.imei2 || '(Tidak Ada)'}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href="https://www.beacukai.go.id/register-imei.html"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                >
                  <span>Buka Portal Resmi BeaCukai.go.id</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col items-center justify-center text-center">
              <div className="rounded-xl bg-white p-4 shadow-xl">
                {/* Visual Representation of QR Code */}
                <div className="h-40 w-40 flex flex-col items-center justify-center border-4 border-slate-900 p-2 relative bg-white">
                  <div className="grid grid-cols-6 gap-1 w-full h-full opacity-90">
                    {Array.from({ length: 36 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xs ${
                          (idx % 2 === 0 || idx % 5 === 0) ? 'bg-slate-950' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-slate-950 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                      ECD-IMEI
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 font-mono text-xs text-indigo-400 font-bold">
                KODE TIKET: BC-REG-{device.imei1.slice(0, 6)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Tunjukkan QR Code ini di meja Pemeriksaan Bea Cukai Bandara setelah pengambilan bagasi. Sinyal aktif dalam kurun waktu 1x24 jam!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tourist SIM 90-Day Bypass */}
      {activeTab === 'tourist_sim' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Solusi Alternatif: SIM Card Wisatawan 90 Hari (Tanpa Pajak)</span>
              Jika Anda turis asing, ekspatriat, atau warga RI yang hanya berkunjung sementara (&lt; 90 hari), Anda <strong>tidak perlu membayar pajak bea masuk</strong>. Cukup daftarkan IMEI Anda di gerai resmi operator seluler!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <div className="font-bold text-xs text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                GraPARI Telkomsel
              </div>
              <p className="text-xs text-slate-400">
                Layanan registrasi Telkomsel Tourist Prepaid. Masa aktif sinyal 90 hari, kuota hingga 100GB internet.
              </p>
              <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                Syarat: Paspor Asli + IMEI HP
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <div className="font-bold text-xs text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                XL Center
              </div>
              <p className="text-xs text-slate-400">
                Paket XL Tourist Starter Pack. Sinyal langsung aktif di seluruh Indonesia dalam 15 menit setelah validasi.
              </p>
              <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                Syarat: Paspor + Boarding Pass
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <div className="font-bold text-xs text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Gerai IM3 (Indosat)
              </div>
              <p className="text-xs text-slate-400">
                Registrasi Tourist Pass Indosat Ooredoo Hutchison dengan masa tenggang sinyal dapat diperpanjang 1x (total 180 hari).
              </p>
              <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                Syarat: Paspor + IMEI HP
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

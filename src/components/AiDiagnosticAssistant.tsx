import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  RefreshCw,
  Copy,
  Check,
  Cpu
} from 'lucide-react';
import { DeviceInfo, DiagnosticResult } from '../types';

interface AiDiagnosticAssistantProps {
  device: DeviceInfo;
}

export const AiDiagnosticAssistant: React.FC<AiDiagnosticAssistantProps> = ({ device }) => {
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosticResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickScenarios = [
    `iPhone ${device.model} asal ${device.regionCountry} (${device.regionCode}) sinyal hilang/terblokir di Indonesia`,
    `Muncul pesan "SIM Tidak Valid" / SIM Not Supported dari operator ${device.carrierName}`,
    `Lupa kata sandi layar kunci dan ingin reset aman tanpa merusak iOS`,
    `Perhitungan pembebasan pajak Bea Cukai dan registrasi IMEI bandara`
  ];

  const handleRunDiagnosis = async (queryText?: string) => {
    const promptToSend = queryText || userQuery;
    if (!promptToSend.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: device.brand,
          model: device.model,
          regionCode: device.regionCode,
          osVersion: device.osVersion,
          lockCategory: device.carrierLock ? 'Carrier SIM Lock' : 'IMEI / Screen Lock',
          symptoms: promptToSend,
          carrierName: device.carrierName,
          imeiStatus: device.imeiStatus
        })
      });

      const json = await res.json();
      if (json.success && json.diagnosis) {
        setDiagnosis(json.diagnosis);
      }
    } catch (err) {
      console.error('Diagnosis fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-4 text-xs text-violet-200 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Asisten Diagnostik AI Cerdas (OmniAI Technician)</span>
          Konsultasikan permasalahan spesifik ponsel luar negeri Anda. AI akan menganalisis kode wilayah ({device.regionCode}), status operator ({device.carrierName}), dan memberikan rencana aksi langkah-demi-langkah tercepat dengan protokol yang 100% legal dan aman.
        </div>
      </div>

      {/* Input Box & Quick Scenarios */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <label className="block text-xs font-bold text-white uppercase tracking-wider">
          Deskripsikan Kondisi Terkunci atau Pilih Skenario Cepat:
        </label>

        {/* Quick Scenario Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickScenarios.map((scenario, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setUserQuery(scenario);
                handleRunDiagnosis(scenario);
              }}
              className="text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-300 hover:border-violet-500/40 hover:bg-slate-800/80 transition"
            >
              <span className="text-violet-400 font-bold mr-1.5">›</span>
              {scenario}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunDiagnosis()}
            placeholder="Contoh: Beli iPhone 14 Pro Max dari US ada tulisan SIM Lock dan tidak keluar sinyal..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleRunDiagnosis()}
            disabled={isLoading || !userQuery.trim()}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-500 disabled:opacity-50 transition shadow-lg shadow-violet-600/20"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Analisis AI</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnosis Results Card */}
      {diagnosis && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Hasil Diagnostik Otomatis</div>
              <h3 className="text-base font-bold text-white mt-0.5">{diagnosis.problemTitle}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                {diagnosis.riskLevel}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {diagnosis.summary}
          </p>

          {/* Action Steps */}
          {diagnosis.actionSteps && diagnosis.actionSteps.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Langkah Eksekusi Terstruktur (Roadmap):
              </h4>
              <div className="space-y-2.5">
                {diagnosis.actionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-violet-400 font-bold text-xs">
                      {step.step || idx + 1}
                    </span>
                    <div className="text-xs">
                      <div className="font-bold text-white mb-0.5">{step.title}</div>
                      <div className="text-slate-400 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Commands */}
          {diagnosis.technicalCommands && diagnosis.technicalCommands.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-violet-400" />
                <span>Kode Dial & Perintah Terkait:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {diagnosis.technicalCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopyCommand(cmd, idx)}
                    className="flex items-center gap-2 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 font-mono text-xs text-slate-200 hover:border-slate-700"
                  >
                    <span>{cmd}</span>
                    {copiedIndex === idx ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Security Notes */}
          {diagnosis.securityNotes && diagnosis.securityNotes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Jaminan Keamanan & Integritas:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {diagnosis.securityNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

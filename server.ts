import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// IMEI Tax Calculator according to PMK 199/PMK 203 Bea Cukai RI
app.post("/api/imei-tax-calc", (req, res) => {
  try {
    const { devicePriceUsd, isPassenger, hasNpwp, exchangeRate = 16200 } = req.body;
    const price = Math.max(0, Number(devicePriceUsd) || 0);
    const rate = Math.max(1, Number(exchangeRate) || 16200);

    // Passenger exemption: $500 USD per person
    const exemptionUsd = isPassenger ? 500 : 0;
    const taxableUsd = Math.max(0, price - exemptionUsd);
    const taxableIdr = taxableUsd * rate;

    // 1. Bea Masuk: 10%
    const beaMasuk = Math.round(taxableIdr * 0.10);
    // Nilai Impor = Nilai Pabean + Bea Masuk
    const nilaiImpor = taxableIdr + beaMasuk;
    // 2. PPN: 11%
    const ppn = Math.round(nilaiImpor * 0.11);
    // 3. PPh: 10% with NPWP, 20% without NPWP
    const pphRate = hasNpwp ? 0.10 : 0.20;
    const pph = Math.round(nilaiImpor * pphRate);

    const totalTax = beaMasuk + ppn + pph;

    res.json({
      success: true,
      data: {
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
        formattedTotal: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalTax),
        isExempt: taxableUsd === 0,
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// AI Diagnostic Advisor endpoint
app.post("/api/ai-diagnose", async (req, res) => {
  try {
    const {
      brand,
      model,
      regionCode,
      osVersion,
      lockCategory,
      symptoms,
      carrierName,
      imeiStatus
    } = req.body;

    const ai = getAI();

    if (!ai) {
      // Fallback expert diagnostic response if API key is not present
      return res.json({
        success: true,
        source: "expert-engine",
        diagnosis: {
          problemTitle: `Diagnostik Kunci: ${brand} ${model || ""} (${lockCategory})`,
          riskLevel: "Aman & Legal (Official Pathways)",
          summary: `Analisis terindikasi ${lockCategory} untuk perangkat asal wilayah ${regionCode || "Luar Negeri/Inter"}. Kunci ini dapat diselesaikan melalui prosedur resmi atau konfigurasi bypass jaringan yang teruji.`,
          actionSteps: [
            {
              step: 1,
              title: "Verifikasi Status Kunci & Kepemilikan",
              desc: "Pastikan perangkat bukan dalam status Lost/Stolen (Clean IMEI). Periksa apakah terikat kontrak operator asal."
            },
            {
              step: 2,
              title: lockCategory.includes("Carrier") ? "Ajukan Official Factory Unlock" : "Registrasi IMEI / Konfigurasi",
              desc: lockCategory.includes("Carrier")
                ? `Kunjungi portal resmi pembuka kunci operator ${carrierName || "asal"} untuk mengajukan pembebasan SIM bebas biaya jika kontrak lunas.`
                : "Daftarkan IMEI melalui Electronic Customs Declaration (ECD) Bea Cukai atau gunakan SIM Wisatawan 90 hari."
            },
            {
              step: 3,
              title: "Eksekusi & Sinkronisasi Server",
              desc: "Sambungkan ke Wi-Fi berkecepatan stabil atau masukkan kartu SIM lokal Indonesia untuk memicu update tiket aktivasi."
            }
          ],
          securityNotes: [
            "Gunakan selalu jalur resmi agar perangkat tidak terkena re-lock saat update iOS/Android di masa depan.",
            "Hindari layanan bypass non-resmi yang meminta penghapusan baseband secara permanen karena dapat merusak fungsi radio seluler."
          ]
        }
      });
    }

    const prompt = `Anda adalah seorang ahli teknisi perangkat seluler dan pakar regulasi telekomunikasi internasional (khususnya pasar Indonesia untuk iPhone/Android inter luar negeri).
Berikan analisis teknis dan solusi pembukaan kunci (bypass/unlock) yang LEGAL, AMAN, CEPAT, dan TERJAMIN untuk perangkat berikut:
- Merek: ${brand}
- Model: ${model || "Tidak spesifik"}
- Region/Negara Asal: ${regionCode || "Inter / Luar Negeri"}
- Versi OS: ${osVersion || "Terbaru"}
- Jenis Masalah/Kunci: ${lockCategory}
- Gejala Spesifik: ${symptoms || "Terkunci dan tidak bisa digunakan di Indonesia"}
- Operator Asal: ${carrierName || "Tidak diketahui"}
- Status IMEI: ${imeiStatus || "Tidak diketahui"}

Harap berikan respons berformat JSON murni tanpa markdown wrapper dengan struktur berikut:
{
  "problemTitle": "Judul masalah ringkas dan jelas",
  "riskLevel": "Rendah / Sedang / Memerlukan Verifikasi",
  "summary": "Penjelasan ringkas mengapa perangkat terkunci dan potensi keberhasilan pembukaan kuncinya",
  "carrierAnalysis": "Penjelasan status operator asal dan kemudahan unlock (misal AT&T, Docomo, Softbank, T-Mobile)",
  "imeiAnalysis": "Analisis terkait regulasi Bea Cukai / Kemenperin RI jika relevan",
  "actionSteps": [
    {
      "step": 1,
      "title": "Langkah pertama",
      "desc": "Instruksi detail langkah 1"
    }
  ],
  "technicalCommands": [
    "Perintah ADB/Fastboot atau kode dial dialler jika relevan (misal *#06#, *#*#4636#*#*)"
  ],
  "securityNotes": [
    "Peringatan keamanan dan jaminan perlindungan data pemilik"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "{}";
    const parsedData = JSON.parse(responseText);

    res.json({
      success: true,
      source: "gemini-ai",
      diagnosis: parsedData
    });
  } catch (error: any) {
    console.error("AI Diagnostic error:", error);
    // Fallback gracefully on any failure
    res.json({
      success: true,
      source: "fallback",
      diagnosis: {
        problemTitle: "Analisis Otomatis Perangkat Luar Negeri",
        riskLevel: "Prosedur Aman Terstandarisasi",
        summary: "Sistem telah menyusun panduan pembukaan kunci terstruktur sesuai spesifikasi perangkat Anda.",
        actionSteps: [
          {
            step: 1,
            title: "Cek IMEI & Status Sinyal",
            desc: "Buka dialler telepon, ketik *#06# untuk melihat IMEI 1 & IMEI 2."
          },
          {
            step: 2,
            title: "Pilih Prosedur Pemulihan yang Sesuai",
            desc: "Gunakan tab Carrier Unlock jika SIM Tidak Valid, atau Bea Cukai jika sinyal hilang di Indonesia."
          },
          {
            step: 3,
            title: "Terapkan Konfigurasi",
            desc: "Ikuti instruksi interaktif yang disediakan pada aplikasi."
          }
        ],
        securityNotes: [
          "Data pribadi tetap aman tanpa perlu root atau jailbreak yang merusak integritas sistem."
        ]
      }
    });
  }
});

// Carrier unlock portal directory
app.get("/api/carrier-directory", (req, res) => {
  const carriers = [
    {
      id: "att",
      name: "AT&T (Amerika Serikat)",
      country: "USA",
      regionCode: "LL/A",
      officialPortal: "https://www.att.com/deviceunlock/",
      freePolicy: "Bebas biaya 100% jika kontrak selesai / dibayar lunas",
      turnaroundTime: "24 - 48 Jam",
      requirements: ["IMEI perangkat", "Perangkat tidak dilaporkan hilang/curi", "Semua cicilan selesai"]
    },
    {
      id: "tmobile",
      name: "T-Mobile (Amerika Serikat)",
      country: "USA",
      regionCode: "LL/A",
      officialPortal: "https://www.t-mobile.com/support/devices/unlock-your-mobile-wireless-device",
      freePolicy: "Gratis melalui akun T-Mobile atau Device Unlock App",
      turnaroundTime: "Instan - 2 Hari",
      requirements: ["Aktif minimal 40 hari di jaringan T-Mobile", "IMEI Clean"]
    },
    {
      id: "verizon",
      name: "Verizon (Amerika Serikat)",
      country: "USA",
      regionCode: "LL/A",
      officialPortal: "https://www.verizon.com/support/device-unlocking-policy/",
      freePolicy: "Terbuka OTOMATIS setelah 60 hari sejak aktivasi pembelian",
      turnaroundTime: "Otomatis (Auto-Unlock)",
      requirements: ["Tidak ada tindakan manual diperlukan setelah 60 hari"]
    },
    {
      id: "docomo",
      name: "NTT Docomo (Jepang)",
      country: "Jepang",
      regionCode: "J/A",
      officialPortal: "https://www.docomo.ne.jp/support/procedure/simcard/unlock_d/",
      freePolicy: "Bisa diajukan gratis lewat My docomo online untuk pembeli/non-pembeli",
      turnaroundTime: "Instan",
      requirements: ["Dibuat setelah Mei 2015", "100 hari setelah pembelian / lunas"]
    },
    {
      id: "softbank",
      name: "SoftBank (Jepang)",
      country: "Jepang",
      regionCode: "J/A",
      officialPortal: "https://www.softbank.jp/mobile/support/usim/unlock_procedure/",
      freePolicy: "Gratis online via My SoftBank",
      turnaroundTime: "Instan",
      requirements: ["Nomor IMEI", "Tidak ada tunggakan jaringan"]
    },
    {
      id: "au-kddi",
      name: "AU KDDI (Jepang)",
      country: "Jepang",
      regionCode: "J/A",
      officialPortal: "https://www.au.com/support/service/mobile/procedure/simcard/unlock/",
      freePolicy: "Gratis online di portal My au",
      turnaroundTime: "Instan",
      requirements: ["IMEI Clean", "Perangkat kompatibel"]
    },
    {
      id: "ee-uk",
      name: "EE (Inggris / UK)",
      country: "United Kingdom",
      regionCode: "B/A",
      officialPortal: "https://ee.co.uk/help/help-new/getting-started-and-upgrading/unlock-your-phone/unlock-a-ee-device",
      freePolicy: "Gratis untuk semua perangkat setelah kontrak 6 bulan",
      turnaroundTime: "1 - 3 Hari",
      requirements: ["IMEI UK", "Perangkat tidak di-blacklist"]
    },
    {
      id: "vodafone-uk",
      name: "Vodafone UK",
      country: "United Kingdom",
      regionCode: "B/A",
      officialPortal: "https://www.vodafone.co.uk/mobile/unlock-code-request",
      freePolicy: "Gratis mengajukan Network Unlock Code (NUC)",
      turnaroundTime: "48 Jam",
      requirements: ["IMEI 15 digit", "Formulir online NUC"]
    }
  ];

  res.json({ success: true, carriers });
});

// Setup Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OmniUnlock Pro Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

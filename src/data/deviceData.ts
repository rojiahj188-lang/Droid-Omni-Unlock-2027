import { CarrierInfo, DeviceInfo } from '../types';

export const POPULAR_DEVICES: DeviceInfo[] = [
  {
    id: 'dev-1',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max 256GB',
    osType: 'iOS',
    osVersion: 'iOS 17.5.1',
    regionCode: 'LL/A',
    regionCountry: 'Amerika Serikat (USA)',
    imei1: '358249102938471',
    imei2: '358249102938489',
    serialNumber: 'MQ0W3LL/A',
    carrierLock: true,
    carrierName: 'AT&T USA',
    imeiStatus: 'Blocked_Kemenperin',
    activationLock: false,
    screenLocked: false,
    batteryHealth: 91
  },
  {
    id: 'dev-2',
    brand: 'Apple',
    model: 'iPhone 13 128GB',
    osType: 'iOS',
    osVersion: 'iOS 16.6',
    regionCode: 'J/A',
    regionCountry: 'Jepang (Japan)',
    imei1: '354921098234190',
    imei2: '354921098234208',
    serialNumber: 'MLNC3J/A',
    carrierLock: false,
    carrierName: 'NTT Docomo (Unlocked)',
    imeiStatus: 'Blocked_Kemenperin',
    activationLock: false,
    screenLocked: false,
    batteryHealth: 87
  },
  {
    id: 'dev-3',
    brand: 'Apple',
    model: 'iPhone 15 Pro 128GB',
    osType: 'iOS',
    osVersion: 'iOS 17.4',
    regionCode: 'ZA/A',
    regionCountry: 'Hong Kong / Singapore (Dual Physical SIM)',
    imei1: '357194019283746',
    imei2: '357194019283753',
    serialNumber: 'MTV13ZA/A',
    carrierLock: false,
    carrierName: 'Factory Unlocked',
    imeiStatus: 'Clean',
    activationLock: true,
    screenLocked: true,
    batteryHealth: 98
  },
  {
    id: 'dev-4',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra 5G',
    osType: 'Android',
    osVersion: 'Android 14 (One UI 6.1)',
    regionCode: 'SC-52D',
    regionCountry: 'Jepang (NTT Docomo)',
    imei1: '352940192837461',
    serialNumber: 'R5CW10ABCDE',
    carrierLock: true,
    carrierName: 'NTT Docomo',
    imeiStatus: 'Blocked_Kemenperin',
    activationLock: false,
    screenLocked: false,
    batteryHealth: 94
  },
  {
    id: 'dev-5',
    brand: 'Google',
    model: 'Pixel 8 Pro 128GB',
    osType: 'Android',
    osVersion: 'Android 15',
    regionCode: 'GC3VE',
    regionCountry: 'Jepang / USA Global',
    imei1: '351982049283719',
    serialNumber: '38191FDH3001',
    carrierLock: false,
    carrierName: 'Google Fi / Unlocked',
    imeiStatus: 'Clean',
    activationLock: true,
    screenLocked: true,
    batteryHealth: 96
  }
];

export const REGION_CODES: Record<string, { country: string; flag: string; notes: string }> = {
  'LL/A': { country: 'Amerika Serikat (USA)', flag: '🇺🇸', notes: 'eSIM only mulai iPhone 14 ke atas, 5G mmWave' },
  'J/A': { country: 'Jepang (Japan)', flag: '🇯🇵', notes: 'Dahulu shutter kamera berbunyi, bisa di-unlock bebas bea carrier' },
  'ZA/A': { country: 'Hong Kong / Macau', flag: '🇭🇰', notes: 'Dual Slot Nano-SIM Fisik (tanpa eSIM)' },
  'ZP/A': { country: 'Singapura (Singapore)', flag: '🇸🇬', notes: 'Model resmi Asia Tenggara, 1 Nano-SIM + eSIM' },
  'X/A': { country: 'Australia', flag: '🇦🇺', notes: 'Model Australia / Selandia Baru' },
  'B/A': { country: 'Inggris (UK)', flag: '🇬🇧', notes: 'Model Britania Raya' },
  'FD/A': { country: 'Swiss / Austria / Liechtenstein', flag: '🇨🇭', notes: 'Model Eropa Tengah' },
  'KH/A': { country: 'Korea Selatan', flag: '🇰🇷', notes: 'Model Korea, regulasi kamera' },
  'CH/A': { country: 'China Mainland', flag: '🇨🇳', notes: 'Dual Physical SIM, FaceTime Audio dinonaktifkan pabrik' },
  'ID/A': { country: 'Indonesia (Resmi iBox/Digimap)', flag: '🇮🇩', notes: 'IMEI Terdaftar resmi di Kemenperin otomatis' },
  'PA/A': { country: 'Indonesia (Model Lama Resmi)', flag: '🇮🇩', notes: 'IMEI Terdaftar resmi distributor resmi' }
};

export const CARRIER_DIRECTORY: CarrierInfo[] = [
  {
    id: 'att',
    name: 'AT&T Mobility',
    country: 'Amerika Serikat (USA)',
    regionCode: 'LL/A',
    officialPortal: 'https://www.att.com/deviceunlock/',
    freePolicy: '100% Bebas biaya jika kontrak telah lunas dan tidak masuk daftar hilang.',
    turnaroundTime: '24 - 48 Jam Kerja',
    requirements: [
      'Nomor IMEI 15 digit',
      'Perangkat tidak memiliki tagihan tertunggak',
      'Perangkat tidak dilaporkan hilang atau dicuri (Clean Status)'
    ]
  },
  {
    id: 'tmobile',
    name: 'T-Mobile USA',
    country: 'Amerika Serikat (USA)',
    regionCode: 'LL/A',
    officialPortal: 'https://www.t-mobile.com/support/devices/unlock-your-mobile-wireless-device',
    freePolicy: 'Gratis setelah pemakaian 40 hari pada jaringan prabayar/pascabayar.',
    turnaroundTime: 'Instan - 48 Jam',
    requirements: [
      'Perangkat telah lunas sepenuhnya',
      'IMEI terdaftar di database T-Mobile',
      'Akun dalam posisi baik'
    ]
  },
  {
    id: 'verizon',
    name: 'Verizon Wireless',
    country: 'Amerika Serikat (USA)',
    regionCode: 'LL/A',
    officialPortal: 'https://www.verizon.com/support/device-unlocking-policy/',
    freePolicy: 'Terbuka OTOMATIS setelah 60 hari sejak tanggal pembelian awal.',
    turnaroundTime: 'Otomatis (60 Hari)',
    requirements: [
      'Tidak perlu mengajukan permohonan jika sudah melewati 60 hari',
      'Cukup sambungkan ke Wi-Fi dan masukkan SIM lokal'
    ]
  },
  {
    id: 'docomo',
    name: 'NTT Docomo Japan',
    country: 'Jepang',
    regionCode: 'J/A',
    officialPortal: 'https://www.docomo.ne.jp/support/procedure/simcard/unlock_d/',
    freePolicy: 'Bebas biaya melalui portal My Docomo untuk perangkat rilisan Mei 2015 ke atas.',
    turnaroundTime: 'Instan (Real-time)',
    requirements: [
      'Akun d-Account (Gratis didaftarkan)',
      'Nomor IMEI ponsel Docomo',
      'Telah melewati 100 hari atau dibayar lunas'
    ]
  },
  {
    id: 'softbank',
    name: 'SoftBank Japan',
    country: 'Jepang',
    regionCode: 'J/A',
    officialPortal: 'https://www.softbank.jp/mobile/support/usim/unlock_procedure/',
    freePolicy: 'Bebas biaya melalui website resmi My SoftBank.',
    turnaroundTime: 'Instan (Real-time)',
    requirements: [
      'Akun My SoftBank',
      'IMEI valid perangkat SoftBank',
      'Status jaringan bersih'
    ]
  },
  {
    id: 'au-kddi',
    name: 'AU by KDDI',
    country: 'Jepang',
    regionCode: 'J/A',
    officialPortal: 'https://www.au.com/support/service/mobile/procedure/simcard/unlock/',
    freePolicy: 'Bebas biaya via portal My au online.',
    turnaroundTime: 'Instan (Real-time)',
    requirements: [
      'au ID login',
      'IMEI perangkat',
      'Syarat 100 hari terpenuhi'
    ]
  },
  {
    id: 'ee-uk',
    name: 'EE UK',
    country: 'Inggris (UK)',
    regionCode: 'B/A',
    officialPortal: 'https://ee.co.uk/help/help-new/getting-started-and-upgrading/unlock-your-phone/unlock-a-ee-device',
    freePolicy: 'Bebas biaya bagi pelanggan setelah masa kontrak awal 6 bulan.',
    turnaroundTime: '1 - 3 Hari',
    requirements: [
      'IMEI ponsel UK',
      'Formulir Device Unlock EE'
    ]
  }
];

export const INDONESIAN_OPERATOR_APNS = [
  {
    operator: 'Telkomsel (Halo, by.U, SimPATI)',
    apn: 'internet',
    username: '',
    password: '',
    mmsApn: 'mms',
    mmsc: 'http://mms.telkomsel.com'
  },
  {
    operator: 'Indosat Ooredoo Hutchison (IM3, Tri)',
    apn: 'indosatgprs',
    username: 'indosat',
    password: 'indosat',
    mmsApn: 'indosatmms',
    mmsc: 'http://mmsc.indosat.com'
  },
  {
    operator: 'XL Axiata & AXIS',
    apn: 'internet',
    username: '',
    password: '',
    mmsApn: 'xlmms',
    mmsc: 'http://mms.xl.net.id'
  },
  {
    operator: 'Smartfren 4G / 5G',
    apn: 'smartfren4g',
    username: 'smartfren',
    password: 'smartfren',
    mmsApn: '',
    mmsc: ''
  }
];

export const RSIM_MODES = [
  {
    mode: 'TMSI 5G Auto',
    desc: 'Metode bypass paling stabil untuk iPhone 12, 13, 14, 15, 16. Memanfaatkan sinyal baseband 5G lokal.',
    stability: '98% Stabil',
    simCompatibility: 'Telkomsel, Indosat, XL'
  },
  {
    mode: 'eSIM QPE / IPMCC',
    desc: 'Solusi iPhone inter US (eSIM only). Menggunakan virtual profile helper untuk bypass eSIM carrier lock.',
    stability: '95% Stabil',
    simCompatibility: 'Semua Operator eSIM RI'
  },
  {
    mode: 'ICCID Perfect Unlock',
    desc: 'Hanya aktif ketika Apple membuka celah aktivasi ICCID server. Saat aktif, ponsel menjadi semi-factory unlocked!',
    stability: '100% (Ketika Server Aktif)',
    simCompatibility: 'Semua Operator Global'
  }
];

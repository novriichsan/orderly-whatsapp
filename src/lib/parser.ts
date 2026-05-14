import { PRODUCTS } from "./mock-data";

export interface ParsedMessage {
  productId?: string;
  productName?: string;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  area?: number;
  date?: string;
  time?: string;
  customerName?: string;
  address?: string;
  raw: string;
}

const monthMap: Record<string, number> = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
};

function findField(text: string, key: string): string | undefined {
  const re = new RegExp(`${key}\\s*:\\s*(.+)`, "i");
  const m = text.match(re);
  return m?.[1]?.trim();
}

export function parseWhatsAppMessage(text: string): ParsedMessage {
  const result: ParsedMessage = { raw: text };

  const layanan = findField(text, "Layanan");
  const kategori = findField(text, "Kategori");
  const sub = findField(text, "Sub-?Kategori");
  const luas = findField(text, "Luas");
  const tanggal = findField(text, "Tanggal");
  const waktu = findField(text, "Waktu");
  const nama = findField(text, "Nama");
  const alamat = findField(text, "Alamat");

  if (layanan) {
    const product = PRODUCTS.find(
      (p) => p.name.toLowerCase() === layanan.toLowerCase() ||
              layanan.toLowerCase().includes(p.name.toLowerCase()),
    );
    if (product) {
      result.productId = product.id;
      result.productName = product.name;

      if (kategori) {
        const c = product.categories.find(
          (c) => c.name.toLowerCase() === kategori.toLowerCase(),
        );
        if (c) {
          result.categoryId = c.id;
          result.categoryName = c.name;
          if (sub) {
            const s = c.subcategories.find(
              (s) => s.name.toLowerCase() === sub.toLowerCase(),
            );
            if (s) {
              result.subcategoryId = s.id;
              result.subcategoryName = s.name;
            }
          }
        }
      }
    }
  }

  if (luas) {
    const m = luas.match(/(\d+(?:[.,]\d+)?)/);
    if (m) result.area = parseFloat(m[1].replace(",", "."));
  }

  if (tanggal) {
    const m = tanggal.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (m) {
      const day = parseInt(m[1]);
      const month = monthMap[m[2].toLowerCase()];
      const year = parseInt(m[3]);
      if (month !== undefined) {
        result.date = new Date(year, month, day).toISOString();
      }
    }
  }

  if (waktu) {
    const m = waktu.match(/(\d{1,2}[:.]\d{2})/);
    if (m) result.time = m[1].replace(".", ":");
  }

  if (nama) result.customerName = nama;
  if (alamat) result.address = alamat;

  return result;
}

export const SAMPLE_MESSAGE = `Halo, saya ingin memesan layanan:
Layanan: SPALD-T
Kategori: Rumah Tangga
Sub-Kategori: Daya Listrik 1.300 Watt
Luas: 1 m²
Tanggal: Jumat, 15 Mei 2026
Waktu: 12:00

Estimasi Harga:
• Biaya Sekali Bayar: Rp 11.100 (termasuk PPN 11%)
• Biaya Bulanan: Rp 262 (termasuk PPN 11%)

Nama: Ligar Aji Pandika
Alamat: sequis center

Mohon informasi lebih lanjut. Terima kasih.`;

import type { Product, Subcategory, PriceBreakdown } from "./types";

export const PPN_RATE = 0.11;

export function calculatePrice(
  product: Product,
  sub: Subcategory,
  area?: number,
): PriceBreakdown {
  const oneTimeSubtotal = sub.oneTimeFee;
  const oneTimePpn = Math.round(oneTimeSubtotal * PPN_RATE);
  const oneTimeTotal = oneTimeSubtotal + oneTimePpn;

  const usesArea = product.requiresArea && area && area > 0;
  const monthlySubtotal = usesArea ? Math.round(sub.monthlyFee * area!) : sub.monthlyFee;
  const monthlyPpn = Math.round(monthlySubtotal * PPN_RATE);
  const monthlyTotal = monthlySubtotal + monthlyPpn;

  return {
    oneTimeSubtotal,
    oneTimePpn,
    oneTimeTotal,
    monthlySubtotal,
    monthlyPpn,
    monthlyTotal,
    hasPipingNote: product.id === "perpipaan",
  };
}

export const formatIDR = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");

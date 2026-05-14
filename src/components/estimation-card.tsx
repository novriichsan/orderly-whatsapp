import { formatIDR } from "@/lib/pricing";
import type { PriceBreakdown } from "@/lib/types";

interface Props {
  price: PriceBreakdown;
  subcategoryName: string;
  area?: number;
  perAreaRate?: number;
  oneTimeLineLabel?: string;
}

export function EstimationCard({
  price,
  subcategoryName,
  area,
  perAreaRate,
  oneTimeLineLabel,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="grad-primary px-4 py-3 text-primary-foreground">
        <p className="text-[10px] uppercase tracking-wider opacity-80">Estimasi Harga</p>
        <p className="text-base font-semibold">{subcategoryName}</p>
      </div>

      {price.oneTimeSubtotal > 0 && (
        <div className="border-b border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground">Biaya Sekali Bayar</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {oneTimeLineLabel ?? `Biaya ${subcategoryName}`}
          </p>
          <Line label="Biaya Tetap per Unit" value={formatIDR(price.oneTimeSubtotal)} />
          <Line label="Subtotal" value={formatIDR(price.oneTimeSubtotal)} />
          <Line label="PPN (11%)" value={formatIDR(price.oneTimePpn)} />
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-2">
            <span className="text-xs font-semibold">Total Biaya Sekali Bayar</span>
            <span className="text-sm font-bold text-primary">{formatIDR(price.oneTimeTotal)}</span>
          </div>
        </div>
      )}

      {price.monthlySubtotal > 0 && (
        <div className="p-4">
          <p className="text-xs font-semibold text-muted-foreground">Biaya Bulanan</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Tarif Bulanan {subcategoryName}
          </p>
          {area && perAreaRate ? (
            <Line
              label={`${area} m² × ${formatIDR(perAreaRate)}/bulan`}
              value={formatIDR(price.monthlySubtotal)}
            />
          ) : (
            <Line label="Tarif Tetap" value={formatIDR(price.monthlySubtotal)} />
          )}
          <Line label="Subtotal" value={formatIDR(price.monthlySubtotal)} />
          <Line label="PPN (11%)" value={formatIDR(price.monthlyPpn)} />
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-2">
            <span className="text-xs font-semibold">Total Biaya / Bulan</span>
            <span className="text-sm font-bold text-primary">{formatIDR(price.monthlyTotal)}</span>
          </div>
        </div>
      )}

      <div className="space-y-1 bg-muted/40 px-4 py-3 text-[10px] text-muted-foreground">
        {price.hasPipingNote && (
          <p>• Akan ada tambahan biaya sebesar 15% tergantung dari panjang pipa penyambungan.</p>
        )}
        <p>• Harga adalah estimasi dan dapat berubah sesuai kondisi di lapangan.</p>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-1 flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

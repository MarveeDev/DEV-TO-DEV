export const SUPPORTED_CURRENCIES = ["USD", "GHS"] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export function formatPrice(
  price: number | string | null | undefined,
  currency?: string | null
): string {
  const amount = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(amount)) return "";

  const code =
    currency && (SUPPORTED_CURRENCIES as readonly string[]).includes(currency)
      ? currency
      : "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toFixed(2)}`;
  }
}

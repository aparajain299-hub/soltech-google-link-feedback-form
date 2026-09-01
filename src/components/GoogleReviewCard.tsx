import { Star } from "lucide-react";

export const GOOGLE_REVIEW_URL =
  "https://g.page/r/CRsHxPAzD2diEBM/review";

const STARS = [0, 1, 2, 3, 4];

export function GoogleReviewCard() {
  return (
    <div className="space-y-7">
      {/* Google Reviews Card */}
      <section className="rounded-2xl border border-border bg-secondary/40 px-5 py-6 text-center shadow-[var(--shadow-soft)] sm:px-7">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Google Reviews
        </h2>

        {/* Five Stars */}
        <div
          className="mt-3 flex items-center justify-center gap-1.5"
          aria-hidden="true"
        >
          {STARS.map((i) => (
            <Star
              key={i}
              className="size-7 text-accent sm:size-8"
              fill="currentColor"
              strokeWidth={1.5}
            />
          ))}
        </div>

        <span className="sr-only">
          Five star rating illustration
        </span>

        {/* Google Review Button */}
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl",
            "bg-primary px-5 text-base font-semibold text-primary-foreground",
            "shadow-[var(--shadow-card)] transition-all duration-200",
            "cursor-pointer hover:-translate-y-0.5 hover:bg-primary/90",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background outline-none",
          ].join(" ")}
        >
          Review us on Google
        </a>
      </section>

      {/* Compact QR Section */}
      <div className="flex items-center justify-between gap-5 rounded-2xl border border-border bg-secondary/20 px-5 py-4">
        {/* Left Side */}
        <div className="min-w-0 text-left">
          <p className="text-base font-medium text-foreground">
            Prefer to scan?
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Scan to review us on Google
          </p>
        </div>

        {/* Right Side - Official Google QR Code */}
        <div className="flex shrink-0 items-center justify-center rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
          <img
            src="/google-review-qr.png"
            alt="Scan to review Soltech Energy on Google"
            className="size-20 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

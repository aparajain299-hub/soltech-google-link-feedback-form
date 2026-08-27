import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";

import logoAsset from "@/assets/soltech-logo.png.asset.json";
import { GoogleReviewCard } from "@/components/GoogleReviewCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Review Soltech Energy on Google" },
      {
        name: "description",
        content:
          "Loved working with Soltech Energy? Share your experience on Google in a few taps — tap the button or scan the QR code.",
      },
      { property: "og:title", content: "Review Soltech Energy on Google" },
      {
        property: "og:description",
        content: "Your experience matters to us. Share it with a Google review.",
      },
    ],
  }),
  component: ReviewPage,
});

function handleClose() {
  if (typeof window === "undefined") return;
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.close();
}

function ReviewPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:py-14">
      <section className="w-full max-w-md">
        <div className="card-elevated relative overflow-hidden">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <header className="flex flex-col items-center px-6 pt-9 pb-6 text-center sm:px-8">
            <img
              src="/soltech-logo.png" alt="Soltech Energy"
              width={512}
              height={512}
              className="size-14 object-contain"
            />
            <h1 className="mt-4 text-2xl font-semibold text-foreground">Share Your Experience</h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your experience matters to us. We'd love to hear about your experience with Soltech
              Energy.
            </p>
          </header>

          <div className="px-6 pb-8 sm:px-8">
            <GoogleReviewCard />
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Soltech Energy · Powering homes with clean solar
        </p>
      </section>
    </main>
  );
}

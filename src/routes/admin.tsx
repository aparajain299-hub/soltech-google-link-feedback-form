import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut, Star } from "lucide-react";
import { useMemo, useState } from "react";

import logoAsset from "@/assets/soltech-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminLogin,
  adminLogout,
  getAdminFeedback,
  type FeedbackRow,
} from "@/lib/feedback.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Feedback Dashboard — Soltech Energy" },
      { name: "description", content: "Internal Soltech Energy customer feedback dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Feedback Dashboard — Soltech Energy" },
      { property: "og:description", content: "Internal Soltech Energy feedback dashboard." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const fetchFeedback = useServerFn(getAdminFeedback);
  const query = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: () => fetchFeedback(),
  });

  if (query.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (query.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-destructive">Could not load the dashboard. Please refresh.</p>
      </main>
    );
  }

  if (query.data?.locked) return <AdminLogin />;

  return <Dashboard feedback={query.data?.feedback ?? []} />;
}

function AdminLogin() {
  const queryClient = useQueryClient();
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (value: string) => login({ data: { password: value } }),
    onSuccess: async (result) => {
      if (!result.ok) {
        setError("That password isn't right.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
    },
    onError: () => setError("Something went wrong. Please try again."),
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          mutation.mutate(password);
        }}
        className="card-elevated w-full max-w-sm space-y-5 px-7 py-8"
      >
        <div className="flex flex-col items-center text-center">
          <img src={logoAsset.url} alt="Soltech Energy" width={512} height={512} className="size-11" />
          <h1 className="mt-3 text-xl font-semibold">Feedback Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to continue.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={mutation.isPending || !password}
          className="h-11 w-full rounded-xl"
        >
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </main>
  );
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function Dashboard({ feedback }: { feedback: FeedbackRow[] }) {
  const queryClient = useQueryClient();
  const logout = useServerFn(adminLogout);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const stats = useMemo(() => {
    const counts = [1, 2, 3, 4, 5].map(
      (star) => feedback.filter((f) => f.overall_rating === star).length,
    );
    return {
      total: feedback.length,
      overall: average(feedback.map((f) => f.overall_rating)),
      service: average(feedback.map((f) => f.service_rating)),
      counts,
    };
  }, [feedback]);

  const rows = useMemo(() => {
    const filtered =
      ratingFilter === "all"
        ? feedback
        : feedback.filter((f) => f.overall_rating === ratingFilter);
    return [...filtered].sort((a, b) => {
      const diff = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      return sort === "newest" ? -diff : diff;
    });
  }, [feedback, ratingFilter, sort]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Soltech Energy" width={512} height={512} className="size-9" />
          <div>
            <h1 className="text-xl font-semibold">Feedback Dashboard</h1>
            <p className="text-sm text-muted-foreground">Soltech Energy customer responses</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={async () => {
            await logout();
            await queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
          }}
        >
          <LogOut className="size-4" /> Sign out
        </Button>
      </header>

      <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Total responses" value={String(stats.total)} />
        <StatCard label="Avg. overall rating" value={stats.overall.toFixed(2)} />
        <StatCard label="Avg. service rating" value={stats.service.toFixed(2)} />
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[5, 4, 3, 2, 1].map((star) => (
          <StatCard
            key={star}
            label={`${star}-star responses`}
            value={String(stats.counts[star - 1])}
          />
        ))}
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          {(["all", 5, 4, 3, 2, 1] as const).map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => setRatingFilter(option)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                ratingFilter === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {option === "all" ? "All" : `${option}★`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
            className="ml-auto rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-secondary"
          >
            Sort: {sort === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {rows.length === 0 ? (
            <div className="card-elevated px-6 py-12 text-center text-sm text-muted-foreground">
              {feedback.length === 0
                ? "No feedback has been submitted yet."
                : "No responses match this filter."}
            </div>
          ) : (
            rows.map((row) => (
              <article key={row.id} className="card-elevated px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-5">
                    <RatingPill label="Overall" value={row.overall_rating} />
                    <RatingPill label="Service" value={row.service_rating} />
                  </div>
                  <time
                    dateTime={row.submitted_at}
                    className="text-xs text-muted-foreground tabular-nums"
                  >
                    {new Date(row.submitted_at).toLocaleString()}
                  </time>
                </div>
                {row.written_feedback ? (
                  <p className="mt-3 text-sm whitespace-pre-wrap text-foreground">
                    {row.written_feedback}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground italic">No written feedback</p>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-elevated px-4 py-4">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function RatingPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={`size-3.5 ${star <= value ? "text-accent" : "text-border"}`}
            fill={star <= value ? "currentColor" : "transparent"}
          />
        ))}
      </span>
    </span>
  );
}

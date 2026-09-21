"use client";

import { useState } from "react";

export function ReplaceDressUpButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/replace-dress-up-catalog", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        deleted?: number;
        created?: number;
        updated?: number;
        total?: number;
      };
      if (!res.ok) {
        setMessage(data.error ?? "Update failed");
        return;
      }
      setMessage(
        `Done — removed ${data.deleted ?? 0} old Playhop games, published ${data.created ?? 0} new and updated ${data.updated ?? 0} (Gamerdam ${data.total ?? 0}).`
      );
    } catch {
      setMessage("Update failed — network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Updating live catalog…" : "Replace old dress-up games"}
      </button>
      {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}
    </div>
  );
}

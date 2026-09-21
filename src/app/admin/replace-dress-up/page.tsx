import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { ReplaceDressUpButton } from "./replace-dress-up-button";

export default async function ReplaceDressUpPage() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, PERMISSIONS.GAMES_DELETE)) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Replace dress-up catalog</h1>
      <p className="text-sm text-[var(--color-muted)]">
        Deletes the old Playhop / Yandex dress-up games and publishes the Gamerdam girls
        set with original <code>o.gamerdam.com</code> iframes.
      </p>
      <ReplaceDressUpButton />
    </div>
  );
}

import { dataProvider } from "@/lib/data-provider";
import AccountQueue from "./components/AccountQueue";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Today&apos;s priorities
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Review your highest-potential accounts, update statuses, and generate
          tailored outreach in minutes.
        </p>
      </div>
      <AccountQueue companies={dataProvider.getCompanies()} />
    </div>
  );
}

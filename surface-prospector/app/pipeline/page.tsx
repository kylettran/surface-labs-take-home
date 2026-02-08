import { dataProvider } from "@/lib/data-provider";
import PipelineBoard from "@/app/components/PipelineBoard";

export const dynamic = "force-dynamic";

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Pipeline</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Drag accounts through the pipeline and track weekly performance.
        </p>
      </div>
      <PipelineBoard companies={dataProvider.getCompanies()} />
    </div>
  );
}
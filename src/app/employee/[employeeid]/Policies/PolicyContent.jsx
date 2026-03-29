import { policySegments } from "./policies-data";

export default function PolicyContent({ policyKey }) {
  const policy = policySegments.find((segment) => segment.key === policyKey) || policySegments[0];

  return (
    <div className="bg-background">
      <div className="space-y-4 md:space-y-6 pb-8 md:pb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Policies</h1>
          <p className="mt-1.5 md:mt-2 text-xs md:text-base text-muted-foreground">
            Professional policy details and compliance guidance
          </p>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
            <span className="rounded-full bg-[#1C225B]/10 px-2.5 md:px-3 py-1 text-[11px] md:text-xs font-semibold text-[#1C225B] dark:text-blue-300">
              {policy.policyId}
            </span>
            <span className="rounded-full bg-muted px-2.5 md:px-3 py-1 text-[11px] md:text-xs font-medium text-muted-foreground">
              Effective: {policy.effectiveDate}
            </span>
            <span className="rounded-full bg-muted px-2.5 md:px-3 py-1 text-[11px] md:text-xs font-medium text-muted-foreground">
              Review: {policy.reviewCycle}
            </span>
          </div>

          <h2 className="text-base md:text-xl font-semibold text-foreground leading-snug">{policy.title}</h2>

          <div className="mt-4 space-y-4 md:space-y-5 text-sm md:text-base">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Purpose</h3>
              <p className="mt-1 text-foreground/90 leading-relaxed">{policy.purpose}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Scope</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-foreground/90 leading-relaxed">
                {policy.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Key Guidelines</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-foreground/90 leading-relaxed">
                {policy.keyGuidelines.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {policy.approvalWorkflow && (
              <div>
                <h3 className="text-sm font-semibold text-foreground">Approval Workflow</h3>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-foreground/90 leading-relaxed">
                  {policy.approvalWorkflow.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {policy.managerResponsibilities && (
              <div>
                <h3 className="text-sm font-semibold text-foreground">Manager Responsibilities</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-foreground/90 leading-relaxed">
                  {policy.managerResponsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3 text-sm text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
              <span className="font-semibold">Non-Compliance:</span> {policy.nonCompliance}
            </div>

            <p className="text-xs text-muted-foreground">
              Policy Owner: <span className="font-medium text-foreground/90">{policy.owner}</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

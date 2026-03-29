import Link from "next/link";
import { policySegments } from "./policies-data";

export default function PoliciesPage({ params }) {
  const employeeid = params?.employeeid;

  return (
    <div className="bg-background">
      <div className="space-y-4 md:space-y-6 pb-8 md:pb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Policies</h1>
          <p className="mt-1.5 md:mt-2 text-xs md:text-base text-muted-foreground">
            Choose a policy below or from the sidebar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {policySegments.map((segment) => (
            <Link
              key={segment.key}
              href={`/employee/${employeeid}/Policies/${segment.key}`}
              className="rounded-xl border border-border bg-card p-3.5 md:p-4 text-sm font-semibold leading-snug text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              {segment.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

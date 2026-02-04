"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* ---------------- PAGE LABELS ---------------- */
const pageNameMap = {
  hr: "HR",
  employeeDetails: "Employees",
  attendance: "Attendance",
};

/* ---------------- HELPERS ---------------- */
const isHrId = (segment) => segment.startsWith("hr");

export function HRBreadcrumb() {
  const pathname = usePathname();

  // split path → ["hr", "hr1", "employeeDetails"]
  const paths = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          // ❌ Hide HR ID (hr1, hr2, etc.)
          if (isHrId(path)) return null;

          const href = "/" + paths.slice(0, index + 1).join("/");
          const isLast = index === paths.length - 1;

          // Dashboard when path is /hr/:id
          const label =
            path === "hr" && paths.length === 2
              ? "Dashboard"
              : pageNameMap[path] ?? path;

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

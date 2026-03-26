import { Card } from "@/components/ui/card";

export function PageWrapper({ children, title, className = "" }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
      )}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
}

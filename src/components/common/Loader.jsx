import { Spinner } from "@/components/ui/spinner";

export function Loader({ className = "h-8 w-8" }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner className={className} />
    </div>
  );
}

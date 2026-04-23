import { cn } from "@/lib/utils";

export const StatCard = ({
  value,
  label,
  sublabel,
  className,
}: {
  value: string;
  label: string;
  sublabel?: string;
  className?: string;
}) => (
  <div className={cn("nature-card p-6 md:p-8 bg-leaf", className)}>
    <div className="font-serif text-4xl md:text-5xl text-primary leading-none">{value}</div>
    <div className="mt-3 text-sm font-semibold text-foreground">{label}</div>
    {sublabel && <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div>}
  </div>
);

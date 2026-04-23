import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type Job = {
  id: string;
  title: string;
  category: "Field" | "Research" | "NGO";
  location: string;
  type: string;
  summary: string;
  mission: string;
};

const categoryStyles: Record<Job["category"], string> = {
  Field: "bg-accent-soft text-primary border-accent/30",
  Research: "bg-secondary text-secondary-foreground border-primary/15",
  NGO: "bg-earth-soft text-earth border-earth/30",
};

export const JobCard = ({ job }: { job: Job }) => (
  <Link
    to={`/opportunities/${job.id}`}
    className="nature-card group p-6 md:p-7 flex flex-col gap-5 hover:border-accent/40"
  >
    <div className="flex items-start justify-between gap-3">
      <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border", categoryStyles[job.category])}>
        {job.category}
      </span>
      <span className="h-9 w-9 rounded-full grid place-items-center bg-secondary text-primary group-hover:bg-canopy group-hover:text-primary-foreground transition-smooth">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
    <div>
      <h3 className="font-serif text-2xl text-foreground leading-tight">{job.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{job.summary}</p>
    </div>
    <div className="mt-auto flex flex-wrap gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60">
      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
    </div>
  </Link>
);
